/* ==========================================================================
   Rivières Libres — Comportements front-end (vanilla, v2)

   Principes :
   - Progressive enhancement : sans JS, tout le contenu est visible et lisible
     (les états initiaux masqués n'existent que sous html.js, posé dans <head>).
   - Aucun écouteur `scroll` : IntersectionObserver + animations CSS pilotées
     par le défilement. Le rAF ne sert qu'aux compteurs.
   - prefers-reduced-motion : aucune choréographie, états finaux immédiats.

   Modules : nav caméléon, menu mobile, révélations, remplissage mot à mot,
   compteurs, accordéons, sélecteur de classe de risque, année du footer.
   ========================================================================== */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HAS_IO = "IntersectionObserver" in window;

  /* --- Nav caméléon ----------------------------------------------------- */
  /* 1) is-scrolled : sentinelle en haut de page (aucun écouteur scroll).
     2) data-scheme : la nav lit le thème de la section qu'elle survole via
        une zone-sonde (le ~8 % supérieur du viewport) sur [data-navtheme]. */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header || !HAS_IO) return;

    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:28px;pointer-events:none;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);

    var darkSections = document.querySelectorAll("[data-navtheme=\"dark\"]");
    if (!darkSections.length) { header.setAttribute("data-scheme", "light"); return; }
    var over = new Set();
    var probe = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { over.add(e.target); } else { over.delete(e.target); }
      });
      header.setAttribute("data-scheme", over.size ? "dark" : "light");
    }, { rootMargin: "0px 0px -92% 0px" });
    darkSections.forEach(function (s) { probe.observe(s); });
  }

  /* --- Menu mobile (voile plein écran) ----------------------------------- */
  function initMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;
    var closeBtn = menu.querySelector(".mobile-menu__close");

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      document.documentElement.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open && closeBtn) { closeBtn.focus(); }
      if (!open) { toggle.focus(); }
    }

    toggle.addEventListener("click", function () { setOpen(true); });
    if (closeBtn) { closeBtn.addEventListener("click", function () { setOpen(false); }); }
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { setOpen(false); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); }
    });
  }

  /* --- Révélations au défilement ----------------------------------------- */
  /* [data-reveal] : fondu + montée. Dans un [data-reveal-group], le décalage
     en cascade est indexé automatiquement (--i). [data-reveal] s'applique
     aussi aux titres masqués (.mask) et aux tracés SVG (.draw). */
  function initReveals() {
    var groups = document.querySelectorAll("[data-reveal-group]");
    groups.forEach(function (group) {
      var children = group.querySelectorAll("[data-reveal]");
      children.forEach(function (el, i) { el.style.setProperty("--i", String(i)); });
    });

    var targets = document.querySelectorAll("[data-reveal], .mask, .draw");
    if (!targets.length) return;

    if (REDUCED || !HAS_IO) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* --- Manifeste : remplissage mot à mot ---------------------------------- */
  /* Découpe le texte de [data-wordfill] en mots (.wf). Les éléments enfants
     (em, strong, a) sont traités comme un seul mot pour rester intacts.
     Pilotage par défilement natif (animation-timeline: view()) quand le
     navigateur le supporte ; sinon repli en cascade via IntersectionObserver. */
  function initWordfill() {
    var blocks = document.querySelectorAll("[data-wordfill]");
    if (!blocks.length) return;

    var supportsSDA = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");

    blocks.forEach(function (block) {
      var index = 0;
      function wrapWords(node) {
        var kids = Array.prototype.slice.call(node.childNodes);
        kids.forEach(function (child) {
          if (child.nodeType === Node.TEXT_NODE) {
            var frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              var span = document.createElement("span");
              span.className = "wf";
              span.style.setProperty("--w", String(index++));
              span.textContent = part;
              frag.appendChild(span);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            child.classList.add("wf");
            child.style.setProperty("--w", String(index++));
          }
        });
      }
      wrapWords(block);
      block.classList.add("wordfill");
      if (!supportsSDA) { block.classList.add("no-sda"); }
    });

    if (!supportsSDA) {
      if (REDUCED || !HAS_IO) {
        blocks.forEach(function (b) { b.classList.add("is-in"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.35 });
      blocks.forEach(function (b) { io.observe(b); });
    }
  }

  /* --- Compteurs ----------------------------------------------------------- */
  /* [data-count-to="35000"] (+ data-count-prefix / data-count-suffix).
     Format québécois via toLocaleString("fr-CA"). */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;

    function render(el, value) {
      var prefix = el.getAttribute("data-count-prefix") || "";
      var suffix = el.getAttribute("data-count-suffix") || "";
      el.textContent = prefix + value.toLocaleString("fr-CA") + suffix;
    }

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) return;
      var start = null;
      var DURATION = 1400;
      function frame(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / DURATION, 1);
        var eased = 1 - Math.pow(2, -10 * p); /* expo out */
        render(el, Math.round(target * eased));
        if (p < 1) { requestAnimationFrame(frame); } else { render(el, target); }
      }
      requestAnimationFrame(frame);
    }

    if (REDUCED || !HAS_IO) {
      counters.forEach(function (el) { render(el, parseFloat(el.getAttribute("data-count-to")) || 0); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) {
      render(el, 0);
      io.observe(el);
    });
  }

  /* --- Accordéons ----------------------------------------------------------- */
  /* Sans JS : tous les panneaux sont ouverts (lisibles). À l'init, on replie
     tout (sauf data-default-open) puis on anime via grid-template-rows. */
  function initAccordions() {
    var triggers = document.querySelectorAll(".accordion__trigger");
    triggers.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      var openByDefault = panel.hasAttribute("data-default-open");
      if (openByDefault) {
        panel.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      } else {
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      }

      function open() {
        panel.hidden = false;
        /* reflow avant d'animer l'ouverture */
        void panel.offsetHeight;
        panel.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
      function close() {
        panel.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        var onEnd = function (e) {
          if (e.propertyName === "grid-template-rows" && !panel.classList.contains("is-open")) {
            panel.hidden = true;
          }
          panel.removeEventListener("transitionend", onEnd);
        };
        if (REDUCED) { panel.hidden = true; } else { panel.addEventListener("transitionend", onEnd); }
      }

      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        if (expanded) { close(); } else { open(); }
      });
    });
  }

  /* --- Sélecteur de classe de risque --------------------------------------- */
  var ZONE_DATA = {
    faible: {
      label: "Aléa faible",
      desc: "Secteur où la probabilité d'inondation est la plus basse parmi les zones cartographiées. Des règles d'aménagement s'appliquent tout de même.",
      todo: "Consulter la municipalité avant tout projet ; certains travaux restent encadrés."
    },
    moderee: {
      label: "Aléa modéré",
      desc: "Probabilité d'inondation intermédiaire. Les nouvelles constructions et l'agrandissement sont soumis à des conditions.",
      todo: "Vérifier l'admissibilité de votre projet auprès de la municipalité et privilégier l'adaptation."
    },
    elevee: {
      label: "Aléa élevé",
      desc: "Probabilité d'inondation importante. L'aménagement y est fortement restreint.",
      todo: "Constructions neuves généralement interdites ; informez-vous sur les mesures d'immunisation."
    },
    "tres-elevee": {
      label: "Aléa très élevé",
      desc: "Selon les définitions gouvernementales relayées, ce niveau correspondrait à un risque de plus de 70 % d'être inondé au moins une fois sur 25 ans, avec une profondeur d'eau pouvant dépasser 60 cm. (Seuils à valider sur le guide méthodologique officiel du MELCCFP.)",
      todo: "Aménagement très restreint. Référez-vous à la municipalité et aux mesures de sécurité civile."
    },
    residuel: {
      label: "Zone protégée à risque résiduel",
      desc: "Secteur situé derrière un ouvrage de protection contre les inondations (OPI) reconnu. Le risque est réduit mais subsiste en cas de défaillance ou de crue exceptionnelle.",
      todo: "Des règles particulières s'appliquent selon l'ouvrage reconnu ; vérifiez auprès de votre municipalité."
    }
  };

  function initZoneSelector() {
    var selector = document.querySelector("[data-zone-selector]");
    if (!selector) return;
    var chips = selector.querySelectorAll(".zone-chip");
    var result = selector.querySelector(".zone-result");
    if (!result) return;

    function show(key) {
      var d = ZONE_DATA[key];
      if (!d) return;
      result.innerHTML =
        "<h3>" + d.label + "</h3>" +
        "<p>" + d.desc + "</p>" +
        "<p class=\"mt-0\"><strong>Que faire ?</strong> " + d.todo + "</p>";
      Array.prototype.forEach.call(chips, function (c) {
        c.setAttribute("aria-pressed", String(c.dataset.zone === key));
      });
    }

    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener("click", function () { show(c.dataset.zone); });
    });
  }

  /* --- Année du footer ------------------------------------------------------ */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  /* --- CTA carte : bascule de l'aperçu vers la carte ------------------------ */
  /* Au clic, l'aperçu grandit et s'estompe (is-launching), puis on navigue.
     Sans JS ou en reduced-motion, le lien fonctionne normalement (instantané). */
  function initMapLaunch() {
    var link = document.querySelector(".map-launch");
    if (!link) return;
    var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (REDUCED) return;
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // laisser l'ouverture dans un onglet
      e.preventDefault();
      var href = link.getAttribute("href");
      link.classList.add("is-launching");
      setTimeout(function () { window.location.href = href; }, 480);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initMenu();
    initWordfill();
    initReveals();
    initCounters();
    initAccordions();
    initZoneSelector();
    initMapLaunch();
    initYear();
  });
})();
