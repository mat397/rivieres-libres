import { pageHero, maskLines, ICON_ARROW } from "./_shared.mjs";

export default {
  out: "carte-donnees/lire-les-cartes.html",
  meta: {
    title: "Lire les cartes des zones inondables | Rivières Libres",
    description: "Comprendre les quatre classes d'intensité, la zone protégée à risque résiduel et le passage de l'ancien au nouveau système cartographique des zones inondables.",
    canonical: "https://rivieres-libres.example/carte-donnees/lire-les-cartes.html",
    active: "/carte-donnees/",
  },
  body: `${pageHero({
    kicker: "Carte et données",
    title: ["Apprendre à lire", "les <em>cartes</em>"],
    lead: "Quatre classes d'intensité, une zone protégée à risque résiduel : voici comment lire la nouvelle cartographie et ce qui change par rapport à l'ancienne.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/carte-donnees/carte.html", label: "Carte &amp; données" },
      { label: "Lire les cartes" },
    ],
  })}

    <!-- ===== LES CLASSES D'INTENSITÉ (sélecteur interactif + légende) ===== -->
    <section class="section">
      <div class="container">
        <div class="grid grid--2-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Les classes", "d'intensité"])}</h2>
            <p class="prose" data-reveal>Le nouveau système classe chaque secteur selon l'intensité de l'aléa d'inondation. Sélectionnez une classe pour voir ce qu'elle signifie et quoi faire ensuite.</p>

            <div data-zone-selector data-reveal>
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

          <div class="legend" aria-label="Légende des classes de risque" data-reveal>
            <h3 class="mt-0" style="font-size:1rem">Légende</h3>
            <ul class="legend__list">
              <li class="legend__item"><span class="legend__swatch legend__swatch--faible"></span><span><span class="legend__term">Faible</span> : probabilité la plus basse</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--moderee"></span><span><span class="legend__term">Modérée</span> : probabilité intermédiaire</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--elevee"></span><span><span class="legend__term">Élevée</span> : probabilité importante</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--tres-elevee"></span><span><span class="legend__term">Très élevée</span> : probabilité la plus haute</span></li>
              <li class="legend__item"><span class="legend__swatch legend__swatch--residuel"></span><span><span class="legend__term">Risque résiduel</span> : derrière un ouvrage reconnu</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== DE L'ANCIEN AU NOUVEAU SYSTÈME ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">${maskLines(["De l'ancien au", "nouveau système"])}</h2>
        <p class="section__intro" data-reveal>D'un découpage en deux zones à quatre classes d'intensité, plus une zone protégée à risque résiduel.</p>

        <div class="table-wrap" data-reveal>
          <table class="comparison-table is-stacked">
            <caption class="visually-hidden">Comparaison entre l'ancien et le nouveau système cartographique</caption>
            <thead>
              <tr><th scope="col">Aspect</th><th scope="col">Ancien système</th><th scope="col">Nouvelle génération</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Découpage</th><td data-label="Ancien">2 zones</td><td data-label="Nouveau">4 classes d'intensité + risque résiduel</td></tr>
              <tr><th scope="row">Référence</th><td data-label="Ancien">Grand courant (0 à 20 ans) / faible courant (20 à 100 ans)</td><td data-label="Nouveau">Faible / modérée / élevée / très élevée</td></tr>
              <tr><th scope="row">Ouvrages de protection</th><td data-label="Ancien">Peu pris en compte</td><td data-label="Nouveau">Zone protégée à risque résiduel reconnue</td></tr>
            </tbody>
          </table>
        </div>

        <div class="grid grid--2" data-reveal-group>
          <div class="callout callout--warning" data-reveal>
            <span class="callout__label">À valider avant publication</span>
            <p class="mt-0">Les seuils précis associés à chaque classe (par exemple « très élevée » = plus de 70 % de probabilité sur 25 ans, profondeur supérieure à 60 cm) proviennent de relais médiatiques et <strong>doivent être validés sur le guide méthodologique officiel du MELCCFP</strong> avant mise en ligne.</p>
          </div>
          <div class="callout callout--info" data-reveal>
            <span class="callout__label">Limites</span>
            <p class="mt-0">Les cartes ont une valeur indicative. Pour les limites officielles et le statut applicable à un terrain, adressez-vous à votre municipalité.</p>
          </div>
        </div>

        <div class="btn-row" style="margin-top:var(--space-6)" data-reveal>
          <a class="btn btn--primary" href="/carte-donnees/carte.html">Vérifier une adresse ${ICON_ARROW}</a>
        </div>
      </div>
    </section>`,
};
