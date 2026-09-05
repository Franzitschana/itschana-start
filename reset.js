(function () {
  "use strict";
  const STORAGE_KEY = "reset_wahrnehmung_v2";
  const LEGACY_STORAGE_KEY = "reset_wahrnehmung_v1";
  const TOTAL_SECONDS = 180;
  let currentStep = 1;
  let secondsLeft = TOTAL_SECONDS;
  let timerId = null;

  const form = document.getElementById("perception-form");
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  const saveButton = document.getElementById("save-button");
  const saveStatus = document.getElementById("save-status");
  const timerDisplay = document.getElementById("timer-display");
  const timerToggle = document.getElementById("timer-toggle");
  const timerReset = document.getElementById("timer-reset");
  const savedEntry = document.getElementById("saved-entry");
  const savedEntryContent = document.getElementById("saved-entry-content");
  const savedEntryEmpty = document.getElementById("saved-entry-empty");
  const newEntryButton = document.getElementById("new-entry");
  let savedEntries = [];

  function localDateAtItschanaDay() {
    const date = ItschanaCalendar.today();
    return { iso: ItschanaCalendar.isoFromDate(date), date };
  }

  function renderDaySpace() {
    const { iso, date } = localDateAtItschanaDay();
    document.getElementById("day-date").textContent = new Intl.DateTimeFormat("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
    const kin = ItschanaCalendar.kinForDate(date);
    document.getElementById("day-kin").textContent = kin ? `KIN ${kin} – dein heutiger Beobachtungsraum` : "Für diesen Tag ist noch keine KIN-Zuordnung hinterlegt.";
  }

  function showStep(step) {
    currentStep = Math.min(4, Math.max(1, step));
    document.querySelectorAll(".form-step").forEach((element) => {
      const active = Number(element.dataset.step) === currentStep;
      element.hidden = !active;
      element.classList.toggle("active", active);
    });
    document.querySelectorAll("[data-step-dot]").forEach((dot) => {
      const number = Number(dot.dataset.stepDot);
      dot.classList.toggle("active", number === currentStep);
      dot.classList.toggle("done", number < currentStep);
    });
    backButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === 4;
    saveButton.hidden = currentStep !== 4;
    nextButton.textContent = currentStep === 1 ? "Beginnen" : "Weiter";
    const heading = document.querySelector(`.form-step[data-step="${currentStep}"] h3`);
    if (heading && currentStep > 1) heading.focus({ preventScroll: true });
  }

  function formatTime(total) {
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }
  function stopTimer() {
    window.clearInterval(timerId); timerId = null;
    timerToggle.textContent = secondsLeft === 0 ? "Noch einmal" : "Zeit fortsetzen";
  }
  function startTimer() {
    if (secondsLeft === 0) secondsLeft = TOTAL_SECONDS;
    timerDisplay.textContent = formatTime(secondsLeft);
    timerToggle.textContent = "Zeit anhalten";
    timerId = window.setInterval(() => {
      secondsLeft -= 1;
      timerDisplay.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 0) { stopTimer(); timerDisplay.textContent = "Deine Zeit"; }
    }, 1000);
  }
  function value(id) { return document.getElementById(id).value.trim(); }

  function dayLabel(iso) {
    const date = new Date(`${iso}T12:00:00`);
    return new Intl.DateTimeFormat("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
  }

  function renderSavedEntries() {
    savedEntryContent.replaceChildren();
    savedEntryEmpty.hidden = savedEntries.length > 0;
    newEntryButton.hidden = savedEntries.length === 0;
    savedEntries.slice().reverse().forEach((data) => {
      const article = document.createElement("article");
      article.className = "saved-trace";
      const header = document.createElement("header");
      const time = document.createElement("p");
      time.className = "saved-trace-date";
      time.textContent = dayLabel(data.day);
      const kin = document.createElement("strong");
      kin.className = "saved-trace-kin";
      kin.textContent = data.kin ? `KIN ${data.kin}` : "KIN noch nicht hinterlegt";
      header.append(time, kin);

      const dayLink = document.createElement("a");
      dayLink.className = "saved-trace-day-link";
      dayLink.href = `tageszeitraum.html?date=${encodeURIComponent(data.day)}`;
      dayLink.textContent = "Diesen Tagesraum öffnen";

      const items = [["Wahrnehmung", data.observation], ["Gefühl", data.feeling], ["Deutung", data.interpretation], ["Vor den Worten", data.beforeWords], ["Veränderung", data.change]].filter((item) => item[1]);
      const dl = document.createElement("dl");
      items.forEach(([label, entry]) => {
        const dt = document.createElement("dt"); const dd = document.createElement("dd");
        dt.textContent = label; dd.textContent = entry; dl.append(dt, dd);
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button danger";
      remove.textContent = "Diese Spur löschen";
      remove.addEventListener("click", () => {
        savedEntries = savedEntries.filter((entry) => entry.id !== data.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
        renderSavedEntries();
        saveStatus.textContent = "Diese Spur wurde von deinem Gerät gelöscht.";
      });
      article.append(header, dl, dayLink, remove);
      savedEntryContent.append(article);
    });
  }

  function loadSavedEntries() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      savedEntries = Array.isArray(stored) ? stored : [];
      savedEntries = savedEntries.map((entry) => {
        const date = ItschanaCalendar.dateFromIso(entry.day);
        return date ? { ...entry, kin: ItschanaCalendar.kinForDate(date) } : entry;
      });
      if (savedEntries.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
      if (!savedEntries.length) {
        const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
        if (legacy) {
          const { iso } = localDateAtItschanaDay();
          const kin = ItschanaCalendar.kinForDate(ItschanaCalendar.dateFromIso(iso));
          savedEntries = [{ ...legacy, id: `legacy-${legacy.savedAt || iso}`, day: iso, kin }];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
        }
      }
    } catch (error) {
      savedEntries = [];
      localStorage.removeItem(STORAGE_KEY);
    }
    renderSavedEntries();
  }

  nextButton.addEventListener("click", () => showStep(currentStep + 1));
  backButton.addEventListener("click", () => showStep(currentStep - 1));
  timerToggle.addEventListener("click", () => timerId ? stopTimer() : startTimer());
  timerReset.addEventListener("click", () => {
    if (timerId) stopTimer();
    secondsLeft = TOTAL_SECONDS; timerDisplay.textContent = formatTime(secondsLeft); timerToggle.textContent = "Zeit starten";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { iso } = localDateAtItschanaDay();
    const kin = ItschanaCalendar.kinForDate(ItschanaCalendar.dateFromIso(iso));
    const savedAt = new Date().toISOString();
    const data = { id: `${savedAt}-${Math.random().toString(36).slice(2)}`, day: iso, kin, observation: value("observation"), feeling: value("feeling"), interpretation: value("interpretation"), beforeWords: value("before-words"), change: value("change"), savedAt };
    savedEntries.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
    renderSavedEntries();
    saveButton.disabled = true;
    saveStatus.textContent = `Deine Spur für KIN ${kin || "–"} wurde nur auf diesem Gerät bewahrt.`;
    savedEntry.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  newEntryButton.addEventListener("click", () => {
    form.reset();
    saveButton.disabled = false;
    if (timerId) stopTimer();
    secondsLeft = TOTAL_SECONDS;
    timerDisplay.textContent = formatTime(secondsLeft);
    timerToggle.textContent = "Zeit starten";
    saveStatus.textContent = "Ein neuer Wahrnehmungsraum ist geöffnet.";
    showStep(1);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderDaySpace(); loadSavedEntries(); showStep(1);
})();
