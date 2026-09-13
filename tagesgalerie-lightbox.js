(function () {
  "use strict";

  const overlay = document.createElement("div");
  overlay.className = "gallery-lightbox";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="Großansicht schließen">×</button>
    <figure class="gallery-lightbox-figure">
      <img class="gallery-lightbox-image" alt="">
      <figcaption class="gallery-lightbox-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);

  const lightboxImage = overlay.querySelector(".gallery-lightbox-image");
  const caption = overlay.querySelector(".gallery-lightbox-caption");
  const closeButton = overlay.querySelector(".gallery-lightbox-close");

  function prepareImage(image) {
    if (!image || image.dataset.lightboxReady === "1") return;
    image.dataset.lightboxReady = "1";
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt || "Bild"} groß ansehen`);
  }

  function openLightbox(image) {
    prepareImage(image);
    const card = image.closest(".tapestry-piece");
    const kicker = card ? card.querySelector(".card-kicker") : null;
    const text = card ? card.querySelector(".woven-copy p") : null;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || "Großansicht der Wahrnehmung";
    caption.textContent = [kicker && kicker.textContent, text && text.textContent].filter(Boolean).join(" · ");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  document.querySelectorAll(".woven-photo").forEach(prepareImage);

  document.addEventListener("click", (event) => {
    const image = event.target.closest && event.target.closest(".woven-photo");
    if (image) openLightbox(image);
  });

  document.addEventListener("keydown", (event) => {
    const image = event.target.closest && event.target.closest(".woven-photo");
    if (image && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openLightbox(image);
      return;
    }
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closeLightbox();
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(".woven-photo")) prepareImage(node);
      node.querySelectorAll && node.querySelectorAll(".woven-photo").forEach(prepareImage);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });

  closeButton.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeLightbox();
  });
})();