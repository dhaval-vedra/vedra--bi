import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { spawn } from "child_process";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Ensure tmp directory exists
const tmpDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// 1. Endpoint to upload large dataset
app.post("/api/upload-large-data", (req, res) => {
  try {
    const { userId, rawData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    if (!rawData || !Array.isArray(rawData)) {
      return res.status(400).json({ error: "Missing rawData array" });
    }

    const dataPath = path.join(tmpDir, `rawData_${userId}.json`);
    fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), "utf-8");

    res.json({ success: true, message: `Dataset of ${rawData.length} rows cached on server.`, path: dataPath });
  } catch (error: any) {
    console.error("Error in upload-large-data:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Endpoint to filter data using Python filter_engine.py
app.post("/api/filter-large-data", (req, res) => {
  try {
    const { userId, filterState, rawData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const rawDataPath = path.join(tmpDir, `rawData_${userId}.json`);
    
    // If the frontend also sent rawData inline (optional), write/overwrite it
    if (rawData && Array.isArray(rawData)) {
      fs.writeFileSync(rawDataPath, JSON.stringify(rawData, null, 2), "utf-8");
    } else if (!fs.existsSync(rawDataPath)) {
      return res.status(404).json({ error: "No cached data found for this user. Please upload the data first." });
    }

    // Save the filter state JSON to disk
    const filterStatePath = path.join(tmpDir, `filterState_${userId}.json`);
    fs.writeFileSync(filterStatePath, JSON.stringify(filterState || {}, null, 2), "utf-8");

    // Output path where python will write the result
    const outputPath = path.join(tmpDir, `output_${userId}.json`);

    // Run Python script
    const pythonProcess = spawn("python3", [
      path.join(process.cwd(), "backend", "filter_engine.py"),
      rawDataPath,
      filterStatePath,
      outputPath
    ]);

    let stderrData = "";
    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python engine error:", stderrData);
        return res.status(500).json({ error: "Python filter execution failed", details: stderrData });
      }

      try {
        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({ error: "Python did not generate any output file" });
        }

        const filteredResultRaw = fs.readFileSync(outputPath, "utf-8");
        const filteredResult = JSON.parse(filteredResultRaw);

        // Clean up intermediate filter state and output
        try {
          fs.unlinkSync(filterStatePath);
          fs.unlinkSync(outputPath);
        } catch (cleanupErr) {
          console.warn("Cleanup warning:", cleanupErr);
        }

        res.json({ success: true, filteredData: filteredResult });
      } catch (parseErr: any) {
        console.error("Error reading python output:", parseErr);
        res.status(500).json({ error: "Error reading python output", details: parseErr.message });
      }
    });
  } catch (error: any) {
    console.error("Error in filter-large-data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize Gemini Client Lazily
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure your GEMINI_API_KEY inside the Settings menu.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback response generator when Gemini API is rate-limited or fails
function generateFallbackReply(message: string, headers: string[]): { reply: string } {
  const msgLower = (message || "").toLowerCase();
  let reply = "";
  let actions: any[] = [];

  // Determine if it looks like a request for dashboard, chart, styling, layout, export, etc.
  const isChartQuery = ["chart", "graph", "ग्राफ", "नया चार्ट", "add chart", "visualization", "plot"].some(kw => msgLower.includes(kw)) || 
                       (["बनाओ", "बनाये", "बनाएं", "create"].some(kw => msgLower.includes(kw)) && ["चार्ट", "ग्राफ", "chart", "graph", "विजुअल"].some(kw => msgLower.includes(kw)));
  
  const isEffectQuery = ["effect", "इफ़ेक्ट", "इफेक्ट", "glam", "neon", "cyberpunk"].some(kw => msgLower.includes(kw)) ||
                        (["स्टाइल", "डिजाइन", "सजाओ", "style"].some(kw => msgLower.includes(kw)) && ["चार्ट", "कार्ड", "कलर", "theme", "color", "background", "बैकग्राउंड"].some(kw => msgLower.includes(kw)));
  
  const isDashboardQuery = ["dashboard", "डैशबोर्ड", "डेसबोर्ड", "custom dashboard"].some(kw => msgLower.includes(kw));

  const isThemeQuery = ["theme", "color", "कलर", "रंग", "थीम", "बैकग्राउंड"].some(kw => msgLower.includes(kw));

  const isLayoutQuery = ["layout", "grid", "ग्रिड", "कॉलम", "लेआउट"].some(kw => msgLower.includes(kw)) ||
                        (["साफ़", "क्लियर", "reset", "clear", "खालि"].some(kw => msgLower.includes(kw)) && ["डैशबोर्ड", "चार्ट", "dashboard", "charts"].some(kw => msgLower.includes(kw)));

  const isDataQuery = ["mock", "मॉक", "मॉक डेटा", "mock data"].some(kw => msgLower.includes(kw)) ||
                      (["डेटा", "data"].some(kw => msgLower.includes(kw)) && ["जनरेट", "लोड़", "load", "generate", "नया", "बदलो", "अपडेट", "update", "change"].some(kw => msgLower.includes(kw)));

  const isExportQuery = ["export", "डाउनलोड", "एक्सपोर्ट", "csv", "excel", "pdf table", "pdf dashboard"].some(kw => msgLower.includes(kw)) ||
                        (["रिपोर्ट", "report", "pdf", "png", "इमेज", "image"].some(kw => msgLower.includes(kw)) && ["डाउनलोड", "एक्सपोर्ट", "बनाओ", "बनाएं", "निकालो", "save", "download", "export"].some(kw => msgLower.includes(kw)));

  const isLivePollingQuery = ["live", "polling", "refresh", "interval", "रिफ्रेश", "ऑटो-अपडेट", "अपडेट करो", "सेकंड", "seconds"].some(kw => msgLower.includes(kw));

  const isTextboxQuery = ["textbox", "text box", "लिखो", "टेक्स्टबॉक्स", "कंटेंट", "content"].some(kw => msgLower.includes(kw));

  if (isDashboardQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\nलेकिन चिंता न करें! **Vedra Smart Fallback इंजन** ने आपका अनुरोध पहचान लिया है। मैंने आपके लिए एक नया मल्टी-चार्ट डैशबोर्ड तैयार करने का एक्शन सेट कर दिया है।`;
    actions.push({ "action": "clear-dashboard" });
    if (headers && headers.length >= 2) {
      actions.push({
        "action": "create-chart",
        "type": "bar",
        "title": `${headers[0]} के अनुसार ${headers[1] || 'वैल्यू'}`,
        "xAxis": headers[0],
        "yAxes": [headers[1] || headers[0]]
      });
      if (headers[2]) {
        actions.push({
          "action": "create-chart",
          "type": "line",
          "title": `${headers[0]} बनाम ${headers[2]}`,
          "xAxis": headers[0],
          "yAxes": [headers[2]]
        });
      }
    }
  } else if (isChartQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने आपके लिए चार्ट बनाने का एक्शन जनरेट किया है:`;
    if (headers && headers.length >= 2) {
      actions.push({
        "action": "create-chart",
        "type": "bar",
        "title": `चार्ट: ${headers[0]} बनाम ${headers[1]}`,
        "xAxis": headers[0],
        "yAxes": [headers[1]]
      });
    }
  } else if (isEffectQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने आपके सभी चार्ट्स पर एक सुंदर नियॉन साइबरपंक इफ़ेक्ट लागू करने का निर्णय लिया है:`;
    actions.push({
      "action": "apply-effect",
      "effectId": "effect-cyberpunk",
      "target": "all"
    });
  } else if (isThemeQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने सभी चार्ट कार्ड्स पर सुंदर ब्लू थीम लागू करने का एक्शन जनरेट किया है:`;
    actions.push({
      "action": "change-theme",
      "themeId": "blue-container-color",
      "target": "all"
    });
  } else if (isLayoutQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने आपके लिए लेआउट को 2-कॉलम ग्रिड में बदलने का एक्शन जनरेट किया है:`;
    actions.push({
      "action": "change-layout",
      "columns": 2
    });
  } else if (isDataQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने आपके लिए मॉक सेल्स डेटा लोड करने का एक्शन जनरेट किया है:`;
    actions.push({
      "action": "generate-mock-data",
      "category": "sales",
      "rowCount": 30
    });
  } else if (isExportQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने आपके लिए डैशबोर्ड को PDF फॉर्मेट में एक्सपोर्ट करने का एक्शन शुरू किया है:`;
    actions.push({
      "action": "export-dashboard",
      "format": "pdf_dash"
    });
  } else if (isLivePollingQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने 10 सेकंड के अंतराल पर लाइव अपडेट पोलिंग का एक्शन चालू किया है:`;
    actions.push({
      "action": "set-live-polling",
      "url": "https://jsonplaceholder.typicode.com/todos",
      "interval": 10
    });
  } else if (isTextboxQuery) {
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** AI मॉडल अभी व्यस्त या सीमित कोटा पर है।\n\n**Vedra Fallback Engine** ने आपके लिए एक नोट्स बॉक्स जोड़ा है:`;
    actions.push({
      "action": "create-textbox",
      "content": "Vedra BI Fallback Notes Card",
      "bgColor": "#fff3cd"
    });
  } else {
    // General fallback
    reply = `⚠️ **Gemini API कोटा सीमा समाप्त (Quota Exceeded):** निःशुल्क श्रेणी (Free Tier) के अनुरोधों की दैनिक सीमा पार हो गई है।\n\n### आप अभी भी वेदरा BI का पूरा उपयोग कर सकते हैं! 🙌\nनीचे दिए गए **एजेंट कमांड सेंटर (Agent Command Center / Pro Mode Buttons)** का सीधे उपयोग करें। ये पूरी तरह से क्लाइंट-साइड चलते हैं और इनके लिए किसी AI कॉल की आवश्यकता नहीं है:\n1. 📊 **चार्ट बनाएँ (Create Chart):** सीधे मनपसंद कॉलम और टाइप चुनें।\n2. ✨ **इफ़ेक्ट्स (Effects):** शानदार विज़ुअल इफ़ेक्ट्स लागू करें।\n3. 🎨 **कार्ड थीम (Card Theme):** कार्ड का बैकग्राउंड कलर बदलें।\n4. 📐 **ग्रिड लेआउट (Grid Layout):** ग्रिड बदलें या डैशबोर्ड रीसेट करें।\n5. 🔄 **मॉक डेटा (Mock Data):** नया डेटासेट लोड करें।\n6. ⏰ **लाइव अपडेट (Live Update):** लाइव पोलिंग शुरू करें।\n7. 📝 **टेक्स्टबॉक्स (Textbox):** कस्टमाइज्ड नोट्स बनाएं।\n8. 📤 **एक्सपोर्ट (Export):** पीडीएफ/एक्सेल डाउनलोड करें।\n\n*कृपया थोड़ी देर बाद पुनः प्रयास करें या सेटिंग से अपनी स्वयं की Gemini API Key जोड़ें।*`;
  }

  if (actions.length > 0) {
    reply += `\n\n\`\`\`json-actions\n${JSON.stringify(actions, null, 2)}\n\`\`\``;
  }

  return { reply };
}

// API routes FIRST
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, headers, dataSample, image_base64 } = req.body;

    const systemInstruction = `You are Vedra BI Assistant (वेंद्रा बीआई सहायक), a highly professional, polite, and intelligent business intelligence assistant.
Your goal is to analyze data, create visuals, apply beautiful effects, manage live updates, change grid layouts, generate high-quality mock data, add annotations or text notes, export files, and build custom dashboards for the user in Hindi, English, or Hinglish (as preferred by the user).

Here is the context of the user's dataset:
- Columns (Headers): ${JSON.stringify(headers)}
- Sample Rows of the Dataset: ${JSON.stringify(dataSample)}

Important Rules:
1. Use the provided dataset sample to answer the user's specific questions (e.g., "इस महीने सबसे ज़्यादा बिक्री किस प्रोडक्ट की हुई?" or "which product has highest sales").
2. Answer politely and clearly. Be helpful and direct. Ask logical questions if you need more details from the user.
3. If the user wants to perform ANY action on the dashboard (e.g., create a chart, clear the dashboard, apply layout grids, change visual styles, load mock data, set up live refresh, add text notes, or export documents), do NOT ask them to use a form or guided wizard. Instead, execute the action directly by adding a JSON array block at the end of your text response using the language identifier \`json-actions\`.
The format of the \`json-actions\` block MUST be exactly as follows:
\`\`\`json-actions
[
  {
    "action": "clear-dashboard" // Use this when user wants a fresh/new custom dashboard or explicitly asks to clear/reset/recreate the dashboard
  },
  {
    "action": "create-chart",
    "type": "bar", // can be "bar", "line", "pie", "scatter", "radar", "treemap"
    "title": "A short descriptive chart title",
    "xAxis": "The exact column name from the headers above to use as X axis label",
    "yAxes": ["The exact column name from the headers above to use as Y axis value"]
  },
  {
    "action": "apply-effect",
    "effectId": "effect-cyberpunk", // Choose from available effect IDs: "effect-shadow-light", "effect-shadow-dark", "effect-cyberpunk", "effect-sunset-fire", "effect-emerald", "effect-retro-gold", "effect-minimalist", "effect-glass-frosted"
    "target": "all" // can be "all", or a specific chart title/id
  },
  {
    "action": "change-theme",
    "themeId": "blue-container-color", // Choose from: "default-container-color" (Classic Soft), "blue-container-color", "green-container-color", "warm-container-color", "dark-container-color", "sunset-orange", "ocean-gradient", "rainbowcandy", "tropicalparadise", "neondreams"
    "target": "all" // can be "all", or a specific chart title/id
  },
  {
    "action": "change-layout",
    "columns": 2 // can be 1, 2, or 3 columns
  },
  {
    "action": "generate-mock-data",
    "category": "sales", // can be "sales", "finance", "hr", "iot", "stock"
    "rowCount": 30 // can be 15, 30, 50, or 100
  },
  {
    "action": "set-live-polling",
    "url": "https://jsonplaceholder.typicode.com/todos", // API URL
    "interval": 10 // refresh interval in seconds
  },
  {
    "action": "create-textbox",
    "content": "Beautiful customized notes card on the dashboard...", // Plain text or HTML notes content
    "bgColor": "#fff3cd" // Hex color code for the textbox card background (e.g. #fff3cd, #cfe2ff, #d1e7dd, #ffffff)
  },
  {
    "action": "export-dashboard",
    "format": "pdf_dash" // Choose from: "csv", "excel", "pdf_table", "png_dash", "pdf_dash"
  }
]
\`\`\`

Available Visual Style Effects:
- "effect-shadow-light" (हल्की परछाई / Soft light shadow)
- "effect-shadow-dark" (गहरी परछाई / Deep dark shadow)
- "effect-cyberpunk" (साइबरपंक नियॉन / Cyberpunk Pink & Blue Neon glow)
- "effect-sunset-fire" (सूर्यास्त अग्नि / Sunset Orange-Red Gradient)
- "effect-emerald" (पन्ना वन / Emerald Forest Green Gradient Glow)
- "effect-retro-gold" (विंटेज गोल्ड / Classic Retro Vintage Gold border)
- "effect-minimalist" (आधुनिक न्यूनतम / Clean Modern Minimalist white)
- "effect-glass-frosted" (फ्रॉस्टेड ग्लास / Frosted Glass card overlay)

Ensure column names in xAxis and yAxes match the case and text of the provided headers EXACTLY.
If the user asks for a dashboard build, clear the dashboard first and generate 2-3 highly relevant charts representing the dataset beautifully, with style effects applied!`;

    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        });
      });
    }

    const userParts: any[] = [{ text: message }];
    if (image_base64) {
      const match = image_base64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (match) {
        userParts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    contents.push({
      role: "user",
      parts: userParts,
    });

    const client = getAiClient();
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      },
    });

    const reply = response.text || "माफ़ कीजिए, मुझे जवाब नहीं मिल पाया।";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error in server (using fallback):", error);
    try {
      const fallback = generateFallbackReply(req.body.message, req.body.headers || []);
      res.json({ reply: fallback.reply, isFallback: true });
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
});

// Serve Frontend
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
