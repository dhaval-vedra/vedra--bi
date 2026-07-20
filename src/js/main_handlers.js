// js/main_handlers.js

// Vedra Bi की main.js फ़ाइल का दूसरा हिस्सा।
// इसमें डेटा प्रबंधन, चार्ट निर्माण, AI चैट, और डैशबोर्ड दृश्य के लिए सभी इवेंट हैंडलर शामिल हैं।

import { showMessage, attachEventListener, exportCsv, exportExcel, exportPdf, toggleTheme } from './utils.js';
// आपकी मेन फ़ाइल (जहाँ आप ये इम्पोर्ट कर रहे थे)

// Core Data Logic and State Management (from DataHandler.js)
import {
    setCurrentUserId,
    initData,
    handleFile,
    syncGoogleSheet,
    searchTable,
    changePage,
    applyFiltersAndSort,
    saveData,
    filteredData, // State variable
    headers,     // State variable
    saveDashboardSettings,
    loadDashboardSettings,
    updatePythonModeUI,
    syncDataToBackend
    //populateAddDataForm
} from '../store/DataHandler.js'; 

// UI and Controls Logic (from UIHandler.js)
import {

   populateAddDataForm,
    displayStats
} from '../store/UIHandler.js'; 

//import {} from './dataTebledisplay.js'

import { addVisualization, plotAll, clearChart, applyAdvancedChartSettings, visualizations, arrangeChartsInGrid, toggleChartPin, editChart } from './charts.js';
import { showKpiLayoutPopover } from './kpiSparklines.js';
import { sendChatMessage, clearChatHistory, renderInteractiveChartForm, renderInteractiveEffectForm, renderInteractiveThemeForm, renderInteractiveLayoutForm, renderInteractiveDataForm, renderInteractiveExportForm, renderInteractiveLivePollingForm, renderInteractiveTextboxForm } from './chat.js';
import { fetchDataFromApi, startLiveUpdate, stopLiveUpdate } from './liveDataHandler.js';
import { triggerMockDataUpdate, startMockAutoUpdate, stopMockAutoUpdate } from './mockDataGenerator.js';
import { populateColumnDragLists, getChartColumns, populateDropZones } from './chartcolomdrag.js';
import { renderDashboardChartOverview } from './chartContainerColors.js';
import { chartEffectsTemplates, renderDashboardChartList } from './chartEffects.js';
import { auth } from './utils.js';
import { exportDashboardToPDF, exportDashboardToPNG, exportFilteredDataToCSV } from './reportExporter.js';
import { initGlobalFilters } from './globalFilters.js';


// ECharts और Plotly को आयात करें (या मान लें कि वे वैश्विक रूप से उपलब्ध हैं, लेकिन मॉडर्न JS में आयात करना बेहतर है)
// यदि वे वैश्विक हैं, तो यह ठीक है, अन्यथा उन्हें आयात करना होगा।
// const echarts = window.echarts;
// const Plotly = window.Plotly;


/**
 * सभी वैश्विक इवेंट हैंडलर संलग्न करता है।
 * @param {Array} allActiveChartInstances - main_core.js से सक्रिय चार्ट इंस्टेंस का ऐरे
 */
