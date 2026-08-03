// ---------------- Global Language State ----------------
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

// ---------------- Load Separate header.html Component ----------------
async function loadHeaderComponent() {
  const headerEl = document.getElementById('siteHeader');
  if (!headerEl) return;

  try {
    const res = await fetch('header.html');
    if (res.ok) {
      headerEl.innerHTML = await res.text();
    }
  } catch (err) {
    console.error('Error fetching header.html:', err);
  }

  // Highlight active page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  headerEl.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === 'index.html' && href === 'index.html'))) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });

  // Header scroll handler
  const onScroll = () => headerEl.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile navigation burger toggle
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');
  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
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

    // Close mobile nav when clicking outside of mainNav & burgerBtn
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
        mainNav.classList.remove('is-open');
        burgerBtn.classList.remove('is-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile nav on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        burgerBtn.classList.remove('is-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Apply language to newly loaded header content
  applyLanguage(currentLang);
}

// Execute header loader on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeaderComponent);
} else {
  loadHeaderComponent();
}

// ---------------- Global Event Listeners & Page Features ----------------
// Language Switcher Click Event
document.addEventListener('click', (e) => {
  const sw = e.target.closest('.lang-switch');
  if (sw) {
    applyLanguage(currentLang === 'de' ? 'ar' : 'de');
  }
});

// Menu tabs logic
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.menu-panel');
if (tabButtons.length > 0) {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = document.querySelector(`.menu-panel[data-panel="${btn.dataset.tab}"]`);
      if (target) target.classList.add('is-active');
    });
  });
}

// Lightbox (gallery images + menu dish photos)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
if (lightbox && lightboxImg && lightboxClose) {
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
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Initial language application
applyLanguage(currentLang);
