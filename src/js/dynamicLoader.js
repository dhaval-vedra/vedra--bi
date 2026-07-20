// src/js/dynamicLoader.js
// Dynamically loads both Sidebars and Modals with robust client-side caching and dynamic initialization.

import { dynamicTemplates } from './dynamicTemplates.js';

// Cache to prevent duplicate loading/re-rendering of templates
const loadedElements = {};

/**
 * Returns a high-fidelity Skeleton Screen HTML for loading state feedback
 */
function getSkeletonHTML(type = 'sidebar') {
    if (type === 'modal') {
        return `
            <div class="modal-dialog modal-dialog-centered modal-lg p-4">
                <div class="modal-content animate-pulse" style="border: 0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <div class="modal-header border-bottom-0 pb-3">
                        <div class="bg-secondary rounded" style="height: 24px; width: 35%; opacity: 0.15;"></div>
                    </div>
                    <div class="modal-body py-4">
                        <div class="bg-secondary rounded mb-2" style="height: 14px; width: 90%; opacity: 0.1;"></div>
                        <div class="bg-secondary rounded mb-2" style="height: 14px; width: 75%; opacity: 0.1;"></div>
                        <div class="bg-secondary rounded mb-4" style="height: 14px; width: 40%; opacity: 0.1;"></div>
                        <div class="bg-secondary rounded" style="height: 80px; width: 100%; opacity: 0.05;"></div>
                    </div>
                    <div class="modal-footer border-top-0 pt-3">
                        <div class="bg-secondary rounded-pill" style="height: 38px; width: 20%; opacity: 0.15;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="skeleton-sidebar p-3 animate-pulse">
            <!-- Header skeleton -->
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div class="bg-secondary rounded" style="height: 24px; width: 45%; opacity: 0.15;"></div>
                <div class="bg-secondary rounded-pill" style="height: 18px; width: 25%; opacity: 0.15;"></div>
            </div>
            <!-- Body text skeleton -->
            <div class="mb-3">
                <div class="bg-secondary rounded mb-2" style="height: 12px; width: 100%; opacity: 0.1;"></div>
                <div class="bg-secondary rounded mb-2" style="height: 12px; width: 85%; opacity: 0.1;"></div>
            </div>
            <!-- Card / Group Box skeleton -->
            <div class="border rounded p-3 mb-4 bg-light-subtle">
                <div class="bg-secondary rounded mb-3" style="height: 14px; width: 40%; opacity: 0.15;"></div>
                <div class="bg-secondary rounded mb-2" style="height: 38px; width: 100%; opacity: 0.1;"></div>
                <div class="bg-secondary rounded mt-2" style="height: 12px; width: 60%; opacity: 0.1;"></div>
            </div>
            <!-- List / Options skeleton -->
            <div class="mb-4">
                <div class="bg-secondary rounded mb-2" style="height: 14px; width: 30%; opacity: 0.15;"></div>
                <div class="bg-secondary rounded mb-2" style="height: 48px; width: 100%; opacity: 0.1;"></div>
                <div class="bg-secondary rounded mb-2" style="height: 48px; width: 100%; opacity: 0.1;"></div>
            </div>
            <!-- Button skeleton -->
            <div class="bg-secondary rounded mt-4" style="height: 38px; width: 100%; opacity: 0.15;"></div>
        </div>
    `;
}

/**
 * Loads dynamic content into a target DOM container. Uses memory cache to prevent duplicate loads.
 * @param {string} elementId - The ID of the target element (e.g. 'offcanvasSidebar', 'mainMenuModal', etc.)
 * @param {string} templateKey - Key of the template to load (e.g. 'chartSettingsContent', 'dataInsertSidebar', etc.)
 * @returns {Promise<boolean>}
 */
export async function loadDynamicContent(elementId, templateKey) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`[DynamicLoader] Container element with ID '${elementId}' not found.`);
        return false;
    }

    // Determine the type (sidebar or modal) based on class lists
    const isModal = container.classList.contains('modal');
    const isSidebar = container.classList.contains('offcanvas');
    const type = isModal ? 'modal' : 'sidebar';

    const cacheKey = `${elementId}:${templateKey}`;

    // If already loaded, make sure container is display block/shown and return (Robust Caching with Dynamic Refresh)
    if (loadedElements[cacheKey]) {
        if (isModal) {
            container.style.display = '';
        } else if (isSidebar) {
            // Do NOT set display: block on the offcanvas container, it breaks flexbox scrolling!
            const targetInner = document.getElementById(templateKey);
            if (targetInner) {
                targetInner.style.display = 'block';
            }
        } else {
            container.style.display = 'block';
            const targetInner = document.getElementById(templateKey) || container;
            targetInner.style.display = 'block';
        }

        // Refresh specific template dynamic states (e.g., chart lists, sliders, pickrs) on re-opening
        try {
            await initializeSpecificTemplate(templateKey || elementId);
        } catch (error) {
            console.error(`[DynamicLoader] Error re-initializing template '${templateKey || elementId}':`, error);
        }
        return true;
    }

    // Render beautiful skeleton animation as loading feedback
    if (isModal) {
        container.innerHTML = getSkeletonHTML('modal');
    } else {
        // If it is sidebar, let's find the inner body or target container
        const targetInner = document.getElementById(templateKey) || container;
        targetInner.innerHTML = getSkeletonHTML('sidebar');
        targetInner.style.display = 'block';
    }

    // Simulated short delay for smooth skeleton loader UX
    await new Promise(resolve => setTimeout(resolve, 200));

    // Retrieve template string
    const templateHtml = dynamicTemplates[templateKey] || dynamicTemplates[elementId];
    if (!templateHtml) {
        container.innerHTML = `<div class="alert alert-danger m-3">त्रुटि: सामग्री '${templateKey || elementId}' लोड नहीं हो सकी।</div>`;
        return false;
    }

    // Inject actual HTML content
    if (isModal) {
        container.innerHTML = templateHtml;
    } else {
        const targetInner = document.getElementById(templateKey) || container;
        targetInner.innerHTML = templateHtml;
    }

    // Attach event listeners for freshly injected DOM elements
    const { attachGlobalEventHandlers } = await import('./main_handlers.js');
    const { allActiveChartInstances } = await import('./chartState.js');
    attachGlobalEventHandlers(allActiveChartInstances);

    // Run custom initialization logic for specific templates
    try {
        await initializeSpecificTemplate(templateKey || elementId);
    } catch (error) {
        console.error(`[DynamicLoader] Error initializing template '${templateKey || elementId}':`, error);
    }

    // Auto-convert selects and color pickers to modern premium counterparts
    try {
        const targetContainer = isModal ? container : (document.getElementById(templateKey) || container);
        if (targetContainer) {
            const { convertAllColorPickersInContainer } = await import('./customPickr.js');
            const { convertAllSelectsInContainer } = await import('./customSelect.js');
            convertAllColorPickersInContainer(targetContainer);
            convertAllSelectsInContainer(targetContainer);
        }
    } catch (err) {
        console.warn('Error auto-converting custom pickers or selects:', err);
    }

    // Cache the loaded state
    loadedElements[cacheKey] = true;
    return true;
}