export function attachGlobalEventHandlers(allActiveChartInstances) {

    // केवल 'index.html' या रूट पर ही इवेंट हैंडलर संलग्न करें
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        // Initialize Global Dashboard Filters
        initGlobalFilters();

        // ====================================================================
        // 1. डेटा अपलोड और प्रबंधन हैंडलर
        // ====================================================================
        
        // फाइल अपलोड
        attachEventListener('fileInput', 'change', async (e) => {
            await handleFile(e);
            if (headers.length > 0) {
                populateColumnDragLists(headers); // ड्रैग-एंड-ड्रॉप लिस्ट को पॉपुलेट करें
            }
        });
        
        // नया डेटा जोड़ें
        attachEventListener('addDataBtn', 'click', populateAddDataForm);
        attachEventListener('addDataBtnSidebar', 'click', populateAddDataForm);
        attachEventListener('saveData', 'click', saveData);
        attachEventListener('downloadTemplate', 'click', () => downloadTemplate());
        attachEventListener('downloadTemplateSidebar', 'click', () => downloadTemplate());
        
        // लाइव डेटा/API (एडवांस्ड फीचर्स के साथ)
        attachEventListener('fetchDataFromApiBtn', 'click', async () => {
            const apiUrl = document.getElementById('apiInput').value;
            const interval = parseInt(document.getElementById('updateInterval').value, 10);
            const dataPath = document.getElementById('apiDataPath').value;
            const method = document.getElementById('apiMethod').value;
            const headersRaw = document.getElementById('apiHeaders').value;
            const cacheBuster = document.getElementById('cacheBuster').checked;
            
            let parsedHeaders = null;
            if (headersRaw && headersRaw.trim()) {
                try {
                    parsedHeaders = JSON.parse(headersRaw);
                } catch (e) {
                    showMessage("कस्टम हेडर JSON अमान्य है। कृपया फॉर्मेट ठीक करें।", "danger");
                    return;
                }
            }
            
            if (apiUrl) {
                startLiveUpdate(apiUrl, interval, {
                    method,
                    dataPath,
                    headers: parsedHeaders,
                    cacheBuster
                });
            } else {
                showMessage("कृपया एक API URL दर्ज करें।", "warning");
            }
        });
        
        attachEventListener('stopLiveUpdateBtn', 'click', stopLiveUpdate);

        // API रेडीमेड प्रीसेट चयन हैंडलर
        attachEventListener('presetApiSelect', 'change', (e) => {
            const val = e.target.value;
            const apiInput = document.getElementById('apiInput');
            const apiDataPath = document.getElementById('apiDataPath');
            const apiMethod = document.getElementById('apiMethod');
            const apiHeaders = document.getElementById('apiHeaders');
            const updateInterval = document.getElementById('updateInterval');
            
            if (val === 'crypto-bitcoin') {
                apiInput.value = 'https://api.coindesk.com/v1/bpi/currentprice.json';
                apiDataPath.value = 'bpi';
                apiMethod.value = 'GET';
                apiHeaders.value = '{"Accept": "application/json"}';
                updateInterval.value = '30';
            } else if (val === 'crypto-market') {
                apiInput.value = 'https://api.coincap.io/v2/assets';
                apiDataPath.value = 'data';
                apiMethod.value = 'GET';
                apiHeaders.value = '';
                updateInterval.value = '45';
            } else if (val === 'weather-feed') {
                apiInput.value = 'https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&hourly=temperature_2m';
                apiDataPath.value = 'hourly';
                apiMethod.value = 'GET';
                apiHeaders.value = '';
                updateInterval.value = '60';
            } else if (val === 'random-user-sales') {
                apiInput.value = 'https://jsonplaceholder.typicode.com/todos';
                apiDataPath.value = '';
                apiMethod.value = 'GET';
                apiHeaders.value = '';
                updateInterval.value = '90';
            } else {
                apiInput.value = '';
                apiDataPath.value = '';
                apiMethod.value = 'GET';
                apiHeaders.value = '';
            }
        });

        // स्मार्ट मॉक डेटा जेनरेटर
        attachEventListener('generateMockDataBtn', 'click', () => {
            const theme = document.getElementById('mockThemeSelect').value;
            const rowCount = parseInt(document.getElementById('mockRowCount').value, 10) || 15;
            const autoRefresh = document.getElementById('mockAutoRefresh').checked;
            
            if (autoRefresh) {
                startMockAutoUpdate(theme, rowCount, 10000);
            } else {
                stopMockAutoUpdate();
                triggerMockDataUpdate(theme, rowCount);
            }
        });

        // एडवांस्ड ड्रैग-एंड-ड्रॉप जोन फ़ाइल अपलोड हैंडलर
        const dragZone = document.getElementById('file-drag-zone');
        if (dragZone) {
            dragZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dragZone.classList.add('dragover');
            });
            dragZone.addEventListener('dragleave', () => {
                dragZone.classList.remove('dragover');
            });
            dragZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                dragZone.classList.remove('dragover');
                if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) {
                        fileInput.files = e.dataTransfer.files;
                        fileInput.dispatchEvent(new Event('change'));
                    }
                }
            });
            dragZone.addEventListener('click', () => {
                document.getElementById('fileInput')?.click();
            });
        }
        
        // Google Sheet Live Sync Click Listener
        attachEventListener('syncGoogleSheetBtn', 'click', async () => {
            const urlInput = document.getElementById('googleSheetUrlInput');
            if (urlInput) {
                const url = urlInput.value.trim();
                const success = await syncGoogleSheet(url);
                if (success) {
                    urlInput.value = '';
                }
            }
        });
        
        // डेटा एडिट करें
        const handleEditDataClick = () => {
            if (auth.currentUser) {
                window.location.href = 'edit_data.html';
            } else {
                showMessage("डेटा एडिट करने के लिए कृपया लॉगिन करें।", "warning");
                window.location.href = 'login.html';
            }
        };
        attachEventListener('editDataBtn', 'click', handleEditDataClick);
        attachEventListener('editDataBtnSidebar', 'click', handleEditDataClick);
        // ====================================================================
