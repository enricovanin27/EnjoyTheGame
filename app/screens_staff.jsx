/* ============ ENJOY THE GAME — area staff ============ */

/* Nota sicurezza: il PIN dello staff NON e' piu' nel codice.
   Viene verificato esclusivamente dal server (Supabase, tabella app_config),
   cosi' non e' leggibile da chi guarda i sorgenti su GitHub. */

/* ---------- NOI module — exact reproduction of "NOI Paese Modulo adesione 2025", filled with data ---------- */
function NCirc({on}){ return <span className="circ">{on?<i></i>:null}</span>; }
function NSq({on}){ return <span className="sq">{on?'✓':''}</span>; }
function NCell({lab,val,grow,style,children}){
  return (
    <div className="noi-cell" style={Object.assign(grow?{flex:grow}:{},style||{})}>
      <span className="lab">{lab}</span>
      {children!==undefined ? children : <span className="val">{val||'\u00A0'}</span>}
    </div>
  );
}
/* shared derived person fields for the NOI documents */
function noiDerive(p){
  const minor=isMinor(p);
  const dataComp=new Date().toLocaleDateString('it-IT');
  const nascita=p.nascita?new Date(p.nascita).toLocaleDateString('it-IT'):'';
  const estera=p.naz==='Estera';
  const cf=(p.cf||'').toUpperCase();
  const fullName=[p.cognome,p.nome].filter(Boolean).join(' ');
  const tutName=[p.tutCognome,p.tutNome].filter(Boolean).join(' ');
  return {minor,dataComp,nascita,estera,cf,fullName,tutName};
}

