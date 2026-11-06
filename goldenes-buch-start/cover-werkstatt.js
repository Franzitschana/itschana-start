(()=>{'use strict';
const $=id=>document.getElementById(id),canvas=$('cover'),ctx=canvas.getContext('2d');
const KEY='goldenes-buch-v315-covergalerie-v1';
const CURRENT_COVER_KEY='goldenes-buch-v320-aktuelles-cover';
const draft={seed:42, uploaded:null, restored:null};
let gallery=[]; let voice=null;
const colors={sterne:'#253c72',wald:'#365b3f',meer:'#337e99',fantasie:'#9255a0',original:'#3b6580',bild:'#946e46'};
const rand=()=>{draft.seed=(Math.imul(1664525,draft.seed)+1013904223)>>>0;return draft.seed/4294967296};
const status=t=>{$('status').textContent=t};
const voiceInfo=t=>{$('voiceInfo').textContent=t};
const fit=(s,max=120)=>String(s||'').trim().slice(0,max);
const round=(x,y,w,h,r,fill)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()};
function gradient(a,b){const g=ctx.createLinearGradient(0,0,0,900);g.addColorStop(0,a);g.addColorStop(1,b);return g}
function star(x,y,r=2){ctx.fillStyle='rgba(255,236,161,.88)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,236,161,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-r*2,y);ctx.lineTo(x+r*2,y);ctx.moveTo(x,y-r*2);ctx.lineTo(x,y+r*2);ctx.stroke()}
function landscape(type,color){
ctx.fillStyle=gradient(color,'#e7c28f');ctx.fillRect(0,0,600,900);
if(type==='sterne'||type==='fantasie'){
 ctx.fillStyle='rgba(13,26,73,.55)';ctx.fillRect(0,0,600,560);
 for(let i=0;i<180;i++)star(rand()*600,rand()*700,rand()*2+.5);
 if(type==='fantasie'){
  for(let i=0;i<9;i++){ctx.strokeStyle=['#d6a8e7','#a4ebe2','#edb4c1'][i%3]+'66';ctx.lineWidth=40+i*4;ctx.beginPath();ctx.moveTo(rand()*600,-70);ctx.bezierCurveTo(rand()*900,300,rand()*700,500,rand()*600,900);ctx.stroke()}
 }
}else if(type==='wald'){
 for(let i=0;i<18;i++){let x=i*42-30,h=180+rand()*380;ctx.fillStyle=i%2?'#16402e':'#527657';ctx.beginPath();ctx.moveTo(x,800);ctx.lineTo(x+28,800-h);ctx.lineTo(x+68,800);ctx.fill()}
}else if(type==='meer'){
 const sun=ctx.createRadialGradient(395,340,5,395,340,210);sun.addColorStop(0,'#fffed2');sun.addColorStop(1,'#ffdd9988');ctx.fillStyle=sun;ctx.fillRect(0,100,600,450);
 for(let i=0;i<22;i++){const y=480+i*20;ctx.fillStyle=i%2?'#427b9a':'#64a5ba';ctx.fillRect(0,y,600,19);ctx.strokeStyle='#e9e3c55c';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(600,y+6);ctx.stroke()}
}
ctx.fillStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.moveTo(0,790);ctx.lineTo(165,490);ctx.lineTo(290,710);ctx.lineTo(390,480);ctx.lineTo(600,750);ctx.lineTo(600,900);ctx.lineTo(0,900);ctx.fill();
}
function ornament(type){
 const cx=300,cy=425;ctx.save();ctx.lineWidth=7;ctx.strokeStyle='#eac47b';ctx.fillStyle='#f1cf89';
 if(type==='baum'){
  ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,610);ctx.lineTo(cx,cy+60);ctx.stroke();
  for(let i=0;i<8;i++){let a=(i/7)*Math.PI+.1,sign=i%2?-1:1;ctx.lineWidth=8-i*.55;ctx.beginPath();ctx.moveTo(cx,cy+58);ctx.quadraticCurveTo(cx+sign*90,cy-40,cx+sign*(60+rand()*125),cy-65-rand()*90);ctx.stroke()}
  for(let i=0;i<72;i++){let a=rand()*Math.PI*2,r=rand()*150;ctx.fillStyle=['#d0b25c','#f8e5a5','#83a889'][i%3];ctx.beginPath();ctx.ellipse(cx+Math.cos(a)*r,cy-80+Math.sin(a)*r*.8,3+rand()*7,3+rand()*4,rand()*Math.PI,0,2*Math.PI);ctx.fill()}
 }else if(type==='herz'){
  ctx.fillStyle='rgba(252,211,151,.8)';ctx.beginPath();ctx.moveTo(cx,cy+115);ctx.bezierCurveTo(cx-240,cy-50,cx-110,cy-110,cx,cy-20);ctx.bezierCurveTo(cx+110,cy-110,cx+240,cy-50,cx,cy+115);ctx.fill();ctx.stroke();
 }else if(type==='regenbogen'){
  for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(cx,cy+110,210-i*17,Math.PI,2*Math.PI);ctx.strokeStyle=['#f4aebc','#f7c17a','#fee092','#83bf98','#78b8d8','#a2a8ea','#c9a0dc'][i];ctx.lineWidth=15;ctx.stroke()}
 }else if(type==='sonne'){
  ctx.fillStyle='#fbe3a0';ctx.beginPath();ctx.arc(cx,cy,80,0,2*Math.PI);ctx.fill();
  for(let i=0;i<22;i++){const a=i*Math.PI/11;ctx.strokeStyle='#ffe5ad';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*105,cy+Math.sin(a)*105);ctx.lineTo(cx+Math.cos(a)*140,cy+Math.sin(a)*140);ctx.stroke()}
 }else if(type==='sterne'){
  for(let i=0;i<38;i++)star(100+rand()*400,210+rand()*420,2+rand()*8);
 }
 ctx.restore();
}
const customImg=new Image();customImg.src='./familien-cover.jpg';customImg.onload=()=>render();
function coverImage(img){let iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;const ratio=Math.max(600/iw,900/ih);let w=iw*ratio,h=ih*ratio;ctx.drawImage(img,(600-w)/2,(900-h)/2,w,h)}
function fitText(txt,centerY,start=46,maxWidth=520){ctx.font=`bold ${start}px Georgia,serif`;while(ctx.measureText(txt).width>maxWidth&&start>18){start-=2;ctx.font=`bold ${start}px Georgia,serif`}ctx.fillText(txt,300,centerY)}
// Nur Darstellung: volle Namen ohne Abschneiden, bei Bedarf mehrzeilig.
function nameLines(text,width){
 const out=[];let line='';
 for(const word of text.trim().split(/\s+/)){
  const together=line?line+' '+word:word;
  if(ctx.measureText(together).width<=width){line=together;continue}
  if(line){out.push(line);line=''}
  // Auch außergewöhnlich lange Namen ohne Leerzeichen sollen sichtbar sein.
  for(const letter of Array.from(word)){
   if(line&&ctx.measureText(line+letter).width>width){out.push(line);line=letter}
   else line+=letter
  }
 }
 if(line)out.push(line);
 return out.length?out:['Mein Goldenes Buch'];
}
function drawPersonName(text){
 let lines=[],size=44,lineHeight=34,first=775;
 for(;size>=12;size--){
  ctx.font=`bold ${size}px Georgia,serif`;
  lines=nameLines(text,448);
  lineHeight=Math.min(35,Math.max(14,Math.round(size*1.14)));
  const bottom=lines.length===1?775:791;
  first=bottom-(lines.length-1)*lineHeight;
  // Alles muss innerhalb des Namensfeldes bleiben (auch die erste Zeile).
  if(lines.length<=5 && first-size*.86>=707)break;
 }
 ctx.font=`bold ${size}px Georgia,serif`;
 for(let i=0;i<lines.length;i++)ctx.fillText(lines[i],300,first+i*lineHeight);
}
function coverBirthday(){
 const value=$('birthOnCover').value;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
 const [y,m,d]=value.split('-').map(Number);
 const dt=new Date(Date.UTC(y,m-1,d));
 if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d)return '';
 return String(d).padStart(2,'0')+'.'+String(m).padStart(2,'0')+'.'+y;
}
function baseArt(){
 const type=$('style').value;
 const primary=$('color').value;
 ctx.clearRect(0,0,600,900);
 if(type==='original'&&customImg.complete&&customImg.naturalWidth){coverImage(customImg);round(107,324,386,290,175,'#fff8eac9');}
 else if(draft.uploaded&&(type==='bild'||type==='original')){coverImage(draft.uploaded);ctx.fillStyle='#182c3899';ctx.fillRect(0,0,600,900)}
 else {landscape(type==='original'?'sterne':type,primary);ornament($('motive').value)}
 if(draft.uploaded&&type!=='bild'&&type!=='original'){
  ctx.save();ctx.beginPath();ctx.ellipse(300,435,138,169,0,0,Math.PI*2);ctx.clip();let w=draft.uploaded.naturalWidth,h=draft.uploaded.naturalHeight;let k=Math.max(276/w,338/h);ctx.drawImage(draft.uploaded,300-w*k/2,435-h*k/2,w*k,h*k);ctx.restore();ctx.beginPath();ctx.ellipse(300,435,143,174,0,0,Math.PI*2);ctx.strokeStyle='#f8d78b';ctx.lineWidth=13;ctx.stroke()
 }
 // Border and name plaque deliberately remain readable for all backgrounds.
 ctx.strokeStyle='#eac584';ctx.lineWidth=9;ctx.strokeRect(18,18,564,864);ctx.lineWidth=2;ctx.strokeRect(34,34,532,832);
 if(type!=='original'&&type!=='bild'){round(42,55,516,160,25,'#fff4daed')}
 else round(42,48,516,144,23,'#fff4daed');
 ctx.textAlign='center';ctx.fillStyle='#3f2e22';fitText('DAS GOLDENE BUCH',106,34);fitText('DEINES LEBENS',150,38);ctx.font='18px Georgia,serif';ctx.fillText('EIN LEBEN · VIELE ERINNERUNGEN · EIN BUCH',300,177);
 round(51,685,498,185,20,'#fff2d9f2');ctx.strokeStyle='#caa25f';ctx.lineWidth=3;ctx.strokeRect(64,698,472,161);
 ctx.fillStyle='#51351e';drawPersonName(fit($('name').value)||'Mein Goldenes Buch');
 const birthday=coverBirthday();
 if(birthday){ctx.font='20px Georgia,serif';ctx.fillStyle='#644c39';ctx.fillText('Geboren am '+birthday,300,824)}
 if($('useEnergy').checked){const tag=[fit($('energy').value,32),fit($('tone').value,20)].filter(Boolean).join(' · ');if(tag){ctx.font='16px Georgia,serif';ctx.fillStyle='#644c39';fitText(tag,849,16,440)}}
}
function render(){
 if(draft.restored){ctx.clearRect(0,0,600,900);ctx.drawImage(draft.restored,0,0,600,900);return}
 const seed=draft.seed;draft.seed=(seed||42)>>>0;baseArt();draft.seed=seed;
}
function newDraft(){draft.restored=null;render()}
function shrink(width=360,height=540,quality=.83){const c=document.createElement('canvas');c.width=width;c.height=height;const cc=c.getContext('2d');cc.drawImage(canvas,0,0,width,height);return c.toDataURL('image/jpeg',quality)}
function download(href,name){const a=document.createElement('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove()}
function safeName(){return (fit($('name').value)||'Mein-Cover').replace(/[^a-zA-Z0-9äöüÄÖÜß_-]+/g,'-').slice(0,50)}
async function loadBirthdayFromBook(){
 // Buch und Werkstatt laufen auf demselben Port; keine Daten verlassen den Rechner.
 // Nur lesen: am Buchprofil oder dessen gespeicherten Geburtstag wird nichts geändert.
 if(!window.indexedDB||$('birthOnCover').value)return;
 await new Promise(resolve=>{
  let request;
  try{request=indexedDB.open('GoldenesBuchV320Startklar')}catch(e){resolve();return}
  request.onerror=()=>resolve();
  request.onsuccess=()=>{
   const db=request.result;
   try{
    if(!db.objectStoreNames.contains('data')){db.close();resolve();return}
    const tx=db.transaction('data','readonly');
    const q=tx.objectStore('data').get('profile');
    q.onsuccess=()=>{
     const birth=q.result?.birth;
     if(/^\d{4}-\d{2}-\d{2}$/.test(birth||'')&&!$('birthOnCover').value){$('birthOnCover').value=birth;newDraft()}
    };
    tx.oncomplete=()=>{db.close();resolve()};
    tx.onerror=()=>{db.close();resolve()};
   }catch(e){db.close();resolve()}
  }
 })
}
async function bookLabel(){newDraft();await loadBirthdayFromBook()}
async function picture(file){if(!file||!file.type.match(/^image\/(jpeg|png|webp|gif)$/)){status('Bitte ein JPG-, PNG-, WebP- oder GIF-Bild wählen.');return}
if(file.size>15000000){status('Das Bild ist zu groß. Bitte eine Datei bis 15 MB wählen.');return}
const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);draft.uploaded=img;$('style').value='bild';newDraft();status('Dein Bild ist in der Vorschau. Erst mit „Als Regalcover übernehmen“ wird es gespeichert.')};img.onerror=()=>{URL.revokeObjectURL(url);status('Das Bild konnte nicht gelesen werden.')};img.src=url}
function loadGallery(){try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(data))gallery=data.filter(g=>g&&typeof g.pic==='string'&&g.pic.startsWith('data:image/jpeg;base64,')).slice(0,12)}catch(e){gallery=[]}paintGallery()}
function saveGallery(){try{localStorage.setItem(KEY,JSON.stringify(gallery));paintGallery();return true}catch(e){status('Der Browser-Speicher ist voll. Bitte lade eine Galerie-Sicherung herunter und lösche erst danach alte Cover.');return false}}
function paintGallery(){const root=$('gallery');root.replaceChildren();if(!gallery.length){const p=document.createElement('p');p.textContent='Noch keine Cover gespeichert.';p.className='muted';root.append(p);return}
 gallery.forEach((entry,i)=>{const card=document.createElement('div');card.className='gallery-card';const img=document.createElement('img');img.src=entry.pic;img.alt='Gespeichertes Cover '+(entry.title||i+1);const time=document.createElement('span');time.textContent=(entry.title||'Cover')+' · '+new Date(entry.time).toLocaleDateString('de-AT');time.style.cssText='font-size:12px;overflow-wrap:anywhere';const restore=document.createElement('button');restore.type='button';restore.textContent='Ansehen';restore.addEventListener('click',()=>{const image=new Image();image.onload=()=>{draft.restored=image;render();window.scrollTo({top:0,behavior:'smooth'});status('Cover aus der Galerie geladen. Du kannst es erneut als aktuelles Regalcover übernehmen.')};image.src=entry.pic});const del=document.createElement('button');del.type='button';del.className='secondary';del.textContent='Entfernen';del.addEventListener('click',()=>{if(!confirm('Dieses Cover nur aus der Galerie entfernen?'))return;gallery.splice(i,1);saveGallery()});card.append(img,time,restore,del);root.append(card)})}
