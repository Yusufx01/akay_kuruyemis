/* ==========================================================
  script.js — Akay Kuruyemiş Tanıtım Sitesi
  İşlevler:
   - Dinamik ürün yükleme (10+ ürün)
   - Arama ve kategori filtresi
   - Ürün detay modalı (görsel, açıklama, fiyat, teknik bilgiler)
   - Görsel lazy-load (basit)
  - Animasyon tetikleme (özel kaydırma efektleri)
   - Responsive menü aç/kapat ve erişilebilirlik iyileştirmeleri
  Not: Bu dosya, önceki kodların üzerine ekleme mantığıyla yazıldı.
  ========================================================== */

/* -------------------------
  VERİ: ÜRÜN LİSTESİ
  ------------------------- */
const PRODUCTS = [
  {
    id: "badem",
    title: "Kavrulmuş Badem",
    category: "kuruyemis",
    priceLabel: "₺85 / 250g",
    priceNumeric: 85,
    short: "Doğal, tuzsuz ve taptaze badem.",
    desc: "Özenle seçilmiş bademlerimiz, hafif kavrulup doğal lezzeti korunacak şekilde paketlenir. Kahvaltı ve atıştırmalıklar için ideal.",
  img: "images/badem.jpg",
    facts: ["Kaynak: Ege", "Tazelik: 7 gün içinde paketlenmiş", "Alerjen: Evet"]
  },
  {
    id: "findik",
    title: "Giresun Fındığı",
    category: "kuruyemis",
    priceLabel: "₺90 / 250g",
    priceNumeric: 90,
    short: "Karadeniz’in en lezzetli fındıkları.",
    desc: "Giresun bölgesinden seçilen fındıklarımız, çekirdek kalite kontrolünden geçer. Tatlı tariflerde ve atıştırmalıkta mükemmel.",
  img: "images/findik.jpg",
    facts: ["Kaynak: Giresun", "Tazelik: 10 gün içinde paketlenmiş", "Alerjen: Evet"]
  },
  {
    id: "fistik",
    title: "Antep Fıstığı",
    category: "cekirdek",
    priceLabel: "₺120 / 250g",
    priceNumeric: 120,
    short: "Gaziantep’ten gelen birinci kalite fıstık.",
    desc: "Doğal yöntemlerle kurutulmuş Antep fıstıkları. Tatlı ve tuzlu mutfaklar için yüksek kalite.",
  img: "images/fistik.jpg",
    facts: ["Kaynak: Gaziantep", "Tazelik: 14 gün içinde paketlenmiş", "Alerjen: Evet"]
  },
  {
    id: "ceviz",
    title: "İç Ceviz",
    category: "kuruyemis",
    priceLabel: "₺70 / 250g",
    priceNumeric: 70,
    short: "Sağlıklı ve taptaze iç ceviz.",
    desc: "Protein ve sağlıklı yağ deposu olan cevizlerimiz tazeliği korunarak paketlenir. Tatlı ve yemeklerde kullanılmaya uygundur.",
  img: "images/ceviz.jpg",
    facts: ["Kaynak: İç Anadolu", "Tazelik: 12 gün içinde paketlenmiş", "Alerjen: Evet"]
  },
  {
    id: "kaju",
    title: "Kaju",
    category: "cekirdek",
    priceLabel: "₺95 / 250g",
    priceNumeric: 95,
    short: "En kaliteli kaju fıstığı.",
    desc: "Kaju fıstıklarımız, tat ve doku açısından premium sınıftadır. Atıştırmalık ve yemeklerde çok yönlü kullanım.",
  img: "images/kaju.jpg",
    facts: ["Kaynak: Tropik", "Tazelik: 20 gün içinde paketlenmiş", "Alerjen: Evet"]
  },
  {
    id: "fistik-yerli",
    title: "Yer Fıstığı",
    category: "cekirdek",
    priceLabel: "₺50 / 250g",
    priceNumeric: 50,
    short: "Kavrulmuş ve çıtır çıtır yer fıstığı.",
    desc: "Küçük parti kavurma ile çıtırlık korunur. Atıştırmalık keyfi için lezzetli bir seçenek.",
  img: "images/fistik-yerli.jpg",
    facts: ["Kaynak: İç Anadolu", "Tazelik: 8 gün içinde paketlenmiş", "Alerjen: Evet"]
  },
  {
    id: "karisik-1",
    title: "Karışık Kuruyemiş A",
    category: "karisik",
    priceLabel: "₺150 / 250g",
    priceNumeric: 150,
    short: "Badem, fındık, fıstık ve ceviz karışımı.",
    desc: "En sevilen lezzetlerin karışımı; dengeli tat ve doku sunar. Parti ve misafirler için ideal.",
  img: "images/karisik-1.jpg",
    facts: ["Karışım: Badem, Fındık, Fıstık, Ceviz", "Tazelik: 7 gün", "Ambalaj: Vakumlu"]
  },
  {
    id: "karisik-2",
    title: "Karışık Kuruyemiş B",
    category: "karisik",
    priceLabel: "₺170 / 250g",
    priceNumeric: 170,
    short: "Özel harman karışım, kuruyemiş şöleni.",
    desc: "Özel baharat ve az tuz ile harmanlanmış seçkin karışım. Atıştırmalık için hazırlanmıştır.",
  img: "images/karisik-2.jpg",
    facts: ["Karışım: Kaju, Antep, Badem", "Tazelik: 5 gün", "Ambalaj: Hava korumalı"]
  },
  {
    id: "badem-tuzlu",
    title: "Tuzlu Kavrulmuş Badem",
    category: "kuruyemis",
    priceLabel: "₺88 / 250g",
    priceNumeric: 88,
    short: "Hafif tuzlu özel kavurma badem.",
    desc: "Hafif tuz dengesi ile kavrulmuş bademlerimiz, çay saatleri ve atıştırmalıklar için idealdir.",
  img: "images/badem.jpg",
    facts: ["Tuz: Deniz tuzu", "Tazelik: 6 gün", "Ambalaj: Kilitli poşet"]
  },
  {
    id: "cekirdek-karisik",
    title: "Çekirdek Karışık (Ay çekirdeği vb.)",
    category: "cekirdek",
    priceLabel: "₺60 / 250g",
    priceNumeric: 60,
    short: "Ay çekirdeği, kabak çekirdeği karışımı.",
    desc: "Çerez keyfi için doğal ve kavrulmuş çekirdekler harmanlanmıştır. Spor sonrası atıştırmalık olarak tercih edilir.",
  img: "images/karisik-2.jpg",
    facts: ["Karışım: Ay çekirdeği, Kabak çekirdeği", "Tuz: Az", "Ambalaj: Kilitli"]
  }
];

