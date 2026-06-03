import { pageHead } from "./_shared.mjs";

export default {
  out: "pour-vous/professionnels.html",
  meta: {
    title: "Espace professionnels | Rivières Libres",
    description: "Guide méthodologique du MELCCFP, méthodes hydrogéomorphologiques, données géospatiales (Données Québec, GRHQ, LiDAR), littérature scientifique et normes des OPI.",
    canonical: "https://rivieres-libres.example/pour-vous/professionnels.html",
    active: "/pour-vous/",
  },
  body: `${pageHead(
    "Pour vous",
    "Professionnels",
    "Méthodes, données géospatiales et littérature scientifique.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/pour-vous/citoyens.html", label: "Pour vous" }, { label: "Professionnels" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Guide méthodologique &amp; méthodes</h2>
          <p>La référence est le guide méthodologique officiel du MELCCFP (volet technique et scientifique, volet cartographie réglementaire, annexes). La délimitation s'appuie sur l'analyse hydrogéomorphologique : photos aériennes historiques, LiDAR / modèles numériques de terrain, observations terrain, relations nappe-rivière et simulations en climat futur.</p>
          <p>Le cadre scientifique distingue trois niveaux d'inondabilité (N1 à N3) et deux niveaux de mobilité (M1, M2), synthétisés en deux zones de gestion : <strong>L1</strong> (espace minimal) et <strong>L2</strong> (espace fonctionnel).</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">Données géospatiales</h2>
        <ul class="prose">
          <li><a href="https://www.donneesquebec.ca/" rel="noopener" target="_blank">Données Québec</a> — Géobase du réseau hydrographique du Québec (GRHQ), grille de présence possible, données LiDAR / MNT.</li>
          <li><a href="https://www.quebec.ca/" rel="noopener" target="_blank">Géo-Inondations</a> et <a href="https://www.quebec.ca/" rel="noopener" target="_blank">Atlas de l'eau</a>.</li>
          <li><a href="https://www.atlas-hydroclimatique.ca/" rel="noopener" target="_blank">Atlas hydroclimatique</a> (CEHQ) — horizons 2050 / 2080.</li>
        </ul>
        <p class="source">Pointer vers les URL officielles exactes lors de la mise en ligne.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Littérature scientifique &amp; normes</h2>
          <ul>
            <li>Biron, Buffin-Bélanger, Larocque et al. (2013) — <em>Espace de liberté : un cadre de gestion intégrée…</em> (Concordia / Ouranos).</li>
            <li>Travaux d'Ouranos, du RIISQ, de l'INRS et des universités (Concordia, UQAM, UQAR, Sherbrooke).</li>
            <li>Normes applicables aux ouvrages de protection contre les inondations (OPI) sous le ROPI.</li>
          </ul>
          <p><a href="/a-propos.html">Voir toutes les sources &amp; partenaires →</a></p>
        </div>
      </div>
    </section>`,
};
