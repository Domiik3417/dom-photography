const translations = {
  en: {
    navLabel: 'Primary navigation', languageLabel: 'Language', openNavigation: 'Open navigation', home: 'Home', gallery: 'Photo Gallery', socials: 'Socials', about: 'About', contact: 'Contact',
    homeEyebrow: 'A small corner on the internet', homeTitle: 'Seeing the world,<br /><em>one frame at a time.</em>', homeIntro: 'Welcome to Dom Photography — a growing collection of moments from the sky, the landscape and everywhere in between.', exploreGallery: 'Explore the gallery',
    selectedFrames: 'Selected frames', fewFavourites: 'A few favourites', seeAll: 'See all photographs', portraitComing: 'Portrait<br />coming soon', me: 'Me', aboutPreviewEyebrow: 'A little about me', aboutPreviewTitle: 'Curious by nature,<br /><em>always looking closer.</em>', aboutPreviewText: 'I’m Dominik, a student from the Czech Republic with a passion for photography, aviation and just how things generally work.', readStory: 'Read my story',
    gearEyebrow: 'The tools behind the frames', myGear: 'My gear', camera: 'Camera', everydayLens: 'Everyday lens', wildlifeLens: 'Wildlife lens', macroLens: 'Macro lens', extender: 'Extender',
    collection: 'The collection', galleryTitle: 'Photo Gallery', galleryIntro: 'Aircraft, landscapes, wildlife and the details that make a place feel like itself.', findElsewhere: 'Find me elsewhere', socialsTitle: 'Socials', socialsIntro: 'More photographs, short clips and everyday moments live here.',
    personBehindCamera: 'The person behind the camera', aboutTitle: 'About', squareComing: 'Turnov Square<br />coming soon', turnovSquare: 'Turnov Square', sayHello: 'Say hello', contactTitle: 'Contact', contactIntro: 'For a friendly hello, a question about a photograph, or simply to share something interesting:', emailMe: 'Email Me', externalPhoto: 'External photograph:', ownWork: 'own work', commonsSource: 'Wikimedia Commons source',
    emptyEyebrow: 'The collection is growing', emptyTitle: 'Photographs will appear here soon.', emptyText: 'Add JPG, JPEG, PNG or WebP files to the photos folder and run the build.', viewerLabel: 'Photograph viewer', closeViewer: 'Close viewer', previous: 'Previous photograph', next: 'Next photograph', followAlong: 'Follow along'
  },
  cs: {
    navLabel: 'Hlavní navigace', languageLabel: 'Jazyk', openNavigation: 'Otevřít navigaci', home: 'Domů', gallery: 'Galerie', socials: 'Sociální sítě', about: 'O mně', contact: 'Kontakt',
    homeEyebrow: 'Malý koutek na internetu', homeTitle: 'Pozorovat svět,<br /><em>jeden snímek za druhým.</em>', homeIntro: 'Vítej na Dom Photography — rostoucí sbírce okamžiků z oblohy, krajiny i všeho mezi tím.', exploreGallery: 'Prozkoumat galerii',
    selectedFrames: 'Vybrané snímky', fewFavourites: 'Několik oblíbených', seeAll: 'Prohlédnout všechny fotografie', portraitComing: 'Portrét<br />již brzy', me: 'Já', aboutPreviewEyebrow: 'Něco málo o mně', aboutPreviewTitle: 'Od přírody zvědavý,<br /><em>vždy hledám další detail.</em>', aboutPreviewText: 'Jsem Dominik, student z České republiky s vášní pro fotografii, letectví a to, jak věci obecně fungují.', readStory: 'Přečíst můj příběh',
    gearEyebrow: 'Nástroje za snímky', myGear: 'Moje vybavení', camera: 'Fotoaparát', everydayLens: 'Objektiv pro každý den', wildlifeLens: 'Objektiv na zvěř', macroLens: 'Makro objektiv', extender: 'Extender',
    collection: 'Kolekce', galleryTitle: 'Fotogalerie', galleryIntro: 'Letadla, krajiny, zvěř a detaily, díky kterým má místo svou vlastní atmosféru.', findElsewhere: 'Najdi mě jinde', socialsTitle: 'Sociální sítě', socialsIntro: 'Další fotografie, krátká videa a každodenní momenty najdeš zde.',
    personBehindCamera: 'Člověk za fotoaparátem', aboutTitle: 'O mně', squareComing: 'Turnovské náměstí<br />již brzy', turnovSquare: 'Turnovské náměstí', sayHello: 'Ozvi se', contactTitle: 'Kontakt', contactIntro: 'Pro přátelský pozdrav, otázku k fotografii nebo jen pro sdílení něčeho zajímavého:', emailMe: 'Napsat e-mail', externalPhoto: 'Externí fotografie:', ownWork: 'vlastní dílo', commonsSource: 'zdroj na Wikimedia Commons',
    emptyEyebrow: 'Kolekce roste', emptyTitle: 'Fotografie se zde brzy objeví.', emptyText: 'Přidej do složky photos soubory JPG, JPEG, PNG nebo WebP a spusť sestavení.', viewerLabel: 'Prohlížeč fotografií', closeViewer: 'Zavřít prohlížeč', previous: 'Předchozí fotografie', next: 'Další fotografie', followAlong: 'Sleduj mě'
  }
};
const state = { images: [], route: 'home', language: 'en', lightboxIndex: 0, lastFocus: null };
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const fallbackSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e4d3a9"/><text x="400" y="290" text-anchor="middle" fill="#75684f" font-family="Georgia" font-size="28" font-style="italic">Image unavailable</text></svg>');

