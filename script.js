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
