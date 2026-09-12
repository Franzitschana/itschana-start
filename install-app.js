(function () {
  "use strict";

  let deferredPrompt = null;
  const installButton = document.getElementById("install-itschana");
  const installHint = document.getElementById("install-hint");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {
        // Die Webseite bleibt auch ohne Service Worker vollständig nutzbar.
      });
    });
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function showInstalled() {
    if (!installButton || !installHint) return;
    installButton.disabled = true;
    installButton.textContent = "Itschana ist auf diesem Gerät";
    installHint.textContent = "Ein Tipp auf das Itschana-Logo am Startbildschirm öffnet direkt diese Webseite.";
  }

  if (isStandalone()) {
    showInstalled();
    return;
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (installButton) installButton.hidden = false;
    if (installHint) installHint.textContent = "Einmal antippen und bestätigen – danach öffnet das Itschana-Logo direkt diese Webseite.";
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    showInstalled();
  });

  if (!installButton) return;

  installButton.addEventListener("click", async function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } finally {
        deferredPrompt = null;
      }
      return;
    }

    if (installHint) {
      installHint.textContent = "Falls kein Fenster erscheint: Browser-Menü ⋮ öffnen und „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.";
    }
  });
})();