import { pageHero, maskLines } from "./_shared.mjs";

export default {
  out: "a-propos.html",
  meta: {
    title: "À propos &amp; sources | Rivières Libres",
    description: "Mission du portail Rivières Libres, sources et partenaires (MELCCFP, Ouranos, RIISQ, ROBVQ, universités), contact et infolettre.",
    canonical: "https://rivieres-libres.example/a-propos.html",
    active: null,
  },
  body: `${pageHero({
    kicker: "À propos",
    title: ["Le pont entre la science", "et la <em>réglementation</em>."],
    lead: "Un portail indépendant : notre mission, nos sources et comment nous joindre.",
    crumbs: [{ href: "/index.html", label: "Accueil" }, { label: "À propos" }],
  })}

    <!-- ===== MISSION ===== -->
    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">${maskLines(["Notre mission"])}</h2>
          <p data-reveal>Rivières Libres relie en un seul endroit la vulgarisation du concept scientifique d'<strong>espace de liberté</strong>, le nouveau cadre réglementaire des <strong>zones de mobilité des cours d'eau</strong> et des ressources pratiques pour les citoyens, les municipalités et les professionnels.</p>
          <p data-reveal>Notre fil conducteur : faire le pont entre la science et la réglementation, de façon crédible et non alarmiste.</p>
        </div>
      </div>
    </section>

    <!-- ===== SOURCES &amp; PARTENAIRES ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Sources &amp;", "partenaires"])}</h2>
            <div data-reveal-group>
              <p data-reveal>Le contenu de ce portail s'appuie sur des sources publiques et scientifiques : ministères, organismes de recherche, universités et acteurs de la gouvernance de l'eau.</p>
              <p class="source" data-reveal>Les organisations citées ne sont pas nécessairement affiliées au portail.</p>
            </div>
          </div>
          <div class="stack" data-reveal-group>
            <div class="card" data-reveal>
              <h3 class="mt-0">Gouvernement</h3>
              <p class="mt-0">MELCCFP, MAMH, MRNF, MSP (sécurité civile).</p>
            </div>
            <div class="card" data-reveal>
              <h3 class="mt-0">Science &amp; climat</h3>
              <p class="mt-0">Ouranos, RIISQ, INRS ; Concordia, UQAM, UQAR, Sherbrooke.</p>
            </div>
            <div class="card" data-reveal>
              <h3 class="mt-0">Gouvernance de l'eau</h3>
              <p class="mt-0">ROBVQ et les 40 OBV, CMM / BIRC, CMQ, MRC.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTACT &amp; INFOLETTRE ===== -->
    <section class="section">
      <div class="container" id="contact">
        <div class="grid grid--1-1 grid--gap-lg" data-reveal-group>
          <div data-reveal>
            <h2 class="mt-0">Contact</h2>
            <p>Une question, une correction de source, une suggestion de ressource ? Écrivez-nous.</p>
            <p><a href="mailto:info@rivieres-libres.example">info@rivieres-libres.example</a></p>
          </div>
          <div class="newsletter" data-reveal>
            <h2 class="mt-0">Infolettre</h2>
            <p>L'infolettre sera lancée avec les premières cartes de nouvelle génération. Écrivez-nous pour être prévenu du lancement.</p>
            <p><a class="btn btn--secondary" href="mailto:info@rivieres-libres.example?subject=Infolettre">M'ajouter à la liste</a></p>
          </div>
        </div>

        <div class="callout callout--warning" style="margin-top:var(--space-6)" data-reveal>
          <span class="callout__label">Avertissement</span>
          <p class="mt-0">Les informations de ce portail ont une valeur indicative et n'ont aucune portée légale. Elles ne remplacent pas les cartes officielles, les règlements ni l'avis des autorités compétentes.</p>
        </div>
      </div>
    </section>`,
};
