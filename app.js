const state = { images: [], route: 'home', lightboxIndex: 0, lastFocus: null };
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const fallbackSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e4d3a9"/><text x="400" y="290" text-anchor="middle" fill="#75684f" font-family="Georgia" font-size="28" font-style="italic">Image unavailable</text></svg>');

function setupCanonical() {
  const canonical = $('#canonical-link');
  if (canonical) canonical.href = `${location.origin}${location.pathname}`;
}

function imageError(img) {
  const frame = img.closest('.image-frame, .hero-visual');
  img.dataset.failed = 'true';
  img.src = fallbackSrc;
  if (frame) frame.classList.add('is-missing');
}

function photoTile(photo, index, featured = false) {
  const tile = document.createElement('article');
  tile.className = `photo-tile reveal${featured ? ' featured-tile' : ''}`;
  tile.innerHTML = `<img src="${photo.src}" alt="${photo.alt}" ${index > 2 ? 'loading="lazy"' : ''} /><span class="tile-label">${photo.title || 'Photograph'}</span><button type="button" aria-label="View ${photo.alt}"></button>`;
  const img = $('img', tile);
  img.addEventListener('error', () => { img.src = fallbackSrc; tile.classList.add('is-missing'); });
  $('button', tile).addEventListener('click', () => openLightbox(index));
  return tile;
}

function renderGallery() {
  const gallery = $('#gallery-grid');
  const featured = $('#featured-grid');
  if (!state.images.length) {
    const empty = '<div class="empty-state"><p class="eyebrow">The collection is growing</p><h2>Photographs will appear here soon.</h2><p>Add JPG, JPEG, PNG or WebP files to the <code>photos/</code> folder and run the build.</p></div>';
    gallery.innerHTML = empty; featured.innerHTML = empty; return;
  }
  gallery.replaceChildren(...state.images.map((photo, index) => photoTile(photo, index)));
  const selected = state.images.slice(0, Math.min(5, state.images.length));
  featured.replaceChildren(...selected.map((photo) => photoTile(photo, state.images.indexOf(photo), true)));
  observeReveals();
}

function openLightbox(index) {
  if (!state.images.length) return;
  state.lightboxIndex = (index + state.images.length) % state.images.length;
  state.lastFocus = document.activeElement;
  updateLightbox();
  const lightbox = $('#lightbox'); lightbox.hidden = false; document.body.classList.add('lightbox-open'); $('.lightbox-close').focus();
}
function updateLightbox() {
  const photo = state.images[state.lightboxIndex];
  const isCreditedPhoto = photo.filename?.toLowerCase() === 'img_0139.jpeg' || photo.title?.toLowerCase() === 'img 0139';
  const attribution = photo.attribution || (isCreditedPhoto ? {
    author: 'VitVit', authorUrl: 'https://commons.wikimedia.org/wiki/User:VitVit', statement: 'own work',
    license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'Wikimedia Commons source', sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=117047279'
  } : null);
  $('#lightbox-image').src = photo.src;
  $('#lightbox-image').alt = photo.alt;
  $('#lightbox-caption').textContent = photo.title;
  const credit = $('#lightbox-credit');
  if (credit) {
    credit.replaceChildren();
    if (attribution) {
      credit.append('External photograph: ');
      const author = document.createElement('a'); author.href = attribution.authorUrl; author.textContent = attribution.author; author.target = '_blank'; author.rel = 'noopener noreferrer'; credit.append(author);
      credit.append(` · ${attribution.statement} · `);
      const license = document.createElement('a'); license.href = attribution.licenseUrl; license.textContent = attribution.license; license.target = '_blank'; license.rel = 'noopener noreferrer'; credit.append(license);
      credit.append(' · ');
      const source = document.createElement('a'); source.href = attribution.sourceUrl; source.textContent = attribution.source; source.target = '_blank'; source.rel = 'noopener noreferrer'; credit.append(source);
    }
  }
}
function closeLightbox() { $('#lightbox').hidden = true; document.body.classList.remove('lightbox-open'); state.lastFocus?.focus(); }
function moveLightbox(direction) { state.lightboxIndex = (state.lightboxIndex + direction + state.images.length) % state.images.length; updateLightbox(); }

function route() {
  const requested = location.hash.slice(1).split('/')[0];
  state.route = ['home', 'gallery', 'socials', 'about', 'contact'].includes(requested) ? requested : 'home';
  $$('[data-page]').forEach((section) => { section.hidden = section.dataset.page !== state.route; });
  $$('[data-route]').forEach((link) => { link.setAttribute('aria-current', link.dataset.route === state.route ? 'page' : 'false'); });
  document.title = state.route === 'home' ? 'Dom Photography | Dominik Zmeko - Aviation & Nature' : `${state.route[0].toUpperCase()}${state.route.slice(1)} | Dom Photography | Dominik Zmeko - Aviation & Nature`;
  $('#site-nav').classList.remove('is-open'); $('.menu-toggle').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  observeReveals();
}

function observeReveals() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); current.unobserve(entry.target); } }), { threshold: .08 });
  items.forEach((item) => { if (!item.classList.contains('is-visible')) observer.observe(item); });
}

async function init() {
  setupCanonical(); $('#year').textContent = new Date().getFullYear();
  $$('img').forEach((img) => img.addEventListener('error', () => imageError(img), { once: true }));
  try { const response = await fetch('public/gallery.json'); if (!response.ok) throw new Error('gallery manifest unavailable'); const manifest = await response.json(); state.images = Array.isArray(manifest.images) ? manifest.images : []; } catch { state.images = []; }
  renderGallery(); route();
  $('.menu-toggle').addEventListener('click', () => { const nav = $('#site-nav'); const open = nav.classList.toggle('is-open'); $('.menu-toggle').setAttribute('aria-expanded', String(open)); });
  $('.lightbox-close').addEventListener('click', closeLightbox); $('.lightbox-prev').addEventListener('click', () => moveLightbox(-1)); $('.lightbox-next').addEventListener('click', () => moveLightbox(1));
  $('#lightbox').addEventListener('click', (event) => { if (event.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (event) => { if ($('#lightbox').hidden) return; if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowLeft') moveLightbox(-1); if (event.key === 'ArrowRight') moveLightbox(1); });
  window.addEventListener('hashchange', route); observeReveals();
}
init();
