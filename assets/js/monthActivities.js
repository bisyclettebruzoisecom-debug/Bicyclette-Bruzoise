/* Activités ponctuelles par année et par mois (1 = janvier, 12 = décembre).
   Les activités ne sont pas reconduites automatiquement en 2028 et au-delà.

   VACANCES SCOLAIRES : ne pas les saisir dans les listes mensuelles ci-dessous.
   Elles sont déclarées une seule fois dans « schoolHolidays » (plus bas) :
   - calendrierBB.html les place semaine par semaine (une semaine du lundi au
     dimanche est « en vacances » si son lundi tombe pendant les vacances) ;
   - les listes mensuelles reçoivent automatiquement une ligne récapitulative. */
  const monthActivities2026 = {
    1: ["10 janvier 2026 : galette des rois",
      "29 janvier 2026 : Randonnée pédestre - Talensac"
    ],

    2: ["26 février 2026 : Randonnée pédestre"
    ],

    3: ["<strong>14 mars 2026</strong> : brevet de 200 km à Romillé",
      "<strong>21 mars 2026</strong> : Sortie Saint Jacques De La Lande",
      "<strong>26 mars 2026</strong> : Randonnée pédestre <br> La rando pédestre du jeudi 26 mars 2026 aura lieu à LA CHAPELLE THOUARAULT. Parcours agréable de 9,5 kms sans difficulté. Pour le co-voiturage depuis Bruz, départ à 13h30 parking d’Aldi (rdv 5mn avant), ou rdv directement à 14 h à LA CHAPELLE THOUARAULT sur le parking de la salle des Rochers au 13 rue des Rochers. En venant de L’Hermitage, la salle se trouve à l’entrée du bourg. "],

    4: ["le <strong> 01 et 04 avril 2026 </strong>: Randonnée de printemps, 130 Km et 85 Km",
      "04 avril 2026 : Sortie Saint Gilles",
      "<strong>11 avril 2026</strong> : Reconnaissance de la fin du BRM300 par l'équipe organisatrice",
      "<strong>18 avril 2026</strong> : Reconnaissance des Tremplins de la Vilaine.",
      "<strong>23 avril 2026</strong> : Randonnée pédestre à Bourg des Comptes sur le circuit des Biches.",
      "25 avril 2026 : BRM de 300KM",
      "<strong>25 et 26 avril 2026 </strong>: rando club de 30km, 50km, 80km, 100km sur les 2 jours.<br> Gratuit pour les adhérents de la BB.<br>",
      "le <strong> 29 avril 2026 et le 2 mai 2026 </strong>: 3 circuits de 160Km, 140km et 100 Km sont proposés. Rapprochez-vous de vos capitaines de route<br>Circuits : <a href=\"https://www.openrunner.com/route-details/21291909\" target=\"_blank\" rel=\"noopener\"> 160 km</a>/ <a href=\"https://www.openrunner.com/route-details/22232709\" target=\"_blank\" rel=\"noopener\"> 140 km</a> / <a href=\"https://www.openrunner.com/route-details/22731771\" target=\"_blank\" rel=\"noopener\"> 100 km</a>"],

    5: ["le <strong> 29 avril 2026 et le 2 mai 2026 </strong>: 3 circuits de 160Km, 140km et 100 Km sont proposés. Rapprochez-vous de vos capitaines de route <br>Circuits : <a href=\"https://www.openrunner.com/route-details/21291909\" target=\"_blank\" rel=\"noopener\"> 160 km</a>/ <a href=\"https://www.openrunner.com/route-details/22232709\" target=\"_blank\" rel=\"noopener\"> 140 km</a> / <a href=\"https://www.openrunner.com/route-details/22731771\" target=\"_blank\" rel=\"noopener\"> 100 km</a>",
      "<strong>07 au 10 mai 2026</strong> : itinérant Bagnoles-de-l'Orne",
      "<strong>10 au 13 mai 2026</strong> : séjour à St-Jacut-de-la-Mer",
      "<strong>21 mai 2026</strong> : Randonnée pédestre - journée",
      "<strong>30 mai 2026 au 06 juin 2026</strong> : Séjour Ardèche"],

    6: ["06 juin 2026 : brevet de 400 km à Chantepie",
      "<strong>13 juin 2026</strong> : Rando 185 km – Le circuit des trois vallées",
      "<strong>18 juin 2026</strong> : Randonnée pédestre",
      "20 juin 2026 : rando du Rheu",
      "27 juin 2026 : rando de Pipriac"],

    7: [],
    8: ["02 au 09 août 2026 : Semaine fédérale à Château-Gontier",
      "29 août 2026 : Rando de l'Hermitage",
      "31 août 2026 au 04 septembre 2026 : Séjour Rando sacoche"],

    9: ["1er septembre 2026 : rentrée scolaire",
      "19 septembre 2026 : rando de Chartres-de-Bretagne",
      "24 septembre 2026 : Randonnée pédestre"],

    10: ["04 octobre 2026 : rando VTT + marche – Vallée du Boël",
      "22 octobre 2026 : Randonnée pédestre à GOVEN"],

    11: [
      "19 novembre 2026 : Randonnée pédestre",
      "20 novembre 2026 : AG Bicyclette Bruzoise",
      "21 novembre 2026 : Réunion de CA"],
    12: ["05 décembre 2026 : Renouvellement des licences",
      "17 décembre 2026 : Randonnée pédestre",
      "25 décembre 2026 : Joyeux Noël ! 🎉",
      "31 décembre 2026 : Bonne année 2027 ! 🎉"]
  };

  const monthActivities2027 = {
    "1": [
        "9 Janvier 2027 Réunion de CA",
        "16 janvier 2027  : GALETTE DES ROIS ! 🎉",
        "23 janvier 2027 : Formation mécanique",
        "30 janvier 2027 : Formation GPS"],

    "2": [],

    "3": [
        "13 mars 2027 : Réunion de CA",
        "20 mars 2027 : Reconnaissance 150 km \"partie 1 du  BRM 300 km\" par l'équipe organisatrice.",
        "03 avril 2027 : Sortie de printemps de 130km et 85km"],

    "4": [
        "10 avril 2027 : Réunion de CA",
        "17 avril 2027 : Reconnaissance 150 km \"partie 2 du  BRM 300 km\" par l'équipe organisatrice.",
        "24 avril 2027 : BRM de 300KM",
        "<strong>24 et 25 avril 2027 </strong>: Randonnée club de 30km, 50km, 80km, 100km sur les 2 jours.",
        "<strong>28 avril 2027 et 01 mai 2027 </strong>: 3 circuits de 160Km, 140km et 100 Km sont proposés."],

    "5": [
        "Du 5 mai 2027 au 9 mai 2027  : Séjour Itinérant",
        "Du 11 mai 2027 au 14 mai 2027  : Séjour Club  à Malansac (56)",
        "Du 24 au 29 mai 2027 : Littoral de Bretagne",
        "5 juin 2027 : Rando de 185 km et 130 km"],

    "6": [
        "26 juin 2027 : Réunion de CA",
        "26 juin 2027 et 27 juin 2027 : BRM DE 600KM et le soir Apéro Club"],

    "7": [
        "Du 10 juillet 2027 au 17 juillet 2027 : 21e Semaine européenne de cyclotourisme (UECT) à Saignelégier (Suisse)"],

    "8": [],

    "9": [
        "02 septembre 2027 : Rentrée scolaire",
        "25 septembre 2027 : Commande de vetements"],

    "10": [
        "23 octobre 2027 : Réunion de CA"],

    "11": [
        "06 novembre 2027 : Repas de fin d année",
        "19 novembre 2027 : Assemblée Générale",
        "20 novembre 2027 : Réunion de CA",
        "04 décembre 2027 : Renouvellement des licences"],

    "12": [
        "25 décembre 2027 : Joyeux Noël ! 🎉",
        "31 décembre 2027 : Bonne année 2028 ! 🎉"]
};

