/* Das Goldene Buch Deines Lebens – V3.20 Geräteausgabe.
 * Ein eigenständiges Gesamtpaket pro Buch und Browser. Keine Cloud, kein Upload.
 * Import: nur in leere Zielbereiche oder Buchbereiche mit bloßem Startprofil.
 */
(async () => {
'use strict';
const $ = id => document.getElementById(id);
const GALLERY_KEY = 'goldenes-buch-v315-covergalerie-v1';
const CURRENT_COVER_KEY = 'goldenes-buch-v320-aktuelles-cover';
const BOOK_DB = 'GoldenesBuchV320Startklar', ALBUM_DB = 'goldenes-buch-v320-startklar-fotoalbum';
let staged = null, stagedFile = null, busy = false;
const say = (message, error=false) => { $('status').textContent = message; $('status').style.color = error ? '#9c3131' : '#38593c'; };
const bytes = n => n < 1048576 ? `${(n/1024).toFixed(0)} KB` : `${(n/1048576).toFixed(1)} MB`;
const safeName = s => String(s||'Lebensbuch').normalize('NFKC').replace(/[^a-zA-Z0-9äöüÄÖÜß_-]+/g,'-').replace(/-+/g,'-').slice(0,65)||'Lebensbuch';
const hex = buffer => Array.from(new Uint8Array(buffer),b => b.toString(16).padStart(2,'0')).join('');
async function hash(text) { return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))); }
const blobToData = blob => new Promise((yes,no) => {const r=new FileReader();r.onload=()=>yes(r.result);r.onerror=()=>no(r.error||Error('Datei unlesbar'));r.readAsDataURL(blob)});
function base64ToBlob(base64, mime) {const bin=atob(base64), parts=[];for(let i=0;i<bin.length;i+=8192){const sub=bin.slice(i,i+8192), b=new Uint8Array(sub.length);for(let k=0;k<sub.length;k++)b[k]=sub.charCodeAt(k);parts.push(b)}return new Blob(parts,{type:mime||'application/octet-stream'});}
function openDb(name, version, upgrade){return new Promise((ok,fail)=>{const r=indexedDB.open(name,version);r.onupgradeneeded=()=>upgrade(r.result);r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error||Error('Speicher nicht erreichbar'));r.onblocked=()=>fail(Error('Bitte andere Tabs mit diesem Buch schließen'))})}
async function readObject(db, store, key){const tx=db.transaction(store,'readonly'),req=tx.objectStore(store).get(key);return new Promise((ok,fail)=>{req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error);tx.onabort=()=>fail(tx.error);});}
async function readAll(db,store){const tx=db.transaction(store,'readonly'),req=tx.objectStore(store).getAll();return new Promise((ok,fail)=>{req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error);tx.onabort=()=>fail(tx.error)})}
const openBook=()=>openDb(BOOK_DB,2,d=>{if(!d.objectStoreNames.contains('data'))d.createObjectStore('data');if(!d.objectStoreNames.contains('files'))d.createObjectStore('files',{keyPath:'id'})});
const openAlbum=()=>openDb(ALBUM_DB,1,d=>{if(!d.objectStoreNames.contains('bilder'))d.createObjectStore('bilder',{keyPath:'id'})});
async function readCurrentCover(){return localStorage.getItem(CURRENT_COVER_KEY)}
async function writeCurrentCover(data){
 if(!data)return;
 const m=/^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(data);
 if(!m)throw Error('Cover-Format unzulässig');const body=base64ToBlob(m[1],'image/jpeg');
 if(body.size<100||body.size>400000)throw Error('Das Cover ist größer als 400 KB oder ungültig');
 localStorage.setItem(CURRENT_COVER_KEY,data);
}
async function deleteCurrentCover(){localStorage.removeItem(CURRENT_COVER_KEY)}
async function capture(){
 const bookDb=await openBook(), albumDb=await openAlbum();
 try{
  const profile=await readObject(bookDb,'data','profile');
  if(!profile||typeof profile.name!=='string'||typeof profile.birth!=='string')throw Error('Bitte zuerst das persönliche Buch anlegen und speichern.');
  const days=await readObject(bookDb,'data','days')||[];
  if(!Array.isArray(days))throw Error('Die gespeicherten Lebenstage sind ungültig.');
  const entries={};for(const d of days){const v=await readObject(bookDb,'data','day:'+d);if(v===undefined)throw Error('Lebenstag '+d+' konnte nicht gelesen werden');entries[d]=v;}
  const attachments=[];const files=await readAll(bookDb,'files');
  for(let i=0;i<files.length;i++){
   const f=files[i];if(!(f.blob instanceof Blob))throw Error('Anhang „'+(f.name||'?')+'“ ist nicht vollständig');
   say('Lese Anhang '+(i+1)+' von '+files.length+' …');const data=await blobToData(f.blob);
   attachments.push({id:f.id,day:f.day,name:f.name,type:f.type||f.blob.type,lastModified:f.lastModified,base64:data.slice(data.indexOf(',')+1)});
  }
  const book={format:'goldenes-buch',version:2,appVersion:'3.20-importkorrektur',exported:new Date().toISOString(),profile,days:entries,attachments,security:await window.GoldenAccess.exportSecurity()};
  let gallery=[];try{gallery=JSON.parse(localStorage.getItem(GALLERY_KEY)||'[]')}catch{throw Error('Die Covergalerie ist beschädigt und wurde nicht stillschweigend weggelassen. Bitte gesondert sichern.');}
  if(!Array.isArray(gallery))throw Error('Die Covergalerie hat ein ungültiges Format.');
  const records=await readAll(albumDb,'bilder'),album=[];
  for(let i=0;i<records.length;i++){const p=records[i];if(!(p.blob instanceof Blob))throw Error('Fotoalbum-Bild „'+(p.title||'?')+'“ kann nicht gelesen werden');say('Lese Fotoalbum '+(i+1)+' von '+records.length+' …');album.push({title:p.title,year:p.year,added:p.added,pic:await blobToData(p.blob)});}
  const cover=await readCurrentCover();
  return {book,gallery,album,cover};
 }finally{bookDb.close();albumDb.close()}
}
function validateIso(s){if(typeof s!=='string'||!/^\d{4}-\d\d-\d\d$/.test(s))return false;const dt=new Date(s+'T12:00:00');return !Number.isNaN(dt.getTime())&&[dt.getFullYear(),String(dt.getMonth()+1).padStart(2,'0'),String(dt.getDate()).padStart(2,'0')].join('-')===s}
function validate(p){
 if(!p||typeof p!=='object'||!p.book||p.book.format!=='goldenes-buch'||p.book.version!==2)throw Error('Das ist kein gültiges Gesamtpaket eines Goldenen Buches.');
 const b=p.book;
 if(!b.profile||typeof b.profile.name!=='string'||!validateIso(b.profile.birth)||typeof b.days!=='object'||Array.isArray(b.days)||!b.days||!Array.isArray(b.attachments))throw Error('Unvollständige Buchdaten.');
 const dayNames=Object.keys(b.days);
 if(dayNames.some(d=>!validateIso(d)||d<b.profile.birth||!b.days[d]||typeof b.days[d]!=='object'))throw Error('Ungültige Lebenstage.');
 for(const f of b.attachments){if(!f||typeof f.id!=='string'||typeof f.day!=='string'||!validateIso(f.day)||typeof f.name!=='string'||typeof f.base64!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(f.base64)||f.base64.length%4!==0)throw Error('Ein Anhang ist unvollständig.');}
 if(b.security&&(!Object.prototype.hasOwnProperty.call(b.security,'accessConfig') || !Array.isArray(b.security.careNotes)))throw Error('Sicherheitsangaben ungültig.');
 if(!Array.isArray(p.gallery)||p.gallery.length>50||!Array.isArray(p.album)||p.album.length>50)throw Error('Fotoalbum oder Covergalerie ungültig.');
 for(const g of p.gallery){if(!g||typeof g.pic!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(g.pic))throw Error('Covergalerie enthält eine ungültige Grafik.');}
 for(const a of p.album){if(!a||typeof a.title!=='string'||typeof a.pic!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(a.pic))throw Error('Fotoalbum enthält eine ungültige Grafik.');}
 if(p.cover!==null && (typeof p.cover!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(p.cover)))throw Error('Regalcover ist ungültig.');
 return {days:dayNames.length,attachments:b.attachments.length,photos:p.album.length,covers:p.gallery.length,regalcover:!!p.cover};
}
async function emptyDestination(){const bookDb=await openBook(),albumDb=await openAlbum();
 try{
  const keys=await new Promise((ok,fail)=>{const t=bookDb.transaction('data','readonly'),r=t.objectStore('data').getAllKeys();r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)});
  const days=await readObject(bookDb,'data','days'), fileList=await readAll(bookDb,'files'), photos=await readAll(albumDb,'bilder');
  const gallery=localStorage.getItem(GALLERY_KEY), cover=await readCurrentCover();
  const security=await window.GoldenAccess.exportSecurity();
  // Nur Startprofil und leere Tagesliste sind zulässig; keine Tage, Anhänge, Bilder oder eingerichtete Sperre.
  return keys.every(k=>k==='profile'||k==='days') && (!days||Array.isArray(days)&&days.length===0)
    && fileList.length===0 && photos.length===0 && (!gallery||gallery==='[]') && !cover
    && !security.accessConfig && security.careNotes.length===0;
 }finally{bookDb.close();albumDb.close()}
}
function writeBook(db,book){return new Promise((ok,fail)=>{
 const tx=db.transaction(['data','files'],'readwrite'),data=tx.objectStore('data'),files=tx.objectStore('files');
 tx.oncomplete=ok;tx.onerror=()=>fail(tx.error||Error('Buch konnte nicht geschrieben werden'));tx.onabort=()=>fail(tx.error||Error('Buch-Import abgebrochen'));
 data.clear();files.clear();data.put(book.profile,'profile');data.put(Object.keys(book.days),'days');
 for(const [date,row] of Object.entries(book.days))data.put(row,'day:'+date);
 for(const a of book.attachments)files.put({id:a.id,day:a.day,name:a.name,type:a.type,lastModified:a.lastModified,blob:base64ToBlob(a.base64,a.type)});
})}
function writeAlbum(db,photos){return new Promise((ok,fail)=>{
 const tx=db.transaction('bilder','readwrite'),store=tx.objectStore('bilder');tx.oncomplete=ok;tx.onerror=()=>fail(tx.error||Error('Fotoalbum konnte nicht geschrieben werden'));tx.onabort=()=>fail(tx.error||Error('Fotoalbum-Import abgebrochen'));
 store.clear();for(const p of photos){const [head,data]=p.pic.split(',',2);store.put({id:crypto.randomUUID(),title:p.title.slice(0,65),year:String(p.year||'').slice(0,32),added:p.added||new Date().toISOString(),blob:base64ToBlob(data,'image/jpeg')})}
})}
async function clearStores(){const bd=await openBook(),ad=await openAlbum();try{await new Promise((ok,fail)=>{const t=bd.transaction(['data','files'],'readwrite');t.objectStore('data').clear();t.objectStore('files').clear();t.oncomplete=ok;t.onerror=()=>fail(t.error);t.onabort=()=>fail(t.error)});await new Promise((ok,fail)=>{const t=ad.transaction('bilder','readwrite');t.objectStore('bilder').clear();t.oncomplete=ok;t.onerror=()=>fail(t.error);t.onabort=()=>fail(t.error)})}finally{bd.close();ad.close()}}
async function restore(p){
 if(!await emptyDestination())throw Error('Dieser Buchbereich enthält bereits Inhalte oder eine Sperre. Ein Rückimport ist hier nicht erlaubt.');
 if(!await window.GoldenAccess.approveImportedSecurity(p.book.security))throw Error('Der bisherige Buch-Code wurde nicht bestätigt.');
 const previousSecurity=await window.GoldenAccess.exportSecurity();
 const bd=await openBook(),ad=await openAlbum();let completed=false;
 // Ein bloß eingerichtetes Startprofil wird bei einem Importfehler zurückgeschrieben.
 const oldProfile=await readObject(bd,'data','profile');
 const oldDays=await readObject(bd,'data','days');
 try{
  say('Schreibe die persönlichen Lebenstage und Anhänge …');await writeBook(bd,p.book);
  say('Stelle das Cover-Fotoalbum wieder her …');await writeAlbum(ad,p.album);
  localStorage.setItem(GALLERY_KEY,JSON.stringify(p.gallery));
  say('Übernehme die bisherigen Sicherheitseinstellungen …');if(p.book.security)await window.GoldenAccess.importSecurity(p.book.security);
  say('Stelle das aktuelle Regalcover wieder her …');if(p.cover)await writeCurrentCover(p.cover);
  completed=true;
 }catch(error){
  bd.close();ad.close();
  // First restore is only allowed into an empty target. Roll back its newly created content.
  const failures=[];try{
   await clearStores();
   if(oldProfile || oldDays){const rollback=await openBook();try{await new Promise((ok,fail)=>{const t=rollback.transaction('data','readwrite'),store=t.objectStore('data');if(oldProfile)store.put(oldProfile,'profile');if(oldDays)store.put(oldDays,'days');t.oncomplete=ok;t.onerror=()=>fail(t.error);t.onabort=()=>fail(t.error)})}finally{rollback.close()}}
  }catch(e){failures.push('Buchdaten: '+e.message)}
  try{localStorage.removeItem(GALLERY_KEY)}catch(e){failures.push('Covergalerie: '+e.message)}
  try{await window.GoldenAccess.importSecurity(previousSecurity)}catch(e){failures.push('Sperre: '+e.message)}
  try{await deleteCurrentCover()}catch(e){failures.push('Regalcover: '+e.message)}
  if(failures.length)throw Error(error.message+' · Rücknahme teilweise fehlgeschlagen ('+failures.join(', ')+'). Bitte Zielbuch nicht weiterverwenden und Hilfe holen.');
  throw error;
 }finally{if(completed){bd.close();ad.close()}}
}
async function save(){if(busy)return;busy=true;$('save').disabled=true;try{
 say('Prüfe deine vorhandenen Buchdaten …');const payload=await capture();const info=validate(payload);
 say('Erstelle und prüfe die Gesamtsicherung …');const serialized=JSON.stringify(payload);const digest=await hash(serialized);
 const packageJSON='{"format":"goldenes-buch-gesamtpaket","version":1,"created":'+JSON.stringify(new Date().toISOString())+',"sha256":"'+digest+'","payload":'+serialized+'}';
 const archive=new Blob([packageJSON],{type:'application/json'});
 const fileName='Goldenes-Buch-GESAMT-'+safeName(payload.book.profile.name)+'-'+new Date().toISOString().slice(0,10)+'.json';
 const url=URL.createObjectURL(archive),a=document.createElement('a');a.href=url;a.download=fileName;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 say('Gesamtsicherung angeboten: '+fileName+' · '+bytes(archive.size)+' · '+info.days+' Lebenstage · '+info.attachments+' Anhänge · '+info.photos+' Albumfotos · '+info.covers+' Galeriecover'+(info.regalcover?' · Regalcover':'')+'. Bitte im Downloads-Ordner kontrollieren.');
 }catch(e){say('Sicherung fehlgeschlagen: '+e.message+'. Bestehende Daten wurden nicht verändert.',true)}finally{busy=false;$('save').disabled=false}}
