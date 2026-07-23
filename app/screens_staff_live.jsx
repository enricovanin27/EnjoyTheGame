/* ============ ENJOY THE GAME — staff: gestione live & risultati ============ */

function advanceBracket(s,m){
  const winner = (m.scoreA>=m.scoreB)?m.aId:m.bId;
  if(m.phase==='quarti'){
    const semi=s.matches.find(x=>x.phase==='semi'&&x.slot===Math.floor(m.slot/2));
    if(semi){ if(m.slot%2===0) semi.aId=winner; else semi.bId=winner; }
  } else if(m.phase==='semi'){
    const fin=s.matches.find(x=>x.phase==='finale');
    if(fin){ if(m.slot===0) fin.aId=winner; else fin.bId=winner; }
  }
}

/* ---- live scoreboard editor ---- */
function StaffLive(){
  const store=useStore(); const s=store.state;
  const lm=s.matches.find(m=>m.status==='live'); const live=s.live;

  const bump=(side,delta)=>store.update(st=>{ const m=st.matches.find(x=>x.status==='live'); if(!m)return;
    const k=side==='a'?'scoreA':'scoreB'; m[k]=Math.max(0,(m[k]||0)+delta); });
  const toTimeout=(side)=>store.update(st=>{ if(!st.live)return; st.live[side==='a'?'timeoutA':'timeoutB']=!st.live[side==='a'?'timeoutA':'timeoutB']; });
  const end=()=>store.update(st=>{ const m=st.matches.find(x=>x.status==='live'); if(!m)return; m.status='done'; advanceBracket(st,m); st.live=null; });

  if(!lm){
    const startable=s.matches.filter(m=>m.status==='sched'&&m.aId&&m.bId);
    return (
      <div className="stack g16">
        <div className="card card-pad" style={{textAlign:'center'}}>
          <Ic.whistle style={{width:30,height:30,color:'var(--ink-3)',margin:'0 auto'}}/>
          <div className="h3" style={{marginTop:10}}>Nessuna partita in corso</div>
          <div className="small" style={{marginTop:4}}>Avvia il prossimo incontro per gestirlo dal vivo.</div>
        </div>
        <div className="eyebrow">Avvia una partita</div>
        <div className="stack g8">
          {startable.slice(0,6).map(m=>(
            <div key={m.id} className="card" style={{padding:'11px 13px',display:'flex',alignItems:'center',gap:10}}>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{window.ETG.teamName(m.aId)} <span style={{color:'var(--ink-3)'}}>vs</span> {window.ETG.teamName(m.bId)}</div><div className="tiny">{PhaseLabel(m.phase)}{m.group?' '+m.group:''} · {m.time} · {m.court}</div></div>
              <Btn variant="primary" size="sm" onClick={()=>store.update(st=>{const x=st.matches.find(y=>y.id===m.id);x.status='live';x.scoreA=0;x.scoreB=0;st.live={matchId:x.id,target:x.target||21,timeoutA:false,timeoutB:false,period:x.phase==='quarti'||x.phase==='semi'||x.phase==='finale'?'TEMPO UNICO 15:00':'TEMPO UNICO 10:00'};})}>Avvia</Btn>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const TeamCtrl=({side})=>{
    const id=side==='a'?lm.aId:lm.bId; const score=side==='a'?(lm.scoreA||0):(lm.scoreB||0);
    const to=side==='a'?live?.timeoutA:live?.timeoutB;
    return (
      <div style={{flex:1,minWidth:0,textAlign:'center'}}>
        <div className="row g6" style={{justifyContent:'center',marginBottom:8}}><span style={{width:9,height:9,borderRadius:2,background:teamColor(id)}}></span><span style={{fontWeight:800,fontSize:14,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{window.ETG.teamName(id)}</span></div>
        <div className="display" style={{fontSize:60,lineHeight:.9,color: score>=21?'var(--orange)':'var(--ink)'}}>{score}</div>
        <div className="row g6" style={{justifyContent:'center',marginTop:12}}>
          {[1,2,3].map(d=><button key={d} className="btn btn-dark btn-sm" style={{minWidth:40,padding:'10px 0'}} onClick={()=>bump(side,d)}>+{d}</button>)}
        </div>
        <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>bump(side,-1)}>− 1</button>
        <div style={{marginTop:10}}>
          <button className={'btn btn-sm '+(to?'btn-teal':'btn-ghost')} onClick={()=>toTimeout(side)}>{to?'Time-out ✓':'Time-out'}</button>
        </div>
      </div>
    );
  };

  return (
    <div className="stack g16">
      <div className="card" style={{padding:'14px 16px',border:'1.5px solid var(--red)'}}>
        <div className="row between" style={{marginBottom:6}}>
          <span className="chip chip-live"><span className="dot pulse"></span> IN DIRETTA</span>
          <span className="tiny mono">{PhaseLabel(lm.phase)}{lm.group?' '+lm.group:''} · arrivo a {lm.target||21}</span>
        </div>
        <div className="row" style={{alignItems:'flex-start',gap:8,marginTop:10}}>
          <TeamCtrl side="a"/>
          <div style={{alignSelf:'center',color:'var(--ink-3)',fontWeight:800,fontFamily:'var(--display)'}}>:</div>
          <TeamCtrl side="b"/>
        </div>
      </div>
      <div className="notice">Il cronometro si ferma solo durante i time-out (uno per squadra). Vince chi arriva a 21 o è in vantaggio allo scadere.</div>
      <Btn variant="primary" size="lg" block onClick={end}><Ic.check style={{width:18,height:18}}/> Termina partita & registra risultato</Btn>
      <div className="tiny" style={{textAlign:'center'}}>Risultato e tabellone si aggiornano per tutti in tempo reale.</div>
    </div>
  );
}

/* ---- results editor (set/correct any match) ---- */
function StaffResults(){
  const store=useStore(); const s=store.state;
  const [edit,setEdit]=useState(null); const [a,setA]=useState(0),[b,setB]=useState(0);
  const open=(m)=>{ setEdit(m); setA(m.scoreA||0); setB(m.scoreB||0); };
  const saveScore=()=>store.update(st=>{ const m=st.matches.find(x=>x.id===edit.id); m.scoreA=a; m.scoreB=b; m.status='done'; if(m.phase!=='group1'&&m.phase!=='group2') advanceBracket(st,m); setEdit(null); });
  const sched=window.ETG.helpers.schedule();
  const groups={'SAB 25 LUG':[],'DOM 26 LUG':[]};
  sched.forEach(m=>{ if(groups[m.day]) groups[m.day].push(m); });

  return (
    <div className="stack g20">
      <div className="notice">Tocca una partita per inserire o correggere il punteggio. I quarti/semifinali avanzano i vincitori nel tabellone in automatico.</div>
      {Object.keys(groups).map(day=> groups[day].length?(
        <div key={day}>
          <div className="row g8" style={{marginBottom:12}}><span className="chip chip-orange">{day}</span></div>
          <div className="stack g8">
            {groups[day].map(m=>(
              <button key={m.id} onClick={()=>open(m)} style={{all:'unset',cursor:'pointer'}}>
                <div className="card" style={{padding:'10px 13px',display:'flex',alignItems:'center',gap:10,borderColor:m.status==='live'?'var(--red)':'var(--line)'}}>
                  <div style={{width:46,flex:'0 0 auto'}}>
                    {m.status==='live'?<span className="chip chip-live" style={{padding:'2px 6px'}}><span className="dot pulse"></span></span>:<div className="mono tiny" style={{fontWeight:700}}>{m.time}</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{window.ETG.teamName(m.aId)} <span style={{color:'var(--ink-3)'}}>vs</span> {window.ETG.teamName(m.bId)}</div>
                    <div className="tiny">{PhaseLabel(m.phase)}{m.group?' '+m.group:''}</div>
                  </div>
                  <div className="tnum" style={{fontWeight:800,fontSize:15,color:m.status==='done'?'var(--ink)':'var(--ink-3)'}}>{m.scoreA==null?'–':m.scoreA}:{m.scoreB==null?'–':m.scoreB}</div>
                  <Ic.pen style={{width:15,height:15,color:'var(--ink-3)'}}/>
                </div>
              </button>
            ))}
          </div>
        </div>
      ):null)}

      <Sheet open={!!edit} onClose={()=>setEdit(null)}>
        {edit && (
          <div style={{padding:'4px 18px 28px'}}>
            <div className="h3" style={{marginBottom:4}}>{PhaseLabel(edit.phase)}{edit.group?' '+edit.group:''}</div>
            <div className="tiny" style={{marginBottom:18}}>{edit.day} · {edit.time} · {edit.court}</div>
            <div className="row" style={{gap:10,alignItems:'flex-start'}}>
              {[['a',edit.aId,a,setA],['b',edit.bId,b,setB]].map(([k,id,val,setVal])=>(
                <div key={k} style={{flex:1,textAlign:'center'}}>
                  <div style={{fontWeight:800,fontSize:14,marginBottom:10,minHeight:34}}>{window.ETG.teamName(id)}</div>
                  <div className="display" style={{fontSize:48}}>{val}</div>
                  <div className="row g6" style={{justifyContent:'center',marginTop:10}}>
                    <button className="btn btn-ghost btn-sm" style={{width:42}} onClick={()=>setVal(Math.max(0,val-1))}>−</button>
                    <button className="btn btn-dark btn-sm" style={{width:42}} onClick={()=>setVal(val+1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <Btn variant="primary" size="lg" block style={{marginTop:22}} onClick={saveScore}>Salva risultato</Btn>
          </div>
        )}
      </Sheet>
    </div>
  );
}

/* ---- staff: sorteggio gironi + classifiche ---- */
const TEST_TEAMS = ['Bombers','Splash Bros','Oratorio Crew','Net Surfers','Gli Imbattuti','Triple Double','Paese Ballers','Hammer Time','Air Time','Slam Pack','I Fenomeni','Brick Squad','Downtown','Crossover Kings','No Look','Buzzer Beaters'].map((n,i)=>({id:'tt'+i,name:n}));

function DrawPanel(){
  const store=useStore(); const s=store.state;
  const regCount=s.registrations.filter(r=>r.type==='team').length;
  const doDraw=()=>{ const res=window.ETG.Store.drawGroups(); if(!res.ok&&res.reason==='count') alert('Per il sorteggio servono 16 squadre iscritte. Al momento sono '+res.count+'.'); };
  const doTest=()=>{ if(confirm('Sorteggiare con 16 squadre di ESEMPIO per provare il meccanismo? (non tocca le iscrizioni reali)')) window.ETG.Store.drawGroups(TEST_TEAMS); };
  return (
    <div className="stack g16">
      <div className="card card-pad" style={{textAlign:'center'}}>
        <div style={{width:60,height:60,borderRadius:'50%',background:'var(--sand-soft)',display:'grid',placeItems:'center',margin:'0 auto 14px'}}>
          <Ic.bracket style={{width:26,height:26,color:'var(--orange)'}}/>
        </div>
        <div className="h3">Sorteggio dei gironi</div>
        <p className="small" style={{marginTop:8,maxWidth:320,marginInline:'auto',lineHeight:1.55}}>
          Distribuisce <b>a caso</b> le 16 squadre iscritte in <b>4 gironi da 4</b> (A–D) e genera il calendario della Giornata 1. Le classifiche si calcolano poi dai risultati.
        </p>
        <div className="chip chip-teal" style={{marginTop:14}}>{regCount}/16 squadre iscritte</div>
        <div className="stack g10" style={{marginTop:16}}>
          <Btn variant="primary" size="lg" block onClick={doDraw} disabled={regCount!==16}><Ic.bracket style={{width:18,height:18}}/> Sorteggia i gironi</Btn>
          <button className="btn btn-ghost btn-sm" onClick={doTest}>Prova con 16 squadre di esempio</button>
        </div>
      </div>
      <div className="notice">Il sorteggio è casuale: ogni squadra ha la stessa probabilità di finire in ciascun girone. Potrai ri-sorteggiare finché non inizi a inserire i risultati.</div>
    </div>
  );
}

function StaffGironi(){
  const store=useStore(); const s=store.state;
  const st=window.ETG.Store.tournamentStatus();
  if(!st.drawn) return <DrawPanel/>;
  const reDraw=()=>{ if(confirm('Ri-sorteggiare i gironi? Verranno azzerati risultati, mini gironi e tabellone.')) window.ETG.Store.drawGroups(s.registrations.filter(r=>r.type==='team').length===16?undefined:TEST_TEAMS); };
  const cancelDraw=()=>{ if(confirm('Annullare il sorteggio? Verranno eliminati gironi, calendario, mini gironi e tabellone. Le iscrizioni NON vengono toccate.')) window.ETG.Store.clearDraw(); };
  const genD2=()=>{ const r=window.ETG.Store.generateDay2(); if(!r.ok) alert(r.reason==='incomplete'?'Completa prima tutte le partite della Giornata 1.':'Sorteggia prima i gironi.'); };
  return (
    <div className="stack g16">
      <div className="card" style={{padding:'12px 14px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <span style={{width:38,height:38,borderRadius:10,background:'rgba(30,138,91,.12)',display:'grid',placeItems:'center',flex:'0 0 auto'}}><Ic.check style={{width:18,height:18,color:'var(--ok,#1E8A5B)'}}/></span>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:14}}>Gironi sorteggiati</div><div className="tiny">4 gironi da 4 · calendario Giornata 1 pronto</div></div>
        <div className="row g6" style={{flex:'0 0 auto'}}>
          <button className="btn btn-ghost btn-sm" onClick={reDraw}>Ri-sorteggia</button>
          <button className="btn btn-ghost btn-sm" style={{color:'var(--red)'}} onClick={cancelDraw}>Annulla sorteggio</button>
        </div>
      </div>
      <div className="eyebrow">Giornata 1 · gironi da 4 — passa la 1ª ai quarti</div>
      {['A','B','C','D'].map(g=><StandTable key={g} phase="group1" group={g} qualifies={1}/>)}

      {st.d1Done && !st.d2Exists && (
        <div className="card card-pad" style={{textAlign:'center'}}>
          <div className="h3">Giornata 1 completata</div>
          <p className="small" style={{marginTop:6,maxWidth:300,marginInline:'auto',lineHeight:1.5}}>Genera i <b>mini gironi</b> con le squadre non qualificate (formula 2ª/3ª/4ª).</p>
          <Btn variant="primary" block style={{marginTop:14}} onClick={genD2}><Ic.fwd style={{width:18,height:18}}/> Genera i mini gironi (Giornata 2)</Btn>
        </div>
      )}
      {st.d2Exists && <>
        <div className="hr-soft"></div>
        <div className="row between" style={{alignItems:'center'}}>
          <div className="eyebrow">Giornata 2 · mini gironi da 3 — passa la 1ª</div>
          <button className="btn btn-ghost btn-sm" onClick={genD2}>Rigenera</button>
        </div>
        {['E','F','G','H'].map(g=><StandTable key={g} phase="group2" group={g} qualifies={1}/>)}
      </>}
    </div>
  );
}
function StaffTabellone(){
  const store=useStore(); useStore();
  const st=window.ETG.Store.tournamentStatus();
  const genB=()=>{ const r=window.ETG.Store.generateBracket(); if(!r.ok) alert(r.reason==='d1'?'Completa prima la Giornata 1.':'Completa la Giornata 2 (mini gironi) prima di generare il tabellone.'); };
  if(!st.bracketExists){
    return (
      <div className="card card-pad" style={{textAlign:'center',padding:'36px 22px'}}>
        <div style={{width:60,height:60,borderRadius:'50%',background:'var(--sand-soft)',display:'grid',placeItems:'center',margin:'0 auto 14px'}}><Ic.trophy style={{width:26,height:26,color:'var(--orange)'}}/></div>
        <div className="h3">Tabellone non ancora generato</div>
        <p className="small" style={{marginTop:8,maxWidth:300,marginInline:'auto',lineHeight:1.55}}>Si forma con le <b>4 vincitrici della Giornata 1</b> e le <b>4 vincitrici della Giornata 2</b>. Abbinamenti: 1A–1H, 1B–1G, 1C–1F, 1D–1E.</p>
        <Btn variant="primary" block style={{marginTop:16}} disabled={!st.d2Done} onClick={genB}><Ic.bracket style={{width:18,height:18}}/> Genera il tabellone</Btn>
        {!st.d2Done && <div className="tiny" style={{marginTop:10,opacity:.7}}>Disponibile quando tutte le partite dei mini gironi sono concluse.</div>}
      </div>
    );
  }
  return (
    <div>
      <div className="row between" style={{marginBottom:16,alignItems:'center'}}>
        <div className="notice" style={{margin:0,flex:1}}>I vincitori avanzano automaticamente quando registri i risultati.</div>
        <button className="btn btn-ghost btn-sm" style={{marginLeft:10,flex:'0 0 auto'}} onClick={genB}>Rigenera</button>
      </div>
      <Bracket/>
    </div>
  );
}

/* ============ staff: PROGRAMMA GIRONI (orari, campi, spostamenti) ============ */

/* singola casella partita nella griglia generale */
function SchedCell({m, onTap}){
  if(!m) return <div className="card" style={{padding:'9px 10px',textAlign:'center',color:'var(--ink-3)',borderStyle:'dashed'}}>—</div>;
  const live=m.status==='live', done=m.status==='done';
  return (
    <button onClick={()=>onTap(m)} style={{all:'unset',cursor:'pointer',display:'block'}}>
      <div className="card" style={{padding:'8px 10px',borderColor:live?'var(--red)':'var(--line)'}}>
        <div className="tiny" style={{marginBottom:3,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span className="mono" style={{fontWeight:800,color:'var(--orange)'}}>{window.ETG.helpers.matchLabel(m)}</span>
          {m.timeOverride ? <span className="mono" title="orario personalizzato" style={{color:'var(--teal)'}}>✎{m.time}</span>
            : done ? <span className="mono">{m.scoreA}:{m.scoreB}</span> : <Ic.pen style={{width:12,height:12,color:'var(--ink-3)'}}/>}
        </div>
        <div style={{fontWeight:700,fontSize:12.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{window.ETG.teamName(m.aId)}</div>
        <div style={{fontWeight:700,fontSize:12.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'var(--ink-2,#555)'}}>{window.ETG.teamName(m.bId)}</div>
      </div>
    </button>
  );
}

/* card di configurazione orari di un blocco (g1/g2/brk) */
function SchedConfigCard({block, title, note}){
  useStore();
  const [f,setF]=useState(()=>window.ETG.Store.scheduleConfig(block));
  const apply=()=>window.ETG.Store.setScheduleConfig(block,{ start:f.start, slotMin:f.slotMin, breakAfter:f.breakAfter, breakMin:f.breakMin, breakLabel:f.breakLabel });
  return (
    <div className="card card-pad">
      <div className="row g8" style={{marginBottom:12}}><Ic.clock style={{width:18,height:18,color:'var(--orange)'}}/><div style={{fontWeight:800}}>{title}</div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Field label="Inizio"><Text value={f.start} onChange={v=>setF({...f,start:v})} placeholder="18:00" inputMode="numeric"/></Field>
        <Field label="Ogni (min)"><Text value={String(f.slotMin)} onChange={v=>setF({...f,slotMin:v})} inputMode="numeric"/></Field>
        <Field label="Pausa dopo (turni)"><Text value={String(f.breakAfter)} onChange={v=>setF({...f,breakAfter:v})} inputMode="numeric"/></Field>
        <Field label="Durata pausa (min)"><Text value={String(f.breakMin)} onChange={v=>setF({...f,breakMin:v})} inputMode="numeric"/></Field>
      </div>
      <Field label="Titolo pausa"><Text value={f.breakLabel} onChange={v=>setF({...f,breakLabel:v})} placeholder="Pausa"/></Field>
      <Btn variant="primary" block onClick={apply}><Ic.check style={{width:16,height:16}}/> Applica orari</Btn>
      {note && <div className="tiny" style={{marginTop:8,opacity:.75}}>{note}</div>}
    </div>
  );
}

/* vista generale a griglia (turni × 2 campi) di un blocco */
function SchedGrid({grid, onTap}){
  if(!grid.rows.length) return null;
  return (
    <div className="stack g8">
      <div style={{display:'grid',gridTemplateColumns:'52px 1fr 1fr',gap:8,alignItems:'center'}}>
        <div></div>
        <div className="tiny mono" style={{textAlign:'center',fontWeight:800}}>CAMPO 1</div>
        <div className="tiny mono" style={{textAlign:'center',fontWeight:800}}>CAMPO 2</div>
      </div>
      {grid.rows.map(r=>(
        <React.Fragment key={r.slot}>
          {r.breakBefore && (
            <div className="card" style={{padding:'9px 12px',background:'var(--teal)',color:'#fff',border:0,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
              <Ic.ball style={{width:16,height:16,color:'var(--sand)'}}/>
              <span style={{fontWeight:800,fontSize:13}}>{grid.cfg.breakLabel||'Pausa'}</span>
              <span className="tiny" style={{opacity:.85}}>· {grid.cfg.breakMin} min</span>
            </div>
          )}
          <div style={{display:'grid',gridTemplateColumns:'52px 1fr 1fr',gap:8,alignItems:'stretch'}}>
            <div style={{textAlign:'center'}}>
              <div className="mono" style={{fontWeight:800,fontSize:13}}>{r.time}</div>
              <div className="tiny">T{r.slot+1}</div>
            </div>
            <SchedCell m={r.courts[0]} onTap={onTap}/>
            <SchedCell m={r.courts[1]} onTap={onTap}/>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* liste "girone per girone" (o fase per fase) di un blocco */
function SchedGroupList({groups, phase, onTap}){
  return (
    <div className="stack g12">
      {groups.map(g=>{
        const list=window.ETG.helpers.groupSchedule(g, phase);
        if(!list.length) return null;
        return (
          <div key={g} className="card" style={{overflow:'hidden'}}>
            <div className="row between" style={{padding:'10px 13px 6px'}}><div className="h3">Girone {g}</div><span className="tiny mono">{list.length} partite</span></div>
            <div className="stack g6" style={{padding:'0 10px 12px'}}>
              {list.map(m=>(
                <button key={m.id} onClick={()=>onTap(m)} style={{all:'unset',cursor:'pointer',display:'block'}}>
                  <div className="card" style={{padding:'8px 11px',display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:44,flex:'0 0 auto',textAlign:'center'}}><div className="mono" style={{fontWeight:800,fontSize:13}}>{m.time}</div><div className="tiny">{m.court.replace('Campo','C.')}</div></div>
                    <div style={{flex:1,minWidth:0,fontSize:13,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{window.ETG.teamName(m.aId)} <span style={{color:'var(--ink-3)',fontWeight:400}}>vs</span> {window.ETG.teamName(m.bId)}</div>
                    <Ic.pen style={{width:14,height:14,color:'var(--ink-3)'}}/>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StaffCalendario(){
  const store=useStore(); const s=store.state;
  const st=window.ETG.Store.tournamentStatus();
  const [edit,setEdit]=useState(null);

  if(!st.drawn){
    return (
      <div className="card card-pad" style={{textAlign:'center',padding:'34px 22px'}}>
        <div style={{width:58,height:58,borderRadius:'50%',background:'var(--sand-soft)',display:'grid',placeItems:'center',margin:'0 auto 14px'}}><Ic.cal style={{width:24,height:24,color:'var(--orange)'}}/></div>
        <div className="h3">Programma non ancora disponibile</div>
        <p className="small" style={{marginTop:8,maxWidth:300,marginInline:'auto',lineHeight:1.55}}>Sorteggia prima i gironi (scheda <b>Gironi</b>). Il calendario della Giornata 1 verrà creato in automatico e potrai gestirlo qui.</p>
      </div>
    );
  }

  const published=window.ETG.Store.isPublished();
  const g1=window.ETG.helpers.groupGrid();
  const g2=window.ETG.helpers.day2Grid();
  const brk=window.ETG.helpers.bracketGrid();

  return (
    <div className="stack g16">
      {/* pubblicazione del calendario */}
      <div className="card card-pad" style={{borderColor: published?'var(--ok,#1E8A5B)':'var(--orange)',borderWidth:1.5}}>
        <div className="row between" style={{gap:12,alignItems:'center'}}>
          <div style={{minWidth:0,flex:1}}>
            <div className="row g8" style={{marginBottom:2}}>
              {published ? <Ic.live style={{width:18,height:18,color:'var(--ok,#1E8A5B)',flex:'0 0 auto'}}/> : <Ic.lock style={{width:18,height:18,color:'var(--orange)',flex:'0 0 auto'}}/>}
              <div style={{fontWeight:800}}>{published?'Calendario PUBBLICO':'Calendario PRIVATO'}</div>
            </div>
            <div className="tiny">{published?'Tutti lo vedono nell’area Risultati & tabellone.':'Visibile solo allo staff finché non lo pubblichi.'}</div>
          </div>
          <Btn variant={published?'ghost':'primary'} size="sm" onClick={()=>window.ETG.Store.setPublished(!published)} style={{flex:'0 0 auto'}}>
            {published?'Rendi privato':'Rendi pubblico'}
          </Btn>
        </div>
      </div>

      {/* ===== GIORNATA 1 · GIRONI ===== */}
      <div className="eyebrow">🏀 Giornata 1 · Gironi</div>
      <SchedConfigCard block="g1" title="Orari & pausa — Giornata 1" note="Ogni turno ha 2 partite in contemporanea (un mezzo campo ciascuna). La pausa serve alla gara da 3 punti."/>
      <div className="tiny mono" style={{opacity:.7}}>Vista generale · {g1.rows.length} turni · 2 campi</div>
      <SchedGrid grid={g1} onTap={setEdit}/>
      <div className="eyebrow">Girone per girone</div>
      <SchedGroupList groups={['A','B','C','D']} phase="group1" onTap={setEdit}/>

      {/* ===== GIORNATA 2 · MINI GIRONI ===== */}
      {st.d2Exists && <>
        <div className="hr-soft"></div>
        <div className="eyebrow">🏀 Giornata 2 · Mini gironi</div>
        <SchedConfigCard block="g2" title="Orari & pausa — Mini gironi" note="4 mini gironi (E–H) da 3 squadre, su 2 campi in contemporanea."/>
        <div className="tiny mono" style={{opacity:.7}}>Vista generale · {g2.rows.length} turni · 2 campi</div>
        <SchedGrid grid={g2} onTap={setEdit}/>
        <div className="eyebrow">Girone per girone</div>
        <SchedGroupList groups={['E','F','G','H']} phase="group2" onTap={setEdit}/>
      </>}

      {/* ===== GIORNATA 2 · TABELLONE ===== */}
      {st.bracketExists && <>
        <div className="hr-soft"></div>
        <div className="eyebrow">🏆 Giornata 2 · Tabellone</div>
        <SchedConfigCard block="brk" title="Orari — Tabellone" note="Quarti e semifinali sui 2 campi in contemporanea, finale su Campo 1. Puoi comunque spostarle a piacere."/>
        <div className="tiny mono" style={{opacity:.7}}>Vista generale · {brk.rows.length} turni</div>
        <SchedGrid grid={brk} onTap={setEdit}/>
      </>}

      {(!st.d2Exists || !st.bracketExists) && (
        <div className="notice">Gli orari di {(!st.d2Exists)&&<b>mini gironi</b>}{(!st.d2Exists&&!st.bracketExists)?' e ':''}{(!st.bracketExists)&&<b>tabellone</b>} compariranno qui quando li generi (schede Gironi / Tabellone) e potrai modificarli.</div>
      )}

      {/* sheet: sposta / modifica orario di una partita */}
      <Sheet open={!!edit} onClose={()=>setEdit(null)}>
        {edit && <SchedEditSheet match={s.matches.find(x=>x.id===edit.id)||edit} onClose={()=>setEdit(null)}/>}
      </Sheet>
    </div>
  );
}

/* editor di una singola partita del programma (sposta turno/campo, orario forzato) */
function SchedEditSheet({match, onClose}){
  useStore(); // ri-render sui cambi
  const m=window.ETG.Store.matchById(match.id)||match;
  const [ov,setOv]=useState(m.timeOverride||'');
  const fld=(m.phase==='group1'||m.phase==='group2')?'slot':'tslot'; // il tabellone usa tslot (slot = accoppiamento)
  const slotOptions=window.ETG.helpers.slotOptionsFor(m.phase);
  const move=(slot,court)=>window.ETG.Store.moveMatch(m.id,slot,court);
  const applyOv=()=>{ const r=window.ETG.Store.setMatchTimeOverride(m.id,ov); if(!r.ok&&r.reason==='format') alert('Formato orario non valido. Usa HH:MM (es. 20:15).'); };
  const clearOv=()=>{ setOv(''); window.ETG.Store.setMatchTimeOverride(m.id,''); };
  return (
    <div style={{padding:'4px 18px 26px'}}>
      <div className="h3" style={{marginBottom:2}}>{window.ETG.helpers.matchLabel(m)}</div>
      <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{window.ETG.teamName(m.aId)} <span style={{color:'var(--ink-3)',fontWeight:400}}>vs</span> {window.ETG.teamName(m.bId)}</div>
      <div className="tiny" style={{marginBottom:16}}>{m.day} · attualmente ore <b>{m.time}</b> · {m.court}</div>

      <Field label="Mezzo campo">
        <Seg value={m.court==='Campo 2'?2:1} onChange={c=>move(m[fld],c)} options={[{v:1,l:'Campo 1'},{v:2,l:'Campo 2'}]}/>
      </Field>
      <Field label="Sposta al turno" hint="Se il turno scelto è già occupato su questo campo, le due partite si scambiano.">
        <Select value={String(m[fld])} onChange={v=>move(v,m.court==='Campo 2'?2:1)} options={slotOptions}/>
      </Field>
      <div className="hr-soft"></div>
      <Field label="Orario personalizzato" hint="Forza un orario diverso solo per questa partita (formato HH:MM).">
        <div className="row g8">
          <Text value={ov} onChange={setOv} placeholder={m.time} inputMode="numeric"/>
          <Btn variant="dark" size="sm" onClick={applyOv}>Imposta</Btn>
        </div>
      </Field>
      {m.timeOverride && <button className="btn btn-ghost btn-sm" onClick={clearOv}>↺ Torna all'orario automatico</button>}
      <Btn variant="primary" size="lg" block style={{marginTop:18}} onClick={onClose}>Fatto</Btn>
    </div>
  );
}

/* ---- staff shell + PIN gate ---- */
function StaffArea({go, sub, setSub}){
  const [unlocked,setUnlocked]=useState(false); const [pin,setPin]=useState(''); const [shake,setShake]=useState(false);
  const [loading,setLoading]=useState(false); const [loadErr,setLoadErr]=useState('');
  const unlock=async (v)=>{
    // Il PIN NON e' mai nel codice: viene verificato SOLO dal server (Supabase).
    // Se il PIN e' giusto l'archivio risponde con i dati; altrimenti "non autorizzato".
    setLoading(true); setLoadErr('');
    try{
      const res=await window.ETG.Store.loadStaffAsync(v);
      if(!res.ok){
        const wrong=/unauth|authoriz|autoriz|403|jwt|permission/i.test(res.error||'');
        setLoadErr(wrong? 'PIN errato. Riprova.' : 'Connessione all\u2019archivio non riuscita. Riprova.');
        setShake(true); setTimeout(()=>{setShake(false);setPin('');},500); return;
      }
      window.ETG.staffPin=v;          // memorizzato per le operazioni staff (elimina, forma squadra)
      // carica dal server lo stato aggiornato del torneo (calendario/risultati), anche se non pubblicato
      if(window.ETG.Store.loadTournamentAsync){ try{ await window.ETG.Store.loadTournamentAsync(); }catch(e){} }
      setUnlocked(true);
    } finally { setLoading(false); }
  };
  const tryPin=(v)=>{ setPin(v); if(v.length===4){ unlock(v); } };

  if(!unlocked){
    return (
      <div className="fadein">
        <FormHeader go={go} title="Area Staff" tag="Riservato" sub="Inserisci il PIN per gestire iscrizioni e risultati"/>
        <div className="screen section" style={{textAlign:'center'}}>
          <div className="dmark" style={{width:60,height:60,margin:'10px auto 22px'}}></div>
          <div className={shake?'':''} style={{display:'flex',gap:10,justifyContent:'center',marginBottom:18,animation:shake?'shakex .4s':'none'}}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{width:46,height:56,borderRadius:12,border:'1.5px solid '+(pin.length>i?'var(--teal)':'var(--line-2)'),display:'grid',placeItems:'center',fontFamily:'var(--display)',fontWeight:800,fontSize:24,background:'#fff'}}>{pin[i]?'•':''}</div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,maxWidth:260,margin:'0 auto'}}>
            {[1,2,3,4,5,6,7,8,9].map(n=>(
              <button key={n} className="btn btn-ghost btn-lg" onClick={()=>pin.length<4&&tryPin(pin+n)} style={{padding:'16px 0',fontSize:20}}>{n}</button>
            ))}
            <button className="btn btn-ghost btn-lg" style={{visibility:'hidden'}}>·</button>
            <button className="btn btn-ghost btn-lg" style={{padding:'16px 0',fontSize:20}} onClick={()=>pin.length<4&&tryPin(pin+'0')}>0</button>
            <button className="btn btn-ghost btn-lg" style={{padding:'16px 0'}} onClick={()=>setPin(pin.slice(0,-1))}>⌫</button>
          </div>
          <div className="tiny" style={{marginTop:20,opacity:.7}}>{loading?'Carico le iscrizioni\u2026':(loadErr||'Inserisci il PIN dello staff')}</div>
        </div>
        <style>{`@keyframes shakex{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}`}</style>
      </div>
    );
  }

  const tabs=[['regs','Iscrizioni'],['gironi','Gironi'],['calendario','Calendario'],['tabellone','Tabellone'],['results','Risultati']];
  return (
    <div className="fadein">
      <div style={{background:'var(--ink)',color:'#fff',position:'sticky',top:53,zIndex:30}}>
        <div className="screen" style={{paddingTop:14,paddingBottom:12}}>
          <div className="row between" style={{marginBottom:12}}>
            <div className="row g8"><Ic.staff style={{width:18,height:18,color:'var(--orange)',flex:'0 0 auto'}}/><span style={{fontWeight:800,whiteSpace:'nowrap'}}>Area Staff</span></div>
            <button onClick={()=>go('home')} className="chip" style={{background:'rgba(255,255,255,.1)',border:0,color:'#fff'}}>Esci</button>
          </div>
          <div style={{display:'flex',gap:6,overflowX:'auto'}}>
            {tabs.map(([k,l])=>(
              <button key={k} onClick={()=>setSub(k)} className={'btn btn-sm stab'+(sub===k?' on':'')}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="screen section">
        {sub==='regs' && <StaffRegs/>}
        {sub==='gironi' && <StaffGironi/>}
        {sub==='calendario' && <StaffCalendario/>}
        {sub==='tabellone' && <StaffTabellone/>}
        {sub==='results' && <StaffResults/>}
      </div>
    </div>
  );
}

Object.assign(window,{ StaffArea, StaffLive, StaffResults, StaffGironi, StaffTabellone, StaffCalendario, SchedEditSheet, SchedCell, SchedConfigCard, SchedGrid, SchedGroupList, advanceBracket });
