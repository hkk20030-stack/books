// متغيرات عامة للكتب
let allBooks = [];
let filteredBooks = [];
let currentCategory = "";
let currentSearch = "";

// تحميل الكتب عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
  setupBookEvents();
});

// إعداد أحداث الكتب
function setupBookEvents() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchBooks();
      }
    });
  }
}

// --- أدوات مساعدة --- //
function normalizeImagePath(raw) {
  if (!raw || typeof raw !== "string" || !raw.trim()) return "../images/books/default-book.jpg";
  const s = raw.trim();

  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  if (s.startsWith("/")) return ".." + s;

  return "../" + s.replace(/^\/+/, "");
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>""]/g, (m) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    }[m])
  );
}

// --- تحميل جميع الكتب من data.js --- //
async function loadBooks() {
  try {
    showLoading("جاري تحميل الكتب...");
    // استخدام البيانات المضمنة مباشرة بدلاً من fetch
    allBooks = allBooksData; 
    filteredBooks = [...allBooks];
    displayBooks(filteredBooks);
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error("Error loading books:", error);
    showMessage("حدث خطأ في تحميل الكتب", "error");
  }
}

// --- عرض الكتب --- //
function displayBooks(books) {
  const booksList = document.getElementById("featuredBooksList");
  const booksGrid = document.getElementById("booksGrid");
  const container = booksList || booksGrid;

  if (!container) return;

  if (!books.length) {
    container.innerHTML = 
      "<p class=\"no-books\">لا توجد كتب متاحة حالياً</p>";
    return;
  }

  const booksHTML = books.map((book) => createBookCard(book)).join("");
  container.innerHTML = booksHTML;
}

// --- إنشاء بطاقة كتاب (مصَحّح) --- //
function createBookCard(book) {
  const imgSrc = normalizeImagePath(book.image);
  const title = escapeHtml(book.title);
  const author = escapeHtml(book.author);
  const category = escapeHtml(book.category);
  const desc = String(book.description || "");
  const shortDesc = desc.length > 100 ? escapeHtml(desc.slice(0, 100) + "...") : escapeHtml(desc);
  const price = Number(book.price || 0).toFixed(2);
  const id = Number(book.id) || 0;

  return `
    <div class="book-item book-card" data-category="${category}">
      <div class="book-image">
        <img src="${imgSrc}"
             alt="${title}"
             onerror="this.onerror=null; this.src=\'../images/books/default-book.jpg\';">
      </div>
      <h3 class="book-title">${title}</h3>
      <p><strong>المؤلف:</strong> ${author}</p>
      <p class="book-category"><strong>الفئة:</strong> ${category}</p>
      ${desc ? `<p class="book-description">${shortDesc}</p>` : ""}
      <p class="price">${price} ريال</p>
      <button class="add-to-cart" onclick="addToCart(${id})">إضافة إلى السلة</button>
    </div>
  `;
}

// --- البحث --- //
function searchBooks() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  currentSearch = searchInput.value.trim().toLowerCase();
  filterBooks();
}

// --- فلترة بالفئة من أي مكان --- //
function filterByCategory(category) {
  currentCategory = category;

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) categoryFilter.value = category;

  filterBooks();

  if (!window.location.pathname.includes("books.html")) {
    window.location.href = `books.html?category=${encodeURIComponent(category)}`;
  }
}

// --- تصفية الكتب (نسخة موحدة) --- //
function filterBooks() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) currentCategory = categoryFilter.value;

  filteredBooks = allBooks.filter((book) => {
    const t = (book.title || "").toLowerCase();
    const a = (book.author || "").toLowerCase();
    const c = (book.category || "").toLowerCase();
    const matchesSearch = !currentSearch || t.includes(currentSearch) || a.includes(currentSearch) || c.includes(currentSearch);
    const matchesCategory = !currentCategory || book.category === currentCategory;
    return matchesSearch && matchesCategory;
  });

  displayBooks(filteredBooks);
}

// --- ترتيب --- //
function sortBooks() {
  const sortBy = document.getElementById("sortBy");
  if (!sortBy) return;

  const sortValue = sortBy.value;

  switch (sortValue) {
    case "price_low":
      filteredBooks.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
      break;
    case "price_high":
      filteredBooks.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
      break;
    case "title":
      filteredBooks.sort((a, b) => (a.title || "").localeCompare(b.title || "", "ar"));
      break;
    case "author":
      filteredBooks.sort((a, b) => (a.author || "").localeCompare(b.author || "", "ar"));
      break;
    case "newest":
    default:
      filteredBooks.sort((a, b) => {
        const dA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (dA && dB) return dB - dA;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
      break;
  }

  displayBooks(filteredBooks);
}

// --- إضافة للسلة (محاكاة) --- //
function addToCart(bookId) {
  if (!requireAuth()) return;

  showLoading("جاري إضافة الكتاب إلى السلة...");
  
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.book_id === bookId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ book_id: bookId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  
  showMessage("تم إضافة الكتاب إلى السلة بنجاح!", "success");
  updateCartCount();
  hideLoading();
}

// --- تحديث عدد السلة (محاكاة) --- //
function updateCartCount() {
  if (!currentUser) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;
  const cartLink = document.querySelector("a[href=\"cart.html\"]");
  if (cartLink) cartLink.innerHTML = `سلة التسوق (${cartCount})`;
}

// --- كتب مميزة --- //
function loadFeaturedBooks() {
  if (allBooks.length > 0) {
    const featuredBooks = allBooks.slice(0, 6);
    displayBooks(featuredBooks);
  }
}

// --- معاملات URL --- //
function handleURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const search = urlParams.get("search");

  if (category) {
    currentCategory = category;
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) categoryFilter.value = category;
  }

  if (search) {
    currentSearch = search.toLowerCase();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = search;
  }

  if (category || search) filterBooks();
}

// ـ تحميل معاملات URL عند التحميل ـ //
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    handleURLParams();
    updateCartCount();
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
      loadFeaturedBooks();
    }
  }, 500);
});

