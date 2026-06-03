export default {
  out: "404.html",
  meta: {
    title: "Page introuvable | Rivières Libres",
    description: "La page demandée est introuvable.",
    canonical: "https://rivieres-libres.example/404.html",
    active: null,
  },
  body: `    <section class="section">
      <div class="container soon">
        <span class="tag">Erreur 404</span>
        <h1 class="mt-0">Page introuvable</h1>
        <p class="lead" style="margin-inline:auto">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <p><a class="btn btn--primary" href="/index.html">Retour à l'accueil</a></p>
        <p style="margin-top:var(--space-4)">Vous cherchiez peut-être :
          <a href="/comprendre/espace-de-liberte.html">Comprendre l'espace de liberté</a> ·
          <a href="/carte-donnees/carte.html">La carte</a> ·
          <a href="/cadre-reglementaire/cadre-2026.html">Le cadre 2026</a>.
        </p>
      </div>
    </section>`,
};
