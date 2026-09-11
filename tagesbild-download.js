(function () {
  "use strict";

  const image = document.getElementById("generated-room-image");
  const takeaway = document.getElementById("image-takeaway");
  const button = document.getElementById("download-room-image");

  if (!image || !takeaway || !button) return;

  function syncTakeaway() {
    takeaway.hidden = image.hidden || !image.getAttribute("src");
  }

  image.addEventListener("load", syncTakeaway);
  new MutationObserver(syncTakeaway).observe(image, {
    attributes: true,
    attributeFilter: ["src", "hidden"]
  });

  button.addEventListener("click", function () {
    const source = image.getAttribute("src");
    if (!source) return;

    const params = new URLSearchParams(window.location.search);
    const date = params.get("date") || new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = source;
    link.download = `itschana-bildraum-${date}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  syncTakeaway();
})();