// src/js/presentationMode.js
import { showMessage } from './utils.js';

export function initializePresentationMode() {
    // 1. Inject Premium Styles for Presentation Dock, Laser Pointer, Spotlight, Drawing Canvas, and Timer
    if (!document.getElementById('presentationModeStyles')) {
        const style = document.createElement('style');
        style.id = 'presentationModeStyles';
        style.innerHTML = `
            /* Fullscreen styling adjustments */
            body.presentation-active {
                overflow: hidden !important;
                background-color: #0b0f19 !important;
            }
            
            body.presentation-active .sidebar,
            body.presentation-active .small-menu-bar,
            body.presentation-active .offcanvas,
            body.presentation-active #chatbot_container,
            body.presentation-active #fabMainBtn,
            body.presentation-active .ai-advice-container {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            body.presentation-active .main-content-container {
                margin: 0 !important;
                padding: 40px !important;
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100vw !important;
                background: #0b0f19 !important;
                color: #f8fafc !important;
                overflow-y: auto;
                transition: all 0.3s ease;
            }

            /* Floating Presentation Controls Dock */
            .presentation-dock {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: rgba(15, 23, 42, 0.88);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 100px;
                padding: 10px 24px;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.15);
                z-index: 101100;
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
                opacity: 0;
            }
            
            .presentation-dock.visible {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            
            .presentation-dock:hover {
                background: rgba(15, 23, 42, 0.96);
                border-color: rgba(255, 255, 255, 0.25);
            }
            
            .pres-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.08);
                color: #f8fafc;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                cursor: pointer;
                position: relative;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .pres-btn:hover {
                background: #8b5cf6;
                color: #ffffff;
                transform: scale(1.1);
            }
            
            .pres-btn:active {
                transform: scale(0.95);
            }
            
            .pres-btn.active {
                background: #ef4444;
                color: #ffffff;
                box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
                animation: pulseLaserBtn 2s infinite;
            }
            
            @keyframes pulseLaserBtn {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
            
            .pres-divider {
                width: 1px;
                height: 24px;
                background: rgba(255, 255, 255, 0.15);
            }
            
            .pres-label {
                font-size: 12px;
                font-weight: 700;
                color: #94a3b8;
                font-family: var(--font-sans), system-ui;
                letter-spacing: 0.5px;
            }
            
            .pres-indicator {
                font-size: 13px;
                font-weight: 700;
                color: #f8fafc;
                background: rgba(255, 255, 255, 0.1);
                padding: 4px 12px;
                border-radius: 20px;
                font-family: var(--font-mono), monospace;
            }

            /* Smart Timer */
            .pres-timer-badge {
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(255, 255, 255, 0.08);
                padding: 4px 12px;
                border-radius: 20px;
                font-family: var(--font-mono), monospace;
                font-size: 13px;
                color: #38bdf8;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
            }
            .pres-timer-badge:hover {
                background: rgba(56, 189, 248, 0.15);
            }
            .pres-timer-badge.warning {
                color: #ef4444;
                animation: textBlink 1s infinite;
            }
            @keyframes textBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            /* Speech controller mic active indicator */
            .speech-mic-btn.listening::after {
                content: '';
                position: absolute;
                top: -2px;
                right: -2px;
                width: 10px;
                height: 10px;
                background-color: #22c55e;
                border-radius: 50%;
                border: 2px solid #0f172a;
                animation: micBlink 1s infinite;
            }
            @keyframes micBlink {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
            }

            /* Laser Pointer Effect */
            .laser-pointer-cursor {
                position: fixed;
                width: 14px;
                height: 14px;
                background-color: #ff3366;
                border-radius: 50%;
                pointer-events: none;
                z-index: 102000;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #ff3366, 0 0 20px #ff3366, 0 0 30px #ff3366;
                display: none;
                transition: width 0.1s, height 0.1s;
            }
            
            .laser-pointer-trail {
                position: fixed;
                width: 6px;
                height: 6px;
                background-color: rgba(255, 51, 102, 0.4);
                border-radius: 50%;
                pointer-events: none;
                z-index: 101999;
                transform: translate(-50%, -50%);
                transition: all 0.15s cubic-bezier(0.1, 0.8, 0.3, 1);
            }

            /* Custom Laser Ring animation on click */
            .laser-ring {
                position: fixed;
                border: 2px solid #ff3366;
                border-radius: 50%;
                pointer-events: none;
                z-index: 101998;
                transform: translate(-50%, -50%);
                animation: laserRingExpand 0.5s ease-out forwards;
            }
            
            @keyframes laserRingExpand {
                0% {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                }
                100% {
                    width: 70px;
                    height: 70px;
                    opacity: 0;
                    border-width: 1px;
                }
            }

            /* Slide Spotlight View Overlay */
            .slide-spotlight-active {
                position: relative !important;
                z-index: 100900 !important;
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.85) !important;
                transform: scale(1.03) !important;
                outline: 2px solid #8b5cf6 !important;
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
                background: #1e293b !important;
            }
            
            .pres-dimmer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(8, 12, 21, 0.84);
                z-index: 100800;
                display: none;
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: none;
            }
            
            .pres-dimmer.visible {
                display: block;
                opacity: 1;
            }

            /* Fullscreen Annotation Canvas overlay */
            #presentationCanvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 100950;
                pointer-events: none;
                display: none;
            }
            
            #presentationCanvas.drawing-active {
                pointer-events: auto !important;
                cursor: crosshair !important;
                display: block;
            }

            /* Annotation Paint Options Panel */
            .annotation-palette {
                display: none;
                align-items: center;
                gap: 8px;
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                padding: 4px 12px;
            }
            
            .annotation-palette.visible {
                display: flex;
            }

            .pen-color-dot {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid transparent;
                transition: transform 0.2s;
            }
            
            .pen-color-dot:hover {
                transform: scale(1.25);
            }
            
            .pen-color-dot.active {
                border-color: #ffffff;
                box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
                transform: scale(1.25);
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Build DOM structures
    let dock = document.querySelector('.presentation-dock');
    if (!dock) {
        dock = document.createElement('div');
        dock.className = 'presentation-dock';
        dock.innerHTML = `
            <span class="pres-label">💻 लाइव शो (LIVE SHOW)</span>
            <span class="pres-indicator" id="presSlideCounter">Overview</span>
            
            <!-- Smart presentation countdown / stopwatch -->
            <div class="pres-timer-badge" id="presTimer" title="क्लिक करें: रीसेट | टाइमर (Stopwatch / Click to reset)">
                <i class="bi bi-stopwatch"></i> <span id="presTimerText">00:00</span>
            </div>

            <div class="pres-divider"></div>
            
            <button class="pres-btn" id="presPrevBtn" title="पिछली स्लाइड (Prev Chart)"><i class="bi bi-chevron-left"></i></button>
            <button class="pres-btn" id="presPlayBtn" title="स्वचालित चलाएं (Auto Play / Pause)"><i class="bi bi-play-fill"></i></button>
            <button class="pres-btn" id="presNextBtn" title="अगली स्लाइड (Next Chart)"><i class="bi bi-chevron-right"></i></button>
            
            <div class="pres-divider"></div>
            
            <!-- Laser, Drawing Brush, and Speech mic controllers -->
            <button class="pres-btn" id="presLaserBtn" title="डिजिटल लेज़र पॉइंटर (Toggle Laser Pointer)"><i class="bi bi-cursor-fill" style="color: #ff3366;"></i></button>
            
            <button class="pres-btn" id="presPenBtn" title="लाइव आरेखण पेन (Draw / Annotation Mode)"><i class="bi bi-pencil-fill" style="color: #f59e0b;"></i></button>
            
            <!-- Annotation Options Palette -->
            <div class="annotation-palette" id="anPalette">
                <div class="pen-color-dot active" style="background: #ef4444;" data-color="#ef4444" title="लाल (Red)"></div>
                <div class="pen-color-dot" style="background: #eab308;" data-color="#eab308" title="पीला (Yellow)"></div>
                <div class="pen-color-dot" style="background: #06b6d4;" data-color="#06b6d4" title="नीला (Cyan)"></div>
                <div class="pen-color-dot" style="background: #22c55e;" data-color="#22c55e" title="हरा (Green)"></div>
                <button class="btn btn-xs btn-outline-danger p-0 d-flex align-items-center justify-content-center" id="anClearBtn" style="width: 20px; height: 20px; border-radius: 50%;" title="साफ़ करें (Clear Annotation)"><i class="bi bi-trash-fill" style="font-size: 10px;"></i></button>
            </div>

            <button class="pres-btn" id="presVoiceBtn" title="स्मार्ट वॉयस रिमोट - 'आगे/Next' बोलें (Hands-free Speech Control)"><i class="bi bi-mic-fill" style="color: #22c55e;"></i></button>
            <button class="pres-btn" id="presRefreshBtn" title="डेटा रीफ्रेश सिमुलेशन (Simulate Live Data Refresh)"><i class="bi bi-arrow-repeat text-info"></i></button>
            
            <div class="pres-divider"></div>
            
            <button class="pres-btn btn-danger" id="presExitBtn" title="प्रेजेंटेशन समाप्त करें (Exit - ESC)"><i class="bi bi-x-lg"></i></button>
        `;
        document.body.appendChild(dock);
    }

    let laserDot = document.querySelector('.laser-pointer-cursor');
    if (!laserDot) {
        laserDot = document.createElement('div');
        laserDot.className = 'laser-pointer-cursor';
        document.body.appendChild(laserDot);
    }

    // Create Dimmer
    let presDimmer = document.querySelector('.pres-dimmer');
    if (!presDimmer) {
        presDimmer = document.createElement('div');
        presDimmer.className = 'pres-dimmer';
        document.body.appendChild(presDimmer);
    }

    // Annotation Canvas overlay
    let paintCanvas = document.getElementById('presentationCanvas');
    if (!paintCanvas) {
        paintCanvas = document.createElement('canvas');
        paintCanvas.id = 'presentationCanvas';
        document.body.appendChild(paintCanvas);
    }

    // Variables
    let isPlaying = false;
    let isLaserActive = false;
    let isPenActive = false;
    let isListening = false;
    let currentSlideIndex = -1; // -1 means overview of whole dashboard
    let slideshowTimer = null;
    let speechRecognizer = null;
    let trailElements = [];
    const maxTrails = 6;

    // Timer variables
    let timerInterval = null;
    let timerSeconds = 0;

    // Drawing context
    const ctx = paintCanvas.getContext('2d');
    let isDrawing = false;
    let penColor = '#ef4444'; // Red default
    let penWidth = 4;

    // Create Trails for the laser dot
    for (let i = 0; i < maxTrails; i++) {
        let trail = document.createElement('div');
        trail.className = 'laser-pointer-trail';
        trail.style.opacity = (1 - (i / maxTrails)) * 0.7;
        trail.style.display = 'none';
        document.body.appendChild(trail);
        trailElements.push(trail);
    }

    // 3. Core Functions
    function startPresentation() {
        document.body.classList.add('presentation-active');
        dock.classList.add('visible');
        isPlaying = false;
        isLaserActive = false;
        isPenActive = false;
        currentSlideIndex = -1;
        updateSlideCounter();
        setupCanvasSize();

        // Start Stopwatch
        startPresentationTimer();
        
        showMessage("💻 भव्य प्रेजेंटेशन मोड सक्रिय! पेन (P), लेज़र (L), और वॉयस मोड (V) सक्षम हैं।", "success");
        
        // Add window listeners
        window.addEventListener('keydown', handleKeyNavigation);
        window.addEventListener('resize', setupCanvasSize);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);

        // Bind Drawing mouse/touch events
        paintCanvas.addEventListener('mousedown', startDrawing);
        paintCanvas.addEventListener('mousemove', draw);
        paintCanvas.addEventListener('mouseup', stopDrawing);
        paintCanvas.addEventListener('mouseout', stopDrawing);
    }

    function exitPresentation() {
        // Stop autoplay
        stopSlideshow();
        
        // Disable laser, drawing and mic
        deactivateLaser();
        deactivatePen();
        stopVoiceRecognition();
        
        // Clear spotlights
        clearSpotlight();

        // Clear dimmer overlay
        if (presDimmer) {
            presDimmer.classList.remove('visible');
            presDimmer.style.display = 'none';
        }

        // Stop timer
        stopPresentationTimer();

        document.body.classList.remove('presentation-active');
        dock.classList.remove('visible');
        
        window.removeEventListener('keydown', handleKeyNavigation);
        window.removeEventListener('resize', setupCanvasSize);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);

        paintCanvas.removeEventListener('mousedown', startDrawing);
        paintCanvas.removeEventListener('mousemove', draw);
        paintCanvas.removeEventListener('mouseup', stopDrawing);
        paintCanvas.removeEventListener('mouseout', stopDrawing);

        // Exit native fullscreen if active
        const isFullscreen = document.fullscreenElement || 
                             document.webkitFullscreenElement || 
                             document.mozFullScreenElement || 
                             document.msFullscreenElement;
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        showMessage("प्रेजेंटेशन मोड समाप्त।", "info");
    }

    // Slide / Spotlight controller
    function getSlides() {
        return Array.from(document.querySelectorAll('.visualization-container'));
    }

    function updateSlideCounter() {
        const slides = getSlides();
        const total = slides.length;
        const currentText = currentSlideIndex === -1 ? "Overview" : `${currentSlideIndex + 1}/${total}`;
        document.getElementById('presSlideCounter').textContent = currentText;
    }

    function showSlide(index) {
        const slides = getSlides();
        clearSpotlight();
        
        if (index < -1) index = slides.length - 1;
        if (index >= slides.length) index = -1;
        
        currentSlideIndex = index;
        updateSlideCounter();

        if (index === -1) {
            // Overview mode
            presDimmer.classList.remove('visible');
            setTimeout(() => {
                presDimmer.style.display = 'none';
            }, 300);
            
            // Scroll to top
            const container = document.querySelector('.main-content-container');
            if (container) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        // Slide/Chart spotlight mode
        presDimmer.style.display = 'block';
        setTimeout(() => {
            presDimmer.classList.add('visible');
        }, 10);

        const targetSlide = slides[index];
        if (targetSlide) {
            targetSlide.classList.add('slide-spotlight-active');
            targetSlide.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function clearSpotlight() {
        getSlides().forEach(slide => {
            slide.classList.remove('slide-spotlight-active');
        });
    }

    // Auto Play slideshow logic
    function startSlideshow() {
        isPlaying = true;
        document.getElementById('presPlayBtn').innerHTML = `<i class="bi bi-pause-fill"></i>`;
        document.getElementById('presPlayBtn').classList.add('bg-primary');

        slideshowTimer = setInterval(() => {
            const slides = getSlides();
            let nextIdx = currentSlideIndex + 1;
            if (nextIdx >= slides.length) nextIdx = -1; // back to overview
            showSlide(nextIdx);
        }, 6000); // 6 seconds per slide
        
        showMessage("⏱️ स्वचालित स्लाइड शो सक्रिय: हर 6 सेकंड में स्लाइड बदलेगी।", "info");
    }

    function stopSlideshow() {
        isPlaying = false;
        document.getElementById('presPlayBtn').innerHTML = `<i class="bi bi-play-fill"></i>`;
        document.getElementById('presPlayBtn').classList.remove('bg-primary');
        if (slideshowTimer) {
            clearInterval(slideshowTimer);
            slideshowTimer = null;
        }
    }

    // Laser pointer handlers
    function activateLaser() {
        deactivatePen(); // Turn off drawing to prevent confusion
        isLaserActive = true;
        document.getElementById('presLaserBtn').classList.add('active');
        laserDot.style.display = 'block';
        trailElements.forEach(t => t.style.display = 'block');
        document.body.style.cursor = 'none'; // hide real cursor
    }

    // Deactivate laser pointer
    function deactivateLaser() {
        isLaserActive = false;
        document.getElementById('presLaserBtn').classList.remove('active');
        laserDot.style.display = 'none';
        trailElements.forEach(t => t.style.display = 'none');
        document.body.style.cursor = 'default';
    }

    // Interactive Drawing Annotation Pen handlers
    function setupCanvasSize() {
        paintCanvas.width = window.innerWidth;
        paintCanvas.height = window.innerHeight;
        // Re-setup canvas parameters as sizing resets context state
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
    }

    function activatePen() {
        deactivateLaser(); // Turn off laser to switch to pen
        isPenActive = true;
        document.getElementById('presPenBtn').classList.add('active');
        document.getElementById('anPalette').classList.add('visible');
        paintCanvas.classList.add('drawing-active');
        showMessage("✏️ आरेखण पेन मोड सक्रिय: स्क्रीन पर चित्र बनाने के लिए क्लिक करें और खींचें।", "info");
    }

    function deactivatePen() {
        isPenActive = false;
        document.getElementById('presPenBtn').classList.remove('active');
        document.getElementById('anPalette').classList.remove('visible');
        paintCanvas.classList.remove('drawing-active');
    }

    function startDrawing(e) {
        if (!isPenActive) return;
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    function draw(e) {
        if (!isDrawing || !isPenActive) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function clearAnnotationCanvas() {
        ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        showMessage("✨ सभी आरेखण और निशान साफ़ किए गए।", "success");
    }

    // Stopwatch countdown timer logic
    function startPresentationTimer() {
        timerSeconds = 0;
        updateTimerDisplay();
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }

    function stopPresentationTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateTimerDisplay() {
        const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const secs = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('presTimerText').textContent = `${mins}:${secs}`;
    }

    // Hands-free Speech Commands Engine
    function startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showMessage("🎙️ वॉयस मोड उपलब्ध नहीं है (यह ब्राउज़र Speech Recognition का समर्थन नहीं करता है)।", "warning");
            return;
        }

        try {
            speechRecognizer = new SpeechRecognition();
            speechRecognizer.continuous = true;
            speechRecognizer.interimResults = false;
            speechRecognizer.lang = 'hi-IN'; // Hindustani command recognition

            speechRecognizer.onstart = () => {
                isListening = true;
                document.getElementById('presVoiceBtn').classList.add('listening');
                document.getElementById('presVoiceBtn').classList.add('btn-success');
                showMessage("🎤 वॉयस रिमोट चालू! आदेश दें: 'आगे / Next', 'पीछे / Back', 'लेज़र / Laser'", "success");
            };

            speechRecognizer.onresult = (event) => {
                const resultIndex = event.resultIndex;
                const transcript = event.results[resultIndex][0].transcript.toLowerCase().trim();
                console.log("[Presentation Voice Command]:", transcript);

                // Analyze spoken command
                if (transcript.includes('आगे') || transcript.includes('next') || transcript.includes('forward')) {
                    stopSlideshow();
                    showSlide(currentSlideIndex + 1);
                    showMessage("🎙️ वॉयस कमांड: अगली स्लाइड", "info");
                } else if (transcript.includes('पीछे') || transcript.includes('back') || transcript.includes('previous')) {
                    stopSlideshow();
                    showSlide(currentSlideIndex - 1);
                    showMessage("🎙️ वॉयस कमांड: पिछली स्लाइड", "info");
                } else if (transcript.includes('लेज़र') || transcript.includes('laser')) {
                    if (isLaserActive) deactivateLaser();
                    else activateLaser();
                    showMessage("🎙️ वॉयस कमांड: लेज़र टॉगल", "info");
                } else if (transcript.includes('साफ') || transcript.includes('clear') || transcript.includes('मार्क')) {
                    clearAnnotationCanvas();
                } else if (transcript.includes('बाहर') || transcript.includes('exit') || transcript.includes('बंद')) {
                    exitPresentation();
                }
            };

            speechRecognizer.onerror = (e) => {
                console.error("[Speech recognizer error]", e);
                // Auto restart if it was unintended shutdown
                if (isListening) {
                    setTimeout(() => {
                        try { speechRecognizer.start(); } catch(_) {}
                    }, 1000);
                }
            };

            speechRecognizer.onend = () => {
                if (isListening) {
                    try { speechRecognizer.start(); } catch(_) {}
                } else {
                    document.getElementById('presVoiceBtn').classList.remove('listening');
                    document.getElementById('presVoiceBtn').classList.remove('btn-success');
                }
            };

            speechRecognizer.start();

        } catch (err) {
            console.error("Speech init failure", err);
        }
    }

    function stopVoiceRecognition() {
        isListening = false;
        if (speechRecognizer) {
            speechRecognizer.stop();
            speechRecognizer = null;
        }
        document.getElementById('presVoiceBtn').classList.remove('listening');
        document.getElementById('presVoiceBtn').classList.remove('btn-success');
    }

    // 4. Mouse and Keyboard Event Handlers
    function handleMouseMove(e) {
        if (!isLaserActive) return;
        
        const x = e.clientX;
        const y = e.clientY;

        // Position the main laser dot
        laserDot.style.top = `${y}px`;
        laserDot.style.left = `${x}px`;

        // Update trails with physics delay
        setTimeout(() => {
            trailElements.forEach((trail, index) => {
                const delay = (index + 1) * 32;
                setTimeout(() => {
                    trail.style.top = `${y}px`;
                    trail.style.left = `${x}px`;
                }, delay);
            });
        }, 5);
    }

    function handleMouseDown(e) {
        if (!isLaserActive) return;
        
        // Shrink/Grow laser dot on click
        laserDot.style.width = '24px';
        laserDot.style.height = '24px';
        setTimeout(() => {
            laserDot.style.width = '14px';
            laserDot.style.height = '14px';
        }, 150);

        // Generate glowing expanding shockwave ring
        const ring = document.createElement('div');
        ring.className = 'laser-ring';
        ring.style.top = `${e.clientY}px`;
        ring.style.left = `${e.clientX}px`;
        // Random neon color for expanding laser ring
        const colors = ['#ff3366', '#06b6d4', '#eab308', '#22c55e', '#a855f7'];
        ring.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(ring);
        
        // Remove ring after animation finishes
        setTimeout(() => {
            ring.remove();
        }, 500);
    }

    function handleKeyNavigation(e) {
        if (e.key === 'Escape') {
            exitPresentation();
        } else if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            stopSlideshow();
            showSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stopSlideshow();
            showSlide(currentSlideIndex - 1);
        } else if (e.key.toLowerCase() === 'p') {
            // Toggle drawing pen
            if (isPenActive) deactivatePen();
            else activatePen();
        } else if (e.key.toLowerCase() === 'l') {
            // Toggle laser pointer
            if (isLaserActive) deactivateLaser();
            else activateLaser();
        } else if (e.key.toLowerCase() === 'c') {
            // Clear annotation
            clearAnnotationCanvas();
        }
    }

    // 5. Connect UI Button Clicks
    document.getElementById('presExitBtn').addEventListener('click', exitPresentation);
    
    document.getElementById('presPlayBtn').addEventListener('click', () => {
        if (isPlaying) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    document.getElementById('presPrevBtn').addEventListener('click', () => {
        stopSlideshow();
        showSlide(currentSlideIndex - 1);
    });

    document.getElementById('presNextBtn').addEventListener('click', () => {
        stopSlideshow();
        showSlide(currentSlideIndex + 1);
    });

    document.getElementById('presLaserBtn').addEventListener('click', () => {
        if (isLaserActive) {
            deactivateLaser();
        } else {
            activateLaser();
        }
    });

    // Drawing toggler
    document.getElementById('presPenBtn').addEventListener('click', () => {
        if (isPenActive) {
            deactivatePen();
        } else {
            activatePen();
        }
    });

    // Color selections
    document.querySelectorAll('.pen-color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            document.querySelectorAll('.pen-color-dot').forEach(d => d.classList.remove('active'));
            e.target.classList.add('active');
            penColor = e.target.getAttribute('data-color');
            ctx.strokeStyle = penColor;
        });
    });

    // Clear Canvas
    document.getElementById('anClearBtn').addEventListener('click', clearAnnotationCanvas);

    // Voice remote activation button
    document.getElementById('presVoiceBtn').addEventListener('click', () => {
        if (isListening) {
            stopVoiceRecognition();
            showMessage("🎤 वॉयस मोड बंद।", "info");
        } else {
            startVoiceRecognition();
        }
    });

    // Click timer to reset stopwatch
    document.getElementById('presTimer').addEventListener('click', () => {
        timerSeconds = 0;
        updateTimerDisplay();
        showMessage("⏱️ टाइमर पुनः आरंभ किया गया।", "success");
    });

    document.getElementById('presRefreshBtn').addEventListener('click', () => {
        const simBtn = document.getElementById('simulateRealTimeBtn') || document.getElementById('btnSimulateData');
        if (simBtn) {
            simBtn.click();
            showMessage("🔄 लाइव रिफ्रेश सिमुलेशन किया गया!", "success");
        } else {
            showMessage("सक्रिय डेटा सिमुलेटर नहीं मिला।", "warning");
        }
    });

    // Outer launcher listener
    document.getElementById('btnStartPresentation')?.addEventListener('click', () => {
        startPresentation();
    });

    window.openDashboardPresentationMode = startPresentation;

    // Listen to native browser exit-fullscreen event to revert layout automatically
    function handleNativeFullscreenChange() {
        const isFullscreenNow = document.fullscreenElement || 
                                document.webkitFullscreenElement || 
                                document.mozFullScreenElement || 
                                document.msFullscreenElement;
        
        // If we are not in fullscreen anymore but presentation styles are still active, exit presentation gracefully
        if (!isFullscreenNow && document.body.classList.contains('presentation-active')) {
            exitPresentation();
        }
    }

    document.addEventListener('fullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleNativeFullscreenChange);
}
