/* ============ ENJOY THE GAME — iscrizioni + modulo NOI + firma ============ */

function emptyPerson(){
  return { cognome:'',nome:'',sesso:'',nascita:'',luogo:'',cf:'',
    naz:'Italiana',nazEstera:'', indirizzo:'',cap:'',localita:'',prov:'',
    tel:'',email:'',
    firma:null, // firma interessato (adulto)
    tutCognome:'',tutNome:'',tutFirma:null, // genitore/tutore (minori)
    consensoImmagini:true, // liberatoria immagini/video (pagina 2 del modulo)
    taglia:'', // taglia maglia ufficiale del torneo
    ruolo:'',altezza:'' };
}
function ageFrom(d){ if(!d) return null; const b=new Date(d); if(isNaN(b)) return null;
  const t=new Date(); let a=t.getFullYear()-b.getFullYear(); const m=t.getMonth()-b.getMonth();
  if(m<0||(m===0&&t.getDate()<b.getDate())) a--; return a; }
function isMinor(p){ const a=ageFrom(p.nascita); return a!=null && a<18; }

function personValid(p, showExtras){
  const e={};
  ['cognome','nome'].forEach(k=>{ if(!p[k]||!p[k].trim()) e[k]='Obbligatorio'; });
  if(!p.sesso) e.sesso='Seleziona';
  if(!p.nascita) e.nascita='Obbligatorio';
  if(!p.luogo||!p.luogo.trim()) e.luogo='Obbligatorio';
  if(!p.cf||p.cf.replace(/\s/g,'').length!==16) e.cf='16 caratteri';
  if(p.naz==='Estera' && !p.nazEstera.trim()) e.nazEstera='Specifica';
  if(!p.indirizzo||!p.indirizzo.trim()) e.indirizzo='Obbligatorio';
  if(!p.cap||!/^\d{5}$/.test(p.cap)) e.cap='5 cifre';
  if(!p.localita||!p.localita.trim()) e.localita='Obbligatorio';
  if(!p.prov||p.prov.length<2) e.prov='Sigla';
  if(!p.tel||p.tel.replace(/\D/g,'').length<8) e.tel='Telefono';
  if(!p.taglia) e.taglia='Seleziona la taglia';
  if(showExtras && !p.ruolo) e.ruolo='Seleziona';
  if(isMinor(p)){
    if(!p.tutCognome.trim()) e.tutCognome='Obbligatorio';
    if(!p.tutNome.trim()) e.tutNome='Obbligatorio';
    if(!p.tutFirma) e.tutFirma='Firma del tutore obbligatoria';
  } else if(p.nascita){
    if(!p.firma) e.firma='Firma obbligatoria';
  }
  return e;
}

const SAMPLE=[
  {cognome:'Rossi',nome:'Marco',sesso:'M',nascita:'2001-04-12',luogo:'Treviso',cf:'RSSMRC01D12L407K',indirizzo:'Via Roma 14',cap:'31038',localita:'Paese',prov:'TV',tel:'347 1234567',email:'marco.rossi@email.it',taglia:'L',ruolo:'Guardia',altezza:'182'},
  {cognome:'Bianchi',nome:'Luca',sesso:'M',nascita:'2010-09-03',luogo:'Treviso',cf:'BNCLCU10P03L407A',indirizzo:'Via Verdi 8',cap:'31038',localita:'Paese',prov:'TV',tel:'348 9988776',email:'',taglia:'M',ruolo:'Ala',altezza:'170',tutCognome:'Bianchi',tutNome:'Andrea'},
];

