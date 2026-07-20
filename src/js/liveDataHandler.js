// js/liveDataHandler.js

import { showMessage } from './utils.js';
import { updateDataAndUI } from '../store/DataHandler.js';
import { plotAll } from './charts.js';
import { mapApiData } from './DataMapper.js';

let apiIntervalId = null;
let abortController = null;
let isPaused = false;

// -----------------------------
// API डेटा fetch करना
// -----------------------------
export async function fetchDataFromApi(apiUrl, options = {}, retryCount = 0, maxRetries = 3) {
    if (!apiUrl) {
        showMessage("API URL खाली है। कृपया एक वैध URL दर्ज करें।", "warning");
        return false;
    }
    
    if (abortController) abortController.abort(); // previous request cancel करें
    abortController = new AbortController();
    const { signal } = abortController;
    
    // Construct final URL with cache buster if enabled
    let finalUrl = apiUrl;
    if (options.cacheBuster) {
        const timestamp = Date.now();
        finalUrl += (finalUrl.includes("?") ? "&" : "?") + `_=${timestamp}`;
    }

    // Set up request options
    const fetchOptions = {
        method: options.method || 'GET',
        signal
    };

    // Custom headers handling
    if (options.headers) {
        try {
            fetchOptions.headers = typeof options.headers === 'string' 
                ? JSON.parse(options.headers) 
                : options.headers;
        } catch (e) {
            console.error("Custom headers JSON parsing failed:", e);
        }
    }

    try {
        const response = await fetch(finalUrl, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        const dataText = await response.text();
        let apiData = [];
        
        if (contentType?.includes("application/json") || dataText.trim().startsWith("{") || dataText.trim().startsWith("[")) {
            const jsonData = JSON.parse(dataText);
            apiData = mapApiData(jsonData, options.dataPath || '').data;
            
        } else if (contentType?.includes("text/csv")) {
            if (typeof Papa === 'undefined') {
                throw new Error("PapaParse loaded नहीं है। HTML में <script src='papaparse.min.js'> डालें।");
            }
            const parsed = Papa.parse(dataText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });
            apiData = parsed.data;
            
        } else if (contentType?.includes("text/plain")) {
            try {
                const jsonData = JSON.parse(dataText);
                apiData = mapApiData(jsonData, options.dataPath || '').data;
            } catch {
                throw new Error("API ने सादा टेक्स्ट लौटाया जो कि JSON फॉर्मेट में नहीं है।");
            }
        } else {
            // Fallback: try to parse as JSON first, then CSV
            try {
                const jsonData = JSON.parse(dataText);
                apiData = mapApiData(jsonData, options.dataPath || '').data;
            } catch {
                if (typeof Papa !== 'undefined') {
                    const parsed = Papa.parse(dataText, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true
                    });
                    apiData = parsed.data;
                } else {
                    throw new Error(`असमर्थित डेटा फॉर्मेट: ${contentType || 'नहीं मिला'}`);
                }
            }
        }
        
        if (apiData && apiData.length > 0) {
            updateDataAndUI(apiData, null, true);
            showMessage("API से लाइव डेटा सफलतापूर्वक लोड हो गया है!", "success");
            
            const statusContainer = document.getElementById('liveStatusContainer');
            const statusRecords = document.getElementById('liveStatusRecords');
            const statusLastSync = document.getElementById('liveStatusLastSync');
            
            if (statusContainer) statusContainer.style.display = 'block';
            if (statusRecords) statusRecords.textContent = `${apiData.length} पंक्तियाँ (rows)`;
            if (statusLastSync) statusLastSync.textContent = new Date().toLocaleTimeString();
            
            return true;
        } else {
            throw new Error("API से कोई डेटा नहीं मिला या गलत डेटा पाथ दिया गया।");
        }
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('पिछली API कॉल रद्द कर दी गई।');
            return false;
        }
        
        console.error("API से डेटा प्राप्त करने में त्रुटि:", error);
        
        if (retryCount < maxRetries) {
            console.warn(`Retrying API fetch... (${retryCount + 1})`);
            await new Promise(r => setTimeout(r, 2000)); // 2 सेकंड delay
            return fetchDataFromApi(apiUrl, options, retryCount + 1, maxRetries);
        } else {
            showMessage(`API fetch failed: ${error.message}`, "danger");
            stopLiveUpdate();
            return false;
        }
    }
}

// -----------------------------
// Live update शुरू करना
// -----------------------------
export function startLiveUpdate(apiUrl, intervalInSeconds, options = {}) {
    stopLiveUpdate(); // previous interval clean करें
    
    isPaused = false;
    
    const statusContainer = document.getElementById('liveStatusContainer');
    const badge = document.getElementById('liveStatusBadge');
    if (statusContainer) statusContainer.style.display = 'block';
    if (badge) {
        badge.className = 'badge bg-success';
        badge.innerHTML = '<span class="spinner-grow spinner-grow-sm me-1" style="width: 8px; height: 8px;" role="status"></span>सक्रिय (Active)';
    }
    
    fetchDataFromApi(apiUrl, options).then(success => {
        if (success && intervalInSeconds > 0) {
            apiIntervalId = setInterval(async () => {
                if (!isPaused) await fetchDataFromApi(apiUrl, options);
            }, intervalInSeconds * 1000);
            
            showMessage(`लाइव डेटा अपडेट शुरू किया गया: हर ${intervalInSeconds} सेकंड में।`, "success");
        } else if (success) {
            showMessage("पहला डेटा लोड हो गया है, लेकिन इंटरवल 0 होने के कारण लाइव अपडेट शुरू नहीं हुआ है।", "info");
        }
    });
}

// -----------------------------
// Live update बंद करना
// -----------------------------
export function stopLiveUpdate() {
    if (apiIntervalId) {
        clearInterval(apiIntervalId);
        apiIntervalId = null;
        showMessage("लाइव डेटा अपडेट बंद कर दिया गया है।", "info");
    }
    const badge = document.getElementById('liveStatusBadge');
    if (badge) {
        badge.className = 'badge bg-secondary';
        badge.innerHTML = 'निष्क्रिय (Stopped)';
    }
}

// -----------------------------
// Live update pause/resume
// -----------------------------
export function toggleLiveUpdatePause() {
    isPaused = !isPaused;
    showMessage(isPaused ? "लाइव अपडेट pause कर दिया गया।" : "लाइव अपडेट resume किया गया।", "info");
}
