import { pageHead } from "./_shared.mjs";

export default {
  out: "pour-vous/municipalites-obv.html",
  meta: {
    title: "Espace municipalités, MRC et OBV | Rivières Libres",
    description: "Mettre en œuvre le cadre réglementaire, gérer la cartographie déléguée, financer l'adaptation (PRAFI, bureaux de projets-Inondations) et s'inspirer d'études de cas québécoises.",
    canonical: "https://rivieres-libres.example/pour-vous/municipalites-obv.html",
    active: "/pour-vous/",
  },
  body: `${pageHead(
    "Pour vous",
    "Municipalités, MRC &amp; OBV",
    "Mettre en œuvre le cadre, gérer la cartographie et financer l'adaptation.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/pour-vous/citoyens.html", label: "Pour vous" }, { label: "Municipalités, MRC & OBV" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Le cadre réglementaire, côté opérationnel</h2>
          <p>Le cadre 2026 (ROPI, RMUN, RAMHHS) répartit les responsabilités entre le MELCCFP, les MRC et les municipalités. La cartographie de nouvelle génération, produite via INFO-Crue, peut être déléguée à la CMM (BIRC) ou à des MRC mandataires.</p>
          <p><a href="/cadre-reglementaire/cadre-2026.html">Voir le détail du cadre 2026 →</a></p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">Financements de l'adaptation</h2>
        <div class="grid grid--2">
          <div class="card">
            <h3 class="mt-0">PRAFI</h3>
            <p class="mt-0">Programme d'aide financière pour la gestion des risques liés aux inondations (MAMH).</p>
          </div>
          <div class="card">
            <h3 class="mt-0">Bureaux de projets-Inondations</h3>
            <p class="mt-0">Accompagnement des municipalités dans les projets de résilience (MAMH).</p>
          </div>
        </div>
        <p class="source" style="margin-top:var(--space-3)">Vérifier les modalités et l'admissibilité auprès du MAMH.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="mt-0">Études de cas québécoises</h2>
        <div class="grid grid--2" style="margin-top:var(--space-4)">
          <article class="card case-card">
            <img class="case-card__img" src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60" alt="Rivière renaturalisée bordée de végétation" loading="lazy">
            <div class="case-card__body">
              <span class="case-card__place">Coaticook · Estrie</span>
              <h3>Espace de liberté primé</h3>
              <p>Démarche reconnue par le prix Inspiration MMQ 2019.</p>
            </div>
          </article>
          <article class="card case-card">
            <img class="case-card__img" src="https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=800&q=60" alt="Cours d'eau dans un paysage agricole" loading="lazy">
            <div class="case-card__body">
              <span class="case-card__place">MRC d'Argenteuil · Laurentides</span>
              <h3>Quatre cours d'eau cartographiés</h3>
              <p>Rivières du Nord, Saint-André, de l'Ouest et ruisseau des Vases.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <div class="callout callout--info">
          <span class="callout__label">Gouvernance de l'eau</span>
          <p class="mt-0">Les 40 organismes de bassins versants (OBV), coordonnés par le ROBVQ, sont des interlocuteurs clés pour la gestion intégrée de l'eau par bassin versant et la délimitation de l'espace de liberté.</p>
        </div>
        <p><a href="/pour-vous/professionnels.html">Données &amp; méthodes pour l'aménagement →</a></p>
      </div>
    </section>`,
};
