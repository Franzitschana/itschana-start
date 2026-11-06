(() => {"use strict";
  window.GoldenesBuchBerechtigung={pruefen:async()=>{
    if(!crypto.subtle)throw Error('Bitte das Buch über den sicheren Buch-Link öffnen.');
    const info={ausgabe:'goldenes-buch',fuer:'Buchinhaber',geraete:'unbegrenzt',version:'3.20'};
    const status=document.getElementById('ausgabeStatus');
    if(status)status.textContent='Geräteausgabe V3.20 · Persönliche Daten bleiben in diesem Browser · Bitte regelmäßig sichern.';
    return info;
  }};
})();
