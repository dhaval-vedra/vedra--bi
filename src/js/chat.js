// Chat related variables
let chatHistory = []; // AI के साथ बातचीत का इतिहास रखेगा
const maxChatHistoryLength = 10; // बातचीत के कितने टर्न याद रखने हैं (user+assistant = 2 टर्न)

// Dynamic Agent Action Permission Mode
let chatPermissionMode = localStorage.getItem("chatPermissionMode") || "prompt"; // "prompt" | "always" | "this-chat"

// Import headers and currentDataForChat from dataHandler.js
import { headers, currentDataForChat } from "../store/DataHandler.js";
// Import showMessage from utils.js
import { showMessage, exportExcel, exportCsv, exportPdf } from "./utils.js";
import { addVisualization, clearChart, visualizations, arrangeChartsInGrid } from "./charts.js";
import { applyEffect, chartEffectsTemplates } from "./chartEffects.js";
import { applyChartContainerColor } from "./chartContainerColors.js";
import { triggerMockDataUpdate } from "./mockDataGenerator.js";
import { exportDashboardToPDF, exportDashboardToPNG } from "./reportExporter.js";
import { startLiveUpdate, stopLiveUpdate, toggleLiveUpdatePause } from "./liveDataHandler.js";
import { createBox } from "./editor.js";

// Showdown.js कन्वर्टर बनाएँ
const converter = typeof showdown !== "undefined" ? new showdown.Converter() : null;

/**
 * Executes parsed JSON actions dynamically on the dashboard.
 */
export async function executeAiActions(actions) {
  try {
    showMessage("AI आपके डैशबोर्ड को अपडेट कर रहा है... 🛠️", "info");
    for (const act of actions) {
      if (act.action === "clear-dashboard") {
        const activeVizs = [...visualizations];
        for (const viz of activeVizs) {
          await clearChart(viz.id);
        }
      } else if (act.action === "create-chart") {
        if (act.xAxis && act.yAxes && act.yAxes.length > 0) {
          await addVisualization(
            act.xAxis,
            act.yAxes,
            act.zAxis || null,
            act.type || "bar",
            act.title || "AI Chart"
          );
        }
      } else if (act.action === "apply-effect") {
        await new Promise(resolve => setTimeout(resolve, 800));
        const effectObj = chartEffectsTemplates.find(
          e => e.id === act.effectId || 
               e.id === `effect-${act.effectId}` ||
               (act.effectId && e.name.toLowerCase().includes(act.effectId.toLowerCase()))
        );
        if (effectObj) {
          if (act.target === "all") {
            visualizations.forEach(viz => applyEffect(viz.id, effectObj));
            showMessage(`सभी चार्ट्स पर "${effectObj.name}" इफ़ेक्ट लागू किया गया! ✨`, "success");
          } else {
            const viz = visualizations.find(
              v => v.id === act.target || 
                   v.title === act.target || 
                   (act.target && v.title.toLowerCase().includes(act.target.toLowerCase()))
            ) || visualizations[visualizations.length - 1];
            if (viz) {
              applyEffect(viz.id, effectObj);
              showMessage(`चार्ट "${viz.title}" पर "${effectObj.name}" इफ़ेक्ट लागू किया गया! ✨`, "success");
            }
          }
        }
      } else if (act.action === "change-theme") {
        const themeId = act.themeId;
        if (themeId) {
          if (act.target === "all") {
            applyChartContainerColor(themeId, visualizations, true);
            showMessage(`सभी चार्ट्स का थीम बदलकर "${themeId}" किया गया! 🎨`, "success");
          } else {
            const targetViz = visualizations.find(
              v => v.id === act.target || (act.target && v.title.toLowerCase().includes(act.target.toLowerCase()))
            ) || visualizations[visualizations.length - 1];
            if (targetViz) {
              applyChartContainerColor(themeId, [targetViz], false, [targetViz.id]);
              showMessage(`चार्ट "${targetViz.title}" का थीम बदलकर "${themeId}" किया गया! 🎨`, "success");
            }
          }
        }
      } else if (act.action === "change-layout") {
        if (act.columns) {
          await arrangeChartsInGrid(parseInt(act.columns, 10));
          showMessage(`ग्रिड लेआउट को ${act.columns} कॉलम में बदला गया! 📐`, "success");
        }
      } else if (act.action === "generate-mock-data") {
        if (act.category) {
          triggerMockDataUpdate(act.category, act.rowCount || 30);
          showMessage(`मॉक डेटासेट "${act.category}" (${act.rowCount || 30} रिकॉर्ड्स) लोड किया गया! 🔄`, "success");
        }
      } else if (act.action === "set-live-polling") {
        if (act.url && act.interval) {
          startLiveUpdate(act.url, parseInt(act.interval, 10));
          showMessage(`लाइव रिफ्रेश चालू किया गया (अंतराल: ${act.interval} सेकंड)! ⏰`, "success");
        } else if (act.state === "stop") {
          stopLiveUpdate();
          showMessage("लाइव रिफ्रेश बंद किया गया।", "info");
        }
      } else if (act.action === "create-textbox") {
        if (act.content) {
          const x = 150 + Math.random() * 100;
          const y = 150 + Math.random() * 100;
          createBox(x, y, 0, `<p>${act.content}</p>`, act.bgColor || "#fff3cd", "slide-in-up");
          showMessage("डैशबोर्ड पर नया नोट्स बॉक्स जोड़ा गया! 📝", "success");
        }
      } else if (act.action === "export-dashboard") {
        const format = act.format || "pdf_dash";
        if (format === "csv") {
          exportCsv(currentDataForChat, "vedra_bi_data.csv");
        } else if (format === "excel") {
          exportExcel(currentDataForChat, "vedra_bi_data.xlsx");
        } else if (format === "pdf_table") {
          exportPdf(currentDataForChat, headers || [], "vedra_bi_data.pdf");
        } else if (format === "png_dash") {
          exportDashboardToPNG();
        } else if (format === "pdf_dash") {
          exportDashboardToPDF();
        }
        showMessage(`डेटा/डैशबोर्ड को "${format}" फॉर्मेट में एक्सपोर्ट किया गया! 📤`, "success");
      }
    }
  } catch (err) {
    console.error("Error executing actions:", err);
  }
}

/**
 * Beautifully renders an action permission card inside the chat History.
 */
