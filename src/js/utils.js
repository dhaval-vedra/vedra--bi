

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

let useMock = false;

if (localStorage.getItem('vedrabi_use_sandbox') === 'true') {
    useMock = true;
} else if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_") || firebaseConfig.apiKey === "") {
    console.warn("Firebase API Key is missing. Falling back to secure Local Sandbox Mode.");
    useMock = true;
}

if (typeof firebase === 'undefined') {
    useMock = true;
}

let mockAuth = {
    currentUser: null,
    onAuthStateChangedListeners: [],
    onAuthStateChanged(callback) {
        this.onAuthStateChangedListeners.push(callback);
        // Trigger immediately with current state
        setTimeout(() => callback(this.currentUser), 50);
        return () => {
            this.onAuthStateChangedListeners = this.onAuthStateChangedListeners.filter(l => l !== callback);
        };
    },
    async signInWithEmailAndPassword(email, password) {
        const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
        if (users[email] && users[email].password === password) {
            this.currentUser = { uid: users[email].uid, email: email, emailVerified: true };
            localStorage.setItem('vedrabi_current_user', JSON.stringify(this.currentUser));
            this.onAuthStateChangedListeners.forEach(l => l(this.currentUser));
            return { user: this.currentUser };
        } else {
            const err = new Error("गलत पासवर्ड या यूजर नहीं मिला। कृपया सही विवरण दर्ज करें या रजिस्टर करें।");
            err.code = 'auth/wrong-password';
            throw err;
        }
    },
    async createUserWithEmailAndPassword(email, password) {
        if (!email || !password || password.length < 6) {
            const err = new Error("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
            err.code = 'auth/weak-password';
            throw err;
        }
        const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
        if (users[email]) {
            const err = new Error("यह ईमेल पहले से पंजीकृत है।");
            err.code = 'auth/email-already-in-use';
            throw err;
        }
        const uid = 'local_user_' + Math.random().toString(36).substr(2, 9);
        users[email] = { uid, email, password };
        localStorage.setItem('vedrabi_users', JSON.stringify(users));
        this.currentUser = { uid, email, emailVerified: true };
        localStorage.setItem('vedrabi_current_user', JSON.stringify(this.currentUser));
        this.onAuthStateChangedListeners.forEach(l => l(this.currentUser));
        return { user: this.currentUser };
    },
    async signInWithPopup(provider) {
        // Mock Google login pop-up
        const email = 'demo_user@vedrabi.com';
        const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
        let uid = 'local_google_user';
        if (users[email]) {
            uid = users[email].uid;
        } else {
            users[email] = { uid, email, password: 'google_login_oauth' };
            localStorage.setItem('vedrabi_users', JSON.stringify(users));
        }
        this.currentUser = { uid, email, emailVerified: true };
        localStorage.setItem('vedrabi_current_user', JSON.stringify(this.currentUser));
        this.onAuthStateChangedListeners.forEach(l => l(this.currentUser));
        return { user: this.currentUser };
    },
    async signOut() {
        this.currentUser = null;
        localStorage.removeItem('vedrabi_current_user');
        localStorage.removeItem('vedrabi_use_sandbox');
        this.onAuthStateChangedListeners.forEach(l => l(null));
    },
    async sendPasswordResetEmail(email) {
        if (!email || !email.includes('@')) {
            const err = new Error("कृपया एक वैध ईमेल पता दर्ज करें।");
            err.code = 'auth/invalid-email';
            throw err;
        }
        const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
        if (!users[email] && email !== 'demo_user@vedrabi.com') {
            const err = new Error("यह ईमेल पता हमारे पास पंजीकृत नहीं है।");
            err.code = 'auth/user-not-found';
            throw err;
        }
        return true;
    },
    async sendOtpToPhoneNumber(phoneNumber) {
        if (!phoneNumber || phoneNumber.length !== 10 || isNaN(Number(phoneNumber))) {
            const err = new Error("कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।");
            err.code = 'auth/invalid-phone-number';
            throw err;
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`vedrabi_otp_${phoneNumber}`, otpCode);
        return otpCode;
    },
    async signInWithPhoneNumber(phoneNumber, otpCode) {
        const savedOtp = localStorage.getItem(`vedrabi_otp_${phoneNumber}`);
        if (!savedOtp || savedOtp !== otpCode) {
            const err = new Error("दर्ज किया गया ओटीपी (OTP) अमान्य है। कृपया सही ओटीपी प्रविष्ट करें।");
            err.code = 'auth/invalid-verification-code';
            throw err;
        }
        localStorage.removeItem(`vedrabi_otp_${phoneNumber}`);
        const email = `${phoneNumber}@vedrabi.com`;
        const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
        let uid = 'local_phone_' + phoneNumber;
        if (users[email]) {
            uid = users[email].uid;
        } else {
            users[email] = { uid, email, password: 'mobile_otp_login' };
            localStorage.setItem('vedrabi_users', JSON.stringify(users));
        }
        this.currentUser = { uid, email, phoneNumber, emailVerified: true };
        localStorage.setItem('vedrabi_current_user', JSON.stringify(this.currentUser));
        this.onAuthStateChangedListeners.forEach(l => l(this.currentUser));
        return { user: this.currentUser };
    }
};

// Auto-resume logged in mock user if exists
const savedUser = localStorage.getItem('vedrabi_current_user');
if (savedUser) {
    mockAuth.currentUser = JSON.parse(savedUser);
}

let mockDb = {
    collection(collectionName) {
        return {
            doc(docId) {
                return {
                    async get() {
                        const key = `vedrabi_db_${collectionName}_${docId}`;
                        const data = localStorage.getItem(key);
                        return {
                            exists: data !== null,
                            data() {
                                return data ? JSON.parse(data) : null;
                            }
                        };
                    },
                    async set(data, options) {
                        const key = `vedrabi_db_${collectionName}_${docId}`;
                        let finalData = data;
                        if (options && options.merge) {
                            const existingRaw = localStorage.getItem(key);
                            if (existingRaw) {
                                try {
                                    const existing = JSON.parse(existingRaw);
                                    finalData = { ...existing, ...data };
                                } catch (e) {
                                    console.error("Error merging database document", e);
                                }
                            }
                        }
                        localStorage.setItem(key, JSON.stringify(finalData));
                        return { success: true };
                    }
                };
            }
        };
    }
};

let activeAuth, activeDb;

if (!useMock) {
    try {
        firebase.initializeApp(firebaseConfig);
        activeAuth = firebase.auth();
        activeDb = firebase.firestore();
    } catch (e) {
        console.error("Firebase initialization failed. Switching to Local Sandboxed Mock Mode:", e);
        useMock = true;
    }
}

if (useMock) {
    activeAuth = mockAuth;
    activeDb = mockDb;
    // Inject mock banner when DOM loads
    if (typeof window !== 'undefined') {
        const injectBanner = () => {
            if (document.getElementById('vedra-sandbox-banner')) return;
            const banner = document.createElement('div');
            banner.id = 'vedra-sandbox-banner';
            banner.style.cssText = "position: fixed; bottom: 15px; right: 15px; background: rgba(15, 23, 42, 0.95); color: #10b981; padding: 10px 20px; border-radius: 12px; font-size: 13px; font-family: system-ui, -apple-system, sans-serif; z-index: 99999; border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px; backdrop-filter: blur(8px); animation: slideIn 0.3s ease-out;";
            banner.innerHTML = `
                <span style="display:inline-block; width:10px; height:10px; background:#10b981; border-radius:50%; box-shadow: 0 0 10px #10b981; animation: pulse 1.5s infinite;"></span>
                <span><strong>Vedra BI:</strong> Local Sandbox Mode Active (Offline)</span>
            `;
            document.body.appendChild(banner);
            
            // Add pulse and slideIn keyframes if not exist
            if (!document.getElementById('vedra-sandbox-styles')) {
                const style = document.createElement('style');
                style.id = 'vedra-sandbox-styles';
                style.innerHTML = `
                    @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.6; } }
                    @keyframes slideIn { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                `;
                document.head.appendChild(style);
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectBanner);
        } else {
            injectBanner();
        }
    }
}

export const auth = activeAuth;
export const db = activeDb;
export const isMockMode = useMock;

// --- Generic Helper Functions ---

// Attach event listener to an element by ID
export function attachEventListener(id, eventType, handler) {
    const element = document.getElementById(id);
    if (element) {
        element.__listeners = element.__listeners || {};
        if (element.__listeners[eventType]) {
            return; // Prevent duplicate listeners on already existing elements
        }
        element.addEventListener(eventType, handler);
        element.__listeners[eventType] = true;
    } else {
        console.warn(`Element with ID '${id}' not found. Cannot attach event listener.`);
    }
}



// Advanced Notification System - UNIQUE & MODERN
export function showMessage(message, type = 'info', options = {}) {
    const {
        duration = 5000,
            position = 'top-right',
            icon = true,
            action = null,
            dismissible = true
    } = options;
    
    // Create notification container
    let notificationContainer = document.getElementById('advancedNotificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'advancedNotificationContainer';
        notificationContainer.className = 'advanced-notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add custom styles
        addNotificationStyles();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `advanced-notification ${type} ${position}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    // Notification content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${getNotificationIcon(type)}
            </div>
            <div class="notification-body">
                <div class="notification-title">${getNotificationTitle(type)}</div>
                <div class="notification-message">${message}</div>
                ${action ? `
                <div class="notification-actions">
                    <button class="btn-action" onclick="${action.handler}">
                        ${action.text}
                    </button>
                </div>
                ` : ''}
            </div>
            ${dismissible ? `
            <button class="notification-close" onclick="this.parentElement.remove()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            ` : ''}
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove if duration provided
    if (duration > 0) {
        const progressBar = notification.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.animation = `progress ${duration}ms linear forwards`;
        }
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 43000);
            }
        }, duration);
    }
    
    return notification;
}