/* ---------- NOI page 2 — Dichiarazione liberatoria immagini (auto-filled) ---------- */
function NoiDoc2({p}){
  const {minor,dataComp,nascita,fullName,tutName}=noiDerive(p);
  // signer of the release: tutor for minors, the member themself for adults
  const sigImg = minor ? p.tutFirma : p.firma;
  const nbsp='\u00A0';
  return (
    <div className="noi-page2">
      {/* header */}
      <div className="noi2-head">
        <img className="logo" src="assets/noi-logo.jpg" alt="NOI Associazione"/>
        <div className="mid">
          <div className="t0">DICHIARAZIONE LIBERATORIA IMMAGINI</div>
          <div className="t1">NOI ASSOCIAZIONE Circolo Oratorio “Don Bosco” APS</div>
          <div className="t2">Piazza Mons. Andreatti 3 · 31038 PAESE (TV)</div>
        </div>
        <div className="rt">
          <div className="u">noiassociazione.it</div>
          <div className="dots"><i></i><i></i><i></i></div>
        </div>
      </div>

      {/* utente / minore interessato */}
      <div className="noi2-lab">NOMINATIVO DELL’UTENTE / MINORE INTERESSATO</div>
      <div className="noi2-box">
        <div className="noi2-fr">
          <span className="k">Cognome e Nome</span>
          <span className="v">{fullName||nbsp}</span>
          <span className="k">nato il</span>
          <span className="v sm">{nascita||nbsp}</span>
          <span className="k">a</span>
          <span className="v md">{p.luogo||nbsp}</span>
        </div>
      </div>

      {/* chi firma in caso di minore */}
      <div className="noi2-lab">NOMINATIVO DI CHI FIRMA IN CASO DI MINORE / AMMINISTRAZIONE DI SOSTEGNO / INTERDIZIONE / INABILITAZIONE</div>
      <div className="noi2-box">
        <div className="noi2-fr">
          <span className="k">Cognome e Nome (1)</span>
          <span className="v">{minor?(tutName||nbsp):nbsp}</span>
          <span className="k">nato il</span>
          <span className="v sm">{nbsp}</span>
          <span className="k">a</span>
          <span className="v md">{nbsp}</span>
        </div>
        <div className="noi2-fr">
          <span className="k">Cognome e Nome (2)</span>
          <span className="v">{nbsp}</span>
          <span className="k">nato il</span>
          <span className="v sm">{nbsp}</span>
          <span className="k">a</span>
          <span className="v md">{nbsp}</span>
        </div>
        <div className="noi2-checks">
          <span className="noi-ck"><NSq on={minor}/>Genitori</span>
          <span className="noi-ck"><NSq on={false}/>Chi ne fa le veci</span>
          <span className="noi-ck"><NSq on={false}/>Amministratore di Sostegno</span>
          <span className="noi-ck"><NSq on={false}/>Curatore</span>
          <span className="noi-ck"><NSq on={false}/>Tutore</span>
        </div>
      </div>

      <div className="noi2-auth">Autorizza</div>
      <p className="noi-p">Circolo Oratorio “Don Bosco” APS all’utilizzo e alla pubblicazione gratuita delle immagini e video che ritraggono il sopraindicato INTERESSATO in occasione delle attività del Circolo/Oratorio che verranno trattati per le seguenti finalità: pubblicazione di immagini e/o video sui siti internet istituzionali, social network, produzioni editoriali e più in generale sul materiale di comunicazione. Le finalità di tali pubblicazioni sono meramente di carattere didattico o informativo/promozionale.</p>
      <p className="noi-p">Con questa liberatoria il Circolo Oratorio “Don Bosco” APS viene esonerato da ogni responsabilità diretta o indiretta per ogni eventuale danno derivante al soggetto sopra indicato. Il sottoscritto conferma di non aver nulla a pretendere in ragione di quanto sopraindicato e di rinunciare irrevocabilmente ad ogni diritto, azione o pretesa derivante da quanto sopra autorizzato. La presente autorizzazione non consente l'uso delle immagini e video in contesti che pregiudichino la dignità personale ed il decoro e comunque per uso e/o fini diversi da quelli sopra indicati.</p>
      <p className="noi-p">In conformità alle leggi vigenti in materia di privacy e al Regolamento UE 2016/679, recante disposizioni per la tutela delle persone e di altri soggetti rispetto al trattamento e alla protezione dei dati personali, stabilisce che il soggetto interessato debba essere preventivamente informato in merito all’utilizzo dei dati che lo riguardano e che il trattamento dei dati personali sia ammesso solo con il consenso espresso del soggetto interessato, salvo i casi previsti dalla legge. Secondo le normative indicate, tale trattamento sarà improntato ai principi di correttezza, liceità e trasparenza e di tutela della Sua riservatezza e dei Suoi diritti. Pertanto Le forniamo le seguenti informazioni:</p>

      <div className="noi2-h">1) FINALITÀ DEL TRATTAMENTO DATI</div>
      <p className="noi-p">I dati (dati identificativi) da Lei forniti, o derivanti da immagini e/o riprese video che ritraggono l’interessato e/o il minore in occasione delle attività sopra dette verranno trattati per le seguenti finalità: pubblicazione di immagini e/o video sui siti internet istituzionali, social network e più in generale sul materiale di comunicazione del Circolo.</p>
      <div className="noi2-h">2) MODALITÀ DEL TRATTAMENTO DATI</div>
      <p className="noi-p">Circolo Oratorio “Don Bosco” APS effettua il trattamento dei dati principalmente con strumenti elettronici ed informatici, memorizzati sia su supporti informatici che su supporti cartacei che su ogni altro tipo di supporto idoneo, e ciò nel rispetto delle misure minime di sicurezza e secondo criteri di liceità, correttezza e riservatezza, nella piena tutela dei Suoi diritti in qualità di soggetto INTERESSATO del trattamento, direttamente o anche attraverso terzi.</p>
      <div className="noi2-h">3) BASE GIURIDICA</div>
      <p className="noi-p">Il conferimento è basato su consenso. La non autorizzazione al trattamento dei dati preclude la possibilità che la propria foto o riprese video vengano utilizzate.</p>
      <div className="noi2-h">4) CATEGORIE DI DESTINATARI</div>
      <p className="noi-p">Ferme restando le comunicazioni eseguite in adempimento di obblighi di legge e contrattuali, tutti i dati raccolti ed elaborati potranno essere comunicati, esclusivamente per le finalità sopra specificate, alle seguenti categorie di interessati:</p>
      <p className="noi2-li">− Incaricati interni coinvolti nell’ambito del progetto didattico e/o promozionale e/o informativo utilizzando siti istituzionali, piattaforme social e produzioni editoriali.</p>
      <p className="noi2-li">− Soggetti esterni che svolgono specifici incarichi a livello locale, nell’ambito dell’attività esercitata.</p>
      <p className="noi2-li">− NOI Associazione APS, l’Ente Territoriale per attività promozionale dell’associazione.</p>
      <div className="noi2-h">5) PERIODO DI CONSERVAZIONE</div>
      <p className="noi-p">I dati sono conservati per il tempo necessario allo svolgimento del rapporto in essere e nei termini di legge.</p>
      <div className="noi2-h">6) DIRITTI DELL’INTERESSATO</div>
      <p className="noi-p">Ai sensi del Regolamento europeo 679/2016 (GDPR) e della normativa nazionale, l'interessato può, secondo le modalità e nei limiti previsti dalla vigente normativa, esercitare i seguenti diritti: richiedere la conferma dell'esistenza di dati personali che lo riguardano (diritto di accesso); conoscerne l'origine; riceverne comunicazione intelligibile; avere informazioni circa la logica, le modalità e le finalità del trattamento; richiederne l'aggiornamento, la rettifica, l'integrazione, la cancellazione, la trasformazione in forma anonima, il blocco dei dati trattati in violazione di legge; nei casi di trattamento basato su consenso, ricevere i propri dati in forma strutturata e leggibile; il diritto di presentare un reclamo all’Autorità di controllo. Le richieste vanno rivolte al Titolare del trattamento Circolo Oratorio “Don Bosco” APS con sede in Piazza Mons. Andreatti 3, 31038 PAESE (TV).</p>

      <p className="noi2-consent">Il/la sottoscritto/a, acquisite le informazioni fornite dal titolare del trattamento ai sensi delle leggi vigenti e dell’art. 13 Regolamento UE 2016/679, presta il suo consenso al trattamento dei dati personali per i fini indicati nella suddetta informativa</p>
      <div className="noi2-sinox">
        <span className="noi-ck"><NSq on={p.consensoImmagini!==false}/>SI</span>
        <span className="noi-ck"><NSq on={p.consensoImmagini===false}/>NO</span>
      </div>
      <div className="noi2-foot">
        <span className="fld">Luogo <span className="v">{p.localita||nbsp}</span></span>
        <span className="fld">Data <span className="v">{dataComp}</span></span>
        <span className="sigwrap">
          <div style={{fontSize:7}}>Firma Interessato / Genitori / A.d.S. / Curatore / Tutore</div>
          <div className="sl"><span className="num">(1)</span><span className="sig">{sigImg ? <img src={sigImg} alt="firma"/> : null}</span></div>
          <div className="sl"><span className="num">(2)</span><span className="sig"></span></div>
        </span>
      </div>
    </div>
  );
}

