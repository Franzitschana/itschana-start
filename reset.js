(function () {
  "use strict";
  const STORAGE_KEY = "reset_wahrnehmung_v1";
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
  const deleteEntryButton = document.getElementById("delete-entry");

  function localDateAtItschanaDay() {
    const now = new Date();
    if (now.getHours() < 3 || (now.getHours() === 3 && now.getMinutes() < 8)) now.setDate(now.getDate() - 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return { iso: `${year}-${month}-${day}`, date: now };
  }

  function renderDaySpace() {
    const { iso, date } = localDateAtItschanaDay();
    document.getElementById("day-date").textContent = new Intl.DateTimeFormat("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
    const kin = typeof kinList !== "undefined" ? kinList[iso] : null;
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

  function renderSavedEntry(data) {
    const items = [["Wahrnehmung", data.observation], ["Gefühl", data.feeling], ["Deutung", data.interpretation], ["Vor den Worten", data.beforeWords], ["Veränderung", data.change]].filter((item) => item[1]);
    if (!items.length) { savedEntry.hidden = true; return; }
    const dl = document.createElement("dl");
    items.forEach(([label, entry]) => {
      const dt = document.createElement("dt"); const dd = document.createElement("dd");
      dt.textContent = label; dd.textContent = entry; dl.append(dt, dd);
    });
    savedEntryContent.replaceChildren(dl); savedEntry.hidden = false;
  }

  function loadSavedEntry() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!data) return;
      [["observation", "observation"], ["feeling", "feeling"], ["interpretation", "interpretation"], ["before-words", "beforeWords"], ["change", "change"]].forEach(([id, property]) => {
        if (data[property]) document.getElementById(id).value = data[property];
      });
      renderSavedEntry(data);
    } catch (error) { localStorage.removeItem(STORAGE_KEY); }
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
    const data = { observation: value("observation"), feeling: value("feeling"), interpretation: value("interpretation"), beforeWords: value("before-words"), change: value("change"), savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); renderSavedEntry(data);
    saveStatus.textContent = "Deine Spur wurde nur auf diesem Gerät bewahrt.";
    savedEntry.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  deleteEntryButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY); form.reset(); savedEntry.hidden = true;
    saveStatus.textContent = "Deine bewahrte Spur wurde von diesem Gerät gelöscht."; showStep(1);
  });

  renderDaySpace(); loadSavedEntry(); showStep(1);
})();
