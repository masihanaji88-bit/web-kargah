const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const productSearch = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const dynamicProducts = document.getElementById("dynamicProducts");
const dynamicArticles = document.getElementById("dynamicArticles");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

document.querySelectorAll("#mobileMenu a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

function seedDemoData() {
  const existingProducts = JSON.parse(localStorage.getItem("products"));
  const existingArticles = JSON.parse(localStorage.getItem("articles"));

  if (!existingProducts) {
    const demoProducts = [
      { id: Date.now() + 1, name: "روغن موتور کراپ SAE 20W-50", price: "450,000 تومان", oldPrice: "520,000 تومان", stock: "موجود در انبار", category: "روغن موتور", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=80" },
      { id: Date.now() + 2, name: "ضد یخ و ضد جوش کراپ", price: "280,000 تومان", oldPrice: "320,000 تومان", stock: "موجود در انبار", category: "ضد یخ", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80" },
      { id: Date.now() + 3, name: "روغن دنده کراپ GL-5", price: "390,000 تومان", oldPrice: "", stock: "موجود محدود", category: "روغن دنده", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80" }
    ];
    localStorage.setItem("products", JSON.stringify(demoProducts));
  }

  if (!existingArticles) {
    const demoArticles = [
      { id: Date.now() + 11, title: "راهنمای انتخاب روغن موتور مناسب", date: "1405/02/10", desc: "در این مقاله به بررسی نکات مهم برای انتخاب روغن موتور متناسب با نوع خودرو، شرایط آب‌وهوایی و استانداردهای فنی پرداخته می‌شود." },
      { id: Date.now() + 12, title: "تفاوت ضد یخ و ضد جوش در نگهداری خودرو", date: "1405/02/18", desc: "سیستم خنک‌کاری خودرو برای عملکرد صحیح نیازمند استفاده از ترکیبات مناسب است. در این مطلب نقش ضد یخ و ضد جوش بررسی می‌شود." },
      { id: Date.now() + 13, title: "زمان تعویض روغن دنده چه موقع است؟", date: "1405/03/01", desc: "بی‌توجهی به تعویض روغن دنده می‌تواند باعث افزایش استهلاک جعبه‌دنده شود. در این مقاله علائم و زمان‌بندی مناسب را مرور می‌کنیم." }
    ];
    localStorage.setItem("articles", JSON.stringify(demoArticles));
  }
}

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function getArticles() {
  return JSON.parse(localStorage.getItem("articles")) || [];
}

function renderCategoryOptions(products) {
  if (!categoryFilter) return;
  const categories = [...new Set(products.map(item => item.category).filter(Boolean))];
  categoryFilter.innerHTML = `<option value="all">همه دسته‌بندی‌ها</option>` + categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
}

function renderProducts() {
  if (!dynamicProducts) return;
  const products = getProducts();
  const searchValue = productSearch ? productSearch.value.trim().toLowerCase() : "";
  const categoryValue = categoryFilter ? categoryFilter.value : "all";

  let filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue) || (product.category || "").toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "all" || product.category === categoryValue;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    dynamicProducts.innerHTML = `<div class="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center"><p class="text-gray-500 text-lg">محصولی با این فیلتر پیدا نشد.</p></div>`;
    return;
  }

  dynamicProducts.innerHTML = filtered.map(product => `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group">
      <div class="h-56 bg-slate-200 overflow-hidden">
        <img src="${product.image || 'https://via.placeholder.com/600x400?text=Product'}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between gap-3 mb-3">
          <span class="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">${product.category || "عمومی"}</span>
          <span class="text-xs ${product.stock?.includes("ناموجود") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} px-3 py-1 rounded-full">${product.stock || "موجود"}</span>
        </div>
        <h3 class="text-xl font-bold mb-3">${product.name}</h3>
        <div class="flex items-center gap-3 flex-wrap">
          ${product.oldPrice ? `<span class="line-through text-gray-400">${product.oldPrice}</span>` : ""}
          <span class="text-orange-500 font-extrabold text-lg">${product.price}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function renderArticles() {
  if (!dynamicArticles) return;
  const articles = getArticles();
  if (articles.length === 0) {
    dynamicArticles.innerHTML = `<div class="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center"><p class="text-gray-500 text-lg">مقاله‌ای برای نمایش وجود ندارد.</p></div>`;
    return;
  }

  dynamicArticles.innerHTML = articles.map(article => `
    <article class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
      <div class="mb-4 h-44 rounded-2xl bg-gradient-to-l from-slate-900 to-slate-700 flex items-center justify-center text-orange-400 font-bold text-xl">Article</div>
      <p class="text-sm text-gray-500 mb-2">${article.date}</p>
      <h3 class="text-xl font-bold mb-3">${article.title}</h3>
      <p class="text-gray-600 leading-8">${article.desc}</p>
    </article>
  `).join("");
}

seedDemoData();
renderCategoryOptions(getProducts());
renderProducts();
renderArticles();
if (productSearch) productSearch.addEventListener("input", renderProducts);
if (categoryFilter) categoryFilter.addEventListener("change", renderProducts);