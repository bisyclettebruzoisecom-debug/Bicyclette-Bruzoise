/*!
 * Bicyclette Bruzoise – bureau.js
 * Rôle : générer la grille du bureau une fois l'accès adhérents déverrouillé.
 *
 * Dépend de : assets/js/private-access.js
 */
(function () {
  "use strict";

  const STORAGE_KEY = "bb_private_access";

  function isUnlocked() {
    try { if (localStorage.getItem(STORAGE_KEY) === "1") return true; } catch (e) {}
    try { if (sessionStorage.getItem(STORAGE_KEY) === "1") return true; } catch (e) {}
    return false;
  }

  function normalizeForFilename(s) {
    return (s || "")
      .toString()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève les accents
      .replace(/[^a-zA-Z0-9]/g, "")                      // enlève espaces/traits d'union/apostrophes
      .toLowerCase();
  }

  const bureauMembers = [
    { nom: "Barre", prenom: "Mickaël", fonction: "Président", photo: "barremickael.jpg" },
    { nom: "Hébert", prenom: "Anita", fonction: "Vice-présidente", photo: "hebertanita.jpg" },
    { nom: "Mahé", prenom: "Jérôme", fonction: "Secrétaire • Webmaster adjoint", photo: "mahejerome.jpg" },
    { nom: "Rossignol", prenom: "André", fonction: "Secrétaire adjoint • Circuits", photo: "rossignolandre.jpg" },
    { nom: "Fix", prenom: "Christophe", fonction: "Trésorier", photo: "fixchristophe.jpg" },
    { nom: "Monsigny", prenom: "Marc", fonction: "Trésorier adjoint • Séjours Club", photo: "monsignymarc.jpg" },
    { nom: "Prod’Homme", prenom: "Gérard", fonction: "Festivités", photo: "prodhommegerard.jpg" },
    { nom: "Fournier", prenom: "Jannick", fonction: "Festivités", photo: "fournierjannick.jpg" },
    { nom: "Frérou", prenom: "Joël", fonction: "Délégué à la sécurité • Circuits • Formations", photo: "freroujoel.jpg" },
    { nom: "Beaupère", prenom: "Alain", fonction: "Logistique", photo: "beauperealain.jpg" },
    { nom: "Gillet", prenom: "François", fonction: "Communication", photo: "gilletfrancois.jpg" }
  ];

  function renderBureau() {
    const bureauGrid = document.getElementById("bureau-grid");
    if (!bureauGrid) return;

    bureauGrid.innerHTML = "";
    bureauMembers.forEach(m => {
      const filename = (m.photo && String(m.photo).trim())
        ? String(m.photo).trim()
        : (normalizeForFilename(m.nom) + normalizeForFilename(m.prenom) + ".jpg");

      const imgSrc = "assets/bureau/img/" + filename;

      const card = document.createElement("article");
      card.className = "card member-card";

      const img = document.createElement("img");
      img.className = "member-photo";
      img.src = imgSrc;
      img.alt = (m.prenom + " " + m.nom).trim();
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => { img.src = "assets/img/BBlogo.jpg"; };

      const meta = document.createElement("div");
      meta.className = "member-meta";

      const h3 = document.createElement("h3");
      h3.textContent = (m.prenom + " " + m.nom).trim();

      const p = document.createElement("p");
      p.className = "member-role";
      p.textContent = m.fonction || "";

      meta.appendChild(h3);
      meta.appendChild(p);

      card.appendChild(img);
      card.appendChild(meta);

      bureauGrid.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (isUnlocked()) renderBureau();
  });

  // Déclenché par private-access.js au moment du déverrouillage
  document.addEventListener("bb:privateUnlocked", () => {
    renderBureau();
  });
})();
