import { pageHero, maskLines, linkArrow, ICON_ARROW } from "./_shared.mjs";

/* Page « Carte & données » : PAS de carte intégrée. C'est une page de
   présentation qui explique l'outil et renvoie, par un grand CTA, vers la
   carte interactive plein écran (carte-donnees/carte-embed.html). */

export default {
  out: "carte-donnees/carte.html",
  meta: {
    title: "Carte interactive des zones inondables et de mobilité | Rivières Libres",
    description: "Vérifiez si une adresse est en zone inondable au Québec. Carte interactive plein écran : zones inondables, milieux humides, bâtiments, avec les données officielles (MRNF, MELCCFP, CC-BY).",
    canonical: "https://rivieres-libres.example/carte-donnees/carte.html",
    active: "/carte-donnees/",
  },
  body: `${pageHero({
    kicker: "Carte et données",
    title: ["Votre secteur est-il", "en <em>zone inondable</em> ?"],
    lead: "Une carte interactive pour vérifier une adresse et explorer les zones inondables, les milieux humides et les bâtiments, à partir des données officielles du gouvernement du Québec.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/carte-donnees/carte.html", label: "Carte &amp; données" },
      { label: "Carte" },
    ],
  })}

    <!-- ===== CTA VERS LA CARTE PLEIN ÉCRAN ===== -->
    <section class="section">
      <div class="container">
        <a class="map-launch" href="/carte-donnees/carte-embed.html" data-reveal aria-label="Ouvrir la carte interactive plein écran">
          <span class="map-launch__media" aria-hidden="true">
            <img src="/assets/img/apercu-carte.jpg" alt="" loading="lazy" width="1200" height="700">
            <span class="map-launch__scrim"></span>
            <span class="map-launch__pin"></span>
          </span>
          <span class="map-launch__body">
            <span class="map-launch__label">Carte interactive</span>
            <span class="map-launch__title">Ouvrir la carte plein écran</span>
            <span class="map-launch__desc">Recherchez une adresse, activez les couches, explorez en 3D. La carte s'ouvre en plein écran.</span>
            <span class="btn btn--primary map-launch__btn">Vérifier une adresse ${ICON_ARROW}</span>
          </span>
        </a>
        <p class="map-credit">
          Carte réalisée par <a href="https://altogeo.ca" rel="noopener" target="_blank">Alto Géomatique</a>, à partir des données ouvertes du gouvernement du Québec. Valeur indicative, aucune portée légale.
        </p>
      </div>
    </section>

    <!-- ===== CE QUE LA CARTE PERMET + LÉGENDE ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Ce que la carte", "vous permet"])}</h2>
            <ul class="prose" data-reveal>
              <li><strong>Vérifier une adresse</strong> et savoir si votre secteur est cartographié en zone inondable.</li>
              <li><strong>Voir votre bâtiment</strong> par-dessus les zones à risque (référentiel des bâtiments du Québec).</li>
              <li><strong>Activer des couches</strong> : milieux humides, municipalités et MRC.</li>
              <li><strong>Choisir le fond</strong> (rues, satellite, relief 3D) selon ce que vous cherchez.</li>
            </ul>
            <p data-reveal>${linkArrow("/carte-donnees/lire-les-cartes.html", "Apprendre à lire les cartes")}</p>
          </div>

          <div class="legend" aria-label="Légende des classes de risque" data-reveal>
            <h3 class="mt-0" style="font-size:1rem">Classes d'intensité (nouvelle génération)</h3>
            <ul class="legend__list">
              <li class="legend__item"><span class="legend__swatch legend__swatch--faible"></span><span><span class="legend__term">Faible</span></span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--moderee"></span><span><span class="legend__term">Modérée</span></span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--elevee"></span><span><span class="legend__term">Élevée</span></span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--tres-elevee"></span><span><span class="legend__term">Très élevée</span></span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--residuel"></span><span><span class="legend__term">Risque résiduel</span> (derrière un ouvrage)</span></li>
            </ul>
            <p class="source" style="margin-top:var(--space-3)">Source : MELCCFP. Seuils à valider sur le guide méthodologique officiel.</p>
          </div>
        </div>

        <div class="callout callout--warning" style="margin-top:var(--space-5)" data-reveal>
          <span class="callout__label">Avertissement</span>
          <p class="mt-0">La carte a une valeur indicative et n'a aucune portée légale. Pour connaître le statut réel d'un terrain, consultez votre municipalité et les outils officiels du gouvernement du Québec.</p>
        </div>
      </div>
    </section>

    <!-- ===== LIENS OFFICIELS ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Liens officiels"])}</h2>
            <p data-reveal>Les outils gouvernementaux de référence, pour consulter les données à la source.</p>
          </div>
          <div data-reveal-group>
            <p class="mt-0" data-reveal><a class="link-arrow" href="https://zonesinondables.mrnf.gouv.qc.ca/" rel="noopener" target="_blank">Carte gouvernementale des zones inondables et de mobilité des cours d'eau ${ICON_ARROW}</a></p>
            <p data-reveal><a class="link-arrow" href="https://www.quebec.ca/" rel="noopener" target="_blank">Géo-Inondations ${ICON_ARROW}</a></p>
            <p data-reveal><a class="link-arrow" href="https://www.quebec.ca/" rel="noopener" target="_blank">Atlas de l'eau ${ICON_ARROW}</a></p>
            <p class="source" data-reveal>Liens à pointer vers les URL officielles exactes lors de la mise en ligne.</p>
          </div>
        </div>
      </div>
    </section>`,
};