/* ---------------- the NOI form (one person) ---------------- */
function NoiForm({person,onChange,errors={},showExtras,sampleIdx=0}){
  const p=person; const set=(k,v)=>onChange({...p,[k]:v}); const minor=isMinor(p); const age=ageFrom(p.nascita);
  const fillSample=()=>{ onChange({...emptyPerson(),...SAMPLE[sampleIdx%SAMPLE.length]}); };
  return (
    <div className="stack g16">
      <div className="row between">
        <div className="eyebrow">Dati del socio · Modulo NOI</div>
        <button type="button" onClick={fillSample} className="btn btn-ghost btn-sm" style={{padding:'5px 10px'}}>⚡ Esempio</button>
      </div>

      <div className="grid2">
        <Field label="Cognome" req error={errors.cognome}><Text value={p.cognome} onChange={v=>set('cognome',v)} error={errors.cognome} placeholder="Rossi"/></Field>
        <Field label="Nome" req error={errors.nome}><Text value={p.nome} onChange={v=>set('nome',v)} error={errors.nome} placeholder="Marco"/></Field>
      </div>

      <Field label="Sesso" req error={errors.sesso}>
        <Seg value={p.sesso} onChange={v=>set('sesso',v)} options={[{v:'M',l:'Maschio'},{v:'F',l:'Femmina'}]}/>
      </Field>

      <div className="grid2">
        <Field label="Data di nascita" req error={errors.nascita}>
          <input className={'control'+(errors.nascita?' err':'')} type="date" value={p.nascita} onChange={e=>set('nascita',e.target.value)} max="2025-12-31"/>
        </Field>
        <Field label="Luogo di nascita" req error={errors.luogo}><Text value={p.luogo} onChange={v=>set('luogo',v)} error={errors.luogo} placeholder="Treviso"/></Field>
      </div>
      {age!=null && <div className={'chip '+(minor?'chip-red':'chip-teal')} style={{alignSelf:'flex-start',marginTop:-6}}>{minor?`Minorenne · ${age} anni · serve firma del tutore`:`Maggiorenne · ${age} anni`}</div>}

      <Field label="Codice fiscale" req error={errors.cf} hint="16 caratteri">
        <CFInput value={p.cf} onChange={v=>set('cf',v)} error={errors.cf}/>
      </Field>

      <Field label="Nazionalità" req>
        <Seg value={p.naz} onChange={v=>set('naz',v)} options={[{v:'Italiana',l:'Italiana'},{v:'Estera',l:'Estera'}]}/>
      </Field>
      {p.naz==='Estera' && <Field label="Specificare nazionalità" req error={errors.nazEstera}><Text value={p.nazEstera} onChange={v=>set('nazEstera',v)} error={errors.nazEstera}/></Field>}

      <Field label="Indirizzo" req error={errors.indirizzo}><Text value={p.indirizzo} onChange={v=>set('indirizzo',v)} error={errors.indirizzo} placeholder="Via Roma 14"/></Field>
      <div className="grid3">
        <Field label="CAP" req error={errors.cap}><Text value={p.cap} onChange={v=>set('cap',v.replace(/\D/g,'').slice(0,5))} error={errors.cap} inputMode="numeric" placeholder="31038"/></Field>
        <Field label="Località" req error={errors.localita}><Text value={p.localita} onChange={v=>set('localita',v)} error={errors.localita} placeholder="Paese"/></Field>
        <Field label="Prov." req error={errors.prov}><Text value={p.prov} onChange={v=>set('prov',v.toUpperCase().slice(0,2))} error={errors.prov} placeholder="TV"/></Field>
      </div>

      <div className="grid2">
        <Field label="Telefono" req error={errors.tel}><Text value={p.tel} onChange={v=>set('tel',v)} error={errors.tel} inputMode="tel" placeholder="347 1234567"/></Field>
        <Field label="E-mail" hint="opzionale"><Text value={p.email} onChange={v=>set('email',v)} inputMode="email" placeholder="@"/></Field>
      </div>

      <Field label="Taglia della maglia" req error={errors.taglia} hint="Per la maglia ufficiale del torneo">
        <Seg value={p.taglia} onChange={v=>set('taglia',v)} options={['S','M','L','XL','XXL']}/>
      </Field>

      {showExtras && <>
        <div className="hr-soft"></div>
        <div className="eyebrow">Per formare la squadra</div>
        <div className="grid2">
          <Field label="Ruolo preferito" req error={errors.ruolo}>
            <Select value={p.ruolo} onChange={v=>set('ruolo',v)} placeholder="Scegli" error={errors.ruolo} options={['Playmaker','Guardia','Ala','Ala grande','Centro','Indifferente']}/>
          </Field>
          <Field label="Altezza (cm)"><Text value={p.altezza} onChange={v=>set('altezza',v.replace(/\D/g,'').slice(0,3))} inputMode="numeric" placeholder="182"/></Field>
        </div>
      </>}

      {/* firma */}
      <div className="hr-soft"></div>
      {!p.nascita ? (
        <div className="notice">Inserisci la data di nascita per attivare la firma corretta.</div>
      ) : minor ? (
        <div className="stack g14">
          <div className="notice" style={{background:'rgba(220,73,55,.08)',color:'#9c3325'}}>
            <b>Iscritto minorenne.</b> Per il tesseramento è obbligatoria la firma di chi esercita la responsabilità genitoriale (genitore o tutore).
          </div>
          <div className="grid2">
            <Field label="Cognome tutore" req error={errors.tutCognome}><Text value={p.tutCognome} onChange={v=>set('tutCognome',v)} error={errors.tutCognome}/></Field>
            <Field label="Nome tutore" req error={errors.tutNome}><Text value={p.tutNome} onChange={v=>set('tutNome',v)} error={errors.tutNome}/></Field>
          </div>
          <Field label="Firma del genitore / tutore" req error={errors.tutFirma}
            hint="Con la firma si accetta l'informativa al trattamento dei dati (Reg. UE 679/16).">
            <SignaturePad value={p.tutFirma} onChange={v=>set('tutFirma',v)}/>
          </Field>
        </div>
      ) : (
        <Field label="Firma dell'interessato" req error={errors.firma}
          hint="Con la firma si conferma di aver ricevuto e accettato l'informativa al trattamento dei dati (Reg. UE 679/16).">
          <SignaturePad value={p.firma} onChange={v=>set('firma',v)}/>
        </Field>
      )}

      {/* liberatoria immagini — pagina 2 del modulo */}
      <button type="button" className="consent" aria-pressed={!!p.consensoImmagini}
        onClick={()=>set('consensoImmagini',!p.consensoImmagini)}>
        <span className={'consent-box'+(p.consensoImmagini?' on':'')}>{p.consensoImmagini && <Ic.check style={{width:14,height:14}}/>}</span>
        <span className="consent-txt">
          <b>Autorizzo foto e video.</b> {minor?'Come genitore/tutore acconsento':'Acconsento'} alla pubblicazione gratuita di immagini e video {minor?'del minore ':''}per le sole finalità informative e promozionali del Circolo (sito, social, materiale del torneo), come da liberatoria allegata al modulo.
          <span className="tiny" style={{display:'block',marginTop:4,opacity:.7}}>Facoltativo: puoi iscriverti anche senza dare il consenso.</span>
        </span>
      </button>
    </div>
  );
}

