// src/js/floatingFab.js

export function initializeFloatingFab() {
    // 1. Inject Styles
    if (!document.getElementById('floatingFabStyles')) {
        const style = document.createElement('style');
        style.id = 'floatingFabStyles';
        style.innerHTML = `
            #floatingQuickMenu {
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 1060; /* Higher than bootstrap models and overlays */
                user-select: none;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                font-family: inherit;
            }
            
            .fab-main-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: rgba(15, 23, 42, 0.75) !important; /* Black transparent */
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                color: #ffffff !important;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26px;
                cursor: grab;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
            }
            
            .fab-main-btn:active {
                cursor: grabbing;
                transform: scale(0.92);
            }
            
            .fab-main-btn:hover {
                background-color: rgba(15, 23, 42, 0.9) !important;
                border-color: rgba(13, 110, 253, 0.6) !important;
                color: #3b82f6 !important;
            }
            
            .fab-options {
                display: none;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 15px;
                align-items: flex-end;
            }
            
            .fab-options.show {
                display: flex;
                animation: fabFadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            .fab-option-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .fab-label {
                background-color: rgba(15, 23, 42, 0.9);
                color: #f1f5f9;
                padding: 5px 10px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                border: 1px solid rgba(255, 255, 255, 0.1);
                opacity: 0;
                transform: translateX(10px);
                transition: opacity 0.2s, transform 0.2s;
                pointer-events: none;
            }
            
            .fab-option-item:hover .fab-label {
                opacity: 1;
                transform: translateX(0);
            }
            
            .fab-option-btn {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                background-color: rgba(15, 23, 42, 0.7) !important;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                color: #e2e8f0 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
                transition: transform 0.2s, background-color 0.2s, color 0.2s;
            }
            
            .fab-option-btn:hover {
                background-color: rgba(30, 41, 59, 0.85) !important;
                transform: scale(1.1);
                color: #60a5fa !important;
                border-color: rgba(96, 165, 250, 0.4) !important;
            }
            
            @keyframes fabFadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Create and Append Container
    let menuContainer = document.getElementById('floatingQuickMenu');
    if (!menuContainer) {
        menuContainer = document.createElement('div');
        menuContainer.id = 'floatingQuickMenu';
        
        menuContainer.innerHTML = `
            <div class="fab-options" id="fabOptions">
                <!-- Data Upload -->
                <div class="fab-option-item">
                    <span class="fab-label">डेटा अपलोड करें (Excel/CSV)</span>
                    <button class="fab-option-btn" id="fabActionUpload" title="डेटा अपलोड">
                        <i class="bi bi-file-earmark-arrow-up"></i>
                    </button>
                </div>
                <!-- Add Chart -->
                <div class="fab-option-item">
                    <span class="fab-label">चार्ट जोड़ें (Add Chart)</span>
                    <button class="fab-option-btn" id="fabActionAddChart" title="चार्ट बनाएं">
                        <i class="bi bi-bar-chart"></i>
                    </button>
                </div>
                <!-- Filter & Sort -->
                <div class="fab-option-item">
                    <span class="fab-label">फ़िल्टर एवं सॉर्ट (Filters)</span>
                    <button class="fab-option-btn" id="fabActionFilter" title="फ़िल्टर">
                        <i class="bi bi-filter"></i>
                    </button>
                </div>
                <!-- Data Stats -->
                <div class="fab-option-item">
                    <span class="fab-label">डेटा सांख्यिकी (Data Stats)</span>
                    <button class="fab-option-btn" id="fabActionStats" title="सांख्यिकी">
                        <i class="bi bi-calculator"></i>
                    </button>
                </div>
                <!-- AI Chat -->
                <div class="fab-option-item">
                    <span class="fab-label">AI चैट असिस्टेंट</span>
                    <button class="fab-option-btn" id="fabActionChat" title="AI चैट">
                        <i class="bi bi-chat-dots"></i>
                    </button>
                </div>
                <!-- Toggle Theme -->
                <div class="fab-option-item">
                    <span class="fab-label">थीम बदलें (Dark/Light)</span>
                    <button class="fab-option-btn" id="fabActionTheme" title="थीम बदलें">
                        <i class="bi bi-moon-stars"></i>
                    </button>
                </div>
            </div>
            
            <!-- Draggable Main Bubble -->
            <button class="fab-main-btn" id="fabMainBtn" title="त्वरित मेनू (खींचें और छोड़ें)">
                <i class="bi bi-grid-fill"></i>
            </button>
        `;
        document.body.appendChild(menuContainer);
    }

    const fabMainBtn = document.getElementById('fabMainBtn');
    const fabOptions = document.getElementById('fabOptions');

    // 3. Setup Shortcuts Actions
    document.getElementById('fabActionUpload')?.addEventListener('click', () => {
        document.getElementById('menuData')?.click();
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.click();
        toggleMenu(false);
    });

    document.getElementById('fabActionAddChart')?.addEventListener('click', () => {
        document.getElementById('menuCharts')?.click();
        toggleMenu(false);
    });

    document.getElementById('fabActionFilter')?.addEventListener('click', () => {
        document.getElementById('menuFilterSort')?.click();
        toggleMenu(false);
    });

    document.getElementById('fabActionStats')?.addEventListener('click', () => {
        document.getElementById('menuDataStatistics')?.click();
        toggleMenu(false);
    });

    document.getElementById('fabActionChat')?.addEventListener('click', () => {
        document.getElementById('openChatBtn')?.click();
        toggleMenu(false);
    });

    document.getElementById('fabActionTheme')?.addEventListener('click', () => {
        document.getElementById('toggleTheme')?.click();
        toggleMenu(false);
    });

    // Toggle options display
    function toggleMenu(forceState) {
        const isShow = forceState !== undefined ? forceState : !fabOptions.classList.contains('show');
        if (isShow) {
            fabOptions.classList.add('show');
            fabMainBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        } else {
            fabOptions.classList.remove('show');
            fabMainBtn.innerHTML = '<i class="bi bi-grid-fill"></i>';
        }
    }

    // 4. Drag and Drop Support (Mouse & Touch)
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let hasMoved = false;
    let dragStartTime = 0;
    let lastTouchTime = 0;

    // Load saved positions if any
    const savedLeft = localStorage.getItem('fabPositionLeft');
    const savedTop = localStorage.getItem('fabPositionTop');
    if (savedLeft && savedTop) {
        menuContainer.style.right = 'auto';
        menuContainer.style.bottom = 'auto';
        menuContainer.style.left = savedLeft;
        menuContainer.style.top = savedTop;
    }

    function onDragStart(clientX, clientY) {
        isDragging = true;
        hasMoved = false;
        dragStartTime = Date.now();
        
        const rect = menuContainer.getBoundingClientRect();
        startX = clientX;
        startY = clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        // Change positioning to absolute/fixed pixels so we can drag it
        menuContainer.style.right = 'auto';
        menuContainer.style.bottom = 'auto';
        menuContainer.style.left = `${initialLeft}px`;
        menuContainer.style.top = `${initialTop}px`;
    }

    function onDragMove(clientX, clientY) {
        if (!isDragging) return;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // Use a solid 8px threshold to prevent micro-movements from blocking click events
        if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
            hasMoved = true;
        }

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // Viewport collision bounds
        const rect = menuContainer.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 10;
        const maxY = window.innerHeight - rect.height - 10;

        newLeft = Math.max(10, Math.min(newLeft, maxX));
        newTop = Math.max(10, Math.min(newTop, maxY));

        menuContainer.style.left = `${newLeft}px`;
        menuContainer.style.top = `${newTop}px`;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        if (hasMoved) {
            // Save position to localStorage only if we actually dragged
            localStorage.setItem('fabPositionLeft', menuContainer.style.left);
            localStorage.setItem('fabPositionTop', menuContainer.style.top);
        }
    }

    // Mouse Listeners
    fabMainBtn.addEventListener('mousedown', (e) => {
        // Prevent mouse triggers on touch interfaces
        if (Date.now() - lastTouchTime < 500) return;
        if (e.button !== 0) return; // Only left-click
        
        onDragStart(e.clientX, e.clientY);
        
        const onMouseMove = (moveEvent) => onDragMove(moveEvent.clientX, moveEvent.clientY);
        const onMouseUp = () => {
            onDragEnd();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Touch Listeners (Mobile Friendly)
    fabMainBtn.addEventListener('touchstart', (e) => {
        lastTouchTime = Date.now();
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        onDragStart(touch.clientX, touch.clientY);

        const onTouchMove = (moveEvent) => {
            if (moveEvent.touches.length !== 1) return;
            const t = moveEvent.touches[0];
            onDragMove(t.clientX, t.clientY);
        };

        const onTouchEnd = () => {
            onDragEnd();
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };

        document.addEventListener('touchmove', onTouchMove, { passive: true });
        document.addEventListener('touchend', onTouchEnd);
    });

    // Unified click handler with drag prevention
    fabMainBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (hasMoved) {
            hasMoved = false; // reset flag
            return;
        }
        
        toggleMenu();
    });

    // Close FAB menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (fabOptions && fabOptions.classList.contains('show') && !menuContainer.contains(e.target)) {
            toggleMenu(false);
        }
    });
}