export function renderPermissionPrompt(actions) {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `perm-prompt-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = "card border-primary mb-3 shadow-sm slide-in-up";
  messageElement.id = cardId;
  messageElement.style.borderRadius = "12px";
  messageElement.style.overflow = "hidden";

  let listHTML = "";
  actions.forEach(act => {
    let desc = "";
    if (act.action === "clear-dashboard") {
      desc = `<i class="bi bi-trash3 text-danger me-2"></i> <strong>डैशबोर्ड साफ़ करें</strong> - वर्तमान के सभी चार्ट हटाएँ`;
    } else if (act.action === "create-chart") {
      desc = `<i class="bi bi-graph-up-arrow text-primary me-2"></i> <strong>नया चार्ट बनाएँ</strong> - "${act.title || 'AI Chart'}" (${act.type || 'bar'} चार्ट)`;
    } else if (act.action === "apply-effect") {
      desc = `<i class="bi bi-magic text-success me-2"></i> <strong>विजुअल इफ़ेक्ट लगाएँ</strong> - "${act.effectId}" (लक्ष्य: ${act.target || 'all'})`;
    } else if (act.action === "change-theme") {
      desc = `<i class="bi bi-paint-bucket text-info me-2"></i> <strong>कार्ड थीम बदलें</strong> - "${act.themeId}" (लक्ष्य: ${act.target || 'all'})`;
    } else if (act.action === "change-layout") {
      desc = `<i class="bi bi-grid-3x3-gap-fill text-warning me-2"></i> <strong>ग्रिड लेआउट बदलें</strong> - ${act.columns} कॉलम में व्यवस्थित करें`;
    } else if (act.action === "generate-mock-data") {
      desc = `<i class="bi bi-database-fill text-danger me-2"></i> <strong>मॉक डेटा लोड करें</strong> - "${act.category}" (${act.rowCount || 30} रिकॉर्ड्स)`;
    } else if (act.action === "set-live-polling") {
      desc = `<i class="bi bi-clock-history text-dark me-2"></i> <strong>लाइव अपडेट शुरू करें</strong> - अंतराल: ${act.interval} सेकंड`;
    } else if (act.action === "create-textbox") {
      desc = `<i class="bi bi-file-text text-primary me-2"></i> <strong>नोट्स बॉक्स जोड़ें</strong> - "${act.content ? act.content.substring(0, 30) + '...' : ''}"`;
    } else if (act.action === "export-dashboard") {
      desc = `<i class="bi bi-download text-secondary me-2"></i> <strong>एक्सपोर्ट करें</strong> - फॉर्मेट: ${act.format}`;
    } else {
      desc = `<i class="bi bi-gear-fill text-secondary me-2"></i> <strong>एक्शन</strong>: ${act.action}`;
    }
    listHTML += `<li class="mb-2 text-dark small" style="line-height: 1.4;">${desc}</li>`;
  });

  messageElement.innerHTML = `
    <div class="card-header bg-primary text-white py-2 d-flex align-items-center justify-content-between" style="border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-shield-lock-fill"></i>
        <span class="fw-bold small">AI सुरक्षा अनुमति (Security Consent)</span>
      </div>
      <span class="badge bg-white text-primary px-2 py-1" style="font-size: 10px;">अनुमति आवश्यक</span>
    </div>
    <div class="card-body p-3 bg-white" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
      <p class="text-secondary small mb-3">AI आपके डैशबोर्ड को गतिशील रूप से बदलने के लिए निम्नलिखित अनुमति मांग रहा है:</p>
      <ul class="list-unstyled mb-3 border-bottom pb-2">
        ${listHTML}
      </ul>
      
      <div class="d-flex flex-wrap gap-2 justify-content-center">
        <button class="btn btn-sm btn-success rounded-pill px-3 py-1 text-xs fw-bold d-inline-flex align-items-center" id="btnPermAllowOnce-${cardId}">
          <i class="bi bi-check-circle me-1"></i> Allow (इस बार)
        </button>
        <button class="btn btn-sm btn-primary rounded-pill px-3 py-1 text-xs fw-bold d-inline-flex align-items-center" id="btnPermAllowChat-${cardId}">
          <i class="bi bi-chat-text me-1"></i> Allow This Chat
        </button>
        <button class="btn btn-sm btn-info text-dark rounded-pill px-3 py-1 text-xs fw-bold d-inline-flex align-items-center" id="btnPermAllowAlways-${cardId}">
          <i class="bi bi-infinity me-1"></i> Allow Always
        </button>
        <button class="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 text-xs fw-bold d-inline-flex align-items-center" id="btnPermDeny-${cardId}">
          <i class="bi bi-x-circle me-1"></i> Deny
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  document.getElementById(`btnPermAllowOnce-${cardId}`).addEventListener("click", () => {
    executeAiActions(actions);
    messageElement.remove();
    displayChatMessage("मैंने आपकी अनुमति से डैशबोर्ड को अपडेट कर दिया है! ✅", "assistant");
  });

  document.getElementById(`btnPermAllowChat-${cardId}`).addEventListener("click", () => {
    chatPermissionMode = "this-chat";
    executeAiActions(actions);
    messageElement.remove();
    displayChatMessage("इस चैट सत्र के लिए ऑटो-अपडेट की अनुमति दी गई है! 🔄", "assistant");
  });

  document.getElementById(`btnPermAllowAlways-${cardId}`).addEventListener("click", () => {
    chatPermissionMode = "always";
    localStorage.setItem("chatPermissionMode", "always");
    executeAiActions(actions);
    messageElement.remove();
    displayChatMessage("हमेशा के लिए ऑटो-अपडेट को स्वीकृत कर दिया गया है! 🌐", "assistant");
  });

  document.getElementById(`btnPermDeny-${cardId}`).addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("सुरक्षा कारणों से एक्शन को निरस्त कर दिया गया है। ❌", "assistant");
  });
}

/**
 * Validates permission settings and triggers action execution.
 */
async function validateAndExecuteActions(actions) {
  if (!actions || actions.length === 0) return;
  
  if (chatPermissionMode === "always" || chatPermissionMode === "this-chat") {
    await executeAiActions(actions);
  } else {
    renderPermissionPrompt(actions);
  }
}

/**
 * AI द्वारा सुझाए गए चार्ट को स्वचालित रूप से खींचता है या एक्शन्स लागू करता है
 */
async function checkForAndRenderAiChart(text) {
  try {
    // 1. Check for json-actions block first
    const actionsRegex = /```json-actions\s*([\s\S]*?)\s*```/;
    const actionsMatch = text.match(actionsRegex);
    if (actionsMatch && actionsMatch[1]) {
      const actions = JSON.parse(actionsMatch[1]);
      if (Array.isArray(actions)) {
        await validateAndExecuteActions(actions);
        return; // Handled successfully
      }
    }

    // 2. Fallback to classic json-chart block for single chart
    const chartRegex = /```json-chart\s*([\s\S]*?)\s*```/;
    const chartMatch = text.match(chartRegex);
    if (chartMatch && chartMatch[1]) {
      const chartDef = JSON.parse(chartMatch[1]);
      if (chartDef && chartDef.xAxis && chartDef.yAxes && chartDef.yAxes.length > 0) {
        const syntheticActions = [{
          action: "create-chart",
          type: chartDef.type || "bar",
          title: chartDef.title || "AI Generated Chart",
          xAxis: chartDef.xAxis,
          yAxes: chartDef.yAxes
        }];
        await validateAndExecuteActions(syntheticActions);
      }
    }
  } catch (e) {
    console.error("Error parsing AI actions or charts:", e);
  }
}

// Function to generate a summary of the current filtered data
export async function generateSummary(data) {
  const summaryOutputDiv = document.getElementById("summaryOutput");
  const summaryTextDiv = document.getElementById("summaryText");

  if (!summaryOutputDiv || !summaryTextDiv) return;

  summaryOutputDiv.style.display = "block";
  summaryTextDiv.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div> सारांश तैयार किया जा रहा है...';

  const prompt =
    "कृपया इस डेटासेट का एक संक्षिप्त, 3-बिंदु सारांश हिंदी में दें। डेटा में क्या महत्वपूर्ण प्रवृत्तियाँ, मुख्य बिंदु या असामान्य पैटर्न हैं?";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        headers: headers || [],
        dataSample: data ? data.slice(0, 50) : [],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const result = await response.json();
    const summary = result.reply || "सारांश उपलब्ध नहीं है।";

    // Showdown.js का उपयोग करके HTML में कन्वर्ट करें
    summaryTextDiv.innerHTML = converter ? converter.makeHtml(summary) : summary;
  } catch (error) {
    console.error("AI सारांश जनरेट करते समय त्रुटि:", error);
    summaryTextDiv.innerHTML = `सारांश जनरेट नहीं किया जा सका। त्रुटि: ${error.message || error}`;
  }
}

