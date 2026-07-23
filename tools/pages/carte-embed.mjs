import { ICON_ARROW } from "./_shared.mjs";

/* Version « nue » de la carte, conçue pour l'intégration en iframe sur un site
   tiers (Alto, municipalité, OBV). Même moteur que la carte du portail
   (assets/js/carte.js), mais plein écran, sans header/footer du portail.
   Le crédit Alto + l'attribution restent présents (obligatoires). */

export default {
  out: "carte-donnees/carte-embed.html",
  meta: {
    bare: true,
    title: "Carte des zones inondables | Rivières Libres",
    description: "Carte interactive des zones inondables, milieux humides et bâtiments au Québec. Vérifiez une adresse.",
    canonical: "https://rivieres-libres.example/carte-donnees/carte-embed.html",
    active: null,
    headExtra: `  <link href="/assets/vendor/mapbox-gl.css" rel="stylesheet">
  <script>
    window.RL_CONFIG = {
      mapboxToken: "${globalThis.MAPBOX_TOKEN || ""}",
      batimentsPmtiles: "https://pub-5f67940718c04ef687da8ea84e84a4c8.r2.dev/batiments-quebec-sud.pmtiles",
      grillePmtiles: "https://pub-5f67940718c04ef687da8ea84e84a4c8.r2.dev/grille-zi.pmtiles",
      fondPmtiles: "https://pub-5f67940718c04ef687da8ea84e84a4c8.r2.dev/fond-quebec.pmtiles"
    };
  </script>
  <script src="/assets/vendor/mapbox-gl.js" defer></script>
  <script src="/assets/vendor/pmtiles.js" defer></script>
  <script src="/assets/js/carte.js" defer></script>`,
  },
  body: `    <div class="embed-map">
      <div id="carte" class="embed-map__canvas" role="application" aria-label="Carte interactive des zones inondables, milieux humides et bâtiments du Québec"></div>

      <!-- Pop-up de bienvenue (fondu + léger zoom, affiché une fois). -->
      <div id="carte-welcome" class="carte-welcome" role="dialog" aria-modal="true" aria-labelledby="cw-title" hidden>
        <div class="carte-welcome__backdrop" data-cw-close></div>
        <div class="carte-welcome__card" role="document">
          <span class="carte-welcome__kicker">Rivières Libres</span>
          <h2 id="cw-title" class="carte-welcome__title">Votre secteur est-il en zone inondable&nbsp;?</h2>
          <p>Recherchez une adresse, activez les couches et explorez les zones inondables, les milieux humides et les bâtiments du Québec.</p>
          <ul class="carte-welcome__steps">
            <li>Tapez une adresse ou utilisez votre position.</li>
            <li>Activez les couches et changez de fond (rues, satellite, 3D).</li>
            <li>Cliquez un bâtiment pour voir sa superficie.</li>
          </ul>
          <p class="carte-welcome__legal">Information à valeur indicative, sans portée légale. Pour le statut réel d'un terrain, consultez votre municipalité.</p>
          <button type="button" class="btn btn--primary carte-welcome__cta" data-cw-close>Explorer la carte</button>
        </div>
      </div>
      <button id="carte-help" class="carte-help" type="button" aria-label="Revoir le message de bienvenue" hidden>i</button>

      <a class="embed-map__back" href="/index.html" aria-label="Retour au site Rivières Libres">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Retour au site
      </a>
      <script>
        /* Le bouton retour est visible par défaut (plein écran). On le masque
           UNIQUEMENT si la page est intégrée en iframe sur un site tiers,
           pour ne pas polluer l'intégration. */
        (function () {
          try { if (window.self !== window.top) {
            var b = document.querySelector(".embed-map__back"); if (b) b.hidden = true;
          } } catch (e) {}
        })();
      </script>

      <div class="embed-map__panel">
        <form id="carte-recherche" class="map-search" role="search" aria-label="Rechercher une adresse">
          <label class="visually-hidden" for="carte-recherche-input">Adresse ou municipalité</label>
          <input id="carte-recherche-input" type="search" placeholder="Adresse, municipalité…" autocomplete="off">
          <button class="btn btn--primary" type="submit" aria-label="Chercher">${ICON_ARROW}</button>
        </form>
        <button id="carte-geoloc" class="btn btn--secondary" type="button" style="margin-top:.4rem;width:100%">Utiliser ma position</button>
        <p id="carte-recherche-msg" class="source" role="status" aria-live="polite" style="min-height:1em;margin:.3rem 0 0"></p>
        <div id="carte-verdict" class="carte-verdict" role="status" aria-live="polite" hidden></div>
        <div id="carte-fonds" class="carte-fonds" role="group" aria-label="Fond de carte"></div>
        <div id="carte-couches" class="carte-couches" style="margin-top:.6rem"></div>
      </div>

      <a class="embed-map__badge" href="https://altogeo.ca" rel="noopener" target="_blank" aria-label="Une initiative d'Alto Géomatique">
        <img src="/assets/img/logo-alto-couleur.png" alt="Alto Géomatique" width="1280" height="714" loading="lazy">
      </a>

      <p class="embed-map__legal">
        Valeur indicative, aucune portée légale. Données : MRNF, MELCCFP (CC-BY 4.0).
        <a href="https://rivieres-libres.example/carte-donnees/carte.html" rel="noopener" target="_blank">Voir le portail</a>
      </p>

      <div id="carte-etapes" hidden></div>
    </div>`,
};
