(function () {
  'use strict';
  const WORKSHOP_KEY = 'itschana_werkstattmodus';
  const image = document.getElementById('generated-room-image');
  const takeaway = document.getElementById('image-takeaway');
  if (!image || !takeaway || !window.ItschanaCalendar) return;
  try { if (localStorage.getItem(WORKSHOP_KEY) !== '1') return; } catch (_) { return; }

  const wrap = document.createElement('div');
  wrap.className = 'image-takeaway';
  wrap.hidden = true;
  wrap.innerHTML = '<button type="button" class="button button-primary" id="share-room-image">Mein Bild in die Tagesgalerie geben</button><span id="share-room-status">Werkstatt-Test: freiwillig in den gemeinsamen Bildraum geben.</span>';
  takeaway.insertAdjacentElement('afterend', wrap);
  const button = wrap.querySelector('#share-room-image');
  const status = wrap.querySelector('#share-room-status');

  function sync(){ wrap.hidden = !(image.getAttribute('src') || '').startsWith('data:image/png;base64,'); button.disabled = false; button.textContent = 'Mein Bild in die Tagesgalerie geben'; }
  image.addEventListener('load', sync);
  sync();

  button.addEventListener('click', async function(){
    const src = image.getAttribute('src') || '';
    if (!src.startsWith('data:image/png;base64,')) return;
    if (!window.confirm('Dieses Bild wirklich in den gemeinsamen Tagesraum geben?')) return;
    button.disabled = true;
    status.textContent = 'Das Bild findet seinen Platz in der Tagesgalerie …';
    try {
      const date = ItschanaCalendar.isoFromDate(ItschanaCalendar.today());
      const response = await fetch('/api/tagesgalerie-upload', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ image:src, date }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Das Teilen ist gerade nicht gelungen.');
      button.textContent = 'Bild ist in der Tagesgalerie';
      status.innerHTML = 'Gespeichert. <a href="tagesgalerie.html">Tagesgalerie öffnen</a>';
    } catch (error) {
      button.disabled = false;
      status.textContent = error.message;
    }
  });
})();