// Function to send chat message and get response
export async function sendChatMessage() {
  const chatInput = document.getElementById("chatInput");
  const chatHistoryDiv = document.getElementById("chatHistory");
  const userMessage = chatInput.value.trim();

  if (!userMessage) return;

  displayChatMessage(userMessage, "user");
  chatInput.value = "";

  displayChatMessage("AI सोच रहा है...", "assistant", true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history: chatHistory.map((entry) => ({
          role: entry.type === "user" ? "user" : "model",
          content: entry.message,
        })),
        headers: headers || [],
        dataSample: currentDataForChat ? currentDataForChat.slice(0, 50) : [],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const result = await response.json();
    const aiReply = result.reply || "माफ़ कीजिए, मुझे जवाब नहीं मिल पाया।";

    removeLoadingMessage();
    displayChatMessage(aiReply, "assistant");

    // Check if a chart was suggested
    checkForAndRenderAiChart(aiReply);
  } catch (error) {
    removeLoadingMessage();
    displayChatMessage(`क्षमा करें, AI से बात करते समय एक त्रुटि हुई: ${error.message}`, "assistant");
    console.error("AI चैट में त्रुटि:", error);
  }
}

/**
 * 1. Guided Chart Questionnaire
 */
export function renderInteractiveChartForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `chart-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-primary mb-3 shadow-sm`;
  messageElement.id = cardId;

  // Let's create the headers options
  const headerOptions = (headers || [])
    .map(h => `<option value="${h}">${h}</option>`)
    .join("");

  messageElement.innerHTML = `
    <div class="card-header bg-primary text-white d-flex align-items-center py-2">
      <i class="bi bi-graph-up-arrow me-2"></i>
      <span class="fw-bold small">चार्ट असिस्टेंट (Guided Chart Maker)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-2">कृपया चार्ट बनाने के लिए निम्न विवरण चुनें:</p>
      
      <!-- Chart Type Radio Selection -->
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">1. चार्ट का प्रकार (Chart Type)</label>
        <div class="d-flex flex-wrap gap-2">
          <div class="form-check form-check-inline m-0">
            <input class="form-check-input" type="radio" name="guidedChartType-${cardId}" id="typeBar-${cardId}" value="bar" checked>
            <label class="form-check-label small" for="typeBar-${cardId}"><i class="bi bi-bar-chart"></i> बार</label>
          </div>
          <div class="form-check form-check-inline m-0">
            <input class="form-check-input" type="radio" name="guidedChartType-${cardId}" id="typeLine-${cardId}" value="line">
            <label class="form-check-label small" for="typeLine-${cardId}"><i class="bi bi-graph-up"></i> लाइन</label>
          </div>
          <div class="form-check form-check-inline m-0">
            <input class="form-check-input" type="radio" name="guidedChartType-${cardId}" id="typePie-${cardId}" value="pie">
            <label class="form-check-label small" for="typePie-${cardId}"><i class="bi bi-pie-chart"></i> पाई</label>
          </div>
          <div class="form-check form-check-inline m-0">
            <input class="form-check-input" type="radio" name="guidedChartType-${cardId}" id="typeScatter-${cardId}" value="scatter">
            <label class="form-check-label small" for="typeScatter-${cardId}"><i class="bi bi-dot"></i> स्कैटर</label>
          </div>
          <div class="form-check form-check-inline m-0">
            <input class="form-check-input" type="radio" name="guidedChartType-${cardId}" id="typeRadar-${cardId}" value="radar">
            <label class="form-check-label small" for="typeRadar-${cardId}"><i class="bi bi-hexagon"></i> रडार</label>
          </div>
          <div class="form-check form-check-inline m-0">
            <input class="form-check-input" type="radio" name="guidedChartType-${cardId}" id="typeTreemap-${cardId}" value="treemap">
            <label class="form-check-label small" for="typeTreemap-${cardId}"><i class="bi bi-grid-3x3-gap"></i> ट्रीमैप</label>
          </div>
        </div>
      </div>

      <!-- X-Axis and Y-Axis Columns Dropdown -->
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label small fw-bold text-dark">2. X-अक्ष (X-Axis)</label>
          <select class="form-select form-select-sm" id="guidedChartX-${cardId}">
            ${headerOptions || '<option value="">डेटा लोड नहीं है</option>'}
          </select>
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold text-dark">3. Y-अक्ष (Y-Axis)</label>
          <select class="form-select form-select-sm" id="guidedChartY-${cardId}">
            ${headerOptions || '<option value="">डेटा लोड नहीं है</option>'}
          </select>
        </div>
      </div>

      <!-- Chart Title -->
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">4. चार्ट का नाम (Title)</label>
        <input type="text" class="form-control form-control-sm" id="guidedChartTitle-${cardId}" placeholder="उदा. कुल बिक्री">
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-primary flex-grow-1" id="btnSubmitChart-${cardId}">
          <i class="bi bi-plus-circle me-1"></i> चार्ट बनाएँ
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelChart-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnSubmit = document.getElementById(`btnSubmitChart-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelChart-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("चार्ट निर्माण रद्द कर दिया गया।", "assistant");
  });

  btnSubmit.addEventListener("click", () => {
    const selectedTypeEl = messageElement.querySelector(`input[name="guidedChartType-${cardId}"]:checked`);
    const chartType = selectedTypeEl ? selectedTypeEl.value : 'bar';
    const xAxisVal = document.getElementById(`guidedChartX-${cardId}`).value;
    const yAxisVal = document.getElementById(`guidedChartY-${cardId}`).value;
    const chartTitle = document.getElementById(`guidedChartTitle-${cardId}`).value.trim() || `${xAxisVal} बनाम ${yAxisVal}`;

    if (!xAxisVal || !yAxisVal) {
      alert("कृपया X और Y अक्ष के लिए कॉलम चुनें!");
      return;
    }

    addVisualization(xAxisVal, [yAxisVal], null, chartType, chartTitle);

    messageElement.querySelectorAll("input, select, button").forEach(el => el.disabled = true);
    btnSubmit.innerHTML = `<i class="bi bi-check-circle-fill"></i> चार्ट बनाया गया!`;
    btnSubmit.className = "btn btn-sm btn-success flex-grow-1";
    btnCancel.style.display = "none";

    displayChatMessage(`मैंने सफलतापूर्वक X-अक्ष पर **${xAxisVal}** और Y-अक्ष पर **${yAxisVal}** का उपयोग करके एक नया **${chartType}** चार्ट ("${chartTitle}") बनाया है। 📊`, "assistant");
  });
}

/**
 * 2. Guided Effect Questionnaire
 */
