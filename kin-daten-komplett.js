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
  }
};
};
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kalender – Itschana</title>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav>
    <a href="index.html">Start</a>
    <a href="kalender.html">Kalender</a>
    <a href="vision.html">Vision</a>
    <a href="kontakt.html">Kontakt</a>
  </nav>

  <main>
    <h1>Kalender der lebendigen Zeit Energien</h1>
    <p>Itschana verbindet den natürlichen 273er-Zyklus mit dem gregorianischen Jahreslauf und macht innere Rhythmen erfahrbar.</p>

    <section class="kin-feld">
      <h2>Impuls des heutigen Tages</h2>
      <p id="kin-output">Wird geladen …</p>
      <p><a id="kin-link" href="#" target="_blank">🔗 Zur Tagesenergie öffnen</a></p>
    </section>
  </main>

  <script src="kin-daten-komplett.js"></script>
  <script>
    const today = new Date().toISOString().split("T")[0];
    const kinNumber = kinList[today];

    const output = document.getElementById("kin-output");
    const link = document.getElementById("kin-link");

    if (kinNumber) {
      const kinInfo = kinInfos[kinNumber];
      output.innerHTML = `
        <strong>KIN ${kinNumber}</strong><br />
        ${kinInfo.name}<br />
        ${kinInfo.ton} – ${kinInfo.dimension}
      `;
      link.href = `https://itschana.vercel.app/kin${kinNumber.toString().padStart(3, '0')}/`;
    } else {
      output.innerText = "Für dieses Datum ist noch kein KIN eingetragen.";
      link.href = "#";
    }
  </script>
</body>
</html>
