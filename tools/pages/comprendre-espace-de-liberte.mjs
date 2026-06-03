import { pageHead } from "./_shared.mjs";

export default {
  out: "comprendre/espace-de-liberte.html",
  meta: {
    title: "L'espace de liberté des rivières | Rivières Libres",
    description: "Qu'est-ce que l'espace de liberté d'une rivière ? Un concept scientifique québécois (Biron, Buffin-Bélanger, Larocque, 2013) qui réunit espace de mobilité et espace d'inondabilité.",
    canonical: "https://rivieres-libres.example/comprendre/espace-de-liberte.html",
    active: "/comprendre/",
  },
  body: `${pageHead(
    "Comprendre",
    "L'espace de liberté des rivières",
    "Redonner à la rivière la place d'évoluer, plutôt que de la dompter.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" }, { label: "L'espace de liberté" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <p class="lead">Pendant longtemps, on a géré les rivières comme des canaux à dompter : enrochement, murets, redressement. L'approche de l'espace de liberté propose l'inverse — redonner à la rivière la place d'évoluer.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1">
          <figure class="concept-diagram">
            <svg viewBox="0 0 480 260" role="img" aria-labelledby="elt elc">
              <title id="elt">Les trois composantes de l'espace de liberté</title>
              <desc id="elc">L'espace de liberté combine l'espace de mobilité (déplacement latéral du lit), l'espace d'inondabilité (zone des crues) et les milieux humides riverains.</desc>
              <rect x="20" y="40" width="440" height="180" rx="10" fill="#EAF5F7" stroke="#4FB3C4" stroke-dasharray="6 5"/>
              <rect x="70" y="80" width="340" height="110" rx="8" fill="#FBF6EC" stroke="#DBB36A" stroke-dasharray="6 5"/>
              <path d="M40 135 C 130 95, 180 175, 250 135 S 380 95, 440 135" fill="none" stroke="#1E8AA0" stroke-width="14" stroke-linecap="round"/>
              <text x="240" y="32" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#0E3A52">Espace d'inondabilité</text>
              <text x="240" y="74" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#8a6d2f">Espace de mobilité</text>
              <text x="240" y="210" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#5C6B73">+ milieux humides riverains</text>
            </svg>
            <figcaption class="source">Schéma simplifié à des fins pédagogiques.</figcaption>
          </figure>
          <div>
            <h2 class="mt-0">Trois composantes</h2>
            <ul class="prose">
              <li><strong>Espace de mobilité</strong> — la zone dans laquelle le lit se déplace latéralement (méandres, érosion des berges).</li>
              <li><strong>Espace d'inondabilité</strong> — la zone occupée par les crues de différentes récurrences.</li>
              <li><strong>Milieux humides riverains</strong> — des éponges naturelles qui stockent l'eau et réduisent les pointes de crue.</li>
            </ul>
            <p><a href="/comprendre/mobilite-inondabilite.html">Approfondir mobilité &amp; inondabilité →</a></p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="mt-0">Espace de liberté vs zone de mobilité des cours d'eau</h2>
        <p class="prose">Deux notions cousines, mais distinctes — c'est l'une des clés pour comprendre le débat actuel.</p>
        <div class="table-wrap">
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

    <section class="section section--mist">
      <div class="container">
        <div class="callout callout--info">
          <span class="callout__label">Origines au Québec</span>
          <p>L'approche a été développée par <strong>Pascale Biron</strong> (Université Concordia), <strong>Thomas Buffin-Bélanger</strong> (UQAR) et <strong>Marie Larocque</strong> (UQAM), notamment dans le rapport Concordia/Ouranos de 2013 « Espace de liberté : un cadre de gestion intégrée pour la conservation des cours d'eau dans un contexte de changements climatiques ».</p>
          <p class="source">Source : Biron et al., 2013 (Université Concordia / Ouranos).</p>
        </div>

        <h2>L1 et L2 : deux niveaux de protection</h2>
        <div class="prose">
          <p><strong>L1 — l'espace minimal vital</strong> de la rivière, où aucun aménagement ne devrait avoir lieu.</p>
          <p><strong>L2 — l'espace fonctionnel plus large</strong>, à protéger pour que la dynamique naturelle opère, aujourd'hui et en climat futur.</p>
          <p><a href="/comprendre/pourquoi-espace.html">Pourquoi protéger cet espace ? →</a></p>
        </div>
      </div>
    </section>`,
};
