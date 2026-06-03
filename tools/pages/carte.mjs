import { pageHead } from "./_shared.mjs";

export default {
  out: "carte-donnees/carte.html",
  meta: {
    title: "Carte interactive des zones inondables et de mobilité | Rivières Libres",
    description: "Vérifiez si une adresse se trouve en zone inondable, en zone de mobilité, dans l'espace de liberté ou un milieu humide. Aperçu ; intégration des couches officielles prévue.",
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
          <div class="map-embed map-embed--full">
            <!-- V2: intégrer Leaflet + couches WMS officielles MELCCFP/MRNF -->
            <div class="map-embed__canvas">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=60" alt="Vue cartographique aérienne d'un bassin versant" loading="lazy">
              <div class="map-embed__overlay">
                <span class="map-embed__badge">Aperçu — carte non interactive</span>
                <form class="map-search" data-map-search action="#" role="search" aria-label="Rechercher une adresse">
                  <label class="visually-hidden" for="adresse">Adresse</label>
                  <input id="adresse" type="text" name="adresse" placeholder="Entrez une adresse au Québec…" autocomplete="off">
                  <button class="btn btn--primary" type="submit">Vérifier</button>
                </form>
                <p data-map-message role="status" hidden style="background:rgba(255,255,255,.95);color:var(--color-ink);padding:var(--space-3);border-radius:var(--radius-sm);max-width:46ch"></p>
              </div>
            </div>
          </div>

          <div class="stack">
            <div class="map-layers">
              <fieldset>
                <legend>Couches</legend>
                <label><input type="checkbox" checked> Zones inondables</label>
                <label><input type="checkbox"> Zones de mobilité</label>
                <label><input type="checkbox"> Espace de liberté</label>
                <label><input type="checkbox"> Milieux humides</label>
              </fieldset>
              <p class="source" style="margin-top:var(--space-3)">Couches illustratives. Les données officielles seront intégrées en V2.</p>
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
