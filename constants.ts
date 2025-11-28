







export const ZONES = [
  "Valencia Capital",
  "L'Horta Nord (Alboraya/Burjassot)",
  "L'Horta Sud (Alfafar/Catarroja)",
  "Paterna / Camp del Turia",
  "Zona Universitaria"
];

export const CLUB_ZONE_MAPPING: Record<string, string> = {
  "Sporting Club de Tenis": "Valencia Capital",
  "Club de Tenis Valencia": "Valencia Capital",
  "Olympia Hotel & Spa (Alboraya)": "L'Horta Nord (Alboraya/Burjassot)",
  "Complejo Patacona": "L'Horta Nord (Alboraya/Burjassot)",
  "TuTempo K7 (Paterna)": "Paterna / Camp del Turia",
  "Padel Táctica (Paterna)": "Paterna / Camp del Turia",
  "Tecnipadel": "L'Horta Sud (Alfafar/Catarroja)",
  "Family Sport Center (Beniparrell)": "L'Horta Sud (Alfafar/Catarroja)",
  "PadelCity Massanassa": "L'Horta Sud (Alfafar/Catarroja)",
  "Polideportivo UPV": "Zona Universitaria",
  "Club Español de Tenis": "Paterna / Camp del Turia",
  "Bergamonte": "L'Horta Nord (Alboraya/Burjassot)",
  "OTRO / PRIVADO": "Manual"
};

export const CLUBS_VALENCIA = Object.keys(CLUB_ZONE_MAPPING);

export const PADEL_LEVELS = [
  "1.0 - Iniciación",
  "1.25",
  "1.5 - Iniciación +",
  "1.75",
  "2.0 - Principiante",
  "2.25",
  "2.5 - Principiante +",
  "2.75",
  "3.0 - Medio Bajo",
  "3.25",
  "3.5 - Medio",
  "3.75",
  "4.0 - Medio Alto",
  "4.25",
  "4.5 - Avanzado",
  "4.75",
  "5.0 - Competición",
  "5.25",
  "5.5 - Profesional",
  "5.75",
  "6.0 - World Padel Tour"
];

export const MATCH_DURATIONS = [60, 90, 120];

export const INITIAL_MATCHES_DATA = [
  {
    id: 1,
    club: "Sporting Club de Tenis",
    zone: "Valencia Capital",
    date: "2023-10-25",
    time: "18:30",
    duration: 90,
    level: "3.5 - Medio",
    price: 6.5,
    matchType: 'friendly',
    genderCategory: 'mixed',
    courtType: 'outdoor',
    wallType: 'glass',
    hasBeer: true,
    hasBalls: true,
    acceptsCash: true,
    preferredPosition: 'indifferent',
    creator: "Marc",
    creatorReputation: 4.9,
    creatorLevel: "3.75",
    whatsapp: "+34600000000",
    isPremium: true,
    status: "Open",
    createdAt: new Date().toISOString(),
    players: ["Marc"]
  },
  {
    id: 2,
    club: "PadelCity Massanassa",
    zone: "L'Horta Sud (Alfafar/Catarroja)",
    date: "2023-10-26",
    time: "20:00",
    duration: 90,
    level: "4.0 - Medio Alto",
    price: 5.0,
    matchType: 'competitive',
    genderCategory: 'male',
    courtType: 'indoor',
    wallType: 'wall',
    hasBeer: false,
    hasBalls: false,
    acceptsCash: false,
    preferredPosition: 'backhand',
    creator: "Lucia",
    creatorReputation: 4.2,
    creatorLevel: "4.0 - Medio Alto",
    whatsapp: "+34600000000",
    isPremium: false,
    status: "Open",
    createdAt: new Date().toISOString(),
    players: ["Lucia"]
  }
];