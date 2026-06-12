/* ---------- Translations ---------- */
const translations = {
  "en-US": {
    "nav.home": "Home",
    "nav.series": "Series",
    "nav.movies": "Movies",
    "nav.tv": "TV Shows",
    "nav.docs": "Documentaries",
    "hero.title": "Yu-Gi-Oh! The Film",
    "hero.description": "Yugi Muto managed to assemble the Millennium Puzzle, he freed an ancient Pharaoh, but one thing he never knew is that, together with the Pharaoh, he freed Anubis, the Egyptian God of Death.",
    "hero.watch": "WATCH NOW",
    "hero.info": "MORE INFORMATION",
    "carousel.title": "Popular on Demo",
    "footer.copy": "Demo project for learning HTML CSS JS - no backend, educational use only."
  },
  "pt-BR": {
    "nav.home": "Início",
    "nav.series": "Séries",
    "nav.movies": "Filmes",
    "nav.tv": "Programas",
    "nav.docs": "Documentários",
    "hero.title": "Yu-Gi-Oh! O Filme",
    "hero.description": "Yugi Muto conseguiu montar o Enigma Milenar, libertou um antigo Faraó, mas algo que ele não sabia é que, junto com o Faraó, libertou Anúbis, o Deus Egípcio da Morte.",
    "hero.watch": "ASSISTIR",
    "hero.info": "MAIS INFORMAÇÕES",
    "carousel.title": "Populares no Demo",
    "footer.copy": "Projeto de demonstração para aprender HTML CSS JS - sem backend, uso educacional."
  },
  "es-ES": {
    "nav.home": "Inicio",
    "nav.series": "Series",
    "nav.movies": "Películas",
    "nav.tv": "Programas",
    "nav.docs": "Documentales",
    "hero.title": "Yu-Gi-Oh! La Película",
    "hero.description": "Yugi Muto logró armar el Rompecabezas del Milenio, liberó a un antiguo Faraón, pero algo que no sabía es que, junto con el Faraón, liberó a Anubis, el Dios Egipcio de la Muerte.",
    "hero.watch": "VER AHORA",
    "hero.info": "MÁS INFORMACIÓN",
    "carousel.title": "Populares en Demo",
    "footer.copy": "Proyecto demo para aprender HTML CSS JS - sin backend, uso educativo."
  }
};

/* ---------- Utilities ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Theme handling ---------- */
const root = document.documentElement;
const themeToggle = $('#themeToggle');

function applyTheme(theme) {
  if (theme === 'light') {
    root.classList.add('light');
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('light');
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('demo_theme', theme);
}

/* Initialize theme from localStorage or default to dark */
const savedTheme = localStorage.getItem('demo_theme') || 'dark';
applyTheme(savedTheme);

/* Toggle theme on button click */
themeToggle.addEventListener('click', () => {
  const isLight = root.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
});

/* ---------- Language handling ---------- */
const langSelect = $('#lang');

function applyLanguage(locale) {
  const dict = translations[locale] || translations['en-US'];
  $$('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  // set html lang attribute for accessibility
  document.documentElement.lang = locale;
  localStorage.setItem('demo_lang', locale);
}

/* Initialize language */
const savedLang = localStorage.getItem('demo_lang') || 'en-US';
langSelect.value = savedLang;
applyLanguage(savedLang);

/* Change language on select */
langSelect.addEventListener('change', (e) => {
  applyLanguage(e.target.value);
});

/* ---------- Simple Carousel Implementation ---------- */
const track = $('#track');
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');

let index = 0;
let itemWidth = 160; // default, will be recalculated
let visibleCount = 5; // default

function recalc() {
  const viewport = track.parentElement.clientWidth;
  // determine visible count based on viewport width
  if (viewport < 700) visibleCount = 2;
  else if (viewport < 1000) visibleCount = 3;
  else visibleCount = 5;

  // compute item width (including gap)
  const gap = 12;
  itemWidth = Math.floor((viewport - gap * (visibleCount - 1)) / visibleCount);
  // apply width to items
  $$('.carousel-item').forEach(li => {
    li.style.flex = `0 0 ${itemWidth}px`;
  });

  // ensure index is within bounds
  const maxIndex = Math.max(0, $$('.carousel-item').length - visibleCount);
  index = Math.min(index, maxIndex);
  updateTrack();
}

/* Move track to current index */
function updateTrack() {
  const gap = 12;
  const x = index * (itemWidth + gap);
  track.style.transform = `translateX(-${x}px)`;
  // update aria-live region or similar if needed
}

/* Prev / Next handlers */
prevBtn.addEventListener('click', () => {
  index = Math.max(0, index - 1);
  updateTrack();
});
nextBtn.addEventListener('click', () => {
  const maxIndex = Math.max(0, $$('.carousel-item').length - visibleCount);
  index = Math.min(maxIndex, index + 1);
  updateTrack();
});

/* Keyboard navigation for carousel track */
track.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
});

/* Touch support */
let startX = 0;
let currentTranslate = 0;
let isDragging = false;

track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});
track.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - startX;
  track.style.transform = `translateX(${ -index * (itemWidth + 12) + -dx }px)`;
});
track.addEventListener('touchend', (e) => {
  isDragging = false;
  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -40) nextBtn.click();
  else if (dx > 40) prevBtn.click();
  else updateTrack();
});

/* Recalculate on resize */
window.addEventListener('resize', () => {
  recalc();
});

/* Initialize carousel after DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  recalc();
  // ensure images have alt and lazy attributes (already set in HTML)
});

/* Accessibility: focus outlines for keyboard users */
document.addEventListener('keyup', (e) => {
  if (e.key === 'Tab') document.body.classList.add('show-focus');
});

/* Small enhancement: persist last viewed slide */
const persistedIndex = parseInt(localStorage.getItem('demo_carousel_index') || '0', 10);
index = persistedIndex;
updateTrack();
window.addEventListener('beforeunload', () => {
  localStorage.setItem('demo_carousel_index', index.toString());
});