function NoiDoc({p}){
  const {minor,dataComp,nascita,estera,cf}=noiDerive(p);
  return (<>
    <div className="noi-page">
      {/* ===== header ===== */}
      <div className="noi-head">
        <img className="logo" src="assets/noi-logo.jpg" alt="NOI Associazione"/>
        <div className="mid">
          <div className="t1">NOI ASSOCIAZIONE Circolo Oratorio “Don Bosco” Paese <sup>APS</sup></div>
          <div className="t2">Piazza Mons. Andreatti 3<br/>31038 PAESE (TV)</div>
        </div>
        <div className="rt">
          <div className="cc">Codice circolo</div>
          <div className="vt">VT093</div>
          <div className="noi-year">2026</div>
        </div>
      </div>

      {/* ===== informativa ===== */}
      <div className="noi-itit">Informativa ai sensi dell’articolo 13 REG (UE) 679/16 - DATI PERSONALI</div>
      <p className="noi-p">Utilizziamo, anche tramite collaboratori esterni, i dati che la riguardano esclusivamente per le nostre finalità associative, contrattuali, amministrative e contabili, anche quando li comunichiamo a terzi. Il conferimento dei dati è obbligatorio per instaurare il rapporto e svolgere quanto connesso ad esso. I dati saranno conservati come previsto da statuto. Informazioni dettagliate, anche in ordine ai suoi diritti, sono riportati sull’informativa resa disponibile presso il circolo e comunque scaricabile dal sito internet <a href="http://www.noihub.it">http://www.noihub.it</a>. I dati personali dei tesserati trattati da NOI Associazione NON sono dati sensibili perché non rivelano l’adesione a un’associazione di carattere religioso: il riferimento ai valori del Vangelo inserito nello statuto associativo è riferito a principi universalmente identificati come valori etici, spirituali e sociali adottati e dichiarati in molte Costituzioni civili di Stati che riconoscono la centralità dell’uomo e l’esigenza di promuovere uguaglianza e solidarietà per una migliore qualità della vita. Etica, cultura e formazione trovano posto naturale nella famiglia, nella scuola e all’Oratorio, senza farli diventare ambiti religiosi, bensì luoghi di crescita delle nuove generazioni.</p>
      <p className="noi-p"><b>CONSENSO</b> Benché l’art. 9 del regolamento, alla lettera d) preveda per le associazioni senza scopo di lucro la possibilità di trattare i dati personali anche senza il consenso dell’interessato, con la firma accanto ai propri dati personali esprimiamo il consenso al trattamento. E ’obbligatorio da parte di chi esercita la responsabilità genitoriale esprimere il consenso per il minore di anni 18.</p>

      {/* ===== scheda bar ===== */}
      <div className="noi-bar">Scheda di adesione personale</div>

      <p className="noi-p">I Sottoscritti dichiarano: di conoscere lo Statuto del Circolo e si impegnano a rispettare le disposizioni statutarie, le deliberazioni degli organi associativi e le disposizioni previste dal regolamento interno. Di essere edotti che la domanda di prima iscrizione è accolta con delibera del Consiglio direttivo e consapevoli che l’esercizio dei propri diritti avranno decorrenza successivamente a tale delibera consiliare. Il tesseramento per il minore è possibile solo con la firma di chi esercita la responsabilità genitoriale ex art. 5 del d.P.R. n. 445/2000. Il presente certificato non può essere prodotto agli organi della pubblica amministrazione o ai privati gestori di pubblici esercizi.</p>

      {/* ===== quota ===== */}
      <div className="noi-quota"><span>Quota Associativa :&nbsp; 12 Euro (Adulti)</span><span>7 Euro ( Minori )</span></div>
      <div className="noi-pay">Il pagamento della quota adulti è dovuta per tutti i soci che compiono i 18 anni di età nell’anno corrente</div>
      <p className="noi-exempt"><b>Esenzione da IVA e da bollo</b>: D.Lgs 117/2017, art. 86, c. 8; art. 82, c. 5. - Art. 4, comma 4, Dpr 633/72; Dpr 642/72 - Tab. all. B art. 7 - Ris. n. 450222/88</p>

      {/* ===== SOCIO ===== */}
      <div className="noi-stitle">Dati personali SOCIO</div>
      <div className="noi-tbl">
        <div className="noi-row">
          <NCell lab="Cognome" val={p.cognome} grow="2 1 0"/>
          <NCell lab="Nome" val={p.nome} grow="2 1 0"/>
          <div className="noi-cell" style={{flex:'0 0 78px'}}>
            <span className="noi-ck"><NCirc on={p.sesso==='M'}/>Maschio</span>
            <span className="noi-ck" style={{marginTop:5}}><NCirc on={p.sesso==='F'}/>Femmina</span>
          </div>
        </div>
        <div className="noi-row">
          <NCell lab="Data di nascita" val={nascita} grow="1 1 0"/>
          <NCell lab="Luogo di nascita" val={p.luogo} grow="1.4 1 0"/>
          <div className="noi-cell" style={{flex:'1.7 1 0'}}>
            <span className="lab">Codice fiscale ( 16 caratteri )</span>
            <div className="noi-cf">{cf||'\u00A0'}</div>
          </div>
        </div>
        <div className="noi-row">
          <div className="noi-cell" style={{flex:'1.2 1 0'}}>
            <span className="lab">Nazionalità&nbsp;
              <span className="noi-ck" style={{marginLeft:4}}>Italiana <NSq on={!estera}/></span>
              <span className="noi-ck" style={{marginLeft:10}}>Estera <NSq on={estera}/></span>
            </span>
            <div style={{flex:1}}></div>
            <span className="lab" style={{marginTop:'auto'}}>Specificare se Estera</span>
            <span className="val" style={{paddingTop:1}}>{estera?(p.nazEstera||'\u00A0'):'\u00A0'}</span>
          </div>
          <NCell lab="Indirizzo" val={p.indirizzo} grow="2 1 0"/>
        </div>
        <div className="noi-row">
          <NCell lab="CAP" val={p.cap} style={{flex:'0 0 66px'}}/>
          <NCell lab="Località" val={p.localita} grow="1 1 0"/>
          <NCell lab="Prov." val={p.prov} style={{flex:'0 0 52px'}}/>
        </div>
        <div className="noi-row">
          <NCell lab="Telefono" val={p.tel} grow="1 1 0"/>
          <NCell lab="E- mail ( opzionale )" val={p.email} grow="1.3 1 0"/>
        </div>
        <div className="noi-row">
          <div className="noi-cell" style={{flex:'2.4 1 0'}}>
            <span className="lab">Firma dell'interessato ( per i minori di 14 anni firma del Tutore )</span>
            <div className="noi-sig">{p.firma ? <img src={p.firma} alt="firma"/> : null}</div>
          </div>
          <div className="noi-cell noi-tess" style={{flex:'0 0 auto'}}>
            <span className="tt">Tessera :</span>
            <div className="box">
              <div className="o"><span className="b"><NSq on={p.tessera==='Virtuale'}/></span>Virtuale</div>
              <div className="o"><span className="b"><NSq on={p.tessera==='Fisica'}/></span>Fisica</div>
            </div>
          </div>
          <NCell lab="Data Compilazione" val={dataComp} grow="1 1 0"/>
        </div>
      </div>

      <div className="noi-consent">Con la Firma l’Interessato conferma di aver ricevuto copia ed accettato l’informativa completa al trattamento dei dati</div>

      {/* ===== TUTORE ===== */}
      <div className="noi-stitle">Dati Genitore / Tutore del Minore</div>
      <div className="noi-tbl">
        <div className="noi-row">
          <NCell lab="Cognome (Tutore)" val={minor?p.tutCognome:''} grow="1 1 0"/>
          <NCell lab="Nome (Tutore)" val={minor?p.tutNome:''} grow="1.3 1 0"/>
        </div>
        <div className="noi-row">
          <div className="noi-cell" style={{flex:'2 1 0'}}>
            <span className="lab">Firma per adesione del Tutore (Obbligatoria per i minori)</span>
            <div className="noi-sig">{minor&&p.tutFirma ? <img src={p.tutFirma} alt="firma tutore"/> : null}</div>
          </div>
          <NCell lab="Data Compilazione" val={minor?dataComp:''} grow="1 1 0"/>
        </div>
      </div>
    </div>
    <NoiDoc2 p={p}/>
  </>);
}