export function renderInteractiveEffectForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `effect-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-success mb-3 shadow-sm`;
  messageElement.id = cardId;

  // Generate options for existing charts on the dashboard
  let chartOptionsHTML = `<option value="all">सभी चार्ट्स (All Charts)</option>`;
  if (visualizations && visualizations.length > 0) {
    visualizations.forEach(viz => {
      chartOptionsHTML += `<option value="${viz.id}">${viz.title || 'अनाम चार्ट'} (ID: ${viz.id.slice(0,6)})</option>`;
    });
  } else {
    chartOptionsHTML += `<option value="" disabled>डैशबोर्ड पर कोई चार्ट नहीं है</option>`;
  }

  // Generate options for effects templates
  let effectOptionsHTML = "";
  chartEffectsTemplates.forEach(eff => {
    effectOptionsHTML += `
      <div class="form-check mb-1">
        <input class="form-check-input" type="radio" name="guidedEffectStyle-${cardId}" id="eff-${eff.id}-${cardId}" value="${eff.id}" checked>
        <label class="form-check-label small" for="eff-${eff.id}-${cardId}">
          <strong>${eff.name}</strong> <span class="text-muted">(${eff.id.replace('effect-', '')})</span>
        </label>
      </div>
    `;
  });

  messageElement.innerHTML = `
    <div class="card-header bg-success text-white d-flex align-items-center py-2">
      <i class="bi bi-palette2 me-2"></i>
      <span class="fw-bold small">स्टाइल इफ़ेक्ट असिस्टेंट (Chart Effects)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-2">कृपया नीचे से चार्ट और पसंदीदा विजुअल इफ़ेक्ट चुनें:</p>
      
      <!-- Target Chart Select -->
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">1. चार्ट चुनें (Target Chart)</label>
        <select class="form-select form-select-sm" id="guidedEffectTarget-${cardId}">
          ${chartOptionsHTML}
        </select>
      </div>

      <!-- Effects Radio List -->
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">2. स्टाइल इफ़ेक्ट चुनें (Style Effect)</label>
        <div style="max-height: 150px; overflow-y: auto;" class="border rounded p-2 bg-light">
          ${effectOptionsHTML}
        </div>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-success flex-grow-1" id="btnSubmitEffect-${cardId}">
          <i class="bi bi-magic me-1"></i> इफ़ेक्ट लागू करें
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelEffect-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnSubmit = document.getElementById(`btnSubmitEffect-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelEffect-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("इफ़ेक्ट चयन रद्द कर दिया गया।", "assistant");
  });

  btnSubmit.addEventListener("click", () => {
    const targetChartId = document.getElementById(`guidedEffectTarget-${cardId}`).value;
    const selectedEffectRadio = messageElement.querySelector(`input[name="guidedEffectStyle-${cardId}"]:checked`);
    
    if (!targetChartId) {
      alert("कृपया लक्ष्य चार्ट चुनें!");
      return;
    }
    if (!selectedEffectRadio) {
      alert("कृपया एक इफ़ेक्ट चुनें!");
      return;
    }

    const effectId = selectedEffectRadio.value;
    const effectObj = chartEffectsTemplates.find(e => e.id === effectId);

    if (!effectObj) {
      alert("चुना गया इफ़ेक्ट उपलब्ध नहीं है!");
      return;
    }

    if (targetChartId === "all") {
      visualizations.forEach(viz => {
        applyEffect(viz.id, effectObj);
      });
      showMessage(`सभी चार्ट्स पर "${effectObj.name}" इफ़ेक्ट लागू किया गया! ✨`, "success");
      displayChatMessage(`मैंने आपके डैशबोर्ड पर मौजूद सभी चार्ट्स पर सफलतापूर्वक **"${effectObj.name}"** इफ़ेक्ट लागू कर दिया है! ✨`, "assistant");
    } else {
      const targetViz = visualizations.find(v => v.id === targetChartId);
      if (targetViz) {
        applyEffect(targetChartId, effectObj);
        showMessage(`चार्ट "${targetViz.title}" पर "${effectObj.name}" इफ़ेक्ट लागू किया गया! ✨`, "success");
        displayChatMessage(`मैंने चार्ट **"${targetViz.title}"** पर सफलतापूर्वक **"${effectObj.name}"** इफ़ेक्ट लागू कर दिया है! ✨`, "assistant");
      } else {
        alert("लक्ष्य चार्ट नहीं मिला!");
        return;
      }
    }

    messageElement.querySelectorAll("input, select, button").forEach(el => el.disabled = true);
    btnSubmit.innerHTML = `<i class="bi bi-check-circle-fill"></i> इफ़ेक्ट लागू किया गया!`;
    btnSubmit.className = "btn btn-sm btn-secondary flex-grow-1 text-white";
    btnCancel.style.display = "none";
  });
}

/**
 * 3. Guided Custom Dashboard Questionnaire
 */
export function renderInteractiveDashboardForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `db-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-info mb-3 shadow-sm`;
  messageElement.id = cardId;

  messageElement.innerHTML = `
    <div class="card-header bg-info text-dark d-flex align-items-center py-2">
      <i class="bi bi-grid-3x3-gap-fill me-2"></i>
      <span class="fw-bold small text-dark">कस्टम डैशबोर्ड मेकर (Dashboard Wizard)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-3">क्या आप अपने वर्तमान डेटासेट के लिए एक सुंदर और नए सिरे से मल्टी-चार्ट डैशबोर्ड का निर्माण करना चाहते हैं? इससे पुराने सभी चार्ट साफ़ हो जाएंगे।</p>
      
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-info text-dark flex-grow-1 fw-bold" id="btnSubmitDB-${cardId}">
          <i class="bi bi-play-circle-fill me-1"></i> हाँ, नया डैशबोर्ड बनाएं!
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelDB-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnSubmit = document.getElementById(`btnSubmitDB-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelDB-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("डैशबोर्ड निर्माण रद्द कर दिया गया।", "assistant");
  });

  btnSubmit.addEventListener("click", async () => {
    const activeVizs = [...visualizations];
    for (const viz of activeVizs) {
      await clearChart(viz.id);
    }

    if (headers && headers.length >= 2) {
      const numCols = headers.filter(h => {
        const name = h.toLowerCase();
        return name.includes('amount') || name.includes('price') || name.includes('total') || name.includes('sales') || name.includes('qty') || name.includes('quantity') || name.includes('value') || name.includes('count') || name.includes('rate') || name.includes('profit');
      });
      const catCols = headers.filter(h => !numCols.includes(h));

      const xAxis = catCols[0] || headers[0];
      const yAxis1 = numCols[0] || headers[1];
      const yAxis2 = numCols[1] || headers[2] || headers[1];

      await addVisualization(xAxis, [yAxis1], null, "bar", `${xAxis} के अनुसार ${yAxis1} (Bar Chart)`);
      if (headers.length >= 3) {
        await addVisualization(xAxis, [yAxis2], null, "line", `समय/श्रेणी के अनुसार ${yAxis2} (Line Chart)`);
      }
      if (numCols.length > 0) {
        const pieX = catCols[1] || catCols[0] || headers[0];
        await addVisualization(pieX, [yAxis1], null, "pie", `${pieX} वितरण (Pie Chart)`);
      }

      displayChatMessage(`मैंने पुराना डैशबोर्ड साफ़ करके, आपके डेटा को विश्लेषित करके **3 प्रमुख कस्टम चार्ट्स** का एक सुंदर डैशबोर्ड तैयार कर दिया है! 🚀`, "assistant");
    } else {
      displayChatMessage(`क्षमा करें, कस्टम डैशबोर्ड बनाने के लिए पर्याप्त कॉलम (कम से कम 2) नहीं मिले।`, "assistant");
    }

    messageElement.querySelectorAll("button").forEach(el => el.disabled = true);
    btnSubmit.innerHTML = `<i class="bi bi-check-circle-fill"></i> डैशबोर्ड तैयार है!`;
    btnSubmit.className = "btn btn-sm btn-secondary flex-grow-1 text-white";
    btnCancel.style.display = "none";
  });
}

