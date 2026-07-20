// js/main_core.js

// Vedra Bi की मुख्य.js फ़ाइल का पहला हिस्सा।
// इसमें मुख्य इनिशियलाइज़ेशन, DOMContentLoaded लिसनर, और मुख्य UI/मेन्यू लॉजिक शामिल है।

// आवश्यक मॉड्यूल्स आयात करें
import { populateColumnDragLists, initializeDragAndDrop, getChartColumns, populateDropZones } from './chartcolomdrag.js';
import { renderChartContainerColorTemplates, applyChartContainerColor, renderDashboardChartOverview, applyCustomChartContainerColor } from './chartContainerColors.js';
import {
    applyEffect, // शायद इसकी ज़रूरत न हो अगर main_handlers में लागू हो रहा है
    chartEffectsTemplates,
    renderChartEffectsTemplates,
    renderDashboardChartList
} from './chartEffects.js';
import { auth, showMessage, attachEventListener, toggleTheme, downloadTemplate } from './utils.js';
import {
    initData,
    headers, // headers को main_handlers में इस्तेमाल किया जाता है, पर main_core को initData के लिए ज़रूरत पड़ सकती है
    saveDashboardSettings,
    getRawData

} from '../store/DataHandler.js';
import {
    displayStats
} from '../store/UIHandler.js';
import { visualizations, chartGlobalSettings, initializeChartPreview, discardActivePreviewChart } from './charts.js';
import { sendChatMessage } from './chat.js'; // इसे शायद DOMContentLoaded के अंदर कॉल किया जाएगा
import { backgroundTemplates, renderBackgroundTemplates } from './backgroundTemplates.js';
import { initializeTextboxEditor } from './editor.js';
import { toggleLockMode } from './drag_drop.js';
import { createChartTypeGallery } from './chartTypeGallery.js'
import { initializeLoginAndAuth } from './login.js';
import { initializeKPIAndThemes } from './kpiSparklines.js';

// main_handlers.js से इवेंट हैंडलर फ़ंक्शन आयात करें
import { attachGlobalEventHandlers } from './main_handlers.js';
import { initializeDataTransformerUI } from './dataTransformerUI.js';
import { initializeAdvancedActions } from './advancedActions.js';
import { initializeTemplates, renderTemplatesUI } from './templates.js';
import { loadDynamicContent } from './dynamicLoader.js';
import { initializeMultiDashboard } from './multiDashboard.js';
import { initializeFloatingFab } from './floatingFab.js';
import { initializeGuidedTour } from './guidedTour.js';
import { initializeCommandPalette } from './commandPalette.js';
import { initializePresentationMode } from './presentationMode.js';
import { initializeAudioNarrator } from './audioNarrator.js';





import { allActiveChartInstances } from './chartState.js';
import { verifyAndRecoverCDNs } from './cdnManager.js';



// ====================================================================
// एडवांस्ड चार्ट सेटिंग्स नियंत्रणों को पॉपुलेट करने का फ़ंक्शन
// इसे main_handlers.js या एक नए यूटिलिटी फ़ाइल में भी ले जाया जा सकता है,
// लेकिन इसे यहाँ Modal लॉजिक के साथ रखते हैं।
// ====================================================================
export function populateAdvancedChartSettingsControls() {
    const gridShowHide = document.getElementById('gridShowHide');
    const tooltipOnOff = document.getElementById('tooltipOnOff');
    const zoomEnable = document.getElementById('zoomEnable');
    const animationDuration = document.getElementById('animationDuration');
    const animationDurationValue = document.getElementById('animationDurationValue');
    const axisFormat = document.getElementById('axisFormat');
    const legendPosition = document.getElementById('legendPosition');
    const showLabels = document.getElementById('showLabels');

    const showToolbox = document.getElementById('showToolbox');
    const colorPaletteName = document.getElementById('colorPaletteName');
    const fontSize = document.getElementById('fontSize');
    const gridStyle = document.getElementById('gridStyle');
    const lineStyle = document.getElementById('lineStyle');
    const areaFill = document.getElementById('areaFill');
    const barRounded = document.getElementById('barRounded');

    if (gridShowHide) gridShowHide.checked = chartGlobalSettings.gridShowHide;
    if (tooltipOnOff) tooltipOnOff.checked = chartGlobalSettings.tooltipOnOff;
    if (zoomEnable) zoomEnable.checked = chartGlobalSettings.zoomEnable;
    if (animationDuration) {
        animationDuration.value = chartGlobalSettings.animationDuration;
        if (animationDurationValue) animationDurationValue.textContent = chartGlobalSettings.animationDuration;
    }
    if (axisFormat) axisFormat.value = chartGlobalSettings.axisFormat;
    if (legendPosition) legendPosition.value = chartGlobalSettings.legendPosition;
    if (showLabels) showLabels.checked = chartGlobalSettings.showLabels;

    if (showToolbox) showToolbox.checked = chartGlobalSettings.showToolbox;
    if (colorPaletteName) colorPaletteName.value = chartGlobalSettings.colorPaletteName;
    if (fontSize) fontSize.value = chartGlobalSettings.fontSize;
    if (gridStyle) gridStyle.value = chartGlobalSettings.gridStyle;
    if (lineStyle) lineStyle.value = chartGlobalSettings.lineStyle;
    if (areaFill) areaFill.checked = chartGlobalSettings.areaFill;
    if (barRounded) barRounded.checked = chartGlobalSettings.barRounded;
}

