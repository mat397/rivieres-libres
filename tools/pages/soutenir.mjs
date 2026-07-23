import { pageHero, maskLines } from "./_shared.mjs";

const KOFI = "https://ko-fi.com/mathieusimardalto";

export default {
  out: "soutenir.html",
  meta: {
    title: "Soutenir le projet | Rivières Libres",
    description: "Rivières Libres est un projet bénévole qui rend les données publiques sur les zones inondables accessibles à tous. Un café aide à le garder gratuit et à jour.",
    canonical: "https://rivieres-libres.example/soutenir.html",
    active: null,
  },
  body: `${pageHero({
    kicker: "Soutenir",
    title: ["Un projet gratuit,", "porté <em>bénévolement</em>."],
    lead: "Rivières Libres est offert gratuitement, parce que savoir si votre propriété est en zone inondable ne devrait pas coûter un abonnement.",
    crumbs: [{ href: "/index.html", label: "Accueil" }, { label: "Soutenir" }],
  })}

    <!-- ===== POURQUOI ===== -->
    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">${maskLines(["Pourquoi un café ?"])}</h2>
          <p data-reveal>L'information officielle sur les zones inondables existe, mais elle est souvent éparpillée, technique et difficile à lire. Ce portail et sa carte interactive rassemblent ces données publiques et les rendent <strong>simples, visuelles et accessibles à tous</strong>.</p>
          <p data-reveal>Ce travail est réalisé <strong>bénévolement, sur mon temps libre</strong>, par Alto Géomatique. Il restera gratuit. Mais le maintenir à jour et créer de nouvelles cartes demande du temps &mdash; et un peu de café.</p>
        </div>
      </div>
    </section>

    <!-- ===== CE QUE ÇA PERMET ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">${maskLines(["Ce que votre appui permet"])}</h2>
        <div class="stack" data-reveal-group style="margin-top:var(--space-4)">
          <div class="card" data-reveal>
            <h3 class="mt-0">Garder les cartes à jour</h3>
            <p class="mt-0">Les données officielles évoluent, surtout avec le cadre réglementaire de 2026. Votre appui aide à suivre ces changements.</p>
          </div>
          <div class="card" data-reveal>
            <h3 class="mt-0">Créer de nouvelles cartes</h3>
            <p class="mt-0">D'autres outils sur des sujets qui touchent votre quotidien &mdash; environnement, territoire, données publiques.</p>
          </div>
          <div class="card" data-reveal>
            <h3 class="mt-0">Rester indépendant</h3>
            <p class="mt-0">Aucune publicité, aucun abonnement, aucune donnée revendue. Juste des outils utiles, gratuits.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA KO-FI ===== -->
    <section class="section">
      <div class="container">
        <div class="support-cta" data-reveal>
          <div class="support-cta__body">
            <h2 class="mt-0">Payez-moi un café&nbsp;!</h2>
            <p>Si ce projet vous est utile, un café fait une vraie différence. Merci d'y croire avec moi.</p>
            <a class="btn btn--coffee support-cta__btn" href="${KOFI}" rel="noopener" target="_blank">
              <span aria-hidden="true">&#9749;</span> Payez-moi un café sur Ko-fi
            </a>
          </div>
          <a class="support-cta__credit" href="https://altogeo.ca" rel="noopener" target="_blank" aria-label="Alto Géomatique">
            <img src="/assets/img/logo-alto-couleur.png" alt="Alto Géomatique" width="1280" height="714" loading="lazy">
            <span>Réalisée bénévolement par Alto Géomatique</span>
          </a>
        </div>
      </div>
    </section>`,
};
