import { pageHero, maskLines, indexRow, accordionItem, ICON_ARROW } from "./_shared.mjs";

export default {
  out: "pour-vous/citoyens.html",
  meta: {
    title: "Espace citoyens | Rivières Libres",
    description: "Ma propriété est-elle en zone inondable ? Vérifier une adresse, comprendre ce que les nouvelles cartes changent et s'adapter : les étapes pour les citoyens.",
    canonical: "https://rivieres-libres.example/pour-vous/citoyens.html",
    active: "/pour-vous/",
  },
  body: `${pageHero({
    kicker: "Pour vous",
    title: ["Citoyens et", "<em>propriétaires</em>"],
    lead: "Une carte qui change ne change pas votre maison : voici comment vérifier votre situation, comprendre les nouvelles règles et vous adapter.",
    crumbs: [{ href: "/index.html", label: "Accueil" }, { href: "/pour-vous/citoyens.html", label: "Pour vous" }, { label: "Citoyens" }],
  })}

    <!-- ===== LES TROIS GESTES (colonne vertébrale de la page) ===== -->
    <section class="section">
      <div class="container">
        <h2>${maskLines(["Trois gestes,", "dans l'ordre"])}</h2>
        <p class="section__intro" data-reveal>Un nouveau classement soulève des questions légitimes. La démarche pour y répondre, elle, reste simple.</p>
        <ol class="index-list" data-reveal-group>
          ${indexRow({
            num: "01",
            href: "/carte-donnees/carte.html",
            title: "Vérifier une adresse sur la carte",
            desc: "La carte officielle donne une première lecture de votre secteur. Elle a une valeur indicative, sans portée légale.",
          })}
          ${indexRow({
            num: "02",
            href: "#contacts",
            title: "Confirmer auprès de votre municipalité",
            desc: "Elle seule connaît le statut réglementaire exact de votre terrain et les permis qui s'y appliquent.",
          })}
          ${indexRow({
            num: "03",
            href: "#adaptation",
            title: "Adapter votre propriété au besoin",
            desc: "Immunisation du bâtiment, aménagement du terrain, renaturalisation de la rive : des travaux existent.",
          })}
        </ol>
      </div>
    </section>

    <!-- ===== CE QUE ÇA CHANGE + S'ADAPTER ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--2-1 grid--gap-lg">
          <div>
            <h2 class="mt-0">${maskLines(["Ce que ça change", "pour vous"])}</h2>
            <div class="prose" data-reveal>
              <p>Le classement de votre terrain peut jouer sur trois plans :</p>
              <ul>
                <li><strong>Valeur et assurabilité</strong> : le classement peut influencer l'assurance et le financement. Nous restons prudents sur les chiffres ; référez-vous aux analyses officielles.</li>
                <li><strong>Permis et travaux</strong> : les règles d'aménagement dépendent de la classe de risque applicable à votre terrain.</li>
                <li><strong>Information</strong> : de nouvelles cartes sont publiées progressivement ; votre secteur peut être cartographié à une date ultérieure.</li>
              </ul>
            </div>
          </div>
          <div class="callout callout--nature" id="adaptation" data-reveal>
            <span class="callout__label">Travaux d'adaptation possibles</span>
            <p class="mt-0">Selon votre situation : immunisation du bâtiment (surélévation des équipements, clapets anti-retour), aménagement du terrain favorisant l'infiltration, renaturalisation de la rive. Validez l'admissibilité avec votre municipalité.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== QUESTIONS FRÉQUENTES ===== -->
    <section class="section">
      <div class="container">
        <h2 class="mt-0" data-reveal>Questions fréquentes</h2>
        <p class="section__intro" data-reveal>Des réponses courtes aux inquiétudes les plus courantes.</p>
        <div class="accordion" data-reveal>
          ${accordionItem({
            id: "c-q1",
            question: "Mon terrain est nouvellement classé : que faire ?",
            answerHtml: "Contactez votre municipalité pour connaître le statut réglementaire exact et les règles applicables. Le portail et la carte sont indicatifs.",
          })}
          ${accordionItem({
            id: "c-q2",
            question: "Puis-je agrandir ma maison ?",
            answerHtml: "Cela dépend de la classe d'intensité et du règlement municipal. Certains travaux restent permis sous conditions ; d'autres sont restreints.",
          })}
          ${accordionItem({
            id: "c-q3",
            question: "Suis-je protégé par une digue ?",
            answerHtml: "Si votre secteur est derrière un ouvrage de protection reconnu, il peut être classé en « zone protégée à risque résiduel » : le risque est réduit mais subsiste.",
          })}
        </div>
      </div>
    </section>

    <!-- ===== QUI CONTACTER ===== -->
    <section class="section section--mist" id="contacts">
      <div class="container">
        <h2 class="mt-0" data-reveal>Qui contacter</h2>
        <p class="section__intro" data-reveal>Un interlocuteur par besoin : vous n'avez pas à chercher seul.</p>
        <div class="prose" data-reveal>
          <ul>
            <li><strong>Votre municipalité</strong> : statut réglementaire du terrain et permis.</li>
            <li><strong>Votre MRC</strong> : aménagement du territoire.</li>
            <li><strong>La sécurité civile (MSP)</strong> : en cas de sinistre.</li>
            <li><strong>Les outils officiels du gouvernement du Québec</strong> : pour les cartes.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ===== APPEL FINAL ===== -->
    <section class="section">
      <div class="container">
        <div class="cta-band" data-reveal>
          <h2 class="mt-0">Ma propriété est-elle concernée ?</h2>
          <p>Vérifiez une adresse sur la carte, puis confirmez le statut réel auprès de votre municipalité.</p>
          <div class="btn-row"><a class="btn btn--primary" href="/carte-donnees/carte.html">Vérifier une adresse ${ICON_ARROW}</a></div>
        </div>
      </div>
    </section>`,
};
