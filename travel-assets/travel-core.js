/* Shared logic: i18n, photo lookup, header, gallery + lightbox. */
(function () {
  'use strict';
  var D = window.TRAVEL;
  var MAN = (window.TRAVEL_MANIFEST && window.TRAVEL_MANIFEST.folders) || {};

  /* ---------- helpers ---------- */
  function nfc(s) { return String(s || '').normalize('NFC'); }
  function key(s) { return nfc(s).toLowerCase(); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- i18n ---------- */
  var UI = {
    en: {
      brand: 'Travel Atlas', nav_home: 'Home', nav_journal: 'Journal', nav_map: 'Map', nav_bavaria: 'Bavaria',
      journalKicker: 'Travel journal', journalTitle: 'Places I have been', journalSub: 'A growing archive of cities, trips and photos.',
      statCountries: 'Countries & regions', statCities: 'Cities', statPhotos: 'Photos',
      timeline: 'Timeline', atlas: 'All destinations', openMap: 'Open the map',
      soon: 'Photos coming soon', viewPhotos: 'View photos', allPhotos: 'All photos', gallery: 'Gallery',
      close: 'Close', prev: 'Previous photo', next: 'Next photo', empty: 'No photos here yet.', error: 'Could not load photos.',
      search: 'Search places', destinations: 'Destinations', resetView: 'Reset view',
      pdf: 'Trip plan (PDF, Chinese)', bavariaLog: 'Bavaria log', backToMap: 'World map',
      mapKicker: 'World map', mapTitle: 'Where I have been',
      bavKicker: 'Regional log', bavTitle: 'Munich & Bavaria', nothing: 'Nothing matches your search.',
      credit: 'Photos load through the GitHub repository; place names are my own labels.',
      nPhotos: function (n) { return n + (n === 1 ? ' photo' : ' photos'); },
      nCities: function (n) { return n + (n === 1 ? ' city' : ' cities'); },
      nDestinations: function (n) { return n + ' destinations'; },
      dateTba: 'Date to be added'
    },
    zh: {
      brand: '旅行图鉴', nav_home: '主页', nav_journal: '日志', nav_map: '地图', nav_bavaria: '巴伐利亚',
      journalKicker: '旅行日志', journalTitle: '我去过的地方', journalSub: '城市、旅程与照片的持续更新档案。',
      statCountries: '国家与地区', statCities: '城市', statPhotos: '照片',
      timeline: '时间线', atlas: '全部目的地', openMap: '打开地图',
      soon: '照片即将上传', viewPhotos: '查看照片', allPhotos: '全部照片', gallery: '相册',
      close: '关闭', prev: '上一张', next: '下一张', empty: '这里还没有照片。', error: '照片加载失败。',
      search: '搜索地点', destinations: '目的地', resetView: '重置视图',
      pdf: '行程计划(PDF)', bavariaLog: '巴伐利亚日志', backToMap: '世界地图',
      mapKicker: '世界地图', mapTitle: '我去过的地方',
      bavKicker: '区域日志', bavTitle: '慕尼黑与巴伐利亚', nothing: '没有符合搜索的地点。',
      credit: '照片通过 GitHub 仓库加载;地名为我自己的标注。',
      nPhotos: function (n) { return n + ' 张照片'; },
      nCities: function (n) { return n + ' 个城市'; },
      nDestinations: function (n) { return n + ' 个目的地'; },
      dateTba: '日期待补'
    },
    ja: {
      brand: '旅のアトラス', nav_home: 'ホーム', nav_journal: '日誌', nav_map: '地図', nav_bavaria: 'バイエルン',
      journalKicker: '旅行日誌', journalTitle: '訪れた場所', journalSub: '都市・旅・写真を少しずつ増やしているアーカイブ。',
      statCountries: '国と地域', statCities: '都市', statPhotos: '写真',
      timeline: 'タイムライン', atlas: 'すべての目的地', openMap: '地図を開く',
      soon: '写真は準備中', viewPhotos: '写真を見る', allPhotos: 'すべての写真', gallery: 'ギャラリー',
      close: '閉じる', prev: '前の写真', next: '次の写真', empty: 'まだ写真がありません。', error: '写真を読み込めませんでした。',
      search: '場所を検索', destinations: '目的地', resetView: '表示をリセット',
      pdf: '旅行計画(PDF・中国語)', bavariaLog: 'バイエルン日誌', backToMap: '世界地図',
      mapKicker: '世界地図', mapTitle: '訪れた場所',
      bavKicker: '地域日誌', bavTitle: 'ミュンヘンとバイエルン', nothing: '該当する場所がありません。',
      credit: '写真は GitHub リポジトリから読み込まれます。地名は私自身の表記です。',
      nPhotos: function (n) { return n + ' 枚の写真'; },
      nCities: function (n) { return n + ' 都市'; },
      nDestinations: function (n) { return n + ' 目的地'; },
      dateTba: '日付は準備中'
    },
    de: {
      brand: 'Reiseatlas', nav_home: 'Start', nav_journal: 'Journal', nav_map: 'Karte', nav_bavaria: 'Bayern',
      journalKicker: 'Reisejournal', journalTitle: 'Orte, an denen ich war', journalSub: 'Ein wachsendes Archiv aus Städten, Reisen und Fotos.',
      statCountries: 'Länder & Regionen', statCities: 'Städte', statPhotos: 'Fotos',
      timeline: 'Zeitleiste', atlas: 'Alle Ziele', openMap: 'Karte öffnen',
      soon: 'Fotos folgen bald', viewPhotos: 'Fotos ansehen', allPhotos: 'Alle Fotos', gallery: 'Galerie',
      close: 'Schließen', prev: 'Vorheriges Foto', next: 'Nächstes Foto', empty: 'Hier gibt es noch keine Fotos.', error: 'Fotos konnten nicht geladen werden.',
      search: 'Orte suchen', destinations: 'Ziele', resetView: 'Ansicht zurücksetzen',
      pdf: 'Reiseplan (PDF, Chinesisch)', bavariaLog: 'Bayern-Log', backToMap: 'Weltkarte',
      mapKicker: 'Weltkarte', mapTitle: 'Wo ich war',
      bavKicker: 'Regionales Log', bavTitle: 'München & Bayern', nothing: 'Keine passenden Orte.',
      credit: 'Fotos werden über das GitHub-Repository geladen; Ortsnamen sind meine eigenen Bezeichnungen.',
      nPhotos: function (n) { return n + (n === 1 ? ' Foto' : ' Fotos'); },
      nCities: function (n) { return n + (n === 1 ? ' Stadt' : ' Städte'); },
      nDestinations: function (n) { return n + (n === 1 ? ' Ziel' : ' Ziele'); },
      dateTba: 'Datum folgt'
    }
  };
  var LANGS = [['en', 'EN', 'EN'], ['zh', '中文', '中'], ['ja', '日本語', '日'], ['de', 'DE', 'DE']]; // code, label, short label (phones)
  var HTML_LANG = { en: 'en', zh: 'zh-Hans', ja: 'ja', de: 'de' };
  var lang = 'en';
  try {
    var saved = localStorage.getItem('travel-lang');
    var nav = ((navigator.language || 'en') + '').slice(0, 2).toLowerCase();
    if (saved && UI[saved]) lang = saved; else if (UI[nav]) lang = nav;
  } catch (e) { /* storage unavailable */ }

  var listeners = [];
  var activeNav = '';

  function tr(obj) { return obj ? (obj[lang] || obj.en || '') : ''; }
  function ui(k) { return (UI[lang] && UI[lang][k] !== undefined) ? UI[lang][k] : UI.en[k]; }

  function setLang(l) {
    if (!UI[l]) return;
    lang = l;
    try { localStorage.setItem('travel-lang', l); } catch (e) { /* ignore */ }
    document.documentElement.lang = HTML_LANG[l];
    renderHeader();
    listeners.forEach(function (f) { f(); });
  }

  /* ---------- data lookup ---------- */
  var ALL = D.countries.concat([D.bavaria]);
  function getCountry(id) { return ALL.filter(function (c) { return c.id === id; })[0]; }
  function getCity(country, id) { return country.cities.filter(function (c) { return c.id === id; })[0]; }

  /* ---------- country colours ---------- */
  function lum(hex) {
    var n = parseInt(hex.slice(1), 16);
    var ch = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }
  /* inline CSS variables: --c fill, --r ring, --v colour that stays visible on the dark map, --ink text on fill */
  function colorStyle(country) {
    var p = (D.colors && D.colors[country.id]) || ['#F0B35A', '#FFFFFF'];
    var v = lum(p[0]) >= 0.08 ? p[0] : p[1];
    var ink = lum(p[0]) > 0.3 ? '#10131c' : '#ffffff';
    return '--c:' + p[0] + ';--r:' + p[1] + ';--v:' + v + ';--ink:' + ink;
  }
  function visible(country) {
    var p = (D.colors && D.colors[country.id]) || ['#F0B35A', '#FFFFFF'];
    return lum(p[0]) >= 0.08 ? p[0] : p[1];
  }
  function swatch(country) { return '<i class="sw" style="' + colorStyle(country) + '"></i>'; }

  /* ---------- photos ---------- */
  var extra = {}; // photos found through the GitHub API for cities missing from the manifest

  function cityKey(country, city) { return country.folder + '/' + key(city.folder); }

  function manifestPhotos(country, city) {
    var list = MAN[country.folder] || [];
    if (city && city.folder) {
      var k = key(city.folder);
      return list.filter(function (x) { return x.c === k; });
    }
    return list;
  }

  function cityCount(country, city) {
    var m = manifestPhotos(country, city).length;
    if (m || !(city && city.folder)) return m;
    var e = extra[cityKey(country, city)];
    return e ? e.length : 0;
  }

  function countryCount(country) {
    var n = (MAN[country.folder] || []).length;
    if (n) return n;
    return country.cities.reduce(function (s, c) {
      return s + (c.folder ? (extra[cityKey(country, c)] || []).length : 0);
    }, 0);
  }

  function photos(country, city) {
    var m = manifestPhotos(country, city).map(function (x) { return { p: x.p }; });
    if (m.length || !(city && city.folder)) return Promise.resolve(m);
    var k = cityKey(country, city);
    if (extra[k]) return Promise.resolve(extra[k]);
    try { /* cache GitHub lookups (GitHub allows only 60 anonymous requests per hour) */
      var cached = JSON.parse(localStorage.getItem('tp:' + k) || 'null');
      if (cached && Date.now() - cached.t < cached.ttl) { extra[k] = cached.list; return Promise.resolve(extra[k]); }
    } catch (e) { /* ignore */ }
    var url = 'https://api.github.com/repos/' + D.gh.user + '/' + D.gh.repo + '/contents/travel/' +
      country.folder + '/' + encodeURIComponent(city.folder);
    return fetch(url).then(function (r) {
      if (r.status === 404) return { ok: true, list: [] };
      if (!r.ok) return { ok: false, list: [] };
      return r.json().then(function (j) { return { ok: true, list: Array.isArray(j) ? j : [] }; });
    }).catch(function () { return { ok: false, list: [] }; }).then(function (res) {
      var out = res.list.filter(function (i) { return i.type === 'file' && /\.(jpe?g|png|webp|gif)$/i.test(i.name); })
        .map(function (i) { return { p: nfc(i.path.replace(/^travel\//, '')) }; });
      extra[k] = out;
      try { /* found photos: 20 min; nothing/404: 20 min; failed (rate limit): 3 min */
        localStorage.setItem('tp:' + k, JSON.stringify({ t: Date.now(), ttl: res.ok ? 20 * 60000 : 3 * 60000, list: out }));
      } catch (e) { /* ignore */ }
      return out;
    });
  }

  /* look for photos that are not in manifest.js yet (e.g. just uploaded) */
  function hydrate(list) {
    var jobs = [];
    list.forEach(function (c) {
      c.cities.forEach(function (ci) {
        if (ci.folder && !manifestPhotos(c, ci).length) jobs.push(photos(c, ci));
      });
    });
    return Promise.all(jobs);
  }

  function rawUrl(p) {
    return 'https://raw.githubusercontent.com/' + D.gh.user + '/' + D.gh.repo + '/' + D.gh.branch + '/travel/' +
      p.split('/').map(encodeURIComponent).join('/');
  }
  function thumb(p, w) {
    w = w || 480;
    return 'https://wsrv.nl/?url=' + encodeURIComponent(rawUrl(p)) + '&w=' + w + '&h=' + Math.round(w * 0.75) + '&fit=cover&we&q=70&output=webp';
  }
  function full(p) {
    return 'https://wsrv.nl/?url=' + encodeURIComponent(rawUrl(p)) + '&w=2000&we&q=82&output=webp';
  }

  function stats() {
    var c = 0, ci = 0, n = 0;
    D.countries.forEach(function (country) {
      if (countryCount(country) > 0) c++;
      country.cities.forEach(function (city) { if (cityCount(country, city) > 0) ci++; });
    });
    Object.keys(MAN).forEach(function (k) { n += MAN[k].length; });
    Object.keys(extra).forEach(function (k) { n += extra[k].length; });
    return { countries: c, cities: ci, photos: n };
  }

  /* ---------- header ---------- */
  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    var items = [['home', 'index.html'], ['journal', 'travel.html'], ['map', 'travel1.html'], ['bavaria', 'travel_munich.html']];
    el.className = 'site-header';
    el.innerHTML =
      '<a class="brand" href="travel.html"><i aria-hidden="true"></i><span>' + esc(ui('brand')) + '</span></a>' +
      '<nav class="nav" aria-label="Main">' + items.map(function (it) {
        return '<a href="' + it[1] + '"' + (it[0] === activeNav ? ' aria-current="page"' : '') + '>' + esc(ui('nav_' + it[0])) + '</a>';
      }).join('') + '</nav>' +
      '<div class="lang" role="group" aria-label="Language">' + LANGS.map(function (l) {
        return '<button type="button" data-lang="' + l[0] + '" aria-label="' + l[1] + '" aria-pressed="' + (l[0] === lang) + '">' +
          '<span class="l-full">' + l[1] + '</span><span class="l-short">' + l[2] + '</span></button>';
      }).join('') + '</div>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (b) setLang(b.getAttribute('data-lang'));
  });

  function init(opts) {
    activeNav = (opts && opts.active) || '';
    if (opts && opts.onLang) listeners.push(opts.onLang);
    document.documentElement.lang = HTML_LANG[lang];
    renderHeader();
  }

  /* ---------- gallery + lightbox ---------- */
  var gal, lb, lastFocus, galToken = 0;
  var lbList = [], lbIndex = 0;

  function lockScroll(on) { document.documentElement.classList.toggle('is-locked', !!on); }

  function ensureGallery() {
    if (gal) return;
    gal = document.createElement('div');
    gal.className = 'gal';
    gal.hidden = true;
    gal.setAttribute('role', 'dialog');
    gal.setAttribute('aria-modal', 'true');
    gal.innerHTML =
      '<div class="gal__panel">' +
      '<header class="gal__head"><div class="gal__titles"><p class="gal__kicker"></p><h2 class="gal__title"></h2></div>' +
      '<div class="gal__actions"></div>' +
      '<button class="icon-btn" type="button" data-gal-close></button></header>' +
      '<div class="gal__tabs" role="tablist"></div>' +
      '<div class="gal__body"><div class="gal__grid"></div><p class="gal__msg" hidden></p></div></div>';
    document.body.appendChild(gal);

    lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lb__btn lb__close" type="button" data-lb="close">×</button>' +
      '<button class="lb__btn lb__prev" type="button" data-lb="prev">‹</button>' +
      '<figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"></figcaption></figure>' +
      '<button class="lb__btn lb__next" type="button" data-lb="next">›</button>';
    document.body.appendChild(lb);

    gal.addEventListener('click', function (e) {
      if (e.target === gal || e.target.closest('[data-gal-close]')) { closeGallery(); return; }
      var t = e.target.closest('.thumb');
      if (t) openLightbox(+t.getAttribute('data-i'));
    });
    gal.querySelector('.gal__grid').addEventListener('error', function (e) {
      var im = e.target;
      if (im.tagName === 'IMG' && !im.dataset.fb) { im.dataset.fb = '1'; im.src = im.dataset.raw; }
    }, true);
    gal.querySelector('.gal__grid').addEventListener('load', function (e) {
      if (e.target.tagName === 'IMG') e.target.parentNode.classList.add('is-loaded');
    }, true);

    lb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lb]');
      if (b) { var a = b.getAttribute('data-lb'); if (a === 'close') closeLightbox(); else stepLightbox(a === 'next' ? 1 : -1); return; }
      if (e.target === lb) closeLightbox();
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
    });
    document.addEventListener('keydown', function (e) {
      if (lb && !lb.hidden) {
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowRight') stepLightbox(1);
        else if (e.key === 'ArrowLeft') stepLightbox(-1);
      } else if (gal && !gal.hidden && e.key === 'Escape') closeGallery();
    });
  }

  function labelUi() {
    if (!gal) return;
    gal.querySelector('[data-gal-close]').textContent = '×';
    gal.querySelector('[data-gal-close]').setAttribute('aria-label', ui('close'));
    lb.querySelector('[data-lb=close]').setAttribute('aria-label', ui('close'));
    lb.querySelector('[data-lb=prev]').setAttribute('aria-label', ui('prev'));
    lb.querySelector('[data-lb=next]').setAttribute('aria-label', ui('next'));
  }

  function openCountryGallery(country, city) {
    ensureGallery();
    labelUi();
    lastFocus = document.activeElement;
    var tabs = [{ id: '*', label: ui('allPhotos'), city: null }].concat(
      country.cities.filter(function (c) { return c.folder; }).map(function (c) { return { id: c.id, label: tr(c.name), city: c }; })
    );
    var active = (city && city.folder) ? city.id : '*';
    var tabBar = gal.querySelector('.gal__tabs');
    gal.setAttribute('aria-label', tr(country.name));
    gal.querySelector('.gal__kicker').textContent = ui('gallery');
    gal.querySelector('.gal__title').innerHTML = swatch(country) + esc(tr(country.name));
    tabBar.hidden = tabs.length <= 2;
    gal.hidden = false;
    lockScroll(true);

    function show(id) {
      active = id;
      var tab = tabs.filter(function (t) { return t.id === id; })[0];
      tabBar.innerHTML = tabs.map(function (t) {
        return '<button class="tab" role="tab" type="button" data-tab="' + esc(t.id) + '" aria-selected="' + (t.id === id) + '">' + esc(t.label) + '</button>';
      }).join('');
      var actions = gal.querySelector('.gal__actions');
      actions.innerHTML = (tab.city && tab.city.link) ? '<a class="btn" href="' + tab.city.link + '">' + esc(ui('bavariaLog')) + '</a>' : '';
      var grid = gal.querySelector('.gal__grid'), msg = gal.querySelector('.gal__msg');
      grid.innerHTML = ''; msg.hidden = true;
      var token = ++galToken;
      photos(country, tab.city).then(function (list) {
        if (token !== galToken) return;
        lbList = list;
        if (!list.length) { msg.textContent = ui(countryCount(country) ? 'empty' : 'soon'); msg.hidden = false; return; }
        grid.innerHTML = list.map(function (ph, i) {
          return '<button class="thumb" type="button" data-i="' + i + '"><img loading="lazy" decoding="async" alt="' +
            esc(tr(country.name) + ' ' + (i + 1)) + '" src="' + thumb(ph.p) + '" data-raw="' + rawUrl(ph.p) + '"></button>';
        }).join('');
      });
    }
    tabBar.onclick = function (e) {
      var b = e.target.closest('[data-tab]');
      if (b) show(b.getAttribute('data-tab'));
    };
    show(active);
    gal.querySelector('[data-gal-close]').focus();
  }

  function closeGallery() {
    if (!gal) return;
    galToken++;
    gal.hidden = true;
    if (lb) lb.hidden = true;
    lockScroll(false);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
  }

  function openLightbox(i) {
    lbIndex = i;
    lb.hidden = false;
    drawLightbox();
    lb.querySelector('[data-lb=close]').focus();
  }
  function closeLightbox() { lb.hidden = true; var t = gal.querySelector('.thumb[data-i="' + lbIndex + '"]'); if (t) t.focus(); }
  function stepLightbox(d) {
    if (!lbList.length) return;
    lbIndex = (lbIndex + d + lbList.length) % lbList.length;
    drawLightbox();
  }
  function drawLightbox() {
    var ph = lbList[lbIndex]; if (!ph) return;
    var img = lb.querySelector('.lb__img');
    img.classList.remove('is-ready');
    img.onload = function () { img.classList.add('is-ready'); };
    img.onerror = function () { if (!img.dataset.fb) { img.dataset.fb = '1'; img.src = rawUrl(ph.p); } };
    delete img.dataset.fb;
    img.src = full(ph.p);
    img.alt = ph.p.split('/').pop();
    lb.querySelector('.lb__cap').textContent = (lbIndex + 1) + ' / ' + lbList.length;
    var nxt = lbList[(lbIndex + 1) % lbList.length];
    if (nxt) { var pre = new Image(); pre.src = full(nxt.p); }
  }

  window.TravelCore = {
    init: init, tr: tr, ui: ui, esc: esc, getCountry: getCountry, getCity: getCity,
    cityCount: cityCount, countryCount: countryCount, photos: photos, hydrate: hydrate,
    thumb: thumb, full: full, rawUrl: rawUrl, stats: stats, key: key,
    colorStyle: colorStyle, visible: visible, swatch: swatch,
    openCountryGallery: openCountryGallery, setLang: setLang, manifest: MAN,
    lang: function () { return lang; }
  };
})();
