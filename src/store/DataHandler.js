// DataHandler.js (Core Data Management)

import { auth, db, showMessage } from '../js/utils.js';
import { plotAll, visualizations, chartGlobalSettings } from '../js/charts.js';
import { generateSummary } from '../js/chat.js';
import { 
    applyFiltersAndSort as applyFilters, 
    getCurrentFilterState,
    resetAllFilters as resetFilterUI // UI reset function
} from '../js/filter.js';
import { updateKPICards } from '../js/kpiSparklines.js';

// UIHandler functions (for updating UI after data change)
import { 
    updateControls, 
    updateTableAndUI, 
    updatePaginationAndFilterUI, 
    clearAddDataForm, 
    clearSummary 
} from './UIHandler.js'; 

// Configuration constants
const CONFIG = {
    MAX_FILE_SIZE: 150 * 1024 * 1024, // 150MB to support large files
    MAX_ROWS: 1000000, // 1M rows
    DEBOUNCE_DELAY: 300,
    ROWS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
    AUTO_SAVE_DELAY: 2000,
    BATCH_OPERATION_DELAY: 50
};

const SUPPORTED_FILE_TYPES = {
    CSV: ['csv'],
    EXCEL: ['xlsx', 'xls'],
    JSON: ['json']
};

// Global State Variables
export let rawData = [];
export let filteredData = [];
export let savedFilteredData = [];
export let headers = [];
export let rowsPerPage = 10;
export function setRowsPerPage(val) {
    rowsPerPage = parseInt(val) || 10;
    currentPage = 1;
}
export let currentPage = 1;
export let currentDataForChat = [];
export let currentFilterState = null;

let currentUserId = null;
let searchTimeout = null;
let autoSaveTimeout = null;
let isDataModified = false;
export let isFilterActive = false;

// Operation flags to prevent concurrent executions (Concurrency Mutex)
let isOperationInProgress = false;
let pendingOperation = null; // 'applyFilters' या 'resetFilters'
let isResetting = false; // Flag to prevent infinite loop during reset

// ========================== CONFIGURATION & STATE ==========================

export function setCurrentUserId(userId) {
    currentUserId = userId;
}

export function getDisplayData() {
    return filteredData;
}

export function getRawData() {
    return rawData;
}

export function getHeaders() {
    return headers;
}

// ========================== NO DATA POPUP HANDLER ==========================