async function preview(file){staged=null;stagedFile=null;$('restore').disabled=true;$('preview').replaceChildren();if(!file)return;
 if(file.size>268435456)throw Error('Die Sicherung ist über 256 MB groß und kann hier nicht sicher eingelesen werden.');
 say('Prüfe Sicherungsdatei und Prüfsumme …');const obj=JSON.parse(await file.text());
 if(obj.format!=='goldenes-buch-gesamtpaket'||obj.version!==1||typeof obj.sha256!=='string'||!obj.payload)throw Error('Bitte eine V3.20-Gesamtsicherung auswählen. Ältere Buch-JSON-Dateien weiterhin über das bisherige Buch-Importmenü verwenden.');
 const info=validate(obj.payload);if(await hash(JSON.stringify(obj.payload))!==obj.sha256)throw Error('Die Prüfsumme stimmt nicht. Datei möglicherweise beschädigt oder verändert.');
 staged=obj.payload;stagedFile=file.name;
 const infoBox=document.createElement('div');infoBox.className='summary';const name=document.createElement('h3');name.textContent='Inhalt der geprüften Sicherung';const p=document.createElement('p');p.textContent='Buch: '+obj.payload.book.profile.name+' · Geburtstag: '+obj.payload.book.profile.birth+' · '+info.days+' Lebenstage · '+info.attachments+' Anhänge · '+info.photos+' Albumfotos · '+info.covers+' Galeriecover'+(info.regalcover?' · 1 Regalcover':' · kein eigenes Regalcover')+'.';infoBox.append(name,p);$('preview').append(infoBox);
 const blank=await emptyDestination();$('restore').disabled=!blank;
 say(blank?'Datei geprüft. Zielbuch enthält keine Einträge und ist für die Übernahme bereit.':'Datei geprüft. Dieser Buchbereich enthält bereits Inhalte oder eine Sperre. Import hier gesperrt.',!blank);
}
$('save').addEventListener('click',save);
$('pick').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{await preview(file)}catch(err){staged=null;$('restore').disabled=true;say('Prüfung fehlgeschlagen: '+err.message,true)}});
$('restore').addEventListener('click',async()=>{
 if(busy||!staged)return;if(!await emptyDestination()){say('Der Zielbereich ist nicht mehr leer. Import zum Schutz abgebrochen.',true);return}
 if(!confirm('Du möchtest „'+staged.book.profile.name+'“ aus „'+stagedFile+'“ hier übernehmen. Ein vorhandenes leeres Startprofil wird ersetzt; Einträge werden niemals überschrieben. Fortsetzen?'))return;
 busy=true;$('restore').disabled=true;$('save').disabled=true;
 try{await restore(staged);say('Gesamtes Buch erfolgreich übernommen. Die Seite wird neu geöffnet.');setTimeout(()=>location.href='./index.html',700)}catch(e){say('Import abgebrochen: '+e.message,true);staged=null}finally{busy=false;$('save').disabled=false}
});
try{
 say('Prüfe den lokalen Buchzugang …');await window.GoldenAccess.waitForOwner();
 $('save').disabled=false;$('pick').disabled=false;
 const bookDb=await openBook();try{const profile=await readObject(bookDb,'data','profile');$('bookLabel').textContent=profile?'Buch: '+profile.name:'Noch kein Buch eingerichtet – hier kann eine Sicherung importiert werden.';}finally{bookDb.close()}
 say('Bereit. Deine Daten bleiben auf diesem Gerät; nur der Download speichert sie als Datei.');
}catch(e){say('Der Buchzugang konnte nicht geöffnet werden: '+e.message,true)}
})();
