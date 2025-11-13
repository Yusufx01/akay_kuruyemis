window.Akay = window.Akay || {};

(function registerAnimationsModule(ns) {
  const prefersReducedMotion = ns.utils?.prefersReducedMotion
    || window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = {
    scrollProgressBar: null,
    siteHeader: null,
    heroMedia: null,
    heroShowcase: null,
    heroVideo: null,
    productsSection: null,
    productGrid: null,
  };

  function updateCatalogEffect() {
    if (!state.productsSection || !state.productGrid) return;

    if (prefersReducedMotion.matches) {
      state.productGrid.style.transform = '';
      state.productGrid.classList.remove('catalog-active');
      return;
    }

    const rect = state.productsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const inView = rect.top < viewportHeight && rect.bottom > 0;

    if (!inView) {
      state.productGrid.style.transform = '';
      state.productGrid.classList.remove('catalog-active');
      return;
    }

    const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
    const translateY = Math.round(progress * 180 - 90);
    state.productGrid.style.transform = `translateY(${translateY}px)`;
    state.productGrid.classList.add('catalog-active');
  }

  function updateScrollEffects() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const doc = document.documentElement;
    const total = (doc.scrollHeight - doc.clientHeight) || 1;
    const progress = Math.min(1, Math.max(0, scrollY / total));

    if (state.scrollProgressBar) {
      state.scrollProgressBar.style.width = `${progress * 100}%`;
    }

    if (state.siteHeader) {
      if (scrollY > 80) state.siteHeader.classList.add('shrink');
      else state.siteHeader.classList.remove('shrink');
    }

    if (!prefersReducedMotion.matches) {
      const heroProgress = Math.min(1, scrollY / 800);

      if (state.heroMedia) {
        state.heroMedia.style.transform = `translateY(${heroProgress * -28}px) scale(${1 + heroProgress * 0.02})`;
      }

      if (state.heroShowcase) {
        state.heroShowcase.style.transform = `translateY(${heroProgress * 18}px)`;
      }
    }

    updateCatalogEffect();
  }

  function initScrollEffects(options = {}) {
    state.scrollProgressBar = options.scrollProgressBar || null;
    state.siteHeader = options.siteHeader || null;
    state.heroMedia = options.heroMedia || null;
    state.heroShowcase = options.heroShowcase || null;
    state.heroVideo = options.heroVideo || null;
    state.productsSection = options.productsSection || null;
    state.productGrid = options.productGrid || null;

    let ticking = false;
    updateScrollEffects();

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateScrollEffects();
        ticking = false;
      });
    });
  }

  let sectionObserver = null;
  function initSectionAnimations() {
    if (sectionObserver) return;

    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('animated');
        sectionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    const targets = document.querySelectorAll('[data-animate]');
    targets.forEach((el) => {
      const delay = el.getAttribute('data-animate-delay');
      if (delay) el.style.transitionDelay = delay;
      sectionObserver.observe(el);
    });
  }

  function initPartnersMarquee(track) {
    if (!track || track.dataset.cloned === 'true') return;
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = 'true';
  }

  function initFaqAccordion(buttons) {
    if (!buttons || buttons.length === 0) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (!expanded) {
          buttons.forEach((other) => {
            if (other === btn) return;
            other.setAttribute('aria-expanded', 'false');
            const otherAnswer = other.nextElementSibling;
            if (otherAnswer) otherAnswer.hidden = true;
          });
        }

        btn.setAttribute('aria-expanded', String(!expanded));
        const answer = btn.nextElementSibling;
        if (!answer) return;
        answer.hidden = expanded;
      });
    });
  }

  function initProcessTimeline(steps) {
    if (!steps || steps.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('active', entry.isIntersecting);
      });
    }, { threshold: 0.5 });

    steps.forEach((step) => observer.observe(step));
  }

  function initHeroVideo(video) {
    if (!video) return;

    if (prefersReducedMotion.matches) {
      video.pause();
      video.removeAttribute('autoplay');
    }

    prefersReducedMotion.addEventListener?.('change', (event) => {
      if (event.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    });
  }

  function animateStats(section) {
    if (!section) return;

    const statNumbers = section.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (Number.isNaN(target)) return;

      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target.toLocaleString('tr-TR');
          clearInterval(timer);
          return;
        }
        el.textContent = Math.floor(current).toLocaleString('tr-TR');
      }, 16);
    });
  }

  function initStats(section) {
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStats(section);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    observer.observe(section);
  }

  function init(options = {}) {
    initScrollEffects(options);
    initSectionAnimations();
    initPartnersMarquee(options.partnersTrack || null);
    initFaqAccordion(options.faqButtons || []);
    initProcessTimeline(options.processSteps || []);
    initHeroVideo(options.heroVideo || null);
    initStats(options.statsSection || null);
  }

  function refreshScrollEffects() {
    updateScrollEffects();
  }

  ns.animations = {
    init,
    updateCatalogEffect,
    refreshScrollEffects,
    initSectionAnimations,
  };
})(window.Akay);