function showNoDataPopup() {
    // Check if we are on index.html page
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname === '';
    
    if (!isIndexPage) {
        console.log('No data popup skipped - not on index page');
        return;
    }

    // Create popup modal if it doesn't exist
    let noDataModal = document.getElementById('noDataModal');
    
    if (!noDataModal) {
        noDataModal = document.createElement('div');
        noDataModal.id = 'noDataModal';
        noDataModal.className = 'modal fade';
        noDataModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning">
                        <h5 class="modal-title">कोई डेटा नहीं मिला</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-3">
                            <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
                        </div>
                        <p class="mb-3">आपके पास अभी कोई डेटा उपलब्ध नहीं है। कृपया नया डेटा अपलोड करें या डेटा एडिट पेज पर जाएं।</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-primary" id="uploadDataBtn">
                            <i class="bi bi-upload me-2"></i>फ़ाइल अपलोड करें
                        </button>
                        <button type="button" class="btn btn-outline-primary" id="goToEditPageBtn">
                            <i class="bi bi-pencil-square me-2"></i>डेटा एडिट करें
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(noDataModal);
        
        // Add event listeners
        const modalInstance = new bootstrap.Modal(noDataModal);
        
        document.getElementById('uploadDataBtn').addEventListener('click', function() {
            modalInstance.hide();
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('goToEditPageBtn').addEventListener('click', function() {
            modalInstance.hide();
            window.location.href = 'edit_data.html';
        });
    }
    
    const modalInstance = new bootstrap.Modal(noDataModal);
    modalInstance.show();
}

function checkAndShowNoDataPopup() {
    // Check if we are on index.html page
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname === '';
    
    if (!isIndexPage) {
        console.log('No data check skipped - not on index page');
        return false;
    }

    if (rawData.length === 0) {
        // Show popup after a small delay to ensure UI is loaded
        setTimeout(() => {
            showNoDataPopup();
        }, 500);
        return true;
    }
    return false;
}

// ========================== INIT DATA ==========================

export async function initData() {
    try {
        // Reset all data states
        rawData = [];
        filteredData = [];
        savedFilteredData = [];
        headers.length = 0;
        currentDataForChat = [];
        currentFilterState = null;
        isDataModified = false;
        isFilterActive = false; 
        isOperationInProgress = false;
        pendingOperation = null;
        isResetting = false;

        showLoadingState();

        if (!currentUserId) {
            console.log("No user logged in. Data will not be loaded from Firebase.");
            // UI Handler will take care of populating controls and table display
            updateControls(headers);
            updateTableAndUI();
            
            // Check if no data and show popup (only on index.html)
            if (checkAndShowNoDataPopup()) {
                return;
            }
        }

        await loadUserDataFromFirebase();
        
        if (isFilterActive && savedFilteredData.length > 0) {
            filteredData = [...savedFilteredData];
            showMessage("सहेजे गए फ़िल्टर बहाल किए गए! अब फ़िल्टर्ड डेटा दिख रहा है।", "info");
        } else {
            filteredData = [...rawData];
            savedFilteredData = [...rawData];
            isFilterActive = false; 
        }
        
        currentDataForChat = [...filteredData];

        // UI Handler call to update controls, forms, and table
        updateControls(headers);
        await updateTableAndUI();

        // Update Python Backend mode UI and sync data if large
        try {
            updatePythonModeUI();
            await syncDataToBackend();
        } catch (pyErr) {
            console.warn("Python state init error:", pyErr);
        }

        // Check if no data and show popup (only on index.html)
        if (checkAndShowNoDataPopup()) {
            return;
        }

        if (filteredData.length > 0) {
            generateSummary(filteredData);
        }

        document.dispatchEvent(new CustomEvent('dataLoaded', {
            detail: { 
                rowCount: rawData.length, 
                filteredRowCount: filteredData.length,
                headers: headers,
                isFilterActive: isFilterActive
            }
        }));
        
    } catch (error) {
        console.error("Error initializing data:", error);
        showErrorState("Data initialize करने मे error आया: " + error.message);
        
        // Check if no data and show popup even in case of error (only on index.html)
        checkAndShowNoDataPopup();
    }
}

function showLoadingState() {
    const visualizationsDiv = document.getElementById('visualizations');
    const tableContainer = document.getElementById('tableContainer');
    
    const loadingHTML = `
        <div class="loading-spinner text-center p-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Data load हो रहा है...</p>
        </div>
    `;
    
    if (visualizationsDiv) visualizationsDiv.innerHTML = loadingHTML;
    if (tableContainer) tableContainer.innerHTML = loadingHTML;
}

function showErrorState(message) {
    const visualizationsDiv = document.getElementById('visualizations');
    const tableContainer = document.getElementById('tableContainer');
    
    const errorHTML = `
        <div class="error-state text-danger text-center p-4">
            <i class="bi bi-exclamation-triangle fs-1"></i>
            <p class="mt-2">${message}</p>
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="initData()">
                फिर try करें
            </button>
        </div>
    `;
    
    if (visualizationsDiv) visualizationsDiv.innerHTML = errorHTML;
    if (tableContainer) tableContainer.innerHTML = errorHTML;
}

// ========================== DASHBOARD SETTINGS & MULTI-DASHBOARD MANAGEMENT ==========================

export let dashboards = [];
export let activeDashboardId = 'default';

export function getDashboardsList() {
    return dashboards;
}

export function getActiveDashboardId() {
    return activeDashboardId;
}

export function getCurrentDashboardName() {
    const d = dashboards.find(dash => dash.id === activeDashboardId);
    return d ? d.name : 'डिफ़ॉल्ट डैशबोर्ड';
}

export async function createNewDashboard(name) {
    if (!name) name = `नया डैशबोर्ड ${dashboards.length + 1}`;
    const newId = `dash-${Date.now()}`;
    const newDash = {
        id: newId,
        name: name,
        visualizations: [],
        chartGlobalSettings: {
            showLabels: true,
            showToolbox: true,
            chartPalette: 'default',
            showLegend: true
        },
        backgroundTemplateIndex: '0',
        currentFilterState: null,
        isFilterActive: false
    };
    dashboards.push(newDash);
    
    // Switch to new dashboard
    await switchDashboard(newId);
    return newId;
}

export async function renameDashboard(id, newName) {
    const d = dashboards.find(dash => dash.id === id);
    if (d) {
        d.name = newName;
        await saveDashboardSettings();
        // Dispatch event so UI updates
        document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
        return true;
    }
    return false;
}

export async function deleteDashboard(id) {
    if (dashboards.length <= 1) {
        showMessage("कम से कम एक डैशबोर्ड होना आवश्यक है!", "warning");
        return false;
    }
    const index = dashboards.findIndex(dash => dash.id === id);
    if (index !== -1) {
        dashboards.splice(index, 1);
        if (activeDashboardId === id) {
            // Switch to another dashboard
            const nextActiveId = dashboards[0].id;
            await switchDashboard(nextActiveId);
        } else {
            await saveDashboardSettings();
            document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
        }
        return true;
    }
    return false;
}

export async function switchDashboard(id) {
    // 1. Save current state to array for the current active dashboard
    const currentDash = dashboards.find(dash => dash.id === activeDashboardId);
    if (currentDash) {
        currentDash.visualizations = [...visualizations];
        currentDash.chartGlobalSettings = { ...chartGlobalSettings };
        currentDash.backgroundTemplateIndex = localStorage.getItem('selectedBackgroundTemplateIndex') || null;
        currentDash.currentFilterState = currentFilterState;
        currentDash.isFilterActive = isFilterActive;
    }

    // 2. Switch
    activeDashboardId = id;
    const targetDash = dashboards.find(dash => dash.id === id);
    if (targetDash) {
        visualizations.length = 0;
        if (targetDash.visualizations) {
            targetDash.visualizations.forEach(v => {
                visualizations.push(v);
            });
        }
        if (targetDash.chartGlobalSettings) {
            Object.keys(chartGlobalSettings).forEach(key => delete chartGlobalSettings[key]);
            Object.assign(chartGlobalSettings, targetDash.chartGlobalSettings);
        }
        if (targetDash.backgroundTemplateIndex !== null && targetDash.backgroundTemplateIndex !== undefined) {
            const index = parseInt(targetDash.backgroundTemplateIndex);
            localStorage.setItem('selectedBackgroundTemplateIndex', targetDash.backgroundTemplateIndex);
            
            try {
                const { backgroundTemplates } = await import('../js/backgroundTemplates.js');
                if (index >= 0 && index < backgroundTemplates.length) {
                    const selectedTemplate = backgroundTemplates[index];
                    const dashboardContent = document.getElementById('dashboardContent');
                    if (dashboardContent) {
                        dashboardContent.style.backgroundColor = selectedTemplate.backgroundColor;
                        dashboardContent.style.color = selectedTemplate.textColor;
                    }
                    localStorage.setItem('dashboardBackgroundColor', selectedTemplate.backgroundColor);
                    localStorage.setItem('dashboardTextColor', selectedTemplate.textColor);
                }
            } catch (err) {
                console.warn("Could not dynamically apply background template", err);
            }
        }
    }

    // 3. Save to DB/localStorage
    await saveDashboardSettings();
    
    // 4. Dispatch events
    document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
    document.dispatchEvent(new CustomEvent('dashboardSwitched', { detail: { id } }));
    
    // 5. Replot charts
    try {
        const { plotAll } = await import('../js/charts.js');
        plotAll();
    } catch (e) {
        console.error("Error plotting switched dashboard", e);
    }
    
    showMessage(`सफलतापूर्वक डैशबोर्ड '${targetDash ? targetDash.name : id}' पर स्विच किया गया!`, "success");
    return true;
}

export async function saveDashboardSettings() {
    if (!currentUserId) {
        showMessage("User ID not set", "warning");
        return false;
    }

    try {
        // Prepare current active dashboard state
        const activeSettings = {
            id: activeDashboardId || 'default',
            name: getCurrentDashboardName(),
            visualizations: [...visualizations],
            chartGlobalSettings: { ...chartGlobalSettings },
            backgroundTemplateIndex: localStorage.getItem('selectedBackgroundTemplateIndex') || null,
            currentFilterState: currentFilterState, 
            isFilterActive: isFilterActive
        };

        // Find or create dashboards array
        let dashboardsList = dashboards;
        if (!Array.isArray(dashboardsList) || dashboardsList.length === 0) {
            dashboardsList = [activeSettings];
        } else {
            const index = dashboardsList.findIndex(d => d.id === activeDashboardId);
            if (index !== -1) {
                dashboardsList[index] = activeSettings;
            } else {
                dashboardsList.push(activeSettings);
            }
        }

        const settings = {
            dashboards: dashboardsList,
            activeDashboardId: activeDashboardId || 'default',
            lastSaved: new Date().toISOString()
        };
        
        await db.collection('users').doc(currentUserId).set({
            dashboardSettings: settings
        }, { merge: true });
        
        console.log("Dashboard settings saved successfully!");
        return true;
    } catch (error) {
        console.error("Error saving dashboard settings:", error);
        const localKey = `vedrabi_db_users_${currentUserId}`;
        try {
            const raw = localStorage.getItem(localKey);
            let localDoc = raw ? JSON.parse(raw) : {};
            if (!localDoc || typeof localDoc !== 'object') {
                localDoc = {};
            }
            
            const activeSettings = {
                id: activeDashboardId || 'default',
                name: getCurrentDashboardName(),
                visualizations: [...visualizations],
                chartGlobalSettings: { ...chartGlobalSettings },
                backgroundTemplateIndex: localStorage.getItem('selectedBackgroundTemplateIndex') || null,
                currentFilterState: currentFilterState, 
                isFilterActive: isFilterActive
            };

            let dashboardsList = dashboards;
            if (!Array.isArray(dashboardsList) || dashboardsList.length === 0) {
                dashboardsList = [activeSettings];
            } else {
                const index = dashboardsList.findIndex(d => d.id === activeDashboardId);
                if (index !== -1) {
                    dashboardsList[index] = activeSettings;
                } else {
                    dashboardsList.push(activeSettings);
                }
            }

            localDoc.dashboardSettings = {
                dashboards: dashboardsList,
                activeDashboardId: activeDashboardId || 'default',
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem(localKey, JSON.stringify(localDoc));
            console.log("Dashboard settings saved to local fallback!");
            return true;
        } catch (localErr) {
            console.error("Local storage save fallback error:", localErr);
        }
        showMessage("Dashboard settings save करने मे error: " + error.message, "danger");
        return false;
    }
}

export async function loadDashboardSettings() {
    if (!currentUserId) {
        showMessage("User ID not set", "warning");
        return false;
    }

    try {
        const doc = await db.collection('users').doc(currentUserId).get();
        if (doc.exists) {
            const userData = doc.data();
            const settings = userData.dashboardSettings;
            
            if (settings) {
                if (settings.dashboards && Array.isArray(settings.dashboards)) {
                    dashboards = settings.dashboards;
                    activeDashboardId = settings.activeDashboardId || 'default';
                } else {
                    // Migrate legacy single dashboard format
                    const oldDashboard = {
                        id: 'default',
                        name: 'डिफ़ॉल्ट डैशबोर्ड',
                        visualizations: settings.visualizations || [],
                        chartGlobalSettings: settings.chartGlobalSettings || {},
                        backgroundTemplateIndex: settings.backgroundTemplateIndex || null,
                        currentFilterState: settings.currentFilterState || null,
                        isFilterActive: settings.isFilterActive || false
                    };
                    dashboards = [oldDashboard];
                    activeDashboardId = 'default';
                }

                // Load active dashboard
                const currentDashboard = dashboards.find(d => d.id === activeDashboardId) || dashboards[0];
                if (currentDashboard) {
                    activeDashboardId = currentDashboard.id;
                    visualizations.length = 0;
                    if (currentDashboard.visualizations) {
                        currentDashboard.visualizations.forEach(v => visualizations.push(v));
                    }
                    if (currentDashboard.chartGlobalSettings) {
                        Object.assign(chartGlobalSettings, currentDashboard.chartGlobalSettings);
                    }
                    if (currentDashboard.backgroundTemplateIndex) {
                        localStorage.setItem('selectedBackgroundTemplateIndex', currentDashboard.backgroundTemplateIndex);
                        try {
                            const { backgroundTemplates } = await import('../js/backgroundTemplates.js');
                            const index = parseInt(currentDashboard.backgroundTemplateIndex);
                            if (index >= 0 && index < backgroundTemplates.length) {
                                const selectedTemplate = backgroundTemplates[index];
                                const dashboardContent = document.getElementById('dashboardContent');
                                if (dashboardContent) {
                                    dashboardContent.style.backgroundColor = selectedTemplate.backgroundColor;
                                    dashboardContent.style.color = selectedTemplate.textColor;
                                }
                                localStorage.setItem('dashboardBackgroundColor', selectedTemplate.backgroundColor);
                                localStorage.setItem('dashboardTextColor', selectedTemplate.textColor);
                            }
                        } catch (e) {
                            console.warn("Could not load and apply background template during startup", e);
                        }
                    }
                }
                
                console.log("Dashboard settings loaded successfully!");
                document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
                return true;
            }
        }
        console.log("No saved dashboard settings found. Initializing default dashboard.");
        const defaultDash = {
            id: 'default',
            name: 'डिफ़ॉल्ट डैशबोर्ड',
            visualizations: [...visualizations],
            chartGlobalSettings: { ...chartGlobalSettings },
            backgroundTemplateIndex: localStorage.getItem('selectedBackgroundTemplateIndex') || '0',
            currentFilterState: currentFilterState,
            isFilterActive: isFilterActive
        };
        dashboards = [defaultDash];
        activeDashboardId = 'default';
        document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
        return true;
    } catch (error) {
        console.error("Error loading dashboard settings:", error);
        const localKey = `vedrabi_db_users_${currentUserId}`;
        try {
            const raw = localStorage.getItem(localKey);
            if (raw) {
                const userData = JSON.parse(raw);
                const settings = userData?.dashboardSettings;
                if (settings) {
                    if (settings.dashboards && Array.isArray(settings.dashboards)) {
                        dashboards = settings.dashboards;
                        activeDashboardId = settings.activeDashboardId || 'default';
                    } else {
                        // Migrate legacy single dashboard format
                        const oldDashboard = {
                            id: 'default',
                            name: 'डिफ़ॉल्ट डैशबोर्ड',
                            visualizations: settings.visualizations || [],
                            chartGlobalSettings: settings.chartGlobalSettings || {},
                            backgroundTemplateIndex: settings.backgroundTemplateIndex || null,
                            currentFilterState: settings.currentFilterState || null,
                            isFilterActive: settings.isFilterActive || false
                        };
                        dashboards = [oldDashboard];
                        activeDashboardId = 'default';
                    }

                    // Load active dashboard
                    const currentDashboard = dashboards.find(d => d.id === activeDashboardId) || dashboards[0];
                    if (currentDashboard) {
                        activeDashboardId = currentDashboard.id;
                        visualizations.length = 0;
                        if (currentDashboard.visualizations) {
                            currentDashboard.visualizations.forEach(v => visualizations.push(v));
                        }
                        if (currentDashboard.chartGlobalSettings) {
                            Object.assign(chartGlobalSettings, currentDashboard.chartGlobalSettings);
                        }
                        if (currentDashboard.backgroundTemplateIndex) {
                            localStorage.setItem('selectedBackgroundTemplateIndex', currentDashboard.backgroundTemplateIndex);
                            try {
                                const { backgroundTemplates } = await import('../js/backgroundTemplates.js');
                                const index = parseInt(currentDashboard.backgroundTemplateIndex);
                                if (index >= 0 && index < backgroundTemplates.length) {
                                    const selectedTemplate = backgroundTemplates[index];
                                    const dashboardContent = document.getElementById('dashboardContent');
                                    if (dashboardContent) {
                                        dashboardContent.style.backgroundColor = selectedTemplate.backgroundColor;
                                        dashboardContent.style.color = selectedTemplate.textColor;
                                    }
                                    localStorage.setItem('dashboardBackgroundColor', selectedTemplate.backgroundColor);
                                    localStorage.setItem('dashboardTextColor', selectedTemplate.textColor);
                                }
                            } catch (e) {
                                console.warn("Could not load and apply background template during startup", e);
                            }
                        }
                    }
                    console.log("Dashboard settings loaded from local fallback!");
                    document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
                    return true;
                }
            }
        } catch (localErr) {
            console.error("Local storage load fallback error:", localErr);
        }
        
        console.log("Initializing fallback default dashboard on error.");
        const defaultDash = {
            id: 'default',
            name: 'डिफ़ॉल्ट डैशबोर्ड',
            visualizations: [...visualizations],
            chartGlobalSettings: { ...chartGlobalSettings },
            backgroundTemplateIndex: localStorage.getItem('selectedBackgroundTemplateIndex') || '0',
            currentFilterState: currentFilterState,
            isFilterActive: isFilterActive
        };
        dashboards = [defaultDash];
        activeDashboardId = 'default';
        document.dispatchEvent(new CustomEvent('dashboardsUpdated'));
        return true;
    }
}

// ========================== DATA VALIDATION & FIREBASE ==========================

function validateData(data) {
    if (!Array.isArray(data)) {
        throw new Error("Data must be an array");
    }
    
    const validatedData = data.filter((row, index) => {
        if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
        
        const hasValidData = Object.values(row).some(val => 
            val !== null && val !== undefined && String(val).trim() !== ''
        );
        
        if (!hasValidData) console.warn(`Empty row at index ${index}`);
        
        return hasValidData;
    });
    
    console.log(`Validated data: ${validatedData.length} valid rows out of ${data.length}`);
    return validatedData;
}

function validateHeaders(headersArray) {
    if (!Array.isArray(headersArray)) {
        throw new Error("Headers must be an array");
    }
    
    const validHeaders = headersArray.filter(h => 
        h && typeof h === 'string' && h.trim() !== ''
    ).map(h => h.trim());
    
    if (validHeaders.length === 0) {
        throw new Error("No valid headers found");
    }
    
    const uniqueHeaders = [...new Set(validHeaders)];
    if (uniqueHeaders.length !== validHeaders.length) {
        console.warn("Duplicate headers found and removed");
        return uniqueHeaders;
    }
    
    return validHeaders;
}

export async function saveUserDataToFirebase(dataToSave, headersToSave, saveFilteredData = false) {
    if (!currentUserId) {
        showMessage("No user logged in", "warning");
        return false;
    }

    try {
        let validatedData = validateData(dataToSave);
        const validatedHeaders = validateHeaders(headersToSave);

        const dataSize = JSON.stringify(validatedData).length;
        if (dataSize > 900000) {
            throw new Error(`Data too large: ${(dataSize / 1024 / 1024).toFixed(2)}MB. Maximum 1MB allowed.`);
        }

        if (validatedData.length > CONFIG.MAX_ROWS) {
            showMessage(`Large dataset detected. Keeping only latest ${CONFIG.MAX_ROWS} records for performance.`, "warning");
            validatedData = validatedData.slice(-CONFIG.MAX_ROWS);
        }

        const userData = {
            data: validatedData,
            headers: validatedHeaders,
            lastUpdated: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
                ? firebase.firestore.FieldValue.serverTimestamp()
                : new Date().toISOString(),
            dataSize: dataSize,
            rowCount: validatedData.length
        };

        if (saveFilteredData && isFilterActive) {
            userData.filteredData = filteredData || [];
            userData.filterState = currentFilterState;
            userData.isFilterActive = true;
            userData.filteredDataSavedAt = new Date().toISOString();
        } else {
            userData.isFilterActive = false;
            userData.filterState = null;
        }
        
        await db.collection('users').doc(currentUserId).set(userData, { merge: true });
        
        console.log("User data saved successfully!");
        isDataModified = false;
        return true;
    } catch (error) {
        console.error("Error saving user data:", error);
        
        // Fallback to local storage
        try {
            const localKey = `vedrabi_db_users_${currentUserId}`;
            let localDoc = {};
            try {
                const raw = localStorage.getItem(localKey);
                if (raw) {
                    localDoc = JSON.parse(raw) || {};
                }
            } catch (e) {}

            const localUserData = {
                data: dataToSave,
                headers: headersToSave,
                lastUpdated: new Date().toISOString(),
                dataSize: JSON.stringify(dataToSave).length,
                rowCount: dataToSave.length,
                isFilterActive: isFilterActive && saveFilteredData,
                filterState: isFilterActive && saveFilteredData ? currentFilterState : null,
                filteredData: isFilterActive && saveFilteredData ? (filteredData || []) : []
            };

            Object.assign(localDoc, localUserData);
            localStorage.setItem(localKey, JSON.stringify(localDoc));
            console.log("User data saved to local fallback!");
            isDataModified = false;
            showMessage("ऑफ़लाइन मोड: डेटा लोकल बैकअप में सुरक्षित किया गया।", "warning");
            return true;
        } catch (localErr) {
            console.error("Local storage save fallback error:", localErr);
        }
        
        showMessage(`Data save error: ${error.message}`, "danger");
        return false;
    }
}

async function loadUserDataFromFirebase() {
    if (!currentUserId) {
        showMessage("No user logged in", "warning");
        return;
    }
    
    showMessage("Cloud से data load हो रहा है...", "info");

    try {
        const doc = await db.collection('users').doc(currentUserId).get();
        if (doc.exists) {
            const userData = doc.data();
            rawData = userData.data || [];
            headers.length = 0;
            if (userData.headers) headers.push(...userData.headers);
            
            isFilterActive = userData.isFilterActive || false;
            currentFilterState = userData.filterState || null;

            if (isFilterActive && userData.filteredData && Array.isArray(userData.filteredData)) {
                savedFilteredData = userData.filteredData;
            } else {
                savedFilteredData = [...rawData];
            }
            
            showMessage(`Firebase से data successfully load किया! (${rawData.length} raw, ${savedFilteredData.length} saved filtered)`, "success");
            
            document.dispatchEvent(new CustomEvent('dataLoadedFromFirebase', {
                detail: {
                    rowCount: rawData.length,
                    filteredRowCount: savedFilteredData.length,
                    headers: headers,
                    lastUpdated: userData.lastUpdated,
                    isFilterActive: isFilterActive
                }
            }));
        } else {
            rawData = [];
            filteredData = [];
            savedFilteredData = [];
            headers.length = 0;
            showMessage("आपके लिए कोई data नहीं मिला.", "info");
        }
    } catch (error) {
        console.error("Error loading user data:", error);
        
        // Fallback to local storage
        const localKey = `vedrabi_db_users_${currentUserId}`;
        try {
            const raw = localStorage.getItem(localKey);
            if (raw) {
                const userData = JSON.parse(raw);
                rawData = userData.data || [];
                headers.length = 0;
                if (userData.headers) headers.push(...userData.headers);
                
                isFilterActive = userData.isFilterActive || false;
                currentFilterState = userData.filterState || null;

                if (isFilterActive && userData.filteredData && Array.isArray(userData.filteredData)) {
                    savedFilteredData = userData.filteredData;
                } else {
                    savedFilteredData = [...rawData];
                }
                
                showMessage(`ऑफ़लाइन लोकल बैकअप से data successfully load किया! (${rawData.length} raw)`, "info");
                
                document.dispatchEvent(new CustomEvent('dataLoadedFromFirebase', {
                    detail: {
                        rowCount: rawData.length,
                        filteredRowCount: savedFilteredData.length,
                        headers: headers,
                        lastUpdated: userData.lastUpdated || new Date().toISOString(),
                        isFilterActive: isFilterActive
                    }
                }));
                return;
            }
        } catch (localErr) {
            console.error("Local storage load fallback error:", localErr);
        }
        
        showMessage("Firebase से data load error: " + error.message, "danger");
        throw error;
    }
}

// ========================== AUTO-SAVE FUNCTIONALITY ==========================

function scheduleAutoSave() {
    if (!currentUserId) return;
    
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
        if (isDataModified) {
            await saveUserDataToFirebase(rawData, headers, true); 
            showMessage("Auto-save successful!", "success");
        }
    }, CONFIG.AUTO_SAVE_DELAY);
}

export function markDataAsModified() {
    isDataModified = true;
    scheduleAutoSave();
}

// ========================== FILE UPLOAD ==========================

export async function handleFile(e) {
    if (!currentUserId) {
        showMessage("Kripya login करें", "warning");
        return false;
    }

    const file = e.target.files[0];
    if (!file) return false;

    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showMessage(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum 10MB allowed.`, "danger");
        e.target.value = '';
        return false;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isSupported = Object.values(SUPPORTED_FILE_TYPES).some(types => 
        types.includes(fileExtension)
    );
    
    if (!isSupported) {
        showMessage("Supported file formats: CSV, Excel (.xlsx, .xls)", "danger");
        e.target.value = '';
        return false;
    }

    const reader = new FileReader();
    
    return new Promise((resolve) => {
        reader.onload = async (evt) => {
            let data;
            try {
                if (file.name.endsWith('.csv')) {
                    data = Papa.parse(evt.target.result, { 
                        header: true, 
                        skipEmptyLines: true,
                        transform: (value) => value.trim(),
                        transformHeader: (header) => header.trim()
                    }).data;
                } else if (file.name.endsWith('.json')) {
                    const parsed = JSON.parse(evt.target.result);
                    if (Array.isArray(parsed)) {
                        data = parsed;
                    } else if (parsed && typeof parsed === 'object') {
                        const arrayKey = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
                        if (arrayKey) {
                            data = parsed[arrayKey];
                        } else {
                            data = [parsed];
                        }
                    } else {
                        throw new Error("JSON data should be an array of objects.");
                    }
                } else {
                    const wb = XLSX.read(evt.target.result, { type: 'binary' });
                    let sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
                        defval: '',
                        raw: false,
                        header: 1
                    });
                    
                    if (sheetData.length > 0) {
                        const headers = sheetData[0];
                        data = sheetData.slice(1).map(row => {
                            const obj = {};
                            headers.forEach((header, index) => {
                                obj[header] = row[index] || '';
                            });
                            return obj;
                        });
                    }
                }
                
                data = validateData(data);
                
            } catch (parseError) {
                console.error("File parse error:", parseError);
                showMessage("File parse error. CSV, JSON या Excel file check करें.", "danger");
                resolve(false);
                return;
            }

            if (data && data.length > 0) {
                try {
                    // Clear existing visualizations and filters
                    visualizations.length = 0;
                    isFilterActive = false;
                    currentFilterState = null;
                    await saveDashboardSettings();
                    
                    const headersFromData = Object.keys(data[0]);
                    await saveUserDataToFirebase(data, headersFromData, false); 
                    await initData();
                    
                    e.target.value = '';
                    showMessage(`File successfully upload हुआ! ${data.length} rows loaded.`, "success");
                    resolve(true);
                } catch (saveError) {
                    console.error("Error saving uploaded data:", saveError);
                    showMessage("Data save करने मे error: " + saveError.message, "danger");
                    resolve(false);
                }
            } else {
                showMessage("File खाली है या data parse नहीं हुआ.", "warning");
                resolve(false);
            }
        };
        
        reader.onerror = () => {
            showMessage("File read error", "danger");
            resolve(false);
        };

        if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    });
}

/**
 * Google Sheets से डेटा लाइव सिंक करता है
 */
export async function syncGoogleSheet(url) {
    if (!currentUserId) {
        showMessage("Kripya login करें", "warning");
        return false;
    }
    if (!url || !url.trim()) {
        showMessage("कृपया एक मान्य Google Sheet URL दर्ज करें।", "warning");
        return false;
    }

    // Extract Spreadsheet ID
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        showMessage("अमान्य Google Sheet URL। कृपया सुनिश्चित करें कि URL सही है।", "danger");
        return false;
    }

    const spreadsheetId = match[1];
    
    // Check if there is a specific sheet tab gid
    const gidMatch = url.match(/gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';

    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    showMessage("Google Sheets से डेटा सिंक हो रहा है...", "info");

    try {
        const response = await fetch(exportUrl);
        if (!response.ok) {
            throw new Error("कृपया जांचें कि शीट 'Anyone with link can view' पर सेट है या नहीं।");
        }

        const csvText = await response.text();
        let data = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim(),
            transformHeader: (header) => header.trim()
        }).data;

        data = validateData(data);

        if (data && data.length > 0) {
            // Clear existing visualizations and filters
            visualizations.length = 0;
            isFilterActive = false;
            currentFilterState = null;
            await saveDashboardSettings();

            const headersFromData = Object.keys(data[0]);
            await saveUserDataToFirebase(data, headersFromData, false);
            await initData();

            showMessage(`Google Sheets से ${data.length} पंक्तियाँ सफलतापूर्वक सिंक की गईं!`, "success");
            return true;
        } else {
            showMessage("Google Sheet खाली है या डेटा पार्स नहीं हो सका।", "warning");
            return false;
        }
    } catch (error) {
        console.error("Google Sheets Sync Error:", error);
        showMessage(`Google Sheets सिंक करने में त्रुटि: ${error.message}`, "danger");
        return false;
    }
}

// ========================== PAGINATION ==========================

export function paginate(data, pageSize, pageNum) {
    const start = (pageNum - 1) * pageSize;
    return data.slice(start, start + pageSize);
}

export function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    currentPage += direction;
    currentPage = Math.max(1, Math.min(currentPage, totalPages));
    updatePaginationAndFilterUI();
    updateTableAndUI();
}

export function goToPage(pageNum) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    currentPage = Math.max(1, Math.min(pageNum, totalPages));
    updatePaginationAndFilterUI();
    updateTableAndUI();
}

// ========================== SEARCH & FILTER ==========================

export function precomputeSearchIndexes(data) {
    if (!Array.isArray(data)) return;
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row._searchIndex !== undefined) continue;
        
        let rowStr = '';
        for (const key in row) {
            if (row.hasOwnProperty(key) && key !== '_searchIndex') {
                const val = row[key];
                if (val !== null && val !== undefined && typeof val !== 'object') {
                    rowStr += String(val).toLowerCase() + ' ';
                }
            }
        }
        row._searchIndex = rowStr;
    }
}

export function searchTable() {
    const input = document.getElementById('searchInput');
    const term = input ? input.value.toLowerCase().trim() : '';
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(term);
    }, CONFIG.DEBOUNCE_DELAY);
}

function performSearch(term) {
    if (isOperationInProgress) {
        console.log('Search operation skipped - another operation in progress');
        return;
    }

    isOperationInProgress = true;
    
    try {
        let dataToSearch = isFilterActive ? [...savedFilteredData] : [...rawData];
        
        if (!term) {
            filteredData = dataToSearch;
        } else {
            precomputeSearchIndexes(dataToSearch);
            filteredData = dataToSearch.filter(row => 
                row._searchIndex !== undefined && row._searchIndex.includes(term)
            );
        }
        
        currentPage = 1;
        currentDataForChat = [...filteredData];

        const updateAll = () => {
            updatePaginationAndFilterUI();

            setTimeout(() => {
                updateTableAndUI();
                
                setTimeout(() => {
                    plotAll();
                    
                    setTimeout(() => {
                        clearSummary();
                        if (filteredData.length) {
                            generateSummary(filteredData);
                        }
                        
                        if (term) {
                            showMessage(`${filteredData.length} results found for "${term}"`, 'info');
                        }
                        
                        isOperationInProgress = false;
                        if (pendingOperation) {
                            const op = pendingOperation;
                            pendingOperation = null;
                            setTimeout(() => {
                                if (op === 'applyFilters') applyFiltersAndSort();
                                else if (op === 'resetFilters') resetFiltersAndShowAllData();
                            }, 100);
                        }
                    }, CONFIG.BATCH_OPERATION_DELAY);
                    
                }, CONFIG.BATCH_OPERATION_DELAY);
                
            }, CONFIG.BATCH_OPERATION_DELAY);
        }

        updateAll();
        
    } catch (error) {
        console.error("Error in performSearch:", error);
        isOperationInProgress = false;
        pendingOperation = null;
    }
}

export function updatePythonModeUI() {
    const statusBadge = document.getElementById('pythonModeStatus');
    if (!statusBadge) return;

    const dataSize = JSON.stringify(rawData).length;
    const forcePython = document.getElementById('forcePythonBackendBtn')?.checked;
    const isLarge = dataSize > 50 * 1024 * 1024;

    if (isLarge || forcePython) {
        statusBadge.className = 'badge bg-success text-white';
        statusBadge.textContent = isLarge ? 'सक्रिय (Auto 50MB+)' : 'सक्रिय (Forced)';
    } else {
        statusBadge.className = 'badge bg-secondary text-white';
        statusBadge.textContent = 'निष्क्रिय (Local)';
    }
}

export async function syncDataToBackend() {
    if (!currentUserId || !rawData || rawData.length === 0) return;
    
    const dataSize = JSON.stringify(rawData).length;
    const forcePython = document.getElementById('forcePythonBackendBtn')?.checked;
    const isLarge = dataSize > 50 * 1024 * 1024 || forcePython;

    if (isLarge) {
        console.log(`Large/Forced dataset detected (${(dataSize / 1024 / 1024).toFixed(2)} MB). Syncing to Python backend...`);
        try {
            const response = await fetch('/api/upload-large-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId, rawData })
            });
            const result = await response.json();
            if (result.success) {
                console.log('Dataset synced to Python backend successfully:', result.message);
            }
        } catch (e) {
            console.error('Error syncing dataset to Python backend:', e);
        }
    }
}

export function applyFiltersAndSort() {
    if (isOperationInProgress) {
        console.log('Filter operation skipped - another operation in progress. Queued.');
        pendingOperation = 'applyFilters';
        return;
    }

    isOperationInProgress = true;
    
    try {
        currentFilterState = getCurrentFilterState();
        
        const s = currentFilterState;
        const hasActiveFilters = !!(s && (
            (s.globalFilter && ((s.globalFilter.column && s.globalFilter.value) || s.globalFilter.startDate || s.globalFilter.endDate)) ||
            (s.textFilter && s.textFilter.column && s.textFilter.value) ||
            (s.multiSelect && s.multiSelect.column && s.multiSelect.selectedValues && s.multiSelect.selectedValues.length > 0) ||
            (s.numericRange && s.numericRange.column && (s.numericRange.min !== '' || s.numericRange.max !== '')) ||
            (s.dateRange && s.dateRange.start && s.dateRange.end) ||
            (s.groupBy && s.groupBy.columns && s.groupBy.columns.length > 0) ||
            (s.sortRules && s.sortRules.length > 0)
        ));

        const dataSize = JSON.stringify(rawData).length;
        const forcePython = document.getElementById('forcePythonBackendBtn')?.checked;
        const isPythonActive = dataSize > 50 * 1024 * 1024 || forcePython;

        const finalizeFilterExecution = (hasFilters) => {
            currentPage = 1;
            currentDataForChat = [...filteredData];
            
            const processNextOperation = () => {
                isOperationInProgress = false;
                
                if (pendingOperation) {
                    const op = pendingOperation;
                    pendingOperation = null;
                    console.log(`Processing pending operation: ${op}`);
                    setTimeout(() => {
                        if (op === 'applyFilters') applyFiltersAndSort();
                        else if (op === 'resetFilters') resetFiltersAndShowAllData();
                    }, 100);
                }
            };

            updatePaginationAndFilterUI();

            setTimeout(() => {
                updateTableAndUI();

                setTimeout(() => {
                    plotAll();
                    updateKPICards();
                    
                    setTimeout(() => {
                        clearSummary();
                        if (filteredData.length) {
                            generateSummary(filteredData);
                        }
                        
                        setTimeout(async () => {
                            try {
                                await saveUserDataToFirebase(rawData, headers, hasFilters);
                            } catch (e) {
                                console.error("Firebase save failed after filter:", e);
                            }
                            
                            const activeFiltersCount = Object.values(currentFilterState || {}).filter(state => 
                                state && Object.values(state).some(val => 
                                    val && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '')
                                )
                            ).length;
                            
                            if (hasFilters) {
                                showMessage(`Filter apply हुआ! ${filteredData.length} rows (${activeFiltersCount} active filters)`, 'info');
                            } else {
                                showMessage(`All filters reset! Showing all ${rawData.length} rows`, 'success');
                            }

                            processNextOperation();
                            updatePythonModeUI();
                            
                        }, CONFIG.BATCH_OPERATION_DELAY);
                        
                    }, CONFIG.BATCH_OPERATION_DELAY);
                    
                }, CONFIG.BATCH_OPERATION_DELAY);
                
            }, CONFIG.BATCH_OPERATION_DELAY);
        };

        if (isPythonActive && hasActiveFilters) {
            showMessage("पायथन बैकएंड फ़िल्टरिंग चल रही है... ⚡", "info");
            fetch('/api/filter-large-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId || 'guest_user',
                    filterState: currentFilterState,
                    rawData: rawData
                })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success && result.filteredData) {
                    filteredData = result.filteredData;
                    isFilterActive = true;
                    savedFilteredData = [...filteredData];
                    showMessage("पायथन बैकएंड फ़िल्टरिंग सफलतापूर्वक पूरी हुई! ⚡", "success");
                } else {
                    console.error("Python filter error:", result.error);
                    showMessage("पायथन फ़िल्टर विफल रहा, लोकल फ़िल्टर का उपयोग कर रहे हैं।", "warning");
                    filteredData = applyFilters(rawData, headers);
                    isFilterActive = true;
                    savedFilteredData = [...filteredData];
                }
                finalizeFilterExecution(hasActiveFilters);
            })
            .catch(err => {
                console.error("Fetch filter error:", err);
                showMessage("कनेक्शन विफलता, लोकल फ़िल्टर का उपयोग कर रहे हैं।", "warning");
                filteredData = applyFilters(rawData, headers);
                isFilterActive = true;
                savedFilteredData = [...filteredData];
                finalizeFilterExecution(hasActiveFilters);
            });
        } else {
            if (hasActiveFilters) {
                filteredData = applyFilters(rawData, headers);
                isFilterActive = true;
                savedFilteredData = [...filteredData];
            } else {
                filteredData = [...rawData];
                isFilterActive = false;
                savedFilteredData = [...rawData];
                currentFilterState = null;
            }
            finalizeFilterExecution(hasActiveFilters);
        }
        
    } catch (error) {
        console.error("Error applying filters:", error);
        showMessage("Filter apply करने मे error: " + error.message, "danger");
        isOperationInProgress = false;
        pendingOperation = null;
    }
}

export function resetFiltersAndShowAllData() {
    if (isOperationInProgress || isResetting) {
        if (!isResetting) {
             console.log('Reset operation skipped - another operation in progress. Queued.');
             pendingOperation = 'resetFilters';
        } else {
             console.log('Reset operation skipped - currently inside reset process.');
        }
        return;
    }

    isOperationInProgress = true;
    isResetting = true;

    console.log('Starting reset process...');
    
    try {
        resetFilterUI(headers);
        
        filteredData = [...rawData];
        isFilterActive = false; 
        currentFilterState = null;
        savedFilteredData = [...rawData]; 
        
        currentPage = 1;
        currentDataForChat = [...filteredData];
        
        const processNextOperation = () => {
            isOperationInProgress = false;
            isResetting = false; 
            
            if (pendingOperation) {
                const op = pendingOperation;
                pendingOperation = null;
                console.log(`Processing pending operation: ${op}`);
                setTimeout(() => {
                    if (op === 'applyFilters') applyFiltersAndSort();
                    else if (op === 'resetFilters') resetFiltersAndShowAllData();
                }, 100);
            }
            console.log('Reset process finished.');
        };

        updatePaginationAndFilterUI();

        setTimeout(() => {
            updateTableAndUI();
            
            setTimeout(() => {
                plotAll();
                
                setTimeout(async () => {
                    try {
                        await saveUserDataToFirebase(rawData, headers, false);
                    } catch (e) {
                        console.error("Firebase save failed after reset:", e);
                    }
                    
                    showMessage(`All filters reset! Showing all ${rawData.length} rows`, 'success');

                    processNextOperation();
                    
                }, CONFIG.BATCH_OPERATION_DELAY);
                
            }, CONFIG.BATCH_OPERATION_DELAY);
            
        }, CONFIG.BATCH_OPERATION_DELAY);
        
    } catch (error) {
        console.error("Error resetting filters:", error);
        showMessage("Filters reset करने मे error: " + error.message, "danger");
        isOperationInProgress = false;
        isResetting = false; 
        pendingOperation = null;
    }
}

// ========================== ADD/UPDATE DATA ==========================

export async function saveData() {
    if (!currentUserId) {
        showMessage("Kripya login करें", "warning");
        return false;
    }

    try {
        const newRow = {};
        let isEmpty = true;
        
        document.querySelectorAll('#addDataForm input').forEach(input => {
            const col = input.dataset.col;
            if (col) { 
                newRow[col] = input.value.trim();
                if (input.value.trim()) isEmpty = false;
            }
        });

        if (!isEmpty) {
            if (!headers.length) { 
                headers.length = 0;
                headers.push(...Object.keys(newRow)); 
            }
            
            rawData.push(newRow);
            
            // NEW: Automatically apply current filters to new data
            if (isFilterActive && currentFilterState) {
                const tempFiltered = applyFilters([newRow], headers);
                if (tempFiltered.length > 0) {
                    filteredData.push(newRow);
                    savedFilteredData.push(newRow);
                }
                // If new row doesn't match filter, it won't be added to filteredData
                // but will remain in rawData
            } else {
                filteredData.push(newRow);
                savedFilteredData.push(newRow);
            }
            
            markDataAsModified();
            const success = await saveUserDataToFirebase(rawData, headers, isFilterActive); 
            
            if (success) {
                // NEW: Instead of reapplying all filters, just update UI
                currentPage = 1;
                currentDataForChat = [...filteredData];
                
                updatePaginationAndFilterUI();
                updateTableAndUI();
                updateControls(headers);
                
                plotAll();
                clearSummary();
                if (filteredData.length) {
                    generateSummary(filteredData);
                }
                
                const addDataModalEl = document.getElementById('addDataModal');
                if (addDataModalEl && typeof bootstrap !== 'undefined') {
                    const modalInstance = bootstrap.Modal.getInstance(addDataModalEl) || new bootstrap.Modal(addDataModalEl);
                    modalInstance.hide();
                }
                clearAddDataForm();
                showMessage("नया data successfully जोड़ा!", "success");
                return true;
            }
        } else {
            showMessage("Kripya kam se kam ek value दर्ज करें.", "warning");
        }
        
        return false;
    } catch (error) {
        console.error("Error saving data:", error);
        showMessage("Data save करने मे error: " + error.message, "danger");
        return false;
    }
}

export async function updateDataFromHandsontable(hData, hHeaders) {
    if (!hData?.length) {
        showMessage("Handsontable से data empty", "warning");
        return false;
    }

    try {
        const newData = hData.map(row => 
            Object.fromEntries(hHeaders.map((h, i) => [h, row[i]]))
        );
        
        const success = updateDataAndUI(newData, hHeaders);
        if (success) {
            markDataAsModified();
            await saveUserDataToFirebase(rawData, headers, isFilterActive); 
            showMessage("Handsontable से data update और save हुआ!", "success");
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating data from Handsontable:", error);
        showMessage("Handsontable update error: " + error.message, "danger");
        return false;
    }
}

export function updateDataAndUI(newData, newHeaders = null, skipSummary = false) {
    try {
        const oldRawDataLength = rawData.length;
        rawData = validateData(newData);
        
        // NEW: Smart filter reapplication when raw data changes
        if (isFilterActive && currentFilterState) {
            // Reapply current filters to updated raw data
            filteredData = applyFilters(rawData, headers);
            savedFilteredData = [...filteredData];
            
            // Show message if filtered data changed due to raw data updates
            if (oldRawDataLength !== rawData.length) {
                showMessage(`Data updated! ${rawData.length} total rows, ${filteredData.length} match current filters`, "info");
            }
        } else {
            filteredData = [...rawData];
            savedFilteredData = [...rawData];
        }
        
        headers.length = 0;
        headers.push(...(newHeaders?.length ? validateHeaders(newHeaders) : Object.keys(rawData[0] || {})));
        
        currentPage = 1;
        currentDataForChat = [...filteredData];

        const isPerformanceMode = document.getElementById('apiPerformanceMode')?.checked ?? false;

        if (skipSummary && isPerformanceMode) {
            // Fast Path: skip heavy table and control updates to prevent lag
            plotAll();
        } else {
            // Full Path: re-render table and refresh controls
            updatePaginationAndFilterUI();
            updateTableAndUI();
            updateControls(headers);
            plotAll();
        }
        
        if (!skipSummary) {
            clearSummary();
            if (filteredData.length) {
                generateSummary(filteredData);
            }
        }
        
        return true;
    } catch (error) {
        console.error("Error updating data and UI:", error);
        showMessage("Data update error: " + error.message, "danger");
        return false;
    }
}

// ========================== MEMORY & CLEAR ==========================

export function cleanupData() {
    if (rawData.length > CONFIG.MAX_ROWS) {
        const originalLength = rawData.length;
        rawData = rawData.slice(-CONFIG.MAX_ROWS);
        
        // NEW: Reapply filters after cleanup
        if (isFilterActive && currentFilterState) {
            filteredData = applyFilters(rawData, headers);
            savedFilteredData = [...filteredData];
        } else {
            filteredData = [...rawData];
            savedFilteredData = [...rawData];
        }
        
        console.log(`Dataset optimized: ${originalLength} -> ${rawData.length} rows`);
        showMessage(`Large dataset optimized for performance. Keeping latest ${CONFIG.MAX_ROWS} records.`, "info");
        markDataAsModified();
    }
}

export function clearAllData() {
    if (confirm("क्या आप पक्का सारा data clear करना चाहते हैं? ये action undo नहीं हो सकता.")) {
        rawData = [];
        filteredData = [];
        savedFilteredData = [];
        headers.length = 0;
        currentDataForChat = [];
        currentPage = 1;
        isFilterActive = false;
        currentFilterState = null;
        
        updateTableAndUI();
        updateControls(headers);
        updatePaginationAndFilterUI();
        clearSummary();
        plotAll();
        
        if (currentUserId) {
            saveUserDataToFirebase([], [], false); 
        }
        
        showMessage("सारा data clear हो गया!", "success");
        
        // Show no data popup after clearing (only on index.html)
        checkAndShowNoDataPopup();
    }
}

// ========================== EXPORT DATA ==========================

export function exportToCSV() {
    if (!filteredData.length) {
        showMessage("Export करने के लिए कोई data नहीं है", "warning");
        
        // Show no data popup if trying to export when no data (only on index.html)
        checkAndShowNoDataPopup();
        return;
    }

    try {
        const csv = Papa.unparse({
            fields: headers,
            data: filteredData.map(row => headers.map(header => row[header]))
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `data_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage("CSV export successfully!", "success");
    } catch (error) {
        console.error("Export error:", error);
        showMessage("Export करने मे error: " + error.message, "danger");
    }
}

// ========================== EVENT HANDLERS (for Data Logic) ==========================

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('filtersReset', function(e) {
        console.log('Event received: filtersReset');
        if (!isResetting) { 
             resetFiltersAndShowAllData();
        } else {
             console.log('filtersReset received, but ignoring to prevent infinite loop.');
        }
    });
});

