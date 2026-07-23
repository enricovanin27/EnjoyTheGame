/* ============ ENJOY THE GAME — data layer ============ */
(function(){
  const VER = 'etg_v5_2026_2';

  /* ---------- programma (orari, campi, pausa) — 3 blocchi ----------
     Configurazione modificabile SOLO dallo staff. Gli orari delle partite si
     calcolano dai parametri di ciascun blocco: si parte da `start`, ogni
     `slotMin` minuti un nuovo turno (2 partite in contemporanea, una per mezzo
     campo), e dopo `breakAfter` turni una pausa di `breakMin` minuti.
       • g1  = Giornata 1, gironi da 4
       • g2  = Giornata 2, mini gironi da 3
       • brk = Giornata 2, tabellone (quarti/semifinali/finale) */
  const SCHED_DEFAULTS = {
    g1: { start:'18:00', slotMin:20, breakAfter:6, breakMin:40, breakLabel:'Gara da 3 punti 🏀' },
    g2: { start:'09:30', slotMin:20, breakAfter:0, breakMin:0,  breakLabel:'Pausa' },
    brk:{ start:'14:00', slotMin:30, breakAfter:0, breakMin:0,  breakLabel:'Pausa' },
  };
  // a quale blocco appartiene una fase, e quale campo "indice turno" usa
  function blockOf(phase){ return phase==='group1'?'g1' : phase==='group2'?'g2' : 'brk'; }
  function slotField(phase){ return (phase==='group1'||phase==='group2') ? 'slot' : 'tslot'; }
  function phasesOf(block){ return block==='g1'?['group1'] : block==='g2'?['group2'] : ['quarti','semi','finale']; }
  function pad2(n){ return (n<10?'0':'')+n; }
  function hmToMin(hm){ const p=(hm||'0:0').split(':'); return (parseInt(p[0],10)||0)*60+(parseInt(p[1],10)||0); }
  function minToHm(t){ t=((Math.round(t)%1440)+1440)%1440; return pad2(Math.floor(t/60))+':'+pad2(t%60); }

  /* ---------- teams & matches ---------- */
  // Nessuna squadra/partita precaricata. Gironi, mini gironi e tabellone restano
  // VUOTI finché lo staff non esegue il sorteggio dopo la chiusura delle
  // iscrizioni. Le classifiche dei gironi si calcolano poi in automatico dai
  // risultati inseriti (2 punti a vittoria, 1 a sconfitta, differenza canestri).
  const teams = {};
  const matches = [];
  const D1_WIN = {}, D2_WIN = {}, D2groups = {};
  const live = null;

  /* ---------- sorteggio helpers ---------- */
  const DRAW_PAL = ['#FA720E','#DC4937','#0A4356','#3E7CA8','#1E8A5B','#9A4E8A','#C9911F','#5C6BC0',
                    '#E2553D','#1B6E7E','#5468C4','#B07A1B','#2E9E6B','#A85490','#D9A441','#3D6FA0'];
  function initials(name){ return (name||'').split(/\s+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?'; }
  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  // round robin di 4 squadre = 6 partite
  function rr4(ids){ return [[ids[0],ids[1]],[ids[2],ids[3]],[ids[0],ids[2]],[ids[1],ids[3]],[ids[0],ids[3]],[ids[1],ids[2]]]; }
  // round robin di 3 squadre = 3 partite
  function rr3(ids){ return [[ids[0],ids[1]],[ids[1],ids[2]],[ids[0],ids[2]]]; }
  let _mc=0; function mk(o){ return {id:'m'+Date.now().toString(36)+'_'+(++_mc), scoreA:null,scoreB:null,status:'sched',target:21,...o}; }

  /* ---------- demo registrations (so lo staff vede subito moduli firmati) ---------- */
  const SIG = (window.ETG_SIG||{a:null,b:null});
  const demoRegs = [
    { id:'r_demo1', type:'team', createdAt:'2026-05-28T18:32:00.000Z', teamName:'Net Surfers',
      code:'NRF24K', rosterSize:3,
      captain:{nome:'Marco Rossi',tel:'347 1234567',email:'marco.rossi@email.it'},
      players:[
        {cognome:'Rossi',nome:'Marco',sesso:'M',nascita:'2001-04-12',luogo:'Treviso',cf:'RSSMRC01D12L407K',naz:'Italiana',nazEstera:'',indirizzo:'Via Roma 14',cap:'31038',localita:'Paese',prov:'TV',tel:'347 1234567',email:'marco.rossi@email.it',tessera:'Virtuale',firma:SIG.a,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'',altezza:''},
        {cognome:'Conte',nome:'Davide',sesso:'M',nascita:'2003-11-22',luogo:'Castelfranco V.',cf:'CNTDVD03S22C111B',naz:'Italiana',nazEstera:'',indirizzo:'Via Piave 3',cap:'31038',localita:'Paese',prov:'TV',tel:'349 8765432',email:'',tessera:'Virtuale',firma:SIG.b,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'',altezza:''},
        {cognome:'Bianchi',nome:'Luca',sesso:'M',nascita:'2010-09-03',luogo:'Treviso',cf:'BNCLCU10P03L407A',naz:'Italiana',nazEstera:'',indirizzo:'Via Verdi 8',cap:'31038',localita:'Paese',prov:'TV',tel:'348 9988776',email:'',tessera:'Fisica',firma:null,tutCognome:'Bianchi',tutNome:'Andrea',tutFirma:SIG.a,ruolo:'',altezza:''},
      ]},
    { id:'r_demo2', type:'solo', createdAt:'2026-05-29T09:10:00.000Z', teamName:null, captain:null,
      players:[
        {cognome:'Ferrari',nome:'Giulia',sesso:'F',nascita:'2004-06-18',luogo:'Treviso',cf:'FRRGLI04H58L407C',naz:'Italiana',nazEstera:'',indirizzo:'Via Garibaldi 21',cap:'31038',localita:'Paese',prov:'TV',tel:'340 1122334',email:'giulia.f@email.it',tessera:'Virtuale',firma:SIG.b,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'Playmaker',altezza:'171'},
      ]},
    { id:'r_demo4', type:'solo', createdAt:'2026-05-29T14:22:00.000Z', teamName:null, captain:null,
      players:[
        {cognome:'Conte',nome:'Davide',sesso:'M',nascita:'2003-11-12',luogo:'Castelfranco Veneto',cf:'CNTDVD03S12C111B',naz:'Italiana',nazEstera:'',indirizzo:'Via Roma 4',cap:'31033',localita:'Castelfranco Veneto',prov:'TV',tel:'347 9988776',email:'davide.conte@email.it',tessera:'Virtuale',firma:SIG.a,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'Ala',altezza:'186'},
      ]},
    { id:'r_demo5', type:'solo', createdAt:'2026-05-30T08:45:00.000Z', teamName:null, captain:null,
      players:[
        {cognome:'Russo',nome:'Alessandro',sesso:'M',nascita:'2005-04-27',luogo:'Treviso',cf:'RSSLSN05D27L407C',naz:'Italiana',nazEstera:'',indirizzo:'Via Piave 17',cap:'31038',localita:'Paese',prov:'TV',tel:'333 1239876',email:'',tessera:'Fisica',firma:SIG.b,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'Pivot',altezza:'194'},
      ]},
    { id:'r_demo3', type:'team', createdAt:'2026-05-30T11:05:00.000Z', teamName:'Paese Ballers',
      code:'BLZ7P2', rosterSize:4,
      captain:{nome:'Stefano Marchetti',tel:'345 5566778',email:'ste.marchetti@email.it'},
      players:[
        {cognome:'Marchetti',nome:'Stefano',sesso:'M',nascita:'1999-02-08',luogo:'Treviso',cf:'MRCSFN99B08L407D',naz:'Italiana',nazEstera:'',indirizzo:'Via Risorgimento 9',cap:'31038',localita:'Paese',prov:'TV',tel:'345 5566778',email:'ste.marchetti@email.it',tessera:'Virtuale',firma:SIG.a,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'',altezza:''},
        {cognome:'Greggio',nome:'Matteo',sesso:'M',nascita:'2002-07-30',luogo:'Montebelluna',cf:'GRGMTT02L30F443E',naz:'Italiana',nazEstera:'',indirizzo:'Via Trento 2',cap:'31044',localita:'Montebelluna',prov:'TV',tel:'333 4455667',email:'',tessera:'Fisica',firma:SIG.b,tutCognome:'',tutNome:'',tutFirma:null,ruolo:'',altezza:''},
      ]},
  ];

  const SEED = {
    ver:VER,
    teams,
    matches,
    meta:{ edition:'IV', dates:'25–26 Luglio 2026', place:'Campetto Oratorio di Paese (TV)' },
    d1win:D1_WIN, d2win:D2_WIN, d2groups:D2groups,
    live,
    schedule:{ g1:Object.assign({},SCHED_DEFAULTS.g1), g2:Object.assign({},SCHED_DEFAULTS.g2), brk:Object.assign({},SCHED_DEFAULTS.brk) }, // programma (orari/pausa) — modificabile dallo staff
    published:false, // il calendario è pubblico? Lo staff lo pubblica quando è pronto.
    registrations:demoRegs, // iscrizioni inviate dai giocatori
  };

  /* ---------- quota d'iscrizione ---------- */
  const FEE = 22;                                   // euro a giocatore (solo informativo)

  /* ---------- store (localStorage) ---------- */
  const KEY='etg_state_v4';
  function load(){
    try{ const r=JSON.parse(localStorage.getItem(KEY)); if(r&&r.ver===VER) return r; }catch(e){}
    return null;
  }
  let state = load() || JSON.parse(JSON.stringify(SEED));
  const subs=new Set();
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(state)); }catch(e){} subs.forEach(f=>f()); }

  /* ---------- programma: config a blocchi + calcolo orari ---------- */
  // restituisce tutti e 3 i blocchi con i default applicati, migrando l'eventuale
  // vecchio formato "piatto" (una sola config, che era la Giornata 1)
  function schedAll(){
    let s = state.schedule || {};
    if(s && s.start && !s.g1) s = { g1:s };   // migrazione dal formato precedente
    return {
      g1: Object.assign({}, SCHED_DEFAULTS.g1, s.g1||{}),
      g2: Object.assign({}, SCHED_DEFAULTS.g2, s.g2||{}),
      brk:Object.assign({}, SCHED_DEFAULTS.brk, s.brk||{}),
    };
  }
  function schedCfg(block){ return schedAll()[block||'g1']; }
  /* orario (HH:MM) di un turno, tenendo conto della pausa a metà */
  function slotTime(idx, cfg){ cfg=cfg||schedCfg('g1');
    const extra = (cfg.breakAfter>0 && idx>=cfg.breakAfter) ? cfg.breakMin : 0;
    return minToHm(hmToMin(cfg.start) + idx*cfg.slotMin + extra); }
  /* ricalcola l'orario di TUTTE le partite programmate (gironi, mini gironi,
     tabellone) dai rispettivi turni, rispettando gli orari forzati (timeOverride) */
  function reflowSchedule(){
    const A=schedAll();
    state.matches.forEach(m=>{
      const blk=blockOf(m.phase), fld=slotField(m.phase), idx=m[fld];
      if(idx==null) return;
      m.time = m.timeOverride || slotTime(idx, A[blk]);
    });
  }

  /* ---------- access codes for team registrations ---------- */
  const MAX_TEAMS = 16;
  const CODE_ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I ambiguity
  function genCode(n=6){ let c=''; for(let i=0;i<n;i++) c+=CODE_ALPHABET[Math.floor(Math.random()*CODE_ALPHABET.length)]; return c; }
  function uniqueCode(){ let c, g=0; do{ c=genCode(); g++; } while(state.registrations.some(r=>r.code===c) && g<80); return c; }

  const Store = {
    get state(){ return state; },
    subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); },
    reset(){ state=JSON.parse(JSON.stringify(SEED)); save(); },
    update(fn){ fn(state); save(); },
    // registrations
    addRegistration(reg){ state.registrations.push(reg); save(); return reg; },
    teamCount(){ return state.registrations.filter(r=>r.type==='team').length; },
    isFull(){ return state.registrations.filter(r=>r.type==='team').length>=MAX_TEAMS; },
    /* captain creates the team -> returns the registration (with generated access code), or null if full */
    createTeam({teamName,captain,rosterSize,captainPlayer}){
      if(state.registrations.filter(r=>r.type==='team').length>=MAX_TEAMS) return null;
      const reg={ id:'r'+Date.now(), type:'team', createdAt:new Date().toISOString(), code:uniqueCode(),
        teamName, captain, rosterSize:rosterSize||3, players: captainPlayer?[captainPlayer]:[] };
      state.registrations.push(reg); save(); return reg;
    },
    findTeamByCode(code){ const c=(code||'').toUpperCase().replace(/\s/g,''); return state.registrations.find(r=>r.type==='team'&&r.code===c)||null; },
    /* remember on THIS device the teams the captain created, so the code is never lost */
    rememberMyTeam(reg){
      try{
        const k='etg_my_teams';
        const list=JSON.parse(localStorage.getItem(k)||'[]').filter(t=>t.id!==reg.id);
        list.unshift({id:reg.id,code:reg.code,teamName:reg.teamName,rosterSize:reg.rosterSize,createdAt:reg.createdAt});
        localStorage.setItem(k,JSON.stringify(list.slice(0,8)));
      }catch(e){}
    },
    myTeams(){
      try{
        const list=JSON.parse(localStorage.getItem('etg_my_teams')||'[]');
        // keep only the ones that still exist, and refresh roster counts
        return list.map(t=>{ const r=state.registrations.find(x=>x.id===t.id); return r?{...t,filled:r.players.length,rosterSize:r.rosterSize}:t; });
      }catch(e){ return []; }
    },
    /* a player adds themselves to a team via its code -> {ok, reason} */
    addPlayerToTeam(regId,player){
      const r=state.registrations.find(x=>x.id===regId);
      if(!r) return {ok:false,reason:'notfound'};
      if(r.players.length>=(r.rosterSize||99)) return {ok:false,reason:'full'};
      r.players.push(player); save(); return {ok:true,reg:r};
    },
    deleteRegistration(id){ state.registrations=state.registrations.filter(r=>r.id!==id); save(); },
    /* staff corregge nome/cognome di un giocatore */
    renamePlayer(regId, idx, nome, cognome){
      const r=state.registrations.find(x=>x.id===regId);
      if(!r) return {ok:false,reason:'notfound'};
      if(idx<0||idx>=r.players.length) return {ok:false,reason:'badindex'};
      const n=(nome||'').trim(), c=(cognome||'').trim();
      if(!n||!c) return {ok:false,reason:'empty'};
      r.players[idx].nome=n; r.players[idx].cognome=c; save(); return {ok:true,reg:r};
    },
    /* staff corregge il nome di una squadra */
    renameTeam(regId, newName){
      const r=state.registrations.find(x=>x.id===regId);
      if(!r) return {ok:false,reason:'notfound'};
      const name=(newName||'').trim();
      if(!name) return {ok:false,reason:'empty'};
      r.teamName=name; save(); return {ok:true,reg:r};
    },
    /* staff rimuove un singolo giocatore da una squadra (es. iscritto due volte per errore) */
    removePlayerFromTeam(regId, idx){
      const r=state.registrations.find(x=>x.id===regId);
      if(!r) return {ok:false,reason:'notfound'};
      if(idx<0||idx>=r.players.length) return {ok:false,reason:'badindex'};
      r.players=r.players.filter((_,i)=>i!==idx); save(); return {ok:true,reg:r};
    },
    /* staff combines several solo registrations into one team (respects the 16 cap) */
    createTeamFromSolos(teamName, soloIds, rosterSize){
      if(state.registrations.filter(r=>r.type==='team').length>=MAX_TEAMS) return null;
      const picked=state.registrations.filter(r=>r.type==='solo'&&soloIds.includes(r.id));
      if(!picked.length) return null;
      const players=picked.map(r=>r.players[0]);
      const cap=players[0];
      const reg={ id:'r'+Date.now(), type:'team', createdAt:new Date().toISOString(), code:uniqueCode(),
        teamName, formedByStaff:true,
        captain:{ nome:((cap.nome||'')+' '+(cap.cognome||'')).trim()||'—', tel:cap.tel||'', email:cap.email||'' },
        rosterSize:rosterSize||Math.max(3,players.length), players };
      state.registrations=state.registrations.filter(r=>!soloIds.includes(r.id));
      state.registrations.push(reg); save(); return reg;
    },
    /* ============ SORTEGGIO & generazione fasi ============ */
    /* squadre disponibili per il sorteggio (iscrizioni di tipo "team") */
    drawableTeams(){ return state.registrations.filter(r=>r.type==='team').map(r=>({id:r.id,name:r.teamName})); },
    /* stato del torneo, per la UI staff */
    tournamentStatus(){
      const d1=state.matches.filter(m=>m.phase==='group1');
      const d2=state.matches.filter(m=>m.phase==='group2');
      const brk=state.matches.filter(m=>['quarti','semi','finale'].includes(m.phase));
      return {
        drawn: Object.keys(state.teams||{}).length>0,
        d1Total:d1.length, d1Done:d1.length>0 && d1.every(m=>m.status==='done'),
        d2Exists:d2.length>0, d2Done:d2.length>0 && d2.every(m=>m.status==='done'),
        bracketExists:brk.length>0,
      };
    },
    /* SORTEGGIO GIRONI — distribuisce 16 squadre a caso in 4 gironi da 4 e crea il calendario G1.
       Azzera eventuali risultati/fasi precedenti. custom = lista [{id,name}] opzionale (per test). */
    drawGroups(custom){
      const list = custom || state.registrations.filter(r=>r.type==='team').map(r=>({id:r.id,name:r.teamName}));
      if(list.length!==16) return {ok:false, reason:'count', count:list.length};
      const sh = shuffle(list);
      const GROUPS=['A','B','C','D'];
      const teamsObj={};
      sh.forEach((t,i)=>{ const g=GROUPS[Math.floor(i/4)];
        teamsObj[t.id]={id:t.id,name:t.name,group:g,color:DRAW_PAL[i%DRAW_PAL.length],tag:initials(t.name)}; });
      /* Calendario Giornata 1 — programma bilanciato.
         Ogni girone da 4 = 6 partite = 3 turni da 2 partite (round robin a cerchio):
           turno 0: (0,1)(2,3)   turno 1: (0,2)(1,3)   turno 2: (0,3)(1,2)
         I 4 gironi vengono INTERVALLATI sui turni globali così che ogni squadra
         abbia sempre lo stesso recupero fra le sue partite:
           slot = turnoDelGirone*4 + indiceGirone
         → girone A gioca ai turni 0,4,8 · B ai 1,5,9 · C ai 2,6,10 · D ai 3,7,11.
         In ogni turno le 2 partite del girone vanno sui 2 mezzi campi in
         contemporanea. Gli orari (con la pausa a metà) sono calcolati da state.schedule. */
      const cfg=schedCfg();
      const ms=[];
      GROUPS.forEach((g,gi)=>{
        const ids=sh.filter((t,i)=>Math.floor(i/4)===gi).map(t=>t.id);
        const pairs=rr4(ids);
        for(let r=0;r<3;r++){
          const slot=r*4+gi;
          for(let k=0;k<2;k++){
            const pair=pairs[r*2+k];
            ms.push(mk({phase:'group1',group:g,day:'SAB 25 LUG',slot,court:'Campo '+(k+1),
              time:slotTime(slot,cfg),aId:pair[0],bId:pair[1]}));
          }
        }
      });
      ms.sort((a,b)=> a.slot-b.slot || a.court.localeCompare(b.court));
      state.teams=teamsObj; state.matches=ms; state.live=null;
      state.d1win={}; state.d2win={}; state.d2groups={}; state.drawnAt=new Date().toISOString();
      state.published=false; // nuovo sorteggio → il calendario torna privato finché lo staff non lo ripubblica
      save(); return {ok:true};
    },
    /* annulla il sorteggio (svuota torneo) */
    clearDraw(){ state.teams={}; state.matches=[]; state.live=null; state.d1win={}; state.d2win={}; state.d2groups={}; delete state.drawnAt; state.published=false; save(); },
    /* pubblica / nasconde il calendario al pubblico (solo staff) */
    isPublished(){ return !!state.published; },
    setPublished(v){ state.published=!!v; save(); return {ok:true, published:state.published}; },
    /* GIORNATA 2 — mini gironi dalle NON qualificate, secondo la formula fissa.
       E:[2A,4C,3D]  F:[2B,4D,3A]  G:[2C,4A,3B]  H:[2D,4B,3C]  (pos 0-index: 2°=1,3°=2,4°=3) */
    generateDay2(){
      const d1=state.matches.filter(m=>m.phase==='group1');
      if(!d1.length) return {ok:false,reason:'nogroups'};
      if(!d1.every(m=>m.status==='done')) return {ok:false,reason:'incomplete'};
      const pick=(g,pos)=>{ const a=standings('group1',g); return a[pos]?a[pos].teamId:null; };
      const formula={ E:[['A',1],['C',3],['D',2]], F:[['B',1],['D',3],['A',2]],
                      G:[['C',1],['A',3],['B',2]], H:[['D',1],['B',3],['C',2]] };
      /* Mini gironi da 3 = 3 partite ciascuno (una squadra riposa a turno).
         I 4 gironi (E,F,G,H) sono intervallati su 2 campi: slot = round*2 + (gi%2),
         campo = E,F→1 / G,H→2 → in ogni turno giocano 2 gironi diversi in
         contemporanea. Orari calcolati dal blocco g2 (config staff). */
      const cfg=schedCfg('g2');
      state.matches=state.matches.filter(m=>m.phase!=='group2');
      const d2groups={};
      Object.keys(formula).forEach((g,gi)=>{
        const ids=formula[g].map(([grp,pos])=>pick(grp,pos)).filter(Boolean);
        d2groups[g]=ids;
        rr3(ids).forEach((pair,r)=>{
          const slot=r*2 + (gi%2);
          state.matches.push(mk({phase:'group2',group:g,day:'DOM 26 LUG',slot,court:'Campo '+(Math.floor(gi/2)+1),
            time:slotTime(slot,cfg),aId:pair[0],bId:pair[1]}));
        });
      });
      state.d2groups=d2groups; reflowSchedule(); save(); return {ok:true};
    },
    /* TABELLONE — quarti con 4 vincitrici G1 + 4 vincitrici G2.
       Abbinamenti: 1A-1H, 1B-1G, 1C-1F, 1D-1E */
    generateBracket(){
      const d1=state.matches.filter(m=>m.phase==='group1');
      const d2=state.matches.filter(m=>m.phase==='group2');
      if(!d1.length||!d1.every(m=>m.status==='done')) return {ok:false,reason:'d1'};
      if(!d2.length||!d2.every(m=>m.status==='done')) return {ok:false,reason:'d2'};
      const w1=(g)=>{ const a=standings('group1',g); return a[0]&&a[0].teamId; };
      const w2=(g)=>{ const a=standings('group2',g); return a[0]&&a[0].teamId; };
      const QF=[[w1('A'),w2('H')],[w1('B'),w2('G')],[w1('C'),w2('F')],[w1('D'),w2('E')]];
      state.matches=state.matches.filter(m=>!['quarti','semi','finale'].includes(m.phase));
      /* Tabellone: `slot` = indice accoppiamento (serve all'avanzamento vincitrici),
         `tslot` = turno orario. Orari dal blocco brk (config staff).
         Turno 0: quarti Q1 (campo1) + Q2 (campo2)
         Turno 1: quarti Q3 (campo1) + Q4 (campo2)
         Turno 2: semifinali SF1 (campo1) + SF2 (campo2)
         Turno 3: finale (campo1) */
      const cfg=schedCfg('brk');
      QF.forEach((q,i)=>{ const tslot=Math.floor(i/2);
        state.matches.push(mk({phase:'quarti',slot:i,tslot,court:'Campo '+((i%2)+1),day:'DOM 26 LUG',time:slotTime(tslot,cfg),aId:q[0],bId:q[1]})); });
      [0,1].forEach(i=>state.matches.push(mk({phase:'semi',slot:i,tslot:2,court:'Campo '+(i+1),day:'DOM 26 LUG',time:slotTime(2,cfg),aId:null,bId:null})));
      state.matches.push(mk({phase:'finale',slot:0,tslot:3,court:'Campo 1',day:'DOM 26 LUG',time:slotTime(3,cfg),aId:null,bId:null}));
      state.d1win={A:w1('A'),B:w1('B'),C:w1('C'),D:w1('D')};
      state.d2win={E:w2('E'),F:w2('F'),G:w2('G'),H:w2('H')};
      reflowSchedule(); save(); return {ok:true};
    },
    // matches
    matchById(id){ return state.matches.find(m=>m.id===id); },
    setScore(id,a,b){ const m=state.matchById?state.matchById(id):state.matches.find(x=>x.id===id); if(m){m.scoreA=a;m.scoreB=b;} save(); },

    /* ============ PROGRAMMA GIRONI (solo staff) ============ */
    /* configurazione di un blocco (g1 = gironi, g2 = mini gironi, brk = tabellone) */
    scheduleConfig(block){ return schedCfg(block||'g1'); },
    /* modifica orari/pausa di un blocco e ricalcola tutti gli orari */
    setScheduleConfig(block, patch){
      if(patch===undefined){ patch=block; block='g1'; }   // retro-compatibilità
      const all=schedAll(); const cur=all[block]||schedAll().g1;
      const next=Object.assign({}, cur, patch);
      next.slotMin=Math.max(5, parseInt(next.slotMin,10)||cur.slotMin);
      next.breakMin=Math.max(0, parseInt(next.breakMin,10)||0);
      next.breakAfter=Math.max(0, parseInt(next.breakAfter,10)||0);
      if(!/^\d{1,2}:\d{2}$/.test(next.start||'')) next.start=cur.start;
      all[block]=next; state.schedule=all; reflowSchedule(); save(); return {ok:true};
    },
    /* sposta una partita su un altro turno/campo (nello stesso blocco); se la
       casella è occupata, scambia le due partite */
    moveMatch(id, targetSlot, targetCourt){
      const m=state.matches.find(x=>x.id===id); if(!m) return {ok:false};
      const blk=blockOf(m.phase), fld=slotField(m.phase);
      const court='Campo '+targetCourt; targetSlot=parseInt(targetSlot,10);
      if(isNaN(targetSlot)||targetSlot<0) return {ok:false};
      const occ=state.matches.find(x=>x.id!==id && blockOf(x.phase)===blk && x[fld]===targetSlot && x.court===court);
      if(occ){ occ[fld]=m[fld]; occ.court=m.court; }
      m[fld]=targetSlot; m.court=court;
      reflowSchedule(); save(); return {ok:true};
    },
    /* forza un orario personalizzato su una singola partita (o annulla l'override) */
    setMatchTimeOverride(id, timeStr){
      const m=state.matches.find(x=>x.id===id); if(!m) return {ok:false};
      const t=(timeStr||'').trim();
      if(t){ if(!/^\d{1,2}:\d{2}$/.test(t)) return {ok:false,reason:'format'}; m.timeOverride=t; }
      else { delete m.timeOverride; }
      reflowSchedule(); save(); return {ok:true};
    },
  };
  // bind matchById onto state for convenience
  Object.defineProperty(state,'matchById',{value:(id)=>state.matches.find(m=>m.id===id),enumerable:false,configurable:true});

  /* ---------- computed: standings ---------- */
  function standings(phase, group){
    const ms = state.matches.filter(m=>m.phase===phase && m.group===group);
    const ids = [...new Set(ms.flatMap(m=>[m.aId,m.bId]))].filter(Boolean);
    const row = {}; ids.forEach(id=>row[id]={teamId:id,w:0,l:0,pf:0,pa:0,pts:0,played:0});
    ms.forEach(m=>{
      if(m.scoreA==null||m.scoreB==null||m.status==='sched') return;
      if(m.status==='live') return; // live non conta ancora
      const A=row[m.aId],B=row[m.bId]; if(!A||!B) return;
      A.played++;B.played++; A.pf+=m.scoreA;A.pa+=m.scoreB; B.pf+=m.scoreB;B.pa+=m.scoreA;
      if(m.scoreA>m.scoreB){A.w++;B.l++;A.pts+=2;B.pts+=1;} else {B.w++;A.l++;B.pts+=2;A.pts+=1;}
    });
    return Object.values(row).sort((x,y)=> y.pts-x.pts || (y.pf-y.pa)-(x.pf-x.pa) || y.pf-x.pf || x.teamId.localeCompare(y.teamId));
  }

  function teamName(id){ return id&&state.teams[id]?state.teams[id].name : (id?id:'—'); }

  window.ETG = { Store, SEED, standings, teamName, MAX_TEAMS, FEE,
    helpers:{
      bracketMatches(){ return {
        quarti: state.matches.filter(m=>m.phase==='quarti').sort((a,b)=>a.slot-b.slot),
        semi: state.matches.filter(m=>m.phase==='semi').sort((a,b)=>a.slot-b.slot),
        finale: state.matches.filter(m=>m.phase==='finale'),
      };},
      liveMatch(){ return state.matches.find(m=>m.status==='live'); },
      schedule(){ return state.matches.slice().sort((a,b)=> (a.day<b.day?-1:a.day>b.day?1:0) || (a.time<b.time?-1:1)); },
      /* orario di un turno (per la UI staff) */
      slotTime,
      blockOf, phasesOf,
      /* VISTA GENERALE a griglia di un blocco: righe = turni, colonne = 2 campi,
         con la riga di pausa evidenziata. block: 'g1' | 'g2' | 'brk'. */
      phaseGrid(block){
        block=block||'g1'; const cfg=schedCfg(block);
        const phs=phasesOf(block), fld=(block==='brk')?'tslot':'slot';
        const ms=state.matches.filter(m=>phs.includes(m.phase));
        if(!ms.length) return {cfg, rows:[]};
        const slots=[...new Set(ms.map(m=>m[fld]))].sort((a,b)=>a-b);
        const rows=slots.map(sl=>({
          slot:sl, time:slotTime(sl,cfg),
          breakBefore: cfg.breakAfter>0 && sl===cfg.breakAfter,
          courts:[1,2].map(c=>ms.find(m=>m[fld]===sl && m.court==='Campo '+c)||null),
        }));
        return {cfg, rows};
      },
      /* comodità: griglie dei singoli blocchi */
      groupGrid(){ return window.ETG.helpers.phaseGrid('g1'); },
      day2Grid(){ return window.ETG.helpers.phaseGrid('g2'); },
      bracketGrid(){ return window.ETG.helpers.phaseGrid('brk'); },
      /* opzioni "turno" per l'editor, in base al blocco della partita */
      slotOptionsFor(phase){
        const g=window.ETG.helpers.phaseGrid(blockOf(phase));
        return g.rows.map(r=>({v:String(r.slot), l:'Turno '+(r.slot+1)+' · '+r.time}));
      },
      /* etichetta breve di una partita (per griglie/liste) */
      matchLabel(m){
        if(!m) return '';
        if(m.phase==='group1'||m.phase==='group2') return 'Girone '+m.group;
        if(m.phase==='quarti') return 'Quarto '+((m.slot||0)+1);
        if(m.phase==='semi') return 'Semifinale '+((m.slot||0)+1);
        if(m.phase==='finale') return 'Finale';
        return m.phase;
      },
      /* VISTA per raggruppamento: partite di un girone (o fase) ordinate per turno */
      groupSchedule(group, phase){
        phase=phase||'group1'; const fld=slotField(phase);
        return state.matches.filter(m=>m.phase===phase&&m.group===group)
          .slice().sort((a,b)=> (a[fld]-b[fld]) || a.court.localeCompare(b.court));
      },
    }
  };
})();
