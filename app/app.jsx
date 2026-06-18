/* ============ ENJOY THE GAME — app shell & router ============ */

function TopBar({route,go}){
  const onStaff=route==='staff';
  return (
    <div className="topbar">
      <div className="topbar-in">
        <button onClick={()=>go('home')} style={{all:'unset',cursor:'pointer'}}><Wordmark size={15}/></button>
        {!onStaff
          ? <button onClick={()=>go('staff')} className="chip" style={{cursor:'pointer'}}><Ic.staff style={{width:13,height:13}}/> Staff</button>
          : <button onClick={()=>go('home')} className="chip"><Ic.home style={{width:13,height:13}}/> Sito</button>}
      </div>
    </div>
  );
}

function App(){
  const parseHash=()=>{ const h=(location.hash||'').replace(/^#\/?/,''); return h||'home'; };
  const [route,setRoute]=useState(parseHash());
  const [subLive,setSubLive]=useState('calendario');
  const [subStaff,setSubStaff]=useState('regs');
  const [nav,setNav]=useState(null); // payload opzionale passato fra schermate (es. preset join)

  useEffect(()=>{ const f=()=>setRoute(parseHash()); window.addEventListener('hashchange',f); return ()=>window.removeEventListener('hashchange',f); },[]);
  const go=(r,payload)=>{ setNav(payload||null); location.hash='/'+r; setRoute(r); window.scrollTo({top:0}); };

  let screen;
  switch(route){
    case 'regolamento': screen=<Regolamento go={go}/>; break;
    case 'reg-team': screen=<RegTeam go={go}/>; break;
    case 'reg-solo': screen=<RegSolo go={go}/>; break;
    case 'join': screen=<RegJoin go={go} preset={nav}/>; break;
    case 'live': screen=<LiveArea go={go} sub={subLive} setSub={setSubLive}/>; break;
    case 'staff': screen=<StaffArea go={go} sub={subStaff} setSub={setSubStaff}/>; break;
    default: screen=<Home go={go}/>;
  }

  return (
    <div className="app-root">
      <TopBar route={route} go={go}/>
      <div style={{flex:1}}>{screen}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
