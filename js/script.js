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

// ---------------- Generic Partial Loader ----------------
async function loadPartial(selector, file) {
  const el = document.querySelector(selector);
  if (!el) return false;
  try {
    const res = await fetch(file);
    if (res.ok) {
      el.innerHTML = await res.text();
      return true;
    }
  } catch (err) {
    console.error(`Error fetching ${file}:`, err);
  }
  return false;
}

// ---------------- Load header.html ----------------
async function loadHeaderComponent() {
  const headerEl = document.getElementById('siteHeader');
  if (!headerEl) return;

  await loadPartial('#siteHeader', 'header.html');

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

    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
        mainNav.classList.remove('is-open');
        burgerBtn.classList.remove('is-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        burgerBtn.classList.remove('is-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  applyLanguage(currentLang);
}

// ---------------- Load hero.html (index only) ----------------
async function loadHeroComponent() {
  const heroEl = document.getElementById('heroContainer');
  if (!heroEl) return;
  await loadPartial('#heroContainer', 'hero.html');
  applyLanguage(currentLang);
}

// ---------------- Load footer.html ----------------
async function loadFooterComponent() {
  const footerEl = document.getElementById('siteFooter');
  if (!footerEl) return;
  await loadPartial('#siteFooter', 'footer.html');
  // Update year after footer loaded
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  applyLanguage(currentLang);
}

// ---------------- Load geschichte.html (index only) ----------------
async function loadGeschichteComponent() {
  const el = document.getElementById('geschichteContainer');
  if (!el) return;
  await loadPartial('#geschichteContainer', 'geschichte.html');
  applyLanguage(currentLang);
}

// ---------------- Load menu-preview.html + 3 Bestsellers from speisekarte ----------------
async function loadMenuPreviewComponent() {
  const el = document.getElementById('menuPreviewContainer');
  if (!el) return;

  // 1. Inject the skeleton
  await loadPartial('#menuPreviewContainer', 'menu-preview.html');

  // 2. Fetch speisekarte.html and parse bestseller dish-cards
  try {
    const res = await fetch('speisekarte.html');
    if (!res.ok) return;
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Collect bestsellers or fallback to first 3 cards with images
    let bestsellers = Array.from(
      doc.querySelectorAll('article.dish-card[data-bestseller="true"]')
    );

    if (bestsellers.length < 3) {
      const fallbackCards = Array.from(
        doc.querySelectorAll('article.dish-card:not(.dish-card--noimg)')
      );
      bestsellers = fallbackCards.slice(0, 3);
    }

    const grid = document.getElementById('menuPreviewGrid');
    if (!grid) return;

    bestsellers.slice(0, 3).forEach(card => {
      card.classList.remove('dish-card--wide');
      card.classList.add('dish-card');
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading bestsellers from speisekarte.html:', err);
  }

  applyLanguage(currentLang);
}

// ---------------- Load galerie-preview.html (index only) ----------------
async function loadGaleriePreviewComponent() {
  const el = document.getElementById('galeriePreviewContainer');
  if (!el) return;
  await loadPartial('#galeriePreviewContainer', 'galerie-preview.html');
  applyLanguage(currentLang);
}

// ---------------- Load bewertungen-preview.html (index only) ----------------
async function loadBewertungenPreviewComponent() {
  const el = document.getElementById('bewertungenPreviewContainer');
  if (!el) return;
  await loadPartial('#bewertungenPreviewContainer', 'bewertungen-preview.html');
  applyLanguage(currentLang);
}

// ---------------- Bootstrap on DOM ready ----------------
async function init() {
  await Promise.all([
    loadHeaderComponent(),
    loadHeroComponent(),
    loadGeschichteComponent(),
    loadMenuPreviewComponent(),
    loadGaleriePreviewComponent(),
    loadBewertungenPreviewComponent(),
    loadFooterComponent()
  ]);

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

  // Footer year fallback (if footer was inline, not a partial)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applyLanguage(currentLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ---------------- Language Switcher (delegated) ----------------
document.addEventListener('click', (e) => {
  const sw = e.target.closest('.lang-switch');
  if (sw) {
    applyLanguage(currentLang === 'de' ? 'ar' : 'de');
  }
});
