// script.js - header/footer functionality (mobile menu, cart demo, whatsapp modal, newsletter)
document.addEventListener('DOMContentLoaded', () => {
  // elements
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const cartCountEl = document.getElementById('cartCount');
  const cartBtn = document.getElementById('cartBtn');

  const whatsappBtn = document.getElementById('whatsappBtn');
  const whatsappModal = document.getElementById('whatsappModal');
  const modalClose = document.getElementById('modalClose');
  const openWhatsAppBtn = document.getElementById('openWhatsApp');
  const cancelModalBtn = document.getElementById('cancelModal');

  const newsletterForm = document.getElementById('newsletterForm');
  const yearEl = document.getElementById('year');

  // set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  function setNavOpen(isOpen) {
    if (!mainNav) return;
    if (isOpen) {
      mainNav.classList.remove('closed');
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      mainNav.classList.add('closed');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  // initialize closed on small screens
  function initNavState() {
    if (window.innerWidth <= 768) setNavOpen(false);
    else setNavOpen(true);
  }
  initNavState();
  window.addEventListener('resize', initNavState);

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isClosed = mainNav.classList.contains('closed');
      setNavOpen(isClosed);
    });
  }

  // simple cart demo
  let cartCount = 0;
  window.addToCart = function addToCart() {
    cartCount++;
    if (cartCountEl) cartCountEl.textContent = cartCount;
    // small visual feedback
    if (cartBtn) {
      cartBtn.animate([{ transform: 'scale(1.05)' }, { transform: 'scale(1)' }], { duration: 140 });
    }
  };
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      if (cartCount === 0) alert('Your cart is currently empty. Add products to continue.');
      else alert(`You have ${cartCount} item(s) in cart.`);
    });
  }

  // WhatsApp modal
  function openWhatsAppModal() {
    if (!whatsappModal) { openWhatsAppDirect(); return; }
    whatsappModal.style.display = 'flex';
    whatsappModal.setAttribute('aria-hidden', 'false');
  }
  function closeWhatsAppModal() {
    if (!whatsappModal) return;
    whatsappModal.style.display = 'none';
    whatsappModal.setAttribute('aria-hidden', 'true');
  }

  function openWhatsAppDirect() {
    const phoneNumber = '923100000202'; // no plus sign for wa.me
    const message = 'Hello M&G Health Care, I have a question about your products.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  if (whatsappBtn) whatsappBtn.addEventListener('click', openWhatsAppModal);
  if (modalClose) modalClose.addEventListener('click', closeWhatsAppModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeWhatsAppModal);

  if (openWhatsAppBtn) {
    openWhatsAppBtn.addEventListener('click', () => {
      openWhatsAppDirect();
      closeWhatsAppModal();
    });
  }

  // close modal when clicking outside the modal content
  if (whatsappModal) {
    whatsappModal.addEventListener('click', (e) => {
      if (e.target === whatsappModal) closeWhatsAppModal();
    });
  }

  // newsletter form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (!email) return alert('Please enter a valid email address.');
      // replace with real submission / API call later
      alert(`Thank you for subscribing. Email registered: ${email}`);
      newsletterForm.reset();
    });
  }
});







/* Hero slider script
 - 6 slides
 - auto-change every 5 seconds
 - pause on hover / focus
 - prev/next controls
 - indicators clickable
 - keyboard left/right
 - touch swipe support
*/

