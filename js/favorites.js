window.Akay = window.Akay || {};

(function registerFavoritesModule(ns) {
  const storageKey = ns.FAVORITES_KEY || 'akay_fav_v1';

  const state = {
    countElement: null,
    toggleButton: null,
    onFavoritesChange: null,
    onModeChange: null,
  };

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveFavorites(list) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(new Set(list))));
    } catch (err) {
      /* ignore quota errors */
    }
  }

  function isFavorite(id) {
    return loadFavorites().includes(id);
  }

  function updateCount() {
    if (!state.countElement) return;
    const total = loadFavorites().length;
    state.countElement.textContent = String(total);
  }

  function toggleFavorite(id, button) {
    const favorites = loadFavorites();
    const index = favorites.indexOf(id);

    if (index === -1) {
      favorites.push(id);
      if (button) button.classList.add('active');
    } else {
      favorites.splice(index, 1);
      if (button) button.classList.remove('active');
    }

    saveFavorites(favorites);
    updateCount();

    if (typeof state.onFavoritesChange === 'function') {
      state.onFavoritesChange(favorites.slice());
    }

    return favorites;
  }

  function syncButtonState(button, id) {
    if (!button) return;
    button.classList.toggle('active', isFavorite(id));
  }

  function setFavoritesOnly(value) {
    const nextValue = Boolean(value);
    window.__akay_favorites_only = nextValue;

    if (state.toggleButton) {
      state.toggleButton.setAttribute('aria-pressed', String(nextValue));
      state.toggleButton.classList.toggle('active', nextValue);
    }

    if (typeof state.onModeChange === 'function') {
      state.onModeChange(nextValue);
    }

    if (typeof state.onFavoritesChange === 'function') {
      state.onFavoritesChange(loadFavorites());
    }
  }

  function init(options = {}) {
    state.countElement = options.favCountEl || null;
    state.toggleButton = options.favoritesToggle || null;
    state.onFavoritesChange = options.onFavoritesChange || null;
    state.onModeChange = options.onModeChange || null;

    window.__akay_favorites_only = false;
    updateCount();

    if (state.toggleButton) {
      state.toggleButton.addEventListener('click', () => {
        setFavoritesOnly(!(window.__akay_favorites_only === true));
      });
    }
  }

  ns.favorites = {
    init,
    loadFavorites,
    saveFavorites,
    isFavorite,
    toggleFavorite,
    syncButtonState,
    updateCount,
    setFavoritesOnly,
    isFavoritesOnly: () => window.__akay_favorites_only === true,
  };
})(window.Akay);