function addMessageControls(container, messageElement, messageText, type) {
  // Create controls container
  const controlsDiv = document.createElement("div");
  controlsDiv.className = `message-actions-bar ${type}-actions`;

  if (type === "user") {
    // Edit Button
    const btnEdit = document.createElement("button");
    btnEdit.className = "action-icon-btn";
    btnEdit.innerHTML = `<i class="bi bi-pencil-square"></i>`;
    btnEdit.title = "मेसेज एडिट करें (Edit Message)";
    btnEdit.addEventListener("click", () => {
      const chatInput = document.getElementById("chatInput");
      if (chatInput) {
        chatInput.value = messageText;
        chatInput.focus();
      }
    });

    // Copy Button
    const btnCopy = document.createElement("button");
    btnCopy.className = "action-icon-btn";
    btnCopy.innerHTML = `<i class="bi bi-clipboard"></i>`;
    btnCopy.title = "मेसेज कॉपी करें (Copy Message)";
    btnCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(messageText);
        showMessage("मेसेज कॉपी किया गया! 📋", "success");
      } catch (err) {
        console.error(err);
      }
    });

    // Cut Button
    const btnCut = document.createElement("button");
    btnCut.className = "action-icon-btn";
    btnCut.innerHTML = `<i class="bi bi-scissors"></i>`;
    btnCut.title = "मेसेज कट करें (Cut Message)";
    btnCut.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(messageText);
        container.remove();
        showMessage("मेसेज कट किया गया! ✂️", "success");
      } catch (err) {
        console.error(err);
      }
    });

    // Post Button
    const btnPost = document.createElement("button");
    btnPost.className = "action-icon-btn";
    btnPost.innerHTML = `<i class="bi bi-pin-angle-fill"></i>`;
    btnPost.title = "डैशबोर्ड पर टेक्स्टबॉक्स जोड़ें (Post to Dashboard)";
    btnPost.addEventListener("click", () => {
      const x = 150 + Math.random() * 100;
      const y = 150 + Math.random() * 100;
      createBox(x, y, 0, `<p>${messageText}</p>`, "#fff3cd", "slide-in-up");
      showMessage("मेसेज डैशबोर्ड पर पोस्ट किया गया! 📝", "success");
    });

    controlsDiv.appendChild(btnEdit);
    controlsDiv.appendChild(btnCopy);
    controlsDiv.appendChild(btnCut);
    controlsDiv.appendChild(btnPost);

  } else if (type === "assistant") {
    // Refresh / Regenerate Button
    const btnRefresh = document.createElement("button");
    btnRefresh.className = "action-icon-btn";
    btnRefresh.innerHTML = `<i class="bi bi-arrow-clockwise"></i>`;
    btnRefresh.title = "फिर से रिस्पॉन्स उत्पन्न करें (Regenerate Response)";
    btnRefresh.addEventListener("click", () => {
      // Find the previous user message in chatHistory
      let prevUserMessage = "";
      for (let i = chatHistory.length - 1; i >= 0; i--) {
        if (chatHistory[i].type === "user") {
          prevUserMessage = chatHistory[i].message;
          break;
        }
      }
      if (prevUserMessage) {
        const chatInput = document.getElementById("chatInput");
        if (chatInput) {
          chatInput.value = prevUserMessage;
          sendChatMessage();
        }
      } else {
        showMessage("कोई पिछला यूजर मेसेज नहीं मिला!", "warning");
      }
    });

    // Copy Button
    const btnCopy = document.createElement("button");
    btnCopy.className = "action-icon-btn";
    btnCopy.innerHTML = `<i class="bi bi-clipboard"></i>`;
    btnCopy.title = "रिस्पॉन्स कॉपी करें (Copy Response)";
    btnCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(messageText);
        showMessage("रिस्पॉन्स कॉपी किया गया! 📋", "success");
      } catch (err) {
        console.error(err);
      }
    });

    controlsDiv.appendChild(btnRefresh);
    controlsDiv.appendChild(btnCopy);
  }

  container.appendChild(controlsDiv);
}

function typeHTML(element, html, speed = 4, onComplete) {
  // Parse the HTML into tags and text chunks
  const tokenRegex = /(<[^>]+>|[^<]+)/g;
  const tokens = html.match(tokenRegex) || [];
  let currentTokenIndex = 0;
  let currentHTML = "";

  element.innerHTML = "";

  function typeNextToken() {
    if (currentTokenIndex >= tokens.length) {
      if (onComplete) onComplete();
      return;
    }

    const token = tokens[currentTokenIndex];
    if (token.startsWith("<")) {
      // It's a tag, append it immediately to prevent broken rendering
      currentHTML += token;
      element.innerHTML = currentHTML;
      currentTokenIndex++;
      typeNextToken();
    } else {
      // It's text, stream it with adaptive chunk sizes to keep it fast
      let charIndex = 0;
      function typeChar() {
        if (charIndex >= token.length) {
          currentTokenIndex++;
          setTimeout(typeNextToken, speed);
          return;
        }
        // Grab a small chunk of text (1-3 chars) to feel extremely fluid but very fast
        const chunkLength = token.length - charIndex > 3 ? 3 : token.length - charIndex;
        currentHTML += token.substr(charIndex, chunkLength);
        element.innerHTML = currentHTML;
        charIndex += chunkLength;
        
        const chatHistoryDiv = document.getElementById("chatHistory");
        if (chatHistoryDiv) {
          chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
        }
        
        setTimeout(typeChar, speed);
      }
      typeChar();
    }
  }

  typeNextToken();
}

