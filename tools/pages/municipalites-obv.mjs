import { pageHero, maskLines, linkArrow, stat } from "./_shared.mjs";

export default {
  out: "pour-vous/municipalites-obv.html",
  meta: {
    title: "Espace municipalités, MRC et OBV | Rivières Libres",
    description: "Mettre en œuvre le cadre 2026, gérer la cartographie déléguée, financer l'adaptation (PRAFI) et s'inspirer d'études de cas québécoises.",
    canonical: "https://rivieres-libres.example/pour-vous/municipalites-obv.html",
    active: "/pour-vous/",
  },
  body: `${pageHero({
    kicker: "Pour vous",
    title: ["Municipalités,", "MRC &amp; <em>OBV</em>"],
    lead: "Mettre en œuvre le cadre 2026, gérer la cartographie déléguée et financer l'adaptation : le point d'entrée des acteurs municipaux et des organismes de bassins versants.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/pour-vous/citoyens.html", label: "Pour vous" },
      { label: "Municipalités, MRC &amp; OBV" },
    ],
  })}

    <!-- ===== LE CADRE, CÔTÉ OPÉRATIONNEL ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Le cadre 2026,", "côté opérationnel"])}</h2>
            <div data-reveal-group>
              <p data-reveal>Le cadre 2026 repose sur trois règlements : le <strong>ROPI</strong>, le <strong>RMUN</strong> et le <strong>RAMHHS</strong>. Il répartit les responsabilités entre le MELCCFP, les MRC et les municipalités.</p>
              <p data-reveal>${linkArrow("/cadre-reglementaire/cadre-2026.html", "Comprendre le cadre 2026")}</p>
            </div>
          </div>
          <div class="callout callout--context" data-reveal>
            <span class="callout__label">Cartographie déléguée</span>
            <p class="mt-0">La cartographie de nouvelle génération, produite via INFO-Crue, peut être déléguée à la CMM (BIRC) ou à des MRC mandataires.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FINANCER L'ADAPTATION ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0" data-reveal>Financer l'adaptation</h2>
        <p class="section__intro" data-reveal>Deux leviers du MAMH soutiennent les municipalités, de la gestion des risques aux projets de résilience.</p>
        <div class="grid grid--2" data-reveal-group>
          <div class="card" data-reveal>
            <h3 class="mt-0">PRAFI</h3>
            <p class="mt-0">Programme d'aide financière pour la gestion des risques liés aux inondations (MAMH).</p>
          </div>
          <div class="card" data-reveal>
            <h3 class="mt-0">Bureaux de projets-Inondations</h3>
            <p class="mt-0">Accompagnement des municipalités dans les projets de résilience (MAMH).</p>
          </div>
        </div>
        <p class="source" style="margin-top:var(--space-3)" data-reveal>Modalités et admissibilité : à vérifier auprès du MAMH.</p>
      </div>
    </section>

    <!-- ===== ÉTUDES DE CAS ===== -->
    <section class="section">
      <div class="container">
        <h2 class="mt-0">${maskLines(["Études de cas", "québécoises"])}</h2>
        <p class="section__intro" data-reveal>Des territoires ont déjà redonné de l'espace à leurs rivières. Deux démarches parmi les plus citées.</p>
        <div class="grid grid--2" data-reveal-group>
          <article class="card case-card" data-reveal>
            <img class="case-card__img" src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60" alt="Rivière renaturalisée bordée de végétation" loading="lazy">
            <div class="case-card__body">
              <span class="case-card__place">Coaticook · Estrie</span>
              <h3>Espace de liberté primé</h3>
              <p>Démarche reconnue par le prix Inspiration MMQ 2019.</p>
            </div>
          </article>
          <article class="card case-card" data-reveal>
            <img class="case-card__img" src="https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=800&q=60" alt="Cours d'eau dans un paysage agricole" loading="lazy">
            <div class="case-card__body">
              <span class="case-card__place">MRC d'Argenteuil · Laurentides</span>
              <h3>Quatre cours d'eau cartographiés</h3>
              <p>Rivières du Nord, Saint-André, de l'Ouest et ruisseau des Vases.</p>
            </div>
          </article>
        </div>
        <div class="callout callout--nature" style="margin-top:var(--space-5)" data-reveal>
          <span class="callout__label">Rivières pilotes</span>
          <p class="mt-0">L'approche a d'abord été appliquée aux rivières de la Roche et Yamaska Sud-Est (Montérégie) et à la rivière Matane (Gaspésie). L'analyse avantages-coûts y estime des gains nets de 0,7 à 3,7 millions de dollars sur 50 ans.</p>
          <p class="source">Source : Biron et coll. (2013), analyse avantages-coûts.</p>
        </div>
      </div>
    </section>

    <!-- ===== GOUVERNANCE DE L'EAU ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0" data-reveal>La gouvernance de l'eau</h2>
            <div data-reveal-group>
              <p data-reveal>Les organismes de bassins versants (OBV), coordonnés par le ROBVQ, sont des interlocuteurs clés pour la gestion intégrée de l'eau par bassin versant et la délimitation de l'espace de liberté.</p>
              <p data-reveal>${linkArrow("/pour-vous/professionnels.html", "Données &amp; méthodes pour l'aménagement")}</p>
            </div>
          </div>
          ${stat({
            value: "40",
            label: "Organismes de bassins versants reconnus au Québec",
            note: "Réseau coordonné par le ROBVQ. Source : ROBVQ.",
          })}
        </div>
      </div>
    </section>`,
};
