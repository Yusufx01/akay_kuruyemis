window.Akay = window.Akay || {};

const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function esc(txt) {
  if (!txt && txt !== 0) return '';
  return String(txt)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function imageBaseFromPath(path) {
  if (!path) return '';
  const parts = path.split('/').pop().split('.');
  parts.pop();
  return parts.join('.');
}

function buildOptimizedSrcsets(base) {
  const sizes = [480, 800, 1200, 1600];
  const webp = sizes.map((s) => `images/optimized/${base}-${s}.webp ${s}w`).join(', ');
  const jpg = [800].map((s) => `images/optimized/${base}-${s}.jpg ${s}w`).join(', ');
  return { webp, jpg };
}

function formatCategory(category) {
  if (!category) return 'Genel';
  return category.charAt(0).toUpperCase() + category.slice(1);
}

window.Akay.utils = {
  prefersReducedMotion: prefersReducedMotionQuery,
  esc,
  imageBaseFromPath,
  buildOptimizedSrcsets,
  formatCategory,
};