function displayChatMessage(message, type, isLoading = false) {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const row = document.createElement("div");
  row.className = `chat-row ${type}-row`;

  // Create Avatar Element
  const avatar = document.createElement("div");
  if (type === "user") {
    avatar.className = "chat-avatar user-avatar";
    avatar.innerHTML = `<i class="bi bi-person-fill"></i>`;
  } else {
    avatar.className = "chat-avatar bot-avatar";
    avatar.innerHTML = `<i class="bi bi-robot"></i>`;
  }

  const container = document.createElement("div");
  container.className = "chat-message-container";

  const messageElement = document.createElement("div");
  messageElement.className = `chat-message-bubble ${type}`;

  if (isLoading) {
    messageElement.id = "loadingMessage";
    messageElement.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="ms-1 text-muted small">सोच रहा हूँ...</span>
      </div>
    `;
  } else {
    const finalHtml = converter ? converter.makeHtml(message) : message;
    
    if (type === "assistant") {
      // Stream response with beautiful typewriter effect
      typeHTML(messageElement, finalHtml, 4, () => {
        chatHistory.push({ type: type, message: message });
        addMessageControls(container, messageElement, message, type);
      });
    } else {
      // Show immediately for user
      messageElement.innerHTML = finalHtml;
      chatHistory.push({ type: type, message: message });
      addMessageControls(container, messageElement, message, type);
    }
  }

  container.appendChild(messageElement);
  row.appendChild(avatar);
  row.appendChild(container);

  chatHistoryDiv.appendChild(row);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

function removeLoadingMessage() {
  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) {
    const parentRow = loadingMessage.closest(".chat-row");
    if (parentRow) {
      parentRow.remove();
    } else {
      loadingMessage.remove();
    }
  }
}

export function clearChatHistory() {
  chatHistory = [];
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (chatHistoryDiv) {
    chatHistoryDiv.innerHTML = `
      <div class="alert alert-info alert-dismissible fade show" role="alert">
          <strong>स्वागत है! 👋</strong> मैं आपकी डेटा विश्लेषण में सहायता करने के लिए यहाँ हूँ। आप डेटा के बारे में कोई भी प्रश्न पूछ सकते हैं।
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}

/**
 * 4. Guided Card Theme Assistant
 */
export function renderInteractiveThemeForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `theme-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-info mb-3 shadow-sm`;
  messageElement.id = cardId;

  // Target chart choices
  let chartOptionsHTML = `<option value="all">सभी चार्ट्स (All Charts)</option>`;
  if (visualizations && visualizations.length > 0) {
    visualizations.forEach(viz => {
      chartOptionsHTML += `<option value="${viz.id}">${viz.title || 'अनाम चार्ट'} (ID: ${viz.id.slice(0,6)})</option>`;
    });
  } else {
    chartOptionsHTML += `<option value="" disabled>डैशबोर्ड पर कोई चार्ट नहीं है</option>`;
  }

  // Pre-configured container theme choices
  const containerThemes = [
    { id: "default-container-color", name: "डिफ़ॉल्ट (Classic Soft)" },
    { id: "blue-container-color", name: "आकाश नीला (Light Blue)" },
    { id: "green-container-color", name: "पुदीना हरा (Mint Green)" },
    { id: "warm-container-color", name: "गर्म (Warm Amber)" },
    { id: "dark-container-color", name: "गहरा (Deep Dark)" },
    { id: "sunset-orange", name: "सूरजमुखी नारंगी (Sunset Orange)" },
    { id: "ocean-gradient", name: "समुद्र धारा (Ocean Wave Blue)" },
    { id: "rainbowcandy", name: "रेनबो कैंडी (Rainbow Magic)" },
    { id: "tropicalparadise", name: "ट्रॉपिकल पैराडाइज (Tropical Forest)" },
    { id: "neondreams", name: "नीयन ड्रीम्स (Cyber Dreams)" }
  ];

  let themeOptionsHTML = "";
  containerThemes.forEach(t => {
    themeOptionsHTML += `
      <div class="form-check mb-1">
        <input class="form-check-input" type="radio" name="guidedThemeStyle-${cardId}" id="theme-${t.id}-${cardId}" value="${t.id}" checked>
        <label class="form-check-label small" for="theme-${t.id}-${cardId}">
          <strong>${t.name}</strong>
        </label>
      </div>
    `;
  });

  messageElement.innerHTML = `
    <div class="card-header bg-info text-dark d-flex align-items-center py-2">
      <i class="bi bi-paint-bucket me-2"></i>
      <span class="fw-bold small text-dark">कार्ड थीम असिस्टेंट (Card Theme)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-2">चार्ट कार्ड का बैकग्राउंड थीम बदलने के लिए विवरण चुनें:</p>
      
      <!-- Target Chart Select -->
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">1. चार्ट चुनें (Target Chart)</label>
        <select class="form-select form-select-sm" id="guidedThemeTarget-${cardId}">
          ${chartOptionsHTML}
        </select>
      </div>

      <!-- Theme Radio List -->
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">2. नया थीम चुनें (Select Theme)</label>
        <div style="max-height: 140px; overflow-y: auto;" class="border rounded p-2 bg-light">
          ${themeOptionsHTML}
        </div>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-info text-dark flex-grow-1 fw-bold" id="btnSubmitTheme-${cardId}">
          <i class="bi bi-check2-circle me-1"></i> थीम लागू करें
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelTheme-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnSubmit = document.getElementById(`btnSubmitTheme-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelTheme-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("थीम चयन रद्द कर दिया गया।", "assistant");
  });

  btnSubmit.addEventListener("click", () => {
    const targetChartId = document.getElementById(`guidedThemeTarget-${cardId}`).value;
    const selectedThemeRadio = messageElement.querySelector(`input[name="guidedThemeStyle-${cardId}"]:checked`);
    
    if (!targetChartId) {
      alert("कृपया लक्ष्य चार्ट चुनें!");
      return;
    }
    if (!selectedThemeRadio) {
      alert("कृपया एक थीम चुनें!");
      return;
    }

    const themeId = selectedThemeRadio.value;
    const themeName = containerThemes.find(t => t.id === themeId)?.name || themeId;

    if (targetChartId === "all") {
      applyChartContainerColor(themeId, visualizations, true);
      showMessage(`सभी चार्ट्स पर "${themeName}" थीम लागू की गई! 🎨`, "success");
      displayChatMessage(`मैंने सफलतापूर्वक सभी चार्ट कार्ड्स पर **"${themeName}"** थीम लागू कर दी है! 🎨`, "assistant");
    } else {
      const targetViz = visualizations.find(v => v.id === targetChartId);
      if (targetViz) {
        applyChartContainerColor(themeId, [targetViz], false, [targetChartId]);
        showMessage(`चार्ट "${targetViz.title}" पर "${themeName}" थीम लागू की गई! 🎨`, "success");
        displayChatMessage(`मैंने चार्ट **"${targetViz.title}"** पर सफलतापूर्वक **"${themeName}"** थीम लागू कर दी है! 🎨`, "assistant");
      } else {
        alert("लक्ष्य चार्ट नहीं मिला!");
        return;
      }
    }

    messageElement.querySelectorAll("input, select, button").forEach(el => el.disabled = true);
    btnSubmit.innerHTML = `<i class="bi bi-check-circle-fill"></i> थीम लागू की गई!`;
    btnSubmit.className = "btn btn-sm btn-secondary flex-grow-1 text-white";
    btnCancel.style.display = "none";
  });
}

/**
 * 5. Guided Grid Layout Assistant
 */
export function renderInteractiveLayoutForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `layout-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-warning mb-3 shadow-sm`;
  messageElement.id = cardId;

  messageElement.innerHTML = `
    <div class="card-header bg-warning text-dark d-flex align-items-center py-2">
      <i class="bi bi-grid-3x3-gap-fill me-2"></i>
      <span class="fw-bold small text-dark">ग्रिड लेआउट असिस्टेंट (Grid Layout)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-3">चार्ट्स को व्यवस्थित करने के लिए पसंदीदा कॉलम ग्रिड या एक्शन चुनें:</p>
      
      <div class="d-grid gap-2 mb-3">
        <button class="btn btn-sm btn-outline-dark text-start" id="btnLayoutCol1-${cardId}">
          <i class="bi bi-distribute-vertical me-2"></i> <strong>1 कॉलम ग्रिड (Single Column)</strong> - बड़ी स्क्रीन के लिए
        </button>
        <button class="btn btn-sm btn-outline-dark text-start" id="btnLayoutCol2-${cardId}">
          <i class="bi bi-columns-gap me-2"></i> <strong>2 कॉलम ग्रिड (Double Column)</strong> - संतुलित व्यू
        </button>
        <button class="btn btn-sm btn-outline-dark text-start" id="btnLayoutCol3-${cardId}">
          <i class="bi bi-grid-3x3-gap me-2"></i> <strong>3 कॉलम ग्रिड (Triple Column)</strong> - कॉम्पैक्ट डैशबोर्ड
        </button>
      </div>

      <div class="border-top pt-2 d-flex gap-2">
        <button class="btn btn-sm btn-danger flex-grow-1" id="btnClearDashboard-${cardId}">
          <i class="bi bi-trash-fill me-1"></i> डैशबोर्ड साफ़ करें (Reset)
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelLayout-${cardId}">
          बंद करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnCol1 = document.getElementById(`btnLayoutCol1-${cardId}`);
  const btnCol2 = document.getElementById(`btnLayoutCol2-${cardId}`);
  const btnCol3 = document.getElementById(`btnLayoutCol3-${cardId}`);
  const btnClear = document.getElementById(`btnClearDashboard-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelLayout-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
  });

  const applyLayout = async (cols) => {
    await arrangeChartsInGrid(cols);
    showMessage(`चार्ट्स को ${cols} कॉलम ग्रिड में व्यवस्थित किया गया! 📐`, "success");
    displayChatMessage(`मैंने आपके डैशबोर्ड के सभी चार्ट्स को सफलतापूर्वक **${cols}-कॉलम ग्रिड** में सहेज कर व्यवस्थित कर दिया है! 📐`, "assistant");
    messageElement.remove();
  };

  btnCol1.addEventListener("click", () => applyLayout(1));
  btnCol2.addEventListener("click", () => applyLayout(2));
  btnCol3.addEventListener("click", () => applyLayout(3));

  btnClear.addEventListener("click", async () => {
    if (confirm("क्या आप वाकई सभी चार्ट साफ़ करना चाहते हैं?")) {
      const activeVizs = [...visualizations];
      for (const viz of activeVizs) {
        await clearChart(viz.id);
      }
      showMessage("डैशबोर्ड पूरी तरह से साफ़ कर दिया गया है।", "info");
      displayChatMessage("मैंने सफलतापूर्वक सभी चार्ट हटाकर डैशबोर्ड को पूरी तरह साफ़ कर दिया है। 🧹", "assistant");
      messageElement.remove();
    }
  });
}

/**
 * 6. Guided Mock Data Generator
 */
