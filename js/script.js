// Header background on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const burgerBtn = document.getElementById('burgerBtn');
const mainNav = document.getElementById('mainNav');
burgerBtn.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  burgerBtn.classList.toggle('is-open', open);
  burgerBtn.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// Menu tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.menu-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('is-active'));
    panels.forEach(p => p.classList.remove('is-active'));
    btn.classList.add('is-active');
    document.querySelector(`.menu-panel[data-panel="${btn.dataset.tab}"]`).classList.add('is-active');
  });
});

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.gallery-grid img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
  });
});
const closeLightbox = () => lightbox.classList.remove('is-open');
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// Reservation form (no backend — just confirms locally)
const reserveForm = document.getElementById('reserveForm');
const formNote = document.getElementById('formNote');
reserveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Danke! Dies ist eine Demo-Seite — bitte ein echtes Buchungssystem oder Mailto-Handler anbinden.';
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