/* ---------- registrations ---------- */
function StaffRegs(){
  const store=useStore(); const regs=store.state.registrations;
  const [openP,setOpenP]=useState(null); // {reg,player,idx}
  const [delT,setDelT]=useState(null);   // team registration pending delete
  const [delP,setDelP]=useState(null);   // {reg,player,idx} player pending removal from a team
  const [formMode,setFormMode]=useState(false); // selecting solos to form a team
  const [picked,setPicked]=useState([]); // solo ids
  const [newName,setNewName]=useState(''); // new team name
  const [doForm,setDoForm]=useState(false); // confirm sheet open
  const teams=regs.filter(r=>r.type==='team'); const solos=regs.filter(r=>r.type==='solo');
  const [refreshing,setRefreshing]=useState(false);
  const refresh=async ()=>{ if(refreshing) return; setRefreshing(true); try{ await window.ETG.Store.loadStaffAsync(window.ETG.staffPin); } finally { setRefreshing(false); } };
  // aggiornamento automatico ogni 20s (solo se l'archivio cloud è attivo)
  useEffect(()=>{ if(!(window.ETG.cloud&&window.ETG.cloud.enabled)) return;
    const t=setInterval(()=>{ window.ETG.Store.loadStaffAsync(window.ETG.staffPin); },20000); return ()=>clearInterval(t); },[]);
  const playerName=(p,i)=> (p.nome+' '+p.cognome).trim()||('Giocatore '+(i+1));
  const MAX=window.ETG.MAX_TEAMS;

  // riepilogo taglie maglie (tutti i moduli: squadre + singoli)
  const SHIRT=['S','M','L','XL','XXL'];
  const allPlayers=[...teams.flatMap(t=>t.players),...solos.map(s=>s.players[0])].filter(Boolean);
  const tally={}; SHIRT.forEach(z=>tally[z]=0); let noSize=0;
  allPlayers.forEach(p=>{ const z=(p.taglia||'').toUpperCase(); if(SHIRT.includes(z)) tally[z]++; else noSize++; });

  return (
    <div className="stack g20">
      <div className="row g10 wrap">
        <div className="card card-pad" style={{flex:1,textAlign:'center',padding:'14px'}}><div className="display" style={{fontSize:28,color: teams.length>=MAX?'var(--red)':'var(--orange)'}}>{teams.length}<span style={{fontSize:16,color:'var(--ink-3)'}}>/{MAX}</span></div><div className="tiny">squadre</div></div>
        <div className="card card-pad" style={{flex:1,textAlign:'center',padding:'14px'}}><div className="display" style={{fontSize:28,color:'var(--teal)'}}>{teams.reduce((s,t)=>s+t.players.length,0)}</div><div className="tiny">giocatori</div></div>
        <div className="card card-pad" style={{flex:1,textAlign:'center',padding:'14px'}}><div className="display" style={{fontSize:28}}>{teams.reduce((s,t)=>s+t.players.length,0)+solos.length}</div><div className="tiny">moduli NOI</div></div>
      </div>

      {/* riepilogo taglie maglie */}
      <div className="card card-pad">
        <div className="row between" style={{marginBottom:12,alignItems:'baseline'}}>
          <div className="eyebrow">Riepilogo taglie maglie</div>
          <span className="tiny">{allPlayers.length} giocator{allPlayers.length===1?'e':'i'}</span>
        </div>
        <div className="row g8" style={{flexWrap:'wrap'}}>
          {SHIRT.map(z=>(
            <div key={z} style={{flex:'1 1 0',minWidth:50,textAlign:'center',padding:'10px 4px',borderRadius:12,background:'var(--sand-soft)'}}>
              <div className="display" style={{fontSize:24,color: tally[z]?'var(--ink)':'var(--ink-3)'}}>{tally[z]}</div>
              <div className="tiny" style={{fontWeight:700,letterSpacing:'.08em'}}>{z}</div>
            </div>
          ))}
        </div>
        {noSize>0
          ? <div className="notice" style={{marginTop:12,background:'rgba(220,73,55,.08)',color:'#9c3325'}}><b>{noSize}</b> giocator{noSize===1?'e':'i'} senza taglia indicata — vedi le righe segnate in rosso.</div>
          : (allPlayers.length>0 && <div className="tiny" style={{marginTop:10,color:'var(--ok,#1E8A5B)',fontWeight:700}}>✓ Tutti i giocatori hanno indicato la taglia.</div>)}
      </div>

      <div>
        <div className="row between" style={{marginBottom:12,alignItems:'center'}}>
          <div className="eyebrow">Squadre iscritte</div>
          <button className="chip" onClick={refresh} disabled={refreshing} title="Aggiorna dall'archivio">
            <Ic.fwd style={{width:12,height:12,transform:'rotate(90deg)'}}/> {refreshing?'Aggiorno…':'Aggiorna'}
          </button>
        </div>
        <div className="stack g10">
          {teams.length===0 && <div className="notice">Ancora nessuna squadra. Le iscrizioni inviate dal sito compaiono qui.</div>}
          {teams.map(r=>(
            <div key={r.id} className="card card-pad">
              <div className="row between" style={{alignItems:'flex-start'}}>
                <div className="row g10"><Avatar name={r.teamName} color="var(--orange)"/><div><div style={{fontWeight:800}}>{r.teamName}</div><div className="tiny">Cap. {r.captain&&r.captain.nome} · {r.captain&&r.captain.tel}</div></div></div>
                <button className="iconbtn" title="Elimina squadra" onClick={()=>setDelT(r)} style={{borderColor:'rgba(220,73,55,.35)',color:'var(--red)',width:34,height:34,flex:'0 0 auto'}}><Ic.trash style={{width:16,height:16}}/></button>
              </div>
              <div className="row g8" style={{marginTop:11,flexWrap:'wrap',alignItems:'center'}}>
                <span className="chip chip-teal" style={{fontFamily:'var(--mono)',letterSpacing:'.1em'}}><Ic.key style={{width:12,height:12}}/> {r.code||'—'}</span>
                <span className={'chip '+(r.players.length>=(r.rosterSize||0)?'chip-teal':'')}>{r.players.length}/{r.rosterSize||r.players.length} in rosa</span>
                {r.rosterSize>r.players.length && <span className="tiny" style={{color:'var(--ink-3)'}}>in attesa di {r.rosterSize-r.players.length} moduli</span>}
              </div>
              <div className="hr-soft" style={{margin:'12px 0'}}></div>
              <div className="stack g8">
                {r.players.length===0 && <div className="tiny" style={{color:'var(--ink-3)'}}>Nessun giocatore ancora. Condividono il codice per aggiungersi.</div>}
                {r.players.map((p,i)=>(
                  <button key={i} onClick={()=>setOpenP({reg:r,player:p,idx:i})} style={{all:'unset',cursor:'pointer'}}>
                    <div className="listrow" style={{padding:'10px 12px'}}>
                      <span className="mono" style={{fontSize:11,color:'var(--ink-3)',width:18}}>{i+1}</span>
                      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{playerName(p,i)}</div><div className="tiny">{i===0?'Capitano · ':''}{isMinor(p)?'Minorenne':'Maggiorenne'} · {p.cf? p.cf.slice(0,6)+'…':'CF —'} · {p.taglia?('Taglia '+p.taglia):<span style={{color:'var(--red)',fontWeight:700}}>taglia mancante</span>}</div></div>
                      {((isMinor(p)&&p.tutFirma)||(!isMinor(p)&&p.firma)) ? <span className="chip chip-teal"><Ic.check style={{width:12,height:12}}/> firmato</span> : <span className="chip chip-red">no firma</span>}
                      <Ic.fwd style={{width:16,height:16,color:'var(--ink-3)'}}/>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="row between" style={{marginBottom:12,alignItems:'center'}}>
          <div className="eyebrow">Iscritti singoli · da assegnare a una squadra</div>
          {solos.length>0 && (teams.length<MAX) && (
            formMode
              ? <button className="chip" onClick={()=>{setFormMode(false);setPicked([]);}}>Annulla</button>
              : <button className="chip chip-orange" onClick={()=>setFormMode(true)}><Ic.users style={{width:13,height:13}}/> Forma squadra</button>
          )}
        </div>
        {formMode && (
          <div className="notice" style={{marginBottom:12}}>Seleziona i singoli da unire in una squadra. Il primo selezionato diventa il <b>capitano</b>.</div>
        )}
        {teams.length>=MAX && solos.length>0 && (
          <div className="notice" style={{marginBottom:12}}>Tabellone al completo (16/16): elimina una squadra per liberare un posto e poter formare una squadra dai singoli.</div>
        )}
        <div className="stack g8">
          {solos.length===0 && <div className="notice">Nessun singolo al momento.</div>}
          {solos.map(r=>{ const p=r.players[0]; const sel=picked.includes(r.id); const order=picked.indexOf(r.id);
            const toggle=()=>setPicked(ps=>ps.includes(r.id)?ps.filter(x=>x!==r.id):[...ps,r.id]);
            return (
            <button key={r.id} onClick={()=>formMode?toggle():setOpenP({reg:r,player:p,idx:0})} style={{all:'unset',cursor:'pointer'}}>
              <div className="listrow" style={sel?{borderColor:'var(--orange)',background:'var(--sand-soft)'}:null}>
                {formMode && (
                  <span style={{width:24,height:24,borderRadius:'50%',flex:'0 0 auto',display:'grid',placeItems:'center',
                    border:'2px solid '+(sel?'var(--orange)':'var(--line-2)'),background:sel?'var(--orange)':'transparent',color:'#fff',fontWeight:800,fontSize:12}}>
                    {sel?order+1:''}
                  </span>
                )}
                <Avatar name={playerName(p,0)} color="var(--teal)"/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{playerName(p,0)}</div>
                  <div className="tiny">{p.ruolo||'ruolo n/d'}{p.altezza?` · ${p.altezza} cm`:''} · {isMinor(p)?'minorenne':'maggiorenne'} · {p.taglia?('Taglia '+p.taglia):<span style={{color:'var(--red)',fontWeight:700}}>taglia mancante</span>}</div>
                </div>
                {!formMode && (((isMinor(p)&&p.tutFirma)||(!isMinor(p)&&p.firma)) ? <span className="chip chip-teal"><Ic.check style={{width:12,height:12}}/></span> : <span className="chip chip-red">!</span>)}
                {!formMode && <Ic.fwd style={{width:16,height:16,color:'var(--ink-3)'}}/>}
              </div>
            </button>
          );})}
        </div>
        {formMode && picked.length>0 && (
          <div style={{position:'sticky',bottom:0,marginTop:14,paddingTop:8}}>
            <Btn variant="primary" size="lg" block onClick={()=>{setNewName('');setDoForm(true);}}>
              <Ic.users style={{width:18,height:18}}/> Crea squadra con {picked.length} giocator{picked.length===1?'e':'i'}
            </Btn>
          </div>
        )}
      </div>

      {/* NOI module sheet */}
      <Sheet open={!!openP} onClose={()=>setOpenP(null)}>
        {openP && (
          <div style={{padding:'0 16px 28px'}}>
            <div className="row between" style={{padding:'4px 0 14px'}}>
              <div>
                <div className="h3">{playerName(openP.player,openP.idx)}</div>
                <div className="tiny">{openP.reg.type==='team'?openP.reg.teamName:'Iscritto singolo'} · Taglia {openP.player.taglia||'—'}</div>
              </div>
              <button className="iconbtn" onClick={()=>setOpenP(null)}><Ic.close style={{width:20,height:20}}/></button>
            </div>
            <NoiDoc p={openP.player}/>
            <div className="row g10 noi-actions" style={{marginTop:16}}>
              <Btn variant="ghost" className="grow" onClick={()=>window.print()}>Stampa / PDF</Btn>
              <Btn variant="teal" className="grow" onClick={()=>setOpenP(null)}>Chiudi</Btn>
            </div>
            {openP.reg.type==='team' && (
              <button className="chip chip-red" style={{marginTop:10,width:'100%',justifyContent:'center'}}
                onClick={()=>{ const {reg,player,idx}=openP; setOpenP(null); setDelP({reg,player,idx}); }}>
                <Ic.trash style={{width:13,height:13}}/> Rimuovi giocatore dalla squadra
              </button>
            )}
          </div>
        )}
      </Sheet>

      {/* delete team confirm */}
      <Sheet open={!!delT} onClose={()=>setDelT(null)}>
        {delT && (
          <div style={{padding:'4px 18px 28px',textAlign:'center'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(220,73,55,.1)',display:'grid',placeItems:'center',margin:'6px auto 0'}}><Ic.trash style={{width:28,height:28,color:'var(--red)'}}/></div>
            <div className="h3" style={{marginTop:14}}>Eliminare «{delT.teamName}»?</div>
            <div className="small" style={{marginTop:8,maxWidth:300,marginInline:'auto'}}>La squadra e i suoi {delT.players.length} moduli NOI verranno rimossi. Il posto torna libero per una nuova iscrizione. L'azione non è reversibile.</div>
            <div className="row g10" style={{marginTop:22}}>
              <Btn variant="ghost" className="grow" onClick={()=>setDelT(null)}>Annulla</Btn>
              <Btn variant="primary" className="grow" style={{background:'var(--red)',boxShadow:'none'}} onClick={()=>{window.ETG.Store.deleteRegistrationCloud(window.ETG.staffPin,delT.id);setDelT(null);}}><Ic.trash style={{width:16,height:16}}/> Elimina squadra</Btn>
            </div>
          </div>
        )}
      </Sheet>

      {/* remove single player from a team (e.g. iscritto due volte per errore) */}
      <Sheet open={!!delP} onClose={()=>setDelP(null)}>
        {delP && (
          <div style={{padding:'4px 18px 28px',textAlign:'center'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(220,73,55,.1)',display:'grid',placeItems:'center',margin:'6px auto 0'}}><Ic.trash style={{width:28,height:28,color:'var(--red)'}}/></div>
            <div className="h3" style={{marginTop:14}}>Rimuovere {playerName(delP.player,delP.idx)}?</div>
            <div className="small" style={{marginTop:8,maxWidth:300,marginInline:'auto'}}>Il modulo NOI verrà tolto dalla squadra «{delP.reg.teamName}». Usalo per correggere una doppia iscrizione. L'azione non è reversibile.</div>
            <div className="row g10" style={{marginTop:22}}>
              <Btn variant="ghost" className="grow" onClick={()=>setDelP(null)}>Annulla</Btn>
              <Btn variant="primary" className="grow" style={{background:'var(--red)',boxShadow:'none'}} onClick={()=>{window.ETG.Store.removePlayerCloud(window.ETG.staffPin,delP.reg.id,delP.idx);setDelP(null);}}><Ic.trash style={{width:16,height:16}}/> Rimuovi giocatore</Btn>
            </div>
          </div>
        )}
      </Sheet>

      {/* form team from solos */}
      <Sheet open={doForm} onClose={()=>setDoForm(false)}>
        {doForm && (()=>{ const chosen=picked.map(id=>solos.find(s=>s.id===id)).filter(Boolean);
          const cap=chosen[0]&&chosen[0].players[0];
          return (
          <div style={{padding:'4px 18px 28px'}}>
            <div className="h3" style={{marginBottom:4}}>Nuova squadra dai singoli</div>
            <div className="small" style={{marginBottom:16}}>{chosen.length} giocatori · capitano <b>{cap?playerName(cap,0):'—'}</b></div>
            <Field label="Nome della squadra" req><Text value={newName} onChange={setNewName} placeholder="es. Selezione Oratorio"/></Field>
            <div className="stack g8" style={{margin:'14px 0'}}>
              {chosen.map((r,i)=>(
                <div key={r.id} className="row g10" style={{alignItems:'center'}}>
                  <span style={{width:22,height:22,borderRadius:'50%',background:i===0?'var(--orange)':'var(--ink-3)',color:'#fff',display:'grid',placeItems:'center',fontWeight:800,fontSize:11,flex:'0 0 auto'}}>{i+1}</span>
                  <span style={{flex:1,fontWeight:600,fontSize:14}}>{playerName(r.players[0],0)}</span>
                  {i===0 && <span className="chip chip-orange">capitano</span>}
                </div>
              ))}
            </div>
            <div className="notice" style={{marginBottom:16}}>Verrà generato un codice squadra e i moduli NOI di questi giocatori passeranno alla nuova squadra. Spariranno dall'elenco singoli.</div>
            <div className="row g10">
              <Btn variant="ghost" className="grow" onClick={()=>setDoForm(false)}>Annulla</Btn>
              <Btn variant="primary" className="grow" disabled={!newName.trim()} onClick={()=>{
                window.ETG.Store.formTeamCloud(window.ETG.staffPin,newName.trim(),picked);
                setDoForm(false); setFormMode(false); setPicked([]);
              }}><Ic.check style={{width:16,height:16}}/> Crea squadra</Btn>
            </div>
          </div>
          );})()}
      </Sheet>
    </div>
  );
}

Object.assign(window,{ NoiDoc, NoiDoc2, StaffRegs });
