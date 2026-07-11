if (localStorage.getItem("isAdminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");
const tabBtns = document.querySelectorAll(".tabBtn");
const tabContents = document.querySelectorAll(".tabContent");
const productsCount = document.getElementById("productsCount");
const articlesCount = document.getElementById("articlesCount");
const latestProducts = document.getElementById("latestProducts");
const latestArticles = document.getElementById("latestArticles");
const productForm = document.getElementById("productForm");
const productFormTitle = document.getElementById("productFormTitle");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productOldPrice = document.getElementById("productOldPrice");
const productStock = document.getElementById("productStock");
const productCategory = document.getElementById("productCategory");
const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewWrapper = document.getElementById("imagePreviewWrapper");
const cancelProductEdit = document.getElementById("cancelProductEdit");
const productsList = document.getElementById("productsList");
const adminProductSearch = document.getElementById("adminProductSearch");
const clearProductsBtn = document.getElementById("clearProductsBtn");
const articleForm = document.getElementById("articleForm");
const articleFormTitle = document.getElementById("articleFormTitle");
const articleId = document.getElementById("articleId");
const articleTitle = document.getElementById("articleTitle");
const articleDate = document.getElementById("articleDate");
const articleDesc = document.getElementById("articleDesc");
const cancelArticleEdit = document.getElementById("cancelArticleEdit");
const articlesList = document.getElementById("articlesList");
const adminArticleSearch = document.getElementById("adminArticleSearch");
const clearArticlesBtn = document.getElementById("clearArticlesBtn");

let products = JSON.parse(localStorage.getItem("products")) || [];
let articles = JSON.parse(localStorage.getItem("articles")) || [];
let currentProductImage = "";

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

function saveProducts() { localStorage.setItem("products", JSON.stringify(products)); }
function saveArticles() { localStorage.setItem("articles", JSON.stringify(articles)); }

function updateDashboard() {
  productsCount.textContent = products.length;
  articlesCount.textContent = articles.length;
  latestProducts.innerHTML = products.slice(0, 5).map(item => `<div class="border rounded-xl p-3"><p class="font-bold">${item.name}</p><p class="text-sm text-gray-500">${item.category || "-"}</p></div>`).join("") || `<p class="text-gray-500">محصولی ثبت نشده است.</p>`;
  latestArticles.innerHTML = articles.slice(0, 5).map(item => `<div class="border rounded-xl p-3"><p class="font-bold">${item.title}</p><p class="text-sm text-gray-500">${item.date}</p></div>`).join("") || `<p class="text-gray-500">مقاله‌ای ثبت نشده است.</p>`;
}

function renderProducts() {
  const search = adminProductSearch.value.trim().toLowerCase();
  const filtered = products.filter(item => item.name.toLowerCase().includes(search) || (item.category || "").toLowerCase().includes(search));
  if (!filtered.length) {
    productsList.innerHTML = `<p class="text-gray-500">محصولی پیدا نشد.</p>`;
    return;
  }
  productsList.innerHTML = filtered.map(item => `
    <div class="border rounded-2xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div class="flex gap-4 items-start">
        <img src="${item.image || 'https://via.placeholder.com/120x90?text=Product'}" class="w-28 h-24 object-cover rounded-xl border" alt="${item.name}">
        <div>
          <h3 class="font-bold text-lg">${item.name}</h3>
          <p class="text-sm text-gray-500 mt-1">دسته‌بندی: ${item.category || "-"}</p>
          <p class="mt-2">قیمت: <span class="font-bold text-orange-500">${item.price}</span></p>
          <p class="text-sm text-gray-500">قیمت قبلی: ${item.oldPrice || "-"}</p>
          <p class="text-sm ${item.stock?.includes("ناموجود") ? "text-red-500" : "text-green-600"}">وضعیت: ${item.stock || "-"}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editProduct(${item.id})" class="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800">ویرایش</button>
        <button onclick="deleteProduct(${item.id})" class="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600">حذف</button>
      </div>
    </div>
  `).join("");
}

function renderArticles() {
  const search = adminArticleSearch.value.trim().toLowerCase();
  const filtered = articles.filter(item => item.title.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search));
  if (!filtered.length) {
    articlesList.innerHTML = `<p class="text-gray-500">مقاله‌ای پیدا نشد.</p>`;
    return;
  }
  articlesList.innerHTML = filtered.map(item => `
    <div class="border rounded-2xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div>
        <h3 class="font-bold text-lg">${item.title}</h3>
        <p class="text-sm text-gray-500 mt-1">${item.date}</p>
        <p class="text-gray-700 mt-3 leading-8">${item.desc}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="editArticle(${item.id})" class="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800">ویرایش</button>
        <button onclick="deleteArticle(${item.id})" class="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600">حذف</button>
      </div>
    </div>
  `).join("");
}

