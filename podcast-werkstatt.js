(function () {
  "use strict";

  const sourceCard = document.getElementById("source-card");
  const draftField = document.getElementById("podcast-draft");
  const status = document.getElementById("draft-status");
  const selectedDate = ItschanaCalendar.today();
  const isoDate = ItschanaCalendar.isoFromDate(selectedDate);
  const storageKey = `itschana_podcast_werkstatt_${isoDate}`;
  let generatedDraft = "";

  function byNumber(collection, number) {
    return collection.find((entry) => entry.number === number);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value || "";
  }

  function kinDisplayName(kinName, figure) {
    if (figure.number === 6 || !/^(Der|Die)\s/.test(figure.name)) return kinName;
    const [article, color] = figure.name.split(/\s+/);
    const description = kinName.split(/\s+/).slice(1).join(" ");
    return `${article} ${color} ${description}`;
  }

  function buildDraft(kin, tone, figure, wave) {
    const dateText = new Intl.DateTimeFormat("de-AT", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }).format(selectedDate);
    const kinName = kinDisplayName(kin.name, figure);

    return `Guten Morgen und willkommen bei Itschana – Ruf des Raumes.

Heute ist ${dateText}.

Der heutige Zeitraum öffnet sich mit KIN ${kin.number} – ${kinName}.

${figure.name} trägt den ${figure.flhText}. Darin zeigt sich ${figure.purpose}.

Der heutige Ton ist Ton ${tone.number}: ${tone.name}. Sein Raum ist ${tone.keyword}. ${tone.orientation}. ${tone.dimension}. In den einfachen Worten des Tages: ${tone.flhText}.

Getragen wird dieser Tag von der Welle ${wave.name}.

Nimm dir einen Augenblick Zeit.

Was zeigt sich in dir, bevor du es erklärst?

Wo berührt dich dieser Tagesraum – und wo vielleicht auch nicht?

Du musst mit nichts übereinstimmen. Auch keine Resonanz ist eine wirkliche Wahrnehmung.

Nimm mit in deinen Tag, was für dich lebendig geworden ist.

Das war der heutige Ruf des Raumes.

It tscha na.`;
  }

  function showStatus(message) {
    status.textContent = message;
    window.setTimeout(() => { if (status.textContent === message) status.textContent = ""; }, 3500);
  }

  fetch("data/itschana-flh.json")
    .then((response) => {
      if (!response.ok) throw new Error("Der Tagesraum konnte nicht geladen werden.");
      return response.json();
    })
    .then((data) => {
      const kin = byNumber(data.kins, ItschanaCalendar.kinForDate(selectedDate));
      const tone = byNumber(data.tones, kin.toneNumber);
      const figure = byNumber(data.figures, kin.figureNumber);
      const wave = byNumber(data.figures, kin.waveFigureNumber);
      const kinName = kinDisplayName(kin.name, figure);
      const dateText = new Intl.DateTimeFormat("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(selectedDate);

      setText("source-date", dateText);
      setText("source-kin", `KIN ${kin.number} – ${kinName}`);
      setText("source-tone", `${tone.name} · ${tone.keyword}`);
      setText("source-figure", figure.flhText);
      setText("source-tone-keyword", `${tone.number} · ${tone.flhText}`);
      setText("source-wave", wave.name);
      document.getElementById("source-link").href = `tageszeitraum.html?date=${isoDate}`;

      generatedDraft = buildDraft(kin, tone, figure, wave);
      draftField.value = localStorage.getItem(storageKey) || generatedDraft;
      sourceCard.setAttribute("aria-busy", "false");
    })
    .catch(() => {
      setText("source-date", "Der Tagesraum konnte gerade nicht geöffnet werden.");
      sourceCard.setAttribute("aria-busy", "false");
      draftField.value = "Öffne die Werkstatt später noch einmal, sobald der heutige Tagesraum verfügbar ist.";
    });

  document.getElementById("rebuild-draft").addEventListener("click", () => {
    if (!generatedDraft) return;
    draftField.value = generatedDraft;
    showStatus("Der Entwurf wurde neu aus dem heutigen Tagesraum gebildet.");
  });

  document.getElementById("save-draft").addEventListener("click", () => {
    localStorage.setItem(storageKey, draftField.value);
    showStatus("Der heutige Entwurf ist auf diesem Gerät gespeichert.");
  });

  document.getElementById("copy-draft").addEventListener("click", () => {
    navigator.clipboard.writeText(draftField.value)
      .then(() => showStatus("Der Podcast-Text wurde kopiert."))
      .catch(() => showStatus("Kopieren war nicht möglich. Markiere den Text bitte von Hand."));
  });
})();