(function () {
  const INTERVAL = 5000;
  const slider = document.getElementById('heroSlider');
  const slidesContainer = document.getElementById('slides');
  const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = Array.from(document.querySelectorAll('.dot'));

  let current = 0;
  let timer = null;
  let isPaused = false;
  let startX = null;

  function goTo(index) {
    index = (index + slides.length) % slides.length;
    if (index === current) return;
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    indicators[current].classList.remove('active');
    indicators[current].setAttribute('aria-pressed', 'false');

    slides[index].classList.add('active');
    slides[index].setAttribute('aria-hidden', 'false');
    indicators[index].classList.add('active');
    indicators[index].setAttribute('aria-pressed', 'true');

    current = index;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { stopAuto(); timer = setInterval(() => { if (!isPaused) next(); }, INTERVAL); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => { goTo(idx); startAuto(); });
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(idx); startAuto(); }
    });
  });

  if (slider) {
    slider.addEventListener('mouseenter', () => { isPaused = true; });
    slider.addEventListener('mouseleave', () => { isPaused = false; });
    slider.addEventListener('focusin', () => { isPaused = true; });
    slider.addEventListener('focusout', () => { isPaused = false; });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); startAuto(); }
    if (e.key === 'ArrowLeft') { prev(); startAuto(); }
  });

  // touch swipe
  if (slider) {
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
    slider.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
      if (endX === null) return;
      const dx = endX - startX;
      if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); startAuto(); }
      startX = null;
    });
  }

  // init
  function init() {
    slides.forEach((s, i) => {
      if (i === 0) { s.classList.add('active'); s.setAttribute('aria-hidden', 'false'); }
      else { s.classList.remove('active'); s.setAttribute('aria-hidden', 'true'); }
    });
    indicators.forEach((d, i) => { if (i === 0) d.classList.add('active'); else d.classList.remove('active'); });
    startAuto();
  }

  init();
})();



// categories.js - small behaviors for Shop by Category
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('#shop-categories .cat-card');

  // make cards keyboard accessible (Enter/Space to follow link)
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // follow anchor's href
        const href = card.getAttribute('href') || card.querySelector('a')?.href;
        if (href) window.location.href = href;
        else card.click();
      }
    });

    // optional: show tiny ripple on click (visual feedback)
    card.addEventListener('click', (e) => {
      // small feedback: scale then return (no heavy animation)
      card.style.transition = 'transform 120ms ease';
      card.style.transform = 'scale(0.996)';
      setTimeout(() => card.style.transform = '', 120);
    });
  });

  // Improve horizontal scroller experience on mobile: snap to cards
  const grid = document.querySelector('.category-grid');
  if (grid && getComputedStyle(grid).display === 'flex') {
    grid.style.scrollSnapType = 'x mandatory';
    document.querySelectorAll('.cat-card').forEach(c => {
      c.style.scrollSnapAlign = 'center';
    });
  }
});


/* top-products.js
  - renders top products into #productsGrid
  - handles Add To Cart (updates #cartCount)
  - quick view modal
*/

