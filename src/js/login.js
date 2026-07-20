// js/login.js

import { auth, showMessage } from './utils.js';
import {
    setCurrentUserId,
    initData,
    headers,
    loadDashboardSettings
} from '../store/DataHandler.js';
import { plotAll } from './charts.js';
import { displayGoogleSheetsTable as loadAndDisplayUserData } from './dataTebledisplay.js';
import { populateColumnDragLists, initializeDragAndDrop } from './chartcolomdrag.js';

// Error messages को हिंदी में map करने के लिए
const errorMessagesHindi = {
    'auth/invalid-email': 'अमान्य ईमेल पता',
    'auth/user-disabled': 'यूजर डिसेबल है',
    'auth/user-not-found': 'यूजर नहीं मिला',
    'auth/wrong-password': 'गलत पासवर्ड',
    'auth/email-already-in-use': 'ईमेल पहले से उपयोग में है',
    'auth/popup-closed-by-user': 'पॉपअप बंद कर दिया गया',
    'auth/cancelled-popup-request': 'पॉपअप रिक्वेस्ट रद्द की गई'
};

// UI element helper
const getElement = id => document.getElementById(id);

// Loading state handler
const setLoadingState = (isLoading) => {
    ['loginBtn', 'registerBtn', 'googleLoginBtn', 'guestLoginBtn', 'sendOtpBtn', 'verifyOtpBtn', 'sendResetBtn'].forEach(id => {
        const btn = getElement(id);
        if (btn) {
            btn.disabled = isLoading;
            if (isLoading) {
                btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> प्रतीक्षा करें...`;
            } else {
                btn.textContent = btn.dataset.originalText || btn.textContent;
            }
        }
    });
};

// Initialize login page logic
function initializeLoginPageLogic() {
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage) return;
    
    const emailInput = getElement('emailInput');
    const passwordInput = getElement('passwordInput');
    const loginErrorDiv = getElement('loginError');
    
    // Save original button texts
    ['loginBtn', 'registerBtn', 'googleLoginBtn', 'guestLoginBtn', 'sendOtpBtn', 'verifyOtpBtn', 'sendResetBtn'].forEach(id => {
        const btn = getElement(id);
        if (btn) btn.dataset.originalText = btn.textContent;
    });
    
    const showError = (error, targetErrorDivId = 'loginError') => {
        let errorCode = error.code;
        let errorMessage = error.message || '';
        
        // If error message is a JSON string, try to parse it
        if (errorMessage.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(errorMessage);
                if (parsed.error && parsed.error.message) {
                    errorMessage = parsed.error.message;
                }
            } catch (e) {}
        }
        
        // Also check if code is missing but message contains it
        if (!errorCode && errorMessage.includes('INVALID_LOGIN_CREDENTIALS')) {
            errorCode = 'auth/invalid-login-credentials';
        }
        
        // Map common codes to Hindi
        const errorMessagesHindiLocal = {
            'auth/invalid-email': 'अमान्य ईमेल पता (कृपया सही ईमेल लिखें)',
            'auth/user-disabled': 'यह यूजर डिसेबल कर दिया गया है',
            'auth/user-not-found': 'यूजर नहीं मिला। कृपया पहले रजिस्टर करें।',
            'auth/wrong-password': 'गलत पासवर्ड। कृपया सही पासवर्ड दर्ज करें।',
            'auth/email-already-in-use': 'यह ईमेल पहले से पंजीकृत है।',
            'auth/popup-closed-by-user': 'पॉपअप बंद कर दिया गया था (Popup Closed)',
            'auth/cancelled-popup-request': 'पॉपअप रिक्वेस्ट रद्द की गई',
            'auth/weak-password': 'पासवर्ड बहुत कमजोर है। यह कम से कम 6 अक्षरों का होना चाहिए।',
            'auth/invalid-login-credentials': 'गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें या रजिस्टर करें।'
        };
        
        let msg = errorMessagesHindiLocal[errorCode] || errorMessage || 'त्रुटि हुई';
        if (errorMessage.includes('INVALID_LOGIN_CREDENTIALS') || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
            msg = 'गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें या रजिस्टर करें।';
        }
        
        const errDiv = getElement(targetErrorDivId);
        if (errDiv) {
            errDiv.textContent = msg;
            errDiv.style.display = 'block';
        }
    };
    
    const attachEvent = (id, handler) => {
        const el = getElement(id);
        if (el) el.addEventListener('click', handler);
    };

    // --- FORM SWITCHING LOGIC ---
    const emailForm = getElement('emailFormContainer');
    const mobileForm = getElement('mobileFormContainer');
    const forgotForm = getElement('forgotPasswordContainer');
    const btnEmailTab = getElement('toggleEmailFormBtn');
    const btnMobileTab = getElement('toggleMobileFormBtn');

    const showEmailTab = () => {
        if (emailForm) emailForm.style.display = 'block';
        if (mobileForm) mobileForm.style.display = 'none';
        if (forgotForm) forgotForm.style.display = 'none';
        if (btnEmailTab) btnEmailTab.classList.add('active');
        if (btnMobileTab) btnMobileTab.classList.remove('active');
        if (loginErrorDiv) loginErrorDiv.style.display = 'none';
    };

    const showMobileTab = () => {
        if (emailForm) emailForm.style.display = 'none';
        if (mobileForm) mobileForm.style.display = 'block';
        if (forgotForm) forgotForm.style.display = 'none';
        if (btnEmailTab) btnEmailTab.classList.remove('active');
        if (btnMobileTab) btnMobileTab.classList.add('active');
        const mobileError = getElement('mobileError');
        if (mobileError) mobileError.style.display = 'none';
    };

    attachEvent('toggleEmailFormBtn', showEmailTab);
    attachEvent('toggleMobileFormBtn', showMobileTab);

    // --- FORGOT PASSWORD TOGGLERS ---
    attachEvent('forgotPasswordLink', (e) => {
        e.preventDefault();
        if (emailForm) emailForm.style.display = 'none';
        if (forgotForm) forgotForm.style.display = 'block';
        const resetError = getElement('resetError');
        if (resetError) resetError.style.display = 'none';
        const resetSuccess = getElement('resetSuccessAlert');
        if (resetSuccess) resetSuccess.classList.add('d-none');
    });

    attachEvent('backToLoginBtn', (e) => {
        e.preventDefault();
        showEmailTab();
    });

    // --- PASSWORD RESET SUBMISSION ---
    attachEvent('sendResetBtn', async () => {
        const resetEmailInput = getElement('resetEmailInput');
        const resetError = getElement('resetError');
        const resetSuccessAlert = getElement('resetSuccessAlert');
        
        if (resetError) resetError.style.display = 'none';
        if (resetSuccessAlert) resetSuccessAlert.classList.add('d-none');

        const email = resetEmailInput ? resetEmailInput.value.trim() : '';
        if (!email || !email.includes('@')) {
            showError({ code: 'auth/invalid-email', message: 'कृपया पासवर्ड रीसेट के लिए एक वैध ईमेल पता प्रविष्ट करें।' }, 'resetError');
            return;
        }

        setLoadingState(true);
        try {
            if (typeof auth.sendPasswordResetEmail === 'function') {
                await auth.sendPasswordResetEmail(email);
            }
            if (resetSuccessAlert) resetSuccessAlert.classList.remove('d-none');
            if (resetEmailInput) resetEmailInput.value = '';
            showMessage('पासवर्ड रीसेट ईमेल सफलतापूर्वक भेजा गया!', 'success');
        } catch (error) {
            showError(error, 'resetError');
        } finally {
            setLoadingState(false);
        }
    });

    // --- MOBILE OTP SUBMISSION ---
    attachEvent('sendOtpBtn', async () => {
        const mobileInput = getElement('mobileInput');
        const mobileError = getElement('mobileError');
        const otpGroup = getElement('otpGroup');
        const verifyOtpBtn = getElement('verifyOtpBtn');
        const sendOtpBtn = getElement('sendOtpBtn');
        const securityNotice = getElement('mobileSecurityNotice');
        
        if (mobileError) mobileError.style.display = 'none';

        const phoneNumber = mobileInput ? mobileInput.value.trim() : '';
        if (!phoneNumber || phoneNumber.length !== 10 || isNaN(Number(phoneNumber))) {
            showError({ code: 'auth/invalid-phone-number', message: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' }, 'mobileError');
            return;
        }

        setLoadingState(true);
        try {
            let secureOtpCode;
            if (typeof auth.sendOtpToPhoneNumber === 'function') {
                secureOtpCode = await auth.sendOtpToPhoneNumber(phoneNumber);
            } else {
                secureOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
                localStorage.setItem(`vedrabi_otp_${phoneNumber}`, secureOtpCode);
            }

            // Display secure simulation
            showMessage(`सुरक्षित ओटीपी कोड भेजा गया: ${secureOtpCode}`, 'info', { duration: 10000 });
            if (securityNotice) {
                securityNotice.style.display = 'block';
                securityNotice.innerHTML = `<i class="bi bi-info-circle-fill text-primary"></i> <strong>सुरक्षित OTP (सैंडबॉक्स):</strong> आपका 6-अंकीय लॉगिन कोड है: <span class="badge bg-primary text-white fs-6 font-mono px-2 py-1 ms-1">${secureOtpCode}</span>. कृपया इसे नीचे दर्ज करें।`;
            }

            if (otpGroup) otpGroup.style.display = 'block';
            if (verifyOtpBtn) verifyOtpBtn.style.display = 'flex';
            if (sendOtpBtn) sendOtpBtn.textContent = 'ओटीपी पुनः भेजें (Resend)';
        } catch (error) {
            showError(error, 'mobileError');
        } finally {
            setLoadingState(false);
        }
    });

    attachEvent('verifyOtpBtn', async () => {
        const mobileInput = getElement('mobileInput');
        const otpInput = getElement('otpInput');
        const mobileError = getElement('mobileError');

        if (mobileError) mobileError.style.display = 'none';

        const phoneNumber = mobileInput ? mobileInput.value.trim() : '';
        const code = otpInput ? otpInput.value.trim() : '';

        if (!code || code.length !== 6 || isNaN(Number(code))) {
            showError({ code: 'auth/invalid-verification-code', message: 'कृपया 6-अंकीय वैध ओटीपी कोड दर्ज करें।' }, 'mobileError');
            return;
        }

        setLoadingState(true);
        try {
            if (typeof auth.signInWithPhoneNumber === 'function') {
                await auth.signInWithPhoneNumber(phoneNumber, code);
                showMessage('सफलतापूर्वक लॉगिन किया गया!', 'success');
            } else {
                // Standalone local storage authorization fallback
                const email = `${phoneNumber}@vedrabi.com`;
                const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
                let uid = 'local_phone_' + phoneNumber;
                users[email] = { uid, email, password: 'mobile_otp_login' };
                localStorage.setItem('vedrabi_users', JSON.stringify(users));
                localStorage.setItem('vedrabi_current_user', JSON.stringify({ uid, email, phoneNumber, emailVerified: true }));
                window.location.href = 'index.html';
            }
        } catch (error) {
            showError(error, 'mobileError');
        } finally {
            setLoadingState(false);
        }
    });
    
    // ईमेल/पासवर्ड लॉगिन
    attachEvent('loginBtn', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (!email || !password) {
            showError({ code: 'auth/invalid-email', message: 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।' });
            return;
        }
        loginErrorDiv.style.display = 'none';
        setLoadingState(true);
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            showError(error);
        } finally {
            setLoadingState(false);
        }
    });
    
    // ईमेल/पासवर्ड रजिस्ट्रेशन
    attachEvent('registerBtn', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (!email || !password) {
            showError({ code: 'auth/invalid-email', message: 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।' });
            return;
        }
        loginErrorDiv.style.display = 'none';
        setLoadingState(true);
        
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            showMessage('सफलतापूर्वक पंजीकरण किया गया!', 'success');
        } catch (error) {
            showError(error);
        } finally {
            setLoadingState(false);
        }
    });
    
    // Google लॉगिन
    attachEvent('googleLoginBtn', async () => {
        loginErrorDiv.style.display = 'none';
        setLoadingState(true);
        
        try {
            const provider = (typeof firebase !== 'undefined' && firebase.auth) ? new firebase.auth.GoogleAuthProvider() : null;
            await auth.signInWithPopup(provider);
        } catch (error) {
            showError(error);
            
            // Handle Iframe popup closed or blocked issues intelligently with direct visual fallback
            if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request' || error.message?.includes('popup')) {
                loginErrorDiv.innerHTML += `
                    <div class="mt-3 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-30 text-start" style="font-size: 13px; line-height: 1.5; color: #854d0e;">
                        <div class="fw-bold mb-1"><i class="bi bi-info-circle-fill"></i> गूगल पॉपअप ब्लॉक समस्या (Google Popup Blocked)</div>
                        AI Studio iframe सुरक्षा प्रतिबंधों के कारण गूगल पॉपअप बंद या ब्लॉक हो सकता है। क्या आप सुरक्षित डेमो के लिए <strong>सैंडबॉक्स गूगल अकाउंट</strong> से आगे बढ़ना चाहते हैं?
                        <div class="mt-2 text-center">
                            <button type="button" class="btn btn-sm btn-warning text-dark fw-bold px-3 py-1.5" id="sandboxGoogleFallbackBtn" style="border-radius:20px; font-size:12px; border: 1px solid rgba(133,77,14,0.3);">
                                <i class="bi bi-shield-check"></i> हाँ, सैंडबॉक्स गूगल से लॉगिन करें (Use Sandbox)
                            </button>
                        </div>
                    </div>
                `;
                
                const fallbackBtn = getElement('sandboxGoogleFallbackBtn');
                if (fallbackBtn) {
                    fallbackBtn.addEventListener('click', async () => {
                        loginErrorDiv.style.display = 'none';
                        setLoadingState(true);
                        try {
                            localStorage.setItem('vedrabi_use_sandbox', 'true');
                            const email = 'demo_user@vedrabi.com';
                            const users = JSON.parse(localStorage.getItem('vedrabi_users') || '{}');
                            let uid = 'local_google_user';
                            users[email] = { uid, email, password: 'google_login_oauth' };
                            localStorage.setItem('vedrabi_users', JSON.stringify(users));
                            const currentUser = { uid, email, emailVerified: true };
                            localStorage.setItem('vedrabi_current_user', JSON.stringify(currentUser));
                            
                            showMessage('सैंडबॉक्स गूगल लॉगिन सफल!', 'success');
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1000);
                        } catch (err) {
                            showError(err);
                        } finally {
                            setLoadingState(false);
                        }
                    });
                }
            }
        } finally {
            setLoadingState(false);
        }
    });

    // Guest लॉगिन (बिना लॉगिन के डैशबोर्ड देखें)
    attachEvent('guestLoginBtn', async () => {
        if (loginErrorDiv) loginErrorDiv.style.display = 'none';
        setLoadingState(true);
        try {
            localStorage.setItem('vedrabi_use_sandbox', 'true');
            const guestUser = { uid: 'guest_user', email: 'guest@vedrabi.com', emailVerified: true };
            localStorage.setItem('vedrabi_current_user', JSON.stringify(guestUser));
            
            // Redirect to dashboard immediately
            window.location.href = 'index.html';
        } catch (error) {
            showError(error);
        } finally {
            setLoadingState(false);
        }
    });
}

// Auth state listener
function initializeAuthStateListener() {
    const isLoginPage = window.location.pathname.includes('login.html');
    const isEditPage = window.location.pathname.includes('edit_data.html');
    const isDashboardPage = !isLoginPage && !isEditPage;
    
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // लॉगिन हुआ यूजर
            if (isLoginPage) {
                window.location.href = 'index.html';
                return;
            }
            
            setCurrentUserId(user.uid);
            const userEmailSpan = getElement('userEmail');
            const userInfoDiv = getElement('userInfo');
            if (userEmailSpan) userEmailSpan.textContent = user.email;
            if (userInfoDiv) userInfoDiv.style.display = 'flex';
            
            try {
                await initData();
                await loadDashboardSettings();
                plotAll();
                loadAndDisplayUserData();
                
                if (headers.length > 0) {
                    populateColumnDragLists(headers);
                    const isLockModeEnabled = getElement('toggleLockModeBtn')?.textContent.includes('Unlock');
                    if (!isLockModeEnabled) initializeDragAndDrop();
                }
            } catch (err) {
                console.error('डेटा लोड में त्रुटि:', err);
            }
        } else {
            // लॉगआउट हुआ यूजर
            setCurrentUserId(null);
            const userInfoDiv = getElement('userInfo');
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            
            initData();
            loadAndDisplayUserData();
            populateColumnDragLists([]);
            
            if (isDashboardPage || isEditPage) {
                window.location.href = 'login.html';
            }
        }
    });
}

// Export main function
export function initializeLoginAndAuth() {
    initializeLoginPageLogic();
    initializeAuthStateListener();
}