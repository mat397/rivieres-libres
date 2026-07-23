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

  /* Config runtime. */
  var CFG = window.RL_CONFIG || {};
  var BATIMENTS_PMTILES_URL = CFG.batimentsPmtiles || "";
  var GRILLE_PMTILES_URL = CFG.grillePmtiles || "";
  var FOND_PMTILES_URL = CFG.fondPmtiles || "";
  var MAPBOX_TOKEN = CFG.mapboxToken || "";

  /* Moteur : Mapbox GL JS natif si token + lib présents (fonds riches, 3D),
     sinon MapLibre GL (fond auto-hébergé, adblock-proof). L'API est quasi
     identique (Mapbox GL est l'ancêtre dont MapLibre est le fork). */
  var USE_MAPBOX = !!MAPBOX_TOKEN && typeof mapboxgl !== "undefined";
  var GL = USE_MAPBOX ? mapboxgl : (typeof maplibregl !== "undefined" ? maplibregl : null);
  if (!GL) return;
  var el = document.getElementById("carte");
  if (!el) return;

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (USE_MAPBOX) { mapboxgl.accessToken = MAPBOX_TOKEN; }

  /* Fonds Mapbox (styles natifs mapbox://). */
  var MAPBOX_STYLES = {
    rues: "mapbox://styles/mapbox/streets-v12",
    clair: "mapbox://styles/mapbox/light-v11",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    plein_air: "mapbox://styles/mapbox/outdoors-v12"
  };
  var currentFond = "rues";

  /* PMTiles : Mapbox GL JS v3.21+ lit nativement les sources .pmtiles (détection
     par l'extension), SANS addProtocol ni préfixe pmtiles://. MapLibre, lui,
     a besoin d'addProtocol + du préfixe. On adapte selon le moteur. */
  var PM_PREFIX = ""; // Mapbox v3.21 : URL directe
  if (!USE_MAPBOX && typeof pmtiles !== "undefined" && GL.addProtocol) {
    GL.addProtocol("pmtiles", new pmtiles.Protocol().tile);
    PM_PREFIX = "pmtiles://";
  }
  function pmUrl(u) { return PM_PREFIX + u; }

  /* --- Fond de carte ----------------------------------------------------- */
  var STYLE;
  if (USE_MAPBOX) {
    STYLE = MAPBOX_STYLES[currentFond];
  } else if (FOND_PMTILES_URL && typeof pmtiles !== "undefined") {
    STYLE = {
      version: 8,
      sources: {
        fond: {
          type: "vector", url: pmUrl(FOND_PMTILES_URL),
          attribution: '© <a href="https://openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
        }
      },
      layers: [
        { id: "bg", type: "background", paint: { "background-color": "#F4F2EC" } },
        { id: "earth", type: "fill", source: "fond", "source-layer": "earth", paint: { "fill-color": "#F7F5EF" } },
        /* Eau : uniquement les grands plans d'eau incontestables (océan, lacs,
           grandes rivières). À partir du zoom 7 seulement : sous ce zoom, la
           géométrie extraite est simplifiée en triangles grossiers, on préfère
           le fond uni. Exclut explicitement les petits polygones parasites. */
        {
          id: "water", type: "fill", source: "fond", "source-layer": "water",
          minzoom: 7,
          filter: ["match", ["get", "kind"],
            ["ocean", "sea", "lake", "river", "riverbank", "reservoir"], true, false],
          paint: { "fill-color": "#C4DEEA" }
        },
        {
          id: "water-line", type: "line", source: "fond", "source-layer": "water",
          filter: ["match", ["get", "kind"], ["river", "canal", "stream"], true, false],
          minzoom: 10,
          paint: { "line-color": "#C4DEEA", "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.6, 15, 2.5] }
        },
        { id: "roads-casing", type: "line", source: "fond", "source-layer": "roads", minzoom: 9,
          filter: ["match", ["get", "kind"], ["highway", "major_road", "medium_road"], true, false],
          paint: { "line-color": "#E6E1D6", "line-width": ["interpolate", ["linear"], ["zoom"], 9, 1, 16, 7] } },
        { id: "roads", type: "line", source: "fond", "source-layer": "roads", minzoom: 9,
          filter: ["match", ["get", "kind"], ["highway", "major_road", "medium_road"], true, false],
          paint: { "line-color": "#FFFFFF", "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.5, 16, 5] } },
        { id: "boundaries", type: "line", source: "fond", "source-layer": "boundaries", minzoom: 5,
          paint: { "line-color": "#CFCBC0", "line-dasharray": [3, 2], "line-width": 0.8 } }
      ]
    };
  } else {
    /* Repli : fond raster CARTO (peut être bloqué par un adblocker). */
    STYLE = {
      version: 8,
      sources: {
        carto: {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          ],
          tileSize: 256, attribution: "© OpenStreetMap, © CARTO"
        }
      },
      layers: [
        { id: "bg", type: "background", paint: { "background-color": "#dfe8ec" } },
        { id: "carto", type: "raster", source: "carto" }
      ]
    };
  }

  /* --- Couches WMS officielles (CC-BY) ------------------------------------ */
  function wms(base, layers) {
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep +
      "service=WMS&version=1.3.0&request=GetMap&layers=" + layers +
      "&styles=&format=image/png&transparent=true&crs=EPSG:3857" +
      "&width=256&height=256&bbox={bbox-epsg-3857}";
  }

  /* Légende officielle d'un WMS (GetLegendGraphic) : image fournie par le
     serveur gouvernemental, donc symbologie exacte (aucune invention). */
  function wmsLegend(base, layer) {
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep +
      "service=WMS&version=1.3.0&request=GetLegendGraphic&format=image/png&layer=" + layer;
  }

  /* La couche zones inondables n'est plus en WMS raster : elle est servie en
     PMTiles vecteur (grille), donc INTERROGEABLE pour le verdict citoyen.
     Voir plus bas (map.on load). Ici : les couches raster secondaires. */
  var MH_WMS = "https://geo.environnement.gouv.qc.ca/donnees/services/Biodiversite/MH_potentiels/MapServer/WMSServer";
  var SDA_WMS = "https://servicescarto.mrnf.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer";
  var LAYERS = [
    {
      id: "mh",
      label: "Milieux humides potentiels",
      tiles: wms(MH_WMS, "Milieux_humides_potentiels11904"),
      legend: wmsLegend(MH_WMS, "Milieux_humides_potentiels11904"),
      opacity: 0.6,
      on: false,
      swatch: "#5E8C3F"
    },
    {
      id: "muni",
      label: "Municipalités et MRC",
      tiles: wms(SDA_WMS, "4,3"),
      opacity: 0.9,
      on: false,
      swatch: "#0E3A52"
    }
  ];

  /* --- Carte -------------------------------------------------------------- */
  var map = new GL.Map({
    container: "carte",
    style: STYLE,
    center: [-72.3, 46.4],   // Québec habité
    zoom: 6,
    attributionControl: false
  });
  map.addControl(new GL.NavigationControl(), "top-right");
  map.addControl(new GL.ScaleControl({ unit: "metric" }));
  map.addControl(new GL.AttributionControl({
    compact: true,
    customAttribution:
      'Données : <a href="https://www.donneesquebec.ca/" target="_blank" rel="noopener">MRNF / MELCCFP</a> (CC-BY 4.0) · ' +
      'Carte : <a href="https://altogeo.ca" target="_blank" rel="noopener">Alto Géomatique</a>'
  }), "bottom-right");

  var hasBatiments = false;
  var hasGrille = false;
  var overlaysReady = false;

  /* Filet de sécurité : forcer un recalcul de taille (conteneur parfois
     dimensionné après l'init, notamment en iframe ou conteneur positionné). */
  window.addEventListener("resize", function () { map.resize(); });

  /* Ajoute les couches par-dessus le fond. Rappelée après chaque changement de
     style Mapbox (changer de fond efface les couches ajoutées). */
  function addOverlays() {
    map.resize();

    /* 0) Terrain 3D + ciel (Mapbox uniquement). Le relief se soulève, ce qui
       aide à comprendre pourquoi l'eau s'accumule dans les vallées. */
    if (USE_MAPBOX) {
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512, maxzoom: 14
        });
      }
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 });
      if (!map.getLayer("sky")) {
        map.addLayer({
          id: "sky", type: "sky",
          paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 12 }
        });
      }
    }

    /* 1) Zones inondables (grille) en PMTiles vecteur — SOUS les autres.
       Vecteur = net à tous les zooms ET interrogeable pour le verdict. */
    if (GRILLE_PMTILES_URL && typeof pmtiles !== "undefined" && !map.getSource("grille")) {
      map.addSource("grille", { type: "vector", url: pmUrl(GRILLE_PMTILES_URL) });
    }
    if (GRILLE_PMTILES_URL && typeof pmtiles !== "undefined") {
      map.addLayer({
        id: "grille-fill", type: "fill", source: "grille", "source-layer": "grille_zi",
        paint: { "fill-color": "#D64545", "fill-opacity": 0.5 }
      });
      map.addLayer({
        id: "grille-line", type: "line", source: "grille", "source-layer": "grille_zi",
        paint: { "line-color": "#B02E2E", "line-width": 1.4, "line-opacity": 0.9 }
      });
      hasGrille = true;
    }

    /* 2) Couches raster secondaires (milieux humides, municipalités) */
    LAYERS.forEach(function (l) {
      if (!map.getSource(l.id)) {
        map.addSource(l.id, { type: "raster", tiles: [l.tiles], tileSize: 256 });
      }
      map.addLayer({
        id: l.id, type: "raster", source: l.id,
        paint: { "raster-opacity": l.opacity },
        layout: { visibility: l.on ? "visible" : "none" }
      });
    });

    /* 3) Bâtiments (PMTiles R2) — PAR-DESSUS les zones inondables. */
    if (BATIMENTS_PMTILES_URL && typeof pmtiles !== "undefined") {
      if (!map.getSource("batiments")) {
        map.addSource("batiments", { type: "vector", url: pmUrl(BATIMENTS_PMTILES_URL) });
      }
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
    }

    if (!overlaysReady) {
      overlaysReady = true;
      buildControls();
    }
  }

  map.on("load", addOverlays);
  /* Après un changement de fond Mapbox : le style est rechargé, on ré-ajoute. */
  map.on("style.load", function () {
    if (overlaysReady) { addOverlays(); syncLayerVisibility(); }
  });

  /* Interactions bâtiments (attachées une seule fois, indépendantes du style) */
  if (BATIMENTS_PMTILES_URL) {
    (function () {
      map.on("mouseenter", "batiments-fill", function () { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "batiments-fill", function () { map.getCanvas().style.cursor = ""; });
    })();
  }

  /* Réapplique l'état visible/masqué des cases après un changement de fond. */
  function syncLayerVisibility() {
    var box = document.getElementById("carte-couches");
    if (!box) return;
    box.querySelectorAll("input[type=checkbox][data-layers]").forEach(function (cb) {
      var ids = cb.getAttribute("data-layers").split(",");
      var v = cb.checked ? "visible" : "none";
      ids.forEach(function (id) { if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v); });
    });
  }

  /* --- Panneau : sélecteur de fond + couches activables + légende --------- */
  var builtOnce = false;
  function buildControls() {
    var box = document.getElementById("carte-couches");
    if (!box || builtOnce) return;
    builtOnce = true;

    /* Sélecteur de fond (seulement si Mapbox actif) */
    if (USE_MAPBOX) {
      var fondBox = document.getElementById("carte-fonds");
      if (fondBox) {
        var fonds = [
          { key: "rues", label: "Rues" },
          { key: "clair", label: "Clair" },
          { key: "satellite", label: "Satellite" },
          { key: "plein_air", label: "Plein air" }
        ];
        fonds.forEach(function (f) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "carte-fond-btn" + (f.key === currentFond ? " is-active" : "");
          b.textContent = f.label;
          b.addEventListener("click", function () {
            if (f.key === currentFond) return;
            currentFond = f.key;
            fondBox.querySelectorAll(".carte-fond-btn").forEach(function (x) { x.classList.remove("is-active"); });
            b.classList.add("is-active");
            map.setStyle(MAPBOX_STYLES[f.key]); /* déclenche style.load -> addOverlays */
          });
          fondBox.appendChild(b);
        });
      }
    }

    /* Définition unifiée des couches activables. `legendHtml` = légende locale
       (zones inondables : tes classes officielles) ; `legendImg` = légende
       officielle GetLegendGraphic du WMS (milieux humides). */
    var RISK_LEGEND =
      '<span class="lg-item"><i style="background:var(--risk-faible)"></i>Faible</span>' +
      '<span class="lg-item"><i style="background:var(--risk-moderee)"></i>Modérée</span>' +
      '<span class="lg-item"><i style="background:var(--risk-elevee)"></i>Élevée</span>' +
      '<span class="lg-item"><i style="background:var(--risk-tres-elevee)"></i>Très élevée</span>' +
      '<span class="lg-item"><i style="background:var(--risk-residuel)"></i>Risque résiduel</span>';

    var toggles = [];
    if (hasGrille) toggles.push({ label: "Zones inondables cartographiées", color: "#D64545", ids: ["grille-fill", "grille-line"], on: true, note: "Secteurs où une cartographie existe." });
    LAYERS.forEach(function (l) {
      toggles.push({ label: l.label, color: l.swatch, ids: [l.id], on: l.on, legendImg: l.legend || "" });
    });
    if (hasBatiments) toggles.push({ label: "Bâtiments", color: "#0E3A52", ids: ["batiments-fill", "batiments-line"], on: true, note: "Visibles à partir d'un zoom rapproché." });

    toggles.forEach(function (t) {
      var wrap = document.createElement("div");
      wrap.className = "carte-couche-wrap";

      var row = document.createElement("label");
      row.className = "carte-couche";
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = t.on;
      cb.setAttribute("data-layers", t.ids.join(","));
      var sw = document.createElement("span");
      sw.className = "carte-couche__swatch";
      sw.style.background = t.color;
      row.appendChild(cb);
      row.appendChild(sw);
      row.appendChild(document.createTextNode(" " + t.label));
      wrap.appendChild(row);

      /* Zone de légende détaillée, repliée sauf si la couche est active. */
      var leg = document.createElement("div");
      leg.className = "carte-legende";
      leg.hidden = !t.on;
      if (t.note) { leg.innerHTML = '<p class="carte-legende__note">' + t.note + "</p>"; }
      if (t.ids.indexOf("grille-fill") !== -1) { leg.innerHTML += '<div class="lg-items">' + RISK_LEGEND + "</div>"; }
      if (t.legendImg) {
        var img = document.createElement("img");
        img.className = "carte-legende__img";
        img.alt = "Légende officielle : " + t.label;
        img.loading = "lazy";
        img.src = t.legendImg;
        leg.appendChild(img);
      }
      if (leg.innerHTML || leg.childNodes.length) { wrap.appendChild(leg); }

      cb.addEventListener("change", function () {
        var v = cb.checked ? "visible" : "none";
        t.ids.forEach(function (id) { if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v); });
        leg.hidden = !cb.checked;
      });

      box.appendChild(wrap);
    });
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
    window._rlMarker = new GL.Marker({ color: "#1E8AA0" }).setLngLat([lng, lat]).addTo(map);
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
