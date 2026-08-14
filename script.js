const PRODUCTS = [
  { id: 1, name: "Хот-Дог Классический M", category: "hotdogs", price: 15000, desc: "Сочная сосиска, свежие томаты, огурчик и классический соус.", image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80", badge: "Хит" },
  { id: 2, name: "Двойной Хот-Дог Сырный", category: "hotdogs", price: 22000, desc: "Две сосиски, сыр Чеддер, соус BBQ и хрустящая булочка.", image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80", badge: "Сырный" },
  { id: 3, name: "Бургер Классический Beef", category: "burgers", price: 28000, desc: "100% мраморная говядина, томаты, огурчики и соус.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", badge: "Top" },
  { id: 4, name: "Двойной Чизбургер XL", category: "burgers", price: 38000, desc: "Две котлеты, расплавленный Чеддер, грибной соус.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", badge: "Сочно" },
  { id: 5, name: "Лаваш с Говядиной и Сыром", category: "lavash", price: 37000, desc: "Сочный донер, хрустящие чипсы, сыр и томатный соус.", image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80", badge: "Легенда" },
  { id: 6, name: "Лаваш Куриный Spicy L", category: "lavash", price: 35000, desc: "Острое филе гриль, соус Калампир, томаты.", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80", badge: "🌶️ Острый" },
  { id: 7, name: "Mini Combo Box", category: "combo", price: 28000, desc: "Хот-дог M + Картофель фри + Coca-Cola 0.25л.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", badge: "Выгода 15%" },
  { id: 8, name: "Картофель Фри XL", category: "drinks", price: 14000, desc: "Золотистая фри с морской солью.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80", badge: "Хруст" },
  { id: 9, name: "Coca-Cola 0.5l", category: "drinks", price: 8000, desc: "Охлажденный газированный напиток.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", badge: "Холодный" }
];

let cart = [];
let currentCategory = 'all';
let isPromoApplied = false;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initSlider();
  updateCart();
});

function renderProducts(itemsToRender = null) {
  const grid = document.getElementById('foodGrid');
  const items = itemsToRender || (currentCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentCategory));
  document.getElementById('itemsCounter').innerText = `${items.length} позиций`;

  if (items.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">Ничего не найдено</div>';
    return;
  }

  grid.innerHTML = items.map(p => `
    <div class="food-card">
      <div>
        <div class="food-img-wrapper"><img src="${p.image}" alt="${p.name}"><span class="food-badge">${p.badge}</span></div>
        <div class="food-info"><h3 class="food-title">${p.name}</h3><p class="food-desc">${p.desc}</p></div>
      </div>
      <div class="food-bottom">
        <span class="food-price">${p.price.toLocaleString()} сум</span>
        <button class="add-btn" onclick="addToCart(${p.id})"><i class="fa-solid fa-plus"></i> В корзину</button>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat, btn = null) {
  currentCategory = cat;
  if (btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderProducts();
}

function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  renderProducts(query ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query)) : null);
}

// SLIDER
let currentSlide = 0;
function initSlider() { setInterval(() => showSlide(currentSlide + 1), 5000); }
function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');
}
function moveSlide(dir) { showSlide(currentSlide + dir); }
function goToSlide(i) { showSlide(i); }

// CART
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...PRODUCTS.find(p => p.id === id), qty: 1 });
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }
  updateCart();
}

function updateCart() {
  const container = document.getElementById('cartItemsContainer');
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  document.getElementById('cartBadge').innerText = totalCount;
  document.getElementById('subtotalVal').innerText = `${subtotal.toLocaleString()} сум`;

  let discount = isPromoApplied ? Math.round(subtotal * 0.10) : 0;
  const total = Math.max(0, subtotal - discount);

  if (isPromoApplied && subtotal > 0) {
    document.getElementById('discountRow').classList.remove('hidden');
    document.getElementById('discountVal').innerText = `-${discount.toLocaleString()} сум`;
  } else {
    document.getElementById('discountRow').classList.add('hidden');
  }

  document.getElementById('totalVal').innerText = `${total.toLocaleString()} сум`;
  document.getElementById('modalTotal').innerText = `${total.toLocaleString()} сум`;
  document.getElementById('checkoutBtn').disabled = cart.length === 0;

  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#94a3b8;">Корзина пуста</div>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}">
      <div style="flex:1;"><div style="font-size:0.85rem; font-weight:bold;">${item.name}</div><div style="color:#f59e0b;">${(item.price * item.qty).toLocaleString()} сум</div></div>
      <div style="display:flex; gap:8px;">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function applyPromo() {
  if (document.getElementById('promoInput').value.trim().toUpperCase() === 'BISTRO10') {
    isPromoApplied = true;
    document.getElementById('promoNotice').innerText = '✓ Промокод BISTRO10 применен (-10%)';
    updateCart();
  }
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function openModal() { toggleCart(); document.getElementById('checkoutModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('checkoutModal').classList.add('hidden'); }

function handleOrderSubmit(e) {
  e.preventDefault();
  closeModal();
  document.getElementById('successModal').classList.remove('hidden');
  cart = []; updateCart();
}

function closeSuccessModal() { document.getElementById('successModal').classList.add('hidden'); }
