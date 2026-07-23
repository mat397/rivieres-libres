/* ==========================================================================
   Rivières Libres — Carte interactive du portail (MapLibre GL JS)

   Remplace l'iframe MRNF par une carte que le portail contrôle : fond clair
   CARTO + couches officielles WMS (CC-BY, gouvernement du Québec) activables,
   recherche d'adresse, légende. Aucune clé, aucun token.

   Couches officielles (WMS 1.3.0, EPSG:3857, CC-BY) :
   - Zones inondables cartographiées (grille de présence) — MRNF
   - Milieux humides potentiels — MELCCFP
   - Municipalités / MRC (repérage) — MRNF (SDA)

   maplibre-gl et pmtiles sont servis depuis /assets/vendor/ (pas de CDN tiers,
   donc non bloqués par les adblockers).

   La couche bâtiments (référentiel du Québec) est un PMTiles hébergé sur
   Cloudflare R2 (BATIMENTS_PMTILES_URL). Elle se dessine PAR-DESSUS les zones
   inondables pour montrer si un bâtiment tombe en zone à risque.
   ========================================================================== */
(function () {
  "use strict";

  if (typeof maplibregl === "undefined") return;
  var el = document.getElementById("carte");
  if (!el) return;

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* URLs des PMTiles hébergés sur R2. Vide = couche désactivée. */
  var BATIMENTS_PMTILES_URL = (window.RL_CONFIG && window.RL_CONFIG.batimentsPmtiles) || "";
  var GRILLE_PMTILES_URL = (window.RL_CONFIG && window.RL_CONFIG.grillePmtiles) || "";

  /* Protocole PMTiles (la lib est chargée avant ce script). */
  if (typeof pmtiles !== "undefined") {
    maplibregl.addProtocol("pmtiles", new pmtiles.Protocol().tile);
  }

  /* --- Fond de carte clair, sans clé (tuiles raster CARTO Positron) -------- */
  var STYLE = {
    version: 8,
    sources: {
      carto: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap, © CARTO"
      }
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#dfe8ec" } },
      { id: "carto", type: "raster", source: "carto" }
    ]
  };

  /* --- Couches WMS officielles (CC-BY) ------------------------------------ */
  function wms(base, layers) {
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep +
      "service=WMS&version=1.3.0&request=GetMap&layers=" + layers +
      "&styles=&format=image/png&transparent=true&crs=EPSG:3857" +
      "&width=256&height=256&bbox={bbox-epsg-3857}";
  }

  /* La couche zones inondables n'est plus en WMS raster : elle est servie en
     PMTiles vecteur (grille), donc INTERROGEABLE pour le verdict citoyen.
     Voir plus bas (map.on load). Ici : les couches raster secondaires. */
  var LAYERS = [
    {
      id: "mh",
      label: "Milieux humides potentiels",
      tiles: wms("https://geo.environnement.gouv.qc.ca/donnees/services/Biodiversite/MH_potentiels/MapServer/WMSServer", "Milieux_humides_potentiels11904"),
      opacity: 0.6,
      on: false,
      swatch: "#5E8C3F"
    },
    {
      id: "muni",
      label: "Municipalités et MRC",
      tiles: wms("https://servicescarto.mrnf.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer", "4,3"),
      opacity: 0.9,
      on: false,
      swatch: "#0E3A52"
    }
  ];

  /* --- Carte -------------------------------------------------------------- */
  var map = new maplibregl.Map({
    container: "carte",
    style: STYLE,
    center: [-72.3, 46.4],   // Québec habité
    zoom: 6,
    attributionControl: false
  });
  map.addControl(new maplibregl.NavigationControl(), "top-right");
  map.addControl(new maplibregl.ScaleControl({ unit: "metric" }));
  map.addControl(new maplibregl.AttributionControl({
    compact: true,
    customAttribution:
      'Données : <a href="https://www.donneesquebec.ca/" target="_blank" rel="noopener">MRNF / MELCCFP</a> (CC-BY 4.0) · ' +
      'Carte : <a href="https://altogeo.ca" target="_blank" rel="noopener">Alto Géomatique</a>'
  }), "bottom-right");

  var hasBatiments = false;
  var hasGrille = false;

  map.on("load", function () {
    /* 1) Zones inondables (grille) en PMTiles vecteur — SOUS les autres.
       Vecteur = net à tous les zooms ET interrogeable pour le verdict. */
    if (GRILLE_PMTILES_URL && typeof pmtiles !== "undefined") {
      map.addSource("grille", { type: "vector", url: "pmtiles://" + GRILLE_PMTILES_URL });
      map.addLayer({
        id: "grille-fill", type: "fill", source: "grille", "source-layer": "grille_zi",
        paint: { "fill-color": "#D64545", "fill-opacity": 0.35 }
      });
      map.addLayer({
        id: "grille-line", type: "line", source: "grille", "source-layer": "grille_zi",
        paint: { "line-color": "#B02E2E", "line-width": 0.8, "line-opacity": 0.6 }
      });
      hasGrille = true;
    }

    /* 2) Couches raster secondaires (milieux humides, municipalités) */
    LAYERS.forEach(function (l) {
      map.addSource(l.id, { type: "raster", tiles: [l.tiles], tileSize: 256 });
      map.addLayer({
        id: l.id, type: "raster", source: l.id,
        paint: { "raster-opacity": l.opacity },
        layout: { visibility: l.on ? "visible" : "none" }
      });
    });

    /* 3) Bâtiments (PMTiles R2) — PAR-DESSUS les zones inondables.
       Ajoutés en dernier, donc au sommet de la pile de couches. */
    if (BATIMENTS_PMTILES_URL && typeof pmtiles !== "undefined") {
      map.addSource("batiments", { type: "vector", url: "pmtiles://" + BATIMENTS_PMTILES_URL });
      map.addLayer({
        id: "batiments-fill", type: "fill", source: "batiments", "source-layer": "batiments",
        minzoom: 12,
        paint: { "fill-color": "#0E3A52", "fill-opacity": 0.45 }
      });
      map.addLayer({
        id: "batiments-line", type: "line", source: "batiments", "source-layer": "batiments",
        minzoom: 13,
        paint: { "line-color": "#0A2C3F", "line-width": 0.5 }
      });
      hasBatiments = true;

      map.on("click", "batiments-fill", function (e) {
        var s = e.features[0].properties.Superficie;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML("<strong>Bâtiment</strong><br>Superficie : " + (s ? Math.round(s) + " m²" : "non disponible"))
          .addTo(map);
      });
      map.on("mouseenter", "batiments-fill", function () { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "batiments-fill", function () { map.getCanvas().style.cursor = ""; });
    }

    buildControls();
  });

  /* --- Panneau : couches activables + légende ----------------------------- */
  function buildControls() {
    var box = document.getElementById("carte-couches");
    if (!box) return;

    /* Case zones inondables (grille vecteur), en tête et activée */
    if (hasGrille) {
      var grow = document.createElement("label");
      grow.className = "carte-couche";
      var gcb = document.createElement("input");
      gcb.type = "checkbox"; gcb.checked = true;
      gcb.addEventListener("change", function () {
        var v = gcb.checked ? "visible" : "none";
        map.setLayoutProperty("grille-fill", "visibility", v);
        map.setLayoutProperty("grille-line", "visibility", v);
      });
      var gsw = document.createElement("span");
      gsw.className = "carte-couche__swatch";
      gsw.style.background = "#D64545";
      grow.appendChild(gcb);
      grow.appendChild(gsw);
      grow.appendChild(document.createTextNode(" Zones inondables cartographiées"));
      box.appendChild(grow);
    }

    LAYERS.forEach(function (l) {
      var row = document.createElement("label");
      row.className = "carte-couche";
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = l.on;
      cb.addEventListener("change", function () {
        map.setLayoutProperty(l.id, "visibility", cb.checked ? "visible" : "none");
      });
      var sw = document.createElement("span");
      sw.className = "carte-couche__swatch";
      sw.style.background = l.swatch;
      row.appendChild(cb);
      row.appendChild(sw);
      row.appendChild(document.createTextNode(" " + l.label));
      box.appendChild(row);
    });

    /* Case bâtiments (seulement si la couche PMTiles est disponible) */
    if (hasBatiments) {
      var brow = document.createElement("label");
      brow.className = "carte-couche";
      var bcb = document.createElement("input");
      bcb.type = "checkbox"; bcb.checked = true;
      bcb.addEventListener("change", function () {
        var v = bcb.checked ? "visible" : "none";
        map.setLayoutProperty("batiments-fill", "visibility", v);
        map.setLayoutProperty("batiments-line", "visibility", v);
      });
      var bsw = document.createElement("span");
      bsw.className = "carte-couche__swatch";
      bsw.style.background = "#0E3A52";
      brow.appendChild(bcb);
      brow.appendChild(bsw);
      brow.appendChild(document.createTextNode(" Bâtiments (zoom sur une ville)"));
      box.appendChild(brow);
    }
  }

  /* --- Verdict citoyen (prudent) ----------------------------------------- */
  /* Après localisation d'une adresse, on teste si le point tombe dans un
     polygone de la grille de zone inondable (couche vecteur interrogeable).
     Formulation NON alarmiste, avertissement systématique, renvoi municipalité.
     La grille indique où une CARTOGRAPHIE existe, pas que le terrain est inondé. */
  var verdictEl = document.getElementById("carte-verdict");

  function pointDansGrille(lng, lat) {
    // Interroge les entités rendues au point (la carte doit être zoomée/stabilisée).
    var pt = map.project([lng, lat]);
    var feats = map.queryRenderedFeatures(pt, { layers: hasGrille ? ["grille-fill"] : [] });
    return feats && feats.length > 0;
  }

  function afficheVerdict(dansZone) {
    if (!verdictEl) return;
    if (dansZone) {
      verdictEl.className = "carte-verdict carte-verdict--in";
      verdictEl.innerHTML =
        '<strong>Ce point se trouve dans un secteur cartographié pour les zones inondables.</strong>' +
        '<p>Cela signifie qu’une cartographie existe pour ce secteur, pas que le terrain sera inondé. ' +
        'Pour connaître le statut réel et la réglementation applicable, contactez votre municipalité.</p>' +
        '<p class="carte-verdict__src">Source : grille de présence, MRNF (valeur indicative, aucune portée légale).</p>';
    } else {
      verdictEl.className = "carte-verdict carte-verdict--out";
      verdictEl.innerHTML =
        '<strong>Ce point ne semble pas dans un secteur cartographié pour les zones inondables.</strong>' +
        '<p>L’absence de cartographie ne garantit pas l’absence de risque : de nouvelles cartes sont publiées ' +
        'progressivement. En cas de doute, contactez votre municipalité.</p>' +
        '<p class="carte-verdict__src">Source : grille de présence, MRNF (valeur indicative, aucune portée légale).</p>';
    }
    verdictEl.hidden = false;
  }

  function localiser(lng, lat) {
    map.flyTo({ center: [lng, lat], zoom: 15, duration: REDUCED ? 0 : 1400 });
    if (window._rlMarker) { window._rlMarker.remove(); }
    window._rlMarker = new maplibregl.Marker({ color: "#1E8AA0" }).setLngLat([lng, lat]).addTo(map);
    // Attendre la stabilisation de la carte avant d'interroger la grille rendue.
    map.once("idle", function () {
      if (hasGrille) { afficheVerdict(pointDansGrille(lng, lat)); }
    });
  }

  /* --- Recherche d'adresse (géocodage Nominatim, biaisé Québec) ----------- */
  var form = document.getElementById("carte-recherche");
  if (form) {
    var input = form.querySelector("input");
    var msg = document.getElementById("carte-recherche-msg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (input.value || "").trim();
      if (!q) return;
      if (msg) { msg.textContent = "Recherche en cours…"; }
      if (verdictEl) { verdictEl.hidden = true; }

      var url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ca&q=" +
        encodeURIComponent(q + ", Québec");
      fetch(url, { headers: { "Accept-Language": "fr" } })
        .then(function (r) { return r.json(); })
        .then(function (results) {
          if (!results || !results.length) {
            if (msg) { msg.textContent = "Adresse introuvable. Précisez la ville."; }
            return;
          }
          var r = results[0];
          localiser(parseFloat(r.lon), parseFloat(r.lat));
          if (msg) { msg.textContent = ""; }
        })
        .catch(function () {
          if (msg) { msg.textContent = "La recherche a échoué. Réessayez plus tard."; }
        });
    });
  }

  /* --- Géolocalisation « autour de moi » --------------------------------- */
  var geoBtn = document.getElementById("carte-geoloc");
  if (geoBtn && "geolocation" in navigator) {
    geoBtn.addEventListener("click", function () {
      geoBtn.disabled = true;
      var prev = geoBtn.textContent;
      geoBtn.textContent = "Localisation…";
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          localiser(pos.coords.longitude, pos.coords.latitude);
          geoBtn.disabled = false; geoBtn.textContent = prev;
        },
        function () {
          if (msg) { msg.textContent = "Localisation refusée ou indisponible."; }
          geoBtn.disabled = false; geoBtn.textContent = prev;
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  } else if (geoBtn) {
    geoBtn.hidden = true;
  }
})();