// ====================================================================
// Modal को विशिष्ट सामग्री के साथ खोलने का फ़ंक्शन
// ====================================================================
async function openModalWithContent(targetContentId) {
    await loadDynamicContent('mainMenuModal', 'mainMenuModal');

    const modal = new bootstrap.Modal(document.getElementById('mainMenuModal'), {
        backdrop: 'static'
    });
    const modalTitle = document.getElementById('mainMenuModalLabel');
    const modalBody = document.querySelector('#mainMenuModal .modal-body');

    // सभी सामग्री क्षेत्रों को पहले छिपाएं
    document.querySelectorAll('.modal-content-area').forEach(el => el.style.display = 'none');

    // क्लिक किए गए मेनू आइटम के लिए विशिष्ट सामग्री दिखाएं
    const contentToShow = document.getElementById(targetContentId);
    if (contentToShow) {
        contentToShow.style.display = 'block';
    }

    // Modal का शीर्षक सेट करें
    switch(targetContentId) {
        case 'advancedSettingsContent':
            modalTitle.textContent = 'एडवांस्ड चार्ट सेटिंग्स';
            populateAdvancedChartSettingsControls(); // Controls को पॉपुलेट करें
            break;
        case 'dataStatisticsContent':
            modalTitle.textContent = 'डेटा सांख्यिकी';
            displayStats(); // सांख्यिकी दिखाएं
            break;
        case 'dashboardViewContent':
            modalTitle.textContent = 'डैशबोर्ड दृश्य';
            break;
        default:
            modalTitle.textContent = 'सेटिंग्स';
            break;
    }

    // Modal दिखाएं
    modal.show();

    // मॉडल बंद होने पर बैकड्रॉप को हटाने के लिए इवेंट लिसनर
    const mainMenuModal = document.getElementById('mainMenuModal');
    if (mainMenuModal) {
        mainMenuModal.addEventListener('hidden.bs.modal', function () {
            const body = document.body;
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            body.classList.remove('modal-open');
            body.style.overflow = '';
            body.style.paddingRight = '';
        });
    }
}


