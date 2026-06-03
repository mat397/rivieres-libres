import { pageHead } from "./_shared.mjs";

export default {
  out: "carte-donnees/lire-les-cartes.html",
  meta: {
    title: "Lire les cartes des zones inondables | Rivières Libres",
    description: "Comprendre les quatre classes d'intensité (faible, modérée, élevée, très élevée), la zone protégée à risque résiduel, et le passage de l'ancien au nouveau système cartographique.",
    canonical: "https://rivieres-libres.example/carte-donnees/lire-les-cartes.html",
    active: "/carte-donnees/",
  },
  body: `${pageHead(
    "Carte &amp; données",
    "Lire les cartes",
    "Les classes d'intensité, le risque résiduel, et ce qui change par rapport à l'ancien système.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/carte-donnees/carte.html", label: "Carte & données" }, { label: "Lire les cartes" }]
  )}

    <section class="section">
      <div class="container">
        <div class="grid grid--2-1">
          <div>
            <h2 class="mt-0">Les classes d'intensité</h2>
            <p class="prose">Le nouveau système classe chaque secteur selon l'intensité de l'aléa d'inondation. Sélectionnez une classe pour en voir la description et les implications.</p>

            <div data-zone-selector>
              <div class="zone-selector__controls" role="group" aria-label="Choisir une classe de risque">
                <button class="zone-chip" type="button" data-zone="faible" aria-pressed="false" style="--swatch:var(--risk-faible)">Faible</button>
                <button class="zone-chip" type="button" data-zone="moderee" aria-pressed="false" style="--swatch:var(--risk-moderee)">Modérée</button>
                <button class="zone-chip" type="button" data-zone="elevee" aria-pressed="false" style="--swatch:var(--risk-elevee)">Élevée</button>
                <button class="zone-chip" type="button" data-zone="tres-elevee" aria-pressed="false" style="--swatch:var(--risk-tres-elevee)">Très élevée</button>
                <button class="zone-chip" type="button" data-zone="residuel" aria-pressed="false" style="--swatch:var(--risk-residuel)">Risque résiduel</button>
              </div>
              <div class="zone-result" role="status" aria-live="polite">
                <p class="mt-0">Sélectionnez une classe ci-dessus pour afficher sa description.</p>
              </div>
            </div>
          </div>

          <div class="legend" aria-label="Légende des classes de risque">
            <h3 class="mt-0" style="font-size:1rem">Légende</h3>
            <ul class="legend__list">
              <li class="legend__item"><span class="legend__swatch legend__swatch--faible"></span><span><span class="legend__term">Faible</span> — probabilité la plus basse</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--moderee"></span><span><span class="legend__term">Modérée</span> — probabilité intermédiaire</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--elevee"></span><span><span class="legend__term">Élevée</span> — probabilité importante</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--tres-elevee"></span><span><span class="legend__term">Très élevée</span> — probabilité la plus haute</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--residuel"></span><span><span class="legend__term">Risque résiduel</span> — derrière un ouvrage reconnu</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">De l'ancien au nouveau système</h2>
        <div class="table-wrap">
          <table class="comparison-table is-stacked">
            <caption class="visually-hidden">Comparaison entre l'ancien et le nouveau système cartographique</caption>
            <thead>
              <tr><th scope="col">Aspect</th><th scope="col">Ancien système</th><th scope="col">Nouvelle génération</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Découpage</th><td data-label="Ancien">2 zones</td><td data-label="Nouveau">4 classes d'intensité + risque résiduel</td></tr>
              <tr><th scope="row">Référence</th><td data-label="Ancien">Grand courant (0–20 ans) / faible courant (20–100 ans)</td><td data-label="Nouveau">Faible / modérée / élevée / très élevée</td></tr>
              <tr><th scope="row">Ouvrages de protection</th><td data-label="Ancien">Peu pris en compte</td><td data-label="Nouveau">Zone protégée à risque résiduel reconnue</td></tr>
            </tbody>
          </table>
        </div>

        <div class="callout callout--warning">
          <span class="callout__label">À valider avant publication</span>
          <p class="mt-0">Les seuils précis associés à chaque classe (par exemple « très élevée » = plus de 70 % de probabilité sur 25 ans, profondeur supérieure à 60 cm) proviennent de relais médiatiques et <strong>doivent être validés sur le guide méthodologique officiel du MELCCFP</strong> avant mise en ligne.</p>
        </div>

        <div class="callout callout--info">
          <span class="callout__label">Limites</span>
          <p class="mt-0">Les cartes ont une valeur indicative. Pour les limites officielles et le statut applicable à un terrain, adressez-vous à votre municipalité.</p>
        </div>
      </div>
    </section>`,
};
