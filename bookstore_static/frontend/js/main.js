// الوظائف العامة للموقع

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupGlobalEvents();
    addScrollEffects();
});

// تهيئة التطبيق
function initializeApp() {
    // تحديث قائمة المستخدم
    updateUserMenu();
    
    // إضافة تأثيرات التحميل
    addLoadingEffects();
    
    // تحديث عدد عناصر السلة
    if (currentUser) {
        updateCartCount();
    }
}

// إعداد الأحداث العامة
function setupGlobalEvents() {
    // البحث بالضغط على Enter
    const searchInputs = document.querySelectorAll('#searchInput');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    });
    
    // إضافة تأثيرات الحركة للأزرار
    addButtonEffects();
    
    // إضافة تأثيرات التمرير
    addScrollEffects();
}

// إضافة تأثيرات للأزرار
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .add-to-cart, .login-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });
}

// إضافة تأثيرات التمرير
function addScrollEffects() {
    // تأثير الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر
    const elementsToAnimate = document.querySelectorAll('.book-item, .category-card, .cart-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// إضافة تأثيرات التحميل
function addLoadingEffects() {
    // تأثير تدرجي للعناصر
    const elements = document.querySelectorAll('header, main, footer');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// تحديث الوقت الحالي
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const timeElements = document.querySelectorAll('.current-time');
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// إضافة تأثيرات للبطاقات
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.book-item, .category-card, .cart-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        });
    });
}

// إضافة تأثير الكتابة
function typeWriterEffect(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

// إضافة تأثيرات للنصوص
function addTextEffects() {
    const heroTitle = document.querySelector('#hero h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriterEffect(heroTitle, originalText, 80);
    }
}

// إضافة تأثير التحميل للصور
function addImageLoadingEffects() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// إضافة تأثير الجسيمات للخلفية
function addParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = '#8e44ad';
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// تشغيل التأثيرات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addCardHoverEffects();
        addImageLoadingEffects();
        addTextEffects();
        
        // إضافة تأثير الجسيمات فقط في الصفحة الرئيسية
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            addParticleEffect();
        }
    }, 500);
});

// إضافة تأثيرات الصوت (اختيارية)
function addSoundEffects() {
    // يمكن إضافة أصوات للنقرات والتفاعلات
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // محاكاة صوت النقر
            if (window.AudioContext || window.webkitAudioContext) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        });
    });
}

// تحسين الأداء
function optimizePerformance() {
    // تأخير تحميل الصور
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تشغيل تحسينات الأداء
document.addEventListener('DOMContentLoaded', optimizePerformance);

// إضافة دعم للوضع المظلم (اختياري)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// تحميل إعدادات الوضع المظلم
function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// تشغيل إعدادات الوضع المظلم
document.addEventListener('DOMContentLoaded', loadDarkModePreference);
