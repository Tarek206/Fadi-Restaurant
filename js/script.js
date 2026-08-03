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

// Lightbox (gallery images + menu dish photos)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.gallery-grid img, .dish-img img').forEach(img => {
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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------- Language switch (DE / AR) ----------------
const LANG_KEY = 'schami-lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'de';

const titleByLang = {
  de: 'Schami — Orientalische Küche',
  ar: 'الشامي — مطبخ شرقي'
};

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-ar', lang === 'ar');
  document.title = titleByLang[lang];

  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.dataset.deHtml === undefined) el.dataset.deHtml = el.innerHTML;
    el.innerHTML = lang === 'ar' ? el.dataset.ar : el.dataset.deHtml;
  });

  document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
    if (el.dataset.dePlaceholder === undefined) el.dataset.dePlaceholder = el.getAttribute('placeholder') || '';
    el.setAttribute('placeholder', lang === 'ar' ? el.dataset.arPlaceholder : el.dataset.dePlaceholder);
  });

  document.querySelectorAll('[data-ar-aria-label]').forEach(el => {
    if (el.dataset.deAriaLabel === undefined) el.dataset.deAriaLabel = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', lang === 'ar' ? el.dataset.arAriaLabel : el.dataset.deAriaLabel);
  });

  document.querySelectorAll('.lang-switch').forEach(sw => sw.setAttribute('data-active', lang));
  localStorage.setItem(LANG_KEY, lang);
}

document.querySelectorAll('.lang-switch').forEach(sw => {
  sw.addEventListener('click', () => applyLanguage(currentLang === 'de' ? 'ar' : 'de'));
});

applyLanguage(currentLang);