// ========================== UTILITY FUNCTIONS ==========================

export function getDataStats() {
    return {
        totalRows: rawData.length,
        filteredRows: filteredData.length,
        headers: headers.length,
        currentPage: currentPage,
        totalPages: Math.ceil(filteredData.length / rowsPerPage),
        isModified: isDataModified,
        isFilterActive: isFilterActive,
        filterState: currentFilterState
    };
}

export function refreshData() {
    // NEW: Smart refresh that preserves filters
    if (isFilterActive && currentFilterState) {
        // Reapply current filters to current raw data
        filteredData = applyFilters(rawData, headers);
        savedFilteredData = [...filteredData];
        showMessage(`Filters reapplied! ${filteredData.length} rows match current filters`, "info");
    } else {
        // No active filters, just show all data
        filteredData = [...rawData];
        savedFilteredData = [...rawData];
    }
    
    currentPage = 1;
    currentDataForChat = [...filteredData];
    
    updatePaginationAndFilterUI();
    updateTableAndUI();
    plotAll();
    clearSummary();
    if (filteredData.length) {
        generateSummary(filteredData);
    }
}

export function areFiltersActive() {
    return isFilterActive;
}

// ==========================================
// DASHBOARD LAYOUT TEMPLATES MANAGEMENT
// ==========================================