// 2. डेटा टेबल इंटरेक्शन हैंडलर
// ====================================================================
attachEventListener('searchInput', 'input', searchTable);
attachEventListener('searchBtn', 'click', searchTable);
attachEventListener('prevPage', 'click', () => changePage(-1));
attachEventListener('nextPage', 'click', () => changePage(1));
attachEventListener('exportCsv', 'click', () => exportCsv(filteredData));
attachEventListener('exportExcel', 'click', () => exportExcel(filteredData));
attachEventListener('exportPdf', 'click', () => exportPdf(filteredData, headers));
attachEventListener('applyFilterSort', 'click', applyFiltersAndSort);
attachEventListener('forcePythonBackendBtn', 'change', () => {
    updatePythonModeUI();
    syncDataToBackend();
});

// ✅ नया reset button event listener जोड़ें
attachEventListener('resetFiltersBtn', 'click', () => resetAllFilters(headers));

attachEventListener('statsCol', 'change', displayStats);
        // ====================================================================
        // 3. चार्ट और विज़ुअलाइज़ेशन हैंडलर
        // ====================================================================
        
        // विज़ुअलाइज़ेशन जोड़ें
        attachEventListener('addVisualizationBtn', 'click', () => {
            const selectedColumns = getChartColumns();
            const xAxisCol = selectedColumns.xAxis;
            const yAxisCols = selectedColumns.yAxes;
            const zAxisCol = selectedColumns.zAxis;
            
            if (!xAxisCol || yAxisCols.length === 0) {
                showMessage("कृपया X और Y-अक्ष के लिए कॉलम ड्रैग करके डालें।", "warning");
                return;
            }

            const chartType = document.getElementById('chartType').value;
            if ((chartType === 'bar3D' || chartType === 'line3D') && !zAxisCol) {
                showMessage("3D चार्ट के लिए Z-अक्ष कॉलम आवश्यक है। कृपया एक कॉलम ड्रैग करके डालें।", "warning");
                return;
            }

            addVisualization(xAxisCol, yAxisCols, zAxisCol); 
            // डैशबोर्ड की न्यूनतम ऊंचाई बढ़ाएँ
            const visualizationsDiv = document.getElementById('dashboardContent') || document.getElementById('visualizations');
            if (visualizationsDiv) {
                const currentHeight = visualizationsDiv.offsetHeight;
                const newHeight = currentHeight + 500;
                visualizationsDiv.style.minHeight = `${newHeight}px`;
            }
        });

        // एडवांस्ड चार्ट सेटिंग्स लागू करें
        attachEventListener('animationDuration', 'input', function() {
            document.getElementById('animationDurationValue').textContent = this.value;
        });
        attachEventListener('applyChartSettings', 'click', applyAdvancedChartSettings);
        
        // थीम टॉगल करें (थीम बदलने पर सभी चार्ट री-प्लॉट करें)
        const handleToggleThemeClick = () => {
            // main_core.js में उपलब्ध है
            toggleTheme();
            plotAll();
        };
        attachEventListener('toggleTheme', 'click', handleToggleThemeClick);
        attachEventListener('toggleThemeSidebar', 'click', handleToggleThemeClick);

        // ====================================================================
        // 4. चार्ट कंटेनर रंग/शैली हैंडलर
        // ====================================================================

        // रेडीमेड टेम्पलेट्स लागू करें
        attachEventListener('applyChartContainerColorBtn', 'click', () => {
            const scopeAllChartsRadio = document.getElementById('scopeAllCharts');
            const selectedChartContainerColorTemplateId = document.querySelector('#chartContainerColorGallery .selected')?.dataset.templateId || 'default-container-color';
            const applyToAll = scopeAllChartsRadio?.checked;
            let selectedChartIds = [];
            
            if (!applyToAll) {
                const checkboxes = document.querySelectorAll('#chartSelectionList input[type="checkbox"]:checked');
                selectedChartIds = Array.from(checkboxes).map(checkbox => checkbox.value);
                if (selectedChartIds.length === 0) {
                    showMessage("कृपया रंग लागू करने के लिए कम से कम एक चार्ट चुनें।", "warning");
                    return;
                }
            }
            
            applyChartContainerColor(selectedChartContainerColorTemplateId, allActiveChartInstances, applyToAll, selectedChartIds);
            
            const offcanvasSidebar = document.getElementById('offcanvasSidebar');
            bootstrap.Offcanvas.getInstance(offcanvasSidebar)?.hide();
            showMessage("चार्ट कंटेनर रंग सफलतापूर्वक लागू किया गया है!", "success");
        });

        // कस्टम कोड लागू करें
        attachEventListener('applyCustomChartContainerCodeBtn', 'click', () => {
            try {
                const codeString = document.getElementById('customChartContainerCode').value;
                if (!codeString.trim()) {
                    showMessage("कृपया लागू करने के लिए कुछ कोड दर्ज करें।", "warning");
                    return;
                }

                const customOptions = JSON.parse(codeString);
                const scopeAllChartsRadio = document.getElementById('scopeAllCharts');
                const applyToAll = scopeAllChartsRadio?.checked;
                let selectedChartIds = [];

                if (!applyToAll) {
                    const checkboxes = document.querySelectorAll('#chartSelectionList input[type="checkbox"]:checked');
                    selectedChartIds = Array.from(checkboxes).map(checkbox => checkbox.value);
                    if (selectedChartIds.length === 0) {
                        showMessage("कृपया रंग लागू करने के लिए कम से कम एक चार्ट चुनें।", "warning");
                        return;
                    }
                }

                applyCustomChartContainerColor(customOptions, allActiveChartInstances, applyToAll, selectedChartIds);

                const offcanvasSidebar = document.getElementById('offcanvasSidebar');
                bootstrap.Offcanvas.getInstance(offcanvasSidebar)?.hide();
                showMessage("कस्टम कंटेनर शैली सफलतापूर्वक लागू की गई!", "success");

            } catch (e) {
                showMessage("त्रुटि: अमान्य JSON कोड। कृपया इसे ठीक करें।", "danger");
                console.error(e);
            }
        });


        // ====================================================================
        // 5. चार्ट इफ़ेक्ट्स हैंडलर
        // ====================================================================

        // Note: The applyChartEffects handler is now fully handled in chartEffects.js with advanced features (Glassmorphism, Gradients, etc.) and automatic cleanup to prevent style clashes. The duplicate basic handler is removed here to prevent collision.


        // ====================================================================
        // 6. AI Chat Assistant हैंडलर
        // ====================================================================
        attachEventListener('sendChatBtn', 'click', sendChatMessage);
        attachEventListener('clearChatBtn', 'click', clearChatHistory);
        attachEventListener('chatInput', 'keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
        
        // एजेंट कमांड सेंटर (Agent Command Center) बटन्स के लिए इवेंट्स
        attachEventListener('agentCmdChart', 'click', renderInteractiveChartForm);
        attachEventListener('agentCmdEffect', 'click', renderInteractiveEffectForm);
        attachEventListener('agentCmdTheme', 'click', renderInteractiveThemeForm);
        attachEventListener('agentCmdLayout', 'click', renderInteractiveLayoutForm);
        attachEventListener('agentCmdData', 'click', renderInteractiveDataForm);
        attachEventListener('agentCmdLive', 'click', renderInteractiveLivePollingForm);
        attachEventListener('agentCmdTextbox', 'click', renderInteractiveTextboxForm);
        attachEventListener('agentCmdExport', 'click', renderInteractiveExportForm);


        // ====================================================================
        // 7. डैशबोर्ड दृश्य नियंत्रण हैंडलर
        // ====================================================================
        
        // ====================================================================
        // 7. डैशबोर्ड दृश्य नियंत्रण हैंडलर (Advanced View & Grid Control)
        // ====================================================================
        
        attachEventListener('toggleVisualizations', 'change', (e) => {
            const el = document.getElementById('visualizationsSection');
            if (el) el.style.display = e.target.checked ? 'block' : 'none';
        });
        attachEventListener('toggleDataTable', 'change', (e) => {
            const el = document.getElementById('dataTableSection');
            if (el) el.style.display = e.target.checked ? 'block' : 'none';
        });
        attachEventListener('toggleChat', 'change', (e) => {
            const el = document.getElementById('chatAssistantSection');
            if (el) el.style.display = e.target.checked ? 'block' : 'none';
        });
        attachEventListener('toggleTextboxes', 'change', (e) => {
            const boxes = document.querySelectorAll('.box');
            boxes.forEach(box => {
                box.style.display = e.target.checked ? 'block' : 'none';
            });
        });
        attachEventListener('toggleMainHeader', 'change', (e) => {
            const header = document.getElementById('mainVisualizationsHeader');
            if (header) header.style.display = e.target.checked ? 'block' : 'none';
        });

        // Grid arrangers
        attachEventListener('btnArrange1Col', 'click', () => {
            arrangeChartsInGrid(1);
        });
        attachEventListener('btnArrange2Col', 'click', () => {
            arrangeChartsInGrid(2);
        });
        attachEventListener('btnArrange3Col', 'click', () => {
            arrangeChartsInGrid(3);
        });

        // Presentation mode
        attachEventListener('btnPresentationMode', 'click', () => {
            const container = document.getElementById('dashboardContent');
            if (!container) return;
            try {
                if (!document.fullscreenElement) {
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        container.msRequestFullscreen();
                    }
                    showMessage("प्रेजेंटेशन मोड चालू: ESC दबाकर बाहर निकलें", "success");
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            } catch (err) {
                console.error("Fullscreen error:", err);
                document.body.classList.toggle('presentation-fallback-active');
                showMessage("प्रेजेंटेशन मोड सक्रिय किया गया!", "info");
            }
        });

        // Lock Layout Synchronizer
        attachEventListener('toggleLockModeViewCheckbox', 'change', () => {
            const lockBtn = document.getElementById('toggleLockModeBtn');
            if (lockBtn) {
                lockBtn.click();
            }
        });

        // Backdrop canvas themes
        attachEventListener('canvasBackdropTheme', 'change', (e) => {
            const theme = e.target.value;
            const container = document.getElementById('dashboardContent');
            if (!container) return;

            container.style.background = '';
            container.style.color = '';
            container.style.backdropFilter = '';
            container.style.webkitBackdropFilter = '';
            container.style.boxShadow = '';

            if (theme === 'dark') {
                container.style.background = '#141517';
                container.style.color = '#f8f9fa';
            } else if (theme === 'sepia') {
                container.style.background = '#f4eedb';
                container.style.color = '#433422';
            } else if (theme === 'blue-glow') {
                container.style.background = 'radial-gradient(circle, #0f172a 0%, #030712 100%)';
                container.style.color = '#38bdf8';
            } else if (theme === 'glassy') {
                container.style.background = 'rgba(255, 255, 255, 0.4)';
                container.style.backdropFilter = 'blur(16px)';
                container.style.webkitBackdropFilter = 'blur(16px)';
                container.style.boxShadow = 'inset 0 0 50px rgba(255, 255, 255, 0.5)';
            }

            showMessage(`कैनवास थीम लागू की गई: ${theme}`, 'success');
        });

        attachEventListener('downloadFullDashboard', 'click', () => {
            exportDashboardToPDF();
        });

        attachEventListener('exportPDFBtn', 'click', (e) => {
            e.preventDefault();
            exportDashboardToPDF();
        });

        attachEventListener('exportPNGDashboardBtn', 'click', (e) => {
            e.preventDefault();
            exportDashboardToPNG();
        });

        attachEventListener('exportCSVFilteredBtn', 'click', (e) => {
            e.preventDefault();
            exportFilteredDataToCSV();
        });


        // ====================================================================
        // 8. म्यूटेशन ऑब्जर्वर (चार्ट जोड़ना/हटाना/रीसाइज़ करना) - डिबाउंस और ऑप्टिमाइज्ड
        // ====================================================================
        const visualizationsDiv = document.getElementById('dashboardContent') || document.getElementById('visualizations');
        if (visualizationsDiv) {
            // स्थानीय डिबाउंस फ़ंक्शन
            const debounce = (func, wait) => {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            };

            const debouncedUpdate = debounce(() => {
                const chartListEl = document.getElementById('chartSelectionList');
                const effectListEl = document.getElementById('chartSelectionListEffects');
                
                // साइडबार लिस्ट अपडेट करें
                if (chartListEl) {
                    renderDashboardChartOverview(chartListEl, allActiveChartInstances);
                }
                if (effectListEl) {
                    renderDashboardChartList(effectListEl);
                }
                
                // सभी चार्ट को रीसाइज़ करें (यह सुनिश्चित करने के लिए कि वे लेआउट परिवर्तनों का जवाब दें)
                visualizations.forEach(config => {
                    const chartDom = document.getElementById(config.id);
                    if (chartDom) {
                        // ECharts Resize
                        const chartInstance = echarts.getInstanceByDom(chartDom);
                        if (chartInstance) {
                            chartInstance.resize();
                        } 
                        // Plotly Resize
                        else if (['candlestick', 'ohlc'].includes(config.type)) {
                            const container = document.getElementById(`container-${config.id}`);
                            if (container) {
                                Plotly.relayout(chartDom, {
                                    width: parseFloat(container.style.width) || 400,
                                    height: (parseFloat(container.style.height) || 300) - 70 // Adjust for title/buttons
                                });
                            }
                        }
                    }
                });
            }, 250); // 250ms डिबाउंस बार-बार होने वाले रेंडर/रीसाइज़ को रोकता है और लैग हटाता है

            const visualizationsObserver = new MutationObserver((mutationsList) => {
                let hasChildListMutation = false;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        hasChildListMutation = true;
                        break;
                    }
                }
                if (hasChildListMutation) {
                    debouncedUpdate();
                }
            });
            visualizationsObserver.observe(visualizationsDiv, { childList: true });
        }


        // ====================================================================
        // 9. चार्ट क्रियाएँ (डाउनलोड, डिलीट, फ़ुलस्क्रीन, एडिट)
        // ====================================================================

        if (visualizationsDiv && !visualizationsDiv.__clickListenerAttached) {
            visualizationsDiv.addEventListener('click', (event) => {
                const target = event.target.closest('button');
                if (!target) return;
                
                const chartId = target.dataset.chartId;
                if (!chartId) return;
                
                const chartDom = document.getElementById(chartId);
                const chartConfig = visualizations.find(v => v.id === chartId);
                const isPlotlyChart = chartConfig && ['candlestick', 'ohlc'].includes(chartConfig.type);

                if (target.classList.contains('download-chart')) {
                    if (!chartDom) return;

                    if (isPlotlyChart) {
                        Plotly.downloadImage(chartDom, {
                            format: 'png',
                            filename: chartId,
                            width: chartDom.offsetWidth,
                            height: chartDom.offsetHeight
                        }).then(() => showMessage("Plotly चार्ट सफलतापूर्वक डाउनलोड किया गया!", "success"))
                          .catch(error => showMessage("Plotly चार्ट डाउनलोड करने में त्रुटि: " + error.message, "danger"));
                    } else {
                        const chartInstance = echarts.getInstanceByDom(chartDom);
                        if (chartInstance) {
                            const link = document.createElement('a');
                            link.href = chartInstance.getDataURL({
                                type: 'png',
                                pixelRatio: 2,
                                backgroundColor: document.body.classList.contains('dark-theme') ? '#212529' : '#fff'
                            });
                            link.download = `${chartId}.png`;
                            link.click();
                            showMessage("ECharts सफलतापूर्वक डाउनलोड किया गया!", "success");
                        } else {
                            showMessage("चार्ट डाउनलोड करने में त्रुटि: ECharts इंस्टेंस नहीं मिला।", "danger");
                        }
                    }
                } else if (target.classList.contains('delete-chart')) {
                    clearChart(chartId);
                    showMessage("चार्ट सफलतापूर्वक हटाया गया!", "info");
                } else if (target.classList.contains('fullscreen-chart')) {
                    const chartContainer = document.getElementById(`container-${chartId}`);
                    if (!chartContainer) return;
                    
                    if (!document.fullscreenElement) {
                        chartContainer.requestFullscreen().then(() => {
                            // रीसाइज़ लॉजिक
                            if (isPlotlyChart) {
                                Plotly.relayout(chartDom, {
                                    width: window.innerWidth,
                                    height: window.innerHeight - 70
                                });
                            } else {
                                echarts.getInstanceByDom(chartDom)?.resize();
                            }
                        });
                    } else {
                        document.exitFullscreen().then(() => {
                             // रीसाइज़ लॉजिक (वापस सामान्य आकार में)
                            const container = document.getElementById(`container-${chartId}`);
                            if (isPlotlyChart) {
                                Plotly.relayout(chartDom, {
                                    width: parseFloat(container.style.width),
                                    height: parseFloat(container.style.height) - 70
                                });
                            } else {
                                echarts.getInstanceByDom(chartDom)?.resize();
                            }
                        });
                    }
                } else if (target.classList.contains('edit-chart')) { // Edit Chart Button
                    if (chartConfig) {
                        editChart(chartId);
                    }
                } else if (target.classList.contains('edit-kpi-layout')) {
                    const chartContainer = document.getElementById(`container-${chartId}`);
                    if (chartContainer && chartConfig) {
                        showKpiLayoutPopover(target, chartConfig, chartContainer);
                    }
                } else if (target.classList.contains('pin-chart')) {
                    toggleChartPin(chartId);
                }
            });
            visualizationsDiv.__clickListenerAttached = true;
        }
    }
    
    // ====================================================================
    // 10. लॉगआउट हैंडलर (हमेशा उपलब्ध)
    // ====================================================================
    attachEventListener('logoutBtn', 'click', async () => {
        try {
            localStorage.removeItem('vedrabi_use_sandbox');
            await auth.signOut();
            showMessage("सफलतापूर्वक लॉगआउट किया!", "info");
            // Offcanvas को बंद करें यदि वह खुला है
            const offcanvasSidebar = document.getElementById('offcanvasSidebar');
            if (offcanvasSidebar && typeof bootstrap !== 'undefined') {
                bootstrap.Offcanvas.getInstance(offcanvasSidebar)?.hide();
            }
        } catch (error) {
            showMessage("लॉगआउट करते समय त्रुटि हुई: " + error.message, "danger");
        }
    });

}