/* Vacances scolaires — zone B (académie de Rennes).
   start  = premier jour de vacances (samedi, après la classe) ;
   resume = jour de reprise des cours.
   Une semaine (lundi → dimanche) est en vacances si son lundi est >= start et < resume.
   firstWeekOnly : true → seule la 1re semaine est signalée (vacances d'été). */
const schoolHolidays = [
  { label: "Vacances scolaires de Noël",       start: "2025-12-20", resume: "2026-01-05" },
  { label: "Vacances scolaires d'hiver",       start: "2026-02-14", resume: "2026-03-02" },
  { label: "Vacances scolaires de printemps",  start: "2026-04-11", resume: "2026-04-27" },
  { label: "Vacances scolaires d'été",         start: "2026-07-04", resume: "2026-09-01", firstWeekOnly: true },
  { label: "Vacances scolaires de la Toussaint", start: "2026-10-17", resume: "2026-11-02" },
  { label: "Vacances scolaires de Noël",       start: "2026-12-19", resume: "2027-01-04" },
  { label: "Vacances scolaires d'hiver",       start: "2027-02-20", resume: "2027-03-08" },
  { label: "Vacances scolaires de printemps",  start: "2027-04-17", resume: "2027-05-03" },
  { label: "Vacances scolaires d'été",         start: "2027-07-03", resume: "2027-09-02", firstWeekOnly: true },
  { label: "Vacances scolaires de la Toussaint", start: "2027-10-23", resume: "2027-11-08" },
  { label: "Vacances scolaires de Noël",       start: "2027-12-18", resume: "2028-01-03" }
];

