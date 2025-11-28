// product.js - interactions for product view page
document.addEventListener('DOMContentLoaded', () => {
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.getElementById('thumbs');
  const qtyInput = document.getElementById('qtyInput');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyMinus = document.getElementById('qtyMinus');
  const addToCartBtn = document.getElementById('addToCart');
  const cartCountEl = document.getElementById('cartCount');
  const recTrack = document.getElementById('recTrack');
  const recPrev = document.getElementById('recPrev');
  const recNext = document.getElementById('recNext');
  const yearEl = document.getElementById('year');

  // set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // thumbnail click -> change main image
  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('.thumb');
    if (!btn) return;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const src = btn.getAttribute('data-src');
    mainImage.src = src;
    mainImage.focus();
  });

  // qty controls
  qtyPlus.addEventListener('click', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value || '1') + 1); });
  qtyMinus.addEventListener('click', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value || '1') - 1); });
  qtyInput.addEventListener('change', () => { if (parseInt(qtyInput.value || '0') < 1) qtyInput.value = 1; });

  // simple cart using localStorage
  function getCartCount() {
    return parseInt(localStorage.getItem('mg_cart_count') || '0', 10);
  }
  function setCartCount(n) {
    localStorage.setItem('mg_cart_count', String(n));
    if (cartCountEl) cartCountEl.textContent = String(n);
  }

  // initialize cart count
  setCartCount(getCartCount());

  addToCartBtn.addEventListener('click', () => {
    const qty = Math.max(1, parseInt(qtyInput.value || '1'));
    let current = getCartCount();
    setCartCount(current + qty);
    // small animation
    addToCartBtn.animate([{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:180});
    alert(`Added ${qty} item(s) to cart.`);
  });

  // Recommended products data (replace with your data / API)
  const recommended = [
    {id:201, title:'Vitamin D3 Drops', price:950, img:'images/product3.jpg', url:'#'},
    {id:202, title:'Omega-3 Fish Oil', price:1800, img:'images/product2.jpg', url:'#'},
    {id:203, title:'Multivitamin', price:1500, img:'images/product4.jpg', url:'#'},
    {id:204, title:'Kids Immunity Booster', price:1100, img:'images/product5.jpg', url:'#'},
    {id:205, title:'Herbal Liver Care', price:1400, img:'images/product6.jpg', url:'#'}
  ];

  // render recommended cards
  function renderRecommended() {
    recTrack.innerHTML = '';
    recommended.forEach(p => {
      const card = document.createElement('a');
      card.className = 'rec-card';
      card.href = p.url;
      card.innerHTML = `
        <img src="${p.img}" alt="${escapeHtml(p.title)}">
        <div class="r-title">${escapeHtml(p.title)}</div>
        <div class="r-price">Rs. ${formatNumber(p.price)}</div>
      `;
      recTrack.appendChild(card);
    });
  }

  function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function formatNumber(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  renderRecommended();

  // simple slider scroll by width
  function scrollRec(direction = 'next') {
    const cardWidth = recTrack.querySelector('.rec-card')?.offsetWidth || 180;
    const gap = 12;
    const scrollAmount = (cardWidth + gap) * 2; // show 2 new cards
    if (direction === 'next') recTrack.scrollBy({left: scrollAmount, behavior:'smooth'});
    else recTrack.scrollBy({left: -scrollAmount, behavior:'smooth'});
  }
  recNext.addEventListener('click', () => scrollRec('next'));
  recPrev.addEventListener('click', () => scrollRec('prev'));

  // keyboard support for rec track
  recTrack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollRec('prev');
    if (e.key === 'ArrowRight') scrollRec('next');
  });

  // touch support for rec track (swipe)
  let startX = null;
  recTrack.addEventListener('touchstart', (e) => startX = e.touches[0].clientX, {passive:true});
  recTrack.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) scrollRec(dx < 0 ? 'next' : 'prev');
    startX = null;
  });

  // Tabs behavior
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      const target = tab.dataset.tab;
      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
      // set aria
      document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      document.querySelectorAll('.panel').forEach(p => p.setAttribute('aria-hidden', String(!p.classList.contains('active'))));
    });
  });

});
