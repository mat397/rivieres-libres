import { pageHead } from "./_shared.mjs";

export default {
  out: "comprendre/pourquoi-espace.html",
  meta: {
    title: "Pourquoi protéger l'espace de liberté | Rivières Libres",
    description: "Services écologiques, sécurité et économie : pourquoi laisser de l'espace aux rivières est rentable. Ratio avantages/coûts estimé de 1,5:1 à 4,8:1 (Biron et al., 2013).",
    canonical: "https://rivieres-libres.example/comprendre/pourquoi-espace.html",
    active: "/comprendre/",
  },
  body: `${pageHead(
    "Comprendre",
    "Pourquoi protéger l'espace de liberté",
    "Un choix écologique — et économiquement rentable.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" }, { label: "Pourquoi protéger l'espace" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Des services écologiques concrets</h2>
          <ul>
            <li><strong>Biodiversité</strong> — habitats riverains et aquatiques diversifiés.</li>
            <li><strong>Qualité de l'eau</strong> — filtration par les milieux humides et la végétation riveraine.</li>
            <li><strong>Recharge des nappes</strong> — l'eau ralentie s'infiltre au lieu de ruisseler.</li>
            <li><strong>Atténuation des crues</strong> — la plaine inondable stocke l'eau et réduit les pointes en aval.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <div class="callout callout--nature">
          <span class="callout__label">Sécurité &amp; économie</span>
          <p>Sur 50 ans, protéger l'espace de liberté s'avère rentable : les études québécoises estiment un ratio avantages/coûts de <strong>1,5:1 à 4,8:1</strong> selon les rivières — des gains nets évalués entre 0,7 et 3,7 M$ par cours d'eau étudié, malgré la compensation aux agriculteurs.</p>
          <p class="source">Source : Biron et al., 2013 (rivières de la Roche, Yamaska Sud-Est et Matane).</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="mt-0">« Dompter » ou faire confiance au génie vert</h2>
        <div class="table-wrap">
          <table class="comparison-table is-stacked">
            <caption class="visually-hidden">Comparaison entre l'approche de contrôle et l'approche de génie vert</caption>
            <thead>
              <tr><th scope="col">Approche</th><th scope="col">Dompter la rivière</th><th scope="col">Génie vert</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Moyens</th><td data-label="Dompter">Enrochement, murets, redressement</td><td data-label="Génie vert">Renaturalisation, milieux humides, recul</td></tr>
              <tr><th scope="row">Coût dans le temps</th><td data-label="Dompter">Réparations répétées après chaque crue</td><td data-label="Génie vert">Entretien réduit, bénéfices croissants</td></tr>
              <tr><th scope="row">Effets connexes</th><td data-label="Dompter">Reporte le problème en aval</td><td data-label="Génie vert">Services écologiques, biodiversité</td></tr>
            </tbody>
          </table>
        </div>
        <p><a href="/pour-vous/municipalites-obv.html">Voir les financements et études de cas →</a></p>
      </div>
    </section>`,
};
