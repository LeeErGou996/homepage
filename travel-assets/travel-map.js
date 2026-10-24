/* Map engine shared by travel1.html and travel_munich.html.
 *
 * Basemap: plain satellite imagery (Esri World Imagery) with NO political
 * borders and NO labels. Every name on the map is drawn by this script
 * from travel-data.js, so nothing on the map makes a territorial claim.
 */
(function () {
  'use strict';
  var C = window.TravelCore;

  function centroid(cities) {
    var la = 0, lo = 0;
    cities.forEach(function (c) { la += c.lat; lo += c.lon; });
    return [la / cities.length, lo / cities.length];
  }

  function init(opts) {
    var countries = opts.countries;
    var cityZoom = opts.cityZoom === undefined ? 5 : opts.cityZoom;
    var mapEl = document.getElementById(opts.el);
    var panel = document.getElementById(opts.panel);
    var listEl = document.getElementById(opts.list);
    var searchEl = document.getElementById(opts.search);

    var map = L.map(mapEl, {
      zoomControl: false, minZoom: window.innerWidth <= 820 ? 1 : 2, maxZoom: 17, zoomSnap: 0.5, worldCopyJump: true,
      maxBounds: [[-85, -540], [85, 540]], maxBoundsViscosity: 0.6
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 17,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
    }).addTo(map);

    var countryLayer = L.layerGroup();
    var cityLayer = L.layerGroup();
    var markers = {};          // "country/city" -> marker
    var openSet = {};          // expanded groups in the side panel
    if (countries.length === 1) openSet[countries[0].id] = true;

    function allBounds() {
      var pts = [];
      countries.forEach(function (c) { c.cities.forEach(function (ci) { pts.push([ci.lat, ci.lon]); }); });
      return L.latLngBounds(pts);
    }
    function pad() {
      var w = (panel && window.innerWidth > 820) ? panel.offsetWidth + 24 : 24;
      return { paddingTopLeft: [w, 76], paddingBottomRight: [96, 56] };   /* right padding leaves room for pin labels */
    }

    function sync() {
      var show = map.getZoom() >= cityZoom;
      if (show) {
        if (map.hasLayer(countryLayer)) map.removeLayer(countryLayer);
        if (!map.hasLayer(cityLayer)) map.addLayer(cityLayer);
      } else {
        if (map.hasLayer(cityLayer)) map.removeLayer(cityLayer);
        buildCountryLayer();
        if (!map.hasLayer(countryLayer)) map.addLayer(countryLayer);
      }
      mapEl.classList.toggle('lbl-hide', map.getZoom() < 6);
    }

    function cityIcon(country, city, n) {
      return L.divIcon({
        className: 'pin-root', iconSize: [0, 0],
        html: '<div class="pin pin--city' + (n ? '' : ' is-pending') + '" style="' + C.colorStyle(country) + '"><span class="pin__dot"></span><span class="pin__label">' +
          C.esc(C.tr(city.name)) + '</span></div>'
      });
    }
    function countryIcon(country, n) {
      return L.divIcon({
        className: 'pin-root', iconSize: [0, 0],
        html: '<div class="pin pin--country' + (n ? '' : ' is-pending') + '" style="' + C.colorStyle(country) + '"><span class="pin__dot"><b>' + country.cities.length +
          '</b></span><span class="pin__label">' + C.esc(C.tr(country.name)) + '</span></div>'
      });
    }
    /* cluster pin: a ring made of the member countries' colours, count in the middle */
    function clusterBackground(items) {
      var n = items.length, parts = items.map(function (it, i) {
        return C.visible(it.country) + ' ' + (i * 100 / n) + '% ' + ((i + 1) * 100 / n) + '%';
      });
      return 'conic-gradient(' + parts.join(',') + ')';
    }

    function popupFor(country, city) {
      var n = C.cityCount(country, city);
      var el = document.createElement('div');
      el.className = 'pop';
      el.innerHTML =
        '<div class="pop__cover' + (n ? '' : ' is-empty') + '"></div>' +
        '<div class="pop__body"><p class="pop__kicker">' + C.swatch(country) + C.esc(C.tr(country.name)) + '</p>' +
        '<h3 class="pop__title">' + C.esc(C.tr(city.name)) + '</h3>' +
        '<p class="pop__meta">' + C.esc(n ? C.ui('nPhotos')(n) : C.ui('soon')) + '</p>' +
        '<div class="pop__actions">' +
        (n ? '<button type="button" class="btn btn--primary" data-act="open">' + C.esc(C.ui('viewPhotos')) + '</button>' : '') +
        (city.link ? '<a class="btn" href="' + city.link + '">' + C.esc(C.ui('bavariaLog')) + '</a>' : '') +
        '</div></div>';
      var open = el.querySelector('[data-act=open]');
      if (open) open.addEventListener('click', function () { C.openCountryGallery(country, city); });
      if (n) {
        C.photos(country, city).then(function (p) {
          if (!p.length) return;
          el.querySelector('.pop__cover').style.backgroundImage = 'url("' + C.thumb(p[Math.floor(p.length / 3)].p, 520) + '")';
        });
      }
      return el;
    }

    /* Country-level pins; pins closer than ~34px merge into one cluster pin. */
    function buildCountryLayer() {
      countryLayer.clearLayers();
      var z = map.getZoom();
      var groups = [];
      countries.forEach(function (country) {
        var ll = centroid(country.cities);
        var item = { country: country, ll: ll, pt: map.project(L.latLng(ll), z) };
        var g = groups.filter(function (x) { return x.pt.distanceTo(item.pt) < 34; })[0];
        if (g) g.items.push(item); else groups.push({ pt: item.pt, items: [item] });
      });
      groups.forEach(function (g) {
        var m;
        if (g.items.length === 1) {
          var country = g.items[0].country;
          m = L.marker(g.items[0].ll, { icon: countryIcon(country, C.countryCount(country)), title: C.tr(country.name), riseOnHover: true });
          m.on('click', function () { focusCountry(country); });
        } else {
          var lat = 0, lon = 0, pts = [];
          g.items.forEach(function (it) {
            lat += it.ll[0]; lon += it.ll[1];
            it.country.cities.forEach(function (c) { pts.push([c.lat, c.lon]); });
          });
          /* never name a cluster after one country (it would read as if the others belong to it):
             list the names for two, otherwise just count the destinations */
          var label = g.items.length === 2
            ? g.items.map(function (it) { return C.tr(it.country.name); }).join(' · ')
            : C.ui('nDestinations')(g.items.length);
          m = L.marker([lat / g.items.length, lon / g.items.length], {
            title: label, riseOnHover: true,
            icon: L.divIcon({
              className: 'pin-root', iconSize: [0, 0],
              html: '<div class="pin pin--country pin--cluster"><span class="pin__dot" style="background:' + clusterBackground(g.items) + '"><b>' + g.items.length +
                '</b></span><span class="pin__label">' + C.esc(label) + '</span></div>'
            })
          });
          m.on('click', function () {
            var o = pad(); o.maxZoom = 8; o.duration = 0.8;
            map.flyToBounds(L.latLngBounds(pts), o);
          });
        }
        countryLayer.addLayer(m);
      });
    }

    function build() {
      cityLayer.clearLayers();
      markers = {};
      countries.forEach(function (country) {
        country.cities.forEach(function (city) {
          var n = C.cityCount(country, city);
          var m = L.marker([city.lat, city.lon], { icon: cityIcon(country, city, n), title: C.tr(city.name), riseOnHover: true });
          m.bindPopup(function () { return popupFor(country, city); }, {
            className: 'tp', closeButton: false, minWidth: 260, maxWidth: 260,
            autoPanPaddingTopLeft: [(panel && window.innerWidth > 820) ? panel.offsetWidth + 16 : 16, 80],
            autoPanPaddingBottomRight: [16, 16]
          });
          markers[country.id + '/' + city.id] = m;
          cityLayer.addLayer(m);
        });
      });
      sync();
    }

    function focusCountry(country) {
      var pts = country.cities.map(function (c) { return [c.lat, c.lon]; });
      var o = pad();
      o.maxZoom = 8; o.duration = 0.8;
      if (pts.length === 1) map.flyTo(pts[0], 9, { duration: 0.8 });
      else map.flyToBounds(L.latLngBounds(pts), o);
    }

    function focusCity(country, city) {
      var m = markers[country.id + '/' + city.id];
      var done = false;
      function open() {
        if (done) return; done = true;
        sync();
        if (m) m.openPopup();
      }
      map.once('moveend', open);
      setTimeout(open, 1100);
      map.flyTo([city.lat, city.lon], Math.max(map.getZoom(), 10), { duration: 0.8 });
      if (window.innerWidth <= 820) document.body.classList.remove('panel-open');
    }

    function resetView() {
      map.closePopup();
      var o = pad(); o.maxZoom = opts.fitMaxZoom || 6; o.duration = 0.8;
      map.flyToBounds(allBounds(), o);
    }

    /* ---------- side panel ---------- */
    function matches(country, q) {
      if (!q) return { show: true, cities: country.cities };
      function hit(name) { return Object.keys(name).some(function (k) { return name[k].toLowerCase().indexOf(q) !== -1; }); }
      var cs = country.cities.filter(function (c) { return hit(c.name); });
      return { show: hit(country.name) || cs.length > 0, cities: hit(country.name) ? country.cities : cs, forced: cs.length > 0 };
    }

    function buildPanel() {
      var q = searchEl ? searchEl.value.trim().toLowerCase() : '';
      var html = '', any = false;
      countries.forEach(function (country) {
        var m = matches(country, q);
        if (!m.show) return;
        any = true;
        var isOpen = !!openSet[country.id] || !!q;   // while searching, expand every match
        var cn = C.countryCount(country);
        html += '<section class="grp' + (isOpen ? ' is-open' : '') + (cn ? '' : ' is-pending') + '" style="' + C.colorStyle(country) + '">' +
          '<button type="button" class="grp__head" data-country="' + country.id + '" aria-expanded="' + !!isOpen + '">' +
          C.swatch(country) + '<span class="grp__name">' + C.esc(C.tr(country.name)) + '</span>' +
          '<span class="grp__meta">' + (cn ? cn : '·') + '</span><span class="chev" aria-hidden="true"></span></button>' +
          '<ul class="grp__list">' + m.cities.map(function (ci) {
            var n = C.cityCount(country, ci);
            return '<li><button type="button" class="city-row' + (n ? '' : ' is-pending') + '" data-country="' + country.id + '" data-city="' + ci.id + '">' +
              '<span class="dotmini" aria-hidden="true"></span><span class="city-row__name">' + C.esc(C.tr(ci.name)) + '</span>' +
              '<em>' + (n ? n : C.esc(C.ui('soon'))) + '</em></button></li>';
          }).join('') + '</ul></section>';
      });
      listEl.innerHTML = html || '<p class="panel__none">' + C.esc(C.ui('nothing')) + '</p>';
    }

    listEl.addEventListener('click', function (e) {
      var row = e.target.closest('.city-row');
      if (row) {
        var c = C.getCountry(row.getAttribute('data-country'));
        focusCity(c, C.getCity(c, row.getAttribute('data-city')));
        return;
      }
      var head = e.target.closest('.grp__head');
      if (head) {
        var id = head.getAttribute('data-country');
        openSet[id] = !openSet[id];
        buildPanel();
        if (openSet[id]) focusCountry(C.getCountry(id));
      }
    });
    if (searchEl) searchEl.addEventListener('input', buildPanel);

    var toggle = document.getElementById(opts.toggle);
    if (toggle) toggle.addEventListener('click', function () { document.body.classList.toggle('panel-open'); });
    var reset = document.getElementById(opts.reset);
    if (reset) reset.addEventListener('click', resetView);

    map.on('zoomend', sync);
    map.fitBounds(allBounds(), Object.assign(pad(), { maxZoom: opts.fitMaxZoom || 6 }));
    build();
    buildPanel();

    /* pick up photos that exist on GitHub but are not in manifest.js yet */
    C.hydrate(countries).then(function () { build(); buildPanel(); if (opts.onData) opts.onData(); });

    return {
      map: map,
      refresh: function () { build(); buildPanel(); },
      resetView: resetView
    };
  }

  window.TravelMap = { init: init };
})();