/**
 * Smart Router / Dynamic Init Dispatcher for specific template requirements
 */
async function initializeSpecificTemplate(key) {
    switch (key) {
        // 1. Sidebar Templates
        case 'chartSettingsContent':
            const { createChartTypeGallery } = await import('./chartTypeGallery.js');
            createChartTypeGallery();

            const { initializeChartPreview } = await import('./charts.js');
            initializeChartPreview();

            // Populate Column list and Drag & Drop
            const { headers } = await import('../store/DataHandler.js');
            const { populateColumnDragLists, initializeDragAndDrop } = await import('./chartcolomdrag.js');
            if (headers && headers.length > 0) {
                populateColumnDragLists(headers);
            }
            initializeDragAndDrop();

            // Setup Z-Axis Dropzone Toggle on Change
            const chartTypeEl = document.getElementById('chartType');
            if (chartTypeEl) {
                chartTypeEl.addEventListener('change', (e) => {
                    const zAxisDropZoneContainer = document.getElementById('zAxisDropZoneContainer');
                    if (zAxisDropZoneContainer) {
                        zAxisDropZoneContainer.style.display = (e.target.value === 'bar3D' || e.target.value === 'line3D') ? 'block' : 'none';
                    }
                });
            }
            break;

        case 'userInfoContent':
            const { updateUserProfileUI, initializeAdvancedProfileSection } = await import('./main.js');
            updateUserProfileUI();
            initializeAdvancedProfileSection();
            break;

        case 'dashboardThemeContent':
            const { initializeDashboardThemeSection } = await import('./kpiSparklines.js');
            initializeDashboardThemeSection();
            break;

        case 'textboxContent':
            await loadDynamicContent('dataInsertSidebar', 'dataInsertSidebar');
            const { initializeTextboxEditor } = await import('./editor.js');
            initializeTextboxEditor();
            break;

        case 'advancedSettingsContent':
            const { populateAdvancedChartSettingsControls } = await import('./main.js');
            populateAdvancedChartSettingsControls();
            break;

        case 'templatesContent':
            const { initializeTemplates, renderTemplatesUI } = await import('./templates.js');
            initializeTemplates();
            renderTemplatesUI();
            break;

        case 'kpiBuilderContent':
            const { initializeKpiBuilder } = await import('./kpiSparklines.js');
            initializeKpiBuilder();
            break;

        case 'dataContent':
            const { initializeDataTransformerUI } = await import('./dataTransformerUI.js');
            initializeDataTransformerUI();
            break;

        case 'additionalActionsContent': {
            // Initialize Advanced Actions (smart insights, data audit, print report, auto-refresh, stream simulation)
            const { initializeAdvancedActions } = await import('./advancedActions.js');
            initializeAdvancedActions();

            // Render Background Templates
            const { renderBackgroundTemplates, backgroundTemplates } = await import('./backgroundTemplates.js');
            renderBackgroundTemplates('backgroundTemplateGallery');

            // Add click handler for background template selection
            const backgroundTemplateGallery = document.getElementById('backgroundTemplateGallery');
            if (backgroundTemplateGallery) {
                backgroundTemplateGallery.addEventListener('click', (event) => {
                    const clickedItem = event.target.closest('.background-template-item');
                    if (clickedItem) {
                        document.querySelectorAll('.background-template-item').forEach(item => {
                            item.style.border = '1px solid #ddd';
                            item.classList.remove('selected');
                        });
                        clickedItem.style.border = '2px solid #007bff';
                        clickedItem.classList.add('selected');
                        window.selectedTemplateIndex = parseInt(clickedItem.dataset.index);
                    }
                });
            }

            // Apply Background Template Button Event Listener
            const { showMessage, attachEventListener } = await import('./utils.js');
            const dashboardContent = document.querySelector('.main-content-container');
            
            attachEventListener('applyTemplateBtn', 'click', () => {
                if (window.selectedTemplateIndex !== undefined && window.selectedTemplateIndex !== -1 && dashboardContent) {
                    const selectedTemplate = backgroundTemplates[window.selectedTemplateIndex];
                    dashboardContent.style.backgroundColor = selectedTemplate.backgroundColor;
                    dashboardContent.style.color = selectedTemplate.textColor;
                    localStorage.setItem('dashboardBackgroundColor', selectedTemplate.backgroundColor);
                    localStorage.setItem('dashboardTextColor', selectedTemplate.textColor);
                    localStorage.setItem('selectedBackgroundTemplateIndex', window.selectedTemplateIndex);
                    showMessage(`टेम्पलेट '${selectedTemplate.name}' सफलतापूर्वक लागू किया गया है!`, 'success');
                    
                    import('../store/DataHandler.js').then(({ saveDashboardSettings }) => {
                        saveDashboardSettings();
                    });
                } else {
                    showMessage('कृपया लागू करने के लिए एक टेम्पलेट चुनें।', 'warning');
                }
            });
            break;
        }

        case 'chartEffectsContent':
            // Call robust main chart effects initialization
            const { initializeChartEffects } = await import('./chartEffects.js');
            initializeChartEffects();
            // Smart Pickr Initialization (Moved from index.html inline script)
            initializePickrColorPickers();
            break;

        case 'chartFormattingContent':
            // Call robust main chart container styling initialization
            const { initializeChartFormatting } = await import('./chartContainerColors.js');
            initializeChartFormatting();
            break;

        // 2. Modals & Offcanvas Containers
        case 'mainMenuModal':
            // mainMenuModal contains 'dataStatisticsContent' and 'dashboardViewContent'.
            // Trigger specific initialization for whichever content area is displayed.
            const statsArea = document.getElementById('dataStatisticsContent');
            const dashboardArea = document.getElementById('dashboardViewContent');
            
            if (statsArea && statsArea.style.display !== 'none') {
                const { displayStats } = await import('../store/UIHandler.js');
                displayStats();
            }
            if (dashboardArea && dashboardArea.style.display !== 'none') {
                // Initialize backdrop theme selectors etc if needed
                const canvasBackdropTheme = document.getElementById('canvasBackdropTheme');
                if (canvasBackdropTheme) {
                    canvasBackdropTheme.value = localStorage.getItem('canvasBackdropTheme') || 'default';
                }
            }
            break;

        case 'addDataModal':
            const { populateAddDataForm } = await import('../store/UIHandler.js');
            populateAddDataForm();
            break;

        case 'dataInsertSidebar':
            // Live data insertion sidebar
            const { triggerLiveSidebarInit } = await import('./liveDataHandler.js');
            if (typeof triggerLiveSidebarInit === 'function') {
                triggerLiveSidebarInit();
            }
            break;

        default:
            break;
    }
}

