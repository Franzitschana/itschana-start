(function () {
  "use strict";

  const ANCHOR_DATE = Date.UTC(1989, 10, 19);
  const ANCHOR_KIN = 49;
  const CYCLE_LENGTH = 273;
  let selectedDate = itschanaToday();
  let data;

  function itschanaToday() {
    const now = new Date();
    if (now.getHours() < 3 || (now.getHours() === 3 && now.getMinutes() < 8)) now.setDate(now.getDate() - 1);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function modulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function kinForDate(date) {
    const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const difference = Math.round((utcDate - ANCHOR_DATE) / 86400000);
    return modulo(ANCHOR_KIN - 1 + difference, CYCLE_LENGTH) + 1;
  }

  function byNumber(collection, number) {
    return collection.find((entry) => entry.number === number);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value || "";
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function render() {
    const kinNumber = kinForDate(selectedDate);
    const kin = byNumber(data.kins, kinNumber);
    const tone = byNumber(data.tones, kin.toneNumber);
    const figure = byNumber(data.figures, kin.figureNumber);
    const wave = byNumber(data.figures, kin.waveFigureNumber);
    const today = itschanaToday();
    const isToday = sameDay(selectedDate, today);

    setText("date-weekday", isToday ? "Heute" : new Intl.DateTimeFormat("de-AT", { weekday: "long" }).format(selectedDate));
    setText("date-full", new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "long", year: "numeric" }).format(selectedDate));
    setText("kin-number", `KIN ${kin.number}`);
    setText("kin-name", kin.name);
    setText("tone-name", tone.name);
    setText("tone-number", tone.number);
    setText("tone-keyword", tone.keyword);
    setText("tone-flh", tone.flhText);
    setText("tone-orientation", tone.orientation);
    setText("tone-dimension", tone.dimension);
    setText("figure-number", figure.number);
    setText("figure-name", figure.name);
    setText("figure-flh", figure.flhText);
    setText("figure-purpose", figure.purpose);
    setText("wave-name", wave.name);

    const spriteIndex = figure.number - 1;
    const spriteColumn = spriteIndex % 5;
    const spriteRow = Math.floor(spriteIndex / 5);
    document.getElementById("figure-glyph").style.backgroundPosition = `${spriteColumn * 25}% ${spriteRow * 25}%`;
    setText("glyph-name", figure.shortName);
    document.getElementById("today").disabled = isToday;
    document.getElementById("kin-stage").setAttribute("aria-busy", "false");
  }

  function moveDay(amount) {
    selectedDate.setDate(selectedDate.getDate() + amount);
    render();
    document.getElementById("kin-stage").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("previous-day").addEventListener("click", () => moveDay(-1));
  document.getElementById("next-day").addEventListener("click", () => moveDay(1));
  document.getElementById("today").addEventListener("click", () => { selectedDate = itschanaToday(); render(); });

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
