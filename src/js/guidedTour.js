// src/js/guidedTour.js
import { showMessage } from './utils.js';

export function initializeGuidedTour() {
    // 1. Inject CSS for the tour spotlight and tooltip
    if (!document.getElementById('guidedTourStyles')) {
        const style = document.createElement('style');
        style.id = 'guidedTourStyles';
        style.innerHTML = `
            /* Spotlight dimming effect */
            .tour-highlight-active {
                position: relative !important;
                z-index: 100005 !important;
                box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.8) !important;
                outline: 3px solid #8b5cf6 !important;
                outline-offset: 4px !important;
                transition: all 0.25s ease-in-out !important;
            }
            
            /* Dimmer overlay fallback when no target or target is centered */
            .tour-overlay-dimmer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.8);
                z-index: 100000;
                display: none;
                animation: fadeIn 0.2s ease-out;
            }
            
            /* Custom tour tooltip card */
            .tour-tooltip-card {
                position: fixed;
                z-index: 100010;
                width: 340px;
                background: #ffffff;
                color: #1e293b;
                border-radius: 14px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0,0,0,0.1);
                border: 1px solid #e2e8f0;
                padding: 18px;
                display: none;
                flex-direction: column;
                font-family: var(--font-sans), system-ui, sans-serif;
                animation: tourCardPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            body.dark-theme .tour-tooltip-card {
                background: #1e293b;
                color: #f8fafc;
                border-color: #334155;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(255,255,255,0.05);
            }
            
            @keyframes tourCardPop {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            /* Progress dots */
            .tour-progress-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #cbd5e1;
                transition: background-color 0.2s;
            }
            body.dark-theme .tour-progress-dot {
                background-color: #475569;
            }
            .tour-progress-dot.active {
                background-color: #8b5cf6;
                width: 18px;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Define the tour steps
    const tourSteps = [
        {
            title: "👋 वेड्रा BI में आपका स्वागत है!",
            titleEn: "Welcome to Vedra BI!",
            content: "यह एक शक्तिशाली विज़ुअलाइज़ेशन और एनालिटिक्स डैशबोर्ड मेकर है। चलिए हम आपको इसके सबसे मुख्य फीचर्स के बारे में एक छोटा सा 2-मिनट का टूर देते हैं।",
            contentEn: "This is a powerful visualization and analytics dashboard creator. Let's give you a quick 2-minute tour of its core features.",
            target: null, // Center of screen
            position: "center"
        },
        {
            title: "📂 डेटा लोड और प्रबंधन (Data Upload)",
            titleEn: "Data Loading & Excel Grid",
            content: "यहाँ से आप अपनी <b>Excel (xlsx) या CSV फ़ाइलें</b> लोड कर सकते हैं, तथा डेटा को एक लाइव ग्रिड एडिटर में संशोधित भी कर सकते हैं।",
            contentEn: "From here, you can load your <b>Excel (xlsx) or CSV files</b> and edit or manage them in a live grid view.",
            target: "#menuData",
            position: "right"
        },
        {
            title: "📊 चार्ट डिज़ाइनर (Chart Designer)",
            titleEn: "Chart Designer",
            content: "कॉलमों को ड्रैग-एंड-ड्रॉप करके आप आसानी से 3D बार, स्टैक्ड लाइन, डोनट, रोज़ और स्कैटर चार्ट्स बना सकते हैं जो सीधे लाइव दिखाई देंगे।",
            contentEn: "Drag and drop column tags directly into X and Y axes to instantly construct stunning 3D bar, stacked, line, rose, and scatter charts.",
            target: "#menuCharts",
            position: "right"
        },
        {
            title: "✨ KPI और स्पार्कलाइन (KPI Builder)",
            titleEn: "KPI & Sparklines Builder",
            content: "अपने मुख्य मेट्रिक्स के लिए लाइव स्पार्कलाइन के साथ इंटरैक्टिव KPI बनाएं। आप इनकी टेक्स्ट पोजीशन, फॉन्ट और संरेखण (alignment) को भी ड्रैग-एंड-सेट कर सकते हैं!",
            contentEn: "Craft interactive KPI cards with real-time sparkline visualizers. You can drag, resize, and custom align title and value labels dynamically!",
            target: "#menuKpiBuilder",
            position: "right"
        },
        {
            title: "🎨 थीम और विज़ुअल कस्टमाइज़र",
            titleEn: "Themes & Visual Customizer",
            content: "अपने पूरे डैशबोर्ड की थीम (लाइट/डार्क), फॉन्ट स्टाइल, बॉर्डर-त्रिज्या (border radius) और शैडो को एक ही स्लाइडर से कस्टमाइज़ कर सकते हैं।",
            contentEn: "Instantly customize the dashboard theme, typography, border-radius, and CSS shadows globally to match your organization's look and feel.",
            target: "#menuDashboardTheme",
            position: "right"
        },
        {
            title: "⚡ क्विक एक्शन्स और फ्लोटिंग मेनू",
            titleEn: "Quick Floating Actions Menu",
            content: "यह ड्रैगेबल <b>क्विक एक्शन बटन (FAB)</b> आपको सीधे मुख्य शॉर्टकट तक पहुंचाता है - जैसे नया रिकॉर्ड जोड़ना, लाइव रीफ्रेश सिमुलेटर और त्वरित आंकड़े देखना।",
            contentEn: "This draggable <b>Floating Action Button</b> gives you swift shortcuts for key tasks like adding data rows, running data quality audits, or switching themes.",
            target: "#fabMainBtn",
            position: "left"
        },
        {
            title: "📥 एक्जीक्यूटिव प्रिंट और एक्सपोर्ट",
            titleEn: "Executive Print & PDF Export",
            content: "तैयार डैशबोर्ड को सीधे <b>प्रोफेशनल PDF रिपोर्ट</b>, पूरे डैशबोर्ड की <b>PNG इमेज</b> या फ़िल्टर्ड CSV डेटा के रूप में एक क्लिक में एक्सपोर्ट करें।",
            contentEn: "Export your curated dashboard in one single click as a high-fidelity <b>Executive PDF report</b>, take an overall PNG image, or grab filtered CSV datasets.",
            target: "#exportReportDropdown",
            position: "left"
        }
    ];

    let currentStep = 0;

    // 3. Create DOM Elements for Tour
    let dimmer = document.querySelector('.tour-overlay-dimmer');
    if (!dimmer) {
        dimmer = document.createElement('div');
        dimmer.className = 'tour-overlay-dimmer';
        document.body.appendChild(dimmer);
    }

    let tooltipCard = document.querySelector('.tour-tooltip-card');
    if (!tooltipCard) {
        tooltipCard = document.createElement('div');
        tooltipCard.className = 'tour-tooltip-card';
        document.body.appendChild(tooltipCard);
    }

    // 4. Position Helper function
    function positionTooltip(stepData) {
        const targetEl = stepData.target ? document.querySelector(stepData.target) : null;
        
        if (!targetEl || stepData.position === 'center') {
            // Center of screen
            tooltipCard.style.top = '50%';
            tooltipCard.style.left = '50%';
            tooltipCard.style.transform = 'translate(-50%, -50%)';
            tooltipCard.style.position = 'fixed';
            dimmer.style.display = 'block';
            return;
        }

        dimmer.style.display = 'none'; // Use CSS shadow on targeted element instead
        
        // Ensure offcanvas or parent container is visible if needed
        // E.g. menu is in sidebar which is always visible
        const rect = targetEl.getBoundingClientRect();
        const tooltipWidth = 340;
        const tooltipHeight = 240; // Approx max height
        
        let top = 0;
        let left = 0;
        
        if (stepData.position === 'right') {
            top = rect.top + (rect.height / 2) - 80;
            left = rect.right + 15;
            
            // Boundary checks
            if (left + tooltipWidth > window.innerWidth) {
                left = rect.left - tooltipWidth - 15;
            }
        } else if (stepData.position === 'left') {
            top = rect.top + (rect.height / 2) - 80;
            left = rect.left - tooltipWidth - 15;
            
            // Boundary checks
            if (left < 0) {
                left = rect.right + 15;
            }
        } else if (stepData.position === 'bottom') {
            top = rect.bottom + 15;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        } else {
            // top
            top = rect.top - tooltipHeight - 15;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        }
        
        // Ensure within window bounds
        if (top < 10) top = 10;
        if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - 20;
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - 10;
        
        tooltipCard.style.top = `${top}px`;
        tooltipCard.style.left = `${left}px`;
        tooltipCard.style.transform = 'none';
        tooltipCard.style.position = 'fixed';
    }

    // 5. Render Step Function
    function renderStep() {
        // Clear previous highlight
        document.querySelectorAll('.tour-highlight-active').forEach(el => {
            el.classList.remove('tour-highlight-active');
        });

        const step = tourSteps[currentStep];
        
        // Highlight active target
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                targetEl.classList.add('tour-highlight-active');
                // Auto scroll target into view if needed
                targetEl.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
            }
        }

        // Render contents with bilingual support
        const isHindiMode = document.documentElement.lang === 'hi';
        const titleText = isHindiMode ? step.title : step.titleEn;
        const contentText = isHindiMode ? step.content : step.contentEn;

        // Generate progress dots
        const dotsHtml = tourSteps.map((_, i) => 
            `<div class="tour-progress-dot ${i === currentStep ? 'active' : ''}"></div>`
        ).join('');

        tooltipCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2.5">
                <span class="badge bg-soft-primary text-primary px-2.5 py-1 font-semibold text-xs border border-primary-subtle">
                    💡 मार्गदर्शिका (Guide) ${currentStep + 1}/${tourSteps.length}
                </span>
                <button type="button" class="btn-close text-xs p-1 m-0 shadow-none btn-close-tour-exit" aria-label="Close"></button>
            </div>
            
            <h5 class="fw-bold mb-2 font-sans" style="font-size: 15px; color: var(--bs-primary);">${titleText}</h5>
            <p class="text-sm mb-3.5 lh-base" style="font-size: 0.8rem; opacity: 0.9;">${contentText}</p>
            
            <div class="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-light-subtle">
                <div class="d-flex gap-1">
                    ${dotsHtml}
                </div>
                <div class="d-flex gap-1.5">
                    ${currentStep > 0 ? `<button class="btn btn-sm btn-outline-secondary px-2.5 py-1 btn-tour-prev" style="font-size: 11px;">पीछे</button>` : ''}
                    <button class="btn btn-sm btn-primary px-3 py-1 btn-tour-next fw-bold" style="font-size: 11px;">
                        ${currentStep === tourSteps.length - 1 ? 'पूर्ण करें' : 'आगे बढ़ें'}
                    </button>
                </div>
            </div>
        `;

        tooltipCard.style.display = 'flex';
        
        // Position it correctly
        setTimeout(() => {
            positionTooltip(step);
        }, 100);

        // Bind internal buttons
        tooltipCard.querySelector('.btn-close-tour-exit').addEventListener('click', endTour);
        tooltipCard.querySelector('.btn-tour-next').addEventListener('click', () => {
            if (currentStep < tourSteps.length - 1) {
                currentStep++;
                renderStep();
            } else {
                endTour(true);
            }
        });
        
        const prevBtn = tooltipCard.querySelector('.btn-tour-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    renderStep();
                }
            });
        }
    }

    // Start Tour
    function startTour() {
        currentStep = 0;
        document.body.classList.add('guided-tour-running');
        renderStep();
        
        // Window resize handler
        window.addEventListener('resize', handleResize);
    }

    // End Tour
    function endTour(completed = false) {
        document.body.classList.remove('guided-tour-running');
        
        // Remove highlighters
        document.querySelectorAll('.tour-highlight-active').forEach(el => {
            el.classList.remove('tour-highlight-active');
        });
        
        dimmer.style.display = 'none';
        tooltipCard.style.display = 'none';
        
        window.removeEventListener('resize', handleResize);
        
        if (completed) {
            showMessage("🎉 बधाई हो! आपने वेड्रा BI का त्वरित दौरा पूरा कर लिया है।", "success");
        }
    }

    function handleResize() {
        if (tooltipCard.style.display === 'flex') {
            positionTooltip(tourSteps[currentStep]);
        }
    }

    // Attach trigger to button if clicked
    document.getElementById('btnQuickTour')?.addEventListener('click', () => {
        startTour();
    });

    // Make it globally accessible to launch from other actions or chats
    window.startDashboardGuidedTour = startTour;
}
