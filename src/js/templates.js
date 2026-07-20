import { 
    getTemplatesList, 
    saveTemplateLayout, 
    deleteTemplateLayout, 
    loadTemplateLayout, 
    saveDashboardSettings 
} from '../store/DataHandler.js';
import { plotAll } from './charts.js';
import { showMessage } from './utils.js';

let currentDeptFilter = 'All';

export function initializeTemplates() {
    // Save button event listener
    const saveBtn = document.getElementById('saveTemplateLayoutBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('templateNameInput');
            const deptSelect = document.getElementById('templateDeptSelect');
            if (!nameInput || !deptSelect) return;
            
            const name = nameInput.value.trim();
            const dept = deptSelect.value;
            
            if (!name) {
                showMessage("कृपया टेम्पलेट का नाम दर्ज करें।", "warning");
                return;
            }
            
            const res = await saveTemplateLayout(name, dept);
            if (res.success) {
                nameInput.value = '';
                showMessage(`टेम्पलेट '${name}' सहेजा गया!`, 'success');
                renderTemplatesUI();
            } else {
                showMessage(res.message || "त्रुटि सहेजने में।", "danger");
            }
        });
    }

    // Filter button event listeners
    const filterBtns = document.querySelectorAll('.template-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline-secondary');
            });
            this.classList.remove('btn-outline-secondary');
            this.classList.add('btn-primary');
            currentDeptFilter = this.dataset.dept;
            renderTemplatesUI();
        });
    });
}

export function renderTemplatesUI() {
    const container = document.getElementById('templatesListContainer');
    if (!container) return;
    
    const templates = getTemplatesList();
    const filtered = currentDeptFilter === 'All' 
        ? templates 
        : templates.filter(t => t.department === currentDeptFilter);
        
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4" style="font-size: 11px;">
                <i class="bi bi-folder-x fs-4"></i>
                <p class="mt-2">इस श्रेणी में कोई टेम्पलेट नहीं मिला।</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    filtered.forEach(t => {
        const badgeClass = t.department === 'Sales' ? 'bg-primary' 
            : t.department === 'Finance' ? 'bg-danger' 
            : t.department === 'HR' ? 'bg-info text-dark' 
            : 'bg-secondary';
            
        const isCustomBadge = t.isCustom 
            ? `<span class="badge bg-success-subtle text-success border border-success" style="font-size: 8px;">Custom</span>`
            : `<span class="badge bg-warning-subtle text-warning border border-warning" style="font-size: 8px;">Preset</span>`;

        html += `
            <div class="card p-2.5 border hover-shadow rounded-3 transition-all mb-2" style="font-size: 11px; background-color: var(--bs-body-bg); color: var(--bs-body-color);">
                <div class="d-flex justify-content-between align-items-start gap-1">
                    <div class="fw-bold text-truncate" style="max-width: 170px;" title="${t.name}">
                        ${t.name}
                    </div>
                    <div class="d-flex align-items-center gap-1">
                        ${isCustomBadge}
                        <span class="badge ${badgeClass}" style="font-size: 8px;">${t.department}</span>
                    </div>
                </div>
                <p class="text-muted text-xs my-1.5 line-clamp-2">${t.description || `${t.visualizations.length} विज़ुअलाइज़ेशन लेआउट सहेजा गया।`}</p>
                <div class="d-flex justify-content-between align-items-center gap-2 mt-1">
                    <button class="btn btn-xs btn-primary apply-template-layout-btn flex-grow-1" data-id="${t.id}">
                        <i class="bi bi-box-arrow-in-right"></i> लागू करें (Load)
                    </button>
                    ${t.isCustom ? `
                        <button class="btn btn-xs btn-outline-danger delete-template-layout-btn" data-id="${t.id}" title="हटाएं">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners for load
    container.querySelectorAll('.apply-template-layout-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const item = templates.find(t => t.id === id);
            if (item) {
                const success = loadTemplateLayout(item);
                if (success) {
                    // Re-render all charts
                    plotAll();
                    await saveDashboardSettings();
                    
                    // Close offcanvas
                    const sidebarEl = document.getElementById('offcanvasSidebar');
                    if (sidebarEl) {
                        const bsOffcanvas = bootstrap.Offcanvas.getInstance(sidebarEl);
                        bsOffcanvas?.hide();
                    }
                    showMessage(`लेआउट '${item.name}' सफलतापूर्वक लोड किया गया!`, 'success');
                }
            }
        });
    });
    
    // Add event listeners for delete
    container.querySelectorAll('.delete-template-layout-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (confirm("क्या आप वाकई इस टेम्पलेट को हटाना चाहते हैं?")) {
                const success = await deleteTemplateLayout(id);
                if (success) {
                    showMessage("टेम्पलेट सफलतापूर्वक हटा दिया गया।", "info");
                    renderTemplatesUI();
                }
            }
        });
    });
}
