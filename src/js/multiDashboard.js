// src/js/multiDashboard.js
import { 
    getDashboardsList, 
    getActiveDashboardId, 
    createNewDashboard, 
    renameDashboard, 
    deleteDashboard, 
    switchDashboard 
} from '../store/DataHandler.js';
import { showMessage, showCustomPrompt, showCustomConfirm } from './utils.js';
import { convertToCustomSelect } from './customSelect.js';

export function initializeMultiDashboard() {
    const mainHeader = document.getElementById('mainVisualizationsHeader');
    if (!mainHeader) {
        console.warn('mainVisualizationsHeader not found; multi-dashboard bar skipped.');
        return;
    }

    // Wrap the header or place the controls right next to it or above it.
    // Let's create a beautiful dashboard control panel
    let dashboardPanel = document.getElementById('multiDashboardPanel');
    if (!dashboardPanel) {
        dashboardPanel = document.createElement('div');
        dashboardPanel.id = 'multiDashboardPanel';
        dashboardPanel.className = 'd-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 bg-light-subtle rounded-4 border shadow-sm';
        dashboardPanel.style.borderColor = 'rgba(226, 232, 240, 0.8)';
        
        dashboardPanel.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="bg-primary-subtle text-primary rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-speedometer2 fs-5"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold text-dark-emphasis" style="font-size: 1.1rem;">डैशबोर्ड स्पेस (Dashboard Spaces)</h5>
                    <p class="text-secondary mb-0 small">विभिन्न डैशबोर्ड्स के बीच स्विच करें या नया बनाएं</p>
                </div>
            </div>
            
            <div class="d-flex align-items-center flex-wrap gap-2">
                <div class="input-group input-group-sm" style="min-width: 250px; max-width: 350px;">
                    <span class="input-group-text border-end-0"><i class="bi bi-folder2-open text-primary"></i></span>
                    <select id="dashboardSelect" class="form-select form-select-sm fw-bold border-start-0" style="cursor: pointer;">
                        <!-- Options will be populated dynamically -->
                    </select>
                </div>
                
                <button id="btnRenameDashboard" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" title="डैशबोर्ड का नाम बदलें">
                    <i class="bi bi-pencil-square"></i> <span class="d-none d-sm-inline">नाम बदलें</span>
                </button>
                
                <button id="btnDeleteDashboard" class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" title="डैशबोर्ड हटाएं">
                    <i class="bi bi-trash3"></i> <span class="d-none d-sm-inline">हटाएं</span>
                </button>
                
                <button id="btnCreateDashboard" class="btn btn-sm btn-success d-flex align-items-center gap-1 fw-bold">
                    <i class="bi bi-plus-circle"></i> <span>नया डैशबोर्ड</span>
                </button>
            </div>
        `;

        // Insert before mainHeader
        mainHeader.parentNode.insertBefore(dashboardPanel, mainHeader);
    }

    // Function to populate the dashboard dropdown
    function updateDropdown() {
        const select = document.getElementById('dashboardSelect');
        if (!select) return;

        const list = getDashboardsList();
        const activeId = getActiveDashboardId();

        select.innerHTML = '';
        list.forEach(dash => {
            const option = document.createElement('option');
            option.value = dash.id;
            option.textContent = dash.name || 'बेनामी डैशबोर्ड';
            if (dash.id === activeId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    // Bind event listeners
    const select = document.getElementById('dashboardSelect');
    const btnCreate = document.getElementById('btnCreateDashboard');
    const btnRename = document.getElementById('btnRenameDashboard');
    const btnDelete = document.getElementById('btnDeleteDashboard');

    if (select) {
        select.addEventListener('change', async (e) => {
            const targetId = e.target.value;
            if (targetId && targetId !== getActiveDashboardId()) {
                await switchDashboard(targetId);
            }
        });
    }

    if (btnCreate) {
        btnCreate.addEventListener('click', async () => {
            const name = await showCustomPrompt(
                "नया डैशबोर्ड बनाएं (Create New Dashboard)",
                "नए डैशबोर्ड का नाम दर्ज करें (Dashboard Name):",
                ""
            );
            if (name === null) return; // user cancelled
            const cleanName = name.trim();
            if (!cleanName) {
                showMessage("डैशबोर्ड का नाम खाली नहीं हो सकता!", "warning");
                return;
            }
            await createNewDashboard(cleanName);
        });
    }

    if (btnRename) {
        btnRename.addEventListener('click', async () => {
            const activeId = getActiveDashboardId();
            const currentName = select.options[select.selectedIndex]?.text || '';
            const newName = await showCustomPrompt(
                "डैशबोर्ड का नाम बदलें (Rename Dashboard)",
                "डैशबोर्ड का नया नाम दर्ज करें (New Name):",
                currentName
            );
            if (newName === null) return;
            const cleanName = newName.trim();
            if (!cleanName) {
                showMessage("डैशबोर्ड का नाम खाली नहीं हो सकता!", "warning");
                return;
            }
            await renameDashboard(activeId, cleanName);
            showMessage("डैशबोर्ड का नाम सफलतापूर्वक बदला गया!", "success");
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener('click', async () => {
            const activeId = getActiveDashboardId();
            const currentName = select.options[select.selectedIndex]?.text || '';
            
            if (getDashboardsList().length <= 1) {
                showMessage("आप आखिरी डैशबोर्ड को नहीं हटा सकते!", "warning");
                return;
            }

            const confirmed = await showCustomConfirm(
                "डैशबोर्ड हटाएं (Delete Dashboard)?",
                `क्या आप वाकई डैशबोर्ड '${currentName}' को हटाना चाहते हैं? इसके सभी चार्ट और सेटिंग्स हटा दिए जाएंगे। (Are you sure you want to delete dashboard '${currentName}'? This action cannot be undone.)`
            );
            if (confirmed) {
                await deleteDashboard(activeId);
                showMessage("डैशबोर्ड सफलतापूर्वक हटा दिया गया!", "info");
            }
        });
    }

    // Listen to dashboardsUpdated event
    document.addEventListener('dashboardsUpdated', updateDropdown);

    // Initial update
    updateDropdown();
    if (select) {
        convertToCustomSelect(select);
    }
}
