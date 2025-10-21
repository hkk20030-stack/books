// إعداد نموذج إضافة الكتاب
document.addEventListener("DOMContentLoaded", function() {
    setupAddBookForm();
    
    // التحقق من تسجيل الدخول (محاكاة)
    if (!requireAuth()) {
        return;
    }
});

// إعداد نموذج إضافة الكتاب
function setupAddBookForm() {
    const addBookForm = document.getElementById("addBookForm");
    if (addBookForm) {
        addBookForm.addEventListener("submit", handleAddBook);
    }
}

// معالجة إضافة كتاب جديد (محاكاة)
async function handleAddBook(event) {
    event.preventDefault();
    
    if (!requireAuth()) return;
    
    const formData = new FormData(event.target);
    const bookData = {
        title: formData.get("title").trim(),
        author: formData.get("author").trim(),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        description: formData.get("description").trim(),
        image: formData.get("image").trim(),
        stock_quantity: parseInt(formData.get("stock_quantity")) || 1
    };
    
    // التحقق من صحة البيانات
    if (!validateBookData(bookData)) {
        return;
    }
    
    showLoading("جاري إضافة الكتاب...");
    
    // محاكاة إضافة الكتاب بنجاح
    // في مشروع حقيقي، هنا سيتم إرسال البيانات إلى قاعدة بيانات أو API
    setTimeout(() => {
        showMessage("تم إضافة الكتاب بنجاح (محاكاة)!", "success");
        
        // إعادة تعيين النموذج
        event.target.reset();
        
        // إعادة توجيه إلى صفحة الكتب بعد 2 ثانية
        setTimeout(() => {
            window.location.href = "books.html";
        }, 2000);
        hideLoading();
    }, 1000); // محاكاة وقت الاستجابة
}

// التحقق من صحة بيانات الكتاب
function validateBookData(bookData) {
    // التحقق من الحقول المطلوبة
    if (!bookData.title) {
        showMessage("عنوان الكتاب مطلوب", "error");
        return false;
    }
    
    if (!bookData.author) {
        showMessage("اسم المؤلف مطلوب", "error");
        return false;
    }
    
    if (!bookData.price || bookData.price <= 0) {
        showMessage("السعر يجب أن يكون أكبر من صفر", "error");
        return false;
    }
    
    if (!bookData.category) {
        showMessage("فئة الكتاب مطلوبة", "error");
        return false;
    }
    
    // التحقق من صحة رابط الصورة
    if (bookData.image && !isValidURL(bookData.image)) {
        showMessage("رابط الصورة غير صحيح", "error");
        return false;
    }
    
    // التحقق من الكمية
    if (bookData.stock_quantity < 1) {
        showMessage("الكمية يجب أن تكون على الأقل 1", "error");
        return false;
    }
    
    return true;
}

// التحقق من صحة الرابط
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// معاينة الصورة
function previewImage() {
    const imageInput = document.getElementById("image");
    const imageUrl = imageInput.value.trim();
    
    if (imageUrl && isValidURL(imageUrl)) {
        // إنشاء عنصر معاينة الصورة
        let preview = document.getElementById("imagePreview");
        if (!preview) {
            preview = document.createElement("div");
            preview.id = "imagePreview";
            preview.style.cssText = `
                margin-top: 10px;
                text-align: center;
            `;
            imageInput.parentNode.appendChild(preview);
        }
        
        preview.innerHTML = `
            <img src="${imageUrl}" alt="معاينة الصورة" 
                 style="max-width: 200px; max-height: 250px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);"
                 onerror="this.parentNode.innerHTML=\"<p style=\\\"color: #e74c3c;\\\">فشل في تحميل الصورة</p>\"">
        `;
    }
}

// إضافة مستمع لمعاينة الصورة
document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.getElementById("image");
    if (imageInput) {
        imageInput.addEventListener("blur", previewImage);
        imageInput.addEventListener("input", function() {
            // إزالة المعاينة عند تغيير الرابط
            const preview = document.getElementById("imagePreview");
            if (preview) {
                preview.remove();
            }
        });
    }
});

// نصائح ديناميكية
function showDynamicTips() {
    const tips = [
        "تأكد من كتابة عنوان الكتاب بشكل صحيح ومطابق للغلاف",
        "اختر فئة مناسبة لتسهيل العثور على الكتاب",
        "اكتب وصفاً واضحاً عن حالة الكتاب (جديد، مستعمل، إلخ)",
        "حدد سعراً عادلاً يعكس حالة وقيمة الكتاب",
        "أضف صورة واضحة للكتاب لجذب المشترين",
        "تأكد من توفر الكتاب قبل إضافته للموقع"
    ];
    
    const tipsContainer = document.querySelector(".add-book-tips ul");
    if (tipsContainer) {
        const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 5);
        tipsContainer.innerHTML = randomTips.map(tip => `<li>${tip}</li>`).join("");
    }
}

// تشغيل النصائح الديناميكية
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(showDynamicTips, 1000);
});

