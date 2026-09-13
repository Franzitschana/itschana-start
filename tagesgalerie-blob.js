(function(){
  'use strict';
  const room=document.querySelector('.today-room');
  if(!room) return;
  const heading=room.querySelector('.section-heading .eyebrow');
  const match=heading && heading.textContent.match(/(\d{1,2})\.\s+([A-Za-zäöüÄÖÜ]+)\s+(\d{4})/);
  if(!match) return;
  const months={Januar:'01',Februar:'02',März:'03',April:'04',Mai:'05',Juni:'06',Juli:'07',August:'08',September:'09',Oktober:'10',November:'11',Dezember:'12'};
  const date=`${match[3]}-${months[match[2]]||''}-${String(match[1]).padStart(2,'0')}`;
  if(!months[match[2]]) return;
  const tapestry=room.querySelector('.image-tapestry');
  if(!tapestry) return;
  fetch(`/api/tagesgalerie-liste?date=${encodeURIComponent(date)}`,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
    (data.images||[]).forEach((item,index)=>{
      if(tapestry.querySelector(`[data-blob-path="${CSS.escape(item.pathname)}"]`)) return;
      const article=document.createElement('article');
      article.className='tapestry-piece '+(index%3===0?'tapestry-small':index%3===1?'tapestry-wide':'tapestry-small');
      article.dataset.blobPath=item.pathname;
      const img=document.createElement('img'); img.className='woven-photo'; img.alt=`Geteilte Wahrnehmung vom ${match[1]}. ${match[2]} ${match[3]}`; img.src=`/api/tagesgalerie-bild?pathname=${encodeURIComponent(item.pathname)}`;
      const copy=document.createElement('div'); copy.className='woven-copy'; copy.innerHTML='<span class="card-kicker">Geteilte Wahrnehmung</span><p>Ein Bild im gemeinsamen Tagesraum.</p>';
      article.append(img,copy);
      const thread=tapestry.querySelector('.tapestry-thread'); tapestry.insertBefore(article,thread||null);
    });
  }).catch(()=>{});
})();
