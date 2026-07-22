import { pageHero, maskLines, linkArrow } from "./_shared.mjs";

export default {
  out: "cadre-reglementaire/cadre-2026.html",
  meta: {
    title: "Le cadre réglementaire 2026 | Rivières Libres",
    description: "Le cadre réglementaire modernisé en milieux hydriques, adopté le 12 juin 2025 et en vigueur depuis le 1er mars 2026 : ROPI, RMUN, RAMHHS, et qui fait quoi.",
    canonical: "https://rivieres-libres.example/cadre-reglementaire/cadre-2026.html",
    active: "/cadre-reglementaire/",
  },
  body: `${pageHero({
    kicker: "Cadre réglementaire",
    title: ["Le cadre <em>2026</em>,", "en clair."],
    lead: "Nouvelles cartes, nouvelles classes de risque, nouveaux rôles : ce que le régime modernisé des milieux hydriques change, et qui fait quoi.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/cadre-reglementaire/cadre-2026.html", label: "Cadre réglementaire" },
      { label: "Cadre 2026" },
    ],
  })}

    <!-- ===== VUE D'ENSEMBLE ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2-1 grid--gap-lg">
          <div class="prose">
            <h2 class="mt-0" data-reveal>Vue d'ensemble</h2>
            <div data-reveal-group>
              <p data-reveal>Le cadre réglementaire modernisé en milieux hydriques a été adopté le <strong>12 juin 2025</strong> et est en vigueur depuis le <strong>1ᵉʳ mars 2026</strong>. Il remplace le régime transitoire instauré en 2022 et s'appuie sur un guide méthodologique officiel du MELCCFP.</p>
              <p class="source" data-reveal>Source : MELCCFP / gouvernement du Québec.</p>
            </div>
          </div>
          <div class="callout callout--context" data-reveal style="margin-block:0;align-self:start">
            <span class="callout__label">L'ampleur du changement</span>
            <p class="mt-0">Selon les annonces gouvernementales de juin 2025, le nombre de logements situés en zones inondables passerait d'environ <strong>25 000 à 35 000</strong>, soit une hausse d'environ 30 %. Il s'agit d'une estimation gouvernementale, sujette à ajustement régional.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LES RÈGLEMENTS CLÉS ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2>${maskLines(["Les règlements clés"])}</h2>
        <ul class="stack" style="list-style:none;margin:var(--space-5) 0 0;padding:0;max-width:74ch" data-reveal-group>
          <li data-reveal style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--space-2) var(--space-4)">
            <span class="tag" style="flex:none">ROPI</span>
            <div style="flex:1 1 320px;min-width:0">
              <h3 class="mt-0" style="margin-bottom:var(--space-1)">Ouvrages de protection</h3>
              <p class="mt-0">Règlement sur les ouvrages de protection contre les inondations : encadre les digues et autres OPI reconnus.</p>
            </div>
          </li>
          <li data-reveal style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--space-2) var(--space-4)">
            <span class="tag" style="flex:none">RMUN</span>
            <div style="flex:1 1 320px;min-width:0">
              <h3 class="mt-0" style="margin-bottom:var(--space-1)">Responsabilité municipale</h3>
              <p class="mt-0">Règlement sur l'encadrement d'activités sous la responsabilité des municipalités.</p>
            </div>
          </li>
          <li data-reveal style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--space-2) var(--space-4)">
            <span class="tag" style="flex:none">RAMHHS</span>
            <div style="flex:1 1 320px;min-width:0">
              <h3 class="mt-0" style="margin-bottom:var(--space-1)">Milieux humides &amp; hydriques</h3>
              <p class="mt-0">Règlement sur les activités dans des milieux humides, hydriques et sensibles.</p>
            </div>
          </li>
        </ul>
        <p class="source" style="margin-top:var(--space-4)">Des ajustements au REAFIE complètent le dispositif. Source : MELCCFP.</p>
      </div>
    </section>

    <!-- ===== QUI FAIT QUOI ===== -->
    <section class="section">
      <div class="container">
        <h2 data-reveal>Qui fait quoi</h2>
        <div class="grid grid--2 grid--gap-lg" style="margin-top:var(--space-5)" data-reveal-group>
          <div data-reveal style="border-top:1px solid var(--color-border);padding-top:var(--space-3)">
            <h3 class="mt-0">MELCCFP</h3>
            <p class="mt-0">Cadre réglementaire, projet INFO-Crue, guide méthodologique.</p>
          </div>
          <div data-reveal style="border-top:1px solid var(--color-border);padding-top:var(--space-3)">
            <h3 class="mt-0">MAMH</h3>
            <p class="mt-0">Bureaux de projets-Inondations, programme PRAFI.</p>
          </div>
          <div data-reveal style="border-top:1px solid var(--color-border);padding-top:var(--space-3)">
            <h3 class="mt-0">CMM / BIRC</h3>
            <p class="mt-0">Bureau des inondations et de la résilience climatique, à l'œuvre depuis 2017.</p>
          </div>
          <div data-reveal style="border-top:1px solid var(--color-border);padding-top:var(--space-3)">
            <h3 class="mt-0">CMQ, MRC et municipalités</h3>
            <p class="mt-0">Application locale, permis, cartographie déléguée.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CALENDRIER ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2>${maskLines(["Calendrier"])}</h2>
        <ol class="stack" style="list-style:none;margin:var(--space-5) 0 0;padding:0;max-width:70ch" data-reveal-group>
          <li data-reveal style="display:grid;gap:var(--space-1)">
            <span style="font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:var(--color-deep)">12 juin 2025</span>
            <p class="mt-0">Adoption du cadre réglementaire modernisé en milieux hydriques.</p>
          </li>
          <li data-reveal style="display:grid;gap:var(--space-1)">
            <span style="font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:var(--color-deep)">1ᵉʳ mars 2026</span>
            <p class="mt-0">Entrée en vigueur du nouveau cadre, qui met fin au régime transitoire de 2022.</p>
          </li>
          <li data-reveal style="display:grid;gap:var(--space-1)">
            <span style="font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:var(--color-deep)">Depuis mars 2026</span>
            <p class="mt-0">Publication <strong>progressive</strong> des cartes de nouvelle génération. Les premières publications devraient couvrir environ 75 % de la population.</p>
          </li>
        </ol>
        <p class="source" style="margin-top:var(--space-4)">Source : MELCCFP / gouvernement du Québec, 2025-2026.</p>
        <p style="margin-top:var(--space-5)" data-reveal>${linkArrow("/carte-donnees/lire-les-cartes.html", "Comprendre les nouvelles cartes")}</p>
      </div>
    </section>`,
};
