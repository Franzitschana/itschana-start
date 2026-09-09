(function () {
  "use strict";
  const requestedDate = ItschanaCalendar.dateFromIso(new URLSearchParams(window.location.search).get("date"));
  let selectedDate = requestedDate || ItschanaCalendar.today();
  let data;

  function byNumber(collection, number) { return collection.find((entry) => entry.number === number); }
  function setText(id, value) { document.getElementById(id).textContent = value || ""; }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function kinDisplayName(kin, figure) {
    if (figure.number === 6 || !/^(Der|Die)\s/.test(figure.name)) return kin.name;
    const [article, color] = figure.name.split(/\s+/);
    let description = kin.name.split(/\s+/).slice(1).join(" ");
    if (description.startsWith("oberton ")) description = `Oberton ${description.slice(8)}`;
    return `${article} ${color} ${description}`;
  }

  function renderAudio(isoDate) {
    const list = typeof podcasts !== "undefined" && Array.isArray(podcasts) ? podcasts : [];
    const podcast = list.find((entry) => entry.datum === isoDate && entry.audio);
    const listenSpace = document.getElementById("listen-space");
    const player = document.getElementById("audio-player");
    if (podcast) {
      player.src = podcast.audio;
      listenSpace.hidden = false;
    } else {
      player.removeAttribute("src");
      listenSpace.hidden = true;
    }
  }

  function render() {
    const isoDate = ItschanaCalendar.isoFromDate(selectedDate);
    const kin = byNumber(data.kins, ItschanaCalendar.kinForDate(selectedDate));
    const tone = byNumber(data.tones, kin.toneNumber);
    const figure = byNumber(data.figures, kin.figureNumber);
    const wave = byNumber(data.figures, kin.waveFigureNumber);
    const isToday = sameDay(selectedDate, ItschanaCalendar.today());
    const displayName = kinDisplayName(kin, figure);
    const niwanes = figure.number === 6;

    setText("date-weekday", isToday ? "Heute" : new Intl.DateTimeFormat("de-AT", { weekday: "long" }).format(selectedDate));
    setText("date-full", new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "long", year: "numeric" }).format(selectedDate));
    setText("kin-number", `KIN ${kin.number}`);
    setText("kin-name", displayName);
    setText("tone-name", tone.name);
    setText("wave-name", `getragen von der Welle ${wave.name}`);

    const placeText = niwanes
      ? `Niwanes steht heute mit dem eigenen Ton ${tone.number} neutral innerhalb der Welle „${wave.name}“.`
      : `Der Ton ${tone.number} trägt den ${tone.number}. Platz innerhalb der Welle „${wave.name}“.`;

    setText("opening", `Heute öffnet sich KIN ${kin.number} – ${displayName}. ${placeText}`);
    setText("space-time", `${wave.name} trägt den größeren Zeitraum. Der heutige Ton heißt: ${tone.keyword}.`);
    setText("space-life", `${figure.name}: ${figure.flhText}. ${figure.purpose}.`);
    setText("space-senses", `${tone.orientation}. ${tone.keyword} bedeutet in den F.L.H.-Worten: ${tone.flhText}.`);
    setText("space-awareness", "Nimm wahr, was diese Verbindung in dir berührt, ohne daraus eine Vorgabe für deinen Tag zu machen.");
    setText("daily-question", `Wo zeigt sich heute ${tone.keyword} – und was lässt dich den ${figure.flhText} unmittelbar wahrnehmen?`);

    renderAudio(isoDate);
    document.getElementById("day-room-link").href = `tageszeitraum.html?date=${isoDate}`;
    document.getElementById("today").disabled = isToday;
    document.getElementById("ruf-card").setAttribute("aria-busy", "false");
  }

  function moveDay(amount) {
    selectedDate.setDate(selectedDate.getDate() + amount);
    window.history.replaceState(null, "", `?date=${ItschanaCalendar.isoFromDate(selectedDate)}`);
    render();
    document.getElementById("ruf-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("previous-day").addEventListener("click", () => moveDay(-1));
  document.getElementById("next-day").addEventListener("click", () => moveDay(1));
  document.getElementById("today").addEventListener("click", () => {
    selectedDate = ItschanaCalendar.today();
    window.history.replaceState(null, "", window.location.pathname);
    render();
  });

  fetch("data/itschana-flh.json")
    .then((response) => { if (!response.ok) throw new Error(); return response.json(); })
    .then((loadedData) => { data = loadedData; render(); })
    .catch(() => {
      setText("kin-name", "Der Tagesruf konnte gerade nicht geöffnet werden.");
      document.getElementById("ruf-card").setAttribute("aria-busy", "false");
    });
})();
