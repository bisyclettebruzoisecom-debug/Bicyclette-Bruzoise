/* Circuits 2026 – calendrier interactif (s'appuie sur private-access.js)
   Données issues du planning annuel 2026 (version du 26/12/2025). */
(function () {
  "use strict";

  const STORAGE_KEY = "bb_private_access";
  const YEAR = 2026;
  const FIRST_YEAR = 2026;
  // Pas de limite supérieure : alternance A/B automatique.
  const LAST_YEAR = 2027;
  const LAST_MONTH = 11; // Décembre (mois indexé à partir de 0)

  // ---------------------------------------------------------
  // 1) Planning hebdomadaire (compact) -> génération calendrier
  // ---------------------------------------------------------
  // Format : [semaine ISO (S1A, S1B...), code_mercredi, code_samedi, code_dimanche]
  // La semaine S1A de 2026 commence le 29 décembre 2025 (norme ISO 8601).
  const weekPlanA = [
    ["S1A", "10A", "42A", "42A"],
    ["S2A", "16A", "20A", "20A"],
    ["S3A", "41A", "06A", "06A"],
    ["S4A", "05A", "02A", "02AC2"],
    ["S5A", "04A", "01A", "01AC2"],
    ["S6A", "59A", "03A", "03AC2"],
    ["S7A", "08A", "31A", "31AC2"],
    ["S8A", "12A", "34A", "34AC2"],
    ["S9A", "23A", "32A", "32AC2"],
    ["S10A", "39A", "21A", "39AC2"],
    ["S11A", "28A", "45A", "45AC3"],
    ["S12A", "30A", "37A", "30AC2"],
    ["S13A", "80AC2", "24A", "30AC2"],
    ["S14A", "33A", "21A", "21AC2"],
    ["S15A", "36A", "27A", "27AC2"],
    ["S16A", "44A", "26A", "26AC2"],
    ["S17A", "83AC2", "25A", "25AC2"],
    ["S18A", "58A", "52A", "52AC2"],
    ["S19A", "55A", "53A", "55AC2"],
    ["S20A", "47A", "82A", "47AC2"],
    ["S21A", "82A", "84A", "84AC3"],
    ["S22A", "89A", "83A", "89AC2"],
    ["S23A", "85A", "88A", "88AC3"],
    ["S24A", "86A", "79A", "79AC3"],
    ["S25A", "53A", "87A", "53AC3"],
    ["S26A", "82A", "48A", "48AC2"],
    ["S27A", "88A", "80A", "80AC2"],
    ["S28A", "86A", "89A", "89AC2"],
    ["S29A", "50A", "84A", "50AC2"],
    ["S30A", "85A", "79A", "85AC3"],
    ["S31A", "81A", "83A", "81AC3"],
    ["S32A", "88A", "76A", "76AC2"],
    ["S33A", "55A", "80A", "80AC2"],
    ["S34A", "48A", "87A", "48AC2"],
    ["S35A", "82A", "83A", "82AC3"],
    ["S36A", "84A", "81A", "81AC3"],
    ["S37A", "53A", "47A", "53AC2"],
    ["S38A", "83A", "77A", "83AC3"],
    ["S39A", "50A", "51A", "51AC2"],
    ["S40A", "56A", "57A", "57AC2"],
    ["S41A", "25A", "36A", "36AC2"],
    ["S42A", "39A", "45A", "39AC2"],
    ["S43A", "33A", "32A", "32AC2"],
    ["S44A", "34A", "38A", "38AC2"],
    ["S45A", "31A", "08A", "08AC2"],
    ["S46A", "03A", "43A", "43AC2"],
    ["S47A", "07A", "13A", "07AC2"],
    ["S48A", "02A", "59A", "59AC2"],
    ["S49A", "43A", "05A", "05AC2"],
    ["S50A", "19A", "13A", "19A"],
    ["S51A", "14A", "17A", "14A"],
    ["S52A", "21AC2", "11A", "11B"],
    ["S53A", "15A", "05AC2", "05BC2"]
  ];

  // Programme 2027 : source Excel du 13 octobre 2026, conservé indépendamment de 2026.
  const weekPlanB = [
    ["S1B", "10B", "20B", "17B"],
    ["S2B", "16B", "42B", "20B"],
    ["S3B", "41B", "06B", "02BC2"],
    ["S4B", "04B", "02B", "01BC2"],
    ["S5B", "59B", "01B", "06B"],
    ["S6B", "05B", "03B", "03B"],
    ["S7B", "09B", "31B", "31B"],
    ["S8B", "12B", "34B", "34BC2"],
    ["S9B", "33B", "32B", "14B"],
    ["S10B", "39B", "21B", "39BC2"],
    ["S11B", "45B", "45B", "46BC2"],
    ["S12B", "27B", "37B", "27BC2"],
    ["S13B", "36B", "24B", "30BC2"],
    ["S14B", "47B", "21B", "22BC2"],
    ["S15B", "22B", "26B", "23BC2"],
    ["S16B", "29B", "26B", "27BC2"],
    ["S17B", "55B", "25B", "25BC2"],
    ["S18B", "49B", "52B", "18BC2"],
    ["S19B", "58B", "53B", "55BC3"],
    ["S20B", "53B", "82B", "82BC3"],
    ["S21B", "77B", "84B", "84BC3"],
    ["S22B", "88B", "83B", "51BC2"],
    ["S23B", "85B", "81B", "88BC3"],
    ["S24B", "86B", "79B", "79BC3"],
    ["S25B", "53B", "48B", "19B"],
    ["S26B", "82B", "87B", "48BC2"],
    ["S27B", "88B", "80B", "80BC2"],
    ["S28B", "86B", "89B", "89BC2"],
    ["S29B", "77B", "84B", "50BC2"],
    ["S30B", "76B", "79B", "85BC3"],
    ["S31B", "81B", "83B", "81BC3"],
    ["S32B", "88B", "89B", "76BC2"],
    ["S33B", "80B", "80B", "80BC2"],
    ["S34B", "48B", "87B", "48BC2"],
    ["S35B", "82B", "83B", "83BC3"],
    ["S36B", "84B", "81B", "81BC3"],
    ["S37B", "53B", "77B", "53BC2"],
    ["S38B", "85B", "51B", "83BC3"],
    ["S39B", "81B", "47B", "51BC2"],
    ["S40B", "56B", "36B", "59BC2"],
    ["S41B", "22B", "57B", "36BC2"],
    ["S42B", "39B", "45B", "39BC2"],
    ["S43B", "37B", "32B", "32BC2"],
    ["S44B", "34B", "43B", "38BC2"],
    ["S45B", "31B", "38B", "08BC2"],
    ["S46B", "03B", "19B", "43BC2"],
    ["S47B", "07B", "59B", "07BC2"],
    ["S48B", "02B", "13B", "59BC2"],
    ["S49B", "14B", "05B", "05BC2"],
    ["S50B", "10B", "13B", "19B"],
    ["S51B", "16B", "06B", "14B"],
    ["S52B", "15B", "05BC2", "11B"],
    ["S53B", "21BC2", "11B", "01BC2"]
  ];

  // Données partagées avec calendrierBB.html (sans modifier le calendrier interactif).
  window.BB_WEEK_PLANS = { A: weekPlanA, B: weekPlanB };
  // Source unique pour les pages qui réutilisent le planning (ex. calendrierBB.html) :
  // même règle de parité A/B que le calendrier interactif, en conservant le zéro initial (05BC2 -> 05AC2).
  window.BB_normalizePlanCode = function (code, year) {
    const m = String(code || "").match(/^(0*)(\d{1,2})([AB])(C[23])?$/i);
    if (!m) return code;
    let letter = m[3].toUpperCase();
    if (year % 2 === 0) letter = "A"; else letter = "B";
    return m[1] + m[2] + letter + (m[4] ? m[4].toUpperCase() : "");
  };

  // Numérotation ISO 8601 : lundi = début de semaine ; semaine 1 contient le 4 janvier.
  // La lettre A/B dépend de l'année ISO de la semaine, y compris aux frontières d'année.
  function isoWeekInfo(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const isoYear = d.getUTCFullYear();
    const jan1 = new Date(Date.UTC(isoYear, 0, 1));
    const week = Math.ceil((((d - jan1) / 86400000) + 1) / 7);
    return { year: isoYear, week, letter: isoYear % 2 === 0 ? "A" : "B",
      label: `S${week}${isoYear % 2 === 0 ? "A" : "B"}` };
  }

  // Indexation explicite des modèles par numéro de semaine ISO.
  // 2026 contient 53 semaines ISO ; 2027 en contient 52.
  const weeklyTemplates = Object.fromEntries(
    [...weekPlanA, ...weekPlanB].map(row => [row[0], row.slice(1)])
  );
  function getWeeklyCircuits(info) {
    const row = weeklyTemplates[info.label];
    // Une 53e semaine sans modèle reste non programmée : aucun circuit inventé.
    return row || null;
  }

  function buildCalendarData(year) {
    const out = {};
    for (let d = new Date(year, 0, 1, 12); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      const slot = day === 3 ? 0 : day === 6 ? 1 : day === 0 ? 2 : -1;
      if (slot < 0) continue;
      const info = isoWeekInfo(d);
      const codes = getWeeklyCircuits(info);
      if (!codes || !codes[slot]) continue;
      const key = toDateKey(year, d.getMonth() + 1, d.getDate());
      out[key] = [{ jour: ["mercredi", "samedi", "dimanche"][slot],
        code: normalizeCodeForYear(codes[slot], info.year), semaine: info.label }];
    }
    return out;
  }

  const calendarsByYear = {};
  function getCalendarForYear(year) {
    return calendarsByYear[year] ||= buildCalendarData(year);
  }
  let calendarData = getCalendarForYear(new Date().getFullYear());

  // -----------------------------------------
  // 2) Liens OpenRunner – Circuits A (2026)
  // -----------------------------------------
  // Clé = "1A", "2A", ... ; Valeur = [C1(long), C2(inter), C3(court)]
  // -----------------------------------------
  // 3) Activités du mois (colonne G du planning annuel)
  // -----------------------------------------
  // Clé = numéro de mois (1=janvier … 12=décembre)
  // Les activités sont définies dans assets/js/monthActivities.js.



  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const __now = new Date();
  let currentYear = Math.min(LAST_YEAR, Math.max(FIRST_YEAR, __now.getFullYear()));
  let currentMonth = __now.getFullYear() < FIRST_YEAR ? 0 : __now.getFullYear() > LAST_YEAR ? LAST_MONTH : __now.getMonth();
  let windowStart = new Date(currentYear, currentMonth, 1);
  calendarData = getCalendarForYear(currentYear);

  let didAutoOpenToday = false;
  let selectedDateKey = null;

  function isUnlocked() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return true;
    } catch (e) { }
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
    } catch (e) { }
    return false;
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
    const yearSwitcher = byId("year-switcher");
    if (yearSwitcher) yearSwitcher.remove();
    renderMonthSelector(monthSwitcherEl);
    renderCalendar(monthTitleEl, calendarGridEl, detailsContent,
      currentYear, currentMonth, getTodayKey(), didAutoOpenToday ? null : getTodayKey());
    didAutoOpenToday = true;
  }

  function selectMonth(year, month, returnToday = false) {
    const target = new Date(year, month, 1);
    year = target.getFullYear();
    month = target.getMonth();
    if (year < FIRST_YEAR || year > LAST_YEAR) return;
    currentYear = year;
    currentMonth = month;
    windowStart = new Date(year, month, 1);
    calendarData = getCalendarForYear(year);
    selectedDateKey = null;
    renderMonthSelector(byId("month-switcher"));
    renderCalendar(byId("month-title"), byId("calendar-grid"),
      byId("details-content"), year, month, getTodayKey(), returnToday ? getTodayKey() : null);
  }

  function renderMonthSelector(container) {
    if (!container) return;
    container.innerHTML = "";
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "month-btn bb-month-arrow";
    prev.textContent = "‹";
    prev.title = "Mois précédent";
    prev.setAttribute("aria-label", "Mois précédent");
    prev.disabled = currentYear === FIRST_YEAR && currentMonth === 0;
    prev.addEventListener("click", () => selectMonth(currentYear, currentMonth - 1));

    const today = document.createElement("button");
    today.type = "button";
    today.className = "month-btn month-today";
    today.textContent = "Aujourd’hui";
    today.title = "Revenir au mois actuel";
    today.addEventListener("click", () => {
      const now = new Date();
      const year = Math.min(LAST_YEAR, Math.max(FIRST_YEAR, now.getFullYear()));
      const month = now.getFullYear() < FIRST_YEAR ? 0 : now.getFullYear() > LAST_YEAR ? LAST_MONTH : now.getMonth();
      selectMonth(year, month, true);
    });
    container.appendChild(today);
    container.appendChild(prev);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "month-btn bb-month-arrow";
    next.textContent = "›";
    next.title = "Mois suivant";
    next.setAttribute("aria-label", "Mois suivant");
    next.disabled = currentYear === LAST_YEAR && currentMonth === LAST_MONTH;
    next.addEventListener("click", () => selectMonth(currentYear, currentMonth + 1));
    container.appendChild(next);
  }

  function renderCalendar(monthTitleEl, calendarGridEl, detailsContent, year, month, highlightDateKey, autoOpenDateKey) {
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

    // Afficher des semaines entières, du lundi au dimanche, y compris
    // les dates des mois voisins. La grille comporte 5 ou 6 lignes selon le mois.
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    for (let i = 0; i < totalCells; i++) {
      const date = new Date(year, month, 1 - startOffset + i, 12);
      const cellYear = date.getFullYear();
      const cellMonth = date.getMonth();
      const day = date.getDate();
      const dateKey = toDateKey(cellYear, cellMonth + 1, day);
      const inCurrentMonth = cellMonth === month && cellYear === year;
      const inSupportedYears = cellYear >= FIRST_YEAR && cellYear <= LAST_YEAR;
      const entries = inSupportedYears ? (getCalendarForYear(cellYear)[dateKey] || []) : [];
      const hasRide = entries.length > 0;

      let classes = "day-cell";
      if (!inCurrentMonth) classes += " is-adjacent-month";
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

    calendarGridEl.innerHTML = `<div class="calendar-grid" style="grid-template-columns: repeat(7,minmax(0,1fr));">${html}</div>`;

    // Mise en évidence du jour courant (si présent dans le mois affiché)
    if (highlightDateKey) {
      const todayCell = calendarGridEl.querySelector(`.day-cell[data-date="${highlightDateKey}"]`);
      if (todayCell) todayCell.classList.add("is-today");
    }

    // Mise en évidence du jour sélectionné
    if (selectedDateKey) {
      const selectedCell = calendarGridEl.querySelector(`.day-cell[data-date="${selectedDateKey}"]`);
      if (selectedCell) selectedCell.classList.add("is-selected");
    }

    // Clic : afficher le détail + mémoriser la sélection
    calendarGridEl.querySelectorAll(".day-cell.has-ride").forEach(cell => {
      cell.addEventListener("click", () => {
        const dateKey = cell.getAttribute("data-date");

        calendarGridEl.querySelectorAll(".day-cell.is-selected").forEach(c => {
          c.classList.remove("is-selected");
        });

        cell.classList.add("is-selected");
        selectedDateKey = dateKey;

        showDetails(detailsContent, dateKey);

        // Faire défiler jusqu'au panneau "Détail du circuit"
        detailsContent.closest(".details-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    // Panneau de détails : par défaut, message d’aide ; si demandé, ouvrir sur une date
    if (autoOpenDateKey) {
      selectedDateKey = autoOpenDateKey;
      const autoCell = calendarGridEl.querySelector(`.day-cell[data-date="${autoOpenDateKey}"]`);
      if (autoCell) autoCell.classList.add("is-selected");
      showDetails(detailsContent, autoOpenDateKey);
    } else {
      detailsContent.classList.add("details-empty");
      detailsContent.textContent = "Cliquez sur un jour avec circuit pour afficher les parcours.";
    }

    // Toujours rafraîchir les activités du mois, quel que soit le chemin emprunté
    renderMonthActivities(month);
  }

  function toDateKey(year, month, day) {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function getTodayKey() {
    const now = new Date();
    if (now.getFullYear() !== currentYear) return null;
    return toDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }


  function formatDateFr(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }

  function showDetails(detailsContent, dateKey) {
    const dateYear = Number(dateKey.slice(0, 4));
    const entries = getCalendarForYear(dateYear)[dateKey];
    if (!entries || entries.length === 0) {
      detailsContent.classList.add("details-empty");
      detailsContent.textContent = "Aucun circuit prévu ce jour.";
      return;
    }
    const circuits = window.BB_CIRCUITS || {};
    let html = `<div class="details-meta">${formatDateFr(dateKey)}</div>`;
    entries.forEach(e => {
      const base = normalizeBase(e.code);
      html += `<h4>${capitalize(e.jour)} – circuit ${escapeHtml(base)}</h4>`;
      // Le dimanche, respecter uniquement la variante inscrite au planning.
      // Mercredi et samedi : proposer les trois variantes C1, C2 et C3.
      const variants = e.jour === "dimanche"
        ? [[(String(e.code).match(/C[23]$/i) || [""])[0].toUpperCase(),
            /C2$/i.test(e.code) ? "C2" : /C3$/i.test(e.code) ? "C3 (court)" : "C1 (long)"]]
        : [["", "C1 (long)"], ["C2", "C2"], ["C3", "C3 (court)"]];
      for (const [suffix, label] of variants) {
        const code = base + suffix;
        const circuit = circuits[code];
        const url = circuit?.openrunner;
        html += `<div class="bb-variant-row"><strong>${label}</strong>`;
        html += url
          ? `<a class="bb-openrunner-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir le circuit ${escapeHtml(code)} sur OpenRunner" title="Ouvrir sur OpenRunner"><img src="assets/img/openrunner-logo.png" alt="OPENRUNNER"></a>`
          : `<span class="bb-variant-missing">Lien indisponible</span>`;
        html += circuit
          ? `<button type="button" class="month-btn bb-detail-btn" data-circuit="${escapeHtml(code)}">Détail</button>`
          : `<button type="button" class="month-btn" disabled>Détail</button>`;
        html += `</div>`;
      }
    });
    detailsContent.classList.remove("details-empty");
    detailsContent.innerHTML = html;
    detailsContent.querySelectorAll(".bb-detail-btn").forEach(btn => {
      btn.addEventListener("click", () => showCircuitDialog(btn.dataset.circuit));
    });
  }

  function showCircuitDialog(code) {
    const circuit = (window.BB_CIRCUITS || {})[code];
    if (!circuit) return;
    let dialog = document.getElementById("bb-circuit-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "bb-circuit-dialog";
      dialog.className = "bb-circuit-dialog";
      document.body.appendChild(dialog);
      dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
      });
    }
    const name = code.endsWith("C2") ? "C2" : code.endsWith("C3") ? "C3 (court)" : "C1 (long)";
    dialog.innerHTML = `<div class="bb-dialog-head"><h3>Circuit ${escapeHtml(code)} — ${name}</h3><button type="button" class="month-btn bb-dialog-close" aria-label="Fermer">✕</button></div>` +
      `<p><strong>Direction :</strong> ${escapeHtml(circuit.direction ?? "Non renseignée")}</p>` +
      `<p><strong>Distance :</strong> ${escapeHtml(circuit.km ?? "—")} km · <strong>D+ :</strong> ${escapeHtml(circuit.dPlus ?? "—")} m</p>` +
      `<p><strong>Itinéraire :</strong> ${escapeHtml(circuit.itineraire || "Non renseigné")}</p>` +
      (circuit.openrunner ? `<p><a class="bb-openrunner-btn" href="${escapeHtml(circuit.openrunner)}" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir le circuit ${escapeHtml(code)} sur OpenRunner"><img src="assets/img/openrunner-logo.png" alt="OPENRUNNER"></a></p>` : "");
    dialog.querySelector(".bb-dialog-close").addEventListener("click", () => dialog.close());
    dialog.showModal();
  }

  function renderMonthActivities(month) {
    const el = byId("month-activities-content");
    if (!el) return;
    const activities = (window.BB_MONTH_ACTIVITIES?.[currentYear] || {})[month + 1] || []; // month is 0-indexed
    if (!activities || activities.length === 0) {
      el.innerHTML = "<p class=\"details-empty\">Aucune activité particulière ce mois-ci.</p>";
      return;
    }
    let html = "<ul class=\"activities-list\">";
    activities.forEach(a => {
      html += `<li>${a}</li>`; // les items peuvent contenir du HTML (liens, images)
    });
    html += "</ul>";
    el.innerHTML = html;
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
