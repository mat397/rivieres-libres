import { pageHero, maskLines, linkArrow, ICON_ARROW } from "./_shared.mjs";

/* Rangée d'index vers une ressource externe : même anatomie que indexRow,
   avec rel="noopener" et target="_blank" pour les sites tiers. */
function externalRow({ num, href, title, desc }) {
  return `<li class="index-list__item" data-reveal>
            <a class="index-list__link" href="${href}" rel="noopener" target="_blank">
              <span class="index-list__num" aria-hidden="true">${num}</span>
              <span>
                <span class="index-list__title">${title}</span>
                <p class="index-list__desc">${desc}</p>
              </span>
              <span class="index-list__arrow" aria-hidden="true">${ICON_ARROW}</span>
            </a>
          </li>`;
}

export default {
  out: "pour-vous/professionnels.html",
  meta: {
    title: "Espace professionnels | Rivières Libres",
    description: "Méthodes hydrogéomorphologiques, guide du MELCCFP, données géospatiales (GRHQ, LiDAR, Données Québec), littérature scientifique et normes des OPI.",
    canonical: "https://rivieres-libres.example/pour-vous/professionnels.html",
    active: "/pour-vous/",
  },
  body: `${pageHero({
    kicker: "Pour vous",
    title: ["Professionnels de l'eau", "et du <em>territoire</em>."],
    lead: "Méthodes hydrogéomorphologiques, données géospatiales publiques et littérature scientifique : les références de travail derrière la cartographie 2026.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/pour-vous/citoyens.html", label: "Pour vous" },
      { label: "Professionnels" },
    ],
  })}

    <!-- ===== MÉTHODE : GUIDE OFFICIEL + NOTATION ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["La méthode derrière", "les cartes"])}</h2>
            <div class="prose" data-reveal-group>
              <p data-reveal>La référence est le guide méthodologique officiel du MELCCFP : un volet technique et scientifique, un volet cartographie réglementaire et leurs annexes.</p>
              <p data-reveal>La délimitation s'appuie sur l'analyse hydrogéomorphologique : photos aériennes historiques, LiDAR et modèles numériques de terrain, observations terrain, relations nappe-rivière et simulations en climat futur.</p>
            </div>
          </div>
          <div data-reveal>
            <div class="table-wrap">
              <table class="comparison-table is-stacked">
                <caption>La notation du cadre scientifique</caption>
                <thead>
                  <tr><th scope="col">Notation</th><th scope="col">Ce qu'elle désigne</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">N1 à N3</th><td data-label="Désigne">Trois niveaux d'inondabilité</td></tr>
                  <tr><th scope="row">M1 et M2</th><td data-label="Désigne">Deux niveaux de mobilité</td></tr>
                  <tr><th scope="row">L1</th><td data-label="Désigne">Zone de gestion : l'espace minimal</td></tr>
                  <tr><th scope="row">L2</th><td data-label="Désigne">Zone de gestion : l'espace fonctionnel</td></tr>
                </tbody>
              </table>
            </div>
            <p class="source">Les niveaux d'inondabilité et de mobilité sont synthétisés en deux zones de gestion, L1 et L2. D'après le guide méthodologique officiel du MELCCFP.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== DONNÉES GÉOSPATIALES (index de ressources) ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0" data-reveal>Données géospatiales</h2>
        <p class="section__intro" data-reveal>Les jeux de données publics pour vos propres analyses.</p>
        <ol class="index-list" data-reveal-group>
          ${externalRow({
            num: "01",
            href: "https://www.donneesquebec.ca/",
            title: "Données Québec",
            desc: "Géobase du réseau hydrographique du Québec (GRHQ), grille de présence possible, données LiDAR et modèles numériques de terrain.",
          })}
          ${externalRow({
            num: "02",
            href: "https://www.quebec.ca/",
            title: "Géo-Inondations et Atlas de l'eau",
            desc: "Les outils de consultation officiels du gouvernement du Québec.",
          })}
          ${externalRow({
            num: "03",
            href: "https://www.atlas-hydroclimatique.ca/",
            title: "Atlas hydroclimatique",
            desc: "CEHQ, horizons 2050 et 2080.",
          })}
        </ol>
        <p class="source" data-reveal>Pointer vers les URL officielles exactes lors de la mise en ligne.</p>
      </div>
    </section>

    <!-- ===== LITTÉRATURE SCIENTIFIQUE &amp; NORMES ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Littérature scientifique", "et normes"])}</h2>
            <div class="prose" data-reveal-group>
              <p data-reveal>Le concept d'espace de liberté s'appuie sur un corpus québécois actif : les travaux d'Ouranos, du RIISQ, de l'INRS et des universités Concordia, UQAM, UQAR et Sherbrooke.</p>
              <p data-reveal>Côté normatif, les ouvrages de protection contre les inondations (OPI) sont soumis aux normes applicables sous le ROPI.</p>
              <p data-reveal>${linkArrow("/a-propos.html", "Toutes les sources &amp; partenaires")}</p>
            </div>
          </div>
          <div class="callout callout--context" data-reveal>
            <span class="callout__label">Référence fondatrice</span>
            <p class="mt-0">Biron, Buffin-Bélanger, Larocque et coll. (2013), <em>Espace de liberté : un cadre de gestion intégrée…</em> L'étude qui a posé le concept au Québec.</p>
            <p class="source">Université Concordia / Ouranos, 2013.</p>
          </div>
        </div>
      </div>
    </section>`,
};
