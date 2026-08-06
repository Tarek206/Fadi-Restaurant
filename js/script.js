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

// ---------------- Header: active link, scroll state, mobile nav ----------------
function initHeader() {
  const headerEl = document.getElementById('siteHeader');
  if (!headerEl) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  headerEl.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPath) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });

  const onScroll = () => headerEl.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
}

// ---------------- Intro video (plays once per browser session) ----------------
const INTRO_SEEN_KEY = 'schami-intro-seen';

function initIntroVideo() {
  if (sessionStorage.getItem(INTRO_SEEN_KEY)) return;
  sessionStorage.setItem(INTRO_SEEN_KEY, '1');

  const overlay = document.createElement('div');
  overlay.className = 'intro-video-overlay';
  overlay.innerHTML =
    '<video class="intro-video" src="assets/intro.mp4" autoplay muted playsinline></video>' +
    '<button type="button" class="intro-skip" data-ar="تخطي">Überspringen</button>';
  document.body.prepend(overlay);
  document.body.classList.add('intro-active');

  const video = overlay.querySelector('.intro-video');
  const skipBtn = overlay.querySelector('.intro-skip');
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('is-hiding');
    document.body.classList.remove('intro-active');
    setTimeout(() => overlay.remove(), 650);
  };

  video.addEventListener('ended', dismiss);
  video.addEventListener('error', dismiss);
  skipBtn.addEventListener('click', dismiss);
}

// ---------------- Bootstrap ----------------
function init() {
  initIntroVideo();
  initHeader();

  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.menu-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = document.querySelector(`.menu-panel[data-panel="${btn.dataset.tab}"]`);
      if (target) target.classList.add('is-active');
    });
  });

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