export function renderInteractiveDataForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `data-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-danger mb-3 shadow-sm`;
  messageElement.id = cardId;

  messageElement.innerHTML = `
    <div class="card-header bg-danger text-white d-flex align-items-center py-2">
      <i class="bi bi-database-fill-gear me-2"></i>
      <span class="fw-bold small">मॉक डेटा जनरेटर (Mock Data Generator)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-2">डैशबोर्ड को टेस्ट करने के लिए प्रीमियम और वास्तविक मॉक डेटासेट जनरेट करें:</p>
      
      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">1. डेटासेट श्रेणी (Select Category)</label>
        <select class="form-select form-select-sm" id="guidedDataTheme-${cardId}">
          <option value="sales">ई-कॉमर्स रिटेल सेल्स (E-Commerce Sales)</option>
          <option value="finance">कंपनी बजट और क्वार्टर (Corporate Budget)</option>
          <option value="hr">एचआर कर्मचारी रेटिंग व सैलरी (HR Performance)</option>
          <option value="iot">स्मार्ट होम IoT सेंसर्स (Smart IoT Sensors)</option>
          <option value="stock">क्रिप्टो और ब्लॉकचेन दरें (Crypto Market Caps)</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold text-dark">2. रिकॉर्ड संख्या (Row Count)</label>
        <select class="form-select form-select-sm" id="guidedDataRows-${cardId}">
          <option value="15" selected>15 रिकॉर्ड्स</option>
          <option value="30">30 रिकॉर्ड्स</option>
          <option value="50">50 रिकॉर्ड्स</option>
          <option value="100">100 रिकॉर्ड्स (विस्तृत विश्लेषण)</option>
        </select>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-danger flex-grow-1" id="btnSubmitData-${cardId}">
          <i class="bi bi-lightning-fill me-1"></i> डेटा जनरेट करें
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelData-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnSubmit = document.getElementById(`btnSubmitData-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelData-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
  });

  btnSubmit.addEventListener("click", () => {
    const selectedTheme = document.getElementById(`guidedDataTheme-${cardId}`).value;
    const rowCount = document.getElementById(`guidedDataRows-${cardId}`).value;

    triggerMockDataUpdate(selectedTheme, rowCount);

    showMessage(`सफलतापूर्वक ${rowCount} नया मॉक डेटा लोड किया गया! 🔄`, "success");
    displayChatMessage(`मैंने सफलतापूर्वक **"${selectedTheme}"** विषय पर आधारित **${rowCount} रिकॉर्ड्स** का एक ताज़ा मॉक डेटासेट जनरेट करके लोड कर दिया है। 🚀 अब आप "चार्ट बनाओ" या "डैशबोर्ड बनाओ" कह सकते हैं!`, "assistant");

    messageElement.querySelectorAll("select, button").forEach(el => el.disabled = true);
    btnSubmit.innerHTML = `<i class="bi bi-check-circle-fill"></i> डेटा लोड किया गया!`;
    btnSubmit.className = "btn btn-sm btn-secondary flex-grow-1 text-white";
    btnCancel.style.display = "none";
  });
}

/**
 * 7. Guided Export Center
 */
export function renderInteractiveExportForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `export-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-secondary mb-3 shadow-sm`;
  messageElement.id = cardId;

  messageElement.innerHTML = `
    <div class="card-header bg-secondary text-white d-flex align-items-center py-2">
      <i class="bi bi-file-earmark-arrow-up-fill me-2"></i>
      <span class="fw-bold small">रिपोर्ट और एक्सपोर्ट मैनेजर (Export Center)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-3">अपने वर्तमान डेटा और सुंदर डैशबोर्ड विजुअल्स को विभिन्न फॉर्मेट्स में डाउनलोड करें:</p>
      
      <div class="row g-2 mb-2">
        <div class="col-6">
          <button class="btn btn-sm btn-outline-primary w-100 text-start py-2" id="btnExportCSV-${cardId}">
            <i class="bi bi-filetype-csv me-1 text-success fs-6"></i> CSV एक्सपोर्ट
          </button>
        </div>
        <div class="col-6">
          <button class="btn btn-sm btn-outline-primary w-100 text-start py-2" id="btnExportExcel-${cardId}">
            <i class="bi bi-file-earmark-spreadsheet me-1 text-success fs-6"></i> Excel एक्सपोर्ट
          </button>
        </div>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-6">
          <button class="btn btn-sm btn-outline-danger w-100 text-start py-2" id="btnExportPDFTable-${cardId}">
            <i class="bi bi-file-earmark-pdf me-1 text-danger fs-6"></i> PDF टेबल
          </button>
        </div>
        <div class="col-6">
          <button class="btn btn-sm btn-outline-dark w-100 text-start py-2" id="btnExportPNGDash-${cardId}">
            <i class="bi bi-image me-1 text-primary fs-6"></i> PNG इमेज
          </button>
        </div>
      </div>

      <div class="d-grid mb-1">
        <button class="btn btn-sm btn-outline-danger py-2" id="btnExportPDFDash-${cardId}">
          <i class="bi bi-file-pdf-fill me-1 text-danger fs-6"></i> पूरे डैशबोर्ड को PDF में डाउनलोड करें
        </button>
      </div>

      <div class="text-end mt-2">
        <button class="btn btn-sm btn-outline-secondary px-3" id="btnCancelExport-${cardId}">
          बंद करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnCSV = document.getElementById(`btnExportCSV-${cardId}`);
  const btnExcel = document.getElementById(`btnExportExcel-${cardId}`);
  const btnPDFTable = document.getElementById(`btnExportPDFTable-${cardId}`);
  const btnPNGDash = document.getElementById(`btnExportPNGDash-${cardId}`);
  const btnPDFDash = document.getElementById(`btnExportPDFDash-${cardId}`);
  const btnCancel = document.getElementById(`btnCancelExport-${cardId}`);

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
  });

  const handleExport = (action, filename) => {
    try {
      if (!currentDataForChat || currentDataForChat.length === 0) {
        alert("एक्सपोर्ट करने के लिए कोई डेटा उपलब्ध नहीं है!");
        return;
      }
      
      if (action === "csv") {
        exportCsv(currentDataForChat, filename);
      } else if (action === "excel") {
        exportExcel(currentDataForChat, filename);
      } else if (action === "pdf_table") {
        exportPdf(currentDataForChat, headers || [], filename);
      } else if (action === "png_dash") {
        exportDashboardToPNG();
      } else if (action === "pdf_dash") {
        exportDashboardToPDF();
      }
      showMessage("एक्सपोर्ट सफलतापूर्वक शुरू किया गया! 📥", "success");
    } catch (err) {
      console.error(err);
      alert(`त्रुटि: ${err.message}`);
    }
  };

  btnCSV.addEventListener("click", () => handleExport("csv", "vedra_bi_data.csv"));
  btnExcel.addEventListener("click", () => handleExport("excel", "vedra_bi_data.xlsx"));
  btnPDFTable.addEventListener("click", () => handleExport("pdf_table", "vedra_bi_data.pdf"));
  btnPNGDash.addEventListener("click", () => handleExport("png_dash"));
  btnPDFDash.addEventListener("click", () => handleExport("pdf_dash"));
}

/**
 * 8. Guided Live Polling Form
 */
export function renderInteractiveLivePollingForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `live-polling-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-dark mb-3 shadow-sm`;
  messageElement.id = cardId;

  messageElement.innerHTML = `
    <div class="card-header bg-dark text-white d-flex align-items-center py-2">
      <i class="bi bi-clock-history me-2 text-warning"></i>
      <span class="fw-bold small text-white">लाइव डेटा पोलिंग मैनेजर (Live Refresh Controller)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-2">लाइव API या डेटाबेस से ऑटो-अपडेट को चैट से नियंत्रित करें:</p>
      
      <div class="mb-2">
        <label class="form-label small fw-bold text-dark mb-1">1. API URL दर्ज करें</label>
        <input type="text" class="form-control form-control-sm" id="livePollingUrl-${cardId}" placeholder="https://api.example.com/data" value="https://jsonplaceholder.typicode.com/todos">
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold text-dark mb-1">2. रिफ्रेश अंतराल (Interval)</label>
        <div class="d-flex gap-1">
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-interval-${cardId}" data-sec="5">5s</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-interval-${cardId} active" data-sec="10">10s</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-interval-${cardId}" data-sec="30">30s</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-interval-${cardId}" data-sec="60">60s</button>
          <input type="number" class="form-control form-control-sm text-center py-1" id="livePollingCustomSec-${cardId}" style="width: 60px;" placeholder="Sec" value="10">
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-sm btn-success flex-grow-1 fw-bold" id="btnStartPolling-${cardId}">
          <i class="bi bi-play-fill"></i> चालू करें
        </button>
        <button class="btn btn-sm btn-warning fw-bold text-dark" id="btnPausePolling-${cardId}">
          <i class="bi bi-pause-fill"></i> Pause
        </button>
        <button class="btn btn-sm btn-danger fw-bold" id="btnStopPolling-${cardId}">
          <i class="bi bi-stop-fill"></i> बंद करें
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelPolling-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnCancel = document.getElementById(`btnCancelPolling-${cardId}`);
  const btnStart = document.getElementById(`btnStartPolling-${cardId}`);
  const btnPause = document.getElementById(`btnPausePolling-${cardId}`);
  const btnStop = document.getElementById(`btnStopPolling-${cardId}`);
  const inputUrl = document.getElementById(`livePollingUrl-${cardId}`);
  const inputCustomSec = document.getElementById(`livePollingCustomSec-${cardId}`);
  const intervalBtns = messageElement.querySelectorAll(`.btn-interval-${cardId}`);

  intervalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      intervalBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      inputCustomSec.value = btn.getAttribute("data-sec");
    });
  });

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("लाइव पोलिंग मैनेजर रद्द कर दिया गया।", "assistant");
  });

  btnStart.addEventListener("click", () => {
    const url = inputUrl.value.trim();
    const intervalSec = parseInt(inputCustomSec.value, 10);

    if (!url) {
      alert("कृपया एक वैध API URL दर्ज करें!");
      return;
    }

    if (isNaN(intervalSec) || intervalSec <= 0) {
      alert("कृपया सही अंतराल समय (सेकंड) दर्ज करें!");
      return;
    }

    startLiveUpdate(url, intervalSec);
    displayChatMessage(`मैंने सफलतापूर्वक **${url}** के लिए ऑटो-अपडेट अंतराल **${intervalSec} सेकंड** सेट कर दिया है। ⏰`, "assistant");
    
    btnStart.innerHTML = `<i class="bi bi-play-circle-fill"></i> चल रहा है...`;
    btnStart.disabled = true;
  });

  btnPause.addEventListener("click", () => {
    toggleLiveUpdatePause();
    displayChatMessage("मैंने लाइव अपडेट पॉज/रिज्यूम स्थिति को बदल दिया है। ⏸️", "assistant");
  });

  btnStop.addEventListener("click", () => {
    stopLiveUpdate();
    displayChatMessage("मैंने लाइव ऑटो-अपडेट को रोक दिया है। 🛑", "assistant");
    btnStart.disabled = false;
    btnStart.innerHTML = `<i class="bi bi-play-fill"></i> चालू करें`;
  });
}