document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id:1, title:'Calcium + D3 500mg', price:1200, old:1500, img:'images/product1.jpg', badge:'-20%', rating:4.6, url:'#'},
    { id:2, title:'Omega-3 Fish Oil 1000mg', price:1800, old:2200, img:'images/product2.jpg', badge:'-18%', rating:4.7, url:'#'},
    { id:3, title:'Vitamin D3 Drops 400IU', price:950, old:null, img:'images/product3.jpg', badge:null, rating:4.4, url:'#'},
    { id:4, title:'Multivitamin Tablets', price:1500, old:1800, img:'images/product4.jpg', badge:'-16%', rating:4.5, url:'#'},
    { id:5, title:'Kids Immunity Booster', price:1100, old:1300, img:'images/product5.jpg', badge:'-15%', rating:4.3, url:'#'},
    { id:6, title:'Herbal Liver Care', price:1400, old:1700, img:'images/product6.jpg', badge:'-18%', rating:4.2, url:'#'},
    { id:7, title:'Energy + Immunity Pack', price:1999, old:2499, img:'images/product7.jpg', badge:'-20%', rating:4.8, url:'#'},
    { id:8, title:'Skin & Hair Complex', price:1299, old:1599, img:'images/product8.jpg', badge:'-19%', rating:4.5, url:'#'}
  ];

  const grid = document.getElementById('productsGrid');
  const cartCountEl = document.getElementById('cartCount');
  const cartBtn = document.getElementById('cartBtn');

  function renderStarRating(r) {
    const full = Math.floor(r);
    const half = (r - full) >= 0.5;
    let out = '';
    for (let i=0;i<full;i++) out += '★';
    if (half) out += '☆';
    // fill remaining
    const remain = 5 - (full + (half?1:0));
    for (let i=0;i<remain;i++) out += '☆';
    return out;
  }

  function createCard(p) {
    const el = document.createElement('article');
    el.className = 'product';
    el.setAttribute('role','listitem');
    el.innerHTML = `
      ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
      <a href="${p.url}" class="media-link" title="${escapeHtml(p.title)}">
        <div class="media"><img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy"></div>
      </a>
      <div class="title">${escapeHtml(p.title)}</div>
      <div class="meta"><div class="rating" aria-hidden="true">${renderStarHtml(p.rating)}</div><div class="meta-price">${p.rating? p.rating.toFixed(1): ''}</div></div>
      <div class="price-row">
        <div class="price">Rs. ${formatNumber(p.price)}</div>
        ${p.old ? `<div class="old">Rs. ${formatNumber(p.old)}</div>` : ''}
      </div>
      <div class="actions">
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        <button class="quick-view" data-id="${p.id}">Quick View</button>
      </div>
    `;
    return el;
  }

  function renderStarHtml(r) {
    if (!r) return '';
    const full = Math.floor(r);
    const half = (r - full) >= 0.5;
    let out = '';
    for (let i=0;i<full;i++) out += '<span>★</span>';
    if (half) out += '<span>★</span>';
    const remain = 5 - (full + (half?1:0));
    for (let i=0;i<remain;i++) out += '<span>☆</span>';
    return out;
  }

  function formatNumber(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // render products
  products.forEach(p => grid.appendChild(createCard(p)));

  // Cart logic
  let count = parseInt(cartCountEl?.textContent || '0', 10);
  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      const id = addBtn.dataset.id;
      addToCart(+id);
    }
    const qvBtn = e.target.closest('.quick-view');
    if (qvBtn) {
      openQuickView(+qvBtn.dataset.id);
    }
  });

  function addToCart(productId){
    // quick demo: increment count and animate
    count++;
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartBtn) cartBtn.animate([{ transform:'scale(1.06)' }, { transform:'scale(1)' }], { duration:150 });
    // in real app, call API / update cart state
  }

  // Quick View modal
  const qv = document.getElementById('productQuickView');
  const qvImg = document.getElementById('qvImg');
  const qvTitle = document.getElementById('qvTitle');
  const qvDesc = document.getElementById('qvDesc');
  const qvPrice = document.getElementById('qvPrice');
  const qvOldPrice = document.getElementById('qvOldPrice');
  const qvAdd = document.getElementById('qvAdd');
  const qvView = document.getElementById('qvView');
  const qvClose = document.getElementById('qvClose');

  function openQuickView(id){
    const p = products.find(x => x.id === id);
    if (!p) return;
    qvImg.src = p.img;
    qvImg.alt = p.title;
    qvTitle.textContent = p.title;
    qvDesc.textContent = p.short || 'High quality product. Replace this description with your product summary.';
    qvPrice.textContent = 'Rs. ' + formatNumber(p.price);
    qvOldPrice.textContent = p.old ? 'Rs. ' + formatNumber(p.old) : '';
    qvView.href = p.url || '#';
    qvAdd.onclick = () => { addToCart(id); closeQuickView(); };
    qv.setAttribute('aria-hidden', 'false');
    qv.style.display = 'flex';
    qv.focus();
  }

  function closeQuickView(){
    qv.setAttribute('aria-hidden','true');
    qv.style.display = 'none';
  }

  if (qvClose) qvClose.addEventListener('click', closeQuickView);
  qv.addEventListener('click', (e) => { if (e.target === qv) closeQuickView(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuickView(); });

  // accessibility: keyboard activate quick view via Enter on product
  grid.querySelectorAll('.product').forEach(card => {
    card.tabIndex = 0;
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const id = card.querySelector('.add-to-cart')?.dataset.id;
        if (id) openQuickView(+id);
      }
    });
  });
});


