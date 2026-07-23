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

  /* Inondations RÉELLES observées par année (crues du printemps), servies en
     WMS CC-BY par le Ministère de la Sécurité publique (Centre des opérations
     gouvernementales). Endpoint unique « complet.fcgi » (validé : GetMap PNG
     transparent, EPSG:3857). Noms de couche vérifiés en source primaire.
     NB : la couche-groupe « Inondations_2023 » est cassée côté serveur (fichier
     source corrompu) — on l'exclut jusqu'à correction gouvernementale. */
  var MSP_WMS = "https://geoegl.msp.gouv.qc.ca/apis/wss/complet.fcgi";
  var CRUES = [
    { id: "crue2017", label: "Inondations 2017", layer: "Inondations_2017", swatch: "#2E6F9E" },
    { id: "crue2019", label: "Inondations 2019", layer: "Inondations_2019", swatch: "#1E5A85" },
    { id: "crue2020", label: "Inondations 2020", layer: "Inondations_2020", swatch: "#16496B" }
  ];

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

  /* Ajoute chaque crue comme couche WMS activable (opacité 0.55, désactivées
     par défaut). Groupe « crues » : on les note pour l'attribution MSP/COG et
     le comparateur avant/après. */
  CRUES.forEach(function (c) {
    LAYERS.push({
      id: c.id,
      label: c.label,
      tiles: wms(MSP_WMS, c.layer),
      opacity: 0.55,
      on: false,
      swatch: c.swatch,
      groupe: "crues",
      note: "Étendue d'eau réellement observée lors des crues du printemps " +
            c.label.replace("Inondations ", "") + " (imagerie satellite/radar)."
    });
  });

  /* --- Carte (2D, à plat) ------------------------------------------------- */
  var map = new GL.Map({
    container: "carte",
    style: STYLE,
    center: [-72.3, 46.6],
    zoom: 6.2,
    attributionControl: false
  });
  /* Contrôles Mapbox :
     - échelle en BAS-CENTRE ;
     - attribution compacte requise (Mapbox/OSM) en bas-droite.
     Le zoom (+/−) et le « home » sont des boutons maison rendus SOUS la barre
     de recherche (voir #carte-navctrls dans le HTML), pour un placement propre. */
  map.addControl(new GL.ScaleControl({ unit: "metric" }), "bottom-left");
  map.addControl(new GL.AttributionControl({ compact: true }), "bottom-right");

  /* Contrôles de navigation maison (home, +, −) sous la recherche. */
  (function initNavCtrls() {
    var box = document.getElementById("carte-navctrls");
    if (!box) return;
    var homeB = box.querySelector("[data-nav='home']");
    var inB = box.querySelector("[data-nav='in']");
    var outB = box.querySelector("[data-nav='out']");
    if (homeB) homeB.addEventListener("click", function () { map.flyTo({ center: [-72.3, 46.6], zoom: 6.2, duration: 900 }); });
    if (inB) inB.addEventListener("click", function () { map.zoomIn(); });
    if (outB) outB.addEventListener("click", function () { map.zoomOut(); });
  })();

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

    /* 1) Zones inondables (grille) en PMTiles vecteur — SOUS les autres.
       Vecteur = net à tous les zooms ET interrogeable pour le verdict. */
    if (GRILLE_PMTILES_URL && typeof pmtiles !== "undefined" && !map.getSource("grille")) {
      map.addSource("grille", { type: "vector", url: pmUrl(GRILLE_PMTILES_URL) });
    }
    if (GRILLE_PMTILES_URL && typeof pmtiles !== "undefined") {
      if (!map.getLayer("grille-fill")) {
        map.addLayer({
          id: "grille-fill", type: "fill", source: "grille", "source-layer": "grille_zi",
          paint: { "fill-color": "#D64545", "fill-opacity": 0.5 }
        });
      }
      if (!map.getLayer("grille-line")) {
        map.addLayer({
          id: "grille-line", type: "line", source: "grille", "source-layer": "grille_zi",
          paint: { "line-color": "#B02E2E", "line-width": 1.4, "line-opacity": 0.9 }
        });
      }
      hasGrille = true;
    }

    /* 2) Couches raster secondaires (milieux humides, municipalités) */
    LAYERS.forEach(function (l) {
      if (!map.getSource(l.id)) {
        map.addSource(l.id, { type: "raster", tiles: [l.tiles], tileSize: 256 });
      }
      if (!map.getLayer(l.id)) {
        map.addLayer({
          id: l.id, type: "raster", source: l.id,
          paint: { "raster-opacity": l.opacity },
          layout: { visibility: l.on ? "visible" : "none" }
        });
      }
    });

    /* 3) Bâtiments (PMTiles R2) — PAR-DESSUS les zones inondables. */
    if (BATIMENTS_PMTILES_URL && typeof pmtiles !== "undefined") {
      if (!map.getSource("batiments")) {
        map.addSource("batiments", { type: "vector", url: pmUrl(BATIMENTS_PMTILES_URL) });
      }
      if (!map.getLayer("batiments-fill")) {
        map.addLayer({
          id: "batiments-fill", type: "fill", source: "batiments", "source-layer": "batiments",
          minzoom: 12,
          paint: { "fill-color": "#0E3A52", "fill-opacity": 0.45 }
        });
      }
      if (!map.getLayer("batiments-line")) {
        map.addLayer({
          id: "batiments-line", type: "line", source: "batiments", "source-layer": "batiments",
          minzoom: 13,
          paint: { "line-color": "#0A2C3F", "line-width": 0.5 }
        });
      }
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

      /* Clic sur un bâtiment : popup avec sa superficie si l'attribut existe
         dans le référentiel (superficie/aire/shape_area). Sinon, un message
         neutre — on n'invente aucune donnée. */
      map.on("click", "batiments-fill", function (e) {
        if (!e.features || !e.features.length) return;
        var p = e.features[0].properties || {};
        /* Le référentiel PMTiles expose l'attribut « Superficie » (m², S majusc.).
           On garde des variantes en secours, mais Superficie est le bon nom. */
        var aire = p.Superficie != null ? p.Superficie
                 : (p.superficie || p.SUPERFICIE || p.aire || p.shape_area || null);
        var html;
        if (aire != null && !isNaN(parseFloat(aire))) {
          var m2 = Math.round(parseFloat(aire));
          html = '<strong>Bâtiment</strong><br>Superficie au sol : ' +
                 m2.toLocaleString("fr-CA") + " m&sup2;";
        } else {
          html = '<strong>Bâtiment</strong><br>Référentiel du Québec (MRNF).';
        }
        new GL.Popup({ closeButton: true, maxWidth: "220px" })
          .setLngLat(e.lngLat)
          .setHTML('<div class="carte-popup">' + html + "</div>")
          .addTo(map);
      });
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

    /* Sélecteur de fond dépliable, à vignettes (seulement si Mapbox actif).
       Un bouton « Fond de carte » ouvre une grille de vignettes-aperçus. */
    if (USE_MAPBOX) {
      var fondBox = document.getElementById("carte-fonds");
      if (fondBox) {
        var fonds = [
          { key: "rues", label: "Rues", img: "/assets/img/fonds/rues.jpg" },
          { key: "clair", label: "Clair", img: "/assets/img/fonds/clair.jpg" },
          { key: "satellite", label: "Satellite", img: "/assets/img/fonds/satellite.jpg" },
          { key: "plein_air", label: "Plein air", img: "/assets/img/fonds/plein-air.jpg" }
        ];
        function fondLabel(key) { for (var i = 0; i < fonds.length; i++) { if (fonds[i].key === key) return fonds[i].label; } return ""; }

        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "carte-fonds__trigger";
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = '<img src="' + (fonds[0].img) + '" alt="" width="40" height="30">' +
          '<span class="carte-fonds__trigger-txt">Fond&nbsp;: <b>' + fondLabel(currentFond) + "</b></span>";

        var grid = document.createElement("div");
        grid.className = "carte-fonds__grid";
        grid.hidden = true;

        fonds.forEach(function (f) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "carte-fond-vign" + (f.key === currentFond ? " is-active" : "");
          b.innerHTML = '<img src="' + f.img + '" alt="" width="80" height="60" loading="lazy"><span>' + f.label + "</span>";
          b.addEventListener("click", function () {
            grid.querySelectorAll(".carte-fond-vign").forEach(function (x) { x.classList.remove("is-active"); });
            b.classList.add("is-active");
            grid.hidden = true; trigger.setAttribute("aria-expanded", "false");
            trigger.querySelector(".carte-fonds__trigger-txt").innerHTML = "Fond&nbsp;: <b>" + f.label + "</b>";
            trigger.querySelector("img").src = f.img;
            if (f.key === currentFond) return;
            currentFond = f.key;
            map.setStyle(MAPBOX_STYLES[f.key]); /* déclenche style.load -> addOverlays */
          });
          grid.appendChild(b);
        });

        trigger.addEventListener("click", function (e) {
          e.stopPropagation();
          grid.hidden = !grid.hidden;
          trigger.setAttribute("aria-expanded", grid.hidden ? "false" : "true");
        });
        document.addEventListener("click", function (e) {
          if (!fondBox.contains(e.target)) { grid.hidden = true; trigger.setAttribute("aria-expanded", "false"); }
        });

        fondBox.appendChild(trigger);
        fondBox.appendChild(grid);
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
      toggles.push({ label: l.label, color: l.swatch, ids: [l.id], on: l.on, legendImg: l.legend || "", note: l.note || "", groupe: l.groupe || "" });
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

  /* --- Recherche d'adresse dynamique (autocomplétion Nominatim, Québec) ---- */
  var form = document.getElementById("carte-recherche");
  var input = form ? form.querySelector("input") : null;
  var msg = document.getElementById("carte-recherche-msg");
  var sugBox = document.getElementById("carte-suggestions");

  if (form && input) {
    var debounceT = null;
    var lastReq = 0;         // horodatage logique (compteur) pour ignorer les réponses obsolètes
    var activeIdx = -1;      // index de la suggestion surlignée (clavier)
    var current = [];        // suggestions affichées

    function closeSug() {
      if (!sugBox) return;
      sugBox.hidden = true; sugBox.innerHTML = "";
      current = []; activeIdx = -1;
      input.setAttribute("aria-expanded", "false");
    }

    function choisir(item) {
      input.value = item.display;
      closeSug();
      if (verdictEl) { verdictEl.hidden = true; }
      if (msg) { msg.textContent = ""; }
      localiser(item.lng, item.lat);
    }

    function renderSug(items) {
      if (!sugBox) return;
      current = items; activeIdx = -1;
      if (!items.length) { closeSug(); return; }
      sugBox.innerHTML = "";
      items.forEach(function (it, i) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        li.id = "sug-" + i;
        li.textContent = it.display;
        li.addEventListener("mousedown", function (e) { e.preventDefault(); choisir(it); });
        sugBox.appendChild(li);
      });
      sugBox.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function highlight(idx) {
      var lis = sugBox ? sugBox.querySelectorAll("li") : [];
      lis.forEach(function (li, i) { li.setAttribute("aria-selected", i === idx ? "true" : "false"); });
      activeIdx = idx;
    }

    function fetchSug(q) {
      var reqId = ++lastReq;
      var url = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=6&countrycodes=ca&q=" +
        encodeURIComponent(q + ", Québec");
      fetch(url, { headers: { "Accept-Language": "fr" } })
        .then(function (r) { return r.json(); })
        .then(function (results) {
          if (reqId !== lastReq) return; // réponse obsolète : une frappe plus récente a eu lieu
          var items = (results || []).map(function (r) {
            return { display: r.display_name, lng: parseFloat(r.lon), lat: parseFloat(r.lat) };
          });
          renderSug(items);
          if (msg) { msg.textContent = ""; }
        })
        .catch(function () {
          if (reqId !== lastReq) return;
          if (msg) { msg.textContent = "La recherche a échoué. Réessayez plus tard."; }
        });
    }

    /* Frappe : on interroge après une courte pause (debounce 280 ms). */
    input.addEventListener("input", function () {
      var q = (input.value || "").trim();
      if (debounceT) { clearTimeout(debounceT); }
      if (q.length < 3) { closeSug(); return; }
      debounceT = setTimeout(function () { fetchSug(q); }, 280);
    });

    /* Navigation clavier dans les suggestions. */
    input.addEventListener("keydown", function (e) {
      if (sugBox && sugBox.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); highlight(Math.min(activeIdx + 1, current.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); highlight(Math.max(activeIdx - 1, 0)); }
      else if (e.key === "Escape") { closeSug(); }
      else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); choisir(current[activeIdx]); }
    });

    /* Soumission (bouton flèche ou Entrée sans suggestion surlignée) :
       on prend la 1re suggestion, sinon on géocode directement. */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (activeIdx >= 0 && current[activeIdx]) { choisir(current[activeIdx]); return; }
      if (current.length) { choisir(current[0]); return; }
      var q = (input.value || "").trim();
      if (!q) return;
      if (msg) { msg.textContent = "Recherche en cours…"; }
      fetchSug(q);
    });

    /* Fermer les suggestions au clic hors du champ. */
    document.addEventListener("click", function (e) {
      if (form && !form.contains(e.target) && sugBox && !sugBox.contains(e.target)) { closeSug(); }
    });
  }

  /* --- Géolocalisation « autour de moi » (bouton icône) ------------------- */
  var geoBtn = document.getElementById("carte-geoloc");
  if (geoBtn && "geolocation" in navigator) {
    geoBtn.addEventListener("click", function () {
      geoBtn.disabled = true;
      geoBtn.classList.add("is-loading"); /* icône conservée, style d'attente via CSS */
      if (msg) { msg.textContent = "Localisation en cours…"; }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          localiser(pos.coords.longitude, pos.coords.latitude);
          geoBtn.disabled = false; geoBtn.classList.remove("is-loading");
          if (msg) { msg.textContent = ""; }
        },
        function () {
          if (msg) { msg.textContent = "Localisation refusée ou indisponible."; }
          geoBtn.disabled = false; geoBtn.classList.remove("is-loading");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  } else if (geoBtn) {
    geoBtn.hidden = true;
  }

  /* --- Pop-up de bienvenue (affiché une fois, mémorisé) ------------------- */
  var welcome = document.getElementById("carte-welcome");
  var helpBtn = document.getElementById("carte-help");
  if (welcome) {
    var SEEN_KEY = "rl-carte-welcome-seen";
    var seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch (e) {}

    function openWelcome() {
      /* Réinitialiser tous les styles inline posés par la fermeture (opacity,
         transform, animation:none, transition) pour que le pop-up réapparaisse
         proprement, avec l'animation d'entrée CSS. */
      welcome.hidden = false;
      welcome.style.opacity = "";
      welcome.style.transition = "";
      welcome.style.animation = "";
      var c0 = welcome.querySelector(".carte-welcome__card");
      if (c0) {
        c0.style.transform = "";
        c0.style.opacity = "";
        c0.style.transition = "";
        c0.style.animation = "";
      }
    }
    function closeWelcome(withWipe) {
      try { localStorage.setItem(SEEN_KEY, "1"); } catch (e) {}
      if (helpBtn) { helpBtn.hidden = false; }

      var card = welcome.querySelector(".carte-welcome__card");

      if (!REDUCED) {
        /* Retirer l'animation CSS d'entrée (elle a `both` et figerait opacity:1,
           écrasant notre fondu inline). Puis appliquer le fondu de sortie. */
        welcome.style.animation = "none";
        if (card) { card.style.animation = "none"; }
        /* Forcer un reflow pour que la transition inline suivante s'applique. */
        void welcome.offsetHeight;
        welcome.style.transition = "opacity .45s cubic-bezier(.16,1,.3,1)";
        welcome.style.opacity = "0";
        if (card) {
          card.style.transition = "transform .45s cubic-bezier(.16,1,.3,1), opacity .45s ease";
          card.style.transform = "scale(1.05)";
          card.style.opacity = "0";
        }
        /* Léger zoom de la carte. */
        if (withWipe && map && map.getZoom) {
          map.easeTo({ zoom: map.getZoom() + 0.6, duration: 1300, easing: function (t) { return 1 - Math.pow(1 - t, 3); } });
        }
        if (withWipe) { playWipe(); }
        setTimeout(function () { welcome.hidden = true; }, 480);
      } else {
        welcome.hidden = true;
        if (withWipe) { playWipe(); }
      }
    }

    /* À la première visite : le rideau couvre l'écran sous le pop-up, et le wipe
       le retire au clic « Explorer ». */
    if (!seen) {
      if (!REDUCED) {
        var wsvg = document.getElementById("carte-wipe");
        if (wsvg) { wsvg.hidden = false; }
      }
      openWelcome();
    } else if (helpBtn) { helpBtn.hidden = false; }

    /* Le bouton « Explorer la carte » déclenche le wipe ; le fond/Échap non. */
    var cta = welcome.querySelector(".carte-welcome__cta");
    welcome.querySelectorAll("[data-cw-close]").forEach(function (b) {
      b.addEventListener("click", function () { closeWelcome(b === cta); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !welcome.hidden) { closeWelcome(false); }
    });
    if (helpBtn) { helpBtn.addEventListener("click", openWelcome); }
  }

  /* --- Wipe de transition (rideau SVG à bord courbe) --------------------- */
  /* Reproduit l'effet Codrops (021, vertical) : le rideau plein écran se retire
     vers le haut avec un bord courbe qui ondule. Animé avec GSAP (mêmes paths
     et eases que la démo) pour un rendu fidèle. Instantané en reduced-motion. */
  var WIPE_PATHS = {
    filled: "M 0 0 V 100 Q 50 100 100 100 V 0 z",
    inBetween: "M 0 0 V 50 Q 50 0 100 50 V 0 z",
    unfilled: "M 0 0 V 0 Q 50 0 100 0 V 0 z"
  };
  function playWipe() {
    var svg = document.getElementById("carte-wipe");
    if (!svg) return;
    var path = svg.querySelector(".carte-wipe__path");
    if (!path) return;
    if (REDUCED || typeof gsap === "undefined") {
      svg.hidden = true; return; /* on GARDE le SVG pour pouvoir rejouer le wipe */
    }
    svg.hidden = false;
    gsap.timeline({
      onComplete: function () { svg.hidden = true; }
    })
      .set(path, { attr: { d: WIPE_PATHS.filled } })
      .to(path, { duration: 0.25, ease: "sine.in", attr: { d: WIPE_PATHS.inBetween } })
      .to(path, { duration: 1, ease: "power4", attr: { d: WIPE_PATHS.unfilled } });
  }

  /* ======================================================================
     COMPARATEUR AVANT / APRÈS (slider « swipe »)
     Compare deux années de crues côte à côte. Technique : une 2e carte
     superposée (#carte-compare) montrant la couche B, synchronisée avec la
     carte principale (montrant A), et clippée par un slider vertical.
     Sans dépendance (équivalent maison de mapbox-gl-compare).
     ====================================================================== */
  var compareMap = null;
  var compareOn = false;
  var compareEls = null; // { wrap, slider, canvasB, selA, selB }

  function crueTiles(layerName) {
    return wms(MSP_WMS, layerName);
  }
  function crueLayerName(id) {
    for (var i = 0; i < CRUES.length; i++) { if (CRUES[i].id === id) return CRUES[i].layer; }
    return null;
  }

  function syncFrom(a, b) {
    // Recopie la vue de a vers b sans boucle d'événements.
    b.jumpTo({ center: a.getCenter(), zoom: a.getZoom(), bearing: a.getBearing(), pitch: a.getPitch() });
  }

  function setCompareLayer(mapObj, layerName) {
    if (mapObj.getLayer("compare-crue")) { mapObj.removeLayer("compare-crue"); }
    if (mapObj.getSource("compare-crue")) { mapObj.removeSource("compare-crue"); }
    mapObj.addSource("compare-crue", { type: "raster", tiles: [crueTiles(layerName)], tileSize: 256 });
    mapObj.addLayer({ id: "compare-crue", type: "raster", source: "compare-crue", paint: { "raster-opacity": 0.75 } });
  }

  function positionSlider(x) {
    if (!compareEls) return;
    var w = compareEls.wrap.clientWidth || 1;
    var pct = Math.max(0, Math.min(100, (x / w) * 100));
    compareEls.canvasB.style.clipPath = "inset(0 0 0 " + pct + "%)";
    compareEls.canvasB.style.webkitClipPath = "inset(0 0 0 " + pct + "%)";
    compareEls.slider.style.left = pct + "%";
  }

  function ouvrirComparateur() {
    if (compareOn) return;
    var wrap = document.getElementById("carte-compare-wrap");
    var canvasB = document.getElementById("carte-compare");
    var slider = document.getElementById("carte-compare-slider");
    var selA = document.getElementById("cmp-annee-a");
    var selB = document.getElementById("cmp-annee-b");
    if (!wrap || !canvasB || !slider || !selA || !selB) return;
    compareEls = { wrap: wrap, canvasB: canvasB, slider: slider, selA: selA, selB: selB };
    wrap.hidden = false;
    compareOn = true;

    // Carte B (couche de droite), même fond que la principale.
    compareMap = new GL.Map({
      container: "carte-compare", style: USE_MAPBOX ? MAPBOX_STYLES[currentFond] : STYLE,
      center: map.getCenter(), zoom: map.getZoom(), attributionControl: false, interactive: false
    });
    compareMap.on("load", function () {
      setCompareLayer(compareMap, crueLayerName(selB.value) || CRUES[1].layer);
    });

    // Couche A sur la carte principale.
    setCompareLayer(map, crueLayerName(selA.value) || CRUES[0].layer);

    // Synchronisation : la principale pilote, B suit.
    var syncing = false;
    function relay() { if (syncing) return; syncing = true; syncFrom(map, compareMap); syncing = false; }
    map.on("move", relay);
    compareEls._relay = relay;

    // Slider drag.
    positionSlider(wrap.clientWidth / 2);
    function onDrag(clientX) {
      var rect = wrap.getBoundingClientRect();
      positionSlider(clientX - rect.left);
    }
    var dragging = false;
    slider.addEventListener("mousedown", function () { dragging = true; document.body.style.userSelect = "none"; });
    window.addEventListener("mousemove", function (e) { if (dragging) onDrag(e.clientX); });
    window.addEventListener("mouseup", function () { dragging = false; document.body.style.userSelect = ""; });
    slider.addEventListener("touchstart", function () { dragging = true; }, { passive: true });
    window.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) onDrag(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchend", function () { dragging = false; });

    // Changement d'année.
    selA.addEventListener("change", function () { setCompareLayer(map, crueLayerName(selA.value)); });
    selB.addEventListener("change", function () { if (compareMap) setCompareLayer(compareMap, crueLayerName(selB.value)); });
  }

  function fermerComparateur() {
    if (!compareOn) return;
    compareOn = false;
    if (compareEls && compareEls._relay) { map.off("move", compareEls._relay); }
    if (map.getLayer("compare-crue")) { map.removeLayer("compare-crue"); }
    if (map.getSource("compare-crue")) { map.removeSource("compare-crue"); }
    if (compareMap) { compareMap.remove(); compareMap = null; }
    if (compareEls) { compareEls.wrap.hidden = true; }
  }

  (function initComparateurBtn() {
    var btn = document.getElementById("carte-compare-btn");
    var closeBtn = document.getElementById("carte-compare-close");
    if (btn) {
      btn.addEventListener("click", function () { compareOn ? fermerComparateur() : ouvrirComparateur(); });
    }
    if (closeBtn) { closeBtn.addEventListener("click", fermerComparateur); }
    // Peupler les menus d'années à partir de CRUES.
    ["cmp-annee-a", "cmp-annee-b"].forEach(function (selId, idx) {
      var sel = document.getElementById(selId);
      if (!sel) return;
      CRUES.forEach(function (c) {
        var o = document.createElement("option");
        o.value = c.id; o.textContent = c.label.replace("Inondations ", "");
        sel.appendChild(o);
      });
      sel.value = CRUES[Math.min(idx, CRUES.length - 1)].id; // A=1re, B=2e année par défaut
    });
  })();

  /* ======================================================================
     PARTAGE (copier le lien + réseaux sociaux)
     ====================================================================== */
  (function initPartage() {
    var btn = document.getElementById("carte-share-btn");
    var menu = document.getElementById("carte-share-menu");
    if (!btn || !menu) return;

    function pageUrl() {
      // Lien vers la carte (canonique portail si en iframe, sinon URL courante).
      try { return window.location.href; } catch (e) { return ""; }
    }
    function toggleMenu(open) {
      menu.hidden = (open === undefined) ? !menu.hidden : !open;
      btn.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(); });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== btn) { toggleMenu(false); }
    });

    var copierBtn = menu.querySelector("[data-share='copier']");
    if (copierBtn) {
      copierBtn.addEventListener("click", function () {
        var u = pageUrl();
        var done = function () { copierBtn.textContent = "Lien copié !"; setTimeout(function () { copierBtn.textContent = "Copier le lien"; }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(u).then(done).catch(done);
        } else {
          var t = document.createElement("textarea"); t.value = u; document.body.appendChild(t);
          t.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(t); done();
        }
      });
    }
    menu.querySelectorAll("[data-share-net]").forEach(function (a) {
      a.addEventListener("click", function () {
        var u = encodeURIComponent(pageUrl());
        var txt = encodeURIComponent("Carte des zones inondables du Québec — Rivières Libres");
        var net = a.getAttribute("data-share-net");
        var href = "";
        if (net === "facebook") href = "https://www.facebook.com/sharer/sharer.php?u=" + u;
        else if (net === "x") href = "https://twitter.com/intent/tweet?url=" + u + "&text=" + txt;
        else if (net === "linkedin") href = "https://www.linkedin.com/sharing/share-offsite/?url=" + u;
        else if (net === "courriel") href = "mailto:?subject=" + txt + "&body=" + u;
        if (href) { window.open(href, net === "courriel" ? "_self" : "_blank", "noopener,width=600,height=500"); }
        toggleMenu(false);
      });
    });
  })();

  /* ======================================================================
     NOTATION 1 à 5 étoiles (feedback)
     ====================================================================== */
  (function initNotation() {
    var btn = document.getElementById("carte-rate-btn");
    var pop = document.getElementById("carte-rate-pop");
    if (!btn || !pop) return;
    var RATE_KEY = "rl-carte-note";
    var stars = pop.querySelectorAll(".carte-rate__star");
    var msgEl = pop.querySelector(".carte-rate__msg");

    var saved = 0;
    try { saved = parseInt(localStorage.getItem(RATE_KEY) || "0", 10) || 0; } catch (e) {}

    function paint(n) {
      stars.forEach(function (s, i) { s.classList.toggle("is-on", i < n); });
    }
    function togglePop(open) {
      pop.hidden = (open === undefined) ? !pop.hidden : !open;
      btn.setAttribute("aria-expanded", pop.hidden ? "false" : "true");
      if (!pop.hidden) { paint(saved); }
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); togglePop(); });
    document.addEventListener("click", function (e) {
      if (!pop.contains(e.target) && e.target !== btn) { togglePop(false); }
    });

    stars.forEach(function (s, i) {
      s.addEventListener("mouseenter", function () { paint(i + 1); });
      s.addEventListener("mouseleave", function () { paint(saved); });
      s.addEventListener("click", function () {
        saved = i + 1;
        try { localStorage.setItem(RATE_KEY, String(saved)); } catch (e) {}
        paint(saved);
        if (msgEl) { msgEl.textContent = "Merci pour votre avis !"; }
      });
    });
    if (saved > 0) { paint(saved); }
  })();

  /* ======================================================================
     SOURCES (popover « i » en bas-droite)
     ====================================================================== */
  (function initSources() {
    var btn = document.getElementById("carte-src-btn");
    var pop = document.getElementById("carte-src-pop");
    if (!btn || !pop) return;
    function toggle(open) {
      pop.hidden = (open === undefined) ? !pop.hidden : !open;
      btn.setAttribute("aria-expanded", pop.hidden ? "false" : "true");
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    document.addEventListener("click", function (e) {
      if (!pop.contains(e.target) && e.target !== btn) { toggle(false); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { toggle(false); } });
  })();

  /* ======================================================================
     PANNEAU COUCHES REPLIABLE
     ====================================================================== */
  (function initLayersCollapse() {
    var toggle = document.querySelector(".embed-map__layers-toggle");
    var body = document.getElementById("carte-couches-body");
    if (!toggle || !body) return;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      body.hidden = open;
    });
  })();

  /* ======================================================================
     PLEIN ÉCRAN natif (API Fullscreen)
     ====================================================================== */
  (function initFullscreen() {
    var btn = document.getElementById("carte-fs-btn");
    if (!btn) return;
    var target = document.querySelector(".embed-map") || el;
    function isFs() { return document.fullscreenElement || document.webkitFullscreenElement; }
    btn.addEventListener("click", function () {
      if (isFs()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var req = target.requestFullscreen || target.webkitRequestFullscreen;
        if (req) { req.call(target); }
      }
    });
    document.addEventListener("fullscreenchange", function () {
      btn.classList.toggle("is-active", !!isFs());
      setTimeout(function () { map.resize(); if (compareMap) compareMap.resize(); }, 120);
    });
  })();
})();