function preferredLanguage() {
  try {
    const saved = localStorage.getItem('dom-photography-language');
    if (saved === 'en' || saved === 'cs') return saved;
  } catch {}
  const locales = [...(navigator.languages || []), navigator.language].filter(Boolean).map((locale) => locale.toLowerCase());
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone === 'Europe/Prague' || locales.some((locale) => locale === 'cs-cz') ? 'cs' : 'en';
}

function applyLanguage() {
  const copy = translations[state.language];
  document.documentElement.lang = state.language === 'cs' ? 'cs' : 'en';
  $$('[data-i18n]').forEach((element) => { if (copy[element.dataset.i18n]) element.innerHTML = copy[element.dataset.i18n]; });
  $$('[data-i18n-aria]').forEach((element) => { if (copy[element.dataset.i18nAria]) element.setAttribute('aria-label', copy[element.dataset.i18nAria]); });
  $$('[data-language]').forEach((button) => { const active = button.dataset.language === state.language; button.setAttribute('aria-pressed', String(active)); });
  const description = state.language === 'cs' ? 'Dom Photography — fotografie letectví, přírody, zvěře a architektury od Dominika Zmeka z České republiky.' : 'Dom Photography — aviation, nature, wildlife and architecture photography by Dominik Zmeko from the Czech Republic.';
  const ogDescription = state.language === 'cs' ? 'Malý koutek na internetu pro fotografie letectví, přírody, zvěře a architektury.' : 'A small corner on the internet for aviation, nature, wildlife and architecture photography.';
  $('meta[name="description"]').content = description; $('meta[property="og:description"]').content = ogDescription;
  document.title = state.route === 'home' ? (state.language === 'cs' ? 'Dom Photography | Dominik Zmeko - Letecká a přírodní fotografie' : 'Dom Photography | Dominik Zmeko - Aviation & Nature') : `${copy[state.route] || state.route} | Dom Photography | Dominik Zmeko`;
  $$('[data-biography]').forEach((bio) => { bio.hidden = bio.dataset.biography !== state.language; });
  renderGallery();
}

function setLanguage(language) {
  if (!translations[language]) return;
  state.language = language;
  try { localStorage.setItem('dom-photography-language', language); } catch {}
  applyLanguage();
}

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
    const copy = translations[state.language];
    const empty = `<div class="empty-state"><p class="eyebrow">${copy.emptyEyebrow}</p><h2>${copy.emptyTitle}</h2><p>${copy.emptyText}</p></div>`;
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
  applyLanguage();
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
  setupCanonical(); $('#year').textContent = new Date().getFullYear(); state.language = preferredLanguage();
  $$('img').forEach((img) => img.addEventListener('error', () => imageError(img), { once: true }));
  try { const response = await fetch('public/gallery.json'); if (!response.ok) throw new Error('gallery manifest unavailable'); const manifest = await response.json(); state.images = Array.isArray(manifest.images) ? manifest.images : []; } catch { state.images = []; }
  route();
  $$('[data-language]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  $('.menu-toggle').addEventListener('click', () => { const nav = $('#site-nav'); const open = nav.classList.toggle('is-open'); $('.menu-toggle').setAttribute('aria-expanded', String(open)); });
  $('.lightbox-close').addEventListener('click', closeLightbox); $('.lightbox-prev').addEventListener('click', () => moveLightbox(-1)); $('.lightbox-next').addEventListener('click', () => moveLightbox(1));
  $('#lightbox').addEventListener('click', (event) => { if (event.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (event) => { if ($('#lightbox').hidden) return; if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowLeft') moveLightbox(-1); if (event.key === 'ArrowRight') moveLightbox(1); });
  window.addEventListener('hashchange', route); observeReveals();
}
init();