export function getTemplatesList() {
    // 1. Load custom templates from localStorage
    const localTemplatesRaw = localStorage.getItem('vedrabi_dashboard_templates');
    let customTemplates = [];
    try {
        if (localTemplatesRaw) {
            customTemplates = JSON.parse(localTemplatesRaw);
        }
    } catch (e) {
        console.error("Error parsing custom templates:", e);
    }
    
    // 2. Build default templates based on current active headers
    const currentHeaders = headers || [];
    
    // Helper to find column by regex
    const findCol = (regex, fallbackIdx = 0, isNumeric = false) => {
        if (!currentHeaders || currentHeaders.length === 0) return '';
        // Look for exact regex match
        const match = currentHeaders.find(h => regex.test(h));
        if (match) return match;
        
        // Fallback: search by numeric/string type if we have rawData
        if (isNumeric && rawData && rawData.length > 0) {
            for (let h of currentHeaders) {
                const val = rawData[0][h];
                if (val !== undefined && val !== null && !isNaN(parseFloat(val))) {
                    return h;
                }
            }
        }
        
        return currentHeaders[Math.min(fallbackIdx, currentHeaders.length - 1)] || '';
    };
    
    const xSales = findCol(/product|item|category|month|name|brand|उत्पाद|श्रेणी|तिथि|date/i, 0, false);
    const ySales = findCol(/sales|sale|revenue|amount|biki|price|बिक्री|राशि/i, 1, true);
    
    const xFinance = findCol(/month|year|department|dept|category|महीना|विभाग/i, 0, false);
    const yFinanceExpense = findCol(/expense|cost|spend|खर्च|व्यय/i, 1, true);
    const yFinanceRevenue = findCol(/revenue|profit|income|बिक्री|लाभ/i, 2, true);
    
    const xHR = findCol(/department|dept|team|role|education|विभाग|टीम/i, 0, false);
    const yHRCount = findCol(/count|employees|salary|rating|completion|performance|कर्मचारी|संख्या/i, 1, true);

    const defaultTemplates = [
        {
            id: 'preset-sales',
            name: 'बिक्री प्रदर्शन टेम्पलेट (Sales Performance)',
            department: 'Sales',
            description: 'बिक्री, राजस्व और उत्पाद श्रेणियों के रुझानों का व्यापक विश्लेषण।',
            isCustom: false,
            visualizations: [
                {
                    id: 'chart-sales-bar',
                    type: 'bar',
                    color: '#3b82f6',
                    title: 'उत्पाद वार बिक्री (Product Sales Bar)',
                    xAxisLabel: xSales,
                    yAxisLabel: ySales,
                    columns: [xSales, ySales].filter(Boolean),
                    position: { top: '10px', left: '10px' },
                    size: { width: '580px', height: '320px' }
                },
                {
                    id: 'chart-sales-line',
                    type: 'smooth-line',
                    color: '#10b981',
                    title: 'बिक्री रुझान (Sales Trend Line)',
                    xAxisLabel: xSales,
                    yAxisLabel: ySales,
                    columns: [xSales, ySales].filter(Boolean),
                    position: { top: '10px', left: '610px' },
                    size: { width: '580px', height: '320px' }
                },
                {
                    id: 'chart-sales-pie',
                    type: 'rose-radius',
                    color: '#f59e0b',
                    title: 'श्रेणी वितरण (Category Distribution Rose)',
                    xAxisLabel: xSales,
                    yAxisLabel: ySales,
                    columns: [xSales, ySales].filter(Boolean),
                    position: { top: '350px', left: '300px' },
                    size: { width: '580px', height: '320px' }
                }
            ],
            chartGlobalSettings: {
                gridShowHide: true,
                tooltipOnOff: true,
                zoomEnable: true,
                colorPaletteName: 'classic',
                showLabels: true
            },
            backgroundTemplateIndex: "1"
        },
        {
            id: 'preset-finance',
            name: 'वित्त एवं बजट टेम्पलेट (Finance & Budget)',
            department: 'Finance',
            description: 'विभागवार खर्चों, बजट बनाम वास्तविक व्यय, और लाभ मार्जिन का विश्लेषण।',
            isCustom: false,
            visualizations: [
                {
                    id: 'chart-fin-bar',
                    type: 'grouped-bar',
                    color: '#ec4899',
                    title: 'विभागवार व्यय एवं राजस्व (Department Expenses)',
                    xAxisLabel: xFinance,
                    yAxisLabel: yFinanceExpense,
                    columns: [xFinance, yFinanceExpense, yFinanceRevenue].filter(Boolean),
                    position: { top: '10px', left: '10px' },
                    size: { width: '580px', height: '320px' }
                },
                {
                    id: 'chart-fin-pie',
                    type: 'doughnut',
                    color: '#8b5cf6',
                    title: 'खर्च वितरण (Expense Doughnut)',
                    xAxisLabel: xFinance,
                    yAxisLabel: yFinanceExpense,
                    columns: [xFinance, yFinanceExpense].filter(Boolean),
                    position: { top: '10px', left: '610px' },
                    size: { width: '580px', height: '320px' }
                }
            ],
            chartGlobalSettings: {
                gridShowHide: true,
                tooltipOnOff: true,
                zoomEnable: true,
                colorPaletteName: 'vintage',
                showLabels: true
            },
            backgroundTemplateIndex: "2"
        },
        {
            id: 'preset-hr',
            name: 'एचआर और टीम वितरण टेम्पलेट (HR & Team Distribution)',
            department: 'HR',
            description: 'विभागवार कर्मचारी गणना, वेतन स्तर और प्रदर्शन मेट्रिक्स।',
            isCustom: false,
            visualizations: [
                {
                    id: 'chart-hr-bar',
                    type: 'horizontal-bar',
                    color: '#6366f1',
                    title: 'विभागवार कर्मचारी गणना (Employee Count)',
                    xAxisLabel: xHR,
                    yAxisLabel: yHRCount,
                    columns: [xHR, yHRCount].filter(Boolean),
                    position: { top: '10px', left: '10px' },
                    size: { width: '580px', height: '320px' }
                },
                {
                    id: 'chart-hr-radar',
                    type: 'radar',
                    color: '#06b6d4',
                    title: 'टीम प्रदर्शन प्रोफाइल (Team Performance Radar)',
                    xAxisLabel: xHR,
                    yAxisLabel: yHRCount,
                    columns: [xHR, yHRCount].filter(Boolean),
                    position: { top: '10px', left: '610px' },
                    size: { width: '580px', height: '320px' }
                }
            ],
            chartGlobalSettings: {
                gridShowHide: true,
                tooltipOnOff: true,
                zoomEnable: true,
                colorPaletteName: 'cool',
                showLabels: true
            },
            backgroundTemplateIndex: "3"
        }
    ];
    
    return [...customTemplates, ...defaultTemplates];
}