/* ---------------- quota d'iscrizione (solo informativa) ---------------- */
function FeeNotice(){
  return (
    <div className="feebox">
      <div className="feebox-head">
        <span className="feebox-amt">22€</span>
        <span className="feebox-sub">quota a giocatore</span>
      </div>
      <p className="feebox-text">Ti invieremo il <b>link PayPal</b> per il pagamento al recapito che hai indicato nel modulo.</p>
      <p className="feebox-warn">Sarai considerato iscritto al torneo <b>solo dopo aver effettuato il pagamento e le firme.</b></p>
    </div>
  );
}

/* ---------------- success ---------------- */
function RegDone({title,sub,go,fee}){
  return (
    <div className="screen section fadein" style={{paddingTop:46}}>
      <div style={{textAlign:'center'}}>
        <div className="dmark" style={{width:78,height:78,margin:'0 auto'}}></div>
        <h1 className="h1" style={{marginTop:20}}>{title}</h1>
        <p className="lead" style={{marginTop:10,maxWidth:340,marginInline:'auto'}}>{sub}</p>
      </div>
      {fee && <FeeNotice/>}
      <div className="stack g10" style={{marginTop:24}}>
        <Btn variant="primary" size="lg" block onClick={()=>go('home')}>Torna alla home</Btn>
        <Btn variant="ghost" block onClick={()=>go('live')}><Ic.bracket style={{width:18,height:18}}/> Segui il torneo</Btn>
      </div>
    </div>
  );
}

