(function(){
'use strict';
let coverPhoto=null;
const backgrounds=sources.map(source=>{const image=new Image();image.src=source;image.addEventListener('load',draw);return image});
const byId=id=>document.getElementById(id);
const canvas=byId('coverCanvas'),context=canvas.getContext('2d');

function coverState(){return {style:Number(profile?.coverStyle??0),zoom:Number(profile?.coverZoom??115),x:Number(profile?.coverX??0),y:Number(profile?.coverY??0)}}
function loadPhoto(data){
 coverPhoto=null;
 if(!data){draw();return}
 const image=new Image();image.onload=()=>{coverPhoto=image;draw()};image.onerror=()=>{draw();byId('coverStatus').textContent='Das gespeicherte Porträt konnte nicht gelesen werden.'};image.src=data;
}
function syncControls(){
 if(!profile)return;
 const state=coverState();
 byId('coverWorld').value=String(state.style);byId('coverZoom').value=String(state.zoom);byId('coverX').value=String(state.x);byId('coverY').value=String(state.y);
 loadPhoto(profile.coverPortrait||profile.coverImage||'');
}
function draw(){
 if(!profile)return;
 const state=coverState(),background=backgrounds[state.style]||backgrounds[0];if(!background.complete||!background.naturalWidth)return;
 context.clearRect(0,0,490,779);context.drawImage(background,0,0,490,779);
 const k=state.style,cx=k===0?240:k===1?243:242,cy=k===0?382:384,rx=k===0?163:k===1?153:156,ry=k===0?160:k===1?159:160;
 context.save();context.beginPath();context.ellipse(cx,cy,rx-10,ry-10,0,0,Math.PI*2);context.clip();
 if(coverPhoto){const z=Math.max((rx*2)/coverPhoto.width,(ry*2)/coverPhoto.height)*state.zoom/100,w=coverPhoto.width*z,h=coverPhoto.height*z;context.drawImage(coverPhoto,cx-w/2+state.x*1.2,cy-h/2+state.y*1.2,w,h)}
 else{context.fillStyle='#f6ecdb';context.fillRect(cx-rx,cy-ry,rx*2,ry*2);context.fillStyle='#88745d';context.font='20px Georgia';context.textAlign='center';context.fillText('HIER DEIN FOTO',cx,cy)}
 context.restore();context.strokeStyle=k===2?'#dba64e':'#d8a54c';context.lineWidth=7;context.beginPath();context.ellipse(cx,cy,rx-8,ry-8,0,0,Math.PI*2);context.stroke();
 const name=(profile.name||'DEIN NAME').trim(),birth=profile.birth,formatted=birth?new Date(birth+'T12:00:00').toLocaleDateString('de-AT',{day:'numeric',month:'long',year:'numeric'}):'Dein Geburtsdatum';
 context.fillStyle='#ffebc9';context.fillRect(145,573,210,115);context.textAlign='center';context.fillStyle='#3d291b';context.font=(name.length>23?20:name.length>14?24:30)+'px Georgia';context.fillText(name,250,612,250);context.font='13px Georgia';context.fillText('geboren am',250,635);context.font='17px Georgia';context.fillText(formatted,250,658,235);
}
async function saveSettings(){
 if(typeof trialCanWrite==='function'&&!trialCanWrite())return;if(!profile)return;
 profile.coverStyle=Number(byId('coverWorld').value);profile.coverZoom=Number(byId('coverZoom').value);profile.coverX=Number(byId('coverX').value);profile.coverY=Number(byId('coverY').value);await put('profile',profile);draw();
}
for(const id of ['coverWorld','coverZoom','coverX','coverY'])byId(id).addEventListener('input',()=>saveSettings().catch(error=>byId('coverStatus').textContent=error.message));
byId('coverUpload').addEventListener('change',async event=>{
	 if(typeof requireTrialWrite==='function'&&!requireTrialWrite()){event.target.value='';return}
 const file=event.target.files?.[0];event.target.value='';if(!file)return;
 if(!file.type.startsWith('image/')){alert('Bitte ein Bild auswählen.');return}
 if(file.size>8*1024*1024&&!confirm('Das Bild ist größer als 8 MB. Die Buchsicherung wird dadurch sehr groß. Trotzdem verwenden?'))return;
 try{const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)});profile.coverPortrait=data;delete profile.coverImage;await put('profile',profile);loadPhoto(data);byId('coverStatus').textContent='Porträt lokal gespeichert. Bitte anschließend eine neue JSON-Sicherung anlegen.'}
 catch(error){byId('coverStatus').textContent='Das Porträt konnte nicht gespeichert werden: '+error.message}
});
	byId('coverRemove').addEventListener('click',async()=>{if(typeof requireTrialWrite==='function'&&!requireTrialWrite())return;if(!profile||!confirm('Porträt wirklich aus dem Cover entfernen?'))return;delete profile.coverPortrait;delete profile.coverImage;await put('profile',profile);loadPhoto('');byId('coverStatus').textContent='Porträt entfernt.'});
byId('coverSave').addEventListener('click',()=>{draw();const link=document.createElement('a');link.download='Mein-Goldenes-Buch.png';link.href=canvas.toDataURL('image/png');link.click();byId('coverStatus').textContent='Das Cover wurde als PNG zum Speichern bereitgestellt.'});
addEventListener('golden-owner-ready',syncControls);
})();