export async function saveTemplateLayout(name, department) {
    if (!name) return { success: false, message: "कृपया टेम्पलेट का नाम दर्ज करें।" };
    
    const id = `template-${Date.now()}`;
    const newTemplate = {
        id,
        name,
        department,
        isCustom: true,
        visualizations: JSON.parse(JSON.stringify(visualizations)),
        chartGlobalSettings: JSON.parse(JSON.stringify(chartGlobalSettings)),
        backgroundTemplateIndex: localStorage.getItem('selectedBackgroundTemplateIndex') || null,
        createdAt: new Date().toISOString()
    };
    
    try {
        const localTemplatesRaw = localStorage.getItem('vedrabi_dashboard_templates');
        let customTemplates = [];
        if (localTemplatesRaw) {
            customTemplates = JSON.parse(localTemplatesRaw);
        }
        customTemplates.unshift(newTemplate);
        localStorage.setItem('vedrabi_dashboard_templates', JSON.stringify(customTemplates));
        
        // Firebase sync
        if (currentUserId) {
            await db.collection('users').doc(currentUserId).set({
                customTemplates: customTemplates
            }, { merge: true });
        }
        
        return { success: true, template: newTemplate };
    } catch (e) {
        console.error("Error saving template layout:", e);
        return { success: false, message: e.message };
    }
}