/* ---------------- Iscrizione SINGOLO ---------------- */
function RegSolo({go}){
  const [p,setP]=useState(emptyPerson()); const [err,setErr]=useState({}); const [done,setDone]=useState(false);
  const submit=()=>{ const e=personValid(p,true); setErr(e);
    if(Object.keys(e).length){ window.scrollTo({top:0}); return; }
    window.ETG.Store.addRegistration({ id:'r'+Date.now(), type:'solo', createdAt:new Date().toISOString(), captain:null, teamName:null, players:[p] });
    setDone(true); };
  if(done) return <RegDone go={go} fee
    title="Iscrizione inviata!"
    sub="Dati e firma ricevuti. Ti inseriremo in una squadra e te lo comunicheremo prima del torneo."/>;
  return (
    <div className="fadein">
      <FormHeader go={go} title="Iscriviti da solo" sub="La squadra la formiamo noi" tag="Giocatore singolo"/>
      <div className="screen" style={{paddingBottom:30}}>
        <div className="notice" style={{marginBottom:18}}>Compila i tuoi dati e firma. Useremo ruolo e altezza per inserirti in una squadra equilibrata.</div>
        <NoiForm person={p} onChange={setP} errors={err} showExtras/>
        <div style={{height:18}}></div>
        <Btn variant="primary" size="lg" block onClick={submit}>Invia iscrizione <Ic.fwd style={{width:18,height:18}}/></Btn>
      </div>
    </div>
  );
}

function FormHeader({go,title,sub,tag}){
  return (
    <div style={{background:'#fff',borderBottom:'1px solid var(--line)'}}>
      <div className="screen" style={{paddingTop:16,paddingBottom:18}}>
        <button onClick={()=>go('home')} className="iconbtn" style={{marginBottom:14}}><Ic.back style={{width:20,height:20}}/></button>
        {tag && <div className="chip chip-orange" style={{marginBottom:10}}>{tag}</div>}
        <h1 className="h1">{title}</h1>
        {sub && <p className="small" style={{marginTop:6}}>{sub}</p>}
      </div>
    </div>
  );
}

/* ---------------- access code card (shown to captain after creating the team) ---------------- */
function CodeBig({code}){
  const [copied,setCopied]=useState(false);
  const copy=()=>{ try{ navigator.clipboard.writeText(code); }catch(e){} setCopied(true); setTimeout(()=>setCopied(false),1600); };
  return (
    <div className="codecard">
      <div className="eyebrow" style={{color:'rgba(255,255,255,.65)'}}>Codice squadra</div>
      <div className="codebig">{code}</div>
      <button className="btn btn-soft btn-sm" onClick={copy} style={{marginTop:4}}>
        {copied? <>✓ Copiato</> : <><Ic.copy style={{width:15,height:15}}/> Copia il codice</>}
      </button>
    </div>
  );
}

/* ---------------- share/recover the access code (so the captain never loses it) ---------------- */
function shareMsg(reg){
  return `🏀 ENJOY THE GAME — sei nella squadra «${reg.teamName}»!\n\nCodice per aggiungerti alla rosa: ${reg.code}\n\nApri l'app del torneo → «Unisciti con un codice» → inserisci ${reg.code} e compila il tuo modulo.`;
}
function ShareCode({reg}){
  const wa=()=>{ window.open('https://wa.me/?text='+encodeURIComponent(shareMsg(reg)),'_blank'); };
  const mail=()=>{
    const subj=`Codice squadra «${reg.teamName}» — ENJOY THE GAME`;
    window.location.href='mailto:?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(shareMsg(reg));
  };
  return (
    <div className="stack g8" style={{marginTop:12}}>
      <div className="tiny" style={{opacity:.7}}>Mettilo al sicuro: invialo a te stesso o al gruppo squadra.</div>
      <div className="row g8">
        <Btn variant="primary" className="grow" onClick={wa}><Ic.chat style={{width:17,height:17}}/> Invia su WhatsApp</Btn>
        <Btn variant="ghost" onClick={mail}><Ic.mail style={{width:17,height:17}}/> E-mail</Btn>
      </div>
    </div>
  );
}

