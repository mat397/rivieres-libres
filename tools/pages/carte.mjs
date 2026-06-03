import { pageHead } from "./_shared.mjs";

export default {
  out: "carte-donnees/carte.html",
  meta: {
    title: "Carte interactive des zones inondables et de mobilité | Rivières Libres",
    description: "Consultez la carte officielle du gouvernement du Québec (MRNF) des zones inondables et de mobilité des cours d'eau, embarquée sur le portail, avec la légende des classes d'intensité.",
    canonical: "https://rivieres-libres.example/carte-donnees/carte.html",
    active: "/carte-donnees/",
  },
  body: `${pageHead(
    "Carte &amp; données",
    "Carte interactive",
    "Vérifiez une adresse et explorez les couches : zones inondables, mobilité, espace de liberté, milieux humides.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/carte-donnees/carte.html", label: "Carte & données" }, { label: "Carte" }]
  )}

    <section class="section">
      <div class="container">
        <div class="grid grid--2-1">
          <div class="map-embed">
            <!-- Carte officielle des zones inondables et de mobilité (MRNF, gouvernement du Québec) -->
            <iframe
              class="map-embed__frame"
              src="https://zonesinondables.mrnf.gouv.qc.ca/"
              title="Carte interactive officielle des zones inondables et de mobilité des cours d'eau (MRNF, gouvernement du Québec)"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allow="geolocation"></iframe>
            <p class="map-fallback">
              La carte ne s'affiche pas ? Ouvrez-la directement :
              <a href="https://zonesinondables.mrnf.gouv.qc.ca/" rel="noopener" target="_blank">zonesinondables.mrnf.gouv.qc.ca</a>
            </p>
          </div>

          <div class="stack">
            <div class="map-layers">
              <h3 class="mt-0" style="font-size:1rem">Utiliser la carte</h3>
              <p class="mt-0">La carte ci-contre est l'outil <strong>officiel du gouvernement du Québec</strong> (MRNF). Recherchez une adresse et activez les couches directement dans la carte :</p>
              <ul style="margin:0; padding-left:1.2em">
                <li>Zones inondables (classes d'intensité)</li>
                <li>Zones de mobilité des cours d'eau</li>
                <li>Milieux humides</li>
              </ul>
              <p class="source" style="margin-top:var(--space-3)">Source : ministère des Ressources naturelles et des Forêts (MRNF).</p>
            </div>

            <div class="legend" aria-label="Légende des classes de risque">
              <h3 class="mt-0" style="font-size:1rem">Classes d'intensité</h3>
              <ul class="legend__list">
                <li class="legend__item"><span class="legend__swatch legend__swatch--faible"></span><span><span class="legend__term">Faible</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--moderee"></span><span><span class="legend__term">Modérée</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--elevee"></span><span><span class="legend__term">Élevée</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--tres-elevee"></span><span><span class="legend__term">Très élevée</span></span></li>
                <li class="legend__item"><span class="legend__swatch legend__swatch--residuel"></span><span><span class="legend__term">Risque résiduel</span> (derrière un ouvrage)</span></li>
              </ul>
              <p style="margin:var(--space-3) 0 0"><a href="/carte-donnees/lire-les-cartes.html">Comment lire les cartes ?</a></p>
            </div>
          </div>
        </div>

        <div class="callout callout--warning" style="margin-top:var(--space-5)">
          <span class="callout__label">Avertissement</span>
          <p class="mt-0">Cette carte a une valeur indicative et n'a aucune portée légale. Pour connaître le statut réel d'un terrain, consultez votre municipalité et les outils officiels du gouvernement du Québec.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">Liens officiels</h2>
        <ul class="prose">
          <li><a href="https://www.quebec.ca/" rel="noopener" target="_blank">Carte gouvernementale des zones inondables et de mobilité des cours d'eau</a></li>
          <li><a href="https://www.quebec.ca/" rel="noopener" target="_blank">Géo-Inondations</a></li>
          <li><a href="https://www.quebec.ca/" rel="noopener" target="_blank">Atlas de l'eau</a></li>
        </ul>
        <p class="source">Liens à pointer vers les URL officielles exactes lors de la mise en ligne.</p>
      </div>
    </section>`,
};
