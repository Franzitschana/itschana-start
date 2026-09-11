(function () {
  "use strict";

  const PUBLIC_HOST = "itschana-start.vercel.app";
  if (window.location.hostname !== PUBLIC_HOST) return;

  const button = document.getElementById("open-wayfinder");
  const image = document.getElementById("generated-room-image");
  const status = document.getElementById("image-status");
  if (!button || !image || !status || !window.ItschanaCalendar) return;

  function todayKey() {
    const today = ItschanaCalendar.today();
    return `itschana_public_bildraum_${ItschanaCalendar.isoFromDate(today)}`;
  }

  function hasUsedToday() {
    try {
      return localStorage.getItem(todayKey()) === "1";
    } catch (_) {
      return false;
    }
  }

  function markUsedToday() {
    try {
      localStorage.setItem(todayKey(), "1");
    } catch (_) {
      // Falls lokaler Speicher blockiert ist, bleibt der Bildraum benutzbar.
    }
  }

  function showDailyMessage() {
    button.disabled = true;
    button.textContent = "Dein heutiger Bildraum ist entstanden";
    if (!image.getAttribute("src")) {
      status.textContent = "Dein heutiger Bildraum ist für heute bereits entstanden. Nimm die Wahrnehmung mit in deinen Tag und entdecke, was daraus gestaltbar wird.";
    }
  }

  if (hasUsedToday()) showDailyMessage();

  document.addEventListener("click", function (event) {
    const clickedButton = event.target.closest && event.target.closest("#open-wayfinder");
    if (!clickedButton || !hasUsedToday()) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showDailyMessage();
  }, true);

  image.addEventListener("load", function () {
    if (!image.getAttribute("src")) return;
    markUsedToday();
    showDailyMessage();
  });
})();