/**
 * 9. Guided Textbox Creator Form
 */
export function renderInteractiveTextboxForm() {
  const chatHistoryDiv = document.getElementById("chatHistory");
  if (!chatHistoryDiv) return;

  const cardId = `textbox-form-${Date.now()}`;
  const messageElement = document.createElement("div");
  messageElement.className = `card border-primary mb-3 shadow-sm`;
  messageElement.id = cardId;

  messageElement.innerHTML = `
    <div class="card-header bg-primary text-white d-flex align-items-center py-2">
      <i class="bi bi-fonts me-2 text-warning"></i>
      <span class="fw-bold small text-white">टेक्स्टबॉक्स मेकर (Textbox Creator)</span>
    </div>
    <div class="card-body p-3">
      <p class="text-muted small mb-2">डैशबोर्ड पर एक नया इंटरैक्टिव टेक्स्टबॉक्स बनाने के लिए विवरण लिखें:</p>
      
      <div class="mb-2">
        <label class="form-label small fw-bold text-dark mb-1">1. टेक्स्टबॉक्स सामग्री (Content)</label>
        <textarea class="form-control form-control-sm" id="textboxContent-${cardId}" rows="3" placeholder="यहाँ अपना टेक्स्ट या HTML कंटेंट डालें...">नया टेक्स्टबॉक्स कंटेंट</textarea>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold text-dark mb-1">2. बैकग्राउंड रंग (Background Color)</label>
        <div class="d-flex flex-wrap gap-1 align-items-center mb-1">
          <input type="color" class="form-control form-control-color form-control-sm p-0 border-0" id="textboxBgColor-${cardId}" value="#fff3cd" style="width: 35px; height: 35px; cursor: pointer;">
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-color-preset-${cardId}" data-color="#ffffff">सफ़ेद</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-color-preset-${cardId}" data-color="#fff3cd">पीला</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-color-preset-${cardId}" data-color="#cfe2ff">नीला</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-color-preset-${cardId}" data-color="#d1e7dd">हरा</button>
          <button class="btn btn-xs btn-outline-secondary py-1 px-2 btn-color-preset-${cardId}" data-color="#f8d7da">लाल</button>
        </div>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-primary flex-grow-1 fw-bold" id="btnCreateTextbox-${cardId}">
          <i class="bi bi-plus-circle-fill"></i> टेक्स्टबॉक्स बनाएँ
        </button>
        <button class="btn btn-sm btn-outline-secondary" id="btnCancelTextbox-${cardId}">
          रद्द करें
        </button>
      </div>
    </div>
  `;

  chatHistoryDiv.appendChild(messageElement);
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

  const btnCancel = document.getElementById(`btnCancelTextbox-${cardId}`);
  const btnCreate = document.getElementById(`btnCreateTextbox-${cardId}`);
  const inputContent = document.getElementById(`textboxContent-${cardId}`);
  const inputBgColor = document.getElementById(`textboxBgColor-${cardId}`);
  const colorPresets = messageElement.querySelectorAll(`.btn-color-preset-${cardId}`);

  colorPresets.forEach(btn => {
    btn.addEventListener("click", () => {
      inputBgColor.value = btn.getAttribute("data-color");
    });
  });

  btnCancel.addEventListener("click", () => {
    messageElement.remove();
    displayChatMessage("टेक्स्टबॉक्स निर्माण रद्द कर दिया गया।", "assistant");
  });

  btnCreate.addEventListener("click", () => {
    const content = inputContent.value.trim();
    const bgColor = inputBgColor.value;

    if (!content) {
      alert("कृपया टेक्स्टबॉक्स की सामग्री खाली न छोड़ें!");
      return;
    }

    // Centered or random coordinate for the new textbox
    const x = 150 + Math.random() * 100;
    const y = 150 + Math.random() * 100;

    createBox(x, y, 0, `<p>${content}</p>`, bgColor, "slide-in-up");
    displayChatMessage(`मैंने सफलतापूर्वक डैशबोर्ड पर एक नया **टेक्स्टबॉक्स** बना दिया है! 📝 आप इसे ड्रैग करके स्थान दे सकते हैं।`, "assistant");

    messageElement.querySelectorAll("input, select, textarea, button").forEach(el => el.disabled = true);
    btnCreate.innerHTML = `<i class="bi bi-check-circle-fill"></i> बना दिया गया!`;
    btnCreate.className = "btn btn-sm btn-secondary flex-grow-1 text-white";
    btnCancel.style.display = "none";
  });
}
