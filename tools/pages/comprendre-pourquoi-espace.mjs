import { pageHero, maskLines, linkArrow, stat, indexRow } from "./_shared.mjs";

export default {
  out: "comprendre/pourquoi-espace.html",
  meta: {
    title: "Pourquoi protéger l'espace de liberté | Rivières Libres",
    description: "Sécurité, économie, biodiversité : pourquoi laisser de l'espace aux rivières est rentable. Ratio avantages/coûts estimé de 1,5:1 à 4,8:1 (Biron et al., 2013).",
    canonical: "https://rivieres-libres.example/comprendre/pourquoi-espace.html",
    active: "/comprendre/",
  },
  body: `${pageHero({
    kicker: "Comprendre",
    title: ["Pourquoi protéger", "<em>l'espace</em> de liberté"],
    lead: "Sécurité, économie, biodiversité : redonner de l'espace aux rivières est un choix écologique qui s'avère aussi rentable.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" },
      { label: "Pourquoi protéger l'espace" },
    ],
  })}

    <!-- ===== SERVICES ÉCOLOGIQUES ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Des services écologiques", "concrets"])}</h2>
            <p data-reveal>Quand la rivière conserve son espace de mobilité et son espace d'inondabilité, tout le bassin versant en profite.</p>
          </div>
          <div class="prose" data-reveal-group>
            <ul class="stack" style="margin:0">
              <li data-reveal><strong>Biodiversité :</strong> des habitats riverains et aquatiques diversifiés.</li>
              <li data-reveal><strong>Qualité de l'eau :</strong> une filtration assurée par les milieux humides et la végétation riveraine.</li>
              <li data-reveal><strong>Recharge des nappes :</strong> l'eau ralentie s'infiltre au lieu de ruisseler.</li>
              <li data-reveal><strong>Atténuation des crues :</strong> la plaine inondable stocke l'eau et réduit les pointes en aval.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SÉCURITÉ ET ÉCONOMIE (repères chiffrés) ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0" data-reveal>Sécurité et économie : ce que disent les études</h2>
        <p class="section__intro" data-reveal>Sur un horizon de 50 ans, les avantages dépassent les coûts, même une fois la compensation versée aux agriculteurs prise en compte. C'est la conclusion des études québécoises menées sur trois cours d'eau.</p>
        <div class="stat-band" data-reveal-group>
          ${stat({
            value: "1,5 à 4,8",
            unit: "pour 1",
            label: "Ratio avantages/coûts estimé, selon la rivière",
            note: "Source : Biron et al., 2013.",
          })}
          ${stat({
            value: "0,7 à 3,7",
            unit: "M$",
            label: "Gains nets estimés par cours d'eau étudié",
            note: "Malgré la compensation versée aux agriculteurs. Source : Biron et al., 2013.",
          })}
          ${stat({
            value: "50",
            unit: "ans",
            label: "Horizon d'évaluation des avantages et des coûts",
            note: "Source : Biron et al., 2013.",
          })}
          ${stat({
            value: "3",
            unit: "rivières",
            label: "Cours d'eau étudiés au Québec",
            note: "Rivières de la Roche, Yamaska Sud-Est et Matane. Source : Biron et al., 2013.",
          })}
        </div>
      </div>
    </section>

    <!-- ===== DEUX APPROCHES FACE À LA RIVIÈRE ===== -->
    <section class="section">
      <div class="container">
        <h2 class="mt-0">${maskLines(["« Dompter » ou faire confiance", "au génie vert"])}</h2>
        <p class="section__intro" data-reveal>Face à l'érosion et aux crues, deux logiques s'opposent : contenir la rivière avec des ouvrages, ou lui redonner l'espace dont elle a besoin.</p>
        <div class="table-wrap" data-reveal>
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
        <p data-reveal>${linkArrow("/pour-vous/municipalites-obv.html", "Financements et études de cas")}</p>
      </div>
    </section>

    <!-- ===== SUITE DU PARCOURS ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0" data-reveal>Poursuivre la lecture</h2>
        <ol class="index-list" data-reveal-group>
          ${indexRow({
            num: "02",
            href: "/comprendre/espace-de-liberte.html",
            title: "L'espace de liberté",
            desc: "Le concept scientifique né au Québec, expliqué simplement.",
          })}
        </ol>
      </div>
    </section>`,
};