function keepCover(){const g={pic:shrink(),title:fit($('name').value,120)||'Cover',time:new Date().toISOString()};gallery.unshift(g);gallery=gallery.slice(0,12);if(saveGallery())status('Dieses Cover wurde in deiner persönlichen Galerie aufbewahrt.')}
function analyze(){const text=$('story').value.toLowerCase();if(!text.trim()){status('Erzähl zuerst ein wenig von deinem Bild.');return}
 const group=[[/drache|magie|fantasie|märchen|zauber|regenbogen|einhorn/,'fantasie'],[/wald|baum|blumen|garten|wiese|berg|natur/,'wald'],[/meer|wasser|strand|wellen|see|fluss/,'meer'],[/universum|kosmos|mond|stern|galaxie|nacht/,'sterne']];let style=group.find(([re])=>re.test(text));if(style)$('style').value=style[1];else $('style').value='fantasie';
 const cs=[[/lila|violett|purpur/,'#804eae'],[/rosa|pink/,'#bd6c9b'],[/türkis/,'#328e93'],[/grün/,'#38684a'],[/blau/,'#285b87'],[/rot/,'#b6534b'],[/gelb|gold/,'#b98b33'],[/orange/,'#c77b35']];let color=cs.find(([re])=>re.test(text));if(color)$('color').value=color[1];
 const ms=[[/regenbogen/,'regenbogen'],[/baum|wald/,'baum'],[/herz|liebe/,'herz'],[/stern|nacht|mond/,'sterne'],[/sonne|licht/,'sonne']];let motif=ms.find(([re])=>re.test(text));if(motif)$('motive').value=motif[1];
 draft.seed=(Date.now()>>>0);newDraft();status('Aus deinen Worten habe ich eine erste symbolische Vorlage gemacht. Du kannst sie verändern oder neu mischen.')
}
function voiceStart(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){voiceInfo('Dein Browser bietet hier keine Spracheingabe. Du kannst deine Gedanken ins Feld schreiben.');return}
 if(voice){try{voice.stop()}catch(e){}return}
 const rec=new SR();rec.lang='de-AT';rec.interimResults=false;rec.continuous=true;
 rec.onstart=()=>{voiceInfo('Ich höre zu. Zum Beenden erneut auf „Erzählen“ klicken.');$('speak').classList.add('recording');$('speak').textContent='⏹ Diktat stoppen'};
 rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)$('story').value+=($('story').value.trim()?' ':'')+e.results[i][0].transcript};
 rec.onerror=e=>voiceInfo('Spracheingabe nicht verfügbar ('+e.error+'). Schreiben funktioniert weiterhin.');
 rec.onend=()=>{voice=null;$('speak').classList.remove('recording');$('speak').textContent='🎤 Erzählen'};
 voice=rec;try{rec.start()}catch(e){voice=null;voiceInfo('Spracherkennung konnte nicht starten. Bitte schreiben.')}}
