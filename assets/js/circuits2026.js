/* Circuits 2026 – calendrier interactif (s'appuie sur private-access.js) */
(function () {
  "use strict";

  const STORAGE_KEY = "bb_private_access";

  // -----------------------------
  // 1. Données du calendrier 2026
  // -----------------------------
  // Clé = "AAAA-MM-JJ"
  // Valeur = tableau de sorties (mercredi / samedi / dimanche)
  //
  // IMPORTANT : exemples à compléter avec vos données.
  const calendarData = {
    "2026-01-03": [{ jour: "samedi", code: "42A" }],
    "2026-01-04": [{ jour: "dimanche", code: "42A" }],
    "2026-01-07": [{ jour: "mercredi", code: "16A" }],
    "2026-01-10": [{ jour: "samedi", code: "20A" }],
    "2026-01-11": [{ jour: "dimanche", code: "20A" }],
    "2026-01-14": [{ jour: "mercredi", code: "41A" }],
    "2026-01-17": [{ jour: "samedi", code: "06A" }],
    "2026-01-18": [{ jour: "samedi", code: "06A" }]

    // TODO: compléter le reste de l'année
  };

  // -----------------------------
  // 2. Liens OpenRunner par circuit
  // -----------------------------
  const circuitsLinks = {
    "1A": [
      "https://www.openrunner.com/r/18254878",
      "https://www.openrunner.com/r/14507189",
      "https://www.openrunner.com/r/14511770"
    ],
    "2A": [
      "https://www.openrunner.com/r/18079947",
      "https://www.openrunner.com/r/14507203",
      "https://www.openrunner.com/r/14511799"
    ],
    "6A": [
      "https://www.openrunner.com/r/18083269",
      "https://www.openrunner.com/r/14525062",
      "https://www.openrunner.com/r/14529062"
    ],
    "16A": [
      "https://www.openrunner.com/r/18260421",
      "https://www.openrunner.com/r/14525143"
    ],
    "20A": [
      "https://www.openrunner.com/r/14501219",
      "https://www.openrunner.com/r/14509085"
    ],
    "41A": [
      "https://www.openrunner.com/r/14501648",
      "https://www.openrunner.com/r/14509399"
    ],
    "42A": [
      "https://www.openrunner.com/r/15911741",
      "https://www.openrunner.com/r/14525846"
    ]
    // TODO: compléter
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  let currentYear = 2026;
  let currentMonth = 0; // 0 = janvier

  function isUnlocked() {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function initIfUnlocked() {
    if (!isUnlocked()) return;

    const monthTitleEl = byId("month-title");
    const monthSwitcherEl = byId("month-switcher");
    const calendarGridEl = byId("calendar-grid");
    const detailsContent = byId("details-content");

    if (!monthTitleEl || !monthSwitcherEl || !calendarGridEl || !detailsContent) return;

    renderMonthSelector(monthSwitcherEl, () => {
      renderCalendar(monthTitleEl, calendarGridEl, detailsContent, currentYear, currentMonth);
    });

    renderCalendar(monthTitleEl, calendarGridEl, detailsContent, currentYear, currentMonth);
  }

  // Rendu du sélecteur de mois
  function renderMonthSelector(monthSwitcherEl, onChange) {
    monthSwitcherEl.innerHTML = "";
    monthNames.forEach((name, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = name;
      btn.className = "month-btn" + (index === currentMonth ? " active" : "");
      btn.addEventListener("click", () => {
        currentMonth = index;
        document.querySelectorAll(".month-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        onChange();
      });
      monthSwitcherEl.appendChild(btn);
    });
  }

  function renderCalendar(monthTitleEl, calendarGridEl, detailsContent, year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const jsWeekday = firstDay.getDay();     // 0 = dimanche
    const startOffset = (jsWeekday + 6) % 7; // 0 = lundi

    monthTitleEl.textContent = monthNames[month] + " " + year;

    let html = "";

    weekdayLabels.forEach(lbl => {
      html += `<div class="weekday-header">${lbl}</div>`;
    });

    for (let i = 0; i < startOffset; i++) {
      html += `<div class="day-cell empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = toDateKey(year, month + 1, day);
      const entries = calendarData[dateKey] || [];
      const hasRide = entries.length > 0;

      let classes = "day-cell";
      if (hasRide) classes += " has-ride";

      let circuitsBadges = "";
      if (hasRide) {
        entries.forEach(e => {
          let badgeClass = "badge";
          if (e.jour === "mercredi") badgeClass += " badge-wed";
          else if (e.jour === "samedi") badgeClass += " badge-sat";
          else if (e.jour === "dimanche") badgeClass += " badge-sun";

          circuitsBadges += `
            <div class="day-circuits">
              <span class="${badgeClass}">${e.jour.substr(0, 3)}</span>
              Circuit ${e.code}
            </div>`;
        });
      }

      html += `
        <div class="${classes}" data-date="${dateKey}">
          <div class="day-number">${day}</div>
          ${circuitsBadges}
        </div>`;
    }

    calendarGridEl.innerHTML = `<div class="calendar-grid">${html}</div>`;

    calendarGridEl.querySelectorAll(".day-cell.has-ride").forEach(cell => {
      cell.addEventListener("click", () => {
        const dateKey = cell.getAttribute("data-date");
        showDetails(detailsContent, dateKey);
      });
    });

    // reset details when month changes
    detailsContent.classList.add("details-empty");
    detailsContent.textContent = "Cliquez sur un jour avec circuit pour afficher les parcours.";
  }

  function toDateKey(year, month, day) {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function formatDateFr(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }

  function showDetails(detailsContent, dateKey) {
    const entries = calendarData[dateKey];
    if (!entries || entries.length === 0) {
      detailsContent.classList.add("details-empty");
      detailsContent.textContent = "Aucun circuit prévu ce jour.";
      return;
    }

    let html = `<div class="details-meta">${formatDateFr(dateKey)}</div>`;

    entries.forEach(e => {
      const base = normalizeBase(e.code);
      const variantSuffix = getVariantSuffix(e.code);

      html += `<h4>${capitalize(e.jour)} – circuit ${base}${variantSuffix}</h4>`;

      const links = circuitsLinks[base];
      if (!links) {
        html += `<p>Détail du circuit à compléter.</p>`;
        return;
      }

      html += "<ol>";
      links.forEach((url, idx) => {
        const label = idx === 0 ? "Circuit 1(long)" : idx === 1 ? "Circuit 2(inter)" : "Circuit 3(court)";
        html += "<li>" + label;
        if (url) {
          html += ` – <a href="${url}" target="_blank" rel="noopener">Trace OpenRunner</a>`;
        } else {
          html += " – lien à compléter";
        }
        html += "</li>";
      });
      html += "</ol>";
    });

    html += `
      <div class="details-footer">
        Détails (PDF) :
        <a href="assets/pdf/circuitsA.pdf" target="_blank" rel="noopener">Circuits A</a>
        et
        <a href="assets/pdf/circuitsB.pdf" target="_blank" rel="noopener">Circuits B</a>.
      </div>
    `;

    detailsContent.classList.remove("details-empty");
    detailsContent.innerHTML = html;
  }

  function capitalize(s) {
    return s ? (s.charAt(0).toUpperCase() + s.slice(1)) : s;
  }

  function normalizeBase(code) {
    // ex : 01A, 01AC2, 80AC3 -> 1A, 1A, 80A
    const match = String(code || "").match(/^0*(\d{1,2}A)(C[23])?$/);
    if (!match) return code;
    return match[1];
  }

  function getVariantSuffix(code) {
    const match = String(code || "").match(/C([23])$/);
    if (!match) return "";
    return " (variante C" + match[1] + ")";
  }

  // Init once unlocked (directly or after event)
  document.addEventListener("DOMContentLoaded", initIfUnlocked);
  document.addEventListener("bb:privateUnlocked", initIfUnlocked);
})();
