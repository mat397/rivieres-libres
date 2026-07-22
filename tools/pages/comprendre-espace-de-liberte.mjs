import { pageHero, maskLines, indexRow } from "./_shared.mjs";

export default {
  out: "comprendre/espace-de-liberte.html",
  meta: {
    title: "L'espace de liberté des rivières | Rivières Libres",
    description: "L'espace de liberté des rivières expliqué : un concept scientifique québécois (Biron, Buffin-Bélanger, Larocque, 2013) réunissant mobilité et inondabilité.",
    canonical: "https://rivieres-libres.example/comprendre/espace-de-liberte.html",
    active: "/comprendre/",
  },
  body: `${pageHero({
    kicker: "Comprendre",
    title: ["L'espace de <em>liberté</em>", "des rivières"],
    lead: "Redonner à la rivière la place d'évoluer, plutôt que de la dompter.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" },
      { label: "L'espace de liberté" },
    ],
  })}

    <!-- ===== LE CONCEPT : TROIS COMPOSANTES ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Trois composantes,", "un seul espace"])}</h2>
            <div data-reveal-group>
              <p data-reveal>Pendant longtemps, on a géré les rivières comme des canaux à dompter : enrochement, murets, redressement. L'approche de l'espace de liberté renverse cette logique : travailler avec la dynamique de la rivière plutôt que contre elle.</p>
              <ul class="prose" data-reveal>
                <li><strong>Espace de mobilité</strong> : la zone dans laquelle le lit se déplace latéralement (méandres, érosion des berges).</li>
                <li><strong>Espace d'inondabilité</strong> : la zone occupée par les crues de différentes récurrences.</li>
                <li><strong>Milieux humides riverains</strong> : des éponges naturelles qui stockent l'eau et réduisent les pointes de crue.</li>
              </ul>
            </div>
          </div>
          <figure class="concept-diagram draw" data-reveal>
            <svg viewBox="0 0 480 260" role="img" aria-labelledby="elt elc">
              <title id="elt">Les trois composantes de l'espace de liberté</title>
              <desc id="elc">L'espace de liberté combine l'espace de mobilité (déplacement latéral du lit), l'espace d'inondabilité (zone des crues) et les milieux humides riverains.</desc>
              <rect x="20" y="40" width="440" height="180" rx="14" fill="#EAF5F7" stroke="#4FB3C4" stroke-dasharray="6 5"/>
              <rect x="70" y="80" width="340" height="110" rx="10" fill="#FBF6EC" stroke="#DBB36A" stroke-dasharray="6 5"/>
              <path pathLength="1" d="M40 135 C 130 95, 180 175, 250 135 S 380 95, 440 135" fill="none" stroke="#1E8AA0" stroke-width="14" stroke-linecap="round"/>
              <text x="240" y="32" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#0E3A52">Espace d'inondabilité</text>
              <text x="240" y="74" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#8a6d2f">Espace de mobilité</text>
              <text x="240" y="210" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#5C6B73">+ milieux humides riverains</text>
            </svg>
            <figcaption class="source">Schéma simplifié à des fins pédagogiques. Concept : Biron et coll. (2013).</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ===== ORIGINES ET NIVEAUX L1 / L2 ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="callout callout--info" data-reveal>
          <span class="callout__label">Origines au Québec</span>
          <p>L'approche a été développée par <strong>Pascale Biron</strong> (Université Concordia), <strong>Thomas Buffin-Bélanger</strong> (UQAR) et <strong>Marie Larocque</strong> (UQAM), notamment dans le rapport Concordia/Ouranos de 2013 « Espace de liberté : un cadre de gestion intégrée pour la conservation des cours d'eau dans un contexte de changements climatiques ».</p>
          <p class="source">Source : Biron et al., 2013 (Université Concordia / Ouranos).</p>
        </div>

        <h2 data-reveal>L1 et L2 : deux niveaux de protection</h2>
        <div class="grid grid--2" data-reveal-group>
          <div class="card data-card" data-reveal>
            <h3 class="mt-0">Niveau L1</h3>
            <p>L'espace minimal vital de la rivière, où aucun aménagement ne devrait avoir lieu.</p>
          </div>
          <div class="card data-card" data-reveal>
            <h3 class="mt-0">Niveau L2</h3>
            <p>L'espace fonctionnel plus large, à protéger pour que la dynamique naturelle opère, aujourd'hui et en climat futur.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONCEPT SCIENTIFIQUE VS NOTION RÉGLEMENTAIRE ===== -->
    <section class="section">
      <div class="container">
        <h2>${maskLines(["Espace de liberté ou", "zone de mobilité ?"])}</h2>
        <p class="section__intro" data-reveal>Deux notions cousines, mais distinctes : l'une est volontaire, l'autre vous est opposable.</p>
        <div class="table-wrap" data-reveal>
          <table class="comparison-table is-stacked">
            <caption class="visually-hidden">Comparaison entre l'espace de liberté et la zone de mobilité des cours d'eau</caption>
            <thead>
              <tr><th scope="col"></th><th scope="col">Espace de liberté</th><th scope="col">Zone de mobilité des cours d'eau</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Nature</th><td data-label="Espace de liberté">Concept scientifique / de gestion</td><td data-label="Zone de mobilité">Notion réglementaire</td></tr>
              <tr><th scope="row">Portée</th><td data-label="Espace de liberté">Volontaire, gestion intégrée</td><td data-label="Zone de mobilité">Opposable, encadrée par règlement</td></tr>
              <tr><th scope="row">Délimitation</th><td data-label="Espace de liberté">Hydrogéomorphologique (chercheurs, OBV)</td><td data-label="Zone de mobilité">Cartographie gouvernementale officielle</td></tr>
              <tr><th scope="row">Échelle</th><td data-label="Espace de liberté">Tronçon / bassin versant</td><td data-label="Zone de mobilité">Parcelle / territoire municipal</td></tr>
              <tr><th scope="row">Depuis</th><td data-label="Espace de liberté">Travaux de 2013 (Concordia/Ouranos)</td><td data-label="Zone de mobilité">Cadre en vigueur le 1ᵉʳ mars 2026</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ===== POURSUIVRE LE PARCOURS ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 data-reveal>Poursuivre le parcours</h2>
        <p class="section__intro" data-reveal>Deux lectures pour compléter ce dossier.</p>
        <ol class="index-list" data-reveal-group>
          ${indexRow({ num: "01", href: "/comprendre/pourquoi-espace.html", title: "Pourquoi protéger l'espace des rivières", desc: "Sécurité, économie, biodiversité : les bénéfices de laisser la rivière respirer." })}
          ${indexRow({ num: "03", href: "/comprendre/mobilite-inondabilite.html", title: "Mobilité et inondabilité", desc: "Approfondir la distinction entre concept scientifique et notion réglementaire." })}
        </ol>
      </div>
    </section>`,
};