for(const id of ['name','birthOnCover','style','color','motive','useEnergy','energy','tone'])$(id).addEventListener('input',newDraft);
$('upload').addEventListener('change',e=>picture(e.target.files[0]));
$('speak').addEventListener('click',voiceStart);
$('make').addEventListener('click',analyze);
$('draw').addEventListener('click',newDraft);
$('shuffle').addEventListener('click',()=>{const styles=['sterne','wald','meer','fantasie'];$('style').value=styles[Math.floor(Math.random()*styles.length)];$('color').value=colors[$('style').value];draft.seed=Date.now()>>>0;newDraft();status('Ein neuer Entwurf! Du entscheidest, ob er dir gefällt.')});
$('keep').addEventListener('click',keepCover);
$('export').addEventListener('click',()=>download(canvas.toDataURL('image/png'),'Goldenes-Cover-'+safeName()+'.png'));
$('accept').addEventListener('click',async()=>{const button=$('accept');button.disabled=true;status('Das aktuelle Regalcover wird gespeichert …');try{
 const src=shrink(400,600,.86);localStorage.setItem(CURRENT_COVER_KEY,src);
 status('Dein aktuelles Buchcover ist auf diesem Gerät gespeichert.')
 }catch(e){status('Speichern leider nicht möglich: '+e.message+'. Das bisherige Cover bleibt erhalten.')}finally{button.disabled=false}});
