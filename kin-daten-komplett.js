const kinList = {
  "2025-06-23": 218,
};

const kinInfos = {
  218: {
    name: "Eismeerblauer oberton Niwanes",
    ton: "Ton 5",
    dimension: "Wahrheit",
    bestimmung: "Klärt den Blick, stärkt das Wesentliche",
    farbe: "#79c9dd",
    glyphe: "niwanes.png"
  }
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
