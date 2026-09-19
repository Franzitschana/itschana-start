(function () {
  'use strict';

  const form = document.getElementById('birthday-form');
  if (!form) return;

  const DAY_MS = 86400000;
  const TRANSITION = new Date(Date.UTC(1989, 10, 20));
  const OLD_ANCHOR = new Date(Date.UTC(1989, 10, 19));
  const OLD_ANCHOR_KIN = 49;
  const OLD_ANCHOR_TONE_INDEX = 7;
  const OLD_ANCHOR_FIGURE_INDEX = 4;
  const oldFigures = [
    'Die Blaue Nacht', 'Der Gelbe Samen', 'Die Rote Schlange', 'Der Weiße Weltenüberbrücker',
    'Die Blaue Hand', 'Der Gelbe Stern', 'Der Rote Mond', 'Der Weiße Hund', 'Der Blaue Affe',
    'Der Gelbe Mensch', 'Der Rote Himmelswanderer', 'Der Weiße Magier', 'Der Blaue Adler',
    'Der Gelbe Krieger', 'Die Rote Erde', 'Der Weiße Spiegel', 'Der Blaue Sturm',
    'Die Gelbe Sonne', 'Der Rote Drache', 'Der Weiße Wind'
  ];
  const toneKeywords = ['Bestimmung', 'Herausforderung', 'Dienen', 'Form', 'Strahlung', 'Gleichheit', 'Gleichklang', 'Ganzheit', 'Absicht', 'Manifestation', 'Befreiung', 'Zusammenarbeit', 'Gegenwärtigkeit'];
  const toneDimensions = ['Zeit', 'Leben', 'Sinne', 'Bewusstsein', 'Zeit', 'Leben', 'Sinne', 'Bewusstsein', 'Zeit', 'Leben', 'Sinne', 'Bewusstsein', 'Zeit'];
  let itschanaData;

  function modulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function parseDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!match) return null;
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    return date.getUTCFullYear() === Number(match[1]) && date.getUTCMonth() === Number(match[2]) - 1 && date.getUTCDate() === Number(match[3]) ? date : null;
  }

  function addYears(date, years) {
    const year = date.getUTCFullYear() + years;
    const month = date.getUTCMonth();
    const day = Math.min(date.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
    return new Date(Date.UTC(year, month, day));
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
  }

  function oldEnergy(date) {
    const difference = Math.round((date - OLD_ANCHOR) / DAY_MS);
    const kin = modulo(OLD_ANCHOR_KIN - 1 + difference, 260) + 1;
    const toneIndex = modulo(OLD_ANCHOR_TONE_INDEX + difference, 13);
    const figureIndex = modulo(OLD_ANCHOR_FIGURE_INDEX + difference, 20);
    const waveIndex = modulo(figureIndex - toneIndex, 20);
    return {
      system: '260er-Feld', kin, figure: oldFigures[figureIndex],
      tone: toneIndex + 1, keyword: toneKeywords[toneIndex], dimension: toneDimensions[toneIndex],
      wave: oldFigures[waveIndex]
    };
  }

  function newEnergy(date) {
    const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const kinNumber = ItschanaCalendar.kinForDate(localDate);
    const kin = itschanaData.kins.find(entry => entry.number === kinNumber);
    const tone = itschanaData.tones.find(entry => entry.number === kin.toneNumber);
    const figure = itschanaData.figures.find(entry => entry.number === kin.figureNumber);
    const wave = itschanaData.figures.find(entry => entry.number === kin.waveFigureNumber);
    return {
      system: '273er-Itschana-Feld', kin: kin.number, figure: figure.name,
      tone: tone.number, keyword: tone.keyword, dimension: tone.dimension.replace('Dimension der ', ''),
      wave: wave.name
    };
  }

  function energyForDate(date) {
    return date < TRANSITION ? oldEnergy(date) : newEnergy(date);
  }

  function showEnergy(prefix, energy) {
    document.getElementById(`${prefix}-kin`).textContent = `KIN ${energy.kin}`;
    document.getElementById(`${prefix}-figure`).textContent = energy.figure;
    document.getElementById(`${prefix}-details`).innerHTML = `Ton ${energy.tone} · ${energy.keyword}<br>Ebene: ${energy.dimension}<br>Welle: ${energy.wave}<br>${energy.system}`;
  }

  function calculate() {
    const error = document.getElementById('birthday-error');
    const result = document.getElementById('birthday-result');
    error.textContent = '';
    const birth = parseDate(document.getElementById('birthday-date').value);
    const year = Number(document.getElementById('birthday-year').value);
    const name = document.getElementById('birthday-name').value.trim() || 'Dein persönlicher Raum';
    if (!birth || !Number.isInteger(year) || year < birth.getUTCFullYear() || year > 2200) {
      result.hidden = true;
      error.textContent = 'Bitte gib ein gültiges Geburtsdatum und ein Geburtstagsjahr nach der Geburt ein.';
      return;
    }

    const age = year - birth.getUTCFullYear();
    const cycleIndex = Math.floor(age / 52);
    const cycleStart = addYears(birth, cycleIndex * 52);
    const nextCycleStart = addYears(cycleStart, 52);
    const cycleEnd = new Date(nextCycleStart.getTime() - DAY_MS);
    const annualDate = new Date(Date.UTC(year, birth.getUTCMonth(), Math.min(birth.getUTCDate(), new Date(Date.UTC(year, birth.getUTCMonth() + 1, 0)).getUTCDate())));
    const cycleEnergy = energyForDate(cycleStart);
    const annualEnergy = energyForDate(annualDate);
    const cycleYear = age - cycleIndex * 52 + 1;

    document.getElementById('result-name').textContent = name;
    document.getElementById('result-title').textContent = `${cycleYear}. Jahr im ${cycleIndex + 1}. Lebenszyklus`;
    document.getElementById('result-period').textContent = `${formatDate(cycleStart)} bis ${formatDate(cycleEnd)}`;
    document.getElementById('annual-label').textContent = `Geburtstagsenergie ${year}`;
    showEnergy('cycle', cycleEnergy);
    showEnergy('annual', annualEnergy);
    document.getElementById('result-note').textContent = `Die Lebenskraft wurde am Beginn dieses 52-jährigen Zyklus geprägt und bleibt dessen Grundbegleiter. Die Geburtstagsenergie vom ${formatDate(annualDate)} kommt für dieses Lebensjahr hinzu.`;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (itschanaData) calculate();
  });

  fetch('data/itschana-flh.json', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => { itschanaData = data; calculate(); })
    .catch(() => { document.getElementById('birthday-error').textContent = 'Die Itschana-Daten konnten gerade nicht geöffnet werden.'; });
})();
