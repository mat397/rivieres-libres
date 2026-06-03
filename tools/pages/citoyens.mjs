import { pageHead } from "./_shared.mjs";

export default {
  out: "pour-vous/citoyens.html",
  meta: {
    title: "Espace citoyens | Rivières Libres",
    description: "Ma propriété est-elle en zone inondable ? Ce que les nouvelles cartes changent (valeur, assurabilité, permis), les travaux d'adaptation possibles et qui contacter.",
    canonical: "https://rivieres-libres.example/pour-vous/citoyens.html",
    active: "/pour-vous/",
  },
  body: `${pageHead(
    "Pour vous",
    "Citoyens",
    "Ce que les nouvelles cartes changent pour vous, et comment vous adapter.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/pour-vous/citoyens.html", label: "Pour vous" }, { label: "Citoyens" }]
  )}

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <h2 class="mt-0">Ma propriété est-elle concernée ?</h2>
          <p>Vérifiez une adresse sur la carte, puis confirmez le statut réel auprès de votre municipalité.</p>
          <div class="btn-row"><a class="btn btn--ghost" href="/carte-donnees/carte.html">Vérifier une adresse</a></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Ce que ça change</h2>
          <ul>
            <li><strong>Valeur et assurabilité</strong> — le classement peut influencer l'assurance et le financement. Nous restons prudents sur les chiffres ; référez-vous aux analyses officielles.</li>
            <li><strong>Permis et travaux</strong> — les règles d'aménagement dépendent de la classe de risque applicable à votre terrain.</li>
            <li><strong>Information</strong> — de nouvelles cartes sont publiées progressivement ; votre secteur peut être cartographié à une date ultérieure.</li>
          </ul>
        </div>

        <div class="callout callout--nature">
          <span class="callout__label">Travaux d'adaptation possibles</span>
          <p class="mt-0">Selon votre situation : immunisation du bâtiment (surélévation des équipements, clapets anti-retour), aménagement du terrain favorisant l'infiltration, renaturalisation de la rive. Validez l'admissibilité avec votre municipalité.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">Questions fréquentes</h2>
        <div class="accordion">
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="c-q1">Mon terrain est nouvellement classé : que faire ?<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="c-q1" hidden><div class="accordion__panel-inner">Contactez votre municipalité pour connaître le statut réglementaire exact et les règles applicables. Le portail et la carte sont indicatifs.</div></div>
          </div>
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="c-q2">Puis-je agrandir ma maison ?<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="c-q2" hidden><div class="accordion__panel-inner">Cela dépend de la classe d'intensité et du règlement municipal. Certains travaux restent permis sous conditions ; d'autres sont restreints.</div></div>
          </div>
          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="c-q3">Suis-je protégé par une digue ?<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="c-q3" hidden><div class="accordion__panel-inner">Si votre secteur est derrière un ouvrage de protection reconnu, il peut être classé en « zone protégée à risque résiduel » : le risque est réduit mais subsiste.</div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="callout callout--info">
          <span class="callout__label">Qui contacter</span>
          <p class="mt-0">Votre <strong>municipalité</strong> (statut du terrain, permis), votre <strong>MRC</strong> (aménagement), la <strong>sécurité civile</strong> (MSP) en cas de sinistre, et les <strong>outils officiels</strong> du gouvernement du Québec pour les cartes.</p>
        </div>
      </div>
    </section>`,
};
