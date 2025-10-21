// متغيرات سلة التسوق
let cartItems = [];
let cartTotal = 0;

// تحميل سلة التسوق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    if (!requireAuth()) {
        return;
    }
    
    loadCart();
});

// تحميل سلة التسوق من localStorage
async function loadCart() {
    showLoading("جاري تحميل سلة التسوق...");
    
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // استخدام البيانات المضمنة مباشرة بدلاً من fetch
    const allBooksData = window.allBooksData; 

    cartItems = [];
    cartTotal = 0;

    for (const item of storedCart) {
        const book = allBooksData.find(b => b.id === item.book_id);
        if (book) {
            const quantity = item.quantity;
            const price = parseFloat(book.price);
            const subtotal = price * quantity;
            cartItems.push({
                book_id: book.id,
                title: book.title,
                author: book.author,
                price: price.toFixed(2),
                image: book.image,
                quantity: quantity,
                subtotal: subtotal.toFixed(2)
            });
            cartTotal += subtotal;
        }
    }
    
    hideLoading();
    displayCart();
}

// جلب جميع الكتب (لم تعد هناك حاجة لهذه الدالة لأننا نستخدم allBooksData مباشرة)
// async function getAllBooksForCart() {
//     try {
//         const response = await fetch('js/books.json');
//         const result = await response.json();
//         return Array.isArray(result) ? result : (result.books || []);
//     } catch (error) {
//         console.error('Error fetching all books for cart:', error);
//         return [];
//     }
// }

// عرض سلة التسوق
function displayCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartSummary = document.getElementById("cartSummary");
    const emptyCart = document.getElementById("emptyCart");
    
    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }
    
    // إخفاء رسالة السلة الفارغة
    if (emptyCart) {
        emptyCart.style.display = "none";
    }
    
    // عرض عناصر السلة
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cartItems.map(item => createCartItemHTML(item)).join("");
        // إضافة التأثيرات البصرية
        setTimeout(addCartAnimations, 100);
    }
    
    // عرض ملخص السلة
    if (cartSummary) {
        cartSummary.style.display = "block";
        updateCartSummary();
    }
    
    // تحديث عدد العناصر في الشريط العلوي
    updateCartCountInHeader();
}

// إنشاء HTML لعنصر في السلة
function createCartItemHTML(item) {
    const imageUrl = item.image ? normalizeImagePath(item.image) : "../images/books/default-book.jpg";
    
    return `
        <div class="cart-item" data-book-id="${item.book_id}">
            <img src="${imageUrl}" alt="${item.title}" onerror="this.src=\'../images/books/default-book.jpg\'" >
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p><strong>المؤلف:</strong> ${item.author}</p>
                <p class="price">${item.price} ريال</p>
                <p class="subtotal">المجموع الفرعي: ${item.subtotal} ريال</p>
            </div>
            <div class="cart-item-actions">
                <input type="number" value="${item.quantity}" min="1" max="10" 
                       onchange="updateQuantity(${item.book_id}, this.value)">
                <button onclick="removeFromCart(${item.book_id})">حذف</button>
            </div>
        </div>
    `;
}

// تحديث ملخص السلة
function updateCartSummary() {
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    
    if (subtotalElement) {
        subtotalElement.textContent = `${cartTotal.toFixed(2)} ريال`;
    }
    
    if (totalElement) {
        totalElement.textContent = `${cartTotal.toFixed(2)} ريال`;
    }
}

// عرض السلة الفارغة
function showEmptyCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartSummary = document.getElementById("cartSummary");
    const emptyCart = document.getElementById("emptyCart");
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = "";
    }
    
    if (cartSummary) {
        cartSummary.style.display = "none";
    }
    
    if (emptyCart) {
        emptyCart.style.display = "block";
    }
    updateCartCountInHeader(); // تحديث عدد السلة في الهيدر عند إفراغها
}

// تحديث كمية عنصر في السلة (محليًا)
async function updateQuantity(bookId, newQuantity) {
    const quantity = parseInt(newQuantity);
    
    if (quantity < 1) {
        removeFromCart(bookId);
        return;
    }
    
    showLoading("جاري تحديث الكمية...");

    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = storedCart.findIndex(item => item.book_id === bookId);

    if (itemIndex > -1) {
        storedCart[itemIndex].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(storedCart));
        showMessage("تم تحديث الكمية بنجاح!", "success");
        loadCart(); // إعادة تحميل السلة لتحديث العرض والحسابات
    } else {
        showMessage("فشل في تحديث الكمية: الكتاب غير موجود في السلة", "error");
    }
    hideLoading();
}

// حذف عنصر من السلة (محليًا)
function removeFromCart(bookId) {
    if (!confirm("هل أنت متأكد من حذف هذا الكتاب من السلة؟")) {
        return;
    }
    
    showLoading("جاري حذف الكتاب...");

    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    storedCart = storedCart.filter(item => item.book_id !== bookId);
    localStorage.setItem("cart", JSON.stringify(storedCart));
    
    showMessage("تم حذف الكتاب من السلة", "success");
    loadCart(); // إعادة تحميل السلة لتحديث العرض والحسابات
    hideLoading();
}

// إفراغ السلة بالكامل (محليًا)
function clearCart() {
    if (!confirm("هل أنت متأكد من إفراغ السلة بالكامل؟")) {
        return;
    }
    
    showLoading("جاري إفراغ السلة...");
    localStorage.removeItem("cart");
    cartItems = [];
    cartTotal = 0;
    showMessage("تم إفراغ السلة بنجاح", "success");
    showEmptyCart();
    hideLoading();
}

// إتمام الشراء
function checkout() {
    if (cartItems.length === 0) {
        showMessage("السلة فارغة", "warning");
        return;
    }
    
    // في التطبيق الحقيقي، هنا سيتم توجيه المستخدم إلى صفحة الدفع
    showMessage("شكراً لك! سيتم التواصل معك قريباً لإتمام عملية الشراء.", "success");
    
    // محاكاة إتمام الطلب
    setTimeout(() => {
        clearCart();
    }, 2000);
}

// تحديث عدد العناصر في السلة في الشريط العلوي
function updateCartCountInHeader() {
    const cartLink = document.querySelector("a[href=\"cart.html\"]");
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = storedCart.length;

    if (cartLink) {
        cartLink.innerHTML = `سلة التسوق (${cartCount})`;
    }
}

// تحديث عدد العناصر عند تحميل السلة
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        updateCartCountInHeader();
    }, 1000);
});

// إضافة تأثيرات بصرية للسلة
function addCartAnimations() {
    const cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        
        setTimeout(() => {
            item.style.transition = "all 0.3s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }, index * 100);
    });
}

// دالة مساعدة لتطبيع مسار الصورة (مكررة من books.js لتجنب الاعتماد المتبادل)
function normalizeImagePath(raw) {
    if (!raw || typeof raw !== "string" || !raw.trim()) return "../images/books/default-book.jpg";
    const s = raw.trim();
  
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
  
    if (s.startsWith("/")) return ".." + s;
  
    return "../" + s.replace(/^\/+/, "");
  }

