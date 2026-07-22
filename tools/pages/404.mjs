import { maskLines, ICON_ARROW } from "./_shared.mjs";

export default {
  out: "404.html",
  meta: {
    title: "Page introuvable | Rivières Libres",
    description: "La page demandée est introuvable.",
    canonical: "https://rivieres-libres.example/404.html",
    active: null,
  },
  body: `    <div class="page-hero" data-navtheme="dark">
      <div class="page-hero__inner" style="text-align:center">
        <span class="tag">Erreur 404</span>
        <h1 style="margin-inline:auto;margin-top:var(--space-4)">${maskLines(["Cette page a", "<em>dérivé</em>."])}</h1>
        <p class="lead" style="margin-inline:auto" data-reveal>La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <p class="btn-row" style="justify-content:center;margin-top:var(--space-5)" data-reveal>
          <a class="btn btn--primary" href="/index.html">Retour à l'accueil ${ICON_ARROW}</a>
        </p>
      </div>
    </div>
    <section class="section">
      <div class="container soon" style="padding-block:var(--space-6)" data-reveal>
        <p class="mt-0"><strong>Vous cherchiez peut-être :</strong></p>
        <ul style="display:inline-block;text-align:left;margin:0;padding-left:1.2em">
          <li><a href="/comprendre/espace-de-liberte.html">Comprendre l'espace de liberté</a></li>
          <li><a href="/carte-donnees/carte.html">La carte interactive</a></li>
          <li><a href="/cadre-reglementaire/cadre-2026.html">Le cadre 2026</a></li>
        </ul>
      </div>
    </section>`,
};