$('galleryExport').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({format:'covergalerie-v315',date:new Date().toISOString(),covers:gallery})],{type:'application/json'});const url=URL.createObjectURL(blob);download(url,'Meine-Covergalerie-'+safeName()+'.json');setTimeout(()=>URL.revokeObjectURL(url),5000);status('Galerie-Sicherungsdatei wurde zum Herunterladen angeboten.')});
$('galleryImport').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(f.size>3500000){status('Galerie-Sicherung zu groß.');return}try{const data=JSON.parse(await f.text());if(data.format!=='covergalerie-v315'||!Array.isArray(data.covers))throw Error('Falsches Galerie-Format');const incoming=data.covers.filter(g=>g&&typeof g.pic==='string'&&g.pic.startsWith('data:image/jpeg;base64,')&&g.pic.length<300000&&typeof g.title==='string');if(!confirm('Diese Galerie-Sicherung einlesen? Die aktuellen Cover bleiben unverändert. Die vorhandene Galerie wird ergänzt (maximal 12 Bilder).'))return;gallery=[...incoming,...gallery].slice(0,12);saveGallery();status('Galerie-Sicherung eingelesen.')}catch(err){status('Galerie-Datei konnte nicht eingelesen werden: '+err.message)}finally{e.target.value=''}});

// Mein Cover-Fotoalbum: freiwillig ausgewählte Motive, getrennt für jeden lokalen Buch-Port.
// Es wird nichts an einen Fremdserver geschickt. Bilder liegen komprimiert in IndexedDB.
const ALBUM_DB='goldenes-buch-v320-startklar-fotoalbum', ALBUM_STORE='bilder', MAX_PHOTOS=20;
let albumDb=null, albumUrls=[];
const albumInfo=t=>{$('albumInfo').textContent=t};
const albumName=s=>String(s||'Mein Bild').replace(/\.[^.]{1,5}$/,'').trim().slice(0,65)||'Mein Bild';
function openAlbum(){return new Promise((ok,fail)=>{
 if(!window.indexedDB){fail(Error('Dieser Browser bietet keinen lokalen Fotoalbum-Speicher.'));return}
 const req=indexedDB.open(ALBUM_DB,1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(ALBUM_STORE))req.result.createObjectStore(ALBUM_STORE,{keyPath:'id'})};
 req.onsuccess=()=>{albumDb=req.result;albumDb.onversionchange=()=>{albumDb.close();albumDb=null};ok(albumDb)};
 req.onerror=()=>fail(req.error||Error('Album kann nicht geöffnet werden'));
})}
function albumTx(mode,action){return new Promise((ok,fail)=>{
 if(!albumDb){fail(Error('Fotoalbum-Speicher ist nicht bereit'));return}
 const tx=albumDb.transaction(ALBUM_STORE,mode), store=tx.objectStore(ALBUM_STORE);
 let result;let req;
 try{req=action(store)}catch(e){fail(e);return}
 req.onsuccess=()=>{result=req.result};req.onerror=()=>{};
 tx.oncomplete=()=>ok(result);tx.onerror=()=>fail(tx.error||Error('Album-Speicherfehler'));tx.onabort=()=>fail(tx.error||Error('Album konnte nicht gespeichert werden'));
})}
const albumAll=()=>albumTx('readonly',store=>store.getAll());
const albumPut=entry=>albumTx('readwrite',store=>store.put(entry));
const albumDelete=id=>albumTx('readwrite',store=>store.delete(id));
function albumBlob(file){return new Promise((ok,fail)=>{
 const url=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{try{
  const max=900, k=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*k));c.height=Math.max(1,Math.round(im.naturalHeight*k));
  const cx=c.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,c.width,c.height);cx.drawImage(im,0,0,c.width,c.height);
  c.toBlob(blob=>blob?ok(blob):fail(Error('Foto konnte nicht verkleinert werden')),'image/jpeg',.76);
 }catch(e){fail(e)}finally{URL.revokeObjectURL(url)}};
 im.onerror=()=>{URL.revokeObjectURL(url);fail(Error('Foto konnte nicht gelesen werden'))};im.src=url;
})}
function loadAlbumPicture(entry){
 const url=URL.createObjectURL(entry.blob),img=new Image();
 img.onload=()=>{draft.uploaded=img;draft.restored=null;$('style').value='bild';render();URL.revokeObjectURL(url);window.scrollTo({top:0,behavior:'smooth'});status('Dein Foto „'+entry.title+'“ wurde in die Cover-Vorschau übernommen. Erst du entscheidest, ob es dein aktuelles Regalcover wird.')};
 img.onerror=()=>{URL.revokeObjectURL(url);albumInfo('Dieses Albumfoto kann nicht geöffnet werden.')};img.src=url;
}
async function paintAlbum(){try{
 const all=await albumAll(),root=$('album');root.replaceChildren();albumUrls.forEach(URL.revokeObjectURL);albumUrls=[];
 if(!all.length){const p=document.createElement('p');p.textContent='Noch keine Fotos in deinem Album.';p.className='muted';root.append(p);return}
 all.sort((a,b)=>String(b.year||'').localeCompare(String(a.year||''),'de')||String(b.added||'').localeCompare(String(a.added||'')));
 all.forEach(entry=>{const card=document.createElement('div');card.className='gallery-card';const img=document.createElement('img');const url=URL.createObjectURL(entry.blob);albumUrls.push(url);img.src=url;img.alt=entry.title;
  const title=document.createElement('span');title.textContent=(entry.year?entry.year+' · ':'')+entry.title;title.style.cssText='font-size:12px;overflow-wrap:anywhere';
  const use=document.createElement('button');use.type='button';use.textContent='Als Covermotiv';use.addEventListener('click',()=>loadAlbumPicture(entry));
  const del=document.createElement('button');del.type='button';del.className='secondary';del.textContent='Aus Album entfernen';del.addEventListener('click',async()=>{if(!confirm('Dieses Foto nur aus dem Cover-Fotoalbum entfernen? Die ursprüngliche Bilddatei wird nicht gelöscht.'))return;try{await albumDelete(entry.id);await paintAlbum();albumInfo('Foto nur aus dem Cover-Fotoalbum entfernt.')}catch(e){albumInfo('Foto konnte nicht entfernt werden: '+e.message)}});
  card.append(img,title,use,del);root.append(card)
 })
 }catch(e){albumInfo('Fotoalbum konnte nicht angezeigt werden: '+e.message)}}