export async function deleteTemplateLayout(id) {
    try {
        const localTemplatesRaw = localStorage.getItem('vedrabi_dashboard_templates');
        if (!localTemplatesRaw) return false;
        
        let customTemplates = JSON.parse(localTemplatesRaw);
        customTemplates = customTemplates.filter(t => t.id !== id);
        localStorage.setItem('vedrabi_dashboard_templates', JSON.stringify(customTemplates));
        
        // Firebase sync
        if (currentUserId) {
            await db.collection('users').doc(currentUserId).set({
                customTemplates: customTemplates
            }, { merge: true });
        }
        return true;
    } catch (e) {
        console.error("Error deleting template layout:", e);
        return false;
    }
}

export function loadTemplateLayout(template) {
    if (!template) return false;
    
    // Clear and load visualizations
    visualizations.length = 0;
    if (template.visualizations) {
        template.visualizations.forEach(v => {
            visualizations.push(JSON.parse(JSON.stringify(v)));
        });
    }
    
    // Load global settings
    if (template.chartGlobalSettings) {
        Object.assign(chartGlobalSettings, template.chartGlobalSettings);
    }
    
    // Set background index
    if (template.backgroundTemplateIndex !== undefined && template.backgroundTemplateIndex !== null) {
        localStorage.setItem('selectedBackgroundTemplateIndex', template.backgroundTemplateIndex);
        
        // Update body or container background if applicable
        const backdropSelect = document.getElementById('canvasBackdropTheme');
        if (backdropSelect) {
            backdropSelect.value = template.backgroundTemplateIndex;
            // trigger change event to reapply style
            backdropSelect.dispatchEvent(new Event('change'));
        }
    }
    
    return true;
}

window.changePage = changePage;