/* ==========================================================================
   Rivières Libres — Carte interactive du portail (MapLibre GL JS)

   Remplace l'iframe MRNF par une carte que le portail contrôle : fond clair
   CARTO + couches officielles WMS (CC-BY, gouvernement du Québec) activables,
   recherche d'adresse, légende. Aucune clé, aucun token.

   Couches officielles (WMS 1.3.0, EPSG:3857, CC-BY) :
   - Zones inondables cartographiées (grille de présence) — MRNF
   - Milieux humides potentiels — MELCCFP
   - Municipalités / MRC (repérage) — MRNF (SDA)

   Chargé uniquement sur la page carte (le HTML inclut maplibre-gl depuis le CDN).
   ========================================================================== */
(function () {
  "use strict";

  if (typeof maplibregl === "undefined") return;
  var el = document.getElementById("carte");
  if (!el) return;

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    layers: [{ id: "carto", type: "raster", source: "carto" }]
  };

  /* --- Couches WMS officielles (CC-BY) ------------------------------------ */
  function wms(base, layers) {
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep +
      "service=WMS&version=1.3.0&request=GetMap&layers=" + layers +
      "&styles=&format=image/png&transparent=true&crs=EPSG:3857" +
      "&width=256&height=256&bbox={bbox-epsg-3857}";
  }

  var LAYERS = [
    {
      id: "zi",
      label: "Zones inondables cartographiées",
      tiles: wms("https://servicesvecto3.mern.gouv.qc.ca/geoserver/GrilleInfoZI_Pub/wms", "GrilleInfoZI"),
      opacity: 0.55,
      on: true,
      swatch: "#D64545"
    },
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

  map.on("load", function () {
    LAYERS.forEach(function (l) {
      map.addSource(l.id, { type: "raster", tiles: [l.tiles], tileSize: 256 });
      map.addLayer({
        id: l.id, type: "raster", source: l.id,
        paint: { "raster-opacity": l.opacity },
        layout: { visibility: l.on ? "visible" : "none" }
      });
    });
    buildControls();
  });

  /* --- Panneau : couches activables + légende ----------------------------- */
  function buildControls() {
    var box = document.getElementById("carte-couches");
    if (!box) return;
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
  }

  /* --- Recherche d'adresse (géocodage Nominatim, biaisé Québec) ----------- */
  var form = document.getElementById("carte-recherche");
  if (form) {
    var input = form.querySelector("input");
    var msg = document.getElementById("carte-recherche-msg");
    var marker = null;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (input.value || "").trim();
      if (!q) return;
      if (msg) { msg.textContent = "Recherche en cours…"; }

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
          var lng = parseFloat(r.lon), lat = parseFloat(r.lat);
          map.flyTo({ center: [lng, lat], zoom: 14, duration: REDUCED ? 0 : 1400 });
          if (marker) { marker.remove(); }
          marker = new maplibregl.Marker({ color: "#1E8AA0" })
            .setLngLat([lng, lat]).addTo(map);
          if (msg) { msg.textContent = ""; }
        })
        .catch(function () {
          if (msg) { msg.textContent = "La recherche a échoué. Réessayez plus tard."; }
        });
    });
  }
})();