$('albumUpload').addEventListener('change',async e=>{const files=Array.from(e.target.files||[]);if(!files.length)return;
 try{
  let all=await albumAll(),free=MAX_PHOTOS-all.length,added=0;
  for(const f of files){if(free<=0)break;if(!/^image\/(jpeg|png|webp|gif)$/.test(f.type)||f.size>15000000){albumInfo('Ein Foto wurde übersprungen (Format oder Dateigröße).');continue}
   const blob=await albumBlob(f);const entry={id:crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2),title:albumName(f.name),year:fit($('albumYear').value,32),added:new Date().toISOString(),blob};
   await albumPut(entry);added++;free--;
  }
  await paintAlbum();albumInfo(added?added+' Foto(s) in deinem Cover-Fotoalbum gespeichert. Du kannst sie jederzeit als Motiv auswählen.':'Keine Fotos hinzugefügt. Höchstens '+MAX_PHOTOS+' Bilder pro Album.');
 }catch(err){albumInfo('Speichern leider nicht möglich: '+err.message)}finally{e.target.value=''}
});
function blobToDataUrl(blob){return new Promise((ok,fail)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>fail(Error('Bild kann nicht gelesen werden'));r.readAsDataURL(blob)})}
$('albumExport').addEventListener('click',async()=>{try{
 const photos=await albumAll(),data=[];
 for(const p of photos)data.push({title:p.title,year:p.year,added:p.added,pic:await blobToDataUrl(p.blob)});
 const blob=new Blob([JSON.stringify({format:'cover-fotoalbum-v315',date:new Date().toISOString(),photos:data})],{type:'application/json'});
 const url=URL.createObjectURL(blob);download(url,'Mein-Cover-Fotoalbum-'+safeName()+'.json');setTimeout(()=>URL.revokeObjectURL(url),5000);
 albumInfo('Die Fotoalbum-Sicherung wurde zum Herunterladen angeboten. Bitte privat aufbewahren.')
 }catch(e){albumInfo('Sicherung konnte nicht erstellt werden: '+e.message)}
});
$('albumImport').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;
 try{
 if(file.size>12000000)throw Error('Datei ist zu groß (über 12 MB)');
 const data=JSON.parse(await file.text());if(data.format!=='cover-fotoalbum-v315'||!Array.isArray(data.photos))throw Error('Unbekanntes Fotoalbum-Format');
 if(!confirm('Die Fotos aus dieser Sicherung zu deinem Cover-Fotoalbum hinzufügen? Bestehende Fotos bleiben erhalten.'))return;
 let free=MAX_PHOTOS-(await albumAll()).length,added=0;
 for(const p of data.photos.slice(0,MAX_PHOTOS)){
  if(free<=0)break;
  if(!p||typeof p.pic!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.pic)||p.pic.length>1200000)continue;
  const blob=await (await fetch(p.pic)).blob();
  await albumPut({id:crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2),title:albumName(p.title),year:fit(p.year,32),added:new Date().toISOString(),blob});free--;added++
 }
 await paintAlbum();albumInfo(added+' Bild(er) aus deiner Fotoalbum-Sicherung übernommen.')
 }catch(err){albumInfo('Fotoalbum-Sicherung konnte nicht eingelesen werden: '+err.message)}finally{e.target.value=''}
});
openAlbum().then(()=>paintAlbum()).catch(err=>albumInfo('Fotoalbum auf diesem Gerät nicht verfügbar: '+err.message));

loadGallery();bookLabel();
})();
