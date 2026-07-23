import { pageHero, maskLines, linkArrow, ICON_ARROW } from "./_shared.mjs";

export default {
  out: "carte-donnees/carte.html",
  meta: {
    title: "Carte interactive des zones inondables et de mobilité | Rivières Libres",
    description: "Carte interactive des zones inondables, milieux humides et municipalités au Québec. Vérifiez une adresse et explorez les couches officielles (données MRNF et MELCCFP, CC-BY).",
    canonical: "https://rivieres-libres.example/carte-donnees/carte.html",
    active: "/carte-donnees/",
    headExtra: `  <link href="/assets/vendor/mapbox-gl.css" rel="stylesheet">
  <script>
    /* Config runtime de la carte. Le token pk. Mapbox est PUBLIC (visible dans
       le navigateur, c'est le fonctionnement normal de Mapbox) ; il doit être
       restreint par domaine sur account.mapbox.com. Données : R2 (CC-BY). */
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
  body: `${pageHero({
    kicker: "Carte et données",
    title: ["La carte officielle,", "<em>intégrée</em> au portail"],
    lead: "Vérifiez une adresse et explorez les <strong>couches officielles</strong> : zones inondables, milieux humides et municipalités. Les données proviennent du gouvernement du Québec (MRNF, MELCCFP).",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/carte-donnees/carte.html", label: "Carte &amp; données" },
      { label: "Carte" },
    ],
  })}

    <!-- ===== LA CARTE (MapLibre + couches officielles CC-BY) ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2-1" data-reveal-group>
          <div class="map-embed" data-reveal>
            <div class="map-embed__stage">
              <div id="carte" class="map-embed__frame" role="application" aria-label="Carte interactive des zones inondables, milieux humides et municipalités du Québec"></div>
              <a class="map-embed__badge-alto" href="https://altogeo.ca" rel="noopener" target="_blank" aria-label="Une initiative d'Alto Géomatique (nouvel onglet)">
                <img src="/assets/img/logo-alto-couleur.png" alt="Alto Géomatique" width="1280" height="714" loading="lazy">
              </a>
            </div>
            <p class="map-initiative">
              Carte réalisée par <a href="https://altogeo.ca" rel="noopener" target="_blank">Alto Géomatique</a> à partir des données ouvertes du gouvernement du Québec. La carte officielle reste consultable sur <a href="https://zonesinondables.mrnf.gouv.qc.ca/" rel="noopener" target="_blank">zonesinondables.mrnf.gouv.qc.ca</a>.
            </p>
          </div>

          <div class="stack">
            <div class="map-layers" data-reveal>
              <h3 class="mt-0" style="font-size:1rem">Rechercher une adresse</h3>
              <form id="carte-recherche" class="map-search" role="search" aria-label="Rechercher une adresse sur la carte">
                <label class="visually-hidden" for="carte-recherche-input">Adresse ou municipalité</label>
                <input id="carte-recherche-input" type="search" placeholder="Adresse, municipalité…" autocomplete="off">
                <button class="btn btn--primary" type="submit">Chercher ${ICON_ARROW}</button>
              </form>
              <button id="carte-geoloc" class="btn btn--secondary" type="button" style="margin-top:var(--space-2)">Utiliser ma position</button>
              <p id="carte-recherche-msg" class="source" role="status" aria-live="polite" style="min-height:1.2em"></p>

              <div id="carte-verdict" class="carte-verdict" role="status" aria-live="polite" hidden></div>

              <div id="carte-etapes" class="carte-etapes">
                <h3 style="font-size:1rem;margin-top:var(--space-4)">Que faire ensuite ?</h3>
                <ol class="carte-etapes__list">
                  <li>Vérifiez votre adresse sur la carte ci-contre.</li>
                  <li>Confirmez le statut réel auprès de <strong>votre municipalité</strong> : elle seule connaît la réglementation applicable à votre terrain.</li>
                  <li><a href="/pour-vous/citoyens.html">Découvrez comment adapter votre propriété</a> au besoin.</li>
                </ol>
              </div>

              <h3 style="font-size:1rem;margin-top:var(--space-4)">Fond de carte</h3>
              <div id="carte-fonds" class="carte-fonds" role="group" aria-label="Fond de carte"></div>
              <h3 style="font-size:1rem;margin-top:var(--space-4)">Couches à afficher</h3>
              <div id="carte-couches" class="carte-couches"></div>
              <p class="source" style="margin-top:var(--space-3)">Données : MRNF, MELCCFP (données ouvertes, CC-BY 4.0).</p>
            </div>

            <div class="legend" aria-label="Légende des classes de risque" data-reveal>
              <h3 class="mt-0" style="font-size:1rem">Classes d'intensité</h3>
              <ul class="legend__list">
                <li class="legend__item"><span class="legend__swatch legend__swatch--faible"></span><span><span class="legend__term">Faible</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--moderee"></span><span><span class="legend__term">Modérée</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--elevee"></span><span><span class="legend__term">Élevée</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--tres-elevee"></span><span><span class="legend__term">Très élevée</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--residuel"></span><span><span class="legend__term">Risque résiduel</span> (derrière un ouvrage)</span></li>
              </ul>
              <p style="margin:var(--space-3) 0 0">${linkArrow("/carte-donnees/lire-les-cartes.html", "Comment lire les cartes ?")}</p>
            </div>
          </div>
        </div>

        <div class="callout callout--warning" style="margin-top:var(--space-5)" data-reveal>
          <span class="callout__label">Avertissement</span>
          <p class="mt-0">Cette carte a une valeur indicative et n'a aucune portée légale. Pour connaître le statut réel d'un terrain, consultez votre municipalité et les outils officiels du gouvernement du Québec.</p>
        </div>
      </div>
    </section>

    <!-- ===== LIENS OFFICIELS ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Liens officiels"])}</h2>
            <p data-reveal>Les outils gouvernementaux de référence, pour consulter les données à la source.</p>
          </div>
          <div data-reveal-group>
            <p class="mt-0" data-reveal><a class="link-arrow" href="https://www.quebec.ca/" rel="noopener" target="_blank">Carte gouvernementale des zones inondables et de mobilité des cours d'eau ${ICON_ARROW}</a></p>
            <p data-reveal><a class="link-arrow" href="https://www.quebec.ca/" rel="noopener" target="_blank">Géo-Inondations ${ICON_ARROW}</a></p>
            <p data-reveal><a class="link-arrow" href="https://www.quebec.ca/" rel="noopener" target="_blank">Atlas de l'eau ${ICON_ARROW}</a></p>
            <p class="source" data-reveal>Liens à pointer vers les URL officielles exactes lors de la mise en ligne.</p>
          </div>
        </div>
      </div>
    </section>`,
};
