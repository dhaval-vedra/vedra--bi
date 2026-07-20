// src/js/commandPalette.js
import { showMessage } from './utils.js';

export function initializeCommandPalette() {
    // 1. Inject Styles for spotlight search
    if (!document.getElementById('commandPaletteStyles')) {
        const style = document.createElement('style');
        style.id = 'commandPaletteStyles';
        style.innerHTML = `
            .command-palette-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 100100;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 12vh;
                animation: cpFadeIn 0.2s ease-out;
            }
            
            .command-palette-card {
                width: 100%;
                max-width: 620px;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0,0,0,0.1);
                border: 1px solid #e2e8f0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 500px;
                animation: cpScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            body.dark-theme .command-palette-card {
                background: #0f172a;
                color: #f8fafc;
                border-color: #1e293b;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255,255,255,0.1);
            }
            
            .command-palette-input-wrapper {
                display: flex;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #f1f5f9;
            }
            
            body.dark-theme .command-palette-input-wrapper {
                border-color: #1e293b;
            }
            
            .command-palette-search-icon {
                font-size: 20px;
                color: #64748b;
                margin-right: 14px;
            }
            
            .command-palette-input {
                flex-grow: 1;
                border: none;
                background: transparent;
                outline: none;
                font-size: 16px;
                color: #0f172a;
                font-family: inherit;
            }
            
            body.dark-theme .command-palette-input {
                color: #f8fafc;
            }
            
            .command-palette-input::placeholder {
                color: #94a3b8;
            }
            
            .command-palette-results {
                overflow-y: auto;
                padding: 8px;
                flex-grow: 1;
            }
            
            .command-palette-item {
                display: flex;
                align-items: center;
                padding: 10px 14px;
                border-radius: 10px;
                cursor: pointer;
                transition: background-color 0.15s, transform 0.1s;
                user-select: none;
            }
            
            .command-palette-item:active {
                transform: scale(0.995);
            }
            
            .command-palette-item.selected {
                background-color: #f1f5f9;
            }
            
            body.dark-theme .command-palette-item.selected {
                background-color: #1e293b;
            }
            
            .command-palette-item-icon-box {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background-color: #f8fafc;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #475569;
                margin-right: 14px;
                border: 1px solid #e2e8f0;
            }
            
            body.dark-theme .command-palette-item-icon-box {
                background-color: #1e293b;
                color: #94a3b8;
                border-color: #334155;
            }
            
            .command-palette-item.selected .command-palette-item-icon-box {
                background-color: #8b5cf6;
                color: #ffffff;
                border-color: #8b5cf6;
            }
            
            .command-palette-item-details {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
            
            .command-palette-item-name {
                font-size: 14px;
                font-weight: 600;
                color: #1e293b;
            }
            
            body.dark-theme .command-palette-item-name {
                color: #f1f5f9;
            }
            
            .command-palette-item-desc {
                font-size: 11px;
                color: #64748b;
                margin-top: 1px;
            }
            
            body.dark-theme .command-palette-item-desc {
                color: #64748b;
            }
            
            .command-palette-badge {
                font-size: 10px;
                font-weight: 500;
                padding: 3px 6px;
                border-radius: 5px;
                background-color: #f1f5f9;
                color: #64748b;
                border: 1px solid #e2e8f0;
                font-family: monospace;
            }
            
            body.dark-theme .command-palette-badge {
                background-color: #1e293b;
                color: #94a3b8;
                border-color: #334155;
            }
            
            .command-palette-footer {
                padding: 10px 20px;
                border-top: 1px solid #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11px;
                color: #64748b;
                background-color: #f8fafc;
            }
            
            body.dark-theme .command-palette-footer {
                border-color: #1e293b;
                background-color: #0b0f19;
                color: #475569;
            }
            
            .command-palette-empty {
                padding: 40px 20px;
                text-align: center;
                color: #64748b;
            }
            
            @keyframes cpFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes cpScaleUp {
                from {
                    opacity: 0;
                    transform: scale(0.97) translateY(-8px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Define search actions & targets
    const commandsList = [
        {
            id: 'tour',
            name: '💡 ट्यूटोरियल दौरा शुरू करें (Start Guided Tour)',
            desc: 'डैशबोर्ड के सभी फीचर्स का इंटरैक्टिव टूर देखें',
            icon: 'bi-compass',
            keywords: 'tour help guide tutorial मदद जानकारी मार्गदर्शन',
            action: () => {
                if (window.startDashboardGuidedTour) {
                    window.startDashboardGuidedTour();
                } else {
                    showMessage("तैयार किया जा रहा है...", "info");
                }
            }
        },
        {
            id: 'theme_toggle',
            name: '🌗 थीम बदलें (Toggle Theme Mode)',
            desc: 'डार्क और लाइट थीम के बीच स्विच करें',
            icon: 'bi-moon-stars',
            keywords: 'theme dark light color black white थीम ब्लैक वाइट डार्क लाइट',
            action: () => {
                document.getElementById('toggleTheme')?.click();
            }
        },
        {
            id: 'presentation',
            name: '💻 प्रेजेंटेशन मोड शुरू करें (Start Presentation Mode)',
            desc: 'पूरी स्क्रीन पर लेज़र पॉइंटर के साथ स्लाइड शो शुरू करें',
            icon: 'bi-projector',
            keywords: 'presentation show slides play laser fullscreen full-screen प्रेजेंटेशन लेज़र स्लाइड',
            action: () => {
                if (window.openDashboardPresentationMode) {
                    window.openDashboardPresentationMode();
                } else {
                    document.getElementById('btnStartPresentation')?.click();
                }
            }
        },
        {
            id: 'audio_narrator',
            name: '🎙️ ऑडियो सारांश सुनें (Play Audio Summary Briefing)',
            desc: 'डैशबोर्ड और केपीआई मेट्रिक्स का बोलता हुआ व्याख्यात्मक सारांश सुनें',
            icon: 'bi-volume-up',
            keywords: 'audio voice speak summary narrator play sound आवाज़ सारांश भाषण ऑडियो',
            action: () => {
                if (window.toggleDashboardAudioNarrator) {
                    window.toggleDashboardAudioNarrator();
                } else {
                    document.getElementById('btnAudioNarrator')?.click();
                }
            }
        },
        {
            id: 'stats',
            name: '📊 डेटा सांख्यिकी देखें (View Data Statistics)',
            desc: 'अपलोड किए गए डेटा के मुख्य सांख्यिकी और आंकड़े देखें',
            icon: 'bi-calculator',
            keywords: 'stats calculator columns summary statistics डेटा आंकड़े सांख्यिकी गणना',
            action: () => {
                document.getElementById('menuDataStatistics')?.click();
            }
        },
        {
            id: 'add_record',
            name: '➕ नया रिकॉर्ड जोड़ें (Add New Data Record)',
            desc: 'डेटासेट में एक नया कस्टम पंक्ति जोड़ें',
            icon: 'bi-plus-square',
            keywords: 'add row insert record data नया रिकॉर्ड जोड़ें डेटा जोड़ें प्रविष्टि',
            action: () => {
                document.getElementById('addDataBtn')?.click();
            }
        },
        {
            id: 'data_audit',
            name: '🛡️ डेटा क्वालिटी ऑडिट करें (Run Data Quality Audit)',
            desc: 'डेटा में विसंगतियों, शून्य मानों और अशुद्धियों की जांच करें',
            icon: 'bi-shield-check',
            keywords: 'audit quality test diagnostics diagnostics checker डेटा ऑडिट सुरक्षा जाँच',
            action: () => {
                document.getElementById('btnDataAudit')?.click();
            }
        },
        {
            id: 'export_pdf',
            name: '📄 एक्जीक्यूटिव PDF रिपोर्ट डाउनलोड करें (Export PDF)',
            desc: 'डैशबोर्ड को कार्यपालक पीडीएफ प्रारूप में प्रिंट / डाउनलोड करें',
            icon: 'bi-file-pdf',
            keywords: 'pdf report download print export पीडीएफ रिपोर्ट प्रिंट डाउनलोड',
            action: () => {
                document.getElementById('exportPDFBtn')?.click();
            }
        },
        {
            id: 'export_png',
            name: '🖼️ पूरे डैशबोर्ड की PNG इमेज लें (Snapshot)',
            desc: 'डैशबोर्ड का हाई-क्वालिटी स्क्रीनशॉट इमेज डाउनलोड करें',
            icon: 'bi-image',
            keywords: 'png image picture screenshot camera स्नैपशॉट इमेज फोटो चित्र स्क्रीनशॉट',
            action: () => {
                document.getElementById('exportPNGDashboardBtn')?.click();
            }
        },
        {
            id: 'download_template',
            name: '📥 एक्सेल टेम्पलेट डाउनलोड करें (Download Excel Template)',
            desc: 'डिफ़ॉल्ट डेटा प्रारूप के साथ एक्सेल स्प्रेडशीट डाउनलोड करें',
            icon: 'bi-download',
            keywords: 'excel download sheet template xlsx एक्सेल टेम्पलेट स्प्रेडशीट डाउनलोड',
            action: () => {
                document.getElementById('downloadTemplateSidebar')?.click() || document.getElementById('downloadTemplate')?.click();
            }
        },
        {
            id: 'add_chart',
            name: '📈 नया चार्ट जोड़ें (Open Chart Designer)',
            desc: 'एक्सिस चुनकर कस्टम नया चार्ट डैशबोर्ड में जोड़ें',
            icon: 'bi-bar-chart',
            keywords: 'chart bar line pie scatter design विज़ुअलाइज़ेशन चार्ट बनाएं डिज़ाइनर',
            action: () => {
                document.getElementById('menuCharts')?.click();
            }
        },
        {
            id: 'add_kpi',
            name: '⭐ KPI कार्ड बनाएं (Open KPI Builder)',
            desc: 'मुख्य प्रदर्शन संकेतक (KPI) कार्ड स्पार्कलाइन के साथ डिजाइन करें',
            icon: 'bi-patch-check-fill',
            keywords: 'kpi sparkline card target केपीआई कार्ड स्पार्कलाइन लक्ष्य',
            action: () => {
                document.getElementById('menuKpiBuilder')?.click();
            }
        },
        {
            id: 'filters',
            name: '⏳ फ़िल्टर एवं सॉर्ट पैनल खोलें (Open Filters Panel)',
            desc: 'डेटा सॉर्टिंग और विशिष्ट फ़िल्टर लागू करने का पैनल खोलें',
            icon: 'bi-filter',
            keywords: 'filter sort order queries फ़िल्टर सॉर्ट क्रम खोज',
            action: () => {
                document.getElementById('menuFilterSort')?.click();
            }
        },
        {
            id: 'chat_ai',
            name: '🤖 AI चैट असिस्टेंट खोलें (Open AI Chat)',
            desc: 'अपने डेटा के बारे में सवाल पूछें या ऑटो-चार्ट बनाने को कहें',
            icon: 'bi-chat-dots-fill',
            keywords: 'ai chat assistant question bot help चैट बोट एआई सहायक प्रश्न',
            action: () => {
                document.getElementById('openChatBtn')?.click();
            }
        }
    ];

    // 3. Create DOM Elements
    let cpOverlay = document.querySelector('.command-palette-overlay');
    if (!cpOverlay) {
        cpOverlay = document.createElement('div');
        cpOverlay.className = 'command-palette-overlay';
        cpOverlay.innerHTML = `
            <div class="command-palette-card">
                <div class="command-palette-input-wrapper">
                    <i class="bi bi-search command-palette-search-icon"></i>
                    <input type="text" class="command-palette-input" placeholder="कुछ भी खोजें... (उदा: 'थीम', 'PDF', 'डेटा ऑडिट')" id="cpSearchInput">
                    <span class="command-palette-badge">ESC</span>
                </div>
                <div class="command-palette-results" id="cpResults"></div>
                <div class="command-palette-footer">
                    <div>
                        नेविगेट करने के लिए <span class="fw-bold">↑↓</span> और चुनने के लिए <span class="fw-bold">Enter</span> दबाएं
                    </div>
                    <div>
                        टूर के लिए <span class="fw-bold">/tour</span> लिखें
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(cpOverlay);
    }

    const cpSearchInput = document.getElementById('cpSearchInput');
    const cpResults = document.getElementById('cpResults');
    let selectedIndex = 0;
    let filteredCommands = [];

    // 4. Render Commands function
    function renderCommands(filterText = '') {
        cpResults.innerHTML = '';
        const searchVal = filterText.toLowerCase().trim();
        
        filteredCommands = commandsList.filter(cmd => {
            return cmd.name.toLowerCase().includes(searchVal) || 
                   cmd.desc.toLowerCase().includes(searchVal) || 
                   cmd.keywords.toLowerCase().includes(searchVal);
        });

        if (filteredCommands.length === 0) {
            cpResults.innerHTML = `
                <div class="command-palette-empty">
                    <i class="bi bi-exclamation-circle fs-3 text-muted d-block mb-2"></i>
                    <div class="text-sm">कोई कमांड नहीं मिली...</div>
                </div>
            `;
            return;
        }

        // Clip selection bounds
        if (selectedIndex >= filteredCommands.length) {
            selectedIndex = 0;
        }

        filteredCommands.forEach((cmd, idx) => {
            const item = document.createElement('div');
            item.className = `command-palette-item ${idx === selectedIndex ? 'selected' : ''}`;
            item.dataset.id = cmd.id;
            
            item.innerHTML = `
                <div class="command-palette-item-icon-box">
                    <i class="bi ${cmd.icon}"></i>
                </div>
                <div class="command-palette-item-details">
                    <div class="command-palette-item-name">${cmd.name}</div>
                    <div class="command-palette-item-desc">${cmd.desc}</div>
                </div>
                <span class="command-palette-badge ms-auto">चुनें</span>
            `;

            item.addEventListener('click', () => {
                executeCommand(cmd);
            });

            cpResults.appendChild(item);
        });

        // Scroll active item into view
        const activeItem = cpResults.querySelector('.command-palette-item.selected');
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }

    function executeCommand(cmd) {
        closePalette();
        try {
            cmd.action();
        } catch(e) {
            console.error('[Command Palette] Action failed:', e);
            showMessage("कार्य निष्पादित नहीं किया जा सका", "danger");
        }
    }

    function openPalette() {
        cpOverlay.style.display = 'flex';
        cpSearchInput.value = '';
        selectedIndex = 0;
        renderCommands();
        setTimeout(() => {
            cpSearchInput.focus();
        }, 50);
    }

    function closePalette() {
        cpOverlay.style.display = 'none';
    }

    // 5. Event Listeners
    // Keyboard listener for command palette trigger
    window.addEventListener('keydown', (e) => {
        // Trigger with Ctrl+K or Cmd+K or Forward Slash '/' (when not in an input box)
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || 
                        document.activeElement.isContentEditable;
        
        if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || 
            (e.key === '/' && !isInput)) {
            e.preventDefault();
            if (cpOverlay.style.display === 'flex') {
                closePalette();
            } else {
                openPalette();
            }
        }
        
        // Escape key to close
        if (e.key === 'Escape' && cpOverlay.style.display === 'flex') {
            closePalette();
        }
        
        // Navigation inside palette
        if (cpOverlay.style.display === 'flex') {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderCommands(cpSearchInput.value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderCommands(cpSearchInput.value);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex]);
                }
            }
        }
    });

    // Close palette on backdrop click
    cpOverlay.addEventListener('click', (e) => {
        if (e.target === cpOverlay) {
            closePalette();
        }
    });

    // Search input typing listener
    cpSearchInput.addEventListener('input', () => {
        selectedIndex = 0;
        renderCommands(cpSearchInput.value);
    });

    // Add a beautiful Trigger Button in the title-bar / navigation region if needed!
    // We can also let it be triggered by clicking the search button or similar
    document.getElementById('btnCommandPalette')?.addEventListener('click', () => {
        openPalette();
    });

    // Make it globally accessible
    window.openDashboardCommandPalette = openPalette;
}
