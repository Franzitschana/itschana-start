(function () {
  "use strict";

  const requestedDate = ItschanaCalendar.dateFromIso(new URLSearchParams(window.location.search).get("date"));
  let selectedDate = requestedDate || ItschanaCalendar.today();
  let data;
  let currentRoom = null;

  function byNumber(collection, number) {
    return collection.find((entry) => entry.number === number);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value || "";
  }

  function kinDisplayName(kinName, figure) {
    if (figure.number === 6 || !/^(Der|Die)\s/.test(figure.name)) return kinName;
    const [article, color] = figure.name.split(/\s+/);
    let description = kinName.split(/\s+/).slice(1).join(" ");
    if (description.startsWith("oberton ")) description = `Oberton ${description.slice(8)}`;
    else description = description.replace(/^(\S+)er\b/, "$1e");
    return `${article} ${color} ${description}`;
  }

  function renderToneMark(toneNumber) {
    const mark = document.getElementById("tone-mark");
    const bars = Math.floor(toneNumber / 5);
    const points = toneNumber % 5;
    const parts = [];

    if (points) {
      const pointRow = document.createElement("span");
      pointRow.className = "tone-points";
      for (let index = 0; index < points; index += 1) {
        const point = document.createElement("i");
        point.className = "tone-point";
        pointRow.appendChild(point);
      }
      parts.push(pointRow);
    }

    if (bars) {
      const barStack = document.createElement("span");
      barStack.className = "tone-bars";
      for (let index = 0; index < bars; index += 1) {
        const bar = document.createElement("i");
        bar.className = "tone-bar";
        barStack.appendChild(bar);
      }
      parts.push(barStack);
    }

    mark.replaceChildren(...parts);
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function clean(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  function resetWayfinder() {
    const wayfinder = document.getElementById("wayfinder");
    if (wayfinder) wayfinder.hidden = true;
  }

  function render() {
    const kinNumber = ItschanaCalendar.kinForDate(selectedDate);
    const kin = byNumber(data.kins, kinNumber);
    const tone = byNumber(data.tones, kin.toneNumber);
    const figure = byNumber(data.figures, kin.figureNumber);
    const wave = byNumber(data.figures, kin.waveFigureNumber);
    const today = ItschanaCalendar.today();
    const isToday = sameDay(selectedDate, today);
    const displayName = kinDisplayName(kin.name, figure);

    currentRoom = { kin, tone, figure, wave, displayName, date: new Date(selectedDate) };

    setText("date-weekday", isToday ? "Heute" : new Intl.DateTimeFormat("de-AT", { weekday: "long" }).format(selectedDate));
    setText("date-full", new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "long", year: "numeric" }).format(selectedDate));
    setText("kin-number", `KIN ${kin.number}`);
    setText("kin-name", displayName);
    setText("tone-name", tone.name);
    setText("tone-number", tone.number);
    renderToneMark(tone.number);
    setText("tone-keyword", tone.keyword);
    setText("tone-flh", tone.flhText);
    setText("tone-orientation", tone.orientation);
    setText("tone-dimension", tone.dimension);
    setText("figure-number", figure.number);
    setText("figure-name", figure.name);
    setText("figure-flh", figure.flhText);
    setText("figure-purpose", figure.purpose);
    setText("wave-name", wave.name);
    const waveLink = document.getElementById("wave-name");
    waveLink.href = `welle-niwanes.html?date=${ItschanaCalendar.isoFromDate(selectedDate)}`;
    waveLink.setAttribute("aria-label", `${wave.name}: vollständigen Verlauf öffnen`);

    const spriteIndex = figure.number - 1;
    const spriteColumn = spriteIndex % 5;
    const spriteRow = Math.floor(spriteIndex / 5);
    document.getElementById("figure-glyph").style.backgroundPosition = `${spriteColumn * 25}% ${spriteRow * 25}%`;
    document.querySelector(".glyph-halo").setAttribute("aria-label", `KIN ${kin.number}: ${figure.name}, Ton ${tone.number}`);
    document.getElementById("today").disabled = isToday;
    document.getElementById("kin-stage").setAttribute("aria-busy", "false");
    resetWayfinder();
  }

  function moveDay(amount) {
    selectedDate.setDate(selectedDate.getDate() + amount);
    window.history.replaceState(null, "", `?date=${ItschanaCalendar.isoFromDate(selectedDate)}`);
    render();
    document.getElementById("kin-stage").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openWayfinder() {
    if (!currentRoom) return;

    const attention = clean(document.getElementById("resonance-attention").value);
    const alive = clean(document.getElementById("resonance-alive").value);
    const open = clean(document.getElementById("resonance-open").value);
    const personalParts = [attention, alive, open].filter(Boolean);

    const roomSentence = `Der tragende Raum bleibt KIN ${currentRoom.kin.number} – ${currentRoom.displayName}, Ton ${currentRoom.tone.number} · ${currentRoom.tone.keyword}, getragen von ${currentRoom.wave.name}.`;
    const personalSentence = personalParts.length
      ? `Deine heutige Resonanz bringt dazu: ${personalParts.join(" · ")}.`
      : "Du hast noch keine Worte eingesetzt. Auch diese Offenheit darf Teil der Wahrnehmung bleiben.";

    setText("wayfinder-text", `${roomSentence} ${personalSentence} Frage nicht zuerst: Was bedeutet das? Frage: Was wird dadurch in mir oder um mich herum neu sichtbar?`);

    const visualSeeds = [
      `Tagesraum KIN ${currentRoom.kin.number}: ${currentRoom.displayName}`,
      `Ton ${currentRoom.tone.number}: ${currentRoom.tone.keyword}`,
      `Welle: ${currentRoom.wave.name}`,
      currentRoom.tone.flhText,
      currentRoom.figure.flhText,
      ...personalParts
    ].filter(Boolean);

    setText(
      "image-seed-text",
      `Ein offener, nicht festlegender Bildraum aus ${visualSeeds.join(" · ")}. Die Gestaltung soll Atmosphäre, Bewegung, Licht, Natur, Formen und Zwischenräume nutzen. Sie soll nichts beweisen und keine fertige Symboldeutung vorgeben, sondern Empathie zum Tagesraum tragen und weitere Wahrnehmung ermöglichen.`
    );

    const wayfinder = document.getElementById("wayfinder");
    wayfinder.hidden = false;
    wayfinder.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.getElementById("previous-day").addEventListener("click", () => moveDay(-1));
  document.getElementById("next-day").addEventListener("click", () => moveDay(1));
  document.getElementById("today").addEventListener("click", () => {
    selectedDate = ItschanaCalendar.today();
    window.history.replaceState(null, "", window.location.pathname);
    render();
  });

  document.getElementById("open-wayfinder").addEventListener("click", openWayfinder);
  document.getElementById("clear-wayfinder").addEventListener("click", () => {
    ["resonance-attention", "resonance-alive", "resonance-open"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    resetWayfinder();
    document.getElementById("resonance-attention").focus();
  });

  fetch("data/itschana-flh.json")
    .then((response) => {
      if (!response.ok) throw new Error("F.L.H.-Daten konnten nicht geladen werden.");
      return response.json();
    })
    .then((loadedData) => { data = loadedData; render(); })
    .catch(() => {
      setText("kin-name", "Der Tagesraum konnte gerade nicht geöffnet werden.");
      document.getElementById("kin-stage").setAttribute("aria-busy", "false");
    });
})();
