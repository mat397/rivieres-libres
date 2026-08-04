import { ImageResponse } from "@vercel/og";

/* Image de prévisualisation sociale (Open Graph) générée à la volée pour une
   adresse. Facebook / LinkedIn / X la récupèrent quand un lien /api/partage est
   partagé. Format standard 1200x630.

   Paramètres : ?lat=&lng=&adresse=&zone=&statut=
   - zone   : "in" (en zone) | "out" (hors zone) | "" (inconnu)
   - statut : libellé court de la classe

   Écrit SANS JSX (via le helper `h`) pour ne dépendre d'aucune étape de
   compilation : `h` produit la même structure {type, props} qu'un ReactElement,
   que Satori (moteur de @vercel/og) sait rendre. */

export const config = { runtime: "nodejs" };

/* createElement minimal : renvoie un noeud au format ReactElement. */
function h(type, props, ...children) {
  return {
    type,
    key: null,
    props: { ...(props || {}), children: children.length <= 1 ? children[0] : children },
  };
}

function esc(s) {
  return (s || "").toString().slice(0, 90);
}

export default async function handler(req) {
  const url = new URL(req.url);
  const q = url.searchParams;
  const lat = parseFloat(q.get("lat"));
  const lng = parseFloat(q.get("lng"));
  const adresse = esc(q.get("adresse")) || "Une adresse au Québec";
  const zone = q.get("zone") || "";
  const statut = esc(q.get("statut")) ||
    (zone === "in" ? "Secteur en zone inondable"
     : zone === "out" ? "Hors des zones cartographiées"
     : "Vérifiez votre secteur");

  const accent = zone === "in" ? "#C4443B" : zone === "out" ? "#3D7A34" : "#1E8AA0";

  const token = process.env.MAPBOX_TOKEN || "";
  let carte = "";
  if (token && isFinite(lat) && isFinite(lng)) {
    const mk = "pin-l+" + accent.replace("#", "") + "(" + lng.toFixed(5) + "," + lat.toFixed(5) + ")";
    carte = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/" + mk +
      "/" + lng.toFixed(5) + "," + lat.toFixed(5) + ",13,0/1200x430@2x?access_token=" +
      token + "&logo=false&attribution=false";
  }

  const tree = h("div",
    { style: { display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#0E3A52" } },
    // Mini-carte (fond haut)
    h("div", { style: { display: "flex", width: "100%", height: "430px" } },
      carte
        ? h("img", { src: carte, width: 1200, height: 430, style: { objectFit: "cover", width: "1200px", height: "430px" } })
        : h("div", { style: { display: "flex", width: "100%", height: "100%", background: "#0A2C3F" } })
    ),
    // Bande basse : statut + adresse + marque
    h("div", { style: { display: "flex", flexDirection: "column", flex: 1, padding: "26px 48px", justifyContent: "center" } },
      h("div", { style: { display: "flex", alignItems: "center" } },
        h("div", { style: { display: "flex", width: "18px", height: "18px", borderRadius: "9px", background: accent, marginRight: "14px" } }),
        h("div", { style: { display: "flex", color: "#ffffff", fontSize: "34px", fontWeight: 700 } }, statut)
      ),
      h("div", { style: { display: "flex", color: "#CFE6EC", fontSize: "26px", marginTop: "8px" } }, adresse),
      h("div", { style: { display: "flex", color: "#7BD4E4", fontSize: "22px", marginTop: "16px", fontWeight: 600 } },
        "Rivières Libres · Carte des zones inondables du Québec")
    )
  );

  return new ImageResponse(tree, { width: 1200, height: 630 });
}
