/* ============ ENJOY THE GAME — shared UI ============ */
const { useState, useEffect, useRef, useCallback } = React;

/* ---- store hook ---- */
function useStore(){
  const [,force]=useState(0);
  useEffect(()=> window.ETG.Store.subscribe(()=>force(n=>n+1)), []);
  return window.ETG.Store;
}

/* ---- brand mark (the 4-wedge "D") ---- */
function DMark({size=28, spin=false, style}){
  return <span className={'dmark'+(spin?' spin':'')} style={{width:size,height:size,...style}} aria-hidden="true"></span>;
}
function Wordmark({size=15}){
  return (
    <span className="brand" style={{fontSize:size}}>
      <DMark size={size*1.5}/>
      <span>ENJOY <span style={{color:'var(--orange)'}}>THE</span> GAME</span>
    </span>
  );
}

/* ---- icons (simple line set) ---- */
const Ic = {
  home:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>,
  live:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><path d="M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7"/></svg>,
  bracket:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 5h6v5H4M4 14h6v5H4M14 9h6M14 9v6M14 15h0"/><path d="M10 7.5h4M10 16.5h4M20 9v6"/></svg>,
  cal:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>,
  table:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 9v11"/></svg>,
  staff:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/></svg>,
  back:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>,
  fwd:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  check:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>,
  close:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>,
  user:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>,
  users:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.4 3-5 6.5-5s6.5 1.6 6.5 5"/><path d="M16 5.2A3.4 3.4 0 0118 11M17 15c2.8.3 4.5 2 4.5 5"/></svg>,
  pin:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  clock:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  pen:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4l6 6M3 21l3.5-1L20 6.5 17.5 4 4 17.5 3 21z"/></svg>,
  whistle:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11a5 5 0 005 5h2l4 3v-8l-4 3H8"/><circle cx="18" cy="11" r="3"/><path d="M14 6l2-2"/></svg>,
  trophy:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 19h6M12 14v5"/></svg>,
  plus:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  ball:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9.2"/><path d="M3 12h18M12 2.8v18.4M5.5 5.5C8 8 8 16 5.5 18.5M18.5 5.5C16 8 16 16 18.5 18.5"/></svg>,
  copy:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h8"/></svg>,
  lock:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4.5" y="10" width="15" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>,
  key:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="8" cy="8" r="4.5"/><path d="M11.2 11.2L20 20M16 16l2.5-2.5M14 14l2.5-2.5"/></svg>,
  userplus:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.6"/><path d="M3 20c0-3.4 3-5.4 6-5.4s6 2 6 5.4"/><path d="M18 8v6M15 11h6"/></svg>,
  trash:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/><path d="M10 11v6M14 11v6"/></svg>,
  chat:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.4 8.4 0 01-11.9 7.6L3 21l1.9-6.1A8.4 8.4 0 1121 11.5z"/></svg>,
  mail:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>,
  alert:(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3L1.7 21h20.6L12 3z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.6" fill="currentColor" stroke="none"/></svg>,
};

/* ---- buttons ---- */
function Btn({variant='primary', size, block, children, className='', ...rest}){
  const cls=['btn','btn-'+variant, size==='lg'?'btn-lg':'', size==='sm'?'btn-sm':'', block?'btn-block':'', className].join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}

/* ---- form fields ---- */
function Field({label, req, hint, error, children}){
  return (
    <div className="field">
      {label && <label className="label">{label}{req && <span className="req"> *</span>}</label>}
      {children}
      {error ? <span className="field-err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
function Text({value,onChange,error,...rest}){
  return <input className={'control'+(error?' err':'')} value={value||''} onChange={e=>onChange(e.target.value)} {...rest}/>;
}
function Area({value,onChange,...rest}){
  return <textarea className="control" value={value||''} onChange={e=>onChange(e.target.value)} {...rest}/>;
}
function Select({value,onChange,options,placeholder,error}){
  return (
    <select className={'control'+(error?' err':'')} value={value||''} onChange={e=>onChange(e.target.value)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o=> typeof o==='string'? <option key={o} value={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}
function Seg({value,onChange,options}){
  return (
    <div className="seg">
      {options.map(o=>{const v=o.v??o,l=o.l??o; return (
        <button key={v} className={value===v?'on':''} onClick={()=>onChange(v)} type="button">{l}</button>
      );})}
    </div>
  );
}
function OptionCard({on,onClick,children}){
  return <div className={'optcard'+(on?' on':'')} onClick={onClick}><span className="radio-dot"></span><div style={{flex:1}}>{children}</div></div>;
}

/* ---- codice fiscale: single clean uppercase field (16 chars) ---- */
function CFInput({value='', onChange, error}){
  const clean=(value||'').toUpperCase();
  const left=16-clean.length;
  return (
    <div>
      <input className={'control cf-field'+(error?' err':'')} value={clean}
        onChange={e=>onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,16))}
        inputMode="text" autoCapitalize="characters" spellCheck="false" placeholder="RSSMRC01D12L407K" maxLength={16}/>
      <div className="tiny" style={{marginTop:5,textAlign:'right',color:left===0?'var(--ok)':'var(--ink-3)'}}>
        {clean.length}/16{left===0?' ✓':''}
      </div>
    </div>
  );
}

/* ---- signature pad ---- */
function SignaturePad({value, onChange, height=150}){
  const cvs=useRef(null); const wrap=useRef(null); const drawing=useRef(false); const last=useRef(null);
  const [signed,setSigned]=useState(!!value);

  useEffect(()=>{
    const c=cvs.current; const w=wrap.current.clientWidth;
    const dpr=window.devicePixelRatio||1;
    c.width=w*dpr; c.height=height*dpr; c.style.width=w+'px'; c.style.height=height+'px';
    const ctx=c.getContext('2d'); ctx.scale(dpr,dpr); ctx.lineWidth=2.4; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#19150F';
    if(value){ const img=new Image(); img.onload=()=>ctx.drawImage(img,0,0,w,height); img.src=value; }
  },[]);

  const pos=(e)=>{ const r=cvs.current.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return {x:t.clientX-r.left,y:t.clientY-r.top}; };
  const start=(e)=>{ e.preventDefault(); drawing.current=true; last.current=pos(e); };
  const move=(e)=>{ if(!drawing.current) return; e.preventDefault(); const ctx=cvs.current.getContext('2d'); const p=pos(e);
    ctx.beginPath(); ctx.moveTo(last.current.x,last.current.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last.current=p; };
  const end=()=>{ if(!drawing.current) return; drawing.current=false; setSigned(true); onChange && onChange(cvs.current.toDataURL('image/png')); };
  const clear=()=>{ const c=cvs.current; c.getContext('2d').clearRect(0,0,c.width,c.height); setSigned(false); onChange && onChange(null); };

  return (
    <div ref={wrap} style={{position:'relative'}}>
      <canvas ref={cvs} className={'sigpad'+(signed?' signed':'')}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}/>
      {!signed && <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',pointerEvents:'none',color:'#c2b9aa',fontSize:13,fontWeight:600}}>
        <span style={{display:'flex',alignItems:'center',gap:7}}><Ic.pen style={{width:16,height:16}}/> Firma qui con il dito</span></div>}
      <button type="button" onClick={clear} className="btn btn-ghost btn-sm" style={{position:'absolute',top:8,right:8,padding:'5px 11px'}}>Cancella</button>
    </div>
  );
}

/* ---- avatar ---- */
function Avatar({name,color,size=40}){
  const tag=(name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return <span className="avatar" style={{background:color||'var(--teal)',width:size,height:size,fontSize:size*.36}}>{tag}</span>;
}

/* ---- toast ---- */
function useToast(){
  const [msg,setMsg]=useState(null);
  const show=useCallback((m)=>{ setMsg(m); setTimeout(()=>setMsg(null),2600); },[]);
  const node = msg ? <div className="toast"><Ic.check style={{width:18,height:18,color:'var(--orange)'}}/>{msg}</div> : null;
  return [node, show];
}

/* ---- bottom sheet ---- */
function Sheet({open,onClose,children}){
  if(!open) return null;
  return (
    <div className="sheet-back" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-grab"></div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window,{
  useStore, DMark, Wordmark, Ic, Btn, Field, Text, Area, Select, Seg, OptionCard,
  CFInput, SignaturePad, Avatar, useToast, Sheet
});