/* ---------------- iscrizioni chiuse (16 squadre) ---------------- */
function RegClosed({go,title='Iscrizioni chiuse'}){
  return (
    <div className="fadein">
      <FormHeader go={go} title={title} tag="Tabellone al completo"/>
      <div className="screen section" style={{textAlign:'center',paddingTop:30}}>
        <div style={{width:78,height:78,borderRadius:'50%',background:'rgba(220,73,55,.1)',display:'grid',placeItems:'center',margin:'0 auto'}}>
          <Ic.lock style={{width:34,height:34,color:'var(--red)'}}/>
        </div>
        <h1 className="h1" style={{marginTop:22}}>16 squadre raggiunte</h1>
        <p className="lead" style={{marginTop:10,maxWidth:330,marginInline:'auto'}}>La formula del torneo prevede <b>16 squadre</b> e i posti sono esauriti. Non è più possibile iscrivere nuove squadre.</p>
        <div className="notice" style={{marginTop:22,textAlign:'left'}}>
          Sei già in una squadra iscritta? Puoi sempre <b>unirti con il codice</b> che ti ha dato il capitano.
        </div>
        <div className="stack g10" style={{marginTop:22}}>
          <Btn variant="primary" size="lg" block onClick={()=>go('join')}><Ic.key style={{width:18,height:18}}/> Unisciti con un codice</Btn>
          <Btn variant="ghost" block onClick={()=>go('home')}>Torna alla home</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Iscrizione SQUADRA — il capitano crea la squadra ---------------- */
function RegTeam({go}){
  const store=useStore();
  const [cloudFull,setCloudFull]=useState(false);
  useEffect(()=>{ window.ETG.Store.teamCountAsync().then(n=>setCloudFull(n>=window.ETG.MAX_TEAMS)).catch(()=>{}); },[]);
  const full = cloudFull || store.state.registrations.filter(r=>r.type==='team').length >= window.ETG.MAX_TEAMS;
  const [step,setStep]=useState(0); // 0 = dati squadra, 1 = modulo capitano
  const [squad,setSquad]=useState({nome:'',capCognome:'',capNome:'',capTel:'',capEmail:'',count:3});
  const [cap,setCap]=useState(emptyPerson());
  const [serr,setSErr]=useState({}); const [err,setErr]=useState({});
  const [created,setCreated]=useState(null); // the created registration

  if(full && !created) return <RegClosed go={go}/>;

  const validSquad=()=>{ const e={};
    if(!squad.nome.trim()) e.nome='Nome squadra obbligatorio';
    if(!squad.capCognome.trim()) e.capCognome='Obbligatorio';
    if(!squad.capNome.trim()) e.capNome='Obbligatorio';
    if(!squad.capTel.replace(/\D/g,'')||squad.capTel.replace(/\D/g,'').length<8) e.capTel='Telefono valido';
    setSErr(e); return Object.keys(e).length===0;
  };
  const next=()=>{
    if(!validSquad()) return;
    // prefill the captain's NOI form so the name isn't typed twice
    setCap(c=>({...c, cognome:c.cognome||squad.capCognome, nome:c.nome||squad.capNome,
      tel:c.tel||squad.capTel, email:c.email||squad.capEmail}));
    setStep(1); window.scrollTo({top:0});
  };
  const submit=()=>{
    const e=personValid(cap,false); setErr(e);
    if(Object.keys(e).length){ window.scrollTo({top:0}); return; }
    const capName=((squad.capNome||cap.nome)+' '+(squad.capCognome||cap.cognome)).trim();
    const reg=store.state && window.ETG.Store.createTeam({
      teamName:squad.nome,
      captain:{nome:capName,tel:squad.capTel||cap.tel,email:squad.capEmail||cap.email},
      rosterSize:squad.count,
      captainPlayer:cap,
    });
    if(reg){ setCreated(reg); }
  };
  const prev=()=>{ if(step===0){ go('home'); return; } setStep(0); window.scrollTo({top:0}); };

  /* ----- success: show the access code ----- */
  if(created){
    const left=(created.rosterSize||squad.count)-created.players.length;
    return (
      <div className="fadein">
        <FormHeader go={go} title="Squadra creata!" tag="Iscrizione capitano"/>
        <div className="screen section">
          <p className="lead" style={{marginTop:-4}}>«{created.teamName}» è iscritta. Condividi questo codice con i tuoi compagni: <b>ognuno si aggiunge e compila il proprio modulo NOI dal suo telefono.</b></p>
          <div style={{marginTop:18}}><CodeBig code={created.code}/></div>
          <div className="warn-save">
            <Ic.alert style={{width:26,height:26,flex:'0 0 auto'}}/>
            <div>
              <div className="warn-save-t">Salva subito questo codice!</div>
              <div className="warn-save-s">Senza il codice <b>{created.code}</b> i tuoi compagni non possono iscriversi alla squadra. Scrivilo o fai uno screenshot prima di chiudere.</div>
            </div>
          </div>
          <div className="card card-pad" style={{marginTop:14,display:'flex',alignItems:'center',gap:12}}>
            <span style={{width:42,height:42,borderRadius:12,background:'var(--sand-soft)',display:'grid',placeItems:'center',flex:'0 0 auto'}}><Ic.users style={{width:20,height:20,color:'var(--teal)'}}/></span>
            <div style={{flex:1}}>
              <div style={{fontWeight:800}}>{created.players.length} / {created.rosterSize} giocatori</div>
              <div className="tiny">{left>0?`Mancano ancora ${left} moduli (incluso chi vuoi aggiungere).`:'Rosa al completo.'}</div>
            </div>
          </div>
          <div className="notice" style={{marginTop:14,textAlign:'left'}}>
            <b>Come funziona:</b> gira il codice ai tuoi compagni (es. nel gruppo WhatsApp della squadra). Chi lo riceve apre l'app, tocca <b>«Unisciti con un codice»</b> e carica i suoi dati. Tu sei già il <b>Giocatore 1</b>.
          </div>

          <div className="hr-soft"></div>
          <div className="eyebrow">Quota d'iscrizione</div>
          <FeeNotice/>

          <div className="stack g10" style={{marginTop:22,paddingBottom:30}}>
            <Btn variant="primary" size="lg" block onClick={()=>go('join',{presetReg:created})}><Ic.userplus style={{width:18,height:18}}/> Aggiungi un compagno ora</Btn>
            <Btn variant="ghost" block onClick={()=>go('home')}>Ho finito · torna alla home</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fadein">
      <FormHeader go={go} title="Iscrivi la squadra" tag={step===0?'Dati squadra':'Il tuo modulo · capitano'}
        sub={squad.nome?`«${squad.nome}»`:'Sei il capitano'}/>
      <div className="screen" style={{paddingTop:14}}>
        <div className="steps" style={{marginBottom:20}}>
          {[0,1].map(i=>(<div key={i} className={'seg-line '+(i<step?'done':i===step?'cur':'')}></div>))}
        </div>

        {step===0 && (
          <div className="stack g16 fadein">
            <div className="notice" style={{marginBottom:2}}>
              Tu (capitano) crei la squadra e compili <b>solo i tuoi dati</b>. Riceverai un <b>codice</b> da girare ai compagni: ognuno si aggiunge per conto suo.
            </div>
            <Field label="Nome della squadra" req error={serr.nome}><Text value={squad.nome} onChange={v=>setSquad(s=>({...s,nome:v}))} error={serr.nome} placeholder="es. Paese Ballers"/></Field>
            <Field label="Numero di giocatori della rosa">
              <Seg value={squad.count} onChange={n=>setSquad(s=>({...s,count:n}))} options={[{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'}]}/>
              <span className="hint">3 in campo + fino a 2 riserve. Definisce quanti possono aggiungersi col codice.</span>
            </Field>
            <div className="hr-soft"></div>
            <div className="eyebrow">Il capitano · referente della squadra</div>
            <div className="grid2">
              <Field label="Cognome capitano" req error={serr.capCognome}><Text value={squad.capCognome} onChange={v=>setSquad(s=>({...s,capCognome:v}))} error={serr.capCognome} placeholder="Rossi"/></Field>
              <Field label="Nome capitano" req error={serr.capNome}><Text value={squad.capNome} onChange={v=>setSquad(s=>({...s,capNome:v}))} error={serr.capNome} placeholder="Marco"/></Field>
            </div>
            <div className="grid2">
              <Field label="Telefono" req error={serr.capTel}><Text value={squad.capTel} onChange={v=>setSquad(s=>({...s,capTel:v}))} error={serr.capTel} inputMode="tel" placeholder="347 1234567"/></Field>
              <Field label="E-mail" hint="Opzionale"><Text value={squad.capEmail} onChange={v=>setSquad(s=>({...s,capEmail:v}))} inputMode="email" placeholder="@"/></Field>
            </div>
          </div>
        )}

        {step===1 && (
          <div className="fadein">
            <div className="notice" style={{marginBottom:16}}>Compila il <b>tuo</b> modulo NOI come capitano. Gli altri giocatori lo faranno dal proprio telefono con il codice.</div>
            <NoiForm person={cap} onChange={setCap} errors={err} sampleIdx={0}/>
          </div>
        )}

        <div className="row g10" style={{marginTop:22,paddingBottom:30}}>
          <Btn variant="ghost" onClick={prev}><Ic.back style={{width:18,height:18}}/> {step===0?'Esci':'Indietro'}</Btn>
          {step===0
            ? <Btn variant="primary" className="grow" onClick={next}>Compila il tuo modulo <Ic.fwd style={{width:18,height:18}}/></Btn>
            : <Btn variant="primary" className="grow" onClick={submit}><Ic.check style={{width:18,height:18}}/> Crea la squadra & genera codice</Btn>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Unisciti a una squadra con il codice ---------------- */
function RegJoin({go, preset}){
  const store=useStore();
  const pr = preset && preset.presetReg; // capitano arriva qui con la squadra già nota → salta il codice
  const presetReg0 = pr ? { id:pr.id, teamName:pr.teamName, rosterSize:pr.rosterSize,
    captainName:pr.captain&&pr.captain.nome, playersCount:(pr.players||[]).length, code:pr.code } : null;
  const [step,setStep]=useState(pr?1:0); // 0 = codice, 1 = modulo
  const [code,setCode]=useState(pr?pr.code:''); const [codeErr,setCodeErr]=useState('');
  const [reg,setReg]=useState(presetReg0);
  const [p,setP]=useState(emptyPerson()); const [err,setErr]=useState({});
  const [joined,setJoined]=useState(null);
  const [busy,setBusy]=useState(false);

  const checkCode=async ()=>{
    if(busy) return; setBusy(true);
    try{
      const r=await window.ETG.Store.findTeamByCodeAsync(code);
      if(!r){ setCodeErr('Codice non valido. Controlla con il capitano.'); return; }
      if(r.playersCount>=(r.rosterSize||99)){ setCodeErr(`La squadra «${r.teamName}» ha già la rosa al completo (${r.rosterSize}/${r.rosterSize}).`); return; }
      setCodeErr(''); setReg(r); setStep(1); window.scrollTo({top:0});
    } finally { setBusy(false); }
  };
  const submit=async ()=>{
    const e=personValid(p,false); setErr(e);
    if(Object.keys(e).length){ window.scrollTo({top:0}); return; }
    if(busy) return; setBusy(true);
    try{
      const res=await window.ETG.Store.joinTeamAsync(code,p);
      if(!res.ok){ setCodeErr(res.reason==='full'?'La rosa si è appena riempita.':'Errore di collegamento. Riprova.'); setStep(0); return; }
      setReg(rg=>rg?{...rg,playersCount:res.playersCount}:rg);
      setJoined({teamName:res.teamName, rosterSize:res.rosterSize, playersCount:res.playersCount,
        name:((p.nome||'')+' '+(p.cognome||'')).trim()});
    } finally { setBusy(false); }
  };
  const addAnother=()=>{ setJoined(null); setP(emptyPerson()); setErr({}); setStep(1); window.scrollTo({top:0}); };

  if(joined){
    return (
      <div className="fadein">
        <FormHeader go={go} title="Sei dentro!" tag="Modulo inviato"/>
        <div className="screen section" style={{paddingTop:30}}>
          <div style={{textAlign:'center'}}>
            <div style={{width:78,height:78,borderRadius:'50%',background:'rgba(30,138,91,.12)',display:'grid',placeItems:'center',margin:'0 auto'}}>
              <Ic.check style={{width:38,height:38,color:'var(--ok,#1E8A5B)'}}/>
            </div>
            <h1 className="h1" style={{marginTop:18}}>Aggiunto a «{joined.teamName}»</h1>
            <p className="lead" style={{marginTop:10,maxWidth:330,marginInline:'auto'}}>Modulo NOI firmato ricevuto. Ora siete <b>{joined.playersCount}/{joined.rosterSize}</b> nella rosa.</p>
          </div>
          <FeeNotice/>
          <div className="stack g10" style={{marginTop:24,paddingBottom:30}}>
            {joined.playersCount<joined.rosterSize && <Btn variant="teal" size="lg" block onClick={addAnother}><Ic.userplus style={{width:18,height:18}}/> Aggiungi un altro compagno</Btn>}
            <Btn variant="ghost" block onClick={()=>go('home')}>Torna alla home</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fadein">
      <FormHeader go={go} title="Unisciti alla squadra" tag={step===0?'Codice di accesso':reg?`«${reg.teamName}»`:'Il tuo modulo'}
        sub={step===0?'Inserisci il codice del capitano':'Compila i tuoi dati e firma'}/>
      <div className="screen" style={{paddingTop:16}}>
        {step===0 && (
          <div className="stack g16 fadein">
            <div className="notice">Il <b>capitano</b> ti ha mandato un codice quando ha iscritto la squadra. Inseriscilo qui per aggiungere i tuoi dati alla rosa.</div>
            <Field label="Codice squadra" req error={codeErr} hint="6 caratteri, es. BLZ7P2">
              <input className={'control code-input'+(codeErr?' err':'')} value={code}
                onChange={e=>{ setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6)); setCodeErr(''); }}
                placeholder="••••••" inputMode="text" autoCapitalize="characters" maxLength={6}/>
            </Field>
            <Btn variant="primary" size="lg" block onClick={checkCode} disabled={code.length<6||busy}>{busy?'Cerco…':<>Trova la squadra <Ic.fwd style={{width:18,height:18}}/></>}</Btn>
          </div>
        )}

        {step===1 && reg && (
          <div className="fadein">
            <div className="card card-pad" style={{marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
              <Avatar name={reg.teamName} color="var(--orange)"/>
              <div style={{flex:1}}>
                <div style={{fontWeight:800}}>{reg.teamName}</div>
                <div className="tiny">Capitano {reg.captainName} · {reg.playersCount}/{reg.rosterSize} in rosa</div>
              </div>
              <span className="chip chip-teal">{code}</span>
            </div>
            <NoiForm person={p} onChange={setP} errors={err} sampleIdx={1}/>
            <div className="row g10" style={{marginTop:22,paddingBottom:30}}>
              <Btn variant="ghost" onClick={()=>{ if(pr){ go('home'); } else { setStep(0); window.scrollTo({top:0}); } }}><Ic.back style={{width:18,height:18}}/> Indietro</Btn>
              <Btn variant="primary" className="grow" onClick={submit} disabled={busy}><Ic.check style={{width:18,height:18}}/> {busy?'Invio…':'Aggiungimi alla squadra'}</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window,{ NoiForm, emptyPerson, personValid, isMinor, ageFrom, RegSolo, RegTeam, RegJoin, RegClosed, FormHeader, ShareCode, FeeNotice });
