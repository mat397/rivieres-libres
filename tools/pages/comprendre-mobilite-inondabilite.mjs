import { pageHead } from "./_shared.mjs";

export default {
  out: "comprendre/mobilite-inondabilite.html",
  meta: {
    title: "Mobilité et inondabilité des rivières | Rivières Libres",
    description: "Espace de mobilité (déplacement latéral du lit) et espace d'inondabilité (récurrence des crues) : comment on les délimite à l'aide de photos aériennes, LiDAR et simulations.",
    canonical: "https://rivieres-libres.example/comprendre/mobilite-inondabilite.html",
    active: "/comprendre/",
  },
  body: `${pageHead(
    "Comprendre",
    "Mobilité &amp; inondabilité",
    "Les deux dynamiques naturelles qui composent l'espace de liberté.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" }, { label: "Mobilité & inondabilité" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">L'espace de mobilité</h2>
          <p>Une rivière déplace son lit avec le temps : elle érode une berge, dépose des sédiments sur l'autre, forme et abandonne des méandres. L'espace de mobilité est la bande de terrain dans laquelle ce déplacement latéral se produit. L'ignorer, c'est construire là où la rivière finira par passer.</p>

          <h2>L'espace d'inondabilité</h2>
          <p>C'est la zone occupée par les crues selon leur récurrence : plus une crue est rare, plus elle s'étend loin. La plaine inondable et les milieux humides riverains agissent comme des zones tampons qui absorbent une partie de l'eau et atténuent les pointes de crue en aval.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <div class="callout callout--info">
          <span class="callout__label">Comment on délimite ces espaces</span>
          <p>On croise des <strong>photos aériennes historiques</strong>, des relevés <strong>LiDAR</strong>, des <strong>modèles numériques de terrain</strong> et des <strong>simulations de crues en climat futur</strong> pour reconstituer le comportement de la rivière dans le temps et anticiper son évolution.</p>
          <p class="mt-0"><a href="/pour-vous/professionnels.html">Voir les données &amp; méthodes (professionnels) →</a></p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="mt-0">Mini-glossaire</h2>
        <div class="accordion">
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="g-hgm">Hydrogéomorphologie<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="g-hgm" hidden><div class="accordion__panel-inner">Étude des formes du lit et des berges d'un cours d'eau et de leur évolution, à la base de la délimitation de l'espace de liberté.</div></div>
          </div>
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="g-rec">Récurrence<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="g-rec" hidden><div class="accordion__panel-inner">Fréquence statistique d'une crue d'une ampleur donnée (par exemple « crue de récurrence 100 ans » = environ 1 % de probabilité chaque année).</div></div>
          </div>
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="g-eti">Étiage<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="g-eti" hidden><div class="accordion__panel-inner">Niveau le plus bas d'un cours d'eau, généralement en période sèche. Les étiages plus marqués sont l'un des effets attendus des changements climatiques.</div></div>
          </div>
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="g-emb">Embâcle<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="g-emb" hidden><div class="accordion__panel-inner">Accumulation de glace ou de débris qui obstrue un cours d'eau et peut provoquer une inondation brutale en amont.</div></div>
          </div>
        </div>
        <p style="margin-top:var(--space-4)"><a href="/comprendre/glossaire-faq.html">Voir le glossaire complet →</a></p>
      </div>
    </section>`,
};