/**
 * Custom extracted Pickr initialization from old index.html script block
 */
function initializePickrColorPickers() {
    if (typeof window.Pickr === 'undefined') {
        console.warn('[DynamicLoader] Pickr is not globally available.');
        return;
    }

    const pickrOptions = (elId, defaultColor) => {
        const el = document.getElementById(elId);
        if (!el) return null;
        
        return window.Pickr.create({
            el: '#' + elId,
            theme: 'classic',
            default: defaultColor,
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: { input: true, save: true }
            }
        });
    };

    const shadowPickr = pickrOptions('shadowColorPicker', '#000000');
    const bgPickr = pickrOptions('backgroundColorPicker', '#ffffff');
    const borderPickr = pickrOptions('chartBorderColorPicker', '#CCCCCC');

    const bindPickr = (pickrInstance, inputId) => {
        if (!pickrInstance) return;
        pickrInstance.on('save', (color, instance) => {
            const inp = document.getElementById(inputId);
            if (inp) inp.value = color.toHEXA().toString();
            instance.hide();
        });
        pickrInstance.on('change', (color) => {
            const inp = document.getElementById(inputId);
            if (inp) inp.value = color.toHEXA().toString();
        });
    };

    // Auto-create hidden inputs for storing selected hex codes
    ['shadowColor', 'backgroundColor', 'borderColor'].forEach(id => {
        if (!document.getElementById(id)) {
            const inp = document.createElement('input');
            inp.type = 'hidden';
            inp.id = id;
            const container = document.getElementById('customEffectsSection');
            if (container) {
                container.appendChild(inp);
            } else {
                document.body.appendChild(inp);
            }
        }
    });

    bindPickr(shadowPickr, 'shadowColor');
    bindPickr(bgPickr, 'backgroundColor');
    bindPickr(borderPickr, 'borderColor');
}

// ----------------------------------------------------
// Global Event Interceptors for Bootstrap Modal & Offcanvas Components
// ----------------------------------------------------
if (typeof document !== 'undefined') {
    document.addEventListener('show.bs.modal', async (event) => {
        const modalId = event.target.id;
        const validModals = ['addDataModal', 'mainMenuModal', 'codeEditorModal', 'advancedAnalyticsModal', 'chartAnnotationModal'];
        if (validModals.includes(modalId)) {
            await loadDynamicContent(modalId, modalId);
        }
    });

    document.addEventListener('show.bs.offcanvas', async (event) => {
        const offcanvasId = event.target.id;
        if (offcanvasId === 'dataInsertSidebar') {
            await loadDynamicContent(offcanvasId, offcanvasId);
        }
    });
}

