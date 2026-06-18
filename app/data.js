/* ============ ENJOY THE GAME — data layer ============ */
(function(){
  const VER = 'etg_v5_2026_1';

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
      const D1_TIMES=['10:00','10:30','11:00','11:30','12:00','12:30'];
      const ms=[];
      GROUPS.forEach((g,gi)=>{
        const ids=sh.filter((t,i)=>Math.floor(i/4)===gi).map(t=>t.id);
        rr4(ids).forEach((pair,ri)=>{
          ms.push(mk({phase:'group1',group:g,day:'SAB 25 LUG',time:D1_TIMES[ri],court:'Campo '+(gi<2?1:2),aId:pair[0],bId:pair[1]}));
        });
      });
      state.teams=teamsObj; state.matches=ms; state.live=null;
      state.d1win={}; state.d2win={}; state.d2groups={}; state.drawnAt=new Date().toISOString();
      save(); return {ok:true};
    },
    /* annulla il sorteggio (svuota torneo) */
    clearDraw(){ state.teams={}; state.matches=[]; state.live=null; state.d1win={}; state.d2win={}; state.d2groups={}; delete state.drawnAt; save(); },
    /* GIORNATA 2 — mini gironi dalle NON qualificate, secondo la formula fissa.
       E:[2A,4C,3D]  F:[2B,4D,3A]  G:[2C,4A,3B]  H:[2D,4B,3C]  (pos 0-index: 2°=1,3°=2,4°=3) */
    generateDay2(){
      const d1=state.matches.filter(m=>m.phase==='group1');
      if(!d1.length) return {ok:false,reason:'nogroups'};
      if(!d1.every(m=>m.status==='done')) return {ok:false,reason:'incomplete'};
      const pick=(g,pos)=>{ const a=standings('group1',g); return a[pos]?a[pos].teamId:null; };
      const formula={ E:[['A',1],['C',3],['D',2]], F:[['B',1],['D',3],['A',2]],
                      G:[['C',1],['A',3],['B',2]], H:[['D',1],['B',3],['C',2]] };
      const D2_TIMES=['09:30','10:15','11:00'];
      state.matches=state.matches.filter(m=>m.phase!=='group2');
      const d2groups={};
      Object.keys(formula).forEach((g,gi)=>{
        const ids=formula[g].map(([grp,pos])=>pick(grp,pos)).filter(Boolean);
        d2groups[g]=ids;
        rr3(ids).forEach((pair,ri)=>{
          state.matches.push(mk({phase:'group2',group:g,day:'DOM 26 LUG',time:D2_TIMES[ri],court:'Campo '+(gi<2?1:2),aId:pair[0],bId:pair[1]}));
        });
      });
      state.d2groups=d2groups; save(); return {ok:true};
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
      const QF_TIMES=['14:00','14:40','15:20','16:00'];
      QF.forEach((q,i)=>state.matches.push(mk({phase:'quarti',slot:i,day:'DOM 26 LUG',time:QF_TIMES[i],court:'Campo 1',aId:q[0],bId:q[1]})));
      state.matches.push(mk({phase:'semi',slot:0,day:'DOM 26 LUG',time:'17:00',court:'Campo 1',aId:null,bId:null}));
      state.matches.push(mk({phase:'semi',slot:1,day:'DOM 26 LUG',time:'17:40',court:'Campo 1',aId:null,bId:null}));
      // slot 0 = finale 3°/4° posto; slot 1 = finale 1°/2° posto
      state.matches.push(mk({phase:'finale',slot:0,day:'DOM 26 LUG',time:'18:30',court:'Campo 1',aId:null,bId:null}));
      state.matches.push(mk({phase:'finale',slot:1,day:'DOM 26 LUG',time:'19:20',court:'Campo 1',aId:null,bId:null}));
      state.d1win={A:w1('A'),B:w1('B'),C:w1('C'),D:w1('D')};
      state.d2win={E:w2('E'),F:w2('F'),G:w2('G'),H:w2('H')};
      save(); return {ok:true};
    },
    // matches
    matchById(id){ return state.matches.find(m=>m.id===id); },
    setScore(id,a,b){ const m=state.matchById?state.matchById(id):state.matches.find(x=>x.id===id); if(m){m.scoreA=a;m.scoreB=b;} save(); },
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
        finale: state.matches.filter(m=>m.phase==='finale').sort((a,b)=>a.slot-b.slot),
      };},
      liveMatch(){ return state.matches.find(m=>m.status==='live'); },
      schedule(){ return state.matches.slice().sort((a,b)=> (a.day<b.day?-1:a.day>b.day?1:0) || (a.time<b.time?-1:1)); },
    }
  };
})();
