window.Akay = window.Akay || {};

(function registerProductsModule(ns) {
  const productsSource = Array.isArray(ns.PRODUCTS) ? ns.PRODUCTS.slice() : [];
  const utils = ns.utils || {};
  const favorites = ns.favorites || null;

  const esc = utils.esc || ((value) => {
    if (!value && value !== 0) return '';
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  });

  const imageBaseFromPath = utils.imageBaseFromPath || ((path) => {
    if (!path) return '';
    const parts = path.split('/').pop().split('.');
    parts.pop();
    return parts.join('.');
  });

  const buildOptimizedSrcsets = utils.buildOptimizedSrcsets || ((base) => {
    const sizes = [480, 800, 1200, 1600];
    const webp = sizes.map((size) => `images/optimized/${base}-${size}.webp ${size}w`).join(', ');
    const jpg = [800].map((size) => `images/optimized/${base}-${size}.jpg ${size}w`).join(', ');
    return { webp, jpg };
  });

  const state = {
    products: productsSource,
    filtered: productsSource.slice(),
    elements: {
      productGrid: null,
      productsNote: null,
      searchInput: null,
      categoryFilter: null,
      sortSelect: null,
      filterChips: null,
      modal: {
        root: null,
        image: null,
        title: null,
        category: null,
        description: null,
        price: null,
        facts: null,
        closeButton: null,
        backButton: null,
      },
    },
    revealObserver: null,
    searchTimer: null,
    modalFocus: {
      previous: null,
      keydownHandler: null,
    },
  };

  function ensureRevealObserver() {
    if (state.revealObserver) return state.revealObserver;
    state.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const existingDelay = parseFloat(getComputedStyle(element).transitionDelay) || 0;
        element.classList.add('revealed');
        element.classList.remove('pending-reveal');
        setTimeout(() => {
          state.revealObserver.unobserve(element);
        }, Math.max(300, existingDelay * 1000 + 80));
      });
    }, { threshold: 0.12 });
    return state.revealObserver;
  }

  function buildCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category || 'general';

    const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : '4.8';
    const reviewLabel = product.reviews ? `${product.reviews}+` : '120+';
    const originLabel = product.origin || 'Yerli üretim';
    const deliveryLabel = product.delivery || 'Hızlı gönderim';
    const categoryName = product.category || 'Genel';
    const prettyCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    const base = imageBaseFromPath(product.img || '');
    const sets = buildOptimizedSrcsets(base);

    card.innerHTML = `
      <div class="card-actions">
        <button class="card-action-btn card-action-fav" title="Favorilere ekle" aria-label="Favorilere ekle" data-id="${esc(product.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.9-10-8.1C.6 9.9 2 6 5 5c2.1-.7 3.7 0 4.9 1.4C11.3 5 12.9 4.2 15 5c3 1 4.4 4.9 3 7.9-2.5 3.2-10 8.1-10 8.1z"></path></svg>
        </button>
      </div>
      <div class="product-thumb" role="img" aria-label="${esc(product.title)}">
        <div class="thumb-skeleton" aria-hidden="true"></div>
        <picture>
          <source type="image/webp" data-srcset="${sets.webp}">
          <source type="image/jpeg" data-srcset="${sets.jpg}">
          <img class="product-img" data-src="images/optimized/${base}-800.jpg" data-srcset="${sets.jpg}" alt="${esc(product.title)}" loading="lazy" />
        </picture>
      </div>
      <div class="product-content">
        <div class="product-header">
          <span class="badge">${esc(prettyCategory)}</span>
          <div class="product-rating" aria-label="${ratingValue} üzerinden 5 puan">
            <span class="star">★</span>
            <span class="rating-value">${ratingValue}</span>
            <span class="rating-count">(${esc(reviewLabel)})</span>
          </div>
        </div>
        <h3>${esc(product.title)}</h3>
        <p class="short">${esc(product.short)}</p>
        <div class="product-details">
          <span class="product-origin">${esc(originLabel)}</span>
          <span class="product-delivery">${esc(deliveryLabel)}</span>
        </div>
        <div class="product-meta">
          <div class="price">${esc(product.priceLabel)}</div>
          <button class="card-quick-view" aria-label="Hızlı görüntüle">Hızlı Bak</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openProductModal(product.id));

    const quickView = card.querySelector('.card-quick-view');
    if (quickView) {
      quickView.addEventListener('click', (event) => {
        event.stopPropagation();
        openProductModal(product.id);
      });
    }

    const favBtn = card.querySelector('.card-action-fav');
    if (favBtn && favorites) {
      favBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        favorites.toggleFavorite(product.id, favBtn);
      });
      favorites.syncButtonState?.(favBtn, product.id);
    }

    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canTilt) {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform var(--motion-time) var(--motion-ease)';
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * -12;
        const ry = (px - 0.5) * 12;
        const tx = (px - 0.5) * 8;
        const ty = (py - 0.5) * 8;
        card.style.transform = `perspective(900px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    } else {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const mx = (event.clientX - rect.left) / rect.width - 0.5;
        const my = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translate3d(${mx * 4}px, ${my * 4}px, 0)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    }

    card.classList.add('pending-reveal');
    return card;
  }

  function lazyLoadImages() {
    const candidates = document.querySelectorAll('.product-thumb picture, img.product-img[data-src]');
    const observer = new IntersectionObserver((entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        if (target.tagName === 'PICTURE') {
          const sources = target.querySelectorAll('source[data-srcset]');
          sources.forEach((source) => {
            source.srcset = source.getAttribute('data-srcset');
            source.removeAttribute('data-srcset');
          });
          const img = target.querySelector('img.product-img[data-src]');
          if (img) {
            const src = img.getAttribute('data-src');
            const dataSrcset = img.getAttribute('data-srcset');
            if (dataSrcset) img.srcset = dataSrcset;
            if (src) img.src = src;
            img.addEventListener('load', () => {
              const thumb = img.closest('.product-thumb');
              if (!thumb) return;
              thumb.classList.add('loaded');
              const skeleton = thumb.querySelector('.thumb-skeleton');
              if (skeleton) skeleton.remove();
            });
            img.addEventListener('error', () => {
              const thumb = img.closest('.product-thumb');
              if (!thumb) return;
              thumb.style.backgroundColor = '#efe7db';
              const skeleton = thumb.querySelector('.thumb-skeleton');
              if (skeleton) skeleton.remove();
            });
          }
          io.unobserve(target);
          return;
        }

        if (target.tagName === 'IMG') {
          const img = target;
          const src = img.getAttribute('data-src');
          const dataSrcset = img.getAttribute('data-srcset');
          if (dataSrcset) img.srcset = dataSrcset;
          if (src) img.src = src;
          img.addEventListener('load', () => {
            const thumb = img.closest('.product-thumb');
            if (!thumb) return;
            thumb.classList.add('loaded');
            const skeleton = thumb.querySelector('.thumb-skeleton');
            if (skeleton) skeleton.remove();
          });
          img.addEventListener('error', () => {
            const thumb = img.closest('.product-thumb');
            if (!thumb) return;
            thumb.style.backgroundColor = '#efe7db';
            const skeleton = thumb.querySelector('.thumb-skeleton');
            if (skeleton) skeleton.remove();
          });
          io.unobserve(img);
        }
      });
    }, { rootMargin: '240px' });

    candidates.forEach((node) => observer.observe(node));
  }

  function updateProductsNote(items) {
    const note = state.elements.productsNote;
    if (!note) return;

    if (items && items.length > 0) {
      note.style.display = 'none';
      return;
    }

    const favoritesOnly = favorites?.isFavoritesOnly?.() === true;
    if (favoritesOnly) {
      const favs = favorites.loadFavorites();
      if (!favs || favs.length === 0) {
        note.style.display = 'block';
        note.textContent = 'Henüz favorilere eklenmiş ürün yok.';
        return;
      }
      note.style.display = 'block';
      note.textContent = 'Seçtiğiniz filtreye uygun favori ürün bulunamadı.';
      return;
    }

    note.style.display = 'block';
    note.textContent = 'Arama ve filtre kriterlerinize uygun ürün bulunamadı.';
  }

  function renderGrid(items) {
    const grid = state.elements.productGrid;
    if (!grid) return;

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    items.forEach((product) => {
      const card = buildCard(product);
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    updateProductsNote(items);
    lazyLoadImages();

    const observer = ensureRevealObserver();
    requestAnimationFrame(() => {
      const cards = grid.querySelectorAll('.product-card.pending-reveal');
      cards.forEach((cardElement, index) => {
        cardElement.style.transitionDelay = `${index * 48}ms`;
        observer.observe(cardElement);
      });
    });

    ns.animations?.updateCatalogEffect?.();
  }

  function sortProducts(list, mode) {
    const copy = Array.from(list);
    if (mode === 'price-asc') return copy.sort((a, b) => (a.priceNumeric || 0) - (b.priceNumeric || 0));
    if (mode === 'price-desc') return copy.sort((a, b) => (b.priceNumeric || 0) - (a.priceNumeric || 0));
    if (mode === 'title-asc') return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy;
  }

  function filterProducts(query, category) {
    let list = state.products;

    const favoritesOnly = favorites?.isFavoritesOnly?.() === true;
    if (favoritesOnly && favorites) {
      const favs = favorites.loadFavorites();
      list = list.filter((product) => favs.includes(product.id));
    }

    if (category && category !== 'all') {
      list = list.filter((product) => (product.category || 'all') === category);
    }

    if (!query) return list;

    const lowered = query.toLowerCase();
    return list.filter((product) => {
      const inTitle = product.title && product.title.toLowerCase().includes(lowered);
      const inShort = product.short && product.short.toLowerCase().includes(lowered);
      const inDesc = product.desc && product.desc.toLowerCase().includes(lowered);
      return inTitle || inShort || inDesc;
    });
  }

  function applyFilters() {
    const query = state.elements.searchInput ? state.elements.searchInput.value.trim() : '';
    const category = state.elements.categoryFilter ? state.elements.categoryFilter.value : 'all';
    const sortMode = state.elements.sortSelect ? state.elements.sortSelect.value : 'default';

    let results = filterProducts(query, category);
    results = sortProducts(results, sortMode);

    state.filtered = results;
    renderGrid(results);
    return results;
  }

  function scheduleFilter() {
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
      applyFilters();
    }, 160);
  }

  function getCategories() {
    const categories = new Set();
    state.products.forEach((product) => categories.add(product.category || 'other'));
    return Array.from(categories);
  }

  function populateCategoryControls() {
    const select = state.elements.categoryFilter;
    if (!select) return;

    const current = select.value || 'all';
    const categories = getCategories();

    const keep = select.querySelector('option[value="all"]');
    select.innerHTML = '';
    if (keep) select.appendChild(keep);

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      select.appendChild(option);
    });

    select.value = current || 'all';

    const chipsContainer = state.elements.filterChips;
    if (!chipsContainer) return;

    chipsContainer.innerHTML = '';
    const buttons = [];

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.textContent = 'Tümü';
    allButton.dataset.value = 'all';
    allButton.className = 'active';
    chipsContainer.appendChild(allButton);
    buttons.push(allButton);

    categories.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      button.dataset.value = category;
      chipsContainer.appendChild(button);
      buttons.push(button);
    });

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.value || 'all';
        select.value = value;
        buttons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        applyFilters();
      });
    });
  }

  function setupModalFocusTrap() {
    const panel = state.elements.modal.root?.querySelector('.product-modal-panel');
    if (!panel) return;

    state.modalFocus.previous = document.activeElement;
    if (state.elements.modal.closeButton) {
      state.elements.modal.closeButton.focus();
    }

    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(panel.querySelectorAll(selector));
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    state.modalFocus.keydownHandler = (event) => {
      if (event.key !== 'Tab') return;
      if (!nodes.length) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', state.modalFocus.keydownHandler);
  }

  function teardownModalFocusTrap() {
    if (state.modalFocus.keydownHandler) {
      document.removeEventListener('keydown', state.modalFocus.keydownHandler);
      state.modalFocus.keydownHandler = null;
    }

    if (state.modalFocus.previous && typeof state.modalFocus.previous.focus === 'function') {
      state.modalFocus.previous.focus();
    }

    state.modalFocus.previous = null;
  }

  function closeModal() {
    const modalRoot = state.elements.modal.root;
    if (!modalRoot) return;
    teardownModalFocusTrap();
    modalRoot.classList.remove('open');
    modalRoot.setAttribute('aria-hidden', 'true');
  }

  function openProductModal(productId) {
    const modalRoot = state.elements.modal.root;
    if (!modalRoot) return;

    const product = state.products.find((item) => item.id === productId);
    if (!product) return;

    const base = imageBaseFromPath(product.img || '');
    const large = `images/optimized/${base}-1600.webp`;
    const medium = `images/optimized/${base}-1200.webp`;

    if (state.elements.modal.image) {
      state.elements.modal.image.src = large;
      state.elements.modal.image.onerror = function handleError() {
        if (this.src && this.src.indexOf(large) !== -1) {
          this.src = medium;
          return;
        }
        this.onerror = null;
        this.src = product.img || '';
      };
    }

    if (state.elements.modal.title) state.elements.modal.title.textContent = product.title;
    const categoryLabel = (product.category || 'Genel');
    const prettyCategory = categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1);
    const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : '4.8';
    const reviewLabel = product.reviews ? `${product.reviews}+ yorum` : '120+ yorum';

    if (state.elements.modal.category) {
      state.elements.modal.category.textContent = `Kategori: ${prettyCategory} • ${product.origin || 'Yerli üretim'}`;
    }

    if (state.elements.modal.description) state.elements.modal.description.textContent = product.desc;
    if (state.elements.modal.price) {
      state.elements.modal.price.textContent = `${product.priceLabel} | ${ratingValue}/5 (${reviewLabel})`;
    }

    if (state.elements.modal.facts) {
      state.elements.modal.facts.innerHTML = '';
      const factList = [...(product.facts || [])];
      if (product.delivery) factList.unshift(`Teslimat: ${product.delivery}`);
      factList.forEach((fact) => {
        const li = document.createElement('li');
        li.textContent = fact;
        state.elements.modal.facts.appendChild(li);
      });
    }

    modalRoot.classList.add('open');
    modalRoot.setAttribute('aria-hidden', 'false');
    setupModalFocusTrap();
  }

  function bindModalEvents() {
    const modalRoot = state.elements.modal.root;
    if (!modalRoot) return;

    const closeBtn = state.elements.modal.closeButton;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeModal();
      });
    }

    modalRoot.addEventListener('click', (event) => {
      if (event.target === modalRoot) {
        closeModal();
      }
    });

    const backBtn = state.elements.modal.backButton;
    if (backBtn) {
      backBtn.addEventListener('click', (event) => {
        event.preventDefault();
        closeModal();
        const productsAnchor = document.getElementById('products');
        if (productsAnchor) {
          productsAnchor.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalRoot.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function init(options = {}) {
    state.elements.productGrid = options.productGrid || null;
    state.elements.productsNote = options.productsNote || null;
    state.elements.searchInput = options.searchInput || null;
    state.elements.categoryFilter = options.categoryFilter || null;
    state.elements.sortSelect = options.sortSelect || null;
    state.elements.filterChips = options.filterChips || null;

    state.elements.modal = {
      root: options.modal?.root || null,
      image: options.modal?.image || null,
      title: options.modal?.title || null,
      category: options.modal?.category || null,
      description: options.modal?.description || null,
      price: options.modal?.price || null,
      facts: options.modal?.facts || null,
      closeButton: options.modal?.closeButton || null,
      backButton: options.modal?.backButton || null,
    };

    populateCategoryControls();
    bindModalEvents();

    if (state.elements.searchInput) {
      state.elements.searchInput.addEventListener('input', scheduleFilter);
    }

    if (state.elements.categoryFilter) {
      state.elements.categoryFilter.addEventListener('change', scheduleFilter);
    }

    if (state.elements.sortSelect) {
      state.elements.sortSelect.addEventListener('change', scheduleFilter);
    }

    state.filtered = state.products.slice();
    renderGrid(state.filtered);

    return {
      refresh: applyFilters,
      render: renderGrid,
      getFiltered: () => state.filtered.slice(),
    };
  }

  ns.products = {
    init,
    refresh: applyFilters,
    render: renderGrid,
  };
})(window.Akay);