/* -------------------------
  DOM: element referansları
  ------------------------- */
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const filterChips = document.getElementById('filterChips');

const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalFacts = document.getElementById('modalFacts');
const modalCloseBtn = document.getElementById('modalClose');
const modalBack = document.getElementById('modalBack');
const backToTop = document.getElementById('backToTop');
const favoritesToggle = document.getElementById('favoritesToggle');
const favCountEl = document.getElementById('favCount');
// geliştirilmiş UI referansları
const scrollProgress = document.getElementById('scrollProgress');
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
const siteHeader = document.getElementById('site-header');
const heroBg = document.querySelector('.hero-bg');
// products section used for the catalog scroll effect
const productsSection = document.querySelector('.products-section');
const mainContent = document.getElementById('main');
let sectionObserver = null;
const productsNote = document.querySelector('.products-note');

/* -------------------------
  YARDIMCI: Güvenli metin kaçış fonksiyonu
  ------------------------- */
function esc(txt){
  if(!txt && txt !== 0) return '';
  return String(txt).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

/* -------------------------
  Helper: derive optimized filenames and srcsets
  ------------------------- */
function imageBaseFromPath(p){
  if(!p) return '';
  const parts = p.split('/').pop().split('.');
  parts.pop(); // remove extension
  return parts.join('.');
}

function buildOptimizedSrcsets(base){
  // expects optimized files under images/optimized with suffixes -480, -800, -1200, -1600
  const sizes = [480,800,1200,1600];
  const webp = sizes.map(s => `images/optimized/${base}-${s}.webp ${s}w`).join(', ');
  const jpg = [800].map(s => `images/optimized/${base}-${s}.jpg ${s}w`).join(', ');
  return {webp, jpg};
}

/* -------------------------
  RENDER: ürün kartı işaretlemesi (markup)
  ------------------------- */
function renderProductCard(p){
  const div = document.createElement('article');
  div.className = 'product-card';
  div.setAttribute('data-id', p.id);
  div.setAttribute('data-category', p.category || 'general');

  // card inner markup: use data-bg for progressive lazy-loading and add action overlays
  div.innerHTML = `
    <div class="card-actions">
      <button class="card-action-btn card-action-fav" title="Favorilere ekle" aria-label="Favorilere ekle" data-id="${esc(p.id)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.9-10-8.1C.6 9.9 2 6 5 5c2.1-.7 3.7 0 4.9 1.4C11.3 5 12.9 4.2 15 5c3 1 4.4 4.9 3 7.9-2.5 3.2-10 8.1-10 8.1z"></path></svg>
      </button>
    </div>
    <div class="product-thumb" role="img" aria-label="${esc(p.title)}">
      <div class="thumb-skeleton" aria-hidden="true"></div>
      ${(()=>{
        const base = imageBaseFromPath(p.img || '');
        const sets = buildOptimizedSrcsets(base);
        // note: we use data-srcset on <source> and data-src on <img> for lazy activation
        return `
        <picture>
          <source type="image/webp" data-srcset="${sets.webp}">
          <source type="image/jpeg" data-srcset="${sets.jpg}">
          <img class="product-img" data-src="images/optimized/${base}-800.jpg" data-srcset="${sets.jpg}" alt="${esc(p.title)}" loading="lazy" />
        </picture>
        `;
      })()}
    </div>
    <div class="product-content">
      <h3>${esc(p.title)}</h3>
      <p class="short">${esc(p.short)}</p>
      <div class="product-meta">
        <div class="product-badges">
          <span class="badge">${esc(p.category)}</span>
        </div>
        <div class="price">${esc(p.priceLabel)}</div>
      </div>
      <button class="card-quick-view" aria-label="Hızlı görüntüle">Hızlı Bak</button>
    </div>
  `;

  // tıklama davranışı: detay modalını aç (zengin içerik)
  div.addEventListener('click', ()=> openProductModal(p.id));

  // hızlı görüntüleme butonu modalı açmalı, karttaki örüntüye iki kez tetiklememeli
  const quick = div.querySelector('.card-quick-view');
  if(quick){ quick.addEventListener('click', (e)=>{ e.stopPropagation(); openProductModal(p.id); }); }

  // favorilere ekleme butonu
  const favBtn = div.querySelector('.card-action-fav');
  if(favBtn){
    const id = favBtn.getAttribute('data-id');
    favBtn.addEventListener('click', (e)=>{ e.stopPropagation(); toggleFavorite(id, favBtn); });
    if(isFavorite(p.id)) favBtn.classList.add('active');
  }

  // hafif hover paralaksı pointermove ile
  // 3D tilt efekti pointer destekli cihazlarda (touch / küçük ekranlarda devre dışı)
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(canTilt){
    div.style.transformStyle = 'preserve-3d';
    div.style.transition = 'transform var(--motion-time) var(--motion-ease)';
    div.addEventListener('pointermove', e=>{
      const rect = div.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = ( (py - 0.5) * -12 ); // rotateX
      const ry = ( (px - 0.5) * 12 );  // rotateY
      const tx = (px - 0.5) * 8;
      const ty = (py - 0.5) * 8;
      div.style.transform = `perspective(900px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    div.addEventListener('pointerleave', ()=> {
      div.style.transform = '';
    });
  } else {
    // fallback subtle translate for touch devices (or none)
    div.addEventListener('pointermove', e=>{
      const rect = div.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      div.style.transform = `translate3d(${mx * 4}px, ${my * 4}px, 0)`;
    });
    div.addEventListener('pointerleave', ()=> { div.style.transform = ''; });
  }

  // reveal (görünürlük) gözlemcisi için işaretle
  div.classList.add('pending-reveal');

  return div;
}

/* -------------------------
  INIT: ürün ızgarasını (grid) ürünlerle doldur
  ------------------------- */
function initProductGrid(items){
  productGrid.innerHTML = ''; // keep first time baseline
  const frag = document.createDocumentFragment();
  items.forEach(p=>{
    const card = renderProductCard(p);
    frag.appendChild(card);
  });
  productGrid.appendChild(frag);
  // update the informational note below the grid
  try{ updateProductsNote(items); }catch(e){}
  // lazy-load <img> kaynaklarını başlat
  lazyLoadImages();
  // observe for reveal animations
  requestAnimationFrame(()=>{
    const cards = document.querySelectorAll('.product-card.pending-reveal');
  // girişleri hafif geciktir (stagger) — premium animasyon hissi
    cards.forEach((c,i)=>{
      c.style.transitionDelay = (i * 48) + 'ms';
      revealObserver.observe(c);
    });
  });
  // yeni kartlar yüklendikten sonra dikey kaydırma efektini güncelle
  if(typeof updateCatalogEffect === 'function'){
    requestAnimationFrame(()=> updateCatalogEffect());
  }
}

function updateProductsNote(items){
  if(!productsNote) return;
  // when there are products to show, hide the note
  if(items && items.length > 0){ productsNote.style.display = 'none'; return; }

  // no items: decide message based on favorites-only mode
  if(window.__akay_favorites_only){
    // check if any favorites exist at all
    const favs = loadFavorites();
    if(!favs || favs.length === 0){
      productsNote.style.display = 'block';
      productsNote.textContent = 'Henüz favorilere eklenmiş ürün yok.';
      return;
    }
    // there are favorites but none match current filters
    productsNote.style.display = 'block';
    productsNote.textContent = 'Seçtiğiniz filtreye uygun favori ürün bulunamadı.';
    return;
  }

  // default: no results for search/filter
  productsNote.style.display = 'block';
  productsNote.textContent = 'Aradığınız kriterlere uygun ürün bulunamadı.';
}

/* -------------------------
  FİLTRE & ARAMA
  ------------------------- */
function filterProducts(query, category){
  query = (query || '').trim().toLowerCase();
  category = (category || 'all');

  const filtered = PRODUCTS.filter(p=>{
    const matchCategory = category === 'all' ? true : (p.category === category);
    const matchQuery = !query ? true :
      (p.title.toLowerCase().includes(query) || p.short.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    return matchCategory && matchQuery;
  });
  return filtered;
}

/* arama ve filtre girişini debounce ile bağla */
let searchTimer = null;
function handleSearchInput(){
  clearTimeout(searchTimer);
  searchTimer = setTimeout(()=>{
    const q = searchInput.value;
    const cat = categoryFilter.value;
    let results = filterProducts(q, cat);
    // if favorites-only mode is active, filter results to favorites
    if(window.__akay_favorites_only){
      const favs = loadFavorites();
      results = results.filter(r => favs.includes(r.id));
    }
    // apply sorting
    const sortMode = (sortSelect && sortSelect.value) ? sortSelect.value : 'default';
    results = sortProducts(results, sortMode);
    initProductGrid(results);
  }, 160);
}

/* event listeners */
if(searchInput) searchInput.addEventListener('input', handleSearchInput);
if(categoryFilter) categoryFilter.addEventListener('change', handleSearchInput);

/* -------------------------
  ÜRÜN MODALINI AÇMA
  ------------------------- */
function openProductModal(productId){
  const p = PRODUCTS.find(x => x.id === productId);
  if(!p) return;
  // prefer optimized WebP for modal if available
  const base = imageBaseFromPath(p.img || '');
  const webpLarge = `images/optimized/${base}-1600.webp`;
  const webpMedium = `images/optimized/${base}-1200.webp`;
  modalImage.src = webpLarge;
  modalImage.onerror = function(){
    // fallback to medium webp then original
    if(this.src && this.src.indexOf(webpLarge) !== -1) { this.src = webpMedium; return; }
    this.onerror = null;
    this.src = p.img || '';
  };
  modalTitle.textContent = p.title;
  modalCategory.textContent = `Kategori: ${p.category}`;
  modalDescription.textContent = p.desc;
  modalPrice.textContent = p.priceLabel;

  // facts list
  modalFacts.innerHTML = '';
  (p.facts || []).forEach(f=>{
    const li = document.createElement('li');
    li.textContent = f;
    modalFacts.appendChild(li);
  });

  // show modal
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  // setup focus trap for accessibility
  setupModalFocusTrap();
}

/* MODAL KAPATMA */
modalCloseBtn.addEventListener('click', ()=> {
  teardownModalFocusTrap();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
});
modal.addEventListener('click', (e)=>{
  if(e.target === modal){
    teardownModalFocusTrap();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
});

/* Modal içindeki geri butonu */
if(modalBack) modalBack.addEventListener('click', (e)=>{
  // this simply closes the modal and scrolls to products
  e.preventDefault();
  teardownModalFocusTrap();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
});

/* -------------------------
  ARKA PLAN GÖRSELLERİNİ LAZY LOAD ETME
  ------------------------- */
function lazyLoadBackgrounds(){
  // legacy: kept for backward compatibility but new loader uses <img>
}

function lazyLoadImages(){
  // Observe product images and their <picture> sources (we use data-src / data-srcset for lazy activation)
  const candidates = document.querySelectorAll('.product-thumb picture, img.product-img[data-src]');
  const io = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      // if the target is a <picture>, activate its sources
      const target = entry.target;
      if(target.tagName === 'PICTURE'){
        const sources = target.querySelectorAll('source[data-srcset]');
        sources.forEach(s => { s.srcset = s.getAttribute('data-srcset'); s.removeAttribute('data-srcset'); });
        const img = target.querySelector('img.product-img[data-src]');
        if(img){
          const src = img.getAttribute('data-src');
          const ds = img.getAttribute('data-srcset');
          if(ds) img.srcset = ds;
          if(src) img.src = src;
          img.addEventListener('load', ()=>{ const thumb = img.closest('.product-thumb'); if(thumb){ thumb.classList.add('loaded'); const sk = thumb.querySelector('.thumb-skeleton'); if(sk) sk.remove(); } });
          img.addEventListener('error', ()=>{ const thumb = img.closest('.product-thumb'); if(thumb){ thumb.style.backgroundColor = '#efe7db'; const sk = thumb.querySelector('.thumb-skeleton'); if(sk) sk.remove(); } });
        }
        observer.unobserve(target);
        return;
      }

      // otherwise it's likely an <img> fallback
      if(target.tagName === 'IMG'){
        const img = target;
        const src = img.getAttribute('data-src');
        const ds = img.getAttribute('data-srcset');
        if(ds) img.srcset = ds;
        if(src) img.src = src;
        img.addEventListener('load', ()=>{ const thumb = img.closest('.product-thumb'); if(thumb){ thumb.classList.add('loaded'); const sk = thumb.querySelector('.thumb-skeleton'); if(sk) sk.remove(); } });
        img.addEventListener('error', ()=>{ const thumb = img.closest('.product-thumb'); if(thumb){ thumb.style.backgroundColor = '#efe7db'; const sk = thumb.querySelector('.thumb-skeleton'); if(sk) sk.remove(); } });
        observer.unobserve(img);
      }
    });
  }, {rootMargin:'240px'});
  candidates.forEach(n=> io.observe(n));
}
  const FAVORITES_KEY = 'akay_fav_v1';
  function loadFavorites(){
    try{ return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }catch(e){ return []; }
  }
function saveFavorites(list){
  try{ localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); }catch(e){}
}
function isFavorite(id){
  const fav = loadFavorites(); return fav.includes(id);
}
function toggleFavorite(id, btn){
  const fav = loadFavorites();
  const idx = fav.indexOf(id);
  if(idx === -1){ fav.push(id); if(btn) btn.classList.add('active'); }
  else { fav.splice(idx,1); if(btn) btn.classList.remove('active'); }
  saveFavorites(fav);
  // update visible fav count and refresh grid if we are in favorites-only mode
  updateFavCount();
  if(window.__akay_favorites_only){ handleSearchInput(); }
}

function updateFavCount(){
  try{
    const fav = loadFavorites();
    if(favCountEl) { favCountEl.textContent = String(fav.length); }
    // also update toggle state appearance if present
    if(favoritesToggle){
      const pressed = favoritesToggle.getAttribute('aria-pressed') === 'true';
      // keep the visual count as well
    }
  }catch(e){}
}

/* -------------------------
  SIRALAMA (SORTING)
  ------------------------- */
function sortProducts(items, mode){
  const copy = Array.from(items);
  if(mode === 'price-asc') return copy.sort((a,b)=> (a.priceNumeric||0) - (b.priceNumeric||0));
  if(mode === 'price-desc') return copy.sort((a,b)=> (b.priceNumeric||0) - (a.priceNumeric||0));
  if(mode === 'title-asc') return copy.sort((a,b)=> a.title.localeCompare(b.title));
  return copy;
}

/* -------------------------
  REVEAL GÖZLEMCİSİ (IntersectionObserver)
  ------------------------- */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      const el = ent.target;
      // slight extra delay honor if set inline
      const existingDelay = parseFloat(getComputedStyle(el).transitionDelay) || 0;
      // apply revealed class to trigger CSS transition
      el.classList.add('revealed');
      el.classList.remove('pending-reveal');
      // clean up observer after a short timeout to allow transition to begin
      setTimeout(()=>{ revealObserver.unobserve(el); }, Math.max(300, existingDelay * 1000 + 80));
    }
  });
},{threshold:0.12});

/* kaydırma ile tetiklenen efektler: ilerleme çubuğu, header küçültme, hero paralaks */
function updateScrollEffects(){
  const scrollY = window.scrollY || window.pageYOffset;
  const doc = document.documentElement;
  const total = (doc.scrollHeight - doc.clientHeight) || 1;
  const pct = Math.min(1, Math.max(0, scrollY / total));
  if(scrollProgressBar) scrollProgressBar.style.width = (pct * 100) + '%';

  // header shrink threshold
  if(siteHeader){
    if(scrollY > 80) siteHeader.classList.add('shrink'); else siteHeader.classList.remove('shrink');
  }

  // hero parallax (subtle)
  if(heroBg){
    const t = Math.min(1, scrollY / 800);
    heroBg.style.transform = `translateY(${t * -28}px) scale(${1 - t * 0.03})`;
  }

  // katalog bölümü için dikey kaydırma efekti (parallax hissi)
  if(typeof updateCatalogEffect === 'function') updateCatalogEffect();
}

// Kaydırma olayları için RAF ile throttle uygulama
let __akay_ticking = false;
window.addEventListener('scroll', ()=>{
  if(!__akay_ticking){
    window.requestAnimationFrame(()=>{ updateScrollEffects(); __akay_ticking = false; });
    __akay_ticking = true;
  }
});

// başlangıç çalıştırması
updateScrollEffects();

/* -------------------------
  KATALOG DİKEY KAYDIRMA EFEKTI
  Sayfa aşağı kaydırıldıkça ürün ızgarası yukarıdan aşağıya doğru hareket eder (parallax etkisi).
  ------------------------- */
function updateCatalogEffect(){
  if(!productsSection || !productGrid) return;
  const rect = productsSection.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // bölüm görünür durumda mı kontrol et
  const inView = rect.top < vh && rect.bottom > 0;

  if(inView){
    // sayfa kaydırıldıkça 0 -> 1 arası ilerleme hesapla
    // bölüm ekranın üstüne gelirken 0, tamamen görünür hale gelirken 1'e yaklaşır
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    // dikey hareket: yukarıdan başlayıp aşağı doğru hareket edecek şekilde translateY kullan
    const ty = Math.round(progress * 180 - 90); // -90'dan +90'a doğru hareket (toplam 180px aralık - daha dramatik)
    productGrid.style.transform = `translateY(${ty}px)`;
    productGrid.classList.add('catalog-active');
  } else {
    // bölüm görünürde değilse dönüşümü sıfırla
    productGrid.style.transform = '';
    productGrid.classList.remove('catalog-active');
  }
}

/* -------------------------
  SCROLL ANIMASYONLARI: data-animate kullanan bloklar
  ------------------------- */
function initSectionAnimations(){
  if(sectionObserver) return;
  sectionObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('animated');
      sectionObserver.unobserve(entry.target);
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  const targets = document.querySelectorAll('[data-animate]');
  targets.forEach(el=>{
    const delay = el.getAttribute('data-animate-delay');
    if(delay) el.style.transitionDelay = delay;
    sectionObserver.observe(el);
  });
}

/* -------------------------
  STATS SAYAÇ ANIMASYONU
  ------------------------- */
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  
  statNumbers.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString('tr-TR');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('tr-TR');
      }
    }, 16);
  });
}

// Stats bölümü görünüme girdiğinde animasyonu başlat
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

/* -------------------------
  SAYFANIN BAŞINA DÖN (back-to-top)
  ------------------------- */
if(backToTop){
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
}

// favoriler modu toggle işlemleri
window.__akay_favorites_only = false;
if(favoritesToggle){
  // sayaçı başlat
  updateFavCount();
  favoritesToggle.addEventListener('click', (e)=>{
    const cur = favoritesToggle.getAttribute('aria-pressed') === 'true';
    const next = !cur;
    favoritesToggle.setAttribute('aria-pressed', String(next));
    window.__akay_favorites_only = next;
    // update visual
    if(next) favoritesToggle.classList.add('active'); else favoritesToggle.classList.remove('active');
    // re-run search to apply favorites-only filter
    handleSearchInput();
  });
}

/* -------------------------
  MODAL ODAK TUZAĞI (focus trap) — erişilebilirlik
  ------------------------- */
let __akay_prev_focused = null;
let __akay_modal_keydown = null;
function setupModalFocusTrap(){
  const panel = document.querySelector('.product-modal-panel');
  if(!panel) return;
  __akay_prev_focused = document.activeElement;
  // focus close button
  modalCloseBtn.focus();
  const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const nodes = Array.from(panel.querySelectorAll(focusableSelector));
  const first = nodes[0];
  const last = nodes[nodes.length-1];
  __akay_modal_keydown = function(e){
    if(e.key === 'Tab'){
      if(nodes.length === 0){ e.preventDefault(); return; }
      if(e.shiftKey){ // backwards
        if(document.activeElement === first){
          e.preventDefault(); last.focus();
        }
      } else { // forwards
        if(document.activeElement === last){
          e.preventDefault(); first.focus();
        }
      }
    }
  };
  document.addEventListener('keydown', __akay_modal_keydown);
}

function teardownModalFocusTrap(){
  if(__akay_modal_keydown) document.removeEventListener('keydown', __akay_modal_keydown);
  __akay_modal_keydown = null;
  if(__akay_prev_focused && typeof __akay_prev_focused.focus === 'function') __akay_prev_focused.focus();
  __akay_prev_focused = null;
}

/* -------------------------
  MENÜ AÇ/KAPAT (MOBİL)
  ------------------------- */
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.querySelector('.main-nav');
const navClose = document.getElementById('navClose');
if(menuToggle){
  // toggle a semantic class on the header; CSS handles the fullscreen overlay
  menuToggle.addEventListener('click', ()=>{
    const isOpen = siteHeader.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    // ana içeriği ekran okuyucular için gizle/ göster (overlay açıkken içerik erişilemez olsun)
    try{ if(mainContent) mainContent.setAttribute('aria-hidden', String(isOpen)); }catch(e){}
    // nav elementinin screen-reader görünürlüğünü ayarla
    try{ if(mainNav) mainNav.setAttribute('aria-hidden', String(!isOpen)); }catch(e){}
    // toggle a small visual state for the toggle button
    menuToggle.classList.toggle('open', isOpen);
    // set focus to first nav link when opening for accessibility
    // göster/gizle kapatma butonunu güncelle
    if(navClose) { navClose.classList.toggle('visible', isOpen); navClose.setAttribute('aria-hidden', String(!isOpen)); }
    if(isOpen){
      const firstLink = mainNav.querySelector('a');
      if(firstLink) firstLink.focus();
    } else {
      // return focus to the toggle when closed
      menuToggle.focus();
    }
  });
}
// navClose butonu varsa overlay'i kapatması için bağla
if(navClose){
  navClose.addEventListener('click', ()=>{
    siteHeader.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.classList.remove('open');
    // gizle kapatma butonunu ve geri odaklan
    if(navClose) { navClose.classList.remove('visible'); navClose.setAttribute('aria-hidden','true'); }
    try{ if(mainContent) mainContent.setAttribute('aria-hidden', 'false'); }catch(e){}
    try{ if(mainNav) mainNav.setAttribute('aria-hidden', 'false'); }catch(e){}
    menuToggle.focus();
  });
}

// Basit focus-trap: nav açıldığında Tab ile dışarı çıkmayı engelle ve döngü sağla
let __nav_keydown = null;
function enableNavFocusTrap(){
  if(!mainNav) return;
  const nodes = Array.from(mainNav.querySelectorAll('a, button')).filter(n=>n.tabIndex !== -1);
  if(nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  __nav_keydown = function(e){
    if(e.key === 'Tab'){
      if(e.shiftKey){
        if(document.activeElement === first){ e.preventDefault(); last.focus(); }
      } else {
        if(document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    }
    if(e.key === 'Escape'){
      // ESC ile menüyü kapat
      siteHeader.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded','false');
      menuToggle.classList.remove('open');
      menuToggle.focus();
    }
  };
  document.addEventListener('keydown', __nav_keydown);
}
function disableNavFocusTrap(){ if(__nav_keydown){ document.removeEventListener('keydown', __nav_keydown); __nav_keydown = null; } }

// gözlem: nav-open sınıfı değiştiğinde focus trap'ı aç/kapat
const headerObserver = new MutationObserver(m=>{
  const open = siteHeader.classList.contains('nav-open');
  if(open) enableNavFocusTrap(); else disableNavFocusTrap();
});
if(siteHeader) headerObserver.observe(siteHeader, { attributes:true, attributeFilter:['class'] });

/* -------------------------
  SAYFA BAŞLAT: başlangıçta tüm ürünleri render et
  ------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  // başlangıçta ürünleri render et
  initProductGrid(PRODUCTS);
  initSectionAnimations();

  // başlangıç ARIA durumlarını güvence altına al
  try{
    if(menuToggle) menuToggle.setAttribute('aria-expanded','false');
    if(navClose){ navClose.classList.remove('visible'); navClose.setAttribute('aria-hidden','true'); }
    if(mainContent) mainContent.setAttribute('aria-hidden','false');
    if(mainNav) mainNav.setAttribute('aria-hidden','false');
    if(productGrid) productGrid.style.transform = '';
  }catch(e){}

  // hero için küçük giriş animasyonu
  const heroH1 = document.querySelector('.hero-section h1');
  const heroLead = document.querySelector('.hero-section .lead');
  const heroSublead = document.querySelector('.hero-section .sublead');
  const heroCtas = document.querySelector('.hero-ctas');
  if(heroH1){
    setTimeout(()=>{ heroH1.style.opacity = '1'; heroH1.style.transform = 'translateY(0)'; }, 100);
  }
  if(heroLead){
    heroLead.style.opacity = '0';
    heroLead.style.transform = 'translateY(12px)';
    heroLead.style.transition = 'all .6s var(--motion-ease)';
    setTimeout(()=>{ heroLead.style.opacity = '1'; heroLead.style.transform = 'translateY(0)'; }, 280);
  }
  if(heroSublead){
    heroSublead.style.opacity = '0';
    heroSublead.style.transform = 'translateY(12px)';
    heroSublead.style.transition = 'all .6s var(--motion-ease)';
    setTimeout(()=>{ heroSublead.style.opacity = '1'; heroSublead.style.transform = 'translateY(0)'; }, 420);
  }
  if(heroCtas){
    heroCtas.style.opacity = '0';
    heroCtas.style.transform = 'translateY(12px)';
    heroCtas.style.transition = 'all .6s var(--motion-ease)';
    setTimeout(()=>{ heroCtas.style.opacity = '1'; heroCtas.style.transform = 'translateY(0)'; }, 560);
  }

  // accessibility: allow Escape to close modal
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(modal.classList.contains('open')) {
        teardownModalFocusTrap();
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
      }
    }
  });
  // update favorite count on load
  updateFavCount();
});

/* -------------------------
  EK: küçük yardımcı fonksiyonlar ve kademeli iyileştirmeler
  ------------------------- */

/* benzersiz kategorileri elde eden fonksiyon (ileri kullanım için) */
function getCategories(){
  const cats = new Set();
  PRODUCTS.forEach(p=> cats.add(p.category || 'other'));
  return Array.from(cats);
}

/* kategori filtre seçeneklerini dinamik ekle (gerekirse) */
(function populateCategoryFilter(){
  try{
    const select = categoryFilter;
    if(!select) return;
    const cats = getCategories();
    const current = select.value || 'all';
    // remove existing non 'all' options
    const keep = select.querySelector('option[value="all"]');
    select.innerHTML = '';
    select.appendChild(keep);
    cats.forEach(cat=>{
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat[0].toUpperCase() + cat.slice(1);
      select.appendChild(opt);
    });
    // create quick filter chips (small inline buttons)
    try{
      if(filterChips){
        filterChips.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.type = 'button'; allBtn.textContent = 'Tümü'; allBtn.dataset.value = 'all'; allBtn.className = 'active';
        filterChips.appendChild(allBtn);
        allBtn.addEventListener('click', ()=>{ select.value = 'all'; document.querySelectorAll('.filter-chips button').forEach(b=>b.classList.remove('active')); allBtn.classList.add('active'); handleSearchInput(); });
        cats.forEach(cat=>{
          const btn = document.createElement('button');
          btn.type = 'button'; btn.textContent = cat[0].toUpperCase() + cat.slice(1); btn.dataset.value = cat;
          filterChips.appendChild(btn);
          btn.addEventListener('click', ()=>{ select.value = cat; document.querySelectorAll('.filter-chips button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); handleSearchInput(); });
        });
      }
    }catch(e){}
    // restore value
    select.value = current || 'all';
  } catch(err) { /* fail silently */ }
})();

// wire up sorting control
if(sortSelect) sortSelect.addEventListener('change', handleSearchInput);

/* küçük, throttle edilmiş yeniden boyutlandırma işleyicisi — gerektiğinde genişletilebilir */
let resizeTimer = null;
window.addEventListener('resize', ()=>{
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=>{
    // yeniden hesaplama: katalog yatay kaydırma transform'larını yeniden hesapla
    try{
      // küçük ekranlarda transform'ı sıfırla, büyük ekranlarda katalog efektini yeniden uygula
      if(productGrid) productGrid.style.transform = '';
      if(typeof updateCatalogEffect === 'function') updateCatalogEffect();
    }catch(e){}
  }, 200);
});

/* ===========================
  script.js sonu
  (Dosya: script.js) 
  =========================== */
