(function () {
  'use strict';
  const image = document.getElementById('generated-room-image');
  const takeaway = document.getElementById('image-takeaway');
  if (!image || !takeaway || !window.ItschanaCalendar) return;

  const wrap = document.createElement('div');
  wrap.className = 'image-takeaway';
  wrap.hidden = true;
  wrap.innerHTML = '<button type="button" class="button button-primary" id="share-room-image">Mein Bild in die Tagesgalerie geben</button><span id="share-room-status">Freiwillig: Dein Bild kann Teil des gemeinsamen Tagesraums werden.</span>';
  takeaway.insertAdjacentElement('afterend', wrap);
  const button = wrap.querySelector('#share-room-image');
  const status = wrap.querySelector('#share-room-status');

  function sync(){
    const hasImage = (image.getAttribute('src') || '').startsWith('data:image/png;base64,');
    const hasToken = Boolean(image.dataset.shareToken);
    wrap.hidden = !(hasImage && hasToken);
    button.disabled = false;
    button.textContent = 'Mein Bild in die Tagesgalerie geben';
    if (hasImage && hasToken) status.textContent = 'Freiwillig: Dein Bild kann Teil des gemeinsamen Tagesraums werden.';
  }

  image.addEventListener('load', sync);
  sync();

  button.addEventListener('click', async function(){
    const src = image.getAttribute('src') || '';
    const shareToken = image.dataset.shareToken || '';
    const date = image.dataset.shareDate || ItschanaCalendar.isoFromDate(ItschanaCalendar.today());
    if (!src.startsWith('data:image/png;base64,') || !shareToken) return;
    if (!window.confirm('Dieses Bild wirklich in den gemeinsamen Tagesraum geben?')) return;

    button.disabled = true;
    status.textContent = 'Das Bild findet seinen Platz in der Tagesgalerie …';
    try {
      const response = await fetch('/api/tagesgalerie-upload', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ image:src, date, shareToken })
      });
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
