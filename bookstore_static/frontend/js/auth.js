// إعدادات API (لم تعد مستخدمة)
const API_BASE_URL = '';

// متغيرات عامة
let currentUser = null;

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupAuthForms();
});

// التحقق من حالة المصادقة
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUserMenu();
    }
}

// تحديث قائمة المستخدم
function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        if (currentUser) {
            userMenu.innerHTML = `مرحباً ${currentUser.full_name} | <a href="#" onclick="logout()">تسجيل الخروج</a>`;
        } else {
            userMenu.innerHTML = '<a href="login.html">تسجيل الدخول</a>';
        }
    }
}

// إعداد نماذج المصادقة
function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// معالجة تسجيل الدخول (محاكاة)
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    showLoading('جاري تسجيل الدخول...');
    
    // محاكاة تسجيل الدخول: أي اسم مستخدم وكلمة مرور يعتبران صحيحين
    // في مشروع حقيقي، ستقوم هنا بالتحقق من بيانات المستخدم
    if (username && password) {
        currentUser = { username: username, full_name: username, email: `${username}@example.com` };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMessage('تم تسجيل الدخول بنجاح!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage('الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
    }
    hideLoading();
}

// معالجة التسجيل (محاكاة)
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const full_name = formData.get('full_name');
    const email = formData.get('email');

    showLoading('جاري إنشاء الحساب...');

    // محاكاة التسجيل: أي بيانات تعتبر صحيحة
    if (username && password && full_name && email) {
        showMessage('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
        showLoginForm();
        document.getElementById('registerForm').reset();
    } else {
        showMessage('الرجاء تعبئة جميع الحقول', 'error');
    }
    hideLoading();
}

// تسجيل الخروج
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showMessage('تم تسجيل الخروج بنجاح', 'success');
    updateUserMenu();
    
    // إعادة توجيه إلى صفحة تسجيل الدخول
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// عرض نموذج تسجيل الدخول
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }
}

// عرض نموذج التسجيل
function showRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

// التحقق من تسجيل الدخول
function requireAuth() {
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    return true;
}

// عرض رسالة تحميل
function showLoading(message = 'جاري التحميل...') {
    // إزالة أي رسالة تحميل موجودة
    hideLoading();
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        z-index: 10000;
        font-size: 16px;
        text-align: center;
    `;
    loadingDiv.textContent = message;
    document.body.appendChild(loadingDiv);
}

// إخفاء رسالة التحميل
function hideLoading() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// عرض رسالة
function showMessage(message, type = 'info') {
    // إزالة أي رسالة موجودة
    const existingMessage = document.getElementById('messageAlert');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.id = 'messageAlert';
    
    let backgroundColor;
    switch (type) {
        case 'success':
            backgroundColor = '#2ecc71';
            break;
        case 'error':
            backgroundColor = '#e74c3c';
            break;
        case 'warning':
            backgroundColor = '#f39c12';
            break;
        default:
            backgroundColor = '#3498db';
    }
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        font-size: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 4 ثوان
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 4000);
}

// إضافة CSS للرسائل
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

