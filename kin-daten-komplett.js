
const kinInfos = {
  1: {
    name: "Roter magnetischer Drache",
    ton: "Ton 1",
    dimension: "Geburt",
    bestimmung: "Erweckt das Urvertrauen",
    farbe: "#e03c31",
    glyphe: "drache.png"
  },
  2: {
    name: "Weißer lunarer Wind",
    ton: "Ton 2",
    dimension: "Kommunikation",
    bestimmung: "Bewegt mit Offenheit",
    farbe: "#ffffff",
    glyphe: "wind.png"
  },
  3: {
    name: "Blauer elektrischer Nachhall",
    ton: "Ton 3",
    dimension: "Resonanz",
    bestimmung: "Erzeugt Impulse",
    farbe: "#009ddc",
    glyphe: "nachhall.png"
  },
  4: {
    name: "Gelber selbstbestehender Same",
    ton: "Ton 4",
    dimension: "Formkraft",
    bestimmung: "Stiftet Struktur",
    farbe: "#fcb900",
    glyphe: "same.png"
  },
  5: {
    name: "Roter oberton Mond",
    ton: "Ton 5",
    dimension: "Fluss",
    bestimmung: "Bringt Reinigung",
    farbe: "#e03c31",
    glyphe: "mond.png"
  },
  6: {
    name: "Weißer rhythmischer Hund",
    ton: "Ton 6",
    dimension: "Herz",
    bestimmung: "Erinnert an die Liebe",
    farbe: "#ffffff",
    glyphe: "hund.png"
  },
  7: {
    name: "Blauer resonanter Affe",
    ton: "Ton 7",
    dimension: "Magie",
    bestimmung: "Verspielt mit Tiefgang",
    farbe: "#009ddc",
    glyphe: "affe.png"
  },
  8: {
    name: "Gelbe galaktische Sonne",
    ton: "Ton 8",
    dimension: "Bewusstheit",
    bestimmung: "Erhellt den Sinn",
    farbe: "#fcb900",
    glyphe: "sonne.png"
  },
  9: {
    name: "Roter solarer Himmelswanderer",
    ton: "Ton 9",
    dimension: "Raum",
    bestimmung: "Erweitert Horizonte",
    farbe: "#e03c31",
    glyphe: "himmelswanderer.png"
  },
  10: {
    name: "Weißer planetarer Weltenüberbrücker",
    ton: "Ton 10",
    dimension: "Loslassen",
    bestimmung: "Schafft Übergänge",
    farbe: "#ffffff",
    glyphe: "weltenueberbruecker.png"
  },
  11: {
    name: "Blauer spektraler Adler",
    ton: "Ton 11",
    dimension: "Vision",
    bestimmung: "Bringt neue Sicht",
    farbe: "#009ddc",
    glyphe: "adler.png"
  },
  12: {
    name: "Gelber kristaller Krieger",
    ton: "Ton 12",
    dimension: "Intelligenz",
    bestimmung: "Fragt aus innerer Kraft",
    farbe: "#fcb900",
    glyphe: "krieger.png"
  },
  13: {
    name: "Roter kosmischer Erdenwanderer",
    ton: "Ton 13",
    dimension: "Erfahrung",
    bestimmung: "Vollendet mit Weite",
    farbe: "#e03c31",
    glyphe: "erdenwanderer.png"
  },
  14: {
    name: "Weißer magnetischer Spiegel",
    ton: "Ton 1",
    dimension: "Klarheit",
    bestimmung: "Zeigt, was ist",
    farbe: "#ffffff",
    glyphe: "spiegel.png"
  },
  15: {
    name: "Blaue lunare Nacht",
    ton: "Ton 2",
    dimension: "Traum",
    bestimmung: "Führt ins Innere",
    farbe: "#009ddc",
    glyphe: "nacht.png"
  },
  16: {
    name: "Gelber elektrischer Samen",
    ton: "Ton 3",
    dimension: "Potential",
    bestimmung: "Setzt Keime frei",
    farbe: "#fcb900",
    glyphe: "samen.png"
  },
  17: {
    name: "Roter selbstbestehender Himmelswanderer",
    ton: "Ton 4",
    dimension: "Raum",
    bestimmung: "Strukturiert die Freiheit",
    farbe: "#e03c31",
    glyphe: "himmelswanderer.png"
  },
  18: {
    name: "Weißer oberton Magier",
    ton: "Ton 5",
    dimension: "Zeit",
    bestimmung: "Bewahrt die Gegenwart",
    farbe: "#ffffff",
    glyphe: "magier.png"
  },
  19: {
    name: "Blauer rhythmischer Adler",
    ton: "Ton 6",
    dimension: "Vision",
    bestimmung: "Ordnet den Weitblick",
    farbe: "#009ddc",
    glyphe: "adler.png"
  },
  20: {
    name: "Gelbe resonante Sonne",
    ton: "Ton 7",
    dimension: "Bewusstsein",
    bestimmung: "Strahlt von innen",
    farbe: "#fcb900",
    glyphe: "sonne.png"
  },
  21: {
    name: "Roter galaktischer Drache",
    ton: "Ton 8",
    dimension: "Geburt",
    bestimmung: "Formt den Neubeginn",
    farbe: "#e03c31",
    glyphe: "drache.png"
  },
  22: {
    name: "Weißer solarer Wind",
    ton: "Ton 9",
    dimension: "Kommunikation",
    bestimmung: "Stärkt die Verbindung",
    farbe: "#ffffff",
    glyphe: "wind.png"
  },
  23: {
    name: "Blauer planetarer Nachhall",
    ton: "Ton 10",
    dimension: "Resonanz",
    bestimmung: "Verstärkt Wirkung",
    farbe: "#009ddc",
    glyphe: "nachhall.png"
  },
  24: {
    name: "Gelber spektraler Same",
    ton: "Ton 11",
    dimension: "Formkraft",
    bestimmung: "Löst alte Muster",
    farbe: "#fcb900",
    glyphe: "same.png"
  },
  25: {
    name: "Roter kristaller Mond",
    ton: "Ton 12",
    dimension: "Fluss",
    bestimmung: "Teilt das Wesentliche",
    farbe: "#e03c31",
    glyphe: "mond.png"
  },
  26: {
    name: "Weißer kosmischer Hund",
    ton: "Ton 13",
    dimension: "Herz",
    bestimmung: "Liebt ohne Bedingung",
    farbe: "#ffffff",
    glyphe: "hund.png"
  },
  27: {
    name: "Blauer magnetischer Affe",
    ton: "Ton 1",
    dimension: "Magie",
    bestimmung: "Beginnt mit Spiel",
    farbe: "#009ddc",
    glyphe: "affe.png"
  },
  28: {
    name: "Gelbe lunare Sonne",
    ton: "Ton 2",
    dimension: "Bewusstheit",
    bestimmung: "Prüft innere Klarheit",
    farbe: "#fcb900",
    glyphe: "sonne.png"
  },
  29: {
    name: "Roter elektrischer Himmelswanderer",
    ton: "Ton 3",
    dimension: "Raum",
    bestimmung: "Bewegt in Freiheit",
    farbe: "#e03c31",
    glyphe: "himmelswanderer.png"
  },
  30: {
    name: "Weißer selbstbestehender Weltenüberbrücker",
    ton: "Ton 4",
    dimension: "Loslassen",
    bestimmung: "Strukturiert den Übergang",
    farbe: "#ffffff",
    glyphe: "weltenueberbruecker.png"
  },
  31: {
    name: "Blauer oberton Adler",
    ton: "Ton 5",
    dimension: "Vision",
    bestimmung: "Stärkt das Erkennen",
    farbe: "#009ddc",
    glyphe: "adler.png"
  },
  32: {
    name: "Gelber rhythmischer Krieger",
    ton: "Ton 6",
    dimension: "Intelligenz",
    bestimmung: "Ordnet das Denken",
    farbe: "#fcb900",
    glyphe: "krieger.png"
  },
  33: {
    name: "Roter resonanter Erdenwanderer",
    ton: "Ton 7",
    dimension: "Erfahrung",
    bestimmung: "Sendet Impulse",
    farbe: "#e03c31",
    glyphe: "erdenwanderer.png"
  },
  34: {
    name: "Weißer galaktischer Spiegel",
    ton: "Ton 8",
    dimension: "Klarheit",
    bestimmung: "Bringt Integrität",
    farbe: "#ffffff",
    glyphe: "spiegel.png"
  },
  35: {
    name: "Blaue solare Nacht",
    ton: "Ton 9",
    dimension: "Traum",
    bestimmung: "Leuchtet von innen",
    farbe: "#009ddc",
    glyphe: "nacht.png"
  },
  36: {
    name: "Gelber planetarer Samen",
    ton: "Ton 10",
    dimension: "Potential",
    bestimmung: "Bringt Fülle",
    farbe: "#fcb900",
    glyphe: "samen.png"
  },
  37: {
    name: "Roter spektraler Himmelswanderer",
    ton: "Ton 11",
    dimension: "Raum",
    bestimmung: "Löst Begrenzungen",
    farbe: "#e03c31",
    glyphe: "himmelswanderer.png"
  },
  38: {
    name: "Weißer kristaller Magier",
    ton: "Ton 12",
    dimension: "Zeit",
    bestimmung: "Teilt Gegenwärtigkeit",
    farbe: "#ffffff",
    glyphe: "magier.png"
  },
  39: {
    name: "Blauer kosmischer Adler",
    ton: "Ton 13",
    dimension: "Vision",
    bestimmung: "Vollendet mit Weitblick",
    farbe: "#009ddc",
    glyphe: "adler.png"
  },
  40: {
    name: "Gelber magnetischer Krieger",
    ton: "Ton 1",
    dimension: "Intelligenz",
    bestimmung: "Startet fokussiert",
    farbe: "#fcb900",
    glyphe: "krieger.png"
  },
  41: {
    name: "Roter lunarer Erdenwanderer",
    ton: "Ton 2",
    dimension: "Erfahrung",
    bestimmung: "Ergründet Wege",
    farbe: "#e03c31",
    glyphe: "erdenwanderer.png"
  },
  42: {
    name: "Weißer elektrischer Spiegel",
    ton: "Ton 3",
    dimension: "Klarheit",
    bestimmung: "Verstärkt Erkenntnis",
    farbe: "#ffffff",
    glyphe: "spiegel.png"
  },
  43: {
    name: "Blauer selbstbestehender Nachhall",
    ton: "Ton 4",
    dimension: "Resonanz",
    bestimmung: "Gibt Struktur zum Klang",
    farbe: "#009ddc",
    glyphe: "nachhall.png"
  },
  44: {
    name: "Gelber oberton Same",
    ton: "Ton 5",
    dimension: "Formkraft",
    bestimmung: "Strahlt Verwirklichung",
    farbe: "#fcb900",
    glyphe: "same.png"
  },
  45: {
    name: "Roter rhythmischer Mond",
    ton: "Ton 6",
    dimension: "Fluss",
    bestimmung: "Stabilisiert Reinigung",
    farbe: "#e03c31",
    glyphe: "mond.png"
  },
  46: {
    name: "Weißer resonanter Hund",
    ton: "Ton 7",
    dimension: "Herz",
    bestimmung: "Schwingt in Liebe",
    farbe: "#ffffff",
    glyphe: "hund.png"
  },
  47: {
    name: "Blauer galaktischer Affe",
    ton: "Ton 8",
    dimension: "Magie",
    bestimmung: "Harmonisiert das Spiel",
    farbe: "#009ddc",
    glyphe: "affe.png"
  },
  48: {
    name: "Gelbe solare Sonne",
    ton: "Ton 9",
    dimension: "Bewusstheit",
    bestimmung: "Verwirklicht Klarheit",
    farbe: "#fcb900",
    glyphe: "sonne.png"
  },
  49: {
    name: "Roter planetarer Himmelswanderer",
    ton: "Ton 10",
    dimension: "Raum",
    bestimmung: "Verankert Ausdehnung",
    farbe: "#e03c31",
    glyphe: "himmelswanderer.png"
  },
  50: {
    name: "Weißer spektraler Weltenüberbrücker",
    ton: "Ton 11",
    dimension: "Loslassen",
    bestimmung: "Löst Begrenzungen",
    farbe: "#ffffff",
    glyphe: "weltenueberbruecker.png"
  },
  51: {
    name: "Blauer kristaller Adler",
    ton: "Ton 12",
    dimension: "Vision",
    bestimmung: "Kommuniziert Weitblick",
    farbe: "#009ddc",
    glyphe: "adler.png"
  },
  52: {
    name: "Gelber kosmischer Krieger",
    ton: "Ton 13",
    dimension: "Intelligenz",
    bestimmung: "Vollendet Mut",
    farbe: "#fcb900",
    glyphe: "krieger.png"
  },
  53: {
    name: "Roter magnetischer Erdenwanderer",
    ton: "Ton 1",
    dimension: "Erfahrung",
    bestimmung: "Startet den Weg",
    farbe: "#e03c31",
    glyphe: "erdenwanderer.png"
  },
  54: {
    name: "Weißer lunarer Spiegel",
    ton: "Ton 2",
    dimension: "Klarheit",
    bestimmung: "Spiegelt Dualität",
    farbe: "#ffffff",
    glyphe: "spiegel.png"
  },
  55: {
    name: "Blaue elektrische Nacht",
    ton: "Ton 3",
    dimension: "Traum",
    bestimmung: "Lädt ins Feld",
    farbe: "#009ddc",
    glyphe: "nacht.png"
  },
  56: {
    name: "Gelber selbstbestehender Samen",
    ton: "Ton 4",
    dimension: "Potential",
    bestimmung: "Gibt innere Form",
    farbe: "#fcb900",
    glyphe: "samen.png"
  },
  57: {
    name: "Roter oberton Himmelswanderer",
    ton: "Ton 5",
    dimension: "Raum",
    bestimmung: "Strahlt Freiheit",
    farbe: "#e03c31",
    glyphe: "himmelswanderer.png"
  },
  58: {
    name: "Weißer rhythmischer Magier",
    ton: "Ton 6",
    dimension: "Zeit",
    bestimmung: "Stabilisiert das Jetzt",
    farbe: "#ffffff",
    glyphe: "magier.png"
  },
  59: {
    name: "Blauer resonanter Adler",
    ton: "Ton 7",
    dimension: "Vision",
    bestimmung: "Harmonisiert den Weitblick",
    farbe: "#009ddc",
    glyphe: "adler.png"
  },
  60: {
    name: "Gelber galaktischer Krieger",
    ton: "Ton 8",
    dimension: "Intelligenz",
    bestimmung: "Harmonisiert Mut",
    farbe: "#fcb900",
    glyphe: "krieger.png"
  },
  61: {
    name: "Roter solare Erdenwanderer",
    ton: "Ton 9",
    dimension: "Erfahrung",
    bestimmung: "Verwirklicht Offenheit",
    farbe: "#e03c31",
    glyphe: "erdenwanderer.png"
  },
  62: {
    name: "Weißer planetarer Spiegel",
    ton: "Ton 10",
    dimension: "Klarheit",
    bestimmung: "Verankert Wahrheit",
    farbe: "#ffffff",
    glyphe: "spiegel.png"
  },
  63: {
    name: "Blaue spektrale Nacht",
    ton: "Ton 11",
    dimension: "Traum",
    bestimmung: "Löst Illusionen",
    farbe: "#009ddc",
    glyphe: "nacht.png"
  }};
