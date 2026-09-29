/* DVATONE — homepage concept · app.js */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* =====================================================
     Real catalog data (dvatone.com/new-shards/*.json)
     16 curated shades (used across the page) + the full
     1 066-shade catalog from catalog.js for code search.
     ===================================================== */
  var SHADES = [
    { code: '1039', sys: 'RAL', hex: 'B8A389' },
    { code: '7044', sys: 'RAL', hex: 'B7B3A8' },
    { code: 'F3.24.57', sys: '5051', hex: 'B4986D' },
    { code: '3012', sys: 'RAL', hex: 'C5866E' },
    { code: 'S 3020-G20Y', sys: 'NCS', hex: '90A488' },
    { code: 'S 3020-R90B', sys: 'NCS', hex: '819BAD' },
    { code: 'S 4005-Y50R', sys: 'NCS', hex: '9F9287' },
    { code: 'B1.18.51', sys: '5051', hex: 'B87C7E' },
    { code: 'S 3020-Y', sys: 'NCS', hex: 'B6A277' },
    { code: '7036', sys: 'RAL', hex: '989492' },
    { code: 'D6.04.78', sys: '5051', hex: 'E1D2CA' },
    { code: 'S 3020-Y40R', sys: 'NCS', hex: 'BA9377' },
    { code: '9018', sys: 'RAL', hex: 'C8CBC4' },
    { code: '1015', sys: 'RAL', hex: 'E4D1B4' },
    { code: '7038', sys: 'RAL', hex: 'AFB1A8' },
    { code: 'S 4000-N', sys: 'NCS', hex: '999997' }
  ];
  var SYS = { N: 'NCS', F: '5051', R: 'RAL' };
  var LOOK = { 'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'І': 'I', 'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T', 'Х': 'X', 'У': 'Y', 'Ѕ': 'S' };
  function norm(s) { return String(s || '').toUpperCase().replace(/[АВСЕНІКМОРТХУЅ]/g, function (c) { return LOOK[c] || c; }).replace(/[^A-Z0-9]/g, ''); }
  var CAT = [], BY_HEX = {}, BY_KEY = {};
  function regShade(sys, code, hex) {
    var key = sys + '|' + code;
    if (BY_KEY[key]) return BY_KEY[key];
    var s = { sys: sys, code: code, hex: hex.toUpperCase(), i: CAT.length };
    s.bare = norm(code); s.full = norm(sys + code);
    CAT.push(s); BY_KEY[key] = s;
    if (!BY_HEX[s.hex]) BY_HEX[s.hex] = s;
    return s;
  }
  SHADES = SHADES.map(function (s) { return regShade(s.sys, s.code, s.hex); });
  var CAT_HUE = []; // full catalog in hue order (catalog.js is pre-sorted)
  (window.DV_CAT || '').split(';').forEach(function (r) { var p = r.split('|'); if (p.length === 3 && SYS[p[0]]) CAT_HUE.push(regShade(SYS[p[0]], p[1], p[2])); });
  if (!CAT_HUE.length) CAT_HUE = CAT.slice();
  var CURATED = SHADES.slice();
  var COUNT = { all: CAT.length, NCS: 0, '5051': 0, RAL: 0 };
  CAT.forEach(function (s) { COUNT[s.sys]++; });

  function short(s) { return s.sys === 'NCS' ? 'NCS ' + s.code : (s.sys === 'RAL' ? 'RAL ' + s.code : s.code); }
  function fullCode(s) { return s.sys === 'NCS' ? 'NCS ' + s.code : (s.sys === '5051' ? '5051 · ' + s.code : 'RAL ' + s.code); }
  function sysName(s) { return s.sys === 'NCS' ? 'NCS 2050' : (s.sys === '5051' ? '5051 Color Concept' : 'RAL'); }

  var PRESETS = [
    { id: 'mineral', uk: 'Мінерал', en: 'Mineral', mix: [['B8A389', 45], ['B4986D', 20], ['9F9287', 20], ['E4D1B4', 15]] },
    { id: 'granite', uk: 'Граніт', en: 'Granite', mix: [['B7B3A8', 40], ['989492', 25], ['999997', 15], ['C8CBC4', 20]] },
    { id: 'terra', uk: 'Теракота', en: 'Terracotta', mix: [['C5866E', 50], ['B87C7E', 20], ['BA9377', 18], ['E1D2CA', 12]] },
    { id: 'sage', uk: 'Шавлія', en: 'Sage', mix: [['90A488', 45], ['AFB1A8', 25], ['819BAD', 15], ['C8CBC4', 15]] },
    { id: 'linen', uk: 'Льон · дует', en: 'Linen · duo', mix: [['E4D1B4', 65], ['9F9287', 35]] }
  ];

  /* =====================================================
     i18n (UA default, captured from DOM; EN dictionary)
     ===================================================== */
  var EN = {
    'skip': 'Skip to content',
    'nav.collection': 'Collection', 'nav.generator': 'Generator', 'nav.interiors': 'Interiors', 'nav.video': 'Video', 'nav.contact': 'Contact', 'nav.cta': 'Consultation',
    'hero.eyebrow': 'Multicolor coatings',
    'hero.t1': 'Shape your space', 'hero.t2': 'with character',
    'hero.lede': 'Coatings where color has depth, texture and light. Choose a shade, compose your own blend and see it on the wall before it is applied.',
    'hero.cta1': 'Compose a finish', 'hero.cta2': 'Browse shades', 'hero.sample': 'Coating sample',
    'hero.m1n': '1,066', 'hero.m1': 'shades in the digital catalog', 'hero.m2': 'catalog color standards', 'hero.m3': 'manufacturing partner', 'hero.scroll': 'Scroll',
    'about.label': 'About Dvatone',
    'about.quote': 'Color is a feeling, <em>not a code.</em>',
    'about.p1': 'It’s the mood of a room, the backdrop to your life. Dvatone was born from a simple belief held by our partners at Dialcolor: you should be able to see the soul of a color before it ever touches your walls.',
    'about.p2': 'A paint swatch tells you a color. It doesn’t tell you how it will dance with the light in your home. So we render the depth, the texture and the subtle shifts in tone that make Dialcolor’s finishes extraordinary.',
    'about.a1k': 'For homeowners', 'about.a1': 'The confidence to choose a finish you’ll love for years to come.',
    'about.a2k': 'For designers & architects', 'about.a2': 'A precise tool to source a finish for a client and show it in the space.',
    'strip.cap': 'Macro · real textures from the Dvatone catalog',
    'col.label': 'Collection', 'col.title': 'Shades with <em>depth</em>',
    'col.lede': 'Every shade is a multi-tonal texture: a base color and countless micro-particles that catch the light in different ways.',
    'col.all': 'All', 'col.all_link': 'Full catalog — 1,066 shades', 'col.flag_k': 'Flagship', 'col.flag_cta': 'Create a similar blend',
    'gen.label': 'Composition generator', 'gen.title': 'Compose your own <em>finish</em>',
    'gen.lede': 'Two to six catalog shades, precise proportions and grain. The preview sits on a neutral mat — the page background never affects the colour.',
    'gen.wall': 'Wall', 'gen.macro': 'Macro', 'gen.mat': 'Neutral mat', 'gen.id': 'Blend',
    'gen.colors': 'Colours & proportions', 'gen.add': 'Add a colour', 'gen.find': 'Search by code', 'gen.findHint': 'NCS · 5051 · RAL · HEX', 'gen.more': 'Show more',
    'gen.texture': 'Texture', 'gen.grain': 'Grain size', 'gen.density': 'Particle density', 'gen.sparse': 'Sparse', 'gen.dense': 'Dense',
    'gen.presets': 'Curated blends', 'gen.shuffle': 'Random blend', 'gen.reset': 'Reset',
    'gen.recipe': 'Recipe', 'gen.copy': 'Copy recipe',
    'gen.try': 'Try it in an interior', 'gen.send': 'Discuss with a consultant',
    'gen.note': 'Colours are real shades from the Dvatone catalog (NCS, 5051, RAL; 1,066 entries). The preview is generated live and conveys the character of the texture; confirm the final blend with a consultant.',
    'sky.title': 'Live background', 'sky.time': 'Time of day', 'sky.season': 'Season', 'sky.play': '24 h in 24 s', 'sky.live': 'Live',
    'sky.note': 'The background follows your local time and the season. The generator preview sits on a neutral mat, so colours stay accurate around the clock.',
    'rooms.label': 'Interior visualization', 'rooms.title': 'Texture in the room, <em>not on a swatch</em>',
    'rooms.lede': 'Pick an interior and a finish — the coating is laid onto the wall plane, respecting light and shadow. Drag the slider to compare before and after.',
    'rooms.r1': 'Living room', 'rooms.r2': 'Lounge', 'rooms.r3': 'Dining room', 'rooms.badge': 'Visualization', 'rooms.after': 'With coating', 'rooms.before': 'Original',
    'rooms.note': 'Interior photos: Unsplash, used for visualization. The texture is mapped onto the wall plane; the real look depends on lighting and application method.',
    'vid.label': 'Video', 'vid.title': 'A process <em>worth seeing</em>',
    'vid.lede': 'From catalog to finished wall: application, a tour of the collection and the generator at work — short and to the point.',
    'vid.tag': 'Video', 'vid.v1': 'Application process', 'vid.v1s': 'Video guide', 'vid.v2': 'Catalog overview', 'vid.v2s': 'Shade collection',
    'vid.v3': 'Generator: demo', 'vid.v3s': 'How to compose a blend', 'vid.soon': 'Your video goes here',
    'steps.label': 'How to choose', 'steps.title': 'From shade <em>to wall</em>',
    'steps.s1': 'Choose a shade', 'steps.s1p': 'Browse the catalog and filter shades by color standard — NCS, 5051 or RAL.',
    'steps.s2': 'Compose a blend', 'steps.s2p': 'Combine a base with accents in the generator and try the result on a real interior wall.',
    'steps.s3': 'Get a consultation', 'steps.s3p': 'Price list, technical data sheets and color matching — in the DVATONE Telegram bot or by phone.',
    'faq.title': 'Questions <em>&amp; answers</em>', 'faq.lede': 'Didn’t find an answer? Message the Telegram bot — a consultant will help you choose.', 'faq.ask': 'Ask a question',
    'faq.q1': 'What is a multicolor coating?',
    'faq.a1': 'It’s a decorative coating in which particles of several colors are distributed over a base tone, creating a deep, stone-like texture. The surface changes with light and viewing distance — exactly what the catalog and generator are built to show.',
    'faq.q2': 'How close is the on-screen color to the real one?',
    'faq.a2': 'The screen conveys the character of the texture and the balance of tones, but every display renders color differently. For the final decision, talk to a consultant — they’ll help with color matching.',
    'faq.q3': 'Where can I find technical data sheets (TDS) and application guidelines?',
    'faq.a3': 'Technical data sheets and guidelines are available in the DVATONE Telegram bot under “TDS / Sheets”, along with a video application guide.',
    'faq.q4': 'How do I find out the price?',
    'faq.a4': 'The current price list is in the DVATONE Telegram bot. For a quote on a specific project, request a consultation.',
    'faq.q5': 'Can you match a custom color?',
    'faq.a5': 'Yes. The bot offers custom color matching: a consultant will help you find a shade or blend for your interior.',
    'faq.q6': 'Which surfaces and rooms is the coating suitable for?',
    'faq.a6': 'Suitable substrates, conditions and the application procedure are listed in the technical data sheets. A consultant will recommend a solution for your specific project.',
    'faq.q7': 'Do you work with designers and architects?',
    'faq.a7': 'Yes. Dvatone is made both for homeowners and for professionals sourcing finishes for their clients.',
    'ct.label': 'Contact', 'ct.title': 'Let’s talk about <em>your space</em>',
    'ct.tg': 'The whole DVATONE ecosystem in one chat bot — instant access to the catalog, price list and video guides.',
    'ct.i1': 'Catalog', 'ct.i2': 'Price list', 'ct.i3': 'Sheets', 'ct.i4': 'Interior gallery', 'ct.i5': 'Video guide', 'ct.i6': 'Color matching',
    'ct.open': 'Open the bot', 'ct.phone': 'Phone', 'ct.consult': 'Consultation', 'ct.consult_v': 'Color and blend matching for your project', 'ct.partner': 'Manufacturing partner',
    'ft.rights': '© 2026 DVATONE. All rights reserved.', 'ft.concept': 'Concept'
  };
  var T = {
    uk: { tip: 'У генератор', add: 'Додати в генератор', your: 'Ваша композиція', gen: 'Генератор', catTex: 'фактура каталогу',
          title: 'DVATONE — Створіть простір з характером', desc: "DVATONE — архітектурні мультиколорові покриття від Dialcolor. Каталог відтінків, генератор композицій, візуалізація в інтер'єрі.",
          base: 'База', locked: 'зафіксовано', lockOn: 'Зафіксувати базовий колір', lockOff: 'Зняти фіксацію бази', change: 'Змінити колір', remove: 'Прибрати колір', share: 'Частка',
          max: 'Максимум — 6 кольорів. Натисніть на коло кольору в композиції, щоб замінити його.', min: 'Композиція — щонайменше 2 кольори.', inMix: 'Цей колір уже є в композиції.',
          replace: 'Оберіть заміну для', cancel: 'Скасувати', all: 'Усі', curated: 'Добірка Dvatone · 1 066 відтінків у каталозі', found: 'Знайдено', of: 'з', shown: 'показано',
          none: 'Нічого не знайдено. Спробуйте частину коду: 3020, B1.18 або 7044.', copied: 'Скопійовано', ph: 'S 3020-Y · B1.18.51 · RAL 7044',
          grain: 'фракція', density: 'щільність', wall: 'стіна', macro: 'макро', scaleW: 'Масштаб', dv: 'готова композиція',
          colors: function (n) { return n + ' ' + (n >= 5 ? 'кольорів' : 'кольори'); },
          phases: { night: 'ніч', dawn: 'світанок', day: 'день', golden: 'золота година', dusk: 'сутінки' },
          seasons: ['зима', 'весна', 'літо', 'осінь'], seasonsCap: ['Зима', 'Весна', 'Літо', 'Осінь'], play: 'Доба за 24 с', pause: 'Пауза',
          skyPill: 'Живе тло', preview: 'Прев’ю композиції',
          matTip: 'Прев’ю лежить на нейтрально-сірій підкладці: живе тло сторінки не впливає на колір' },
    en: { tip: 'To generator', add: 'Add to generator', your: 'Your blend', gen: 'Generator', catTex: 'catalog texture',
          title: 'DVATONE — Shape your space with character', desc: 'DVATONE — architectural multicolor coatings by Dialcolor. Shade catalog, composition generator, interior visualization.',
          base: 'Base', locked: 'locked', lockOn: 'Lock the base colour', lockOff: 'Unlock the base colour', change: 'Change colour', remove: 'Remove colour', share: 'Share',
          max: 'Six colours at most. Tap a colour circle in the blend to replace it.', min: 'A blend needs at least 2 colours.', inMix: 'This colour is already in the blend.',
          replace: 'Pick a replacement for', cancel: 'Cancel', all: 'All', curated: 'Dvatone selection · 1,066 shades in the catalog', found: 'Found', of: 'of', shown: 'showing',
          none: 'Nothing found. Try part of a code: 3020, B1.18 or 7044.', copied: 'Copied', ph: 'S 3020-Y · B1.18.51 · RAL 7044',
          grain: 'grain', density: 'density', wall: 'wall', macro: 'macro', scaleW: 'Scale', dv: 'curated blend',
          colors: function (n) { return n + ' colours'; },
          phases: { night: 'night', dawn: 'dawn', day: 'day', golden: 'golden hour', dusk: 'dusk' },
          seasons: ['winter', 'spring', 'summer', 'autumn'], seasonsCap: ['Winter', 'Spring', 'Summer', 'Autumn'], play: '24 h in 24 s', pause: 'Pause',
          skyPill: 'Live background', preview: 'Blend preview',
          matTip: 'The preview sits on a neutral grey mat: the live page background never affects the colour' }
  };
  var UK = {};
  var lang = 'uk';
  $$('[data-i18n]').forEach(function (el) { UK[el.getAttribute('data-i18n')] = el.innerHTML; });

  function setLang(l, save) {
    lang = l === 'en' ? 'en' : 'uk';
    document.documentElement.lang = lang === 'en' ? 'en' : 'uk';
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var v = lang === 'en' ? EN[k] : UK[k];
      if (v != null) el.innerHTML = v;
    });
    $$('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.title = T[lang].title;
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', T[lang].desc);
    var qi = $('#q'); if (qi) qi.setAttribute('placeholder', T[lang].ph);
    var vm = $('.view__mat'); if (vm) vm.title = T[lang].matTip;
    if (save) { try { localStorage.setItem('dv-lang', lang); } catch (e) {} }
    renderCards(); renderPresets(); renderSys(); renderMix(); renderResults(); updateGenUI(); renderRoomChips(); updateRoomNow(); skyUI();
  }
  $$('.lang__btn').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });

  /* =====================================================
     Header / nav
     ===================================================== */
  var hdr = $('#hdr'), lastY = 0;
  function onScroll() {
    var y = window.scrollY || 0;
    hdr.classList.toggle('is-solid', y > 40);
    var hide = y > window.innerHeight * 0.9 && y > lastY + 4 && !document.body.classList.contains('menu-open');
    if (y < lastY - 4 || y < 80) hdr.classList.remove('is-hidden');
    else if (hide) hdr.classList.add('is-hidden');
    lastY = y;
    scrollTick();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('.burger'), mnav = $('#mnav');
  function menu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mnav.classList.toggle('is-open', open); mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('#mnav a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });

  // current section in nav
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.hdr__nav a');
    var secObs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-cur', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'about', 'collection', 'generator', 'interiors', 'video', 'steps', 'faq', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  /* hero raking light */
  var hero = $('.hero');
  if (hero && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* =====================================================
     Reveal on scroll
     ===================================================== */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, sib = 0, p = el.previousElementSibling;
        while (p && sib < 4) { if (p.hasAttribute('data-reveal') && !p.classList.contains('is-in')) sib++; p = p.previousElementSibling; }
        el.style.setProperty('--d', (sib * 0.09) + 's');
        el.classList.add('is-in'); io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.02 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* =====================================================
     Colour helpers (sRGB <-> OKLab)
     ===================================================== */
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hx(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function tone(c, k) { return k < 0 ? [c[0] * (1 + k), c[1] * (1 + k), c[2] * (1 + k)] : [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k, c[2] + (255 - c[2]) * k]; }
  function css(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a == null ? 1 : a) + ')'; }
  function toHex(c) { return '#' + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function s2l(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function l2s(c) { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, c * 255)); }
  function lab(h) {
    var c = hx(h), r = s2l(c[0]), g = s2l(c[1]), b = s2l(c[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function labHex(L) {
    var l = L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2], m = L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2], s = L[0] - 0.0894841775 * L[1] - 1.2914855480 * L[2];
    l = l * l * l; m = m * m * m; s = s * s * s;
    return toHex([l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), l2s(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)]);
  }
  function lmix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function dE(a, b) { return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)) * 100; }
  function labOf(s) { return s.lab || (s.lab = lab(s.hex)); }

  /* =====================================================
     Speckle engine — procedural multicolor finish
     ===================================================== */
  var noiseTile = null;
  function getNoise() {
    if (noiseTile) return noiseTile;
    var c = document.createElement('canvas'); c.width = c.height = 160;
    var x = c.getContext('2d'), d = x.createImageData(160, 160), r = rng(7);
    for (var i = 0; i < d.data.length; i += 4) { var v = 110 + r() * 60 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); noiseTile = c; return c;
  }
  /* integer hash + value noise (deterministic per seed) */
  function h3(ix, iy, s) {
    var h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(s, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function vnoise(x, y, s) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var a = h3(ix, iy, s), b = h3(ix + 1, iy, s), c = h3(ix, iy + 1, s), d = h3(ix + 1, iy + 1, s);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }
  /* the same value noise, with lattice hashes cached for one render (≈4× fewer hash calls) */
  function lattice(seed, nx, ny) {
    var W = nx + 3, H = ny + 3, a = new Float32Array(W * H);
    for (var j = 0; j < H; j++) for (var i = 0; i < W; i++) a[j * W + i] = h3(i - 1, j - 1, seed);
    return { a: a, W: W };
  }
  function lnoise(L, x, y) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var A = L.a, k = (iy + 1) * L.W + ix + 1, a = A[k], b = A[k + 1], c = A[k + L.W], d = A[k + L.W + 1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  var BUF = { n: 0 }; // reused between renders (no GC churn while dragging)
  /* per-pixel pass (kept separate and monomorphic so the JIT can optimise it) */
  function mosaic(D, w, h, cols, cell, PX, PY, RW, CR, CG, CB, FAM, R, gk, ground, relief) {
    var inv = 1 / cell, seam = 1 / (0.38 * cell), gR = ground[0], gG = ground[1], gB = ground[2], useR = R < 9, p = 0;
    for (var y = 0; y < h; y++) {
      var cy = ((y * inv) | 0) + 1;
      var r0 = (cy - 1) * cols, r1 = cy * cols, r2 = (cy + 1) * cols;
      for (var x = 0; x < w; x++) {
        var cx = ((x * inv) | 0), a0 = r0 + cx, a1 = r1 + cx, a2 = r2 + cx, f1 = 1e9, f2 = 1e9, bi = 0, b2 = 0, kk, dx, dy, dd;
        // 3×3 neighbourhood, unrolled
        kk = a0; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a0 + 1; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a0 + 2; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a1; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a1 + 1; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a1 + 2; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a2; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a2 + 1; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        kk = a2 + 2; dx = PX[kk] - x; dy = PY[kk] - y; dd = (dx * dx + dy * dy) * RW[kk]; if (dd < f1) { f2 = f1; b2 = bi; f1 = dd; bi = kk; } else if (dd < f2) { f2 = dd; b2 = kk; }
        var sh = 1;
        if (FAM[bi] !== FAM[b2]) { var e = (Math.sqrt(f2) - Math.sqrt(f1)) * seam; if (e > 1) e = 1; sh = 0.86 + 0.14 * e; }
        sh *= 1 + ((PX[bi] - x) + (PY[bi] - y)) * inv * relief;
        var pr = CR[bi] * sh, pg = CG[bi] * sh, pb = CB[bi] * sh;
        if (useR) {
          var tt = Math.sqrt(f1) * inv;
          if (tt > R) { var kz = (tt - R) * gk; if (kz > 1) kz = 1; kz = kz * kz * (3 - 2 * kz); pr += (gR - pr) * kz; pg += (gG - pg) * kz; pb += (gB - pb) * kz; }
        }
        D[p] = pr; D[p + 1] = pg; D[p + 2] = pb; D[p + 3] = 255; p += 4;
      }
    }
  }

  /**
   * paint(ctx, W, H, {mix:[{hex,p}], density 0.4..1, grain, scale, seed, draft, mottle})
   * Densely packed granules (jittered, weighted Voronoi mosaic). Each granule picks a colour
   * family with probability = its share in the recipe, modulated by per-colour low-frequency
   * noise so neighbours merge into organic clusters. Density < 1 lets the base show between granules.
   */
  function paint(ctx, W, H, o) {
    var t0 = performance.now();
    var seed = (o.seed || 1) | 0, mix = o.mix && o.mix.length ? o.mix : [{ hex: 'B8A389', p: 100 }];
    var b = hx(mix[0].hex), den = o.density == null ? 1 : o.density, gr = o.grain || 1;
    var cellFull = Math.max(1.6, Math.sqrt(W * H) / 900 * 3.1 * (o.scale || 1) * gr);
    // internal resolution: ~3.3 px per granule is enough — the final pass is softly upscaled
    var q = Math.max(cellFull > 7 ? 0.8 : 0.5, Math.min(1, 3.1 / cellFull)) * (o.draft ? 0.5 : 1);
    var w = Math.max(8, Math.round(W * q)), h = Math.max(8, Math.round(H * q)), cell = cellFull * q;

    var tot = 0; mix.forEach(function (m) { tot += m.p; });
    var fams = mix.map(function (m) {
      var c = hx(m.hex);
      return { p: Math.pow(m.p / tot, 1.12), ns: seed + (hashStr(m.hex) % 7919) + 3, t: [{ c: tone(c, -0.09), w: 0.3 }, { c: c, w: 0.45 }, { c: tone(c, 0.07), w: 0.25 }] };
    });
    var nf = fams.length, WS = new Float32Array(nf), CNT = new Float32Array(nf);
    var dark = tone(b, -0.45), ground = tone(b, -0.03);

    var cols = Math.ceil(w / cell) + 3, rows = Math.ceil(h / cell) + 3, n = cols * rows;
    if (BUF.n < n) { BUF.n = n; BUF.PX = new Float32Array(n); BUF.PY = new Float32Array(n); BUF.CR = new Float32Array(n); BUF.CG = new Float32Array(n); BUF.CB = new Float32Array(n); BUF.FAM = new Uint8Array(n); BUF.RW = new Float32Array(n); }
    var PX = BUF.PX, PY = BUF.PY, CR = BUF.CR, CG = BUF.CG, CB = BUF.CB, FAM = BUF.FAM, RW = BUF.RW;
    var clump = 2.6;
    var LC = fams.map(function (fm) { return lattice(fm.ns, Math.ceil(cols / clump) + 1, Math.ceil(rows / clump) + 1); });
    var LT = fams.map(function (fm, f) { return lattice(seed + 59 + f, Math.ceil(cols / 1.8) + 1, Math.ceil(rows / 1.8) + 1); });
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var gi = i - 1, gj = j - 1, k = j * cols + i;
        PX[k] = (gi + 0.1 + 0.8 * h3(gi, gj, seed)) * cell;
        PY[k] = (gj + 0.1 + 0.8 * h3(gi, gj, seed + 17)) * cell;
        var gs = 0.62 + 0.76 * h3(gi, gj, seed + 83); RW[k] = 1 / (gs * gs); // weighted cells -> rounded, varied grains
        var u = h3(gi, gj, seed + 31), c = null, t, famId = 0;
        if (u < 0.01) { c = dark; famId = 250; }
        else {
          var sum = 0;
          var cxn = gi / clump, cyn = gj / clump;
          for (var a = 0; a < nf; a++) { var na = lnoise(LC[a], cxn, cyn); WS[a] = fams[a].p * (0.22 + 1.7 * na * na); sum += WS[a]; }
          var v = h3(gi, gj, seed + 47) * sum, f = 0;
          while (f < nf - 1 && v > WS[f]) { v -= WS[f]; f++; }
          var fam = fams[f].t, tv = lnoise(LT[f], gi / 1.8, gj / 1.8), s = 0;
          while (s < fam.length - 1 && tv > fam[s].w) { tv -= fam[s].w; s++; }
          c = fam[s].c; famId = f; CNT[f]++;
        }
        t = 1 + (h3(gi, gj, seed + 71) - 0.5) * 0.05;
        CR[k] = c[0] * t; CG[k] = c[1] * t; CB[k] = c[2] * t; FAM[k] = famId;
      }
    }
    var tc = performance.now();
    // density: granule "radius" in cell units; beyond it the base shows through
    var R = den >= 0.99 ? 99 : 0.26 + 0.5 * Math.max(0, (den - 0.4) / 0.6), gk = 1 / 0.1;
    if (!BUF.img || BUF.img.width !== w || BUF.img.height !== h) BUF.img = new ImageData(w, h);
    var img = BUF.img;
    mosaic(img.data, w, h, cols, cell, PX, PY, RW, CR, CG, CB, FAM, R, gk, ground, o.relief == null ? 0.03 : o.relief);
    var t1 = performance.now();
    ctx.save();
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    var tmp = BUF.tmp || (BUF.tmp = document.createElement('canvas'));
    if (tmp.width !== w || tmp.height !== h) { tmp.width = w; tmp.height = h; }
    tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.fillStyle = css(b); ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    if ('filter' in ctx && !o.draft) ctx.filter = 'blur(' + Math.min(0.18 * cellFull, 1).toFixed(2) + 'px)';
    ctx.drawImage(tmp, 0, 0, W, H);
    ctx.filter = 'none';
    // soft tonal mottling (uneven spray / light) — part of the texture itself
    var Rn = rng(seed), mot = o.mottle == null ? 9 : o.mottle;
    for (var m = 0; m < mot; m++) {
      var mx = Rn() * W, my = Rn() * H, mr = (0.15 + Rn() * 0.35) * Math.max(W, H);
      var mc = tone(b, Rn() < 0.5 ? -0.1 : 0.07), g = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
      g.addColorStop(0, css(mc, 0.13)); g.addColorStop(1, css(mc, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // micro grain
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = ctx.createPattern(getNoise(), 'repeat');
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    var all = 0; for (var z = 0; z < nf; z++) all += CNT[z];
    window.__dvPaint = { ms: Math.round(performance.now() - t0), mosaic: Math.round(t1 - t0), cells: Math.round(tc - t0), ncell: n, w: W, h: H, iw: w, ih: h, draft: !!o.draft, shares: Array.prototype.map.call(CNT, function (v) { return Math.round(v / all * 1000) / 10; }) };
  }

  /* =====================================================
     Collection
     ===================================================== */
  var cardsEl = $('#cards'), curFilter = 'all';
  var CARD_SET = ['B7B3A8', 'B8A389', 'C5866E', '90A488', 'B4986D', '819BAD', '9F9287', 'B87C7E', 'BA9377', 'E1D2CA', 'C8CBC4', 'B6A277', '989492', 'E4D1B4', '999997', 'AFB1A8'];
  function renderCards() {
    if (!cardsEl) return;
    var html = '';
    var list = CARD_SET.map(function (h) { return BY_HEX[h]; }).filter(function (s) { return curFilter === 'all' || s.sys === curFilter; });
    if (curFilter === 'all') list = list.slice(0, 8);
    list.forEach(function (s) {
      html += '<article class="card">' +
        '<div class="card__img"><img src="img/tex/' + s.hex + '.webp" alt="' + fullCode(s) + '" loading="lazy" width="900" height="600"><span class="card__tip">' + T[lang].tip + '</span></div>' +
        '<div class="card__b"><div class="card__code"><b>' + short(s) + '</b><small><i style="background:#' + s.hex + '"></i>' + s.sys + '</small></div>' +
        '<button type="button" class="card__add" data-hex="' + s.hex + '" aria-label="' + T[lang].add + ': ' + fullCode(s) + '"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>' +
        '</article>';
    });
    cardsEl.innerHTML = html;
  }
  $$('.filter').forEach(function (f) {
    f.addEventListener('click', function () {
      curFilter = f.getAttribute('data-filter');
      $$('.filter').forEach(function (x) { x.classList.toggle('is-on', x === f); });
      renderCards();
    });
  });
  if (cardsEl) cardsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.card__add, .card__img'); if (!btn) return;
    var card = e.target.closest('.card'); var hex = card.querySelector('.card__add').getAttribute('data-hex');
    var s = BY_HEX[hex];
    if (G.lock) { if (!inMix(s)) addToMix(s, true); }
    else {
      var at = mixIndex(s);
      if (at > 0) G.mix[at].s = G.mix[0].s; // swap: the chosen shade becomes the base
      G.mix[0].s = s;
    }
    G.seed = (G.seed + 1) % 99991; G.preset = null; G.target = -1;
    renderMix(); genChanged();
    document.getElementById('generator').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  var flagBtn = $('.flag .btn');
  if (flagBtn) flagBtn.addEventListener('click', function () { applyPreset(PRESETS[0]); });

  /* =====================================================
     Generator — model
     ===================================================== */
  var MAXC = 6, MINC = 2, MINP = 2;
  function presetMix(p) { return p.mix.map(function (a) { return { s: BY_HEX[a[0]], p: a[1] }; }); }
  var G = { mix: presetMix(PRESETS[0]), lock: false, density: 0.92, grain: 1, scale: 'wall', seed: 11, target: -1, preset: 'mineral', sys: 'all', q: '', limit: 16 };

  function mixIndex(s) { for (var i = 0; i < G.mix.length; i++) if (G.mix[i].s === s) return i; return -1; }
  function inMix(s) { return mixIndex(s) > -1; }
  function normalize() {
    var t = 0; G.mix.forEach(function (m) { m.p = Math.max(MINP, m.p); t += m.p; });
    G.mix.forEach(function (m) { m.p = m.p / t * 100; });
  }
  /* set share of colour i; the others rebalance proportionally (above their minimum) so the total stays 100 */
  function setShare(i, v) {
    var n = G.mix.length;
    v = Math.max(MINP, Math.min(100 - MINP * (n - 1), v));
    var E = 0; G.mix.forEach(function (m, j) { if (j !== i) E += m.p - MINP; });
    var target = 100 - v - MINP * (n - 1);
    G.mix.forEach(function (m, j) {
      if (j === i) return;
      var e = m.p - MINP;
      m.p = MINP + (E > 0.0001 ? e / E * target : target / (n - 1));
    });
    G.mix[i].p = v;
  }
  /* integer percentages that always sum to exactly 100 (largest remainder) */
  function rounded() {
    var fl = G.mix.map(function (m) { return Math.floor(m.p); }), rest = 100 - fl.reduce(function (a, b) { return a + b; }, 0);
    var ord = G.mix.map(function (m, i) { return i; }).sort(function (a, b) { return (G.mix[b].p - fl[b]) - (G.mix[a].p - fl[a]); });
    for (var k = 0; k < rest; k++) fl[ord[k % ord.length]]++;
    return fl;
  }
  function addToMix(s, silent) {
    if (inMix(s)) { flashRow(mixIndex(s)); setMsg(T[lang].inMix); return false; }
    if (G.target > -1 && G.mix[G.target]) {
      G.mix[G.target].s = s; var ti = G.target; G.target = -1; G.preset = null;
      renderMix(); genChanged(); flashRow(ti); setMsg(''); return true;
    }
    if (G.mix.length >= MAXC) { setMsg(T[lang].max); return false; }
    var n = G.mix.length, np = Math.min(20, 100 / (n + 1));
    G.mix.forEach(function (m) { m.p *= (100 - np) / 100; });
    G.mix.push({ s: s, p: np }); G.preset = null;
    renderMix(); if (!silent) genChanged(); flashRow(G.mix.length - 1); setMsg('');
    return true;
  }
  function removeAt(i) {
    if (G.mix.length <= MINC) { setMsg(T[lang].min); return; }
    var gone = G.mix.splice(i, 1)[0], t = 100 - gone.p;
    G.mix.forEach(function (m) { m.p = m.p / t * 100; });
    if (G.target === i) G.target = -1; else if (G.target > i) G.target--;
    G.preset = null; setMsg(''); renderMix(); genChanged();
  }
  function applyPreset(p) {
    var mix = presetMix(p);
    if (G.lock) {
      var base = G.mix[0].s;
      mix = mix.filter(function (m, i) { return i > 0 && m.s !== base; });
      mix.unshift({ s: base, p: p.mix[0][1] });
    }
    G.mix = mix; normalize(); G.seed = hashStr(p.id) % 99991; G.preset = p.id; G.target = -1;
    setMsg(''); renderMix(); genChanged();
  }
  /* harmonious random blend: keeps the number of colours and (if locked) the base */
  var BASE_POOL = null;
  function randomise() {
    var r = rng((Date.now() ^ Math.imul(G.seed + 1, 2654435761)) | 0), n = G.mix.length;
    if (!BASE_POOL) BASE_POOL = CAT.filter(function (s) { var L = labOf(s), C = Math.hypot(L[1], L[2]); return C < 0.075 && L[0] > 0.6 && L[0] < 0.9; });
    var base = G.lock ? G.mix[0].s : (r() < 0.45 ? CURATED[r() * CURATED.length | 0] : BASE_POOL[r() * BASE_POOL.length | 0]);
    var bl = labOf(base), bC = Math.hypot(bl[1], bl[2]), picks = [base];
    var bH = Math.atan2(bl[2], bl[1]);
    var cand = CAT.filter(function (s) {
      if (s === base) return false;
      var L = labOf(s), d = dE(L, bl), C = Math.hypot(L[1], L[2]), dh = Math.abs(Math.atan2(L[2], L[1]) - bH);
      if (dh > Math.PI) dh = 2 * Math.PI - dh;
      return d > 4 && d < 20 && C < Math.max(0.055, bC + 0.025) && L[0] > 0.45 && (C < 0.025 || bC < 0.02 || dh < 1.2);
    });
    var guard = 0;
    while (picks.length < n && guard++ < 400) {
      var s = (cand.length ? cand : CAT)[r() * (cand.length || CAT.length) | 0];
      if (picks.indexOf(s) > -1) continue;
      var ok = picks.every(function (x) { return dE(labOf(x), labOf(s)) > 5; });
      if (ok || guard > 300) picks.push(s);
    }
    var bp = 35 + r() * 25, ws = picks.slice(1).map(function () { return 0.5 + r(); }), wt = ws.reduce(function (a, b) { return a + b; }, 0);
    G.mix = picks.map(function (s, i) { return { s: s, p: i === 0 ? bp : ws[i - 1] / wt * (100 - bp) }; });
    normalize(); G.seed = r() * 99991 | 0; G.preset = null; G.target = -1;
    setMsg(''); renderMix(); genChanged();
  }
  function resetGen() {
    G.mix = presetMix(PRESETS[0]); G.lock = false; G.density = 0.92; G.grain = 1; G.scale = 'wall'; G.seed = 11; G.target = -1; G.preset = 'mineral';
    G.q = ''; G.sys = 'all'; G.limit = 16; if (qInput) qInput.value = '';
    $('#grain').value = 1; $('#dens').value = 92;
    setMsg(''); renderSys(); renderMix(); renderResults(); genChanged();
  }

  /* =====================================================
     Generator — UI
     ===================================================== */
  var genCanvas = $('#genCanvas'), genView = $('#genView'), mixEl = $('#mix'), resEl = $('#results'), qInput = $('#q'), finder = $('#finder');
  var genDirty = true, genVisible = true, rafId = 0, fullT = 0;

  var ICON = {
    lock: '<svg viewBox="0 0 24 24"><rect x="5.5" y="11" width="13" height="9" rx="1.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/></svg>',
    unlock: '<svg viewBox="0 0 24 24"><rect x="5.5" y="11" width="13" height="9" rx="1.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 6.7-1.4"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M7.5 7.5l9 9M16.5 7.5l-9 9"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M5 19l1-4 9-9 3 3-9 9z"/></svg>'
  };
  function fillHex(hex) { var c = hx(hex), l = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11); return toHex(tone(c, l > 190 ? -0.3 : (l > 150 ? -0.14 : 0))); }
  function grainName(g) { return g < 0.85 ? 'S' : (g < 1.2 ? 'M' : (g < 1.5 ? 'L' : 'XL')); }
  function rangeFill(el) { var mn = +el.min, mx = +el.max; el.style.setProperty('--v', ((+el.value - mn) / (mx - mn) * 100).toFixed(2) + '%'); }

  function renderMix() {
    if (!mixEl) return;
    var r = rounded(), n = G.mix.length, mx = 100 - MINP * (n - 1);
    mixEl.innerHTML = G.mix.map(function (m, i) {
      var s = m.s, isBase = i === 0;
      // RAL / NCS already carry the system in the name — the sub-line stays short and quiet
      var tag = (s.sys === '5051' ? '5051 · ' : '') + '#' + s.hex;
      var sub = isBase ? T[lang].base + ' · ' + (G.lock ? T[lang].locked : tag) : tag;
      var act = isBase
        ? '<button type="button" class="icob" data-act="lock" aria-pressed="' + G.lock + '" aria-label="' + (G.lock ? T[lang].lockOff : T[lang].lockOn) + '" title="' + (G.lock ? T[lang].lockOff : T[lang].lockOn) + '">' + (G.lock ? ICON.lock : ICON.unlock) + '</button>'
        : '<button type="button" class="icob" data-act="rm" aria-label="' + T[lang].remove + ': ' + fullCode(s) + '" title="' + T[lang].remove + '"' + (n <= MINC ? ' disabled' : '') + '>' + ICON.x + '</button>';
      return '<li class="mixrow' + (G.target === i ? ' is-target' : '') + (isBase ? ' is-base' : '') + (isBase && G.lock ? ' is-locked' : '') + '" data-i="' + i + '" style="--c:#' + s.hex + ';--c-d:' + fillHex(s.hex) + '">' +
        '<button type="button" class="mixrow__sw" data-act="pick" aria-label="' + T[lang].change + ': ' + fullCode(s) + '" title="' + T[lang].change + '">' + ICON.pen + '</button>' +
        '<div class="mixrow__name"><b>' + short(s) + '</b><small>' + sub + '</small></div>' +
        '<div class="mixrow__pct"><span>' + r[i] + '</span><sup>%</sup></div>' +
        '<div class="mixrow__act">' + act + '</div>' +
        '<input class="srange mixrow__rng" type="range" min="' + MINP + '" max="' + mx + '" step="1" value="' + m.p.toFixed(1) + '" aria-label="' + T[lang].share + ': ' + fullCode(s) + '">' +
        '</li>';
    }).join('');
    $$('.mixrow__rng', mixEl).forEach(rangeFill);
    var add = $('#addColor'); if (add) add.disabled = n >= MAXC;
    $('#colCount').textContent = n + ' / ' + MAXC;
    // replace mode: its own row above the search field (never truncated)
    var ft = $('#findTarget'), tg = G.target > -1 && G.mix[G.target] ? G.mix[G.target].s : null;
    if (ft) {
      ft.hidden = !tg;
      ft.innerHTML = tg ? '<i style="background:#' + tg.hex + '"></i><span>' + T[lang].replace + ' <b>' + short(tg) + '</b></span><button type="button" class="find__cancel" id="cancelTarget">' + T[lang].cancel + '</button>' : '';
    }
    if (finder) finder.classList.toggle('is-replacing', !!tg);
    renderPresetState();
  }
  /* live update while a proportion slider moves (no DOM rebuild) */
  function syncMix(active) {
    var r = rounded();
    $$('.mixrow', mixEl).forEach(function (row, i) {
      var sp = row.querySelector('.mixrow__pct span'); if (sp) sp.textContent = r[i];
      var rg = row.querySelector('.mixrow__rng');
      if (rg && i !== active) { rg.value = G.mix[i].p.toFixed(1); }
      if (rg) rangeFill(rg);
    });
  }
  function flashRow(i) {
    var row = mixEl && mixEl.children[i]; if (!row) return;
    row.classList.remove('is-flash'); void row.offsetWidth; row.classList.add('is-flash');
  }
  // hints appear next to where the hand is: under the colour list, or under the search field
  var msgT = 0, msgAt = 'mixMsg';
  function setMsg(t) {
    ['mixMsg', 'findMsg'].forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = id === msgAt ? t : ''; });
    clearTimeout(msgT);
    if (t) msgT = setTimeout(function () { ['mixMsg', 'findMsg'].forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = ''; }); }, 5200);
  }

  function compKey() { return G.mix.map(function (m) { return m.s.hex + Math.round(m.p); }).join('') + G.grain + G.density; }
  function updateGenUI(draft) {
    if (!genCanvas) return;
    // curated blends carry their name; a custom blend gets a short reference number (not a hex — no "#")
    var r = rounded(), pr = null;
    // the reference number settles when the hand stops (no slot-machine flicker while dragging)
    if (!draft || !G.no) {
      G.no = (hashStr(compKey()) >>> 0).toString(16).slice(-4).toUpperCase();
      PRESETS.forEach(function (p) { if (p.id === G.preset) pr = p; });
      $('#compId').innerHTML = pr ? pr[lang] : '<span class="phead__no">№</span>' + G.no;
      $('#recipeId').textContent = '№ ' + G.no;
    }
    $('#compSum').textContent = T[lang].colors(G.mix.length) + ' · ' + T[lang].grain + ' ' + grainName(G.grain) + ' · ' + T[lang].density + ' ' + Math.round(G.density * 100) + '%';
    $('#ratio').innerHTML = G.mix.map(function (m, i) { return '<i style="flex-grow:' + r[i] + ';background:#' + m.s.hex + '"></i>'; }).join('');
    $('#recipe').innerHTML = G.mix.map(function (m, i) {
      return '<li><i style="background:#' + m.s.hex + '"></i><span class="c">' + fullCode(m.s) + (i === 0 ? '<small>' + T[lang].base.toLowerCase() + '</small>' : '') + '</span><span class="f"></span><b>' + r[i] + '%</b></li>';
    }).join('');
    $('#recipeTex').textContent = T[lang].grain.charAt(0).toUpperCase() + T[lang].grain.slice(1) + ' ' + grainName(G.grain) + ' · ' + T[lang].density + ' ' + Math.round(G.density * 100) + '% · ' + T[lang].scaleW.toLowerCase() + ': ' + (G.scale === 'macro' ? T[lang].macro : T[lang].wall);
    $('#grainVal').textContent = grainName(G.grain);
    $('#densVal').textContent = Math.round(G.density * 100) + '%';
    rangeFill($('#grain')); rangeFill($('#dens'));
    $$('.scale__b').forEach(function (b) { var on = b.getAttribute('data-scale') === G.scale; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    genCanvas.setAttribute('aria-label', T[lang].preview + ': ' + G.mix.map(function (m, i) { return fullCode(m.s) + ' ' + r[i] + '%'; }).join(', '));
    $$('.res', resEl).forEach(function (b) { var k = b.getAttribute('data-k'); if (k != null) b.classList.toggle('is-in', inMix(CAT[+k])); });
  }
  function sizeCanvas(cv, maxW) {
    var r = cv.getBoundingClientRect();
    var w = Math.max(1, Math.round(Math.min(r.width * DPR, maxW || 1800))), h = Math.max(1, Math.round(w * r.height / Math.max(1, r.width)));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; return true; }
    return false;
  }
  function paintOpts(extra) {
    var o = { mix: G.mix.map(function (m) { return { hex: m.s.hex, p: m.p }; }), density: G.density, grain: G.grain, seed: G.seed };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  function drawGen(draft) {
    if (!genCanvas) return;
    if (!genVisible && !draft) { genDirty = true; return; }
    sizeCanvas(genCanvas, 1600);
    paint(genCanvas.getContext('2d'), genCanvas.width, genCanvas.height, paintOpts({ scale: G.scale === 'macro' ? 3.1 : 1.45, draft: !!draft }));
    if (!draft) { genDirty = false; genThumbs(); }
  }
  /* draft render while dragging (half resolution), full render once the hand stops */
  function requestDraw(draft) {
    genDirty = true;
    clearTimeout(fullT);
    if (draft) {
      if (!rafId) rafId = requestAnimationFrame(function () { rafId = 0; drawGen(true); });
      fullT = setTimeout(function () { drawGen(false); }, 220);
    } else {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      rafId = requestAnimationFrame(function () { rafId = 0; drawGen(false); });
    }
  }
  /* small round previews of the current blend, cropped from the live preview canvas */
  function genThumbs() {
    if (!genCanvas || genCanvas.width < 8) return;
    $$('#roomChips canvas.th, #roomNow canvas.th').forEach(function (c) {
      var x = c.getContext('2d'), s = Math.min(genCanvas.width, genCanvas.height) * 0.3;
      x.clearRect(0, 0, c.width, c.height);
      x.drawImage(genCanvas, (genCanvas.width - s) / 2, (genCanvas.height - s) / 2, s, s, 0, 0, c.width, c.height);
    });
  }
  var roomGenT = 0;
  function genChanged(opt) {
    updateGenUI(opt && opt.draft);
    requestDraw(opt && opt.draft);
    // cached renders of the blend are keyed by its recipe, so a changed blend never shows a stale room
    dropGenCache();
    if (ROOM.finish && ROOM.finish.type === 'gen') {
      clearTimeout(roomGenT); roomGenT = setTimeout(drawRoom, opt && opt.draft ? 320 : 60);
      updateRoomNow();
    }
  }
  function renderPresets() {
    var el = $('#presets'); if (!el) return;
    el.innerHTML = PRESETS.map(function (p) {
      var dots = p.mix.map(function (a) { return '<i style="background:#' + a[0] + '"></i>'; }).join('');
      return '<button type="button" class="preset" data-p="' + p.id + '"><span class="dots">' + dots + '</span>' + p[lang] + '</button>';
    }).join('');
    renderPresetState();
  }
  function renderPresetState() { $$('.preset').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-p') === G.preset); }); }

  /* ---------- search by code ---------- */
  function renderSys() {
    var el = $('#sysF'); if (!el) return;
    el.innerHTML = [['all', T[lang].all], ['NCS', 'NCS'], ['5051', '5051'], ['RAL', 'RAL']].map(function (a) {
      return '<button type="button" class="sysb' + (G.sys === a[0] ? ' is-on' : '') + '" data-sys="' + a[0] + '" aria-pressed="' + (G.sys === a[0]) + '">' + a[1] + '<small>' + COUNT[a[0]].toLocaleString(lang === 'en' ? 'en-US' : 'uk-UA') + '</small></button>';
    }).join('');
  }
  function searchCat(raw) {
    var q = norm(raw), sys = G.sys, hexQ = null, dv = false;
    var t = String(raw || '').trim();
    if (/^#[0-9a-f]{1,6}$/i.test(t)) hexQ = t.slice(1).toUpperCase();
    var m = /^(NCS|RAL|DV)(.*)$/.exec(q);
    if (m) { if (m[1] === 'DV') dv = true; else { sys = m[1]; q = m[2]; } }
    else if (/^5051[A-Z]/.test(q)) { sys = '5051'; q = q.slice(4); }
    if (dv || /^033/.test(q)) return { dv: true, list: [] };
    if (!q && !hexQ) return { list: sys === 'all' ? CURATED : CAT_HUE.filter(function (s) { return s.sys === sys; }), curated: sys === 'all' };
    var out = [];
    CAT_HUE.forEach(function (s) {
      if (sys !== 'all' && s.sys !== sys) return;
      var sc = -1;
      if (hexQ) { if (s.hex.indexOf(hexQ) === 0) sc = 0; }
      else if (s.bare.indexOf(q) === 0) sc = 0;
      else if (s.full.indexOf(q) === 0) sc = 1;
      else if (s.bare.indexOf(q) > 0) sc = 2;
      else if (q.length === 6 && s.hex === q) sc = 3;
      if (sc > -1) out.push({ s: s, sc: sc });
    });
    out.sort(function (a, b) { return a.sc - b.sc || a.s.i - b.s.i; });
    return { list: out.map(function (o) { return o.s; }) };
  }
  function markUp(label, raw) {
    var t = String(raw || '').trim().toUpperCase(); if (t.length < 2) return label;
    var ix = label.toUpperCase().indexOf(t); if (ix < 0) return label;
    return label.slice(0, ix) + '<mark>' + label.slice(ix, ix + t.length) + '</mark>' + label.slice(ix + t.length);
  }
  function renderResults() {
    if (!resEl) return;
    var res = searchCat(G.q), html = '', meta = '', more = $('#resMore');
    finder.classList.toggle('has-q', !!G.q);
    if (res.dv) {
      html = '<button type="button" class="res res--dv" data-dv="mineral"><i></i><span>DV 033</span><small>' + T[lang].dv + '</small></button>';
      meta = 'DV 033 · Multicolor Mineral Structure';
      more.hidden = true;
    } else if (!res.list.length) {
      html = '<p class="find__empty">' + T[lang].none + '</p>'; more.hidden = true;
    } else {
      var list = res.list.slice(0, G.limit);
      html = list.map(function (s) {
        return '<button type="button" class="res' + (inMix(s) ? ' is-in' : '') + '" data-k="' + s.i + '" title="' + fullCode(s) + ' · #' + s.hex + '"><i style="background:#' + s.hex + '"></i><span>' + markUp(s.code, G.q) + '<small>' + s.sys + '</small></span></button>';
      }).join('');
      var loc = lang === 'en' ? 'en-US' : 'uk-UA';
      meta = res.curated ? T[lang].curated : T[lang].found + ': ' + res.list.length.toLocaleString(loc) + (res.list.length > list.length ? ' · ' + T[lang].shown + ' ' + list.length : '');
      more.hidden = res.list.length <= list.length;
    }
    resEl.innerHTML = html;
    $('#resMeta').textContent = meta;
  }

  /* bring the search into view — below the header on desktop, below the pinned preview on phones */
  function revealFinder() {
    var off = mqSmall.matches ? genView.offsetHeight + 16 : hdr.offsetHeight + 28;
    var r = finder.getBoundingClientRect();
    if (r.top >= off - 2 && r.top < window.innerHeight * 0.5) return;
    window.scrollTo({ top: Math.max(0, window.scrollY + r.top - off), behavior: reduce ? 'auto' : 'smooth' });
  }
  if (genCanvas) {
    mixEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var i = +b.closest('.mixrow').getAttribute('data-i'), act = b.getAttribute('data-act');
      if (act === 'lock') { G.lock = !G.lock; renderMix(); return; }
      if (act === 'rm') { removeAt(i); return; }
      if (act === 'pick') {
        G.target = G.target === i ? -1 : i; renderMix(); setMsg('');
        if (G.target > -1) {
          revealFinder();
          if (canHover) qInput.focus({ preventScroll: true });
        }
      }
    });
    mixEl.addEventListener('input', function (e) {
      if (!e.target.classList.contains('mixrow__rng')) return;
      var i = +e.target.closest('.mixrow').getAttribute('data-i');
      setShare(i, +e.target.value); G.preset = null; renderPresetState();
      syncMix(i); genChanged({ draft: true });
    });
    mixEl.addEventListener('change', function (e) { if (e.target.classList.contains('mixrow__rng')) { syncMix(-1); updateGenUI(); updateRoomNow(); requestDraw(false); } });
    $('#addColor').addEventListener('click', function () {
      G.target = -1; renderMix(); setMsg('');
      revealFinder();
      qInput.focus({ preventScroll: true });
    });
    finder.addEventListener('click', function (e) {
      if (e.target.id === 'cancelTarget') { G.target = -1; renderMix(); return; }
      var sb = e.target.closest('.sysb');
      if (sb) { G.sys = sb.getAttribute('data-sys'); G.limit = 16; renderSys(); renderResults(); return; }
      var r = e.target.closest('.res');
      if (r) {
        if (r.hasAttribute('data-dv')) { applyPreset(PRESETS[0]); return; }
        msgAt = 'findMsg'; addToMix(CAT[+r.getAttribute('data-k')]); msgAt = 'mixMsg';
        renderResults();
      }
    });
    qInput.addEventListener('input', function () { G.q = qInput.value; G.limit = 16; renderResults(); });
    qInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var first = $('.res', resEl); if (first) { e.preventDefault(); first.click(); } }
      if (e.key === 'Escape') { qInput.value = ''; G.q = ''; renderResults(); }
    });
    $('#qClear').addEventListener('click', function () { qInput.value = ''; G.q = ''; G.limit = 16; renderResults(); qInput.focus(); });
    $('#resMore').addEventListener('click', function () { G.limit += 16; renderResults(); });
    $('#dens').addEventListener('input', function (e) { G.density = e.target.value / 100; genChanged({ draft: true }); });
    $('#dens').addEventListener('change', function () { updateGenUI(); updateRoomNow(); requestDraw(false); });
    $('#grain').addEventListener('input', function (e) { G.grain = +e.target.value; genChanged({ draft: true }); });
    $('#grain').addEventListener('change', function () { updateGenUI(); updateRoomNow(); requestDraw(false); });
    $$('.scale__b').forEach(function (b) { b.addEventListener('click', function () { G.scale = b.getAttribute('data-scale'); genChanged(); }); });
    $('#presets').addEventListener('click', function (e) { var b = e.target.closest('.preset'); if (!b) return; PRESETS.forEach(function (p) { if (p.id === b.getAttribute('data-p')) applyPreset(p); }); });
    $('#shuffle').addEventListener('click', randomise);
    $('#reset').addEventListener('click', resetGen);
    $('#copyRecipe').addEventListener('click', function () {
      var r = rounded(), L = T[lang];
      var pn = null; PRESETS.forEach(function (p) { if (p.id === G.preset) pn = p[lang]; });
      var txt = 'DVATONE — ' + (lang === 'en' ? 'Blend' : 'Композиція') + ' № ' + G.no + (pn ? ' (' + pn + ')' : '') + '\n' +
        G.mix.map(function (m, i) { return (i + 1) + '. ' + fullCode(m.s).replace(' · ', ' ') + ' (#' + m.s.hex + ') — ' + r[i] + '%' + (i === 0 ? ' · ' + L.base.toLowerCase() : ''); }).join('\n') + '\n' +
        $('#recipeTex').textContent;
      var done = function () {
        var b = $('#copyRecipe'), l = $('#copyLbl'); b.classList.add('is-done'); l.textContent = L.copied;
        clearTimeout(b._t); b._t = setTimeout(function () { b.classList.remove('is-done'); l.innerHTML = lang === 'en' ? EN['gen.copy'] : UK['gen.copy']; }, 1800);
      };
      var fallback = function () { var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); };
      window.__dvRecipe = txt;
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
    });
    $('#toRoom').addEventListener('click', function () {
      ROOM.finish = { type: 'gen' }; renderRoomChips(); drawRoom(); updateRoomNow();
      document.getElementById('interiors').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) { genVisible = ents[0].isIntersecting; if (genVisible && genDirty) drawGen(false); }, { rootMargin: '300px' }).observe(genCanvas);
    }
  }

  /* pin the preview on small screens (header steps aside), keep the live-background pill off the preview */
  var studio = $('.studio'), skyCtl = $('#skyctl'), scrollRaf = 0, mqSmall = window.matchMedia('(max-width: 1000px)');
  function scrollTick() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = 0;
      if (!genView || !studio) return;
      var v = genView.getBoundingClientRect(), st = studio.getBoundingClientRect();
      var pin = mqSmall.matches && v.top < hdr.offsetHeight && st.bottom > v.height + hdr.offsetHeight;
      document.body.classList.toggle('gen-pin', pin);
      if (skyCtl) {
        var fr = genView.querySelector('.view__frame').getBoundingClientRect(), pl = $('#skyPill').getBoundingClientRect();
        var hit = !(pl.right < fr.left || pl.left > fr.right || pl.bottom < fr.top || pl.top > fr.bottom);
        skyCtl.classList.toggle('is-away', hit && !skyOpen);
        // over the studio the pill folds into a small light dot in the gutter, so it never covers a control
        skyCtl.classList.toggle('is-mini', st.top < pl.bottom + 12 && st.bottom > pl.top - 12 && !skyOpen);
        skyCtl.classList.toggle('is-hero', !!hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.4); // the sky starts below the photo hero
      }
    });
  }

  /* =====================================================
     Interiors — wall visualizer (mask + shading map)
     ===================================================== */
  var ROOMS = {
    d: { img: 'img/rooms/room-d.jpg', mask: 'img/rooms/room-d-mask.webp', edge: 'img/rooms/room-d-edge.webp', fx: 0.55, fy: 0.55, tile: 0.36,
         glass: { src: 'img/rooms/room-d-glass.webp', x: 1067, y: 682 } },
    a: { img: 'img/rooms/room-a.jpg', mask: 'img/rooms/room-a-mask.webp', edge: 'img/rooms/room-a-edge.webp', fx: 0.78, fy: 0.5, tile: 0.34 },
    c: { img: 'img/rooms/room-c.jpg', mask: 'img/rooms/room-c-mask.webp', edge: 'img/rooms/room-c-edge.webp', fx: 0.5, fy: 0.5, tile: 0.34,
         glass: { src: 'img/rooms/room-c-glass.webp', x: 899, y: 407 } }
  };
  /* mask RGB = light on the wall, measured from the photo itself (255 = SHADE_GAIN x the chosen shade);
     mask alpha = coated area; edge layer = object edges with the old wall colour taken out (no halo) */
  var SHADE_GAIN = 1.3;
  var FINISHES = ['B8A389', 'B7B3A8', 'B4986D', 'C5866E', '90A488', '819BAD', '9F9287'];
  var ROOM = { id: 'd', finish: { type: 'tex', hex: 'B8A389' }, split: 0.56, cache: {}, order: [] };
  var roomCanvas = $('#roomCanvas'), roomStage = $('#roomStage');
  var imgCache = {};
  function loadImg(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise(function (res, rej) { var im = new Image(); im.decoding = 'async'; im.onload = function () { res(im); }; im.onerror = function (e) { delete imgCache[src]; rej(e); }; im.src = src; });
    return imgCache[src];
  }
  /* seamless tile without mirror symmetry and without visible seams: the texture is cross-faded with a
     half-offset copy of itself, first across x, then across y. The blend keeps the grain contrast
     (variance-preserving weights), so the cross-fade zones do not read as a softer grid on the wall. */
  function seamlessTile(src, tw, th) {
    tw = Math.max(8, Math.round(tw)); th = Math.max(8, Math.round(th));
    var c = document.createElement('canvas'); c.width = tw; c.height = th;
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(src, 0, 0, tw, th);
    var img;
    try { img = x.getImageData(0, 0, tw, th); } catch (e) { return c; }
    var p = img.data, n = tw * th, mr = 0, mg = 0, mb = 0, i, j, k;
    for (k = 0; k < n; k++) { mr += p[k * 4]; mg += p[k * 4 + 1]; mb += p[k * 4 + 2]; }
    mr /= n; mg /= n; mb /= n;
    var A = new Float32Array(n * 3), B = new Float32Array(n * 3);
    for (k = 0; k < n; k++) { A[k * 3] = p[k * 4] - mr; A[k * 3 + 1] = p[k * 4 + 1] - mg; A[k * 3 + 2] = p[k * 4 + 2] - mb; }
    function wts(len) {
      var w = new Float32Array(len * 2);
      for (var q = 0; q < len; q++) {
        var t = 1 - Math.abs(2 * (q + 0.5) / len - 1); t = t * t * (3 - 2 * t);
        var u = 1 - t, nn = 1 / Math.sqrt(t * t + u * u);
        w[q * 2] = t * nn; w[q * 2 + 1] = u * nn;
      }
      return w;
    }
    var wx = wts(tw), wy = wts(th), hw = tw >> 1, hh = th >> 1;
    for (j = 0; j < th; j++) for (i = 0; i < tw; i++) {
      var o = (j * tw + i) * 3, s2 = (j * tw + (i + hw) % tw) * 3, a = wx[i * 2], b = wx[i * 2 + 1];
      B[o] = A[o] * a + A[s2] * b; B[o + 1] = A[o + 1] * a + A[s2 + 1] * b; B[o + 2] = A[o + 2] * a + A[s2 + 2] * b;
    }
    for (j = 0; j < th; j++) {
      var a2 = wy[j * 2], b2 = wy[j * 2 + 1], js = ((j + hh) % th) * tw;
      for (i = 0; i < tw; i++) {
        var o2 = (j * tw + i) * 3, s3 = (js + i) * 3, d = (j * tw + i) * 4;
        p[d] = mr + B[o2] * a2 + B[s3] * b2; p[d + 1] = mg + B[o2 + 1] * a2 + B[s3 + 1] * b2; p[d + 2] = mb + B[o2 + 2] * a2 + B[s3 + 2] * b2; p[d + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
    return c;
  }
  /* the generator blend as a wall texture: same grain size on the wall as the catalogue textures,
     no large mottling (it would repeat from tile to tile) */
  var genTexCache = null, genTexKey = '';
  function genKey() { return compKey() + '|' + G.seed; }
  function genTexture() {
    var k = genKey();
    if (genTexCache && genTexKey === k) return genTexCache;
    var c = document.createElement('canvas'); c.width = 900; c.height = 600;
    paint(c.getContext('2d'), 900, 600, paintOpts({ scale: 0.72, mottle: 0 }));
    genTexCache = c; genTexKey = k; return c;
  }
  function finishKey(f) { return f.type === 'gen' ? 'gen:' + genKey() : f.hex; }
  function dropGenCache() {
    Object.keys(ROOM.cache).forEach(function (k) { if (k.indexOf('|gen:') > -1) delete ROOM.cache[k]; });
    ROOM.order = ROOM.order.filter(function (k) { return !!ROOM.cache[k]; });
  }
  /* clear glass in front of the wall (vase in d, decanters and tumblers in c). The photo there reads as
     old wall x T + R (T = what the glass lets through, R = its highlights); the coated wall takes the old
     wall's place, so the coating shows through while rims, edges, streaks and stems stay. The data file has
     3 stacked blocks at glass.x/y: T x wall light / SHADE_GAIN (alpha = glass coverage), R, and how much the
     glass smears the wall texture behind it (refraction). Opaque things inside carry T = 0, R = the photo. */
  function blur3(a, w, h) {
    var t = new Float32Array(a.length), o = new Float32Array(a.length), x, y, c, i, l, r;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      i = (y * w + x) * 4; l = (y * w + Math.max(0, x - 1)) * 4; r = (y * w + Math.min(w - 1, x + 1)) * 4;
      for (c = 0; c < 3; c++) t[i + c] = (a[l + c] + a[i + c] + a[r + c]) / 3;
    }
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      i = (y * w + x) * 4; l = (Math.max(0, y - 1) * w + x) * 4; r = (Math.min(h - 1, y + 1) * w + x) * 4;
      for (c = 0; c < 3; c++) o[i + c] = (t[l + c] + t[i + c] + t[r + c]) / 3;
    }
    return o;
  }
  function glassLayer(o, gimg, G) {
    var w = gimg.naturalWidth, h = Math.round(gimg.naturalHeight / 3);
    try {
      var src = o.getImageData(G.x, G.y, w, h), t = src.data;   // the bare texture tile under the glass
      var c = document.createElement('canvas'); c.width = w; c.height = h * 3;
      var x = c.getContext('2d'); x.drawImage(gimg, 0, 0);
      var gd = x.getImageData(0, 0, w, h * 3).data, n = w * h * 4;
      var b = blur3(blur3(t, w, h), w, h), i, ch, k, v;
      for (i = 0; i < n; i += 4) {
        k = gd[2 * n + i] / 255 * 0.85;
        for (ch = 0; ch < 3; ch++) {
          v = t[i + ch] + (b[i + ch] - t[i + ch]) * k;
          t[i + ch] = v * gd[i + ch] * SHADE_GAIN / 255 + gd[n + i + ch];
        }
        t[i + 3] = gd[i + 3];
      }
      c.height = h; x.putImageData(src, 0, 0);
      return c;
    } catch (e) { return null; }
  }
  function coated(roomId, finish) {
    var key = roomId + '|' + finishKey(finish);
    if (ROOM.cache[key]) return Promise.resolve(ROOM.cache[key]);
    var R = ROOMS[roomId];
    var texP = finish.type === 'gen' ? Promise.resolve(genTexture()) : loadImg('img/tex/' + finish.hex + '.webp');
    var glP = R.glass ? loadImg(R.glass.src).catch(function () { return null; }) : Promise.resolve(null);
    return Promise.all([loadImg(R.img), loadImg(R.mask), loadImg(R.edge), texP, glP]).then(function (r) {
      if (ROOM.cache[key]) return ROOM.cache[key];
      var im = r[0], mask = r[1], edge = r[2], tex = r[3];
      var W = im.naturalWidth, H = im.naturalHeight;
      var off = document.createElement('canvas'); off.width = W; off.height = H;
      var o = off.getContext('2d');
      var tw = W * R.tile, th = tw * (tex.height || tex.naturalHeight) / (tex.width || tex.naturalWidth);
      var tile = seamlessTile(tex, tw, th);
      o.fillStyle = o.createPattern(tile, 'repeat'); o.fillRect(0, 0, W, H);
      var gl = r[4] ? glassLayer(o, r[4], R.glass) : null;
      // light and contact shadows of the original wall (multiply), then back up to the true shade (x SHADE_GAIN)
      o.globalCompositeOperation = 'multiply'; o.drawImage(mask, 0, 0, W, H);
      var cp = document.createElement('canvas'); cp.width = W; cp.height = H; cp.getContext('2d').drawImage(off, 0, 0);
      o.globalCompositeOperation = 'lighter'; o.globalAlpha = SHADE_GAIN - 1; o.drawImage(cp, 0, 0);
      o.globalAlpha = 1; cp.width = cp.height = 1;
      o.globalCompositeOperation = 'destination-in'; o.drawImage(mask, 0, 0, W, H);
      // object edges laid back over the coating (their soft pixels no longer carry the old wall colour)
      o.globalCompositeOperation = 'source-over'; o.drawImage(edge, 0, 0, W, H);
      if (gl) o.drawImage(gl, R.glass.x, R.glass.y);
      ROOM.cache[key] = off; ROOM.order.push(key);
      // keep memory bounded (each entry is a full-size canvas)
      while (ROOM.order.length > 6) { var old = ROOM.order.shift(); if (old !== key) delete ROOM.cache[old]; }
      return off;
    });
  }
  /* before/after labels sit in the stage corners; a label fades out when the divider reaches it */
  var baL = $('.rooms__ba--l'), baR = $('.rooms__ba--r');
  function placeLabels() {
    if (!roomStage || !baL || !baR) return;
    var st = roomStage.getBoundingClientRect(); if (!st.width) return;
    var lx = st.left + st.width * ROOM.split, gap = 14;
    // the round handle stays whole inside the stage near the edges (the divider line itself is not moved)
    var hx = st.width * ROOM.split, hm = 30;
    roomStage.style.setProperty('--hx', (Math.max(hm, Math.min(st.width - hm, hx)) - hx).toFixed(1) + 'px');
    var l = baL.getBoundingClientRect(), r = baR.getBoundingClientRect();
    baL.classList.toggle('is-off', lx < l.right + gap);
    baR.classList.toggle('is-off', lx > r.left - gap);
  }
  var roomToken = 0, roomView = { key: '' };
  function drawRoom() {
    if (!roomCanvas) return;
    var tok = ++roomToken, R = ROOMS[ROOM.id];
    placeLabels();
    roomStage.style.setProperty('--x', (ROOM.split * 100).toFixed(2) + '%');
    Promise.all([loadImg(R.img), coated(ROOM.id, ROOM.finish)]).then(function (r) {
      if (tok !== roomToken) return;
      sizeCanvas(roomCanvas, 2400);
      var im = r[0], off = r[1], cw = roomCanvas.width, ch = roomCanvas.height;
      // both layers are resampled to the canvas size once; dragging the divider then only blits them
      var vk = ROOM.id + '|' + finishKey(ROOM.finish) + '|' + cw + 'x' + ch;
      if (roomView.key !== vk || roomView.off !== off) {
        var s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
        var dw = im.naturalWidth * s, dh = im.naturalHeight * s;
        var dx = (cw - dw) * R.fx, dy = (ch - dh) * R.fy;
        [['base', im], ['coat', off]].forEach(function (l) {
          var c = roomView[l[0]] || (roomView[l[0]] = document.createElement('canvas'));
          if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
          var x = c.getContext('2d');
          x.clearRect(0, 0, cw, ch); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
          x.drawImage(l[1], dx, dy, dw, dh);
        });
        roomView.key = vk; roomView.off = off;
      }
      var ctx = roomCanvas.getContext('2d');
      ctx.drawImage(roomView.base, 0, 0);
      var sx = Math.round(cw * ROOM.split);
      if (sx > 0) ctx.drawImage(roomView.coat, 0, 0, sx, ch, 0, 0, sx, ch);
    }).catch(function () {});
  }
  function renderRoomChips() {
    var el = $('#roomChips'); if (!el) return;
    var h = FINISHES.map(function (hex) {
      var s = BY_HEX[hex], on = ROOM.finish.type === 'tex' && ROOM.finish.hex === hex;
      return '<button type="button" class="rchip' + (on ? ' is-on' : '') + '" data-hex="' + hex + '"><span class="th" style="background-image:url(img/tex/' + hex + '.webp)"></span>' + short(s) + '</button>';
    }).join('');
    h += '<button type="button" class="rchip rchip--gen' + (ROOM.finish.type === 'gen' ? ' is-on' : '') + '" data-gen="1"><canvas class="th" width="64" height="64"></canvas>' + T[lang].your + '</button>';
    el.innerHTML = h;
    genThumbs();
  }
  function updateRoomNow() {
    var el = $('#roomNow'); if (!el) return;
    if (ROOM.finish.type === 'gen') {
      el.innerHTML = '<canvas class="th" width="72" height="72" style="border-radius:50%"></canvas><div><b>' + T[lang].your + '</b><small>' + T[lang].gen + ' · № ' + (G.no || '') + '</small></div>';
      genThumbs();
    } else {
      var s = BY_HEX[ROOM.finish.hex];
      el.innerHTML = '<span class="th" style="background-image:url(img/tex/' + s.hex + '.webp)"></span><div><b>' + fullCode(s) + '</b><small>' + T[lang].catTex + '</small></div>';
    }
  }
  if (roomCanvas) {
    $('#roomChips').addEventListener('click', function (e) {
      var b = e.target.closest('.rchip'); if (!b) return;
      ROOM.finish = b.hasAttribute('data-gen') ? { type: 'gen' } : { type: 'tex', hex: b.getAttribute('data-hex') };
      renderRoomChips(); updateRoomNow(); drawRoom();
    });
    $$('.rtab').forEach(function (t) {
      t.addEventListener('click', function () {
        ROOM.id = t.getAttribute('data-room');
        $$('.rtab').forEach(function (x) { x.classList.toggle('is-on', x === t); });
        drawRoom();
      });
    });
    var dragging = false, rafSplit = 0;
    var setSplit = function (e) {
      var r = roomStage.getBoundingClientRect();
      ROOM.split = Math.max(0.02, Math.min(0.98, (e.clientX - r.left) / r.width));
      if (!rafSplit) rafSplit = requestAnimationFrame(function () { rafSplit = 0; drawRoom(); });
    };
    roomStage.addEventListener('pointerdown', function (e) { dragging = true; if (roomStage.setPointerCapture) roomStage.setPointerCapture(e.pointerId); setSplit(e); });
    roomStage.addEventListener('pointermove', function (e) { if (dragging) setSplit(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { roomStage.addEventListener(ev, function () { dragging = false; }); });
    if ('IntersectionObserver' in window && !reduce) {
      var hinted = false;
      new IntersectionObserver(function (ents) {
        if (!ents[0].isIntersecting || hinted) return; hinted = true;
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - k, 3);
          ROOM.split = 0.92 - (0.92 - 0.56) * e; drawRoom();
          if (k < 1 && !dragging) requestAnimationFrame(step);
        })(t0);
      }, { threshold: 0.35 }).observe(roomStage);
    }
  }

  /* =====================================================
     Video placeholders + decorative canvases
     ===================================================== */
  $$('.vcard').forEach(function (v) {
    v.addEventListener('click', function () {
      v.classList.add('is-msg'); clearTimeout(v._t);
      v._t = setTimeout(function () { v.classList.remove('is-msg'); }, 2200);
    });
  });
  function drawPoster() {
    var pc = $('#posterCanvas'); if (!pc) return;
    sizeCanvas(pc, 1000);
    paint(pc.getContext('2d'), pc.width, pc.height, { mix: [{ hex: 'B7B3A8', p: 40 }, { hex: '989492', p: 20 }, { hex: 'C5866E', p: 20 }, { hex: 'C8CBC4', p: 20 }], density: 1, grain: 1.1, scale: 1.6, seed: 5 });
  }
  function drawPosterRoom() {
    var pr = $('#posterRoom'); if (!pr) return;
    Promise.all([loadImg(ROOMS.a.img), coated('a', { type: 'tex', hex: 'B8A389' })]).then(function (r) {
      sizeCanvas(pr, 1500);
      var im = r[0], off = r[1], cw = pr.width, ch = pr.height;
      var s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      var dx = (cw - dw) * 0.5, dy = (ch - dh) * 0.45, x = pr.getContext('2d');
      x.drawImage(im, dx, dy, dw, dh); x.drawImage(off, dx, dy, dw, dh);
    }).catch(function () {});
  }

  /* =====================================================
     Live sky — page background driven by local time + season.
     Colours are interpolated in OKLab between five light states
     (night · dawn · day · golden hour · dusk) keyed to the
     sunrise/sunset of the current month, then tinted by season.
     Only the page background changes; the studio is neutral.
     ===================================================== */
  var SKY_PAL = {
    night: { top: '#8E97A8', mid: '#B3B9C3', bot: '#CCCDCF', glow: '#EEF2F8', ga: 0.46, dim: 1 },
    dawn: { top: '#D5C4D0', mid: '#EBD6CB', bot: '#F2E6DC', glow: '#FFD2B4', ga: 0.72, dim: 0.28 },
    day: { top: '#E8E5DF', mid: '#F1EDE6', bot: '#F2EDE5', glow: '#FFFDF6', ga: 0.7, dim: 0 },
    golden: { top: '#E9D1B5', mid: '#F1DEC8', bot: '#F4E8DA', glow: '#FFC58C', ga: 0.42, dim: 0.08 },
    dusk: { top: '#AFA9BF', mid: '#CFC5CC', bot: '#E1D7D1', glow: '#F2BAA1', ga: 0.46, dim: 0.62 }
  };
  var SEASON_TINT = ['#B2C3DA', '#C8DCC0', '#F4D8AB', '#E1B086']; // winter, spring, summer, autumn
  var SEASON_DOY = [15, 105, 196, 288];
  // mid-month sunrise / sunset (local time, minutes) for ~50°N (Kyiv)
  var SUN = [[473, 980], [435, 1032], [374, 1079], [365, 1185], [310, 1230], [287, 1272], [300, 1265], [345, 1220], [390, 1150], [435, 1085], [430, 985], [470, 960]];
  var TXT = { day: { ml: '#6e655a', mute: '#a3988b', brass: '#7f6d58' }, night: { ml: '#39352f', mute: '#57524c', brass: '#4d4033' } };
  var PAL_LAB = {};
  Object.keys(SKY_PAL).forEach(function (k) { var p = SKY_PAL[k]; PAL_LAB[k] = { top: lab(p.top), mid: lab(p.mid), bot: lab(p.bot), glow: hx(p.glow), ga: p.ga, dim: p.dim }; });
  var SEASON_LAB = SEASON_TINT.map(lab);
  var SKY = { t: null, s: null, play: false, info: null };
  var skyOpen = false;

  function doyOf(d) { var s = new Date(d.getFullYear(), 0, 0); return Math.floor((d - s) / 864e5); }
  function sunFor(doy) {
    var mf = (doy - 15) / 30.44, i = Math.floor(mf), f = mf - i;
    var a = SUN[((i % 12) + 12) % 12], b = SUN[(((i + 1) % 12) + 12) % 12];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }
  function seasonWeights(doy) {
    var w = [0, 0, 0, 0];
    for (var k = 0; k < 4; k++) {
      var a = SEASON_DOY[k], b = SEASON_DOY[(k + 1) % 4] + (k === 3 ? 365 : 0), d = doy < a && k === 3 ? doy + 365 : doy;
      if (d >= a && d < b) { var f = (d - a) / (b - a); f = f * f * (3 - 2 * f); w[k] = 1 - f; w[(k + 1) % 4] = f; return w; }
    }
    w[0] = 1; return w; // Jan 1–14: winter
  }
  function smooth(f) { f = Math.max(0, Math.min(1, f)); return f * f * (3 - 2 * f); }
  function phaseAt(t, R, S) {
    var K = [[0, 'night'], [R - 100, 'night'], [R - 30, 'dawn'], [R + 45, 'dawn'], [R + 140, 'day'], [S - 160, 'day'], [S - 65, 'golden'], [S - 5, 'golden'], [S + 40, 'dusk'], [S + 110, 'night'], [1440, 'night']];
    for (var i = 0; i < K.length - 1; i++) if (t >= K[i][0] && t < K[i + 1][0]) return { a: K[i][1], b: K[i + 1][1], f: smooth((t - K[i][0]) / Math.max(1, K[i + 1][0] - K[i][0])) };
    return { a: 'night', b: 'night', f: 0 };
  }
  function skyState() {
    var now = new Date(), t = SKY.t != null ? SKY.t : now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    var doy = SKY.s != null ? SEASON_DOY[SKY.s] : doyOf(now);
    var sun = sunFor(doy), R = sun[0], S = sun[1], ph = phaseAt(t, R, S), A = PAL_LAB[ph.a], B = PAL_LAB[ph.b], f = ph.f;
    var sw = SKY.s != null ? [0, 1, 2, 3].map(function (k) { return k === SKY.s ? 1 : 0; }) : seasonWeights(doy);
    var tint = [0, 0, 0]; sw.forEach(function (w, k) { tint = [tint[0] + SEASON_LAB[k][0] * w, tint[1] + SEASON_LAB[k][1] * w, tint[2] + SEASON_LAB[k][2] * w]; });
    var dim = A.dim + (B.dim - A.dim) * f, tk = 1 - 0.45 * dim;
    var night = (ph.a === 'night' ? 1 - f : 0) + (ph.b === 'night' ? f : 0);
    var sx, sy;
    if (t < R) { sx = 6; sy = 88; } else if (t > S) { sx = 94; sy = 88; } else { var k2 = (t - R) / (S - R); sx = 6 + 88 * k2; sy = 86 - 72 * Math.sin(Math.PI * k2); }
    var gl = [A.glow[0] + (B.glow[0] - A.glow[0]) * f, A.glow[1] + (B.glow[1] - A.glow[1]) * f, A.glow[2] + (B.glow[2] - A.glow[2]) * f];
    var season = sw.indexOf(Math.max.apply(null, sw));
    var main = f < 0.5 ? ph.a : ph.b;
    return {
      t: t, R: R, S: S, phase: main, season: season, dim: dim,
      top: labHex(lmix(lmix(A.top, B.top, f), tint, 0.2 * tk)),
      mid: labHex(lmix(lmix(A.mid, B.mid, f), tint, 0.11 * tk)),
      bot: labHex(lmix(lmix(A.bot, B.bot, f), tint, 0.05 * tk)),
      glow: css(gl, (A.ga + (B.ga - A.ga) * f).toFixed(3)),
      tint: css(hx(labHex(tint)), (0.3 * tk).toFixed(3)),
      gx: (sx + (78 - sx) * night).toFixed(2) + '%', gy: (sy + (12 - sy) * night).toFixed(2) + '%'
    };
  }
  var rootStyle = document.documentElement.style, lastTxt = '';
  function applySky() {
    var s = skyState(); SKY.info = s;
    rootStyle.setProperty('--sky-top', s.top); rootStyle.setProperty('--sky-mid', s.mid); rootStyle.setProperty('--sky-bot', s.bot);
    rootStyle.setProperty('--sky-glow', s.glow); rootStyle.setProperty('--sky-tint', s.tint);
    rootStyle.setProperty('--sky-gx', s.gx); rootStyle.setProperty('--sky-gy', s.gy);
    // text on the sky stays readable when the light dims
    var d = Math.round(s.dim * 20) / 20, key = String(d);
    if (key !== lastTxt) {
      lastTxt = key;
      rootStyle.setProperty('--ml', labHex(lmix(lab(TXT.day.ml), lab(TXT.night.ml), d)));
      rootStyle.setProperty('--mute-l', labHex(lmix(lab(TXT.day.mute), lab(TXT.night.mute), d)));
      rootStyle.setProperty('--brass-l', labHex(lmix(lab(TXT.day.brass), lab(TXT.night.brass), d)));
    }
    document.documentElement.setAttribute('data-sky', s.phase);
    skyUI();
  }
  function hhmm(t) { t = ((Math.round(t) % 1440) + 1440) % 1440; var h = Math.floor(t / 60), m = t % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  var ICO_SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>';
  var ICO_MOON = '<path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z"/>';
  var ICO_HALF = '<path d="M4 17h16M7 17a5 5 0 0 1 10 0M12 7.5v2M6.3 10.3l1.3 1.3M17.7 10.3l-1.3 1.3"/>';
  function skyUI() {
    var s = SKY.info; if (!s || !$('#skyPill')) return;
    var L = T[lang], live = SKY.t == null && SKY.s == null;
    $('#skyIco').innerHTML = s.phase === 'night' ? ICO_MOON : (s.phase === 'dawn' || s.phase === 'dusk' ? ICO_HALF : ICO_SUN);
    $('#skyPillTxt').textContent = hhmm(s.t) + ' · ' + L.seasons[s.season];
    $('#skyPill').setAttribute('aria-label', L.skyPill + ': ' + hhmm(s.t) + ', ' + L.phases[s.phase] + ', ' + L.seasons[s.season]);
    $('#skyPill').title = L.skyPill + ' · ' + L.phases[s.phase];
    $('#skyTimeVal').textContent = hhmm(s.t);
    $('#skyPhase').textContent = L.phases[s.phase];
    $('#skySeasonVal').textContent = L.seasons[s.season];
    var tr = $('#skyTime'); if (document.activeElement !== tr) tr.value = Math.round(s.t / 5) * 5 % 1440; rangeFill(tr);
    $('#skySeason').innerHTML = L.seasonsCap.map(function (n, k) { return '<button type="button" data-s="' + k + '" class="' + (s.season === k ? 'is-on' : '') + '" aria-pressed="' + (s.season === k) + '">' + n + '</button>'; }).join('');
    $('#skyLive').classList.toggle('is-on', live);
    var pb = $('#skyPlay'); pb.classList.toggle('is-on', SKY.play);
    pb.innerHTML = (SKY.play ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>') + '<span>' + (SKY.play ? L.pause : L.play) + '</span>';
  }
  var playRaf = 0, playLast = 0;
  function playStep(now) {
    if (!SKY.play) return;
    if (!playLast) playLast = now;
    var dt = now - playLast;
    if (dt > 45) { SKY.t = ((SKY.t == null ? 0 : SKY.t) + dt / 24000 * 1440) % 1440; playLast = now; applySky(); }
    playRaf = requestAnimationFrame(playStep);
  }
  function setPlay(on) {
    SKY.play = on; cancelAnimationFrame(playRaf); playLast = 0;
    if (on) { if (SKY.t == null) SKY.t = SKY.info ? SKY.info.t : 0; playRaf = requestAnimationFrame(playStep); }
    skyUI();
  }
  function openSky(open) {
    skyOpen = open; var pop = $('#skyPop'); pop.hidden = !open;
    $('#skyPill').setAttribute('aria-expanded', open ? 'true' : 'false');
    skyCtl.classList.toggle('is-open', open);
    if (open) skyCtl.classList.remove('is-away', 'is-mini'); else scrollTick();
  }
  if (skyCtl) {
    $('#skyPill').addEventListener('click', function () { openSky(!skyOpen); });
    $('#skyClose').addEventListener('click', function () { openSky(false); $('#skyPill').focus(); });
    $('#skyTime').addEventListener('input', function (e) { if (SKY.play) setPlay(false); SKY.t = +e.target.value; applySky(); });
    $('#skySeason').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; SKY.s = +b.getAttribute('data-s'); applySky(); });
    $('#skyPlay').addEventListener('click', function () { setPlay(!SKY.play); });
    $('#skyLive').addEventListener('click', function () { setPlay(false); SKY.t = null; SKY.s = null; applySky(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && skyOpen) openSky(false); });
    document.addEventListener('pointerdown', function (e) { if (skyOpen && !skyCtl.contains(e.target)) openSky(false); });
  }
  // demo / QA deep links: ?sky=night|dawn|day|golden|dusk or ?t=21:40, &season=winter|spring|summer|autumn
  (function () {
    var sp = /[?&]season=(winter|spring|summer|autumn)/i.exec(location.search);
    if (sp) SKY.s = ['winter', 'spring', 'summer', 'autumn'].indexOf(sp[1].toLowerCase());
    var tp = /[?&]t=(\d{1,2})[:.]?(\d{2})/.exec(location.search);
    if (tp) SKY.t = (+tp[1] % 24) * 60 + (+tp[2] % 60);
    var ph = /[?&]sky=(night|dawn|day|golden|dusk)/i.exec(location.search);
    if (ph) {
      var sun = sunFor(SKY.s != null ? SEASON_DOY[SKY.s] : doyOf(new Date()));
      SKY.t = { night: 60, dawn: sun[0] + 5, day: 13 * 60, golden: sun[1] - 35, dusk: sun[1] + 22 }[ph[1].toLowerCase()];
    }
  })();
  setInterval(function () { if (SKY.t == null) applySky(); }, 20000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) applySky(); });

  /* =====================================================
     Boot
     ===================================================== */
  var saved = null;
  try { saved = localStorage.getItem('dv-lang'); } catch (e) {}
  var qp = /[?&]lang=(en|uk|ua)/i.exec(location.search);
  var startLang = qp ? (qp[1].toLowerCase() === 'en' ? 'en' : 'uk') : (saved || 'uk');

  applySky();
  renderPresets();
  renderCards();
  setLang(startLang, false);
  initReveal();
  drawGen(false);
  renderRoomChips(); updateRoomNow(); drawRoom();
  drawPoster(); drawPosterRoom();
  onScroll();

  var rT = 0, lastW = window.innerWidth, lastH = window.innerHeight;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      var dw = Math.abs(window.innerWidth - lastW), dh = Math.abs(window.innerHeight - lastH);
      if (dw < 2 && dh < 2) return;
      if (dw < 2 && mqSmall.matches) return; // ignore mobile URL-bar height changes
      lastW = window.innerWidth; lastH = window.innerHeight;
      drawGen(false); drawRoom(); drawPoster(); drawPosterRoom(); scrollTick();
    }, 180);
  });

})();
