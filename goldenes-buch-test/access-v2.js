(function(){
'use strict';
const CONFIG_KEY='goldenes-buch-v3-7-testphase-access';
const CARE_DB='GoldenesBuchCareV37Testphase';
const ATTEMPT_KEY='goldenes-buch-v37-login-attempts';
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
 const iv=new Uint8Array(12),data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode('GoldenesBuch-Test-V2'));
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
body.gb-locked main{visibility:hidden}.gb-access{position:fixed;z-index:10000;inset:0;background:radial-gradient(circle at top,#fffaf0,#e8dcc7);overflow:auto;padding:22px;color:#3b3028;font:16px/1.5 system-ui,sans-serif}.gb-access-card{max-width:680px;margin:3vh auto;background:#fffaf0;border:1px solid #cdb892;border-radius:20px;box-shadow:0 16px 45px #4b392533;padding:24px}.gb-access h1,.gb-access h2{font-family:Georgia,serif}.gb-access label{display:block;font-weight:700;margin-top:12px}.gb-access input,.gb-access textarea{width:100%;padding:11px;border:1px solid #bba27a;border-radius:9px;font:inherit}.gb-access textarea{min-height:130px}.gb-access button{border:1px solid #88683f;border-radius:10px;padding:10px 14px;background:#8c6b40;color:white;font-weight:700;cursor:pointer;margin:10px 6px 0 0}.gb-access button.secondary{background:#fff8e8;color:#5d482e}.gb-access-note{padding:11px 13px;border-left:4px solid #ad8752;background:#f7ecd5;border-radius:7px}.gb-access-error{color:#9d2f2f;font-weight:700;min-height:24px}.gb-access-hidden{display:none!important}.gb-lock-button{position:fixed;z-index:9000;right:14px;bottom:14px;border-radius:999px!important;background:#5f4730!important}
`;document.head.append(s)}
function el(tag,attrs={},text=''){const n=document.createElement(tag);Object.assign(n,attrs);if(text)n.textContent=text;return n}
function field(label,type='password'){const wrap=el('div'),lab=el('label',{},label),input=el(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;wrap.append(lab,input);return{wrap,input}}
function showGate(){
 style();const gate=el('section',{className:'gb-access'}),card=el('div',{className:'gb-access-card'});gate.append(card);document.body.prepend(gate);
 const cfg=localStorage.getItem(CONFIG_KEY);card.append(el('h1',{},'✧ Das Goldene Buch Deines Lebens ✧'));
 card.append(el('p',{className:'gb-access-note'},'Dieses Buch ist für den Buchmenschen selbst. Andere erhalten keinen stillen Lesezugang. Gemeinsam ansehen ist möglich; der Notfall-Code erlaubt ausschließlich einen neuen Eintrag, ohne vorhandene Seiten zu zeigen.'));
 const error=el('p',{className:'gb-access-error'});let attemptState;try{attemptState=JSON.parse(localStorage.getItem(ATTEMPT_KEY))||{failed:0,lockedUntil:0}}catch{attemptState={failed:0,lockedUntil:0}}
 function unlock(){gate.remove();document.body.classList.remove('gb-locked');releaseOwner();let timer;const reset=()=>{clearTimeout(timer);timer=setTimeout(()=>location.reload(),15*60*1000)};['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,reset,{passive:true}));reset();const lock=el('button',{className:'gb-lock-button',type:'button'},'🔒 Buch sperren');lock.onclick=()=>location.reload();document.body.append(lock)}
 if(!cfg){
  card.append(el('h2',{},'Sicherheitsbereich für diese Testversion einrichten'));
  card.append(el('p',{},'Für Neugeborene führen zunächst die Eltern das Buch. Später wird es bewusst an den Buchmenschen übergeben. Die Codes gelten nur auf diesem Gerät und werden nicht an Itschana gesendet.'));
  const owner=field('Eigener Buch-Code (mindestens 8 Zeichen)'),owner2=field('Buch-Code wiederholen'),emergency=field('Notfall-Code zum Dokumentieren (mindestens 8 Zeichen, anders als der Buch-Code)'),check=field('Notfall-Code wiederholen');
  [owner.wrap,owner2.wrap,emergency.wrap,check.wrap].forEach(x=>card.append(x));
  const agree=el('label'),box=el('input');box.type='checkbox';box.style.width='auto';agree.append(box,document.createTextNode(' Ich habe verstanden: Die Testversion ersetzt keine verschlüsselte Langzeitarchivierung. Regelmäßig JSON sichern.'));card.append(agree);
  const create=el('button',{type:'button'},'Sicheren Testbereich anlegen');create.onclick=async()=>{try{error.textContent='';if(owner.input.value.length<8||emergency.input.value.length<8)throw Error('Beide Codes brauchen mindestens 8 Zeichen.');if(owner.input.value!==owner2.input.value||emergency.input.value!==check.input.value)throw Error('Die wiederholten Codes stimmen nicht überein.');if(owner.input.value===emergency.input.value)throw Error('Buch-Code und Notfall-Code müssen verschieden sein.');if(!box.checked)throw Error('Bitte den Sicherheitshinweis bestätigen.');create.disabled=true;const stored={version:3,created:new Date().toISOString(),owner:await makeCredential(owner.input.value),emergency:await makeCredential(emergency.input.value)};localStorage.setItem(CONFIG_KEY,JSON.stringify(stored));unlock()}catch(e){error.textContent=e.message;create.disabled=false}};card.append(create,error);
 }else{
  card.append(el('h2',{},'Mein Buch öffnen'));const code=field('Buch-Code');card.append(code.wrap);const open=el('button',{type:'button'},'Buch öffnen'),emergencyBtn=el('button',{type:'button',className:'secondary'},'Notfall: nur dokumentieren');
  open.onclick=async()=>{if(Date.now()<attemptState.lockedUntil){error.textContent='Zu viele Versuche. Bitte später erneut versuchen.';return}try{if(!await verify(code.input.value,JSON.parse(cfg).owner))throw Error('Buch-Code ist nicht richtig.');attemptState={failed:0,lockedUntil:0};localStorage.setItem(ATTEMPT_KEY,JSON.stringify(attemptState));unlock()}catch(e){attemptState.failed=(attemptState.failed||0)+1;error.textContent=e.message;if(attemptState.failed>=5){attemptState={failed:0,lockedUntil:Date.now()+5*60*1000};error.textContent='Zu viele Versuche. Das Feld ist für 5 Minuten gesperrt.'}localStorage.setItem(ATTEMPT_KEY,JSON.stringify(attemptState))}};
  emergencyBtn.onclick=()=>{card.querySelectorAll('.gb-mode').forEach(n=>n.remove());const box=el('div',{className:'gb-mode'});box.append(el('hr'),el('h2',{},'Notfall-Dokumentation'));box.append(el('p',{className:'gb-access-note'},'Vorhandene Seiten bleiben unsichtbar. Es kann nur ein neuer, verschlüsselter Hinweis mit Zeitstempel angelegt werden.'));const ec=field('Notfall-Code'),author=field('Wer dokumentiert?','text'),note=field('Was soll für den Buchmenschen festgehalten werden?','textarea');[ec.wrap,author.wrap,note.wrap].forEach(n=>box.append(n));const save=el('button',{type:'button'},'Hinweis verschlüsselt speichern'),back=el('button',{type:'button',className:'secondary'},'Zurück');const state=el('p',{className:'gb-access-error'});save.onclick=async()=>{try{if(!author.input.value.trim()||!note.input.value.trim())throw Error('Bitte Namen und Hinweis eintragen.');await saveCare(ec.input.value,author.input.value.trim(),note.input.value.trim());state.style.color='#35623f';state.textContent='Der Hinweis wurde lokal und verschlüsselt gespeichert. Das Buch blieb geschlossen.';note.input.value=''}catch(e){state.textContent=e.message}};back.onclick=()=>box.remove();box.append(save,back,state);card.append(box)};
  card.append(open,emergencyBtn,error);code.input.addEventListener('keydown',e=>{if(e.key==='Enter')open.click()});
 }
}
window.GoldenAccess={
 waitForOwner:()=>ownerPromise,
 exportSecurity:async()=>({accessConfig:JSON.parse(localStorage.getItem(CONFIG_KEY)||'null'),careNotes:await exportCareRows()}),
 importSecurity:async bundle=>{if(!bundle)return;if(bundle.accessConfig)localStorage.setItem(CONFIG_KEY,JSON.stringify(bundle.accessConfig));if(bundle.careNotes)await importCareRows(bundle.careNotes)},
 ownerReady:async()=>{
  dispatchEvent(new Event('golden-owner-ready'));
  const main=document.querySelector('main');if(!main)return;
  const panel=el('section',{className:'panel'});
  panel.innerHTML='<h2>Zugriffsregeln dieser Testversion</h2><p>Nur der Buchmensch öffnet das Buch. Eltern beginnen das Buch für ein Kind und übergeben es später bewusst. Eine Vertrauensperson erhält keinen heimlichen Lesezugriff. Im Notfall darf mit dem getrennten Code nur dokumentiert werden.</p><div class="buttons"><button type="button" class="secondary" id="readCareV2">Notfall-Einträge gemeinsam prüfen</button><button type="button" class="secondary" id="replaceEmergencyV371">Vergessenen Notfall-Code erneuern</button></div><div id="careListV2" class="small"></div>';
  main.insertBefore(panel,main.children[1]||null);
  panel.querySelector('#readCareV2').onclick=async()=>{const code=prompt('Notfall-Code eingeben. Die Einträge sollen nur gemeinsam mit dem Buchmenschen angesehen werden.');if(!code)return;try{const rows=await readCare(code),out=panel.querySelector('#careListV2');out.replaceChildren();if(!rows.length){out.textContent='Keine Notfall-Einträge vorhanden.';return}for(const row of rows){const p=el('p',{className:'notice'});p.textContent=new Date(row.time).toLocaleString('de-AT')+' · '+row.author+': '+row.note;out.append(p)}}catch(e){alert(e.message)}};
  panel.querySelector('#replaceEmergencyV371').onclick=async()=>{
   const ownerCode=prompt('Zur Sicherheit den gültigen Buch-Code eingeben.');if(!ownerCode)return;
   const newCode=prompt('Neuen Notfall-Code eingeben (mindestens 8 Zeichen und anders als der Buch-Code).');if(!newCode)return;
   const repeatedCode=prompt('Neuen Notfall-Code wiederholen.');if(!repeatedCode)return;
   try{await replaceEmergencyCode(ownerCode,newCode,repeatedCode);alert('Der neue Notfall-Code wurde festgelegt. Bitte jetzt eine neue JSON-Buchsicherung erstellen und den Code sicher notieren.')}catch(e){alert(e.message)}
  };
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showGate,{once:true});else showGate();
})();