/* Ajoute dans les listes mensuelles une ligne récapitulative par période de vacances,
   pour chaque mois concerné. Ces lignes sont ignorées par calendrierBB.html
   (qui place les vacances semaine par semaine). */
(() => {
  const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const parse = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); };
  const fmt = (date, withYear) => `${date.getDate() === 1 ? '1er' : date.getDate()} ${MONTHS[date.getMonth()]}${withYear ? ' ' + date.getFullYear() : ''}`;
  const byYear = { 2026: monthActivities2026, 2027: monthActivities2027 };
  const generated = new Set();
  const leadingDay = text => { const m = String(text).replace(/<[^>]*>/g, ' ').match(/\b(\d{1,2})(?:er)?\b/); return m ? +m[1] : 99; };

  for (const h of schoolHolidays) {
    const start = parse(h.start), resume = parse(h.resume);
    const last = new Date(resume); last.setDate(last.getDate() - 1);
    const text = h.firstWeekOnly
      ? `${h.label} : à partir du ${fmt(start, true)}`
      : `${h.label} : du ${fmt(start, start.getFullYear() !== last.getFullYear())} au ${fmt(last, true)}`;
    generated.add(text);
    // Un exemplaire de la ligne dans chaque mois touché (hors vacances d'été : mois de début seulement).
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1, 12);
    const end = h.firstWeekOnly ? start : last;
    while (cursor <= end) {
      const months = byYear[cursor.getFullYear()];
      if (months) {
        const key = Object.keys(months).find(k => +k === cursor.getMonth() + 1) ?? String(cursor.getMonth() + 1);
        const list = months[key] || (months[key] = []);
        const day = cursor.getMonth() === start.getMonth() && cursor.getFullYear() === start.getFullYear() ? start.getDate() : 1;
        let at = list.findIndex(item => leadingDay(item) > day);
        if (at < 0) at = list.length;
        if (!list.includes(text)) list.splice(at, 0, text);
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }
  window.BB_HOLIDAY_ACTIVITY_TEXTS = generated;
})();

window.BB_SCHOOL_HOLIDAYS = schoolHolidays;
window.BB_MONTH_ACTIVITIES = { 2026: monthActivities2026, 2027: monthActivities2027 };
