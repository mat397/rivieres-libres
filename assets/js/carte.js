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
  var BDZI_PMTILES_URL = CFG.bdziPmtiles || "";
  var MH_PMTILES_URL = CFG.mhPmtiles || "";
  var MUNI_PMTILES_URL = CFG.muniPmtiles || "";
  var STATIONS_URL = CFG.stationsUrl || "";
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
  var currentFond = "rues"; /* fond « Rues » par défaut */

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
     Toutes les couches sont désormais en PMTiles vecteur (voir addOverlays) :
     grille, BDZI, milieux humides détaillés, municipalités, bâtiments.
     Plus aucune couche WMS raster (labels répétés, dépendance serveur). */

  var LAYERS = []; /* plus de couche WMS raster : tout est en vecteur */

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
  /* Attribution : on garde le LOGO Mapbox (obligatoire) mais on masque le bouton
     « i » texte via CSS (.embed-map .mapboxgl-ctrl-attrib-button). L'attribution
     complète (Mapbox, OSM + sources gouvernementales) est reprise dans le popover
     « Sources » du portail, pour éviter le doublon de « i » en bas-droite. */
  map.addControl(new GL.AttributionControl({ compact: true }), "bottom-left");

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
  var hasBdzi = false;
  var hasMh = false;
  var hasMuni = false;
  var hasStations = false;
  var stationsRequested = false;
  var stationsInPanel = false;
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

    /* 1b) BDZI (PMTiles vecteur, self-host R2) — cartographie réglementaire
       colorée par classe officielle (Description). Désactivée par défaut.
       Interrogeable (croisement bâtiment × zone). */
    if (BDZI_PMTILES_URL && typeof pmtiles !== "undefined") {
      if (!map.getSource("bdzi")) {
        map.addSource("bdzi", { type: "vector", url: pmUrl(BDZI_PMTILES_URL) });
      }
      /* Couleurs officielles MELCCFP par classe (match sur le champ Description,
         y compris les variantes « - Pont »). */
      var BDZI_COLOR = ["match", ["get", "Description"],
        ["Zone de grand courant", "Zone de grand courant - Pont"], "#3E7CB1",
        ["Zone de faible courant", "Zone de faible courant - Pont"], "#8FB8DE",
        ["Zone de crue 0-100 ans", "Zone de crue 0-100 ans - Pont"], "#D64545",
        "#6B7B8C" /* Autre zone inondable + défaut */
      ];
      if (!map.getLayer("bdzi-fill")) {
        map.addLayer({
          id: "bdzi-fill", type: "fill", source: "bdzi", "source-layer": "bdzi",
          paint: { "fill-color": BDZI_COLOR, "fill-opacity": 0.55 },
          layout: { visibility: "none" }
        });
      }
      if (!map.getLayer("bdzi-line")) {
        map.addLayer({
          id: "bdzi-line", type: "line", source: "bdzi", "source-layer": "bdzi",
          paint: { "line-color": BDZI_COLOR, "line-width": 0.8, "line-opacity": 0.9 },
          layout: { visibility: "none" }
        });
      }
      hasBdzi = true;
    }

    /* 1c) Milieux humides — cartographie détaillée 2023 (PMTiles vecteur R2).
       Remplace l'ancien WMS « potentiels ». Coloré par classe (CLASSE) :
       marais, marécage, tourbières, prairie humide, eau peu profonde. */
    if (MH_PMTILES_URL && typeof pmtiles !== "undefined") {
      if (!map.getSource("mh")) {
        map.addSource("mh", { type: "vector", url: pmUrl(MH_PMTILES_URL) });
      }
      /* Palette CONTRASTÉE par type de milieu humide (nomenclature MELCCFP) :
         teintes distinctes pour que la carte et la légende soient lisibles. */
      var MH_COLOR = ["match", ["get", "CLASSE"],
        "EP", "#2E86AB",  /* eau peu profonde — bleu */
        "MS", "#3FA535",  /* marais — vert franc */
        "ME", "#1F5C1A",  /* marécage — vert très foncé (boisé) */
        "PH", "#E0A800",  /* prairie humide — doré/ocre (bien distinct des verts) */
        "TB", "#8B5E3C",  /* tourbière boisée — brun */
        "BG", "#A0522D",  /* tourbière ombrotrophe — brun-roux */
        "FN", "#C08552",  /* tourbière minérotrophe — brun clair */
        "#5E8C3F" /* défaut */
      ];
      if (!map.getLayer("mh-fill")) {
        map.addLayer({
          id: "mh-fill", type: "fill", source: "mh", "source-layer": "mh",
          paint: { "fill-color": MH_COLOR, "fill-opacity": 0.5 },
          layout: { visibility: "none" }
        });
      }
      hasMh = true;
    }

    /* 1d) Municipalités — limites VECTEUR (PMTiles R2), SANS étiquettes répétées
       (contrairement au WMS). Contour seulement ; le nom s'affiche au clic. */
    if (MUNI_PMTILES_URL && typeof pmtiles !== "undefined") {
      if (!map.getSource("muni")) {
        map.addSource("muni", { type: "vector", url: pmUrl(MUNI_PMTILES_URL) });
      }
      if (!map.getLayer("muni-line")) {
        map.addLayer({
          id: "muni-line", type: "line", source: "muni", "source-layer": "muni",
          paint: { "line-color": "#0E3A52", "line-width": 1, "line-opacity": 0.7 },
          layout: { visibility: "none" }
        });
      }
      hasMuni = true;
    }

    /* 1e) Stations hydrométriques temps réel (GeoJSON MSP Vigilance) — points
       du niveau/débit ACTUEL des rivières. Chargé en direct (données fraîches),
       avec garde : si le serveur gouvernemental échoue, la carte n'est pas
       cassée. Ajouté une seule fois (drapeau). */
    if (STATIONS_URL && !stationsRequested) {
      stationsRequested = true;
      fetch(STATIONS_URL)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (geojson) {
          if (!geojson || !geojson.features || !map) return;
          if (!map.getSource("stations")) {
            map.addSource("stations", { type: "geojson", data: geojson });
          }
          /* Couleur du point selon l'état de vigilance. */
          var STATION_COLOR = ["match", ["get", "etat"],
            "Surveillance", "#E8923A",
            "Alerte", "#D64545",
            "Alerte majeure", "#9B2C2C",
            "#1E8AA0" /* normal / inconnu : turquoise */
          ];
          if (!map.getLayer("stations-pt")) {
            map.addLayer({
              id: "stations-pt", type: "circle", source: "stations", minzoom: 6,
              paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 3.5, 12, 7],
                "circle-color": STATION_COLOR,
                "circle-stroke-color": "#fff", "circle-stroke-width": 1.5,
                "circle-opacity": 0.9
              },
              layout: { visibility: "none" }
            });
          }
          hasStations = true;
          if (overlaysReady && !stationsInPanel) { addStationToggle(); }
        })
        .catch(function () { /* serveur gouv indisponible : on ignore silencieusement */ });
    }

    /* 2) (aucune couche raster secondaire restante) */
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
      /* F — Couche de survol : le bâtiment sous la souris ressort (turquoise +
         contour épais). Pilotée par feature-state au mousemove. */
      if (!map.getLayer("batiments-hover")) {
        map.addLayer({
          id: "batiments-hover", type: "line", source: "batiments", "source-layer": "batiments",
          minzoom: 12,
          paint: {
            "line-color": "#1E8AA0",
            "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 2.4, 0],
            "line-opacity": 0.95
          }
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

  /* D — Si l'URL contient une position (lien partagé), on y va au chargement. */
  map.on("load", function () {
    try {
      var q = new URL(window.location.href).searchParams;
      var lat = parseFloat(q.get("lat")), lng = parseFloat(q.get("lng"));
      if (!isNaN(lat) && !isNaN(lng)) {
        // Léger délai pour laisser les couches s'attacher (verdict fiable).
        setTimeout(function () { localiser(lng, lat); }, 300);
      }
    } catch (e) {}
  });

  /* Interactions bâtiments (attachées une seule fois, indépendantes du style) */
  if (BATIMENTS_PMTILES_URL) {
    (function () {
      var hoveredId = null;
      map.on("mouseenter", "batiments-fill", function () { map.getCanvas().style.cursor = "pointer"; });
      map.on("mousemove", "batiments-fill", function (e) {
        if (!e.features || !e.features.length) return;
        var id = e.features[0].id;
        if (id == null) return;
        if (hoveredId !== null && hoveredId !== id) {
          map.setFeatureState({ source: "batiments", sourceLayer: "batiments", id: hoveredId }, { hover: false });
        }
        hoveredId = id;
        map.setFeatureState({ source: "batiments", sourceLayer: "batiments", id: hoveredId }, { hover: true });
      });
      map.on("mouseleave", "batiments-fill", function () {
        map.getCanvas().style.cursor = "";
        if (hoveredId !== null) {
          map.setFeatureState({ source: "batiments", sourceLayer: "batiments", id: hoveredId }, { hover: false });
          hoveredId = null;
        }
      });

      /* Clic sur un bâtiment : popup avec superficie + CROISEMENT zone inondable
         (le bâtiment tombe-t-il dans un secteur cartographié ?). Formulation
         prudente : « cartographié » ≠ « sera inondé ». */
      map.on("click", "batiments-fill", function (e) {
        if (!e.features || !e.features.length) return;
        var p = e.features[0].properties || {};
        var aire = p.Superficie != null ? p.Superficie
                 : (p.superficie || p.SUPERFICIE || p.aire || p.shape_area || null);
        var superf = (aire != null && !isNaN(parseFloat(aire)))
          ? Math.round(parseFloat(aire)).toLocaleString("fr-CA") + " m&sup2;"
          : "Référentiel du Québec (MRNF)";

        // Croisement au point avec les couches VECTEUR interrogeables. La BDZI est
        // désormais vecteur : si elle est activée, on lit sa CLASSE au point
        // (grand courant / crue 0-100 ans…). Sinon on se rabat sur la grille.
        var pt2 = map.project([e.lngLat.lng, e.lngLat.lat]);
        var bdziFeat = (hasBdzi && map.getLayer("bdzi-fill") && map.getLayoutProperty("bdzi-fill", "visibility") === "visible")
          ? map.queryRenderedFeatures(pt2, { layers: ["bdzi-fill"] }) : [];
        var enGrille = pointDansGrille(e.lngLat.lng, e.lngLat.lat);

        var badge, note;
        if (bdziFeat && bdziFeat.length) {
          var classe = (bdziFeat[0].properties || {}).Description || "Zone inondable";
          badge = '<span class="carte-popup__zone carte-popup__zone--in">BDZI : ' + classe + "</span>";
          note = "Ce bâtiment touche une zone inondable réglementaire (BDZI). « Cartographié » ne veut pas dire « sera inondé » : vérifiez auprès de votre municipalité.";
        } else if (enGrille) {
          badge = '<span class="carte-popup__zone carte-popup__zone--in">Dans la grille (zone inondable ou de mobilité)</span>';
          note = "Activez la couche « Zones inondables réglementaires (BDZI) » pour la classe précise. Vérifiez auprès de votre municipalité.";
        } else {
          badge = '<span class="carte-popup__zone carte-popup__zone--out">Hors zone cartographiée</span>';
          note = "L'absence de cartographie ne garantit pas l'absence de risque. Activez la couche BDZI pour plus de détail.";
        }

        var html = '<strong>Bâtiment</strong>' + badge +
          '<span class="carte-popup__sup">Superficie au sol : ' + superf + "</span>" +
          '<span class="carte-popup__note">' + note + "</span>";

        new GL.Popup({ closeButton: true, maxWidth: "240px" })
          .setLngLat(e.lngLat)
          .setHTML('<div class="carte-popup">' + html + "</div>")
          .addTo(map);
      });
    })();
  }

  /* Clic sur une station hydrométrique : popup avec débit/niveau actuels,
     l'état de vigilance et un lien vers la fiche officielle. */
  if (STATIONS_URL) {
    map.on("click", "stations-pt", function (e) {
      if (!e.features || !e.features.length) return;
      var p = e.features[0].properties || {};
      var deb = (p.dern_valeur_deb != null) ? (p.dern_valeur_deb + " m&sup3;/s") : "n.d.";
      var niv = (p.dern_valeur_niv != null) ? (p.dern_valeur_niv + " m") : "n.d.";
      var date = p.dern_date_prise_valeur_utc ? p.dern_date_prise_valeur_utc.replace("T", " ").slice(0, 16) : "";
      var lien = p.url_vigilance || p.fournisseur_url || "";
      var html = '<strong>' + (p.plan_deau || "Station hydrométrique") + "</strong>" +
        '<span class="carte-popup__note">' + (p.description || "") + "</span>" +
        '<span class="carte-popup__sup">Débit : ' + deb + " &middot; Niveau : " + niv + "</span>" +
        (p.etat ? '<span class="carte-popup__zone ' + (p.etat.indexOf("lerte") !== -1 ? "carte-popup__zone--in" : "carte-popup__zone--out") + '">État : ' + p.etat + "</span>" : "") +
        (date ? '<span class="carte-popup__note">Mesure : ' + date + " (UTC)</span>" : "") +
        (lien ? '<span class="carte-popup__note"><a href="' + lien + '" target="_blank" rel="noopener">Fiche officielle</a></span>' : "");
      new GL.Popup({ closeButton: true, maxWidth: "250px" })
        .setLngLat(e.lngLat)
        .setHTML('<div class="carte-popup">' + html + "</div>")
        .addTo(map);
    });
    map.on("mouseenter", "stations-pt", function () { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "stations-pt", function () { map.getCanvas().style.cursor = ""; });
  }

  /* Clic sur une limite municipale : popup avec le nom (la couche n'a PAS
     d'étiquette rendue, donc le nom vient au clic — évite la répétition). */
  if (MUNI_PMTILES_URL) {
    map.on("click", "muni-line", function (e) {
      if (!e.features || !e.features.length) return;
      var p = e.features[0].properties || {};
      var nom = p.MUS_NM_MUN || "Municipalité";
      var mrc = p.MUS_NM_MRC ? ("<br><span class=\"carte-popup__note\">MRC : " + p.MUS_NM_MRC + "</span>") : "";
      new GL.Popup({ closeButton: true, maxWidth: "220px" })
        .setLngLat(e.lngLat)
        .setHTML('<div class="carte-popup"><strong>' + nom + "</strong>" + mrc + "</div>")
        .addTo(map);
    });
    map.on("mouseenter", "muni-line", function () { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "muni-line", function () { map.getCanvas().style.cursor = ""; });
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

  /* --- Tooltip flottant (position: fixed) : jamais clippé par un overflow --- */
  var tipEl = null;
  function showTip(anchor, text) {
    if (!tipEl) {
      tipEl = document.createElement("div");
      tipEl.className = "carte-tip";
      document.body.appendChild(tipEl);
    }
    tipEl.textContent = text;
    tipEl.style.display = "block";
    var r = anchor.getBoundingClientRect();
    // Positionner sous le « i », aligné à droite, en restant dans l'écran.
    var w = 210;
    var left = Math.min(r.right - w, window.innerWidth - w - 8);
    left = Math.max(8, left);
    tipEl.style.left = left + "px";
    tipEl.style.top = (r.bottom + 6) + "px";
    tipEl.style.width = w + "px";
    requestAnimationFrame(function () { tipEl.classList.add("is-on"); });
  }
  function hideTip() {
    if (tipEl) { tipEl.classList.remove("is-on"); tipEl.style.display = "none"; }
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

    /* Légende de la GRILLE : la couche est rendue en rouge UNIFORME
       (fill-color #D64545), sans distinction de classe. On affiche donc UNE
       seule entrée honnête — pas 5 classes que la carte ne montre pas.
       La symbologie détaillée par intensité vit dans la couche BDZI. */
    var GRILLE_LEGEND =
      '<span class="lg-item"><i style="background:#D64545"></i>Secteur cartographié</span>';

    /* Légende BDZI dessinée — mêmes couleurs que le rendu de la couche vecteur
       (classes officielles MELCCFP). */
    var BDZI_LEGEND =
      '<span class="lg-item"><i style="background:#3E7CB1"></i>Zone de grand courant</span>' +
      '<span class="lg-item"><i style="background:#8FB8DE"></i>Zone de faible courant</span>' +
      '<span class="lg-item"><i style="background:#D64545"></i>Zone de crue 0-100 ans</span>' +
      '<span class="lg-item"><i style="background:#6B7B8C"></i>Autre zone inondable</span>';

    /* Légende milieux humides (cartographie détaillée 2023) par type —
       couleurs contrastées, identiques au rendu de la couche. */
    var MH_LEGEND =
      '<span class="lg-item"><i style="background:#3FA535"></i>Marais</span>' +
      '<span class="lg-item"><i style="background:#1F5C1A"></i>Marécage</span>' +
      '<span class="lg-item"><i style="background:#E0A800"></i>Prairie humide</span>' +
      '<span class="lg-item"><i style="background:#8B5E3C"></i>Tourbière</span>' +
      '<span class="lg-item"><i style="background:#2E86AB"></i>Eau peu profonde</span>';

    var toggles = [];
    if (hasGrille) toggles.push({ label: "Zones inondables et de mobilité des cours d'eau", color: "#D64545", ids: ["grille-fill", "grille-line"], on: true, note: "Secteurs où une cartographie existe." });
    if (hasBdzi) toggles.push({ label: "Zones inondables réglementaires (BDZI)", color: "#3E7CB1", ids: ["bdzi-fill", "bdzi-line"], on: false, bdziLegend: true, note: "Cartographie réglementaire par force du courant et récurrence (crue 0-100 ans). Donnée préliminaire, sujette à révision. Source : MELCCFP / CEHQ." });
    if (hasMh) toggles.push({ label: "Milieux humides", color: "#5E8C3F", ids: ["mh-fill"], on: false, mhLegend: true, note: "Cartographie détaillée des milieux humides du sud du Québec (2023). Source : MELCCFP." });
    if (hasMuni) toggles.push({ label: "Limites municipales", color: "#0E3A52", ids: ["muni-line"], on: false, simpleSwatch: "#0E3A52", note: "Limites des municipalités du Québec. Cliquez pour voir le nom. Source : SDA, MRNF." });
    LAYERS.forEach(function (l) {
      /* Les couches d'inondations par année (groupe « crues ») sont pilotées par
         le slider temporel en bas, PAS par une case ici : on les exclut du panneau
         pour l'alléger. */
      if (l.groupe === "crues") { return; }
      toggles.push({ label: l.label, color: l.swatch, ids: [l.id], on: l.on, legendImg: l.legend || "", note: l.note || "", groupe: l.groupe || "", simpleSwatch: l.simpleSwatch || "" });
    });
    if (hasBatiments) toggles.push({ label: "Bâtiments", color: "#0E3A52", ids: ["batiments-fill", "batiments-line"], on: true, note: "Visibles à partir d'un zoom rapproché." });

    /* Construit et ajoute une ligne de couche au panneau. Réutilisable (aussi
       pour les stations qui arrivent en asynchrone après le build). */
    makeToggle = function (t) {
      var wrap = document.createElement("div");
      wrap.className = "carte-couche-wrap";

      var row = document.createElement("label");
      row.className = "carte-couche";
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = t.on;
      cb.setAttribute("data-layers", t.ids.join(","));
      row.appendChild(cb);
      row.appendChild(document.createTextNode(t.label));
      wrap.appendChild(row);

      if (t.note) {
        var info = document.createElement("span");
        info.className = "carte-couche__info";
        info.setAttribute("role", "img");
        info.setAttribute("aria-label", t.note);
        info.setAttribute("tabindex", "0");
        info.textContent = "i";
        info.setAttribute("data-tip", t.note);
        row.appendChild(info);
        info.addEventListener("mouseenter", function () { showTip(info, t.note); });
        info.addEventListener("mouseleave", hideTip);
        info.addEventListener("focus", function () { showTip(info, t.note); });
        info.addEventListener("blur", hideTip);
      }

      var leg = document.createElement("div");
      leg.className = "carte-legende";
      leg.hidden = !t.on;
      if (t.ids.indexOf("grille-fill") !== -1) { leg.innerHTML += '<div class="lg-items">' + GRILLE_LEGEND + "</div>"; }
      if (t.bdziLegend) { leg.innerHTML += '<div class="lg-items">' + BDZI_LEGEND + "</div>"; }
      if (t.mhLegend) { leg.innerHTML += '<div class="lg-items">' + MH_LEGEND + "</div>"; }
      if (t.stationsLegend) { leg.innerHTML += '<div class="lg-items">' + STATIONS_LEGEND + "</div>"; }
      if (t.simpleSwatch) { leg.innerHTML += '<div class="lg-items"><span class="lg-item"><i style="background:' + t.simpleSwatch + '"></i>' + t.label + "</span></div>"; }
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
    };

    toggles.forEach(makeToggle);

    /* Si les stations sont déjà chargées au moment du build, on ajoute leur
       toggle ici ; sinon addStationToggle() s'en charge à l'arrivée du fetch. */
    if (hasStations && !stationsInPanel) { addStationToggle(); }
  }

  /* Légende + toggle des stations (défini au niveau IIFE pour être appelable
     depuis le fetch asynchrone comme depuis buildControls). */
  var makeToggle = null;
  var STATIONS_LEGEND =
    '<span class="lg-item"><i style="background:#1E8AA0;border-radius:50%"></i>Niveau normal / inconnu</span>' +
    '<span class="lg-item"><i style="background:#E8923A;border-radius:50%"></i>Surveillance</span>' +
    '<span class="lg-item"><i style="background:#D64545;border-radius:50%"></i>Alerte</span>';
  function addStationToggle() {
    if (stationsInPanel || !makeToggle) return;
    stationsInPanel = true;
    makeToggle({
      label: "Niveau des rivières (temps réel)", ids: ["stations-pt"], on: false,
      stationsLegend: true,
      note: "Stations hydrométriques : débit et niveau actuels des rivières, avec état de vigilance. Cliquez une station. Source : MSP / CEHQ (temps réel)."
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

  function pointSurBatiment(lng, lat) {
    if (!hasBatiments || !map.getLayer("batiments-fill")) return null;
    var pt = map.project([lng, lat]);
    var feats = map.queryRenderedFeatures(pt, { layers: ["batiments-fill"] });
    if (feats && feats.length) {
      var p = feats[0].properties || {};
      var a = p.Superficie != null ? p.Superficie : null;
      return { aire: a };
    }
    return null;
  }

  /* Verdict citoyen enrichi : croise zone inondable + bâtiment au point.
     Ton prudent, non alarmiste, avertissement + renvoi municipalité systématiques.
     Encadré pédagogique « ce que ça implique / quoi faire ». */
  function afficheVerdict(lng, lat) {
    if (!verdictEl) return;
    var dansZone = pointDansGrille(lng, lat);
    var bati = pointSurBatiment(lng, lat);
    var zoomProche = map.getZoom() >= 12; // les bâtiments n'apparaissent qu'au zoom rapproché

    var titre, corps, cls, quoiFaire;

    if (dansZone) {
      cls = "carte-verdict--in";
      if (bati) {
        titre = "Un bâtiment de ce point est dans un secteur cartographié : zone inondable ou de mobilité d'un cours d'eau.";
        corps = "Un bâtiment est présent ici" +
          (bati.aire != null ? " (environ " + Math.round(parseFloat(bati.aire)).toLocaleString("fr-CA") + " m²)" : "") +
          ", et ce secteur fait l'objet d'une cartographie (zone inondable ou zone de mobilité d'un cours d'eau). " +
          "Cela ne veut pas dire que le bâtiment sera inondé, mais que des règles peuvent s'y appliquer.";
      } else {
        titre = "Ce point est dans un secteur cartographié : zone inondable ou de mobilité d'un cours d'eau.";
        corps = "Une cartographie existe pour ce secteur. Cela ne signifie pas que le terrain sera inondé, " +
          "mais que des règles particulières peuvent s'appliquer.";
      }
      quoiFaire = "Vérifiez le statut réel et la réglementation applicable auprès de votre municipalité avant tout projet (construction, rénovation, achat).";
    } else {
      cls = "carte-verdict--out";
      titre = "Ce point ne semble pas dans un secteur cartographié (zone inondable ou de mobilité d'un cours d'eau).";
      corps = "L'absence de cartographie ne garantit pas l'absence de risque : de nouvelles cartes sont publiées " +
        "progressivement dans le cadre réglementaire de 2026." +
        (zoomProche ? "" : " Zoomez davantage pour une lecture plus précise.");
      quoiFaire = "En cas de doute, ou pour un projet, confirmez toujours auprès de votre municipalité.";
    }

    verdictEl.className = "carte-verdict " + cls;
    verdictEl.innerHTML =
      '<button type="button" class="carte-verdict__close" aria-label="Fermer">&times;</button>' +
      '<strong>' + titre + "</strong>" +
      "<p>" + corps + "</p>" +
      '<p class="carte-verdict__do"><span>Que faire ?</span> ' + quoiFaire + "</p>" +
      '<p class="carte-verdict__src">Source : grille de présence des zones inondables, MRNF. ' +
      "Valeur indicative, aucune portée légale.</p>";
    verdictEl.hidden = false;
    var vClose = verdictEl.querySelector(".carte-verdict__close");
    if (vClose) { vClose.addEventListener("click", function () { verdictEl.hidden = true; }); }
    /* Injecter les boutons d'action (partager / imprimer) avant la source. */
    var vSrc = verdictEl.querySelector(".carte-verdict__src");
    if (vSrc) {
      var acts = document.createElement("div");
      acts.className = "carte-verdict__actions";
      acts.innerHTML =
        '<button type="button" class="carte-verdict__btn" data-verdict-share>Partager ce résultat</button>' +
        '<button type="button" class="carte-verdict__btn" data-verdict-print>Imprimer</button>';
      vSrc.parentNode.insertBefore(acts, vSrc);
      acts.querySelector("[data-verdict-share]").addEventListener("click", function (e) { partagerResultat(e.currentTarget); });
      acts.querySelector("[data-verdict-print]").addEventListener("click", function () { imprimerVerdict(titre, corps, quoiFaire); });
    }
  }

  /* D — Partage du résultat : copie le lien de la carte (avec la position). */
  function partagerResultat(btn) {
    var url = window.location.href;
    var done = function () { var t = btn.textContent; btn.textContent = "Lien copié !"; setTimeout(function () { btn.textContent = t; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      var ta = document.createElement("textarea"); ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done();
    }
  }

  /* G — Impression du verdict : ouvre une fenetre imprimable propre. */
  function imprimerVerdict(titre, corps, quoiFaire) {
    var adr = (lastLoc && lastLoc.label) ? lastLoc.label : "";
    var w = window.open("", "_blank", "width=680,height=800");
    if (!w) return;
    w.document.write(
      '<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><title>Rivieres Libres</title>' +
      '<style>body{font-family:Georgia,serif;max-width:600px;margin:40px auto;padding:0 20px;color:#0E3A52;line-height:1.5}' +
      'h1{font-size:1.1rem;color:#1E8AA0;letter-spacing:.1em;text-transform:uppercase}' +
      'h2{font-size:1.4rem}.do{background:#f0f5ea;padding:12px 16px;border-radius:8px}' +
      '.src{color:#667;font-style:italic;font-size:.85rem;margin-top:24px}</style></head><body>' +
      "<h1>Rivieres Libres</h1>" +
      (adr ? "<p><strong>Adresse :</strong> " + adr + "</p>" : "") +
      "<h2>" + titre + "</h2><p>" + corps + "</p>" +
      '<p class="do"><strong>Que faire ?</strong> ' + quoiFaire + "</p>" +
      '<p class="src">Source : grille de presence des zones inondables, MRNF. Valeur indicative, aucune portee legale. ' +
      "Carte realisee benevolement par Alto Geomatique.</p>" +
      "</body></html>"
    );
    w.document.close();
    setTimeout(function () { w.print(); }, 350);
  }

  var lastLoc = null; // dernière position localisée (pour le partage)
  function localiser(lng, lat, label) {
    lastLoc = { lng: lng, lat: lat, label: label || "" };
    map.flyTo({ center: [lng, lat], zoom: 15, duration: REDUCED ? 0 : 1400 });
    if (window._rlMarker) { window._rlMarker.remove(); }
    /* Marqueur avec un halo pulsant (élément DOM custom) — F. */
    var elMark = document.createElement("div");
    elMark.className = "carte-marker";
    elMark.innerHTML = '<span class="carte-marker__pulse"></span><span class="carte-marker__dot"></span>';
    window._rlMarker = new GL.Marker({ element: elMark, anchor: "center" }).setLngLat([lng, lat]).addTo(map);
    /* Met à jour l'URL avec la position (partageable) sans recharger — D. */
    try {
      var u = new URL(window.location.href);
      u.searchParams.set("lat", lat.toFixed(5));
      u.searchParams.set("lng", lng.toFixed(5));
      window.history.replaceState(null, "", u.toString());
    } catch (e) {}
    // Attendre la stabilisation de la carte avant d'interroger les couches rendues.
    map.once("idle", function () {
      if (hasGrille) { afficheVerdict(lng, lat); }
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

    /* Autocomplétion. Avec un token Mapbox : géocodeur Mapbox (autocomplete natif,
       excellent au Québec, suggère dès quelques lettres). Sinon : repli Nominatim. */
    function fetchSug(q) {
      var reqId = ++lastReq;
      var url, parse;

      if (USE_MAPBOX && MAPBOX_TOKEN) {
        // Proximité = centre de la carte (résultats proches de la vue d'abord).
        var c = map.getCenter();
        url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          encodeURIComponent(q) + ".json?access_token=" + MAPBOX_TOKEN +
          "&autocomplete=true&limit=6&language=fr&country=ca" +
          "&proximity=" + c.lng + "," + c.lat +
          "&bbox=-79.8,44.9,-57.0,62.6" + // Québec (biais fort)
          "&types=address,place,locality,neighborhood,poi";
        parse = function (data) {
          return (data.features || []).map(function (f) {
            return { display: f.place_name, lng: f.center[0], lat: f.center[1] };
          });
        };
      } else {
        url = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=6&countrycodes=ca&q=" +
          encodeURIComponent(q + ", Québec");
        parse = function (data) {
          return (data || []).map(function (r) {
            return { display: r.display_name, lng: parseFloat(r.lon), lat: parseFloat(r.lat) };
          });
        };
      }

      fetch(url, { headers: { "Accept-Language": "fr" } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (reqId !== lastReq) return; // réponse obsolète : une frappe plus récente a eu lieu
          renderSug(parse(data));
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
      if (q.length < 2) { closeSug(); return; }
      debounceT = setTimeout(function () { fetchSug(q); }, 200);
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
     OVERLAY KO-FI (don en superposition, pas de redirection)
     Les boutons café (data-kofi-open) ouvrent un modal contenant l'iframe
     Ko-fi. L'iframe n'est chargée qu'à la première ouverture (lazy).
     ====================================================================== */
  (function initKofi() {
    var overlay = document.getElementById("kofi-overlay");
    var holder = document.getElementById("kofi-iframe-holder");
    if (!overlay || !holder) return;
    var loaded = false;

    function openKofi() {
      if (!loaded) {
        var src = holder.getAttribute("data-kofi-src");
        var f = document.createElement("iframe");
        f.id = "kofiframe";
        f.src = src;
        f.title = "Soutenir sur Ko-fi";
        f.style.cssText = "border:none;width:100%;height:100%;background:#f9f9f9;border-radius:12px;";
        holder.appendChild(f);
        loaded = true;
      }
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function closeKofi() {
      overlay.hidden = true;
      document.body.style.overflow = "";
    }

    document.addEventListener("click", function (e) {
      var opener = e.target.closest ? e.target.closest("[data-kofi-open]") : null;
      if (opener) { e.preventDefault(); openKofi(); return; }
      var closer = e.target.closest ? e.target.closest("[data-kofi-close]") : null;
      if (closer) { e.preventDefault(); closeKofi(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) { closeKofi(); }
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
      setTimeout(function () { map.resize(); }, 120);
    });
  })();
})();
