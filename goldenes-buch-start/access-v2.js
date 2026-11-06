(function(){
'use strict';
const CONFIG_KEY='goldenes-buch-v320-startklar-access';
const CARE_DB='GoldenesBuchCareV320Startklar';
const ATTEMPT_KEY='goldenes-buch-v320-startklar-login-attempts';
let releaseOwner;
const ownerPromise=new Promise(resolve=>{releaseOwner=resolve});
const enc=new TextEncoder(),dec=new TextDecoder();
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const random=n=>crypto.getRandomValues(new Uint8Array(n));
async function keyFrom(code,salt,usage){
 const material=await crypto.subtle.importKey('raw',enc.encode(code),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:180000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,usage);
}
async function verifier(code,salt){
 const key=await keyFrom(code,salt,['encrypt']);
 const iv=new Uint8Array(12),data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode('GoldenesBuch-Zugang-V2'));
 return b64(data);
}
async function makeCredential(code){const salt=random(16);return{salt:b64(salt),check:await verifier(code,salt)}}
async function verify(code,credential){return credential&&await verifier(code,unb64(credential.salt))===credential.check}
function careDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(CARE_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('notes',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function saveCare(code,author,note){
 const cfg=JSON.parse(localStorage.getItem(CONFIG_KEY));
 if(!await verify(code,cfg.emergency))throw Error('Notfall-Code ist nicht richtig.');
 const salt=random(16),iv=random(12),key=await keyFrom(code,salt,['encrypt']);
 const payload=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify({author,note,time:new Date().toISOString()})));
 const db=await careDb(),tx=db.transaction('notes','readwrite');
 tx.objectStore('notes').put({id:crypto.randomUUID(),created:new Date().toISOString(),salt:b64(salt),iv:b64(iv),payload:b64(payload)});
 await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close();
}
async function readCare(code){
 const cfg=JSON.parse(localStorage.getItem(CONFIG_KEY));if(!await verify(code,cfg.emergency))throw Error('Notfall-Code ist nicht richtig.');
 const db=await careDb(),tx=db.transaction('notes','readonly'),req=tx.objectStore('notes').getAll();
 const rows=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});db.close();
 const out=[];for(const row of rows){const key=await keyFrom(code,unb64(row.salt),['decrypt']);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(row.iv)},key,unb64(row.payload));out.push(JSON.parse(dec.decode(plain)))}return out;
}
async function exportCareRows(){
 const db=await careDb(),tx=db.transaction('notes','readonly'),req=tx.objectStore('notes').getAll();
 const rows=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});db.close();return rows;
}
async function importCareRows(rows){
 if(!Array.isArray(rows))throw Error('Ungültige Notfall-Sicherung.');
 const db=await careDb(),tx=db.transaction('notes','readwrite'),store=tx.objectStore('notes');store.clear();
 for(const row of rows){if(!row||typeof row.id!=='string'||typeof row.salt!=='string'||typeof row.iv!=='string'||typeof row.payload!=='string')throw Error('Ungültiger Notfall-Eintrag.');store.put(row)}
 await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Notfall-Import abgebrochen'))});db.close();
}
async function replaceEmergencyCode(ownerCode,newCode,repeatedCode){
 const cfg=JSON.parse(localStorage.getItem(CONFIG_KEY)||'null');
 if(!cfg||!await verify(ownerCode,cfg.owner))throw Error('Buch-Code ist nicht richtig.');
 if(newCode.length<8)throw Error('Der neue Notfall-Code braucht mindestens 8 Zeichen.');
 if(newCode!==repeatedCode)throw Error('Die beiden neuen Notfall-Codes stimmen nicht überein.');
 if(await verify(newCode,cfg.owner))throw Error('Buch-Code und Notfall-Code müssen verschieden sein.');
 const existing=await exportCareRows();
 if(existing.length)throw Error('Der Notfall-Code kann nicht erneuert werden, solange verschlüsselte Notfall-Einträge vorhanden sind. Diese bleiben zum Schutz an den bisherigen Code gebunden.');
 cfg.version=4;
 cfg.emergency=await makeCredential(newCode);
 cfg.emergencyChanged=new Date().toISOString();
 localStorage.setItem(CONFIG_KEY,JSON.stringify(cfg));
}
function style(){const s=document.createElement('style');s.textContent=`
body.gb-locked main{visibility:hidden}.gb-access{position:fixed;z-index:10000;inset:0;background:radial-gradient(circle at top,#fffaf0,#e8dcc7);overflow:auto;padding:22px;color:#3b3028;font:16px/1.5 system-ui,sans-serif}.gb-access-card{max-width:680px;margin:3vh auto;background:#fffaf0;border:1px solid #cdb892;border-radius:20px;box-shadow:0 16px 45px #4b392533;padding:24px}.gb-access h1,.gb-access h2{font-family:Georgia,serif}.gb-access label{display:block;font-weight:700;margin-top:12px}.gb-access input,.gb-access textarea{width:100%;padding:11px;border:1px solid #bba27a;border-radius:9px;font:inherit}.gb-access button{border:1px solid #88683f;border-radius:10px;padding:10px 14px;background:#8c6b40;color:white;font-weight:700;cursor:pointer;margin:10px 6px 0 0}.gb-access-note{padding:11px 13px;border-left:4px solid #ad8752;background:#f7ecd5;border-radius:7px}.gb-access-error{color:#9d2f2f;font-weight:700;min-height:24px}.gb-lock-button{position:fixed;z-index:9000;right:14px;bottom:14px;border-radius:999px!important;background:#5f4730!important}`;document.head.append(s)}
function el(tag,attrs={},value=''){const n=document.createElement(tag);Object.assign(n,attrs);if(value)n.textContent=value;return n}
function field(label,type='password'){const wrap=el('div'),lab=el('label',{},label),input=el('input');input.type=type;wrap.append(lab,input);return{wrap,input}}
function current(){try{return JSON.parse(localStorage.getItem(CONFIG_KEY)||'null')}catch{return null}}
function active(cfg){return !!(cfg&&cfg.owner&&cfg.mode!=='open')}
function unlock(){document.querySelector('.gb-access')?.remove();document.body.classList.remove('gb-locked');releaseOwner();if(active(current())){const lock=el('button',{type:'button',className:'gb-lock-button'},'🔒 Buch sperren');lock.onclick=()=>location.reload();document.body.append(lock)}}
function showGate(){style();const cfg=current();if(!active(cfg)){unlock();return}
 const gate=el('section',{className:'gb-access'}),card=el('div',{className:'gb-access-card'}),error=el('p',{className:'gb-access-error'});gate.append(card);document.body.prepend(gate);
 card.append(el('h1',{},'✧ Das Goldene Buch Deines Lebens ✧'),el('h2',{},'Freiwillige Buchsperre'),el('p',{className:'gb-access-note'},'Für dieses Buch ist eine Sperre eingerichtet. Bitte den bisherigen Buch-Code eingeben. Es gibt keine automatische Zeitsperre.'));
 const code=field('Buch-Code'),open=el('button',{type:'button'},'Buch öffnen');card.append(code.wrap,open,error);
 open.onclick=async()=>{try{error.textContent='';open.disabled=true;if(!await verify(code.input.value,current().owner))throw Error('Buch-Code ist nicht richtig.');unlock()}catch(e){error.textContent=e.message}finally{open.disabled=false}};
 code.input.addEventListener('keydown',e=>{if(e.key==='Enter')open.click()});
 if(cfg.emergency){const btn=el('button',{type:'button',className:'secondary'},'Notfall: nur dokumentieren');btn.onclick=()=>{const box=el('div');box.append(el('h2',{},'Notfall-Dokumentation'));const ec=field('Notfall-Code'),name=field('Wer dokumentiert?','text'),note=el('textarea');note.placeholder='Hinweis';note.style.width='100%';box.append(ec.wrap,name.wrap,note);const save=el('button',{type:'button'},'Hinweis speichern');save.onclick=async()=>{try{await saveCare(ec.input.value,name.input.value.trim(),note.value.trim());alert('Notfall-Hinweis gespeichert. Das Buch bleibt geschlossen.');note.value=''}catch(e){alert(e.message)}};box.append(save);card.append(box)};card.append(btn)}
}
function settingsPanel(){const main=document.querySelector('main');if(!main)return;const panel=el('section',{className:'panel'}),title=el('h2',{},'Meine freiwillige Buchsperre'),info=el('p',{className:'notice'}),actions=el('div',{className:'buttons'}),result=el('p',{className:'small'});panel.append(title,info,actions,result);main.insertBefore(panel,main.children[1]||null);
 const update=()=>{const cfg=current();actions.replaceChildren();const enabled=active(cfg);info.textContent=enabled?'Die Buchsperre ist eingeschaltet. Sie kann nach Eingabe des derzeitigen Codes ausgeschaltet werden.':'Das Buch lässt sich ohne Code öffnen. Wer möchte, kann eine freiwillige Buchsperre aktivieren. Die Buchdaten selbst bleiben unverschlüsselt.';
 if(enabled){const off=el('button',{type:'button',className:'secondary'},'Freiwillige Sperre ausschalten');off.onclick=async()=>{const code=prompt('Bitte bisherigen Buch-Code eingeben, um die Sperre auszuschalten.');if(code===null)return;try{if(!await verify(code,current().owner))throw Error('Buch-Code ist nicht richtig.');if(!confirm('Die Buchseiten sind danach auf diesem Browser ohne Buch-Code zugänglich. Sperre wirklich ausschalten?'))return;const next=current();next.mode='open';next.owner=null;next.version=5;localStorage.setItem(CONFIG_KEY,JSON.stringify(next));result.textContent='Sperre ausgeschaltet. Bitte gleich eine neue JSON-Sicherung erstellen.';document.querySelector('.gb-lock-button')?.remove();update()}catch(e){alert(e.message)}};actions.append(off);
 const manual=el('button',{type:'button',className:'secondary'},'Buch jetzt sperren');manual.onclick=()=>location.reload();actions.append(manual);
 }else{const on=el('button',{type:'button'},'Freiwillige Buchsperre einschalten');on.onclick=async()=>{const first=prompt('Neuen Buch-Code festlegen (mindestens 8 Zeichen).');if(first===null)return;if(first.length<8){alert('Bitte mindestens 8 Zeichen wählen.');return}const again=prompt('Buch-Code wiederholen.');if(again!==first){alert('Die Codes stimmen nicht überein.');return}try{const next=current()||{version:5,created:new Date().toISOString()};next.mode='locked';next.owner=await makeCredential(first);next.version=5;localStorage.setItem(CONFIG_KEY,JSON.stringify(next));result.textContent='Freiwillige Sperre eingeschaltet. Bitte Code sicher notieren und eine neue JSON-Sicherung anlegen.';update();if(!document.querySelector('.gb-lock-button')){const lock=el('button',{type:'button',className:'gb-lock-button'},'🔒 Buch sperren');lock.onclick=()=>location.reload();document.body.append(lock)}}catch(e){alert('Sperre konnte nicht eingerichtet werden: '+e.message)}};actions.append(on)};
 if(cfg?.emergency){const read=el('button',{type:'button',className:'secondary'},'Notfall-Hinweise lesen');read.onclick=async()=>{const code=prompt('Notfall-Code eingeben');if(!code)return;try{const notes=await readCare(code);alert(notes.length?notes.map(n=>n.author+': '+n.note).join('\n'):'Keine Notfall-Hinweise vorhanden.')}catch(e){alert(e.message)}};actions.append(read)}
 };update()}
window.GoldenAccess={
 approveImportedSecurity:async bundle=>{const cfg=bundle?.accessConfig;if(!cfg?.owner||cfg.mode==='open')return true;const code=prompt('Dieses importierte Buch war geschützt. Bitte den bisherigen Buch-Code eingeben, bevor die Daten übernommen werden.');if(code===null)return false;return !!(await verify(code,cfg.owner))},
 waitForOwner:()=>ownerPromise,
 exportSecurity:async()=>({accessConfig:current(),careNotes:await exportCareRows()}),
 importSecurity:async bundle=>{if(!bundle)return;if(Object.prototype.hasOwnProperty.call(bundle,'accessConfig')){if(bundle.accessConfig)localStorage.setItem(CONFIG_KEY,JSON.stringify(bundle.accessConfig));else localStorage.removeItem(CONFIG_KEY)}if(Array.isArray(bundle.careNotes))await importCareRows(bundle.careNotes)},
 ownerReady:()=>{dispatchEvent(new Event('golden-owner-ready'));settingsPanel()}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showGate,{once:true});else showGate();
})();
