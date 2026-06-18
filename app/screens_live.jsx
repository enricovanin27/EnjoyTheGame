/* ============ ENJOY THE GAME — area live (pubblico) ============ */

function teamColor(id){ const t=window.ETG.Store.state.teams[id]; return t?t.color:'var(--ink-3)'; }
const TN = (id)=>window.ETG.teamName(id);

/* ---- read-only scoreboard ---- */
function Scoreboard({m, live}){
  if(!m) return null;
  const target=m.target||21; const a=m.scoreA||0,b=m.scoreB||0;
  const lead=Math.max(a,b); const pct=Math.min(100, lead/target*100);
  return (
    <div className="scorebrd">
      <div className="row between" style={{marginBottom:14}}>
        <span className="chip chip-live"><span className="dot pulse"></span> LIVE</span>
        <span className="mono" style={{fontSize:11,opacity:.75,letterSpacing:'.05em'}}>{(live&&live.period)||'TEMPO UNICO'} · arrivo a {target}</span>
      </div>
      <div className="row" style={{alignItems:'stretch',gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div className="row g8" style={{marginBottom:8}}><span style={{width:10,height:10,borderRadius:3,background:teamColor(m.aId)}}></span><span className="sb-team" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{TN(m.aId)}</span></div>
          <div className="sb-score" style={{color: a>=b?'#fff':'rgba(255,255,255,.6)'}}>{a}</div>
          {live&&live.timeoutA && <div className="mono" style={{fontSize:10,opacity:.7,marginTop:6}}>TIME-OUT USATO</div>}
        </div>
        <div style={{alignSelf:'center',fontFamily:'var(--display)',fontWeight:800,opacity:.4,fontSize:22}}>:</div>
        <div style={{flex:1,minWidth:0,textAlign:'right'}}>
          <div className="row g8" style={{marginBottom:8,justifyContent:'flex-end'}}><span className="sb-team" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{TN(m.bId)}</span><span style={{width:10,height:10,borderRadius:3,background:teamColor(m.bId)}}></span></div>
          <div className="sb-score" style={{color: b>=a?'#fff':'rgba(255,255,255,.6)'}}>{b}</div>
          {live&&live.timeoutB && <div className="mono" style={{fontSize:10,opacity:.7,marginTop:6}}>TIME-OUT USATO</div>}
        </div>
      </div>
      <div style={{height:6,borderRadius:99,background:'rgba(255,255,255,.16)',marginTop:18,overflow:'hidden'}}>
        <div style={{height:'100%',width:pct+'%',background:'var(--orange)',borderRadius:99,transition:'width .3s'}}></div>
      </div>
      <div className="tiny" style={{color:'rgba(255,255,255,.6)',marginTop:8,textAlign:'center'}}>{m.court} · {m.day} · ore {m.time}</div>
    </div>
  );
}

function PhaseLabel(ph){ return {group1:'Girone',group2:'Mini girone',quarti:'Quarto',semi:'Semifinale',finale:'Finale'}[ph]||ph; }

/* ---- empty state: sorteggio non ancora effettuato ---- */
function NotDrawnYet({what}){
  return (
    <div className="card card-pad" style={{textAlign:'center',padding:'40px 22px'}}>
      <div style={{width:64,height:64,borderRadius:'50%',background:'var(--sand-soft)',display:'grid',placeItems:'center',margin:'0 auto 16px'}}>
        <Ic.bracket style={{width:28,height:28,color:'var(--ink-3)'}}/>
      </div>
      <div className="h3">{what} non ancora disponibili</div>
      <p className="small" style={{marginTop:8,maxWidth:300,marginInline:'auto',lineHeight:1.55}}>
        Il <b>sorteggio dei gironi</b> viene effettuato dallo staff <b>dopo la chiusura delle iscrizioni</b>. Calendario, gironi e tabellone compariranno qui non appena saranno pronti.
      </p>
    </div>
  );
}

/* ---- match row ---- */
function MatchRow({m}){
  const done=m.status==='done', live=m.status==='live';
  const aw=done&&m.scoreA>m.scoreB, bw=done&&m.scoreB>m.scoreA;
  return (
    <div className="card" style={{padding:'11px 13px',display:'flex',alignItems:'center',gap:12,borderColor:live?'var(--red)':'var(--line)'}}>
      <div style={{width:52,flex:'0 0 auto',textAlign:'center'}}>
        {live ? <span className="chip chip-live" style={{padding:'3px 7px'}}><span className="dot pulse"></span></span>
          : <div className="mono" style={{fontWeight:700,fontSize:13}}>{m.time}</div>}
        <div className="tiny" style={{marginTop:2}}>{m.court.replace('Campo','C.')}</div>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div className="row between" style={{gap:10}}>
          <span style={{flex:'1 1 auto',minWidth:0,fontWeight:aw?800:600,fontSize:14,color:bw?'var(--ink-3)':'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{TN(m.aId)}</span>
          <span className="tnum" style={{flex:'0 0 auto',fontWeight:800,fontSize:15,color:live?'var(--red)':aw?'var(--ink)':'var(--ink-3)'}}>{m.scoreA==null?'–':m.scoreA}</span>
        </div>
        <div className="row between" style={{gap:10,marginTop:3}}>
          <span style={{flex:'1 1 auto',minWidth:0,fontWeight:bw?800:600,fontSize:14,color:aw?'var(--ink-3)':'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{TN(m.bId)}</span>
          <span className="tnum" style={{flex:'0 0 auto',fontWeight:800,fontSize:15,color:live?'var(--red)':bw?'var(--ink)':'var(--ink-3)'}}>{m.scoreB==null?'–':m.scoreB}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- standings table ---- */
function StandTable({phase,group,qualifies=1}){
  const rows=window.ETG.standings(phase,group);
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div className="row between" style={{padding:'12px 14px 8px'}}>
        <div className="h3">Girone {group}</div>
        <span className="tiny mono">passa {qualifies}ª</span>
      </div>
      <table className="tbl">
        <thead><tr><th></th><th style={{textAlign:'left'}}>Squadra</th><th>G</th><th>V</th><th>P</th><th>+/–</th><th>Pt</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={r.teamId} className={i<qualifies?'qual':''}>
              <td><span className={'rank'+(i<qualifies?' q':'')}>{i+1}</span></td>
              <td className="team"><span className="row g8"><span style={{width:8,height:8,borderRadius:2,background:teamColor(r.teamId)}}></span>{TN(r.teamId)}</span></td>
              <td>{r.played}</td><td>{r.w}</td><td>{r.l}</td>
              <td style={{color:(r.pf-r.pa)>0?'var(--ok)':(r.pf-r.pa)<0?'var(--red)':'var(--ink-3)'}}>{r.pf-r.pa>0?'+':''}{r.pf-r.pa}</td>
              <td style={{fontWeight:800}}>{r.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- bracket ---- */
function BTeam({id,score,win}){
  return (
    <div className={'bteam '+(id?(win?'win':'lose'):'')}>
      <span style={{display:'flex',alignItems:'center',gap:6,minWidth:0}}>
        <span style={{width:7,height:7,borderRadius:2,background:id?teamColor(id):'var(--line-2)',flex:'0 0 auto'}}></span>
        <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{id?TN(id):'—'}</span>
      </span>
      <span className="bscore">{score==null?'':score}</span>
    </div>
  );
}
function BMatch({m,label}){
  const done=m.status==='done', live=m.status==='live';
  return (
    <div className="bmatch" style={{borderColor:live?'var(--red)':'var(--line)'}}>
      <div className="tiny" style={{marginBottom:4,display:'flex',justifyContent:'space-between'}}><span>{label}</span><span>{live?<span style={{color:'var(--red)',fontWeight:700}}>LIVE</span>:m.time}</span></div>
      <BTeam id={m.aId} score={m.scoreA} win={done&&m.scoreA>m.scoreB}/>
      <BTeam id={m.bId} score={m.scoreB} win={done&&m.scoreB>m.scoreA}/>
    </div>
  );
}
function Bracket(){
  const b=window.ETG.helpers.bracketMatches();
  return (
    <div className="bracket">
      <div className="bcol">
        <div className="eyebrow" style={{marginBottom:2}}>Quarti</div>
        {b.quarti.map((m,i)=><BMatch key={m.id} m={m} label={'Q'+(i+1)}/>)}
      </div>
      <div className="bcol">
        <div className="eyebrow" style={{marginBottom:2}}>Semifinali</div>
        {b.semi.map((m,i)=><BMatch key={m.id} m={m} label={'SF'+(i+1)}/>)}
      </div>
      <div className="bcol">
        <div className="eyebrow" style={{marginBottom:2}}>Finale</div>
        {b.finale.map((m)=><BMatch key={m.id} m={m} label="🏆 Finale"/>)}
        <div className="card" style={{padding:'12px',textAlign:'center',background:'var(--teal)',color:'#fff',border:0,marginTop:4}}>
          <Ic.trophy style={{width:24,height:24,color:'var(--sand)'}}/>
          <div className="tiny" style={{color:'rgba(255,255,255,.7)',marginTop:4}}>Vincitore</div>
          <div style={{fontWeight:800}}>IV Edizione</div>
        </div>
      </div>
    </div>
  );
}

/* ---- live area shell ---- */
function LiveArea({go, sub, setSub}){
  useStore();
  const sched=window.ETG.helpers.schedule();
  const st=window.ETG.Store.tournamentStatus();
  const drawn = st.drawn;
  const tabs=[['calendario','Calendario'],['gironi','Gironi'],['tabellone','Tabellone']];

  return (
    <div className="fadein">
      <div style={{background:'#fff',borderBottom:'1px solid var(--line)',position:'sticky',top:53,zIndex:30}}>
        <div className="screen" style={{paddingTop:14,paddingBottom:12}}>
          <div className="row between" style={{marginBottom:12}}>
            <h1 className="h2">Risultati & tabellone</h1>
            <span className="chip chip-teal">IV Edizione</span>
          </div>
          <div style={{display:'flex',gap:6,overflowX:'auto'}}>
            {tabs.map(([k,l])=>(
              <button key={k} onClick={()=>setSub(k)} className={'btn '+(sub===k?'btn-dark':'btn-ghost')+' btn-sm'} style={{flex:'0 0 auto'}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="screen section">
        {sub==='calendario' && (drawn ? (
          <div className="stack g20" key="cal">
            {['SAB 25 LUG','DOM 26 LUG'].map(day=>{
              const items=sched.filter(m=>m.day===day);
              if(!items.length) return null;
              return (
                <div key={day}>
                  <div className="row g8" style={{marginBottom:12}}><span className="chip chip-orange">{day}</span><span className="tiny">{items.length} partite</span></div>
                  <div className="stack g8">{items.map(m=><MatchRow key={m.id} m={m}/>)}</div>
                </div>
              );
            })}
          </div>
        ) : <NotDrawnYet what="Calendario"/>)}

        {sub==='gironi' && (drawn ? (
          <div className="stack g16" key="gir">
            <div className="eyebrow">Giornata 1 · gironi da 4 — passa la 1ª ai quarti</div>
            {['A','B','C','D'].map(g=><StandTable key={g} phase="group1" group={g} qualifies={1}/>)}
            {st.d2Exists && <>
              <div className="hr-soft"></div>
              <div className="eyebrow">Giornata 2 · mini gironi da 3 — passa la 1ª</div>
              {['E','F','G','H'].map(g=><StandTable key={g} phase="group2" group={g} qualifies={1}/>)}
            </>}
          </div>
        ) : <NotDrawnYet what="Gironi"/>)}

        {sub==='tabellone' && (st.bracketExists ? (
          <div key="brk">
            <div className="notice" style={{marginBottom:16}}>4 vincitrici della Giornata 1 + 4 vincitrici della Giornata 2 si sfidano a eliminazione diretta (tempo 15 min).</div>
            <Bracket/>
          </div>
        ) : <NotDrawnYet what="Tabellone"/>)}
      </div>
    </div>
  );
}

Object.assign(window,{ LiveArea, Scoreboard, MatchRow, StandTable, Bracket, PhaseLabel, teamColor });
