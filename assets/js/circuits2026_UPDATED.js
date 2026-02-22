/* Circuits 2026 – calendrier interactif (s'appuie sur private-access.js)
   Données issues du planning annuel 2026 (version du 26/12/2025). */
(function () {
  "use strict";

  const STORAGE_KEY = "bb_private_access";
  const YEAR = 2026;

  // ---------------------------------------------------------
  // 1) Planning hebdomadaire (compact) -> génération calendrier
  // ---------------------------------------------------------
  // Format : [lundi(ISO), code_mercredi, code_samedi, code_dimanche]
  // Remarque : la semaine 1 commence le 2025-12-29 ; seules les dates 2026 sont affichées.
  const weekPlan = [
  ["2025-12-29", "10A", "42A", "42A"],
  ["2026-01-05", "16A", "20A", "20A"],
  ["2026-01-12", "41A", "06A", "06A"],
  ["2026-01-19", "05A", "02A", "02AC2"],
  ["2026-01-26", "04A", "01A", "01AC2"],
  ["2026-02-02", "59A", "03A", "03AC2"],
  ["2026-02-09", "08A", "31A", "31AC2"],
  ["2026-02-16", "12A", "34A", "34AC2"],
  ["2026-02-23", "23A", "32A", "32AC2"],
  ["2026-03-02", "39A", "21A", "39AC2"],
  ["2026-03-09", "28A", "45A", "45AC3"],
  ["2026-03-16", "30A", "37A", "30AC2"],
  ["2026-03-23", "80AC2", "24A", "30AC2"],
  ["2026-03-30", "33A", "21A", "21AC2"],
  ["2026-04-06", "36A", "27A", "27AC2"],
  ["2026-04-13", "44A", "26A", "26AC2"],
  ["2026-04-20", "83AC2", "25A", "25AC2"],
  ["2026-04-27", "58A", "52A", "52AC2"],
  ["2026-05-04", "55A", "53A", "55AC2"],
  ["2026-05-11", "47A", "82A", "47AC2"],
  ["2026-05-18", "82A", "84A", "84AC3"],
  ["2026-05-25", "89A", "83A", "89AC2"],
  ["2026-06-01", "85A", "88A", "88AC3"],
  ["2026-06-08", "86A", "79A", "79AC3"],
  ["2026-06-15", "53A", "87A", "53AC3"],
  ["2026-06-22", "82A", "48A", "48AC2"],
  ["2026-06-29", "88A", "80A", "80AC2"],
  ["2026-07-06", "86A", "89A", "89AC2"],
  ["2026-07-13", "50A", "84A", "50AC2"],
  ["2026-07-20", "85A", "79A", "85AC3"],
  ["2026-07-27", "81A", "83A", "81AC3"],
  ["2026-08-03", "88A", "76A", "76AC2"],
  ["2026-08-10", "55A", "80A", "80AC2"],
  ["2026-08-17", "48A", "87A", "48AC2"],
  ["2026-08-24", "82A", "83A", "82AC3"],
  ["2026-08-31", "84A", "81A", "81AC3"],
  ["2026-09-07", "53A", "47A", "53AC2"],
  ["2026-09-14", "83A", "77A", "83AC3"],
  ["2026-09-21", "50A", "51A", "51AC2"],
  ["2026-09-28", "56A", "57A", "57AC2"],
  ["2026-10-05", "25A", "36A", "36AC2"],
  ["2026-10-12", "39A", "45A", "39AC2"],
  ["2026-10-19", "39A", "32A", "32AC2"],
  ["2026-10-26", "34A", "38A", "38AC2"],
  ["2026-11-02", "31A", "08A", "08AC2"],
  ["2026-11-09", "03A", "43A", "43AC2"],
  ["2026-11-16", "07A", "13A", "07AC2"],
  ["2026-11-23", "02A", "59A", "59AC2"],
  ["2026-11-30", "43A", "05A", "05AC2"],
  ["2026-12-07", "19A", "13A", "19A"],
  ["2026-12-14", "14A", "17A", "14A"],
  ["2026-12-21", "21AC2", "11A", "11B"]
];

  function buildCalendarData(year) {
    const out = {};

    function addFromWeek(mondayIso, offsetDays, jour, code) {
      const monday = new Date(mondayIso + "T00:00:00");
      const d = new Date(monday);
      d.setDate(d.getDate() + offsetDays);
      if (d.getFullYear() !== year) return;

      const key = toDateKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
      const adjusted = normalizeCodeForYear(code, year);

      (out[key] ||= []).push({ jour, code: adjusted });
    }

    weekPlan.forEach(([mondayIso, wedCode, satCode, sunCode]) => {
      addFromWeek(mondayIso, 2, "mercredi", wedCode);
      addFromWeek(mondayIso, 5, "samedi", satCode);
      addFromWeek(mondayIso, 6, "dimanche", sunCode);
    });

    return out;
  }

  // Clé = "AAAA-MM-JJ" ; Valeur = tableau de sorties (mercredi / samedi / dimanche)
  const calendarData = buildCalendarData(YEAR);

  // -----------------------------------------
  // 2) Liens OpenRunner – Circuits A (2026)
  // -----------------------------------------
  // Clé = "1A", "2A", ... ; Valeur = [C1(long), C2(inter), C3(court)]
  const circuitsLinks = {
  "1A": ["https://www.openrunner.com/r/18254878", "https://www.openrunner.com/r/14507189", "https://www.openrunner.com/r/14511770"],
  "2A": ["https://www.openrunner.com/r/18079947", "https://www.openrunner.com/r/14507203", "https://www.openrunner.com/r/14511799"],
  "3A": ["https://www.openrunner.com/r/18085748", "https://www.openrunner.com/r/14508380", "https://www.openrunner.com/r/14513501"],
  "4A": ["https://www.openrunner.com/r/15922226", "https://www.openrunner.com/r/14508391", "https://www.openrunner.com/r/14513507"],
  "5A": ["https://www.openrunner.com/r/18254902", "https://www.openrunner.com/r/14508394", "https://www.openrunner.com/r/14513511"],
  "6A": ["https://www.openrunner.com/r/18081680", "https://www.openrunner.com/r/14508401", "https://www.openrunner.com/r/14513514"],
  "7A": ["https://www.openrunner.com/r/18254849", "https://www.openrunner.com/r/14508404", "https://www.openrunner.com/r/14513520"],
  "8A": ["https://www.openrunner.com/r/18254930", "https://www.openrunner.com/r/14508408", "https://www.openrunner.com/r/14513524"],
  "9A": ["https://www.openrunner.com/r/18123218", "https://www.openrunner.com/r/14508414", "https://www.openrunner.com/r/14513529"],
  "10A": ["https://www.openrunner.com/r/18254820", "https://www.openrunner.com/r/14508420", "https://www.openrunner.com/r/14513533"],
  "11A": ["https://www.openrunner.com/r/15911873", "https://www.openrunner.com/r/14508426", null],
  "12A": ["https://www.openrunner.com/r/18260547", "https://www.openrunner.com/r/14508429", "https://www.openrunner.com/r/14513538"],
  "13A": ["https://www.openrunner.com/r/18260691", "https://www.openrunner.com/r/14508434", "https://www.openrunner.com/r/14513548"],
  "14A": ["https://www.openrunner.com/r/15912010", "https://www.openrunner.com/r/14508441", null],
  "15A": ["https://www.openrunner.com/r/18254905", "https://www.openrunner.com/r/14508445", null],
  "16A": ["https://www.openrunner.com/r/18260410", "https://www.openrunner.com/r/14508451", null],
  "17A": ["https://www.openrunner.com/r/18260309", "https://www.openrunner.com/r/14508465", "https://www.openrunner.com/r/14513555"],
  "18A": ["https://www.openrunner.com/r/14501199", "https://www.openrunner.com/r/14508469", "https://www.openrunner.com/r/14513561"],
  "19A": ["https://www.openrunner.com/r/14501208", "https://www.openrunner.com/r/14509074", null],
  "20A": ["https://www.openrunner.com/r/14501219", "https://www.openrunner.com/r/14509085", null],
  "21A": ["https://www.openrunner.com/r/18180677", "https://www.openrunner.com/r/14509113", "https://www.openrunner.com/r/14513585"],
  "22A": ["https://www.openrunner.com/r/18109317", "https://www.openrunner.com/r/14509099", "https://www.openrunner.com/r/14513592"],
  "23A": ["https://www.openrunner.com/r/18176242", "https://www.openrunner.com/r/14509126", "https://www.openrunner.com/r/14513599"],
  "24A": ["https://www.openrunner.com/r/18176204", "https://www.openrunner.com/r/14509145", "https://www.openrunner.com/r/14513606"],
  "25A": ["https://www.openrunner.com/r/18174591", "https://www.openrunner.com/r/14509152", "https://www.openrunner.com/r/14513608"],
  "26A": ["https://www.openrunner.com/r/18174471", "https://www.openrunner.com/r/14509162", "https://www.openrunner.com/r/14513610"],
  "27A": ["https://www.openrunner.com/r/18092759", "https://www.openrunner.com/r/14509172", "https://www.openrunner.com/r/14513618"],
  "28A": ["https://www.openrunner.com/r/18092506", "https://www.openrunner.com/r/14509179", "https://www.openrunner.com/r/14513625"],
  "29A": ["https://www.openrunner.com/r/18113506", "https://www.openrunner.com/r/14509190", "https://www.openrunner.com/r/14513632"],
  "30A": ["https://www.openrunner.com/r/18133354", "https://www.openrunner.com/r/14509200", "https://www.openrunner.com/r/14513636"],
  "31A": ["https://www.openrunner.com/r/18171990", "https://www.openrunner.com/r/14509213", "https://www.openrunner.com/r/14513656"],
  "32A": ["https://www.openrunner.com/r/14501474", "https://www.openrunner.com/r/14509219", "https://www.openrunner.com/r/14513661"],
  "33A": ["https://www.openrunner.com/r/14501486", "https://www.openrunner.com/r/14509227", "https://www.openrunner.com/r/14513668"],
  "34A": ["https://www.openrunner.com/r/14501500", "https://www.openrunner.com/r/14509240", "https://www.openrunner.com/r/14513671"],
  "35A": ["https://www.openrunner.com/r/18171931", "https://www.openrunner.com/r/14509248", "https://www.openrunner.com/r/14513676"],
  "36A": ["https://www.openrunner.com/r/18170129", "https://www.openrunner.com/r/14509350", "https://www.openrunner.com/r/14513679"],
  "37A": ["https://www.openrunner.com/r/18167805", "https://www.openrunner.com/r/14509365", "https://www.openrunner.com/r/14513685"],
  "38A": ["https://www.openrunner.com/r/14501636", "https://www.openrunner.com/r/14509373", "https://www.openrunner.com/r/14513691"],
  "39A": ["https://www.openrunner.com/r/14501637", "https://www.openrunner.com/r/14509383", "https://www.openrunner.com/r/14513695"],
  "40A": ["https://www.openrunner.com/r/14501641", "https://www.openrunner.com/r/14509390", "https://www.openrunner.com/r/14513704"],
  "41A": ["https://www.openrunner.com/r/14501648", "https://www.openrunner.com/r/14509399", null],
  "42A": ["https://www.openrunner.com/r/14503356", "https://www.openrunner.com/r/14511395", null],
  "43A": ["https://www.openrunner.com/r/14503360", "https://www.openrunner.com/r/14511407", "https://www.openrunner.com/r/14513712"],
  "44A": ["https://www.openrunner.com/r/15529517", "https://www.openrunner.com/r/15779838", "https://www.openrunner.com/r/15780486"],
  "45A": ["https://www.openrunner.com/r/15485610", "https://www.openrunner.com/r/15786940", "https://www.openrunner.com/r/15786970"],
  "46A": ["https://www.openrunner.com/r/18166026", "https://www.openrunner.com/r/14511414", "https://www.openrunner.com/r/14513729"],
  "47A": ["https://www.openrunner.com/r/18163343", "https://www.openrunner.com/r/14511420", "https://www.openrunner.com/r/14513737"],
  "48A": ["https://www.openrunner.com/r/18100414", "https://www.openrunner.com/r/14511430", "https://www.openrunner.com/r/14513743"],
  "49A": ["https://www.openrunner.com/r/18163251", "https://www.openrunner.com/r/14511438", "https://www.openrunner.com/r/14513750"],
  "50A": ["https://www.openrunner.com/r/18161961", "https://www.openrunner.com/r/14511449", "https://www.openrunner.com/r/14513758"],
  "51A": ["https://www.openrunner.com/r/14503433", "https://www.openrunner.com/r/14511459", "https://www.openrunner.com/r/14516249"],
  "52A": ["https://www.openrunner.com/r/18154891", "https://www.openrunner.com/r/14511469", "https://www.openrunner.com/r/14516255"],
  "53A": ["https://www.openrunner.com/r/18154810", "https://www.openrunner.com/r/14511477", "https://www.openrunner.com/r/14516262"],
  "54A": ["https://www.openrunner.com/r/17348306", "https://www.openrunner.com/r/14511483", "https://www.openrunner.com/r/14516271"],
  "55A": ["https://www.openrunner.com/r/18099302", "https://www.openrunner.com/r/14511493", "https://www.openrunner.com/r/14516288"],
  "56A": ["https://www.openrunner.com/r/18153145", "https://www.openrunner.com/r/14511504", "https://www.openrunner.com/r/14516297"],
  "57A": ["https://www.openrunner.com/r/14503506", "https://www.openrunner.com/r/14511523", "https://www.openrunner.com/r/14516301"],
  "58A": ["https://www.openrunner.com/r/14503510", "https://www.openrunner.com/r/14511547", "https://www.openrunner.com/r/14516315"],
  "59A": ["https://www.openrunner.com/r/16484949", "https://www.openrunner.com/r/16485139", "https://www.openrunner.com/r/16485240"],
  "76A": ["https://www.openrunner.com/r/18120477", "https://www.openrunner.com/r/14511565", "https://www.openrunner.com/r/14516324"],
  "77A": ["https://www.openrunner.com/r/18152922", "https://www.openrunner.com/r/14511586", "https://www.openrunner.com/r/14516329"],
  "78A": ["https://www.openrunner.com/r/15143034", "https://www.openrunner.com/r/14511576", "https://www.openrunner.com/r/14516341"],
  "79A": ["https://www.openrunner.com/r/14503584", "https://www.openrunner.com/r/14511609", "https://www.openrunner.com/r/14516350"],
  "80A": ["https://www.openrunner.com/r/18152830", "https://www.openrunner.com/r/14511656", "https://www.openrunner.com/r/14516358"],
  "81A": ["https://www.openrunner.com/r/18150915", "https://www.openrunner.com/r/14511667", "https://www.openrunner.com/r/14516367"],
  "82A": ["https://www.openrunner.com/r/18150812", "https://www.openrunner.com/r/14511684", "https://www.openrunner.com/r/14516373"],
  "83A": ["https://www.openrunner.com/r/18097307", "https://www.openrunner.com/r/14511699", "https://www.openrunner.com/r/14516375"],
  "84A": ["https://www.openrunner.com/r/18146212", "https://www.openrunner.com/r/14511703", "https://www.openrunner.com/r/14516382"],
  "85A": ["https://www.openrunner.com/r/18141814", "https://www.openrunner.com/r/14511710", "https://www.openrunner.com/r/14516394"],
  "86A": ["https://www.openrunner.com/r/18137365", "https://www.openrunner.com/r/14511720", "https://www.openrunner.com/r/14516411"],
  "87A": ["https://www.openrunner.com/r/18103449", "https://www.openrunner.com/r/18106247", "https://www.openrunner.com/r/18106336"],
  "88A": ["https://www.openrunner.com/r/18102202", "https://www.openrunner.com/r/14511734", "https://www.openrunner.com/r/14516430"],
  "89A": ["https://www.openrunner.com/r/18134326", "https://www.openrunner.com/r/14511743", "https://www.openrunner.com/r/14516439"]
};

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  let currentYear = YEAR;
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
        const label = idx === 0 ? "Circuit 1 (long)" : idx === 1 ? "Circuit 2 (inter)" : "Circuit 3 (court)";
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
    const match = String(code || "").match(/^0*(\d{1,2})([AB])(C[23])?$/i);
    if (!match) return code;
    return String(parseInt(match[1], 10)) + match[2].toUpperCase();
  }

  function getVariantSuffix(code) {
    const match = String(code || "").match(/C([23])$/i);
    if (!match) return "";
    return " (variante C" + match[1] + ")";
  }

  function normalizeCodeForYear(code, year) {
    // Règle club : années paires => circuits A ; années impaires => circuits B.
    // Ici, on applique juste une correction minimale (ex: 11B le 27/12/2026 -> 11A).
    const m = String(code || "").match(/^0*(\d{1,2})([AB])(C[23])?$/i);
    if (!m) return code;

    const num = String(parseInt(m[1], 10));
    let letter = m[2].toUpperCase();
    const variant = m[3] ? m[3].toUpperCase() : "";

    if (year % 2 === 0 && letter === "B") letter = "A";
    if (year % 2 === 1 && letter === "A") letter = "B";

    return num + letter + variant;
  }

  // Init once unlocked (directly or after event)
  document.addEventListener("DOMContentLoaded", initIfUnlocked);
  document.addEventListener("bb:privateUnlocked", initIfUnlocked);
})();
