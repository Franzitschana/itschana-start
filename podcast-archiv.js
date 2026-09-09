(function () {
  "use strict";

  const list = document.getElementById("archive-list");

  function byNumber(collection, number) {
    return collection.find((entry) => entry.number === number);
  }

  function kinDisplayName(kin, figure) {
    if (figure.number === 6 || !/^(Der|Die)\s/.test(figure.name)) return kin.name;
    const [article, color] = figure.name.split(/\s+/);
    let description = kin.name.split(/\s+/).slice(1).join(" ");
    if (description.startsWith("oberton ")) description = `Oberton ${description.slice(8)}`;
    return `${article} ${color} ${description}`;
  }

  function createEntry(podcast, data) {
    const date = ItschanaCalendar.dateFromIso(podcast.datum);
    const kin = byNumber(data.kins, ItschanaCalendar.kinForDate(date));
    const tone = byNumber(data.tones, kin.toneNumber);
    const figure = byNumber(data.figures, kin.figureNumber);
    const article = document.createElement("article");
    const formattedDate = new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "long", year: "numeric" }).format(date);

    article.className = "archive-entry";
    article.innerHTML = `
      <time datetime="${podcast.datum}">${formattedDate}</time>
      <h2>KIN ${kin.number} – ${kinDisplayName(kin, figure)}</h2>
      <span class="tone">${tone.name}</span>
      <p>${podcast.titel || "Ruf des Raumes"}</p>
      <iframe src="${podcast.audio}" height="100" title="Aufnahme vom ${formattedDate}" allow="autoplay"></iframe>
      <a href="podcast-heute.html?date=${podcast.datum}">Diesen Tagesruf lesen</a>`;
    return article;
  }

  fetch("data/itschana-flh.json")
    .then((response) => { if (!response.ok) throw new Error(); return response.json(); })
    .then((data) => {
      const entries = typeof podcasts !== "undefined" && Array.isArray(podcasts) ? [...podcasts] : [];
      entries.sort((a, b) => b.datum.localeCompare(a.datum));
      list.replaceChildren(...entries.filter((entry) => entry.datum && entry.audio).map((entry) => createEntry(entry, data)));
      if (!list.children.length) list.textContent = "Zurzeit sind keine früheren Aufnahmen eingetragen.";
    })
    .catch(() => { list.textContent = "Das Archiv konnte gerade nicht geöffnet werden."; });
})();
