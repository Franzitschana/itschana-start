(function () {
  'use strict';

  const dynamicRoot = document.getElementById('dynamic-gallery-rooms');
  if (!dynamicRoot) return;

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  function byNumber(collection, number) {
    return collection.find(entry => entry.number === number);
  }

  function kinDisplayName(kinName, figure) {
    if (figure.number === 6 || !/^(Der|Die)\s/.test(figure.name)) return kinName;
    const parts = figure.name.split(/\s+/);
    return `${parts[0]} ${parts[1]} ${kinName.split(/\s+/).slice(1).join(' ')}`;
  }

  function formatDate(iso) {
    const date = ItschanaCalendar.dateFromIso(iso);
    return date ? `${date.getDate()}. ${monthNames[date.getMonth()]} ${date.getFullYear()}` : iso;
  }

  function dayDetails(iso, data) {
    const date = ItschanaCalendar.dateFromIso(iso);
    const kin = byNumber(data.kins, ItschanaCalendar.kinForDate(date));
    const tone = byNumber(data.tones, kin.toneNumber);
    const figure = byNumber(data.figures, kin.figureNumber);
    const wave = byNumber(data.figures, kin.waveFigureNumber);
    return `KIN ${kin.number} · ${kinDisplayName(kin.name, figure)} · Ton ${tone.number} · ${tone.keyword} · Welle ${wave.name}`;
  }

  function createPiece(item, formattedDate, index) {
    const article = document.createElement('article');
    article.className = 'tapestry-piece';
    article.dataset.blobPath = item.pathname;

    const image = document.createElement('img');
    image.className = 'woven-photo';
    image.alt = `Geteilte Wahrnehmung vom ${formattedDate}`;
    image.src = `/api/tagesgalerie-bild?pathname=${encodeURIComponent(item.pathname)}`;

    const copy = document.createElement('div');
    copy.className = 'woven-copy';
    copy.innerHTML = `<span class="card-kicker">${index === 0 ? 'Tagesbild' : 'Geteilte Wahrnehmung'}</span><p>Ein Bild im gemeinsamen Tagesraum.</p>`;
    article.append(image, copy);
    return article;
  }

  function addImagesToExistingRoom(room, items, iso) {
    const tapestry = room.querySelector('.image-tapestry');
    if (!tapestry) return;
    const thread = tapestry.querySelector('.tapestry-thread');
    const formattedDate = formatDate(iso);
    items.forEach((item, index) => {
      if (tapestry.querySelector(`[data-blob-path="${CSS.escape(item.pathname)}"]`)) return;
      const piece = createPiece(item, formattedDate, index);
      const position = tapestry.querySelectorAll('.tapestry-piece').length;
      piece.classList.add(position % 3 === 0 ? 'tapestry-small' : position % 3 === 1 ? 'tapestry-wide' : 'tapestry-small');
      tapestry.insertBefore(piece, thread || null);
    });
    if (tapestry.querySelectorAll('.tapestry-piece').length > 3) {
      tapestry.classList.add('dynamic-tapestry');
    }
  }

  function createDayRoom(iso, items, data, isToday) {
    const section = document.createElement('section');
    const titleId = `gallery-title-${iso}`;
    const formattedDate = formatDate(iso);
    section.className = 'today-room dynamic-day-room';
    section.dataset.galleryDate = iso;
    section.setAttribute('aria-labelledby', titleId);

    const heading = document.createElement('div');
    heading.className = 'section-heading';
    heading.innerHTML = `<p class="eyebrow">Tagesgalerie · ${formattedDate}</p><h2 id="${titleId}">${isToday ? 'Der heutige Bildraum' : 'Der gemeinsame Bildraum'}</h2><p>${dayDetails(iso, data)}</p>`;

    const tapestry = document.createElement('div');
    tapestry.className = `image-tapestry dynamic-tapestry count-${Math.min(items.length, 4)}`;
    tapestry.setAttribute('aria-label', `Wahrnehmungen des gemeinsamen Tagesraums vom ${formattedDate}`);
    items.forEach((item, index) => tapestry.appendChild(createPiece(item, formattedDate, index)));

    const thread = document.createElement('div');
    thread.className = 'tapestry-thread';
    thread.setAttribute('aria-hidden', 'true');
    thread.innerHTML = '<span></span><p>Kein Mittelpunkt muss für alle derselbe sein.</p><span></span>';
    tapestry.appendChild(thread);
    section.append(heading, tapestry);
    return section;
  }

  Promise.all([
    fetch('/api/tagesgalerie-liste', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject()),
    fetch('data/itschana-flh.json', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject())
  ]).then(([galleryData, itschanaData]) => {
    const groups = new Map();
    (galleryData.images || []).forEach(item => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) return;
      if (!groups.has(item.date)) groups.set(item.date, []);
      groups.get(item.date).push(item);
    });

    const todayIso = ItschanaCalendar.isoFromDate(ItschanaCalendar.today());
    [...groups.keys()].sort().reverse().forEach(iso => {
      const existingRoom = document.querySelector(`[data-gallery-date="${CSS.escape(iso)}"]`);
      if (existingRoom) {
        addImagesToExistingRoom(existingRoom, groups.get(iso), iso);
        return;
      }
      dynamicRoot.appendChild(createDayRoom(iso, groups.get(iso), itschanaData, iso === todayIso));
    });
  }).catch(() => {
    dynamicRoot.innerHTML = '<p class="gallery-load-note">Die weiteren Bildräume konnten gerade nicht geöffnet werden.</p>';
  });
})();
