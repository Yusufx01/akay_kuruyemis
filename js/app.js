window.Akay = window.Akay || {};

document.documentElement.classList.remove('no-js');

const appPrefersReducedMotion = window.Akay.utils?.prefersReducedMotion
  || window.matchMedia('(prefers-reduced-motion: reduce)');

if (appPrefersReducedMotion.matches) {
  document.documentElement.classList.add('reduced-motion');
}

appPrefersReducedMotion.addEventListener?.('change', (event) => {
  document.documentElement.classList.toggle('reduced-motion', event.matches);
});

function initBackToTop(button) {
  if (!button) return;

  const toggle = () => {
    if (window.scrollY > 400) button.classList.add('show');
    else button.classList.remove('show');
  };

  toggle();
  window.addEventListener('scroll', toggle);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initNavigation({ menuToggle, siteHeader, mainNav, navClose, mainContent }) {
  if (!menuToggle || !siteHeader || !mainNav) return;

  let navKeydownHandler = null;
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const disableFocusTrap = () => {
    if (!navKeydownHandler) return;
    document.removeEventListener('keydown', navKeydownHandler);
    navKeydownHandler = null;
  };

  const enableFocusTrap = () => {
    const nodes = Array.from(mainNav.querySelectorAll(focusableSelector)).filter((node) => node.tabIndex !== -1);
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    navKeydownHandler = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }

      if (event.key === 'Escape') {
        closeNav();
      }
    };

    document.addEventListener('keydown', navKeydownHandler);
  };

  const openNav = () => {
    siteHeader.classList.add('nav-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('open');
    mainNav.setAttribute('aria-hidden', 'false');
    if (navClose) {
      navClose.classList.add('visible');
      navClose.setAttribute('aria-hidden', 'false');
    }
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');

    const firstLink = mainNav.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const closeNav = () => {
    siteHeader.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('open');
    mainNav.setAttribute('aria-hidden', 'true');
    if (navClose) {
      navClose.classList.remove('visible');
      navClose.setAttribute('aria-hidden', 'true');
    }
    if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
    menuToggle.focus();
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.contains('nav-open');
    if (isOpen) closeNav();
    else openNav();
  });

  if (navClose) {
    navClose.addEventListener('click', (event) => {
      event.preventDefault();
      closeNav();
    });
  }

  const observer = new MutationObserver(() => {
    const open = siteHeader.classList.contains('nav-open');
    if (open) enableFocusTrap();
    else disableFocusTrap();
  });

  observer.observe(siteHeader, { attributes: true, attributeFilter: ['class'] });
}

function initHeroIntro() {
  const heroH1 = document.querySelector('.hero-section h1');
  const heroLead = document.querySelector('.hero-section .lead');
  const heroSublead = document.querySelector('.hero-section .sublead');
  const heroCtas = document.querySelector('.hero-ctas');

  const items = [heroH1, heroLead, heroSublead, heroCtas];
  if (appPrefersReducedMotion.matches) {
    items.forEach((element) => {
      if (!element) return;
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
    return;
  }

  const animations = [
    { element: heroH1, delay: 120, translate: -12 },
    { element: heroLead, delay: 280, translate: 12 },
    { element: heroSublead, delay: 420, translate: 12 },
    { element: heroCtas, delay: 560, translate: 12 },
  ];

  animations.forEach(({ element, delay, translate }) => {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = `translateY(${translate}px)`;
    element.style.transition = 'all .6s var(--motion-ease)';
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  });
}

function initResizeHandler() {
  let timer = null;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      window.Akay.animations?.refreshScrollEffects?.();
    }, 200);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('productGrid');
  const productsNote = document.querySelector('.products-note');
  const searchInput = document.getElementById('productSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');
  const filterChips = document.getElementById('filterChips');

  const modalRoot = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const modalFacts = document.getElementById('modalFacts');
  const modalClose = document.getElementById('modalClose');
  const modalBack = document.getElementById('modalBack');

  const favoritesToggle = document.getElementById('favoritesToggle');
  const favCountEl = document.getElementById('favCount');
  const backToTop = document.getElementById('backToTop');

  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const siteHeader = document.getElementById('site-header');
  const heroMedia = document.querySelector('.hero-media');
  const heroShowcase = document.querySelector('.hero-showcase');
  const heroVideo = document.querySelector('.hero-video');
  const partnersTrack = document.getElementById('partnersTrack');
  const faqButtons = Array.from(document.querySelectorAll('.faq-question'));
  const processSteps = Array.from(document.querySelectorAll('.process-step'));
  const productsSection = document.querySelector('.products-section');
  const statsSection = document.querySelector('.stats-section');

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.querySelector('.main-nav');
  const navClose = document.getElementById('navClose');
  const mainContent = document.getElementById('main');

  const productsApi = window.Akay.products?.init({
    productGrid,
    productsNote,
    searchInput,
    categoryFilter,
    sortSelect,
    filterChips,
    modal: {
      root: modalRoot,
      image: modalImage,
      title: modalTitle,
      category: modalCategory,
      description: modalDescription,
      price: modalPrice,
      facts: modalFacts,
      closeButton: modalClose,
      backButton: modalBack,
    },
  });

  if (!productsApi) {
    console.error('Akay products module yüklenemedi; ürünler görüntülenemiyor.');
  } else {
    const current = productsApi.getFiltered?.() || [];
    if (current.length === 0 && Array.isArray(window.Akay.PRODUCTS) && window.Akay.PRODUCTS.length) {
      productsApi.render(window.Akay.PRODUCTS);
    }
  }

  window.Akay.animations?.init({
    scrollProgressBar,
    siteHeader,
    heroMedia,
    heroShowcase,
    heroVideo,
    productsSection,
    productGrid,
    partnersTrack,
    faqButtons,
    processSteps,
    statsSection,
  });

  window.Akay.favorites?.init({
    favCountEl,
    favoritesToggle,
    onFavoritesChange: () => productsApi?.refresh(),
    onModeChange: () => productsApi?.refresh(),
  });

  initBackToTop(backToTop);
  initNavigation({ menuToggle, siteHeader, mainNav, navClose, mainContent });
  initHeroIntro();
  initResizeHandler();

  try {
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (navClose) {
      navClose.classList.remove('visible');
      navClose.setAttribute('aria-hidden', 'true');
    }
    if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
    if (mainNav) mainNav.setAttribute('aria-hidden', 'true');
    if (productGrid) productGrid.style.transform = '';
  } catch (err) {
    /* ignore initialisation errors */
  }
});