// Custom icons for each type
function getNotificationIcon(type) {
    const icons = {
        'success': `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
        `,
        'error': `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
        `,
        'warning': `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
        `,
        'info': `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
        `
    };
    return icons[type] || icons.info;
}

function getNotificationTitle(type) {
    const titles = {
        'success': 'सफलता',
        'error': 'त्रुटि',
        'warning': 'चेतावनी',
        'info': 'सूचना'
    };
    return titles[type] || 'सूचना';
}

// Add custom styles dynamically
function addNotificationStyles() {
    const styles = `
        <style>
        .advanced-notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            min-width: 320px;
            max-width: 400px;
            pointer-events: none;
        }

        .advanced-notification {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 12px;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: all;
            border-left: 4px solid;
            overflow: hidden;
        }

        .advanced-notification.show {
            transform: translateX(0);
            opacity: 1;
        }

        .advanced-notification.success {
            border-left-color: #10b981;
        }

        .advanced-notification.error {
            border-left-color: #ef4444;
        }

        .advanced-notification.warning {
            border-left-color: #f59e0b;
        }

        .advanced-notification.info {
            border-left-color: #3b82f6;
        }

        .notification-content {
            display: flex;
            align-items: flex-start;
            padding: 16px;
            position: relative;
        }

        .notification-icon {
            flex-shrink: 0;
            margin-right: 12px;
            margin-top: 2px;
        }

        .notification-icon svg {
            display: block;
        }

        .success .notification-icon { color: #10b981; }
        .error .notification-icon { color: #ef4444; }
        .warning .notification-icon { color: #f59e0b; }
        .info .notification-icon { color: #3b82f6; }

        .notification-body {
            flex: 1;
            min-width: 0;
        }

        .notification-title {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 4px;
            color: #1f2937;
        }

        .notification-message {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.4;
        }

        .notification-actions {
            margin-top: 8px;
        }

        .btn-action {
            background: transparent;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 12px;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-action:hover {
            background: #f9fafb;
            border-color: #9ca3af;
        }

        .notification-close {
            background: none;
            border: none;
            padding: 4px;
            margin-left: 8px;
            cursor: pointer;
            color: #9ca3af;
            border-radius: 4px;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .notification-close:hover {
            background: #f3f4f6;
            color: #374151;
        }

        .notification-progress {
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1));
            animation: progress 5000ms linear forwards;
        }

        .success .notification-progress { background: linear-gradient(90deg, #10b981, rgba(16, 185, 129, 0.3)); }
        .error .notification-progress { background: linear-gradient(90deg, #ef4444, rgba(239, 68, 68, 0.3)); }
        .warning .notification-progress { background: linear-gradient(90deg, #f59e0b, rgba(245, 158, 11, 0.3)); }
        .info .notification-progress { background: linear-gradient(90deg, #3b82f6, rgba(59, 130, 246, 0.3)); }

        @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
            .advanced-notification {
                background: #374151;
                color: white;
            }
            .notification-title { color: #f9fafb; }
            .notification-message { color: #d1d5db; }
            .btn-action {
                background: #4b5563;
                border-color: #6b7280;
                color: #f9fafb;
            }
            .btn-action:hover {
                background: #6b7280;
            }
            .notification-close:hover {
                background: #4b5563;
                color: #f9fafb;
            }
        }

        body.dark-theme .advanced-notification {
            background: #161b22 !important;
            border-color: #30363d !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3) !important;
            color: #f0f6fc !important;
        }
        body.dark-theme .notification-title {
            color: #ffd07a !important;
        }
        body.dark-theme .notification-message {
            color: #c9d1d9 !important;
        }
        body.dark-theme .btn-action {
            background: #21262d !important;
            border: 1px solid #30363d !important;
            color: #c9d1d9 !important;
        }
        body.dark-theme .btn-action:hover {
            background: #30363d !important;
            border-color: #8b949e !important;
            color: #ffffff !important;
        }
        body.dark-theme .notification-close {
            color: #8b949e !important;
        }
        body.dark-theme .notification-close:hover {
            background: #21262d !important;
            color: #f0f6fc !important;
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}


// Export data to CSV
export function exportCsv(data, filename = 'exported_data.csv') {
    if (!data || data.length === 0) {
        showMessage('निर्यात करने के लिए कोई डेटा नहीं है।', 'warning');
        return;
    }
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showMessage('CSV सफलतापूर्वक निर्यात किया गया!', 'success');
}

// Export data to Excel
export function exportExcel(data, filename = 'exported_data.xlsx') {
    if (!data || data.length === 0) {
        showMessage('निर्यात करने के लिए कोई डेटा नहीं है।', 'warning');
        return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, filename);
    showMessage('Excel सफलतापूर्वक निर्यात किया गया!', 'success');
}

// Export data to PDF
export function exportPdf(data, headers, filename = 'exported_data.pdf') {
    if (!data || data.length === 0) {
        showMessage('निर्यात करने के लिए कोई डेटा नहीं है।', 'warning');
        return;
    }
    const doc = new jspdf.jsPDF();
    const tableHeaders = headers.map(h => String(h));
    const tableBody = data.map(row => tableHeaders.map(header => row[header] !== undefined ? String(row[header]) : ''));

    doc.autoTable({
        head: [tableHeaders],
        body: tableBody,
        startY: 10,
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        didDrawPage: function(data) {
            doc.setFontSize(10);
            doc.text("Data Export", data.settings.margin.left, 8);
            doc.setFontSize(8);
            const pageCount = doc.internal.getNumberOfPages();
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 5);
        }
    });
    doc.save(filename);
    showMessage('PDF सफलतापूर्वक निर्यात किया गया!', 'success');
}

// Toggle theme (light/dark)
export function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
        document.body.classList.remove('silk-light-theme');
    } else {
        document.body.classList.add('silk-light-theme');
    }

    const offcanvasSidebar = document.getElementById('offcanvasSidebar');
    if (offcanvasSidebar) {
        offcanvasSidebar.classList.toggle('dark-theme', isDark);
    }
    const offcanvasNav = document.getElementById('offcanvasNav');
    if (offcanvasNav) {
        offcanvasNav.classList.toggle('dark-theme', isDark);
    }

    // Update Theme Status Text in Dashboard Stats
    const statTheme = document.getElementById('statActiveTheme');
    if (statTheme) {
        statTheme.textContent = isDark ? "डार्क थीम" : "सिल्क-लाइट";
    }

    showMessage(`थीम बदल दी गई: ${isDark ? 'डार्क थीम' : 'सिल्क-लाइट मोड'}`, 'info');
}

// Download sample data template
export function downloadTemplate() {
    const templateData = [
        { "उत्पाद का नाम": "उत्पाद A", "बिक्री (इकाइयाँ)": 100, "राजस्व": 15000, "तारीख": "2023-01-05", "श्रेणी": "इलेक्ट्रॉनिक्स" },
        { "उत्पाद का नाम": "उत्पाद B", "बिक्री (इकाइयाँ)": 50, "राजस्व": 7500, "तारीख": "2023-01-10", "श्रेणी": "कपड़े" },
        { "उत्पाद का नाम": "उत्पाद C", "बिक्री (इकाइयाँ)": 200, "राजस्व": 20000, "तारीख": "2023-01-15", "श्रेणी": "किताबें" },
        { "उत्पाद का नाम": "उत्पाद A", "बिक्री (इकाइयाँ)": 120, "राजस्व": 18000, "तारीख": "2023-02-01", "श्रेणी": "इलेक्ट्रॉनिक्स" },
        { "उत्पाद का नाम": "उत्पाद D", "बिक्री (इकाइयाँ)": 80, "राजस्व": 12000, "तारीख": "2023-02-05", "श्रेणी": "घर का सामान" }
    ];
    exportCsv(templateData, 'sample_data_template.csv');
}

// Control dashboard visibility based on auth state
export function setDashboardVisibility(loggedIn) {
    console.log("setDashboardVisibility called with loggedIn:", loggedIn);

    const authOverlay = document.getElementById('authOverlay');
    const dashboardContent = document.getElementById('dashboardContent');
    const mainContentContainer = document.querySelector('.main-content-container');
    const offcanvasToggleBtn = document.querySelector('.btn-primary.position-fixed');
    const offcanvas = document.getElementById('offcanvasNav');
    const userInfoDiv = document.getElementById('userInfo');
    const userInfoHr = document.getElementById('userInfoHr');

    // Check if critical DOM elements exist
    if (!authOverlay || !dashboardContent || !mainContentContainer) {
        console.error("DOM elements not found:", {
            authOverlay: !!authOverlay,
            dashboardContent: !!dashboardContent,
            mainContentContainer: !!mainContentContainer
        });
        return;
    }

    if (loggedIn) {
        console.log("Showing dashboard content");
        authOverlay.style.display = 'none';
        authOverlay.style.zIndex = '-1';
        dashboardContent.style.display = 'block';
        mainContentContainer.classList.remove('content-hidden');
        if (offcanvasToggleBtn) offcanvasToggleBtn.classList.remove('content-hidden');
        if (offcanvas) offcanvas.classList.remove('content-hidden');
        if (userInfoDiv) userInfoDiv.style.display = 'flex';
        if (userInfoHr) userInfoHr.style.display = 'block';
    } else {
        console.log("Showing auth overlay");
        authOverlay.style.display = 'flex';
        authOverlay.style.zIndex = '1050';
        dashboardContent.style.display = 'none';
        mainContentContainer.classList.add('content-hidden');
        if (offcanvasToggleBtn) offcanvasToggleBtn.classList.add('content-hidden');
        if (offcanvas) offcanvas.classList.add('content-hidden');
        if (userInfoDiv) userInfoDiv.style.display = 'none';
        if (userInfoHr) userInfoHr.style.display = 'none';
    }
}

// --- Spinner Utility Functions (NEW ADDITIONS) ---
export function showSpinner(spinnerElement) {
    if (spinnerElement) {
        spinnerElement.style.display = 'block';
    }
}

export function hideSpinner(spinnerElement) {
    if (spinnerElement) {
        spinnerElement.style.display = 'none';
    }
}

/**
 * Shows a premium custom prompt modal dialog.
 * @param {string} title - The title of the prompt modal.
 * @param {string} label - The label for the input.
 * @param {string} defaultValue - The initial value of the input.
 * @returns {Promise<string|null>}
 */
export function showCustomPrompt(title, label, defaultValue = '') {
    return new Promise((resolve) => {
        const modalId = `custom-prompt-${Date.now()}`;
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" style="z-index: 2050;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark">
                        <div class="modal-header border-bottom pb-2 pt-3 px-4 d-flex align-items-center justify-content-between" style="background-color: #f8fafc;">
                            <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2" style="font-size: 1.1rem;">
                                <i class="bi bi-pencil-square text-primary"></i>
                                <span>${title}</span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="font-size: 0.8rem;"></button>
                        </div>
                        <div class="modal-body px-4 py-3">
                            <div class="form-group mb-0">
                                <label class="form-label fw-bold text-secondary small mb-2">${label}</label>
                                <input type="text" class="form-control form-control-lg border rounded-3 text-dark fw-medium" id="${modalId}-input" value="${defaultValue}" style="font-size: 0.95rem;" autofocus>
                            </div>
                        </div>
                        <div class="modal-footer border-top-0 pt-1 pb-3 px-4 d-flex gap-2 justify-content-end" style="background-color: #f8fafc;">
                            <button type="button" class="btn btn-outline-secondary px-3 py-2 rounded-3 small fw-semibold" id="${modalId}-cancel" data-bs-dismiss="modal" style="font-size: 0.85rem;">रद्द करें (Cancel)</button>
                            <button type="button" class="btn btn-primary px-4 py-2 rounded-3 small fw-bold" id="${modalId}-submit" style="font-size: 0.85rem;">पुष्टि करें (Submit)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modalEl = document.getElementById(modalId);
        const inputEl = document.getElementById(`${modalId}-input`);
        const cancelBtn = document.getElementById(`${modalId}-cancel`);
        const submitBtn = document.getElementById(`${modalId}-submit`);

        const bsModal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: true });
        
        let valueSubmitted = null;

        const handleSubmit = () => {
            valueSubmitted = inputEl.value.trim();
            bsModal.hide();
        };

        submitBtn.addEventListener('click', handleSubmit);
        
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        });

        // Focus input after modal is fully shown
        modalEl.addEventListener('shown.bs.modal', () => {
            inputEl.focus();
            inputEl.select();
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
            resolve(valueSubmitted);
            bsModal.dispose();
            modalEl.remove();
        });

        bsModal.show();
    });
}

/**
 * Shows a premium custom confirmation modal dialog.
 * @param {string} title - The title of the confirmation modal.
 * @param {string} message - The message/body of the confirmation.
 * @returns {Promise<boolean>}
 */
export function showCustomConfirm(title, message) {
    return new Promise((resolve) => {
        const modalId = `custom-confirm-${Date.now()}`;
        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" style="z-index: 2050;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark">
                        <div class="modal-header border-bottom pb-2 pt-3 px-4 d-flex align-items-center justify-content-between" style="background-color: #f8fafc;">
                            <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2" style="font-size: 1.1rem;">
                                <i class="bi bi-exclamation-triangle text-warning"></i>
                                <span>${title}</span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="font-size: 0.8rem;"></button>
                        </div>
                        <div class="modal-body px-4 py-3">
                            <p class="mb-0 text-secondary" style="font-size: 0.95rem; line-height: 1.5;">${message}</p>
                        </div>
                        <div class="modal-footer border-top-0 pt-1 pb-3 px-4 d-flex gap-2 justify-content-end" style="background-color: #f8fafc;">
                            <button type="button" class="btn btn-outline-secondary px-3 py-2 rounded-3 small fw-semibold" id="${modalId}-cancel" data-bs-dismiss="modal" style="font-size: 0.85rem;">नहीं (Cancel)</button>
                            <button type="button" class="btn btn-danger px-4 py-2 rounded-3 small fw-bold" id="${modalId}-submit" style="font-size: 0.85rem;">हां (Confirm)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modalEl = document.getElementById(modalId);
        const cancelBtn = document.getElementById(`${modalId}-cancel`);
        const submitBtn = document.getElementById(`${modalId}-submit`);

        const bsModal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: true });
        
        let isConfirmed = false;

        submitBtn.addEventListener('click', () => {
            isConfirmed = true;
            bsModal.hide();
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
            resolve(isConfirmed);
            bsModal.dispose();
            modalEl.remove();
        });

        bsModal.show();
    });
}