// ====================================================================
// DOMContentLoaded Listener और मुख्य UI लॉजिक
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    // थीम लोड करें और लागू करें
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('silk-light-theme');
        const offcanvasNav = document.getElementById('offcanvasNav');
        if (offcanvasNav) offcanvasNav.classList.add('dark-theme');
        const offcanvasSidebar = document.getElementById('offcanvasSidebar');
        if (offcanvasSidebar) offcanvasSidebar.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('silk-light-theme');
    }

    // लॉगिन और ऑथेंटिकेशन लॉजिक को इनिशियलाइज़ करें
    initializeLoginAndAuth();

    // मल्टी-डैशबोर्ड और ड्रैग-एंड-ड्रॉप फ़्लोटिंग क्विक मेनू (FAB) इनिशियलाइज़ करें
    initializeMultiDashboard();
    initializeFloatingFab();
    initializeGuidedTour();
    initializeCommandPalette();
    initializePresentationMode();
    initializeAudioNarrator();

    // चैटबॉट पॉप-अप को दिखाने और छिपाने के लिए JavaScript (chatbot_Listener.js का भाग)
    const chatBtn = document.getElementById("openChatBtn");
    const chatPopup = document.getElementById("chatPopup");
    const closeChatBtn = document.getElementById("closeChatBtn");

    if (chatBtn && chatPopup) {
        chatBtn.addEventListener("click", () => {
            chatPopup.classList.toggle("show");
        });
    }

    if (closeChatBtn && chatPopup) {
        closeChatBtn.addEventListener("click", () => {
            chatPopup.classList.remove("show");
        });
    }

    const toggleChatFullscreenBtn = document.getElementById("toggleChatFullscreenBtn");
    const chatFullscreenIcon = document.getElementById("chatFullscreenIcon");
    if (toggleChatFullscreenBtn && chatPopup && chatFullscreenIcon) {
        toggleChatFullscreenBtn.addEventListener("click", () => {
            const isFullscreen = chatPopup.classList.toggle("fullscreen");
            if (isFullscreen) {
                chatFullscreenIcon.className = "bi bi-fullscreen-exit";
                toggleChatFullscreenBtn.title = "छोटा करें";
            } else {
                chatFullscreenIcon.className = "bi bi-fullscreen";
                toggleChatFullscreenBtn.title = "फुल स्क्रीन करें";
            }
        });
    }

    const toggleAgentMode = document.getElementById("toggleAgentMode");
    const agentModeBadge = document.getElementById("agentModeBadge");
    const agentControlDeck = document.getElementById("agentControlDeck");
    if (toggleAgentMode && agentModeBadge) {
        toggleAgentMode.addEventListener("change", (e) => {
            if (e.target.checked) {
                agentModeBadge.textContent = "एक्टिव (Active)";
                agentModeBadge.className = "badge bg-success text-white small pulse-badge";
                if (agentControlDeck) agentControlDeck.classList.remove("d-none");

                const chatHistoryDiv = document.getElementById("chatHistory");
                if (chatHistoryDiv) {
                    const welcomeMsg = document.createElement("div");
                    welcomeMsg.className = "alert alert-success p-2 mb-2 small text-center";
                    welcomeMsg.innerHTML = `<strong>🤖 एजेंट मोड सक्रिय (Agent Mode Active)!</strong><br>अब आप चैट में "चार्ट बनाओ", "इफ़ेक्ट लगाओ", या "नया डैशबोर्ड" कहकर आसान गाइडेड असिस्टेंट खोल सकते हैं।`;
                    chatHistoryDiv.appendChild(welcomeMsg);
                    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
                }
            } else {
                agentModeBadge.textContent = "नॉर्मल (Normal)";
                agentModeBadge.className = "badge bg-secondary text-white small";
                if (agentControlDeck) agentControlDeck.classList.add("d-none");
            }
        });
    }
 //   initializeChatbot(); // चैटबॉट को इनिशियलाइज़ करें

    // Offcanvas Sidebar Instance
    const offcanvasSidebar = document.getElementById('offcanvasSidebar');
    const bsOffcanvas = (offcanvasSidebar && typeof bootstrap !== 'undefined') ? bootstrap.Offcanvas.getOrCreateInstance(offcanvasSidebar) : null;
    const mainMenuLinks = document.querySelectorAll('.main-menu-bar .nav-link');
    const dashboardContent = document.querySelector('.main-content-container');
    const dashboardSection = document.getElementById('dashboardSection');

    // Toggle main sidebar event handler
    const toggleMainSidebarBtn = document.getElementById('toggleMainSidebarBtn');
    if (toggleMainSidebarBtn && bsOffcanvas && offcanvasSidebar) {
        toggleMainSidebarBtn.addEventListener('click', async (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            const isOpen = offcanvasSidebar.classList.contains('show');
            if (isOpen) {
                bsOffcanvas.hide();
            } else {
                const currentActive = document.querySelector('.main-menu-bar .nav-link.active');
                const targetContentId = currentActive ? currentActive.dataset.menuTarget : 'chartSettingsContent';

                document.querySelectorAll('.offcanvas-content').forEach(content => content.style.display = 'none');

                bsOffcanvas.show();
                await loadDynamicContent('offcanvasSidebar', targetContentId);
            }
        });
    }

    // ----------------------------------------------------
    // Chart Container Color / Custom Style Logic (साइडबार के अंदर)
    // ----------------------------------------------------
    const chartContainerColorGallery = document.getElementById('chartContainerColorGallery');
    let selectedChartContainerColorTemplateId = 'default-container-color';

    // चार्ट कंटेनर कलर टेम्पलेट्स को रेंडर करें
    if (chartContainerColorGallery) {
        renderChartContainerColorTemplates(chartContainerColorGallery, (templateId) => {
            selectedChartContainerColorTemplateId = templateId;
        });
    }

    // 'सभी चार्ट' और 'चयनित चार्ट' रेडियो बटन पर इवेंट हैंडलर
    document.getElementById('scopeAllCharts')?.addEventListener('change', (e) => {
        document.getElementById('dashboardChartOverview').style.display = e.target.checked ? 'none' : 'block';
    });

    document.getElementById('scopeSelectedCharts')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('dashboardChartOverview').style.display = 'block';
            renderDashboardChartOverview(document.getElementById('chartSelectionList'), allActiveChartInstances);
        }
    });

    // ----------------------------------------------------
    // Background Template Logic
    // ----------------------------------------------------
    renderBackgroundTemplates('backgroundTemplateGallery');

    window.selectedTemplateIndex = -1;
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

    // ----------------------------------------------------
    // Chart Effects Radio Button Logic
    // ----------------------------------------------------
    const setupEffectRadios = (radioId, sectionId) => {
        document.getElementById(radioId)?.addEventListener('change', () => {
            const customSec = document.getElementById('customEffectsSection');
            const tempSec = document.getElementById('templateEffectsSection');
            const codeSec = document.getElementById('customCodeEffectsSection');
            if (customSec) customSec.style.display = 'none';
            if (tempSec) tempSec.style.display = 'none';
            if (codeSec) codeSec.style.display = 'none';

            const targetSec = document.getElementById(sectionId);
            if (targetSec) targetSec.style.display = 'block';

            if (radioId === 'templateEffectsRadio') {
                const gallery = document.getElementById('effectsTemplatesGallery') || document.getElementById('chartEffectsTemplateGallery');
                if (gallery) {
                    renderChartEffectsTemplates(gallery, () => {});
                }
            }
        });
    };

    setupEffectRadios('customEffectsRadio', 'customEffectsSection');
    setupEffectRadios('templateEffectsRadio', 'templateEffectsSection');
    setupEffectRadios('customCodeRadio', 'customCodeEffectsSection');

    // Effects Scope Radio Logic
    document.getElementById('applyToAllRadio')?.addEventListener('change', (e) => {
        document.getElementById('dashboardChartOverviewEffects').style.display = e.target.checked ? 'none' : 'block';
    });
    document.getElementById('applyToSelectedRadio')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('dashboardChartOverviewEffects').style.display = 'block';
            renderDashboardChartList(document.getElementById('chartSelectionListEffects'));
        }
    });

    // ----------------------------------------------------
    // Load Saved Dashboard Colors
    // ----------------------------------------------------
    const savedBackgroundColor = localStorage.getItem('dashboardBackgroundColor');
    const savedTextColor = localStorage.getItem('dashboardTextColor');
    if (dashboardContent) {
        if (savedBackgroundColor) dashboardContent.style.backgroundColor = savedBackgroundColor;
        if (savedTextColor) dashboardContent.style.color = savedTextColor;
    }

    // ----------------------------------------------------
    // Main Menu Links Logic (Modal/Offcanvas Control)
    // ----------------------------------------------------
    mainMenuLinks.forEach(link => {
        link.addEventListener('click', async function(event) {
            if (this.id === 'toggleDashboardSectionBtn') {
                return; // custom listener handles it
            }
            event.preventDefault();
            event.stopPropagation(); // Stop Bootstrap from auto-toggling and causing instant hides

            const targetContentId = this.dataset.menuTarget;
            const isModal = this.dataset.bsToggle === 'modal';

            if (isModal) {
                // Modal trigger
                mainMenuLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                await openModalWithContent(targetContentId);
            } else {
                // Offcanvas trigger
                const isOpen = offcanvasSidebar ? offcanvasSidebar.classList.contains('show') : false;
                const isCurrentlyActive = this.classList.contains('active');

                if (isOpen && isCurrentlyActive) {
                    // Clicked the same active item while open -> Toggle close
                    if (bsOffcanvas) bsOffcanvas.hide();
                    this.classList.remove('active');
                } else {
                    // Switch active classes
                    mainMenuLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    // Hide old contents
                    document.querySelectorAll('.offcanvas-content').forEach(content => content.style.display = 'none');

                    // Open offcanvas
                    if (bsOffcanvas) bsOffcanvas.show();

                    // Load dynamic content
                    if (targetContentId) {
                        await loadDynamicContent('offcanvasSidebar', targetContentId);
                    }
                }
            }
        });
    });

    // Dashboard Section Visibility Toggle (Show/Hide)
    function toggleDashboardSection() {
        if (!dashboardSection) return;
        const isHidden = dashboardSection.classList.contains('d-none');
        if (isHidden) {
            dashboardSection.classList.remove('d-none');
            
            // Update sidebar button
            const textEl = document.getElementById('toggleDashboardSectionText');
            if (textEl) textEl.textContent = 'डैशबोर्ड छुपाएं';
            const iconEl = document.getElementById('toggleDashboardSectionIcon');
            if (iconEl) {
                iconEl.className = 'bi bi-eye-slash';
            }
            // Update small screen button
            const smallBtnIcon = document.querySelector('#toggleDashboardSectionSmallBtn i');
            if (smallBtnIcon) {
                smallBtnIcon.className = 'bi bi-eye-slash';
            }
            showMessage('डैशबोर्ड दिखाई दे रहा है (Dashboard Visible)', 'success');
        } else {
            dashboardSection.classList.add('d-none');
            
            // Update sidebar button
            const textEl = document.getElementById('toggleDashboardSectionText');
            if (textEl) textEl.textContent = 'डैशबोर्ड दिखाएं';
            const iconEl = document.getElementById('toggleDashboardSectionIcon');
            if (iconEl) {
                iconEl.className = 'bi bi-eye';
            }
            // Update small screen button
            const smallBtnIcon = document.querySelector('#toggleDashboardSectionSmallBtn i');
            if (smallBtnIcon) {
                smallBtnIcon.className = 'bi bi-eye';
            }
            showMessage('डैशबोर्ड छुपा दिया गया है (Dashboard Hidden)', 'info');
        }
    }

    const toggleBtn = document.getElementById('toggleDashboardSectionBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDashboardSection();
        });
    }

    const toggleSmallBtn = document.getElementById('toggleDashboardSectionSmallBtn');
    if (toggleSmallBtn) {
        toggleSmallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDashboardSection();
        });
    }

    // Offcanvas बंद होने पर सामग्री छिपाएं
    if (offcanvasSidebar) {
        offcanvasSidebar.addEventListener('hidden.bs.offcanvas', () => {
            document.querySelectorAll('.offcanvas-content').forEach(content => content.style.display = 'none');
            discardActivePreviewChart();
        });
    }

    // Lock Mode Button (drag_drop.js से)
    attachEventListener('toggleLockModeBtn', 'click', toggleLockMode);

    // Apply Background Template Button
    attachEventListener('applyTemplateBtn', 'click', () => {
         if (window.selectedTemplateIndex !== undefined && window.selectedTemplateIndex !== -1 && dashboardContent) {
            const selectedTemplate = backgroundTemplates[window.selectedTemplateIndex];
            dashboardContent.style.backgroundColor = selectedTemplate.backgroundColor;
            dashboardContent.style.color = selectedTemplate.textColor;
            localStorage.setItem('dashboardBackgroundColor', selectedTemplate.backgroundColor);
            localStorage.setItem('dashboardTextColor', selectedTemplate.textColor);
            localStorage.setItem('selectedBackgroundTemplateIndex', window.selectedTemplateIndex);
            showMessage(`टेम्पलेट '${selectedTemplate.name}' सफलतापूर्वक लागू किया गया है!`, 'success');
            saveDashboardSettings();
        } else {
            showMessage('कृपया लागू करने के लिए एक टेम्पलेट चुनें।', 'warning');
        }
    });

    // main_handlers.js से सभी इवेंट हैंडलर संलग्न करें
    attachGlobalEventHandlers(allActiveChartInstances);

    // एडवांस्ड अतिरिक्त कार्य (Advanced Actions) इनिशियलाइज़ करें
    initializeAdvancedActions();


    // डिफ़ॉल्ट रूप से: डैशबोर्ड सेक्शन को सक्रिय रखें
    if (dashboardSection) dashboardSection.classList.add('active');

    // एडवांस प्रोफाइल सिस्टम इनिशियलाइज़ेशन
    initializeAdvancedProfileSection();
    initializeKPIAndThemes();

    // डेटा ट्रांसफ़ॉर्मर और प्रोफाइलिंग इनिशियलाइज़ेशन
    initializeDataTransformerUI();

    // Verify all CDN libraries and recover if any are broken/missing
    verifyAndRecoverCDNs().then(() => {
        console.log('[CDN Fallback Engine] CDN Verification completed successfully.');
        setTimeout(function() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('fade-out');
                setTimeout(function() {
                    loadingOverlay.style.setProperty('display', 'none', 'important');
                }, 500); // matching CSS 0.5s transition
            }
        }, 800);
    }).catch(err => {
        console.error('[CDN Fallback Engine] Critical failure during CDN recovery:', err);
        // Hide loader anyway as fallback so the app is not stuck forever
        setTimeout(function() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('fade-out');
                setTimeout(function() {
                    loadingOverlay.style.setProperty('display', 'none', 'important');
                }, 500);
            }
        }, 1000);
    });
});

// ====================================================================
// एडवांस प्रोफाइल सेक्शन हेल्पर फंक्शन्स
// ====================================================================

export function updateUserProfileUI() {
    // 1. User Info
    const displayNameInput = document.getElementById('profileDisplayName');
    const emailSpan = document.getElementById('profileUserEmail');
    const avatarDiv = document.getElementById('userAvatar');
    const bioInput = document.getElementById('profileBioInput');

    let email = "guest@vedrabi.com";
    let name = "Pro Analyst";

    if (auth.currentUser) {
        email = auth.currentUser.email || email;
        name = auth.currentUser.displayName || email.split('@')[0];
    } else {
        const savedEmail = localStorage.getItem('profileEmail');
        if (savedEmail) email = savedEmail;
        const savedName = localStorage.getItem('profileDisplayName');
        if (savedName) name = savedName;
    }

    if (displayNameInput) displayNameInput.value = name;
    if (emailSpan) emailSpan.textContent = email;
    if (avatarDiv) {
        avatarDiv.textContent = name.charAt(0).toUpperCase();
    }

    // Load bio
    if (bioInput) {
        bioInput.value = localStorage.getItem('profileBio') || "Vedra BI डेशबोर्ड विश्लेषक।";
    }

    // Load subscription plan badge
    const profileUserBadge = document.getElementById('profileUserBadge');
    if (profileUserBadge) {
        const planValue = localStorage.getItem('userSubscriptionPlan') || 'Pro';
        if (planValue === 'Basic') {
            profileUserBadge.className = "badge bg-white text-secondary fw-bold px-3 py-1.5 shadow-sm";
            profileUserBadge.innerHTML = '<i class="bi bi-person text-secondary me-1"></i> बेसिक यूजर (Basic User)';
        } else if (planValue === 'Pro') {
            profileUserBadge.className = "badge bg-white text-primary fw-bold px-3 py-1.5 shadow-sm";
            profileUserBadge.innerHTML = '<i class="bi bi-star-fill text-warning me-1"></i> प्रो विश्लेषक (Pro Analyst)';
        } else if (planValue === 'Enterprise') {
            profileUserBadge.className = "badge bg-white text-danger fw-bold px-3 py-1.5 shadow-sm";
            profileUserBadge.innerHTML = '<i class="bi bi-shield-fill-check text-danger me-1"></i> एंटरप्राइज प्रो (Enterprise)';
        }
    }

    // 2. Stats
    const statCharts = document.getElementById('statTotalCharts');
    const statRows = document.getElementById('statTotalRows');
    const statAI = document.getElementById('statTotalAIQueries');
    const statTheme = document.getElementById('statActiveTheme');

    if (statCharts) {
        const count = document.querySelectorAll('.chart-canvas, .js-plotly-plot, .chart-container').length;
        statCharts.textContent = count || allActiveChartInstances.length || "0";
    }
    if (statRows) {
        try {
            const rawData = getRawData();
            statRows.textContent = (rawData && rawData.length) ? rawData.length : "0";
        } catch (e) {
            statRows.textContent = "0";
        }
    }
    if (statAI) {
        let queryCount = parseInt(localStorage.getItem('vedrabi_ai_query_count') || '0');
        if (queryCount === 0) {
            queryCount = 12;
            localStorage.setItem('vedrabi_ai_query_count', queryCount);
        }
        statAI.textContent = queryCount;
    }
    if (statTheme) {
        const isDark = document.body.classList.contains('dark-theme') || localStorage.getItem('theme') === 'dark';
        statTheme.textContent = isDark ? "डार्क थीम" : "लाइट थीम";
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '13, 110, 253';
}

export function applyAccentColor(accent) {
    let primaryColorHex = '#0d6efd';
    if (accent === 'success') primaryColorHex = '#198754';
    else if (accent === 'danger') primaryColorHex = '#dc3545';
    else if (accent === 'warning') primaryColorHex = '#ffc107';
    else if (accent === 'dark') primaryColorHex = '#212529';

    let styleEl = document.getElementById('theme-accent-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'theme-accent-styles';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
        :root {
            --bs-primary: ${primaryColorHex} !important;
            --bs-primary-rgb: ${hexToRgb(primaryColorHex)} !important;
        }
        .text-primary { color: ${primaryColorHex} !important; }
        .bg-primary { background-color: ${primaryColorHex} !important; }
        .btn-primary { background-color: ${primaryColorHex} !important; border-color: ${primaryColorHex} !important; }
        .border-primary { border-color: ${primaryColorHex} !important; }
    `;

    document.querySelectorAll('.btn-accent-theme').forEach(btn => {
        if (btn.getAttribute('data-theme-accent') === accent) {
            btn.style.borderColor = '#ffffff';
            btn.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.5)';
        } else {
            btn.style.borderColor = 'transparent';
            btn.style.boxShadow = 'none';
        }
    });
}

export function initializeAdvancedProfileSection() {
    // 1. Load active accent on start
    const savedAccent = localStorage.getItem('themeAccent') || 'primary';
    applyAccentColor(savedAccent);

    // 2. Add click handlers for theme accent selection
    document.querySelectorAll('.btn-accent-theme').forEach(btn => {
        btn.addEventListener('click', () => {
            const accent = btn.getAttribute('data-theme-accent');
            if (accent) {
                localStorage.setItem('themeAccent', accent);
                applyAccentColor(accent);
                showMessage("थीम एक्सेंट सफलतापूर्वक बदला गया!", "success");
            }
        });
    });

    // 3. User display name changing
    const displayNameInput = document.getElementById('profileDisplayName');
    const avatarDiv = document.getElementById('userAvatar');
    if (displayNameInput) {
        displayNameInput.addEventListener('change', () => {
            const newName = displayNameInput.value.trim();
            if (newName) {
                localStorage.setItem('profileDisplayName', newName);
                if (avatarDiv) {
                    avatarDiv.textContent = newName.charAt(0).toUpperCase();
                }
                showMessage("डिस्प्ले नाम सफलतापूर्वक अपडेट किया गया!", "success");
            }
        });
    }

    // 4. Bio Saving
    const saveBioBtn = document.getElementById('saveBioBtn');
    const bioInput = document.getElementById('profileBioInput');
    if (saveBioBtn && bioInput) {
        saveBioBtn.addEventListener('click', () => {
            const bioVal = bioInput.value.trim();
            localStorage.setItem('profileBio', bioVal);
            showMessage("बायो सफलतापूर्वक सेव किया गया!", "success");
        });
    }

    // 4b. Subscription Plan Custom Selector Logic
    const planLabels = document.querySelectorAll('.custom-plan-radio');
    
    function updatePlanUI(selectedPlan) {
        planLabels.forEach(label => {
            const radio = label.querySelector('input[type="radio"]');
            const checkmark = label.querySelector('.plan-checkmark');
            if (!radio || !checkmark) return;
            
            if (radio.value === selectedPlan) {
                radio.checked = true;
                label.style.borderColor = '#2563eb';
                label.style.backgroundColor = '#eff6ff';
                checkmark.style.borderColor = '#2563eb';
                checkmark.style.backgroundColor = '#2563eb';
                checkmark.innerHTML = '<i class="bi bi-check-lg text-white" style="font-size: 11px; line-height: 1;"></i>';
            } else {
                radio.checked = false;
                label.style.borderColor = '#cbd5e1';
                label.style.backgroundColor = '#fafafc';
                checkmark.style.borderColor = '#cbd5e1';
                checkmark.style.backgroundColor = 'transparent';
                checkmark.innerHTML = '';
            }
        });
    }

    const savedPlan = localStorage.getItem('userSubscriptionPlan') || 'Pro';
    updatePlanUI(savedPlan);

    planLabels.forEach(label => {
        label.addEventListener('click', (e) => {
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                updatePlanUI(radio.value);
            }
        });
    });

    const btnSavePlan = document.getElementById('btnSavePlan');
    if (btnSavePlan) {
        btnSavePlan.addEventListener('click', () => {
            const selectedRadio = document.querySelector('input[name="user_subscription_plan"]:checked');
            if (selectedRadio) {
                const planValue = selectedRadio.value;
                localStorage.setItem('userSubscriptionPlan', planValue);
                
                const profileUserBadge = document.getElementById('profileUserBadge');
                if (profileUserBadge) {
                    if (planValue === 'Basic') {
                        profileUserBadge.className = "badge bg-white text-secondary fw-bold px-3 py-1.5 shadow-sm";
                        profileUserBadge.innerHTML = '<i class="bi bi-person text-secondary me-1"></i> बेसिक यूजर (Basic User)';
                    } else if (planValue === 'Pro') {
                        profileUserBadge.className = "badge bg-white text-primary fw-bold px-3 py-1.5 shadow-sm";
                        profileUserBadge.innerHTML = '<i class="bi bi-star-fill text-warning me-1"></i> प्रो विश्लेषक (Pro Analyst)';
                    } else if (planValue === 'Enterprise') {
                        profileUserBadge.className = "badge bg-white text-danger fw-bold px-3 py-1.5 shadow-sm";
                        profileUserBadge.innerHTML = '<i class="bi bi-shield-fill-check text-danger me-1"></i> एंटरप्राइज प्रो (Enterprise)';
                    }
                }
                
                showMessage(`प्लान सफलतापूर्वक बदल दिया गया: ${planValue}!`, "success");
            }
        });
    }

    // 5. Dashboard Backup
    const btnBackup = document.getElementById('btnBackupDashboard');
    if (btnBackup) {
        btnBackup.addEventListener('click', () => {
            try {
                const backupData = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    backupData[key] = localStorage.getItem(key);
                }
                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vedrabi_dashboard_backup_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showMessage("डैशबोर्ड बैकअप फ़ाइल सफलतापूर्वक डाउनलोड की गई!", "success");
            } catch (err) {
                showMessage("बैकअप फ़ाइल तैयार करने में त्रुटि: " + err.message, "danger");
            }
        });
    }

    // 6. Dashboard Restore
    const restoreInput = document.getElementById('restoreFileInput');
    if (restoreInput) {
        restoreInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const backupData = JSON.parse(evt.target.result);
                    if (typeof backupData !== 'object' || backupData === null) {
                        throw new Error("अमान्य बैकअप फ़ाइल प्रारूप");
                    }
                    // Current localStorage clear and restore
                    localStorage.clear();
                    for (const [key, val] of Object.entries(backupData)) {
                        localStorage.setItem(key, val);
                    }
                    showMessage("डैशबोर्ड सफलतापूर्वक रीस्टोर किया गया! पेज पुनः लोड हो रहा है...", "success");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (err) {
                    showMessage("रीस्टोर करने में त्रुटि: " + err.message, "danger");
                }
            };
            reader.readAsText(file);
        });
    }

    // 7. Reset Dashboard All
    const btnReset = document.getElementById('btnResetDashboardAll');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm("क्या आप वाकई सभी डैशबोर्ड सेटिंग्स, कस्टम इफ़ेक्ट्स और डेटा को रीसेट करना चाहते हैं? यह प्रक्रिया अपरिवर्तनीय है।")) {
                localStorage.clear();
                showMessage("डैशबोर्ड रीसेट हो गया है! पेज पुनः लोड हो रहा है...", "info");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }
}