function resetProductForm() {
  productForm.reset();
  productId.value = "";
  currentProductImage = "";
  productFormTitle.textContent = "افزودن محصول";
  cancelProductEdit.classList.add("hidden");
  imagePreviewWrapper.classList.add("hidden");
  productStock.value = "موجود در انبار";
}

function resetArticleForm() {
  articleForm.reset();
  articleId.value = "";
  articleFormTitle.textContent = "افزودن مقاله";
  cancelArticleEdit.classList.add("hidden");
}

productImage.addEventListener("change", function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    currentProductImage = e.target.result;
    imagePreview.src = currentProductImage;
    imagePreviewWrapper.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

productForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = productId.value;
  const productData = { id: id ? Number(id) : Date.now(), name: productName.value.trim(), price: productPrice.value.trim(), oldPrice: productOldPrice.value.trim(), stock: productStock.value.trim(), category: productCategory.value.trim(), image: currentProductImage };
  if (id) {
    products = products.map(item => item.id === Number(id) ? productData : item);
    showToast("محصول با موفقیت ویرایش شد");
  } else {
    products.unshift(productData);
    showToast("محصول جدید اضافه شد");
  }
  saveProducts(); renderProducts(); updateDashboard(); resetProductForm();
});

articleForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = articleId.value;
  const articleData = { id: id ? Number(id) : Date.now(), title: articleTitle.value.trim(), date: articleDate.value.trim(), desc: articleDesc.value.trim() };
  if (id) {
    articles = articles.map(item => item.id === Number(id) ? articleData : item);
    showToast("مقاله با موفقیت ویرایش شد");
  } else {
    articles.unshift(articleData);
    showToast("مقاله جدید اضافه شد");
  }
  saveArticles(); renderArticles(); updateDashboard(); resetArticleForm();
});

function editProduct(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  productId.value = item.id;
  productName.value = item.name;
  productPrice.value = item.price;
  productOldPrice.value = item.oldPrice || "";
  productStock.value = item.stock || "";
  productCategory.value = item.category || "";
  currentProductImage = item.image || "";
  if (currentProductImage) {
    imagePreview.src = currentProductImage;
    imagePreviewWrapper.classList.remove("hidden");
  } else {
    imagePreviewWrapper.classList.add("hidden");
  }
  productFormTitle.textContent = "ویرایش محصول";
  cancelProductEdit.classList.remove("hidden");
  switchTab("products");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  const confirmDelete = confirm("آیا از حذف این محصول مطمئن هستید؟");
  if (!confirmDelete) return;
  products = products.filter(item => item.id !== id);
  saveProducts(); renderProducts(); updateDashboard(); showToast("محصول حذف شد");
}

function editArticle(id) {
  const item = articles.find(a => a.id === id);
  if (!item) return;
  articleId.value = item.id;
  articleTitle.value = item.title;
  articleDate.value = item.date;
  articleDesc.value = item.desc;
  articleFormTitle.textContent = "ویرایش مقاله";
  cancelArticleEdit.classList.remove("hidden");
  switchTab("articles");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteArticle(id) {
  const confirmDelete = confirm("آیا از حذف این مقاله مطمئن هستید؟");
  if (!confirmDelete) return;
  articles = articles.filter(item => item.id !== id);
  saveArticles(); renderArticles(); updateDashboard(); showToast("مقاله حذف شد");
}

cancelProductEdit.addEventListener("click", resetProductForm);
cancelArticleEdit.addEventListener("click", resetArticleForm);

clearProductsBtn.addEventListener("click", () => {
  const confirmDelete = confirm("همه محصولات حذف شوند؟");
  if (!confirmDelete) return;
  products = []; saveProducts(); renderProducts(); updateDashboard(); resetProductForm(); showToast("همه محصولات حذف شدند");
});

clearArticlesBtn.addEventListener("click", () => {
  const confirmDelete = confirm("همه مقالات حذف شوند؟");
  if (!confirmDelete) return;
  articles = []; saveArticles(); renderArticles(); updateDashboard(); resetArticleForm(); showToast("همه مقالات حذف شدند");
});

adminProductSearch.addEventListener("input", renderProducts);
adminArticleSearch.addEventListener("input", renderArticles);
logoutBtn.addEventListener("click", () => { localStorage.removeItem("isAdminLoggedIn"); window.location.href = "login.html"; });

function switchTab(tabName) {
  tabContents.forEach(tab => tab.classList.add("hidden"));
  tabBtns.forEach(btn => btn.classList.remove("bg-orange-500", "text-white"));
  document.getElementById(`${tabName}Tab`).classList.remove("hidden");
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("bg-orange-500", "text-white");
}

tabBtns.forEach(btn => { btn.addEventListener("click", () => { switchTab(btn.dataset.tab); }); });

switchTab("dashboard");
renderProducts();
renderArticles();
updateDashboard();