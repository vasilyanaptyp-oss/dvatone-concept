/* DVATONE — homepage concept · app.js */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* =====================================================
     Real catalog data (dvatone.com/new-shards/*.json)
     ===================================================== */
  var SHADES = [
    { code: 'RAL 1039', sys: 'RAL', hex: 'B8A389' },
    { code: 'RAL 7044', sys: 'RAL', hex: 'B7B3A8' },
    { code: 'F3.24.57', sys: '5051', hex: 'B4986D' },
    { code: 'RAL 3012', sys: 'RAL', hex: 'C5866E' },
    { code: 'S 3020-G20Y', sys: 'NCS', hex: '90A488' },
    { code: 'S 3020-R90B', sys: 'NCS', hex: '819BAD' },
    { code: 'S 4005-Y50R', sys: 'NCS', hex: '9F9287' },
    { code: 'B1.18.51', sys: '5051', hex: 'B87C7E' },
    { code: 'S 3020-Y', sys: 'NCS', hex: 'B6A277' },
    { code: 'RAL 7036', sys: 'RAL', hex: '989492' },
    { code: 'D6.04.78', sys: '5051', hex: 'E1D2CA' },
    { code: 'S 3020-Y40R', sys: 'NCS', hex: 'BA9377' },
    { code: 'RAL 9018', sys: 'RAL', hex: 'C8CBC4' },
    { code: 'RAL 1015', sys: 'RAL', hex: 'E4D1B4' },
    { code: 'RAL 7038', sys: 'RAL', hex: 'AFB1A8' },
    { code: 'S 4000-N', sys: 'NCS', hex: '999997' },
    { code: 'RAL 1001', sys: 'RAL', hex: 'CFB084' }
  ];
  var BY_HEX = {};
  SHADES.forEach(function (s) { BY_HEX[s.hex] = s; });
  function fullCode(s) { return s.sys === 'NCS' ? 'NCS ' + s.code : (s.sys === '5051' ? '5051 · ' + s.code : s.code); }

  var PRESETS = [
    { id: 'mineral', uk: 'Мінерал', en: 'Mineral', base: 'B8A389', acc: ['B4986D', '9F9287', 'E4D1B4'] },
    { id: 'granite', uk: 'Граніт', en: 'Granite', base: 'B7B3A8', acc: ['989492', '999997', 'C8CBC4'] },
    { id: 'terra', uk: 'Теракота', en: 'Terracotta', base: 'C5866E', acc: ['B87C7E', 'BA9377', 'E1D2CA'] },
    { id: 'sage', uk: 'Шавлія', en: 'Sage', base: '90A488', acc: ['AFB1A8', '819BAD', 'C8CBC4'] }
  ];

  /* =====================================================
     i18n (UA default, captured from DOM; EN dictionary)
     ===================================================== */
  var EN = {
    'skip': 'Skip to content',
    'nav.collection': 'Collection', 'nav.generator': 'Generator', 'nav.interiors': 'Interiors', 'nav.video': 'Video', 'nav.contact': 'Contact', 'nav.cta': 'Consultation',
    'hero.eyebrow': 'Architectural multicolor coatings',
    'hero.t1': 'Shape your space', 'hero.t2': 'with <em>character</em>',
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
    'col.label': 'Collection', 'col.title': 'Shades with <em>character</em>',
    'col.lede': 'Every shade is a multi-tonal texture: a base color and countless micro-particles that catch the light in different ways.',
    'col.all': 'All', 'col.all_link': 'Full catalog — 1,066 shades', 'col.flag_k': 'Flagship', 'col.flag_cta': 'Create a similar blend',
    'gen.label': 'Composition generator', 'gen.title': 'Compose your own <em>multicolor</em> finish',
    'gen.lede': 'Pick a base and 2–4 accent shades — the preview updates instantly. Try the result in an interior or send it to a consultant.',
    'gen.app': 'Generator', 'gen.wall': 'Wall', 'gen.macro': 'Macro', 'gen.id': 'Blend', 'gen.base': 'Base', 'gen.acc': 'Accents · 2–4',
    'gen.density': 'Particle density', 'gen.grain': 'Grain size', 'gen.presets': 'Curated blends', 'gen.shuffle': 'Another blend',
    'gen.try': 'Try it in an interior', 'gen.send': 'Discuss with a consultant',
    'gen.note': 'Chips are real shades from the Dvatone catalog (NCS, 5051, RAL). The preview is generated live and conveys the character of the texture; confirm the final blend with a consultant.',
    'rooms.label': 'Interior visualization', 'rooms.title': 'Texture in the room, <em>not on a swatch</em>',
    'rooms.lede': 'Pick an interior and a finish — the coating is laid onto the wall plane, respecting light and shadow. Drag the slider to compare before and after.',
    'rooms.r1': 'Living room', 'rooms.r2': 'Lounge', 'rooms.r3': 'Dining room', 'rooms.badge': 'Visualization', 'rooms.after': 'With coating', 'rooms.before': 'Original',
    'rooms.note': 'Interior photos: Unsplash, used for visualization. The texture is mapped onto the wall plane; the real look depends on lighting and application method.',
    'vid.label': 'Video', 'vid.title': 'A process <em>worth seeing</em>',
    'vid.lede': 'From catalog to finished wall: application, a tour of the collection and the generator at work — short and to the point.',
    'vid.tag': 'Video', 'vid.v1': 'Application process', 'vid.v1s': 'Video guide', 'vid.v2': 'Catalog overview', 'vid.v2s': 'Shade collection',
    'vid.v3': 'Generator: demo', 'vid.v3s': 'How to compose a blend', 'vid.soon': 'Your video goes here',
    'steps.label': 'How to choose', 'steps.title': 'Three steps to a <em>confident</em> decision',
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
    uk: { tip: 'У генератор', add: 'Додати в генератор', blend: 'Склад', base: 'База', your: 'Ваша композиція', gen: 'Генератор', catTex: 'фактура каталогу',
          title: 'DVATONE — Створіть простір з характером', desc: "DVATONE — архітектурні мультиколорові покриття від Dialcolor. Каталог відтінків, генератор композицій, візуалізація в інтер'єрі." },
    en: { tip: 'To generator', add: 'Add to generator', blend: 'Blend', base: 'Base', your: 'Your blend', gen: 'Generator', catTex: 'catalog texture',
          title: 'DVATONE — Shape your space with character', desc: 'DVATONE — architectural multicolor coatings by Dialcolor. Shade catalog, composition generator, interior visualization.' }
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
    if (save) { try { localStorage.setItem('dv-lang', lang); } catch (e) {} }
    renderCards(); renderPresets(); updateGenUI(); renderRoomChips(); updateRoomNow();
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
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

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
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* =====================================================
     Speckle engine — procedural multicolor finish
     ===================================================== */
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hx(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function tone(c, k) { return k < 0 ? [c[0] * (1 + k), c[1] * (1 + k), c[2] * (1 + k)] : [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k, c[2] + (255 - c[2]) * k]; }
  function css(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a == null ? 1 : a) + ')'; }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  var noiseTile = null;
  function getNoise() {
    if (noiseTile) return noiseTile;
    var c = document.createElement('canvas'); c.width = c.height = 160;
    var x = c.getContext('2d'), d = x.createImageData(160, 160), r = rng(7);
    for (var i = 0; i < d.data.length; i += 4) { var v = 110 + r() * 60 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); noiseTile = c; return c;
  }

  /**
   * paint(ctx, W, H, {base, acc[], density 0..1, grain, scale, seed, mottle})
   */
  function paint(ctx, W, H, o) {
    var R = rng(o.seed || 1), b = hx(o.base), acc = o.acc || [];
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = css(b); ctx.fillRect(0, 0, W, H);
    // soft tonal mottling of the base coat
    var mot = o.mottle == null ? 14 : o.mottle;
    for (var m = 0; m < mot; m++) {
      var mx = R() * W, my = R() * H, mr = (0.12 + R() * 0.32) * Math.max(W, H);
      var mc = tone(b, R() < 0.5 ? -0.1 : 0.07), g = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
      g.addColorStop(0, css(mc, 0.32)); g.addColorStop(1, css(mc, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // flake palette: base tonal variants + each accent in 3 tones + mineral dark + light spark
    var pal = [
      { c: tone(b, -0.36), w: 0.12 }, { c: tone(b, -0.16), w: 0.12 }, { c: tone(b, 0.16), w: 0.08 }
    ];
    var share = acc.length ? 0.62 / acc.length : 0;
    acc.forEach(function (h) { var a = hx(h); pal.push({ c: tone(a, -0.34), w: share * 0.34 }, { c: a, w: share * 0.44 }, { c: tone(a, 0.18), w: share * 0.22 }); });
    pal.push({ c: [44, 38, 32], w: 0.016 });
    if (o.spark !== false) pal.push({ c: [250, 246, 238], w: 0.004 });
    var tot = 0; pal.forEach(function (p) { tot += p.w; });
    var cum = [], acc2 = 0; pal.forEach(function (p) { acc2 += p.w / tot; cum.push(acc2); });
    var paths = pal.map(function () { return new Path2D(); });

    var unit = Math.sqrt(W * H) / 900 * (o.scale || 1);
    var gr = o.grain || 1, den = o.density == null ? 0.6 : o.density;
    var N = Math.min(170000, Math.round(W * H * coverC(den) / (unit * unit * gr * gr)));
    for (var i = 0; i < N; i++) {
      var u = R(), k = 0; while (k < cum.length - 1 && u > cum[k]) k++;
      var p = paths[k], x = R() * W, y = R() * H;
      var r = unit * gr * (0.5 + Math.pow(R(), 2.7) * 3.6);
      var n = 5 + (R() * 3 | 0), a0 = R() * 6.283;
      for (var j = 0; j < n; j++) {
        var ang = a0 + j / n * 6.283 + (R() - 0.5) * 0.9, rr = r * (0.5 + R() * 0.65);
        var px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr * (0.75 + R() * 0.3);
        if (j === 0) p.moveTo(px, py); else p.lineTo(px, py);
      }
      p.closePath();
    }
    // draw darker/base variants first, sparks last
    var order = pal.map(function (_, idx) { return idx; });
    order.sort(function (a, c) { return lum(pal[a].c) - lum(pal[c].c); });
    order.forEach(function (idx) { ctx.fillStyle = css(pal[idx].c); ctx.fill(paths[idx]); });
    // micro grain
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = ctx.createPattern(getNoise(), 'repeat');
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  function coverC(den) { return 0.06 + 0.16 * den; }
  function coverage(den) { return 1 - Math.exp(-5.6 * coverC(den)); }
  function lum(c) { return c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114; }

  /* =====================================================
     Collection
     ===================================================== */
  var cardsEl = $('#cards'), curFilter = 'all';
  var CARD_SET = ['B7B3A8', 'B8A389', 'C5866E', '90A488', 'B4986D', '819BAD', '9F9287', 'B87C7E', 'BA9377', 'E1D2CA', 'C8CBC4', 'B6A277', '989492', 'E4D1B4', '999997', 'AFB1A8', 'CFB084'];
  function renderCards() {
    if (!cardsEl) return;
    var html = '';
    var list = CARD_SET.map(function (h) { return BY_HEX[h]; }).filter(function (s) { return curFilter === 'all' || s.sys === curFilter; });
    if (curFilter === 'all') list = list.slice(0, 12);
    list.forEach(function (s) {
      html += '<article class="card">' +
        '<div class="card__img"><img src="img/tex/' + s.hex + '.webp" alt="' + fullCode(s) + '" loading="lazy" width="900" height="600"><span class="card__tip">' + T[lang].tip + '</span></div>' +
        '<div class="card__b"><div class="card__code"><b>' + (s.sys === 'NCS' ? 'NCS ' : '') + s.code + '</b><small><i style="background:#' + s.hex + '"></i>' + s.sys + ' · #' + s.hex + '</small></div>' +
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
    G.base = hex; G.acc = G.acc.filter(function (a) { return a !== hex; });
    if (G.acc.length < 2) G.acc = pickAccents(hex, 3);
    G.seed = (G.seed + 1) % 99991; genChanged();
    document.getElementById('generator').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  var flagBtn = $('.flag .btn');
  if (flagBtn) flagBtn.addEventListener('click', function () { applyPreset(PRESETS[0]); });

  function pickAccents(base, n) {
    var b = hx(base), others = SHADES.filter(function (s) { return s.hex !== base; });
    others.sort(function (a, c) { return dist(hx(a.hex), b) - dist(hx(c.hex), b); });
    return others.slice(1, 1 + n).map(function (s) { return s.hex; });
  }
  function dist(a, b) { return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2); }

  /* =====================================================
     Generator
     ===================================================== */
  var G = { base: 'B8A389', acc: ['B4986D', '9F9287', 'E4D1B4'], density: 0.6, grain: 1, scale: 'wall', seed: 11 };
  var genCanvas = $('#genCanvas'), baseSw = $('#baseSw'), accSw = $('#accSw');
  var genDirty = true, genVisible = true, rafId = 0;

  function buildSwatches() {
    var bh = '', ah = '';
    SHADES.forEach(function (s) {
      var t = fullCode(s) + ' · #' + s.hex;
      bh += '<button type="button" class="sw" role="radio" data-hex="' + s.hex + '" title="' + t + '" aria-label="' + t + '" style="background:#' + s.hex + '"></button>';
      ah += '<button type="button" class="sw" data-hex="' + s.hex + '" title="' + t + '" aria-label="' + t + '" aria-pressed="false" style="background:#' + s.hex + '"><i></i></button>';
    });
    baseSw.innerHTML = bh; accSw.innerHTML = ah;
  }
  function updateGenUI() {
    if (!baseSw) return;
    $$('.sw', baseSw).forEach(function (el) { var on = el.getAttribute('data-hex') === G.base; el.classList.toggle('is-on', on); el.setAttribute('aria-checked', on ? 'true' : 'false'); });
    $$('.sw', accSw).forEach(function (el) {
      var i = G.acc.indexOf(el.getAttribute('data-hex'));
      el.classList.toggle('is-on', i > -1); el.setAttribute('aria-pressed', i > -1 ? 'true' : 'false');
      el.querySelector('i').textContent = i > -1 ? (i + 1) : '';
      el.disabled = el.getAttribute('data-hex') === G.base; el.style.opacity = el.disabled ? .25 : '';
    });
    $('#baseName').textContent = fullCode(BY_HEX[G.base]);
    $('#accCount').textContent = G.acc.length + ' / 4';
    $('#densVal').textContent = Math.round(G.density * 100) + '%';
    $$('#grain button').forEach(function (b) { b.classList.toggle('is-on', parseFloat(b.getAttribute('data-g')) === G.grain); });
    $$('.app__tab').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-scale') === G.scale); });
    var key = G.base + G.acc.join('') + G.density + G.grain;
    $('#compId').textContent = '#' + (hashStr(key) >>> 0).toString(16).slice(-4).toUpperCase();
    // legend + ratio
    var cov = coverage(G.density);
    var basePct = Math.round(100 * (0.33 * cov + (1 - cov)));
    var rest = 100 - basePct, each = G.acc.length ? rest / G.acc.length : 0;
    var lg = '<span class="lg-h">' + T[lang].blend + '</span>' +
      '<div><i style="background:#' + G.base + '"></i><span>' + T[lang].base + ' · ' + fullCode(BY_HEX[G.base]) + '</span><b>' + basePct + '%</b></div>';
    var rt = '<i style="flex-grow:' + basePct + ';background:#' + G.base + '"></i>';
    G.acc.forEach(function (h, idx) {
      var pct = idx === G.acc.length - 1 ? rest - Math.round(each) * (G.acc.length - 1) : Math.round(each);
      lg += '<div><i style="background:#' + h + '"></i><span>' + fullCode(BY_HEX[h]) + '</span><b>' + pct + '%</b></div>';
      rt += '<i style="flex-grow:' + pct + ';background:#' + h + '"></i>';
    });
    $('#legend').innerHTML = lg; $('#ratio').innerHTML = rt;
  }
  function sizeCanvas(cv, maxW) {
    var r = cv.getBoundingClientRect();
    var w = Math.max(1, Math.round(Math.min(r.width * DPR, maxW || 1800))), h = Math.max(1, Math.round(w * r.height / Math.max(1, r.width)));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; return true; }
    return false;
  }
  function drawGen() {
    if (!genCanvas) return;
    sizeCanvas(genCanvas, 1700);
    var ctx = genCanvas.getContext('2d');
    paint(ctx, genCanvas.width, genCanvas.height, { base: G.base, acc: G.acc, density: G.density, grain: G.grain, scale: G.scale === 'macro' ? 2.8 : 1.2, seed: G.seed });
    genDirty = false;
  }
  function genChanged() {
    updateGenUI(); genDirty = true; genTexCache = null;
    if (!rafId) rafId = requestAnimationFrame(function () { rafId = 0; drawGen(); });
    if (ROOM.finish && ROOM.finish.type === 'gen') { ROOM.cache = {}; drawRoom(); }
    renderRoomChips();
  }
  function applyPreset(p) { G.base = p.base; G.acc = p.acc.slice(); G.seed = hashStr(p.id) % 99991; genChanged(); }
  function renderPresets() {
    var el = $('#presets'); if (!el) return;
    el.innerHTML = PRESETS.map(function (p) {
      var dots = [p.base].concat(p.acc).map(function (h) { return '<i style="background:#' + h + '"></i>'; }).join('');
      return '<button type="button" class="preset" data-p="' + p.id + '"><span class="dots">' + dots + '</span>' + p[lang] + '</button>';
    }).join('');
  }

  if (genCanvas) {
    buildSwatches();
    baseSw.addEventListener('click', function (e) {
      var b = e.target.closest('.sw'); if (!b) return;
      var h = b.getAttribute('data-hex'); if (h === G.base) return;
      G.base = h; G.acc = G.acc.filter(function (a) { return a !== h; });
      if (G.acc.length < 2) G.acc = G.acc.concat(pickAccents(h, 3).filter(function (x) { return G.acc.indexOf(x) < 0; })).slice(0, 3);
      genChanged();
    });
    accSw.addEventListener('click', function (e) {
      var b = e.target.closest('.sw'); if (!b || b.disabled) return;
      var h = b.getAttribute('data-hex'), i = G.acc.indexOf(h);
      if (i > -1) { if (G.acc.length <= 2) { shake(b); return; } G.acc.splice(i, 1); }
      else { if (G.acc.length >= 4) { shake(b); return; } G.acc.push(h); }
      genChanged();
    });
    $('#dens').addEventListener('input', function (e) { G.density = e.target.value / 100; genChanged(); });
    $$('#grain button').forEach(function (b) { b.addEventListener('click', function () { G.grain = parseFloat(b.getAttribute('data-g')); genChanged(); }); });
    $$('.app__tab').forEach(function (b) { b.addEventListener('click', function () { G.scale = b.getAttribute('data-scale'); genChanged(); }); });
    $('#presets').addEventListener('click', function (e) { var b = e.target.closest('.preset'); if (!b) return; PRESETS.forEach(function (p) { if (p.id === b.getAttribute('data-p')) applyPreset(p); }); });
    $('#shuffle').addEventListener('click', function () {
      var r = rng(Date.now() | 0), pool = SHADES.slice();
      var base = pool.splice(r() * pool.length | 0, 1)[0].hex, n = 2 + (r() * 3 | 0), acc = [];
      for (var i = 0; i < n; i++) acc.push(pool.splice(r() * pool.length | 0, 1)[0].hex);
      G.base = base; G.acc = acc; G.seed = r() * 99991 | 0; genChanged();
    });
    $('#toRoom').addEventListener('click', function () {
      ROOM.finish = { type: 'gen' }; ROOM.cache = {}; renderRoomChips(); drawRoom(); updateRoomNow();
      document.getElementById('interiors').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) { genVisible = ents[0].isIntersecting; if (genVisible && genDirty) drawGen(); }, { rootMargin: '200px' }).observe(genCanvas);
    }
  }
  function shake(el) { el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake'); }

  /* =====================================================
     Interiors — wall visualizer (mask + shading map)
     ===================================================== */
  var ROOMS = {
    d: { img: 'img/rooms/room-d.jpg', mask: 'img/rooms/room-d-mask.webp', fx: 0.55, fy: 0.55, tile: 0.36 },
    a: { img: 'img/rooms/room-a.jpg', mask: 'img/rooms/room-a-mask.webp', fx: 0.78, fy: 0.5, tile: 0.34 },
    c: { img: 'img/rooms/room-c.jpg', mask: 'img/rooms/room-c-mask.webp', fx: 0.5, fy: 0.5, tile: 0.34 }
  };
  var FINISHES = ['B8A389', 'B7B3A8', 'B4986D', 'C5866E', '90A488', '819BAD', '9F9287'];
  var ROOM = { id: 'd', finish: { type: 'tex', hex: 'B8A389' }, split: 0.56, cache: {} };
  var roomCanvas = $('#roomCanvas'), roomStage = $('#roomStage'), splitEl = $('#split');
  var imgCache = {};
  function loadImg(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise(function (res, rej) { var im = new Image(); im.decoding = 'async'; im.onload = function () { res(im); }; im.onerror = rej; im.src = src; });
    return imgCache[src];
  }
  function mirrorTile(src, tw, th) {
    var c = document.createElement('canvas'); c.width = Math.round(tw * 2); c.height = Math.round(th * 2);
    var x = c.getContext('2d');
    x.drawImage(src, 0, 0, tw, th);
    x.save(); x.translate(tw * 2, 0); x.scale(-1, 1); x.drawImage(src, 0, 0, tw, th); x.restore();
    x.save(); x.translate(0, th * 2); x.scale(1, -1); x.drawImage(src, 0, 0, tw, th); x.restore();
    x.save(); x.translate(tw * 2, th * 2); x.scale(-1, -1); x.drawImage(src, 0, 0, tw, th); x.restore();
    return c;
  }
  var genTexCache = null;
  function genTexture() {
    if (genTexCache) return genTexCache;
    var c = document.createElement('canvas'); c.width = 900; c.height = 600;
    paint(c.getContext('2d'), 900, 600, { base: G.base, acc: G.acc, density: G.density, grain: G.grain, scale: 1.25, seed: G.seed, mottle: 8 });
    genTexCache = c; return c;
  }
  function coated(roomId, finish) {
    var key = roomId + '|' + (finish.type === 'gen' ? 'gen' : finish.hex);
    if (ROOM.cache[key]) return Promise.resolve(ROOM.cache[key]);
    var R = ROOMS[roomId];
    var texP = finish.type === 'gen' ? Promise.resolve(genTexture()) : loadImg('img/tex/' + finish.hex + '.webp');
    return Promise.all([loadImg(R.img), loadImg(R.mask), texP]).then(function (r) {
      var im = r[0], mask = r[1], tex = r[2];
      var W = im.naturalWidth, H = im.naturalHeight;
      var off = document.createElement('canvas'); off.width = W; off.height = H;
      var o = off.getContext('2d');
      var tw = W * R.tile, th = tw * (tex.height || tex.naturalHeight) / (tex.width || tex.naturalWidth);
      var tile = mirrorTile(tex, tw, th);
      for (var y = 0; y < H; y += tile.height) for (var x = 0; x < W; x += tile.width) o.drawImage(tile, x, y);
      o.globalCompositeOperation = 'multiply'; o.drawImage(mask, 0, 0, W, H);
      o.globalCompositeOperation = 'destination-in'; o.drawImage(mask, 0, 0, W, H);
      ROOM.cache[key] = off; return off;
    });
  }
  var roomToken = 0;
  function drawRoom() {
    if (!roomCanvas) return;
    var tok = ++roomToken, R = ROOMS[ROOM.id];
    Promise.all([loadImg(R.img), coated(ROOM.id, ROOM.finish)]).then(function (r) {
      if (tok !== roomToken) return;
      sizeCanvas(roomCanvas, 2400);
      var im = r[0], off = r[1], cw = roomCanvas.width, ch = roomCanvas.height;
      var s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      var dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      var dx = (cw - dw) * R.fx, dy = (ch - dh) * R.fy;
      var ctx = roomCanvas.getContext('2d');
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(im, dx, dy, dw, dh);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, cw * ROOM.split, ch); ctx.clip();
      ctx.drawImage(off, dx, dy, dw, dh);
      ctx.restore();
      roomStage.style.setProperty('--x', (ROOM.split * 100).toFixed(2) + '%');
    }).catch(function () {});
  }
  function renderRoomChips() {
    var el = $('#roomChips'); if (!el) return;
    var h = FINISHES.map(function (hex) {
      var s = BY_HEX[hex], on = ROOM.finish.type === 'tex' && ROOM.finish.hex === hex;
      return '<button type="button" class="rchip' + (on ? ' is-on' : '') + '" data-hex="' + hex + '"><span class="th" style="background-image:url(img/tex/' + hex + '.webp)"></span>' + (s.sys === 'NCS' ? 'NCS ' : '') + s.code + '</button>';
    }).join('');
    h += '<button type="button" class="rchip rchip--gen' + (ROOM.finish.type === 'gen' ? ' is-on' : '') + '" data-gen="1"><canvas class="th" width="64" height="64"></canvas>' + T[lang].your + '</button>';
    el.innerHTML = h;
    var th = el.querySelector('canvas.th');
    if (th) { var gx = th.getContext('2d'); gx.save(); gx.beginPath(); gx.arc(32, 32, 32, 0, 6.283); gx.clip(); gx.drawImage(genTexture(), 300, 200, 300, 200, 0, 0, 96, 64); gx.restore(); }
  }
  function updateRoomNow() {
    var el = $('#roomNow'); if (!el) return;
    if (ROOM.finish.type === 'gen') {
      el.innerHTML = '<canvas class="th" width="72" height="72" style="border-radius:50%"></canvas><div><b>' + T[lang].your + '</b><small>' + T[lang].gen + ' · ' + $('#compId').textContent + '</small></div>';
      var c = el.querySelector('canvas'); c.getContext('2d').drawImage(genTexture(), 300, 200, 200, 200, 0, 0, 72, 72);
    } else {
      var s = BY_HEX[ROOM.finish.hex];
      el.innerHTML = '<span class="th" style="background-image:url(img/tex/' + s.hex + '.webp)"></span><div><b>' + fullCode(s) + '</b><small>' + s.sys + ' · #' + s.hex + ' · ' + T[lang].catTex + '</small></div>';
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
    var dragging = false;
    function setSplit(e) {
      var r = roomStage.getBoundingClientRect();
      ROOM.split = Math.max(0.02, Math.min(0.98, (e.clientX - r.left) / r.width));
      if (!rafSplit) rafSplit = requestAnimationFrame(function () { rafSplit = 0; drawRoom(); });
    }
    var rafSplit = 0;
    roomStage.addEventListener('pointerdown', function (e) { dragging = true; roomStage.setPointerCapture && roomStage.setPointerCapture(e.pointerId); setSplit(e); });
    roomStage.addEventListener('pointermove', function (e) { if (dragging) setSplit(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { roomStage.addEventListener(ev, function () { dragging = false; }); });
    // hint animation when the visualizer enters the viewport
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
    paint(pc.getContext('2d'), pc.width, pc.height, { base: 'B7B3A8', acc: ['989492', 'C5866E', 'C8CBC4'], density: 0.7, grain: 1.1, scale: 1.6, seed: 5 });
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
  function drawContact() {
    var cc = $('#contactCanvas'); if (!cc) return;
    sizeCanvas(cc, 1600);
    paint(cc.getContext('2d'), cc.width, cc.height, { base: '1a1714', acc: ['2a241f', '3b332b', '5e4a30'], density: 0.5, grain: 1.2, scale: 1.4, seed: 21, mottle: 6, spark: false });
  }

  /* =====================================================
     Boot
     ===================================================== */
  var saved = null;
  try { saved = localStorage.getItem('dv-lang'); } catch (e) {}
  var qp = /[?&]lang=(en|uk|ua)/i.exec(location.search);
  var startLang = qp ? (qp[1].toLowerCase() === 'en' ? 'en' : 'uk') : (saved || 'uk');

  renderPresets();
  renderCards();
  updateGenUI();
  setLang(startLang, false);
  initReveal();
  drawGen();
  renderRoomChips(); updateRoomNow(); drawRoom();
  drawPoster(); drawContact(); drawPosterRoom();

  var rT = 0, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (Math.abs(window.innerWidth - lastW) < 2) return; // ignore mobile URL-bar height changes
      lastW = window.innerWidth;
      drawGen(); drawRoom(); drawPoster(); drawContact(); drawPosterRoom();
    }, 180);
  });
})();
