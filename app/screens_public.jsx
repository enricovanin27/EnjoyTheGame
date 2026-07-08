/* ============ ENJOY THE GAME — public screens (Home, Regolamento) ============ */

function HeroD() {// big decorative D mark, half disc
  return <div className="dmark" style={{ width: 200, height: 200, position: 'absolute', right: -64, top: -34, opacity: .92, filter: 'drop-shadow(0 14px 30px rgba(25,21,15,.14))' }} aria-hidden="true"></div>;
}

function LiveBanner({ go }) {
  const lm = window.ETG.helpers.liveMatch();const live = window.ETG.Store.state.live;
  if (!lm) return null;
  return (
    <button onClick={() => go('live')} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
      <div className="card" style={{ borderColor: 'transparent', background: 'var(--red)', color: '#fff', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 22px rgba(220,73,55,.3)' }}>
        <span className="chip" style={{ background: 'rgba(255,255,255,.18)', color: '#fff', border: 0 }}><span className="dot pulse"></span>LIVE</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {window.ETG.teamName(lm.aId)} {lm.scoreA}–{lm.scoreB} {window.ETG.teamName(lm.bId)}
          </div>
          <div style={{ fontSize: 11.5, opacity: .85, fontFamily: 'var(--mono)' }}>Partita in corso · guarda il punteggio</div>
        </div>
        <Ic.fwd style={{ width: 20, height: 20 }} />
      </div>
    </button>);

}

function Home({ go }) {
  const store = useStore();const meta = store.state.meta;
  const localCount = store.state.registrations.filter((r) => r.type === 'team').length;
  const [cloudCount, setCloudCount] = useState(null);
  useEffect(() => {window.ETG.Store.teamCountAsync().then((n) => setCloudCount(n)).catch(() => {});}, []);
  const teamCount = cloudCount == null ? localCount : cloudCount;
  const MAX = window.ETG.MAX_TEAMS;const left = Math.max(0, MAX - teamCount);const full = teamCount >= MAX;
  return (
    <div className="fadein">
      {/* hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#fff, var(--paper))',
        borderBottom: '1px solid var(--line)' }}>
        <div className="screen" style={{ paddingTop: 30, paddingBottom: 28, position: 'relative' }}>
          <HeroD />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="chip chip-orange" style={{ marginBottom: 16 }}><Ic.ball style={{ width: 13, height: 13 }} /> 3 vs 3 · IV EDIZIONE</div>
            <h1 className="display" style={{ fontSize: 46, marginBottom: 6 }}>ENJOY<br /><span style={{ color: 'var(--orange)' }}>THE</span> GAME</h1>
            <p className="lead" style={{ maxWidth: 280, marginTop: 10 }}>Il torneo di basket 3 contro 3, quello a cui non puoi mancare.</p>

            <div className="stack g10" style={{ marginTop: 22 }}>
              <div className="row g10"><span className="iconbtn" style={{ pointerEvents: 'none' }}><Ic.cal style={{ width: 18, height: 18, color: 'var(--teal)' }} /></span><div><div style={{ fontWeight: 800, fontSize: 15 }}>{meta.dates}</div><div className="tiny">Sabato e Domenica</div></div></div>
              <div className="row g10"><span className="iconbtn" style={{ pointerEvents: 'none' }}><Ic.pin style={{ width: 18, height: 18, color: 'var(--red)' }} /></span><div><div style={{ fontWeight: 800, fontSize: 15 }}>Via Impianti Sportivi</div><div className="tiny">Paese (TV)</div></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="screen section">
        {/* iscrizioni */}
        <div>
          <div className="row between" style={{ marginBottom: 12, alignItems: 'flex-end' }}>
            <div className="eyebrow">{full ? 'Iscrizioni chiuse' : 'Iscrizioni aperte'}</div>
          </div>
          <div className="row between" style={{ marginBottom: 16, alignItems: 'center' }}>
            <span className="tiny" style={{ color: 'var(--ink-3)' }}>Quota: <b style={{ color: 'var(--ink)' }}>22€ a giocatore</b></span>
            <span className="tiny" style={{ color: 'var(--ink-3)' }}>pagamento via PayPal</span>
          </div>
          <div className="stack g12">
            {!full ?
            <button onClick={() => go('reg-team')} style={{ all: 'unset', cursor: 'pointer' }}>
                <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--orange)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 auto' }}><Ic.users style={{ width: 24, height: 24 }} /></span>
                  <div style={{ flex: 1 }}>
                    <div className="h3">Crea la tua squadra</div>
                    <div className="small" style={{ marginTop: 2 }}>Sei il capitano: registri la squadra e ricevi un codice da girare ai compagni.</div>
                  </div>
                  <Ic.fwd style={{ width: 20, height: 20, color: 'var(--ink-3)' }} />
                </div>
              </button> :

            <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: .7 }}>
                <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--ink-3)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 auto' }}><Ic.lock style={{ width: 22, height: 22 }} /></span>
                <div style={{ flex: 1 }}>
                  <div className="h3">Posti esauriti</div>
                  <div className="small" style={{ marginTop: 2 }}>Le 16 squadre previste dalla formula sono al completo.</div>
                </div>
              </div>
            }
            <button onClick={() => go('join')} style={{ all: 'unset', cursor: 'pointer' }}>
              <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--teal)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 auto' }}><Ic.key style={{ width: 22, height: 22 }} /></span>
                <div style={{ flex: 1 }}>
                  <div className="h3">Unisciti con un codice</div>
                  <div className="small" style={{ marginTop: 2 }}>Hai il codice del capitano? Aggiungi i tuoi dati alla rosa.</div>
                </div>
                <Ic.fwd style={{ width: 20, height: 20, color: 'var(--ink-3)' }} />
              </div>
            </button>
            <button onClick={() => go('reg-solo')} style={{ all: 'unset', cursor: 'pointer' }}>
              <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--ink)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 auto' }}><Ic.user style={{ width: 23, height: 23 }} /></span>
                <div style={{ flex: 1 }}>
                  <div className="h3">Non hai una squadra?</div>
                  <div className="small" style={{ marginTop: 2 }}>Iscriviti da solo: lo staff ti unisce ad altri singoli e forma una squadra.</div>
                </div>
                <Ic.fwd style={{ width: 20, height: 20, color: 'var(--ink-3)' }} />
              </div>
            </button>
          </div>
        </div>

        {/* live + regolamento */}
        <div className="grid2" style={{ marginTop: 14, gridTemplateColumns: '1fr 1fr' }}>
          <button onClick={() => go('live')} style={{ all: 'unset', cursor: 'pointer' }}>
            <div className="card card-pad" style={{ height: '100%' }}>
              <Ic.bracket style={{ width: 22, height: 22, color: 'var(--red)' }} />
              <div className="h3" style={{ marginTop: 10 }}>Risultati & tabellone</div>
              <div className="small" style={{ marginTop: 2 }}>Calendario, gironi e tabellone aggiornati dallo staff.</div>
            </div>
          </button>
          <button onClick={() => go('regolamento')} style={{ all: 'unset', cursor: 'pointer' }}>
            <div className="card card-pad" style={{ height: '100%' }}>
              <Ic.whistle style={{ width: 22, height: 22, color: 'var(--teal)' }} />
              <div className="h3" style={{ marginTop: 10 }}>Formula e regole</div>
              <div className="small" style={{ marginTop: 2 }}>Gironi, tempi di gioco e regolamento.</div>
            </div>
          </button>
        </div>

        {/* format snapshot */}
        <div className="card card-pad" style={{ marginTop: 14, background: 'var(--teal)', color: '#fff', border: 0 }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.6)' }}>La formula in breve</div>
          <div className="row g16" style={{ marginTop: 14, justifyContent: 'space-between', textAlign: 'center' }}>
            {[['16', 'squadre'], ['4', 'gironi'], ['2', 'giornate'], ['21', 'punti']].map((s, i) =>
            <div key={i}><div className="display" style={{ fontSize: 34, color: i === 3 ? 'var(--orange)' : '#fff' }}>{s[0]}</div><div className="tiny" style={{ color: 'rgba(255,255,255,.7)' }}>{s[1]}</div></div>
            )}
          </div>
          <button onClick={() => go('regolamento')} className="btn btn-soft btn-sm" style={{ marginTop: 16 }}>Leggi il regolamento <Ic.fwd style={{ width: 15, height: 15 }} /></button>
        </div>

        <div className="tiny" style={{ textAlign: 'center', marginTop: 26, opacity: .7 }}>
          Organizzato dallo staff EnjoyTheGame · Oratorio di Paese · Circolo NOI VT093 APS
        </div>
      </div>
    </div>);

}

/* ---------------- Regolamento ---------------- */
function RuleBlock({ n, title, children }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ flex: '0 0 auto' }}><span className="display" style={{ fontSize: 20, color: 'var(--orange)', fontFamily: 'var(--mono)', fontWeight: 700 }}>{n}</span></div>
      <div style={{ flex: 1 }}>
        <div className="h3" style={{ marginBottom: 5 }}>{title}</div>
        <div className="small" style={{ lineHeight: 1.55 }}>{children}</div>
      </div>
    </div>);

}
function Regolamento({ go }) {
  return (
    <div className="fadein">
      <div className="screen section">
        <div className="eyebrow">Regolamento · IV edizione</div>
        <h1 className="h1" style={{ marginTop: 8 }}>Formula e svolgimento</h1>

        {/* timeline 2 giornate */}
        <div className="stack g12" style={{ marginTop: 22 }}>
          <div className="card card-pad" style={{ borderLeft: '4px solid var(--orange)' }}>
            <div className="row between"><span className="chip chip-orange">Giornata 1 · Sab 25</span></div>
            <div className="small" style={{ marginTop: 10, lineHeight: 1.55 }}>
              <b>4 gironi da 4 squadre.</b> Le <b>prime classificate</b> di ogni girone passano <b>direttamente ai quarti di finale</b>.
            </div>
          </div>
          <div className="card card-pad" style={{ borderLeft: '4px solid var(--teal)' }}>
            <div className="row between"><span className="chip chip-teal">Giornata 2 · Dom 26</span></div>
            <div className="small" style={{ marginTop: 10, lineHeight: 1.55 }}>
              Le squadre non qualificate formano <b>4 nuovi mini gironi</b>. Le <b>prime</b> di questi gironi si qualificano per la fase a <b>eliminazione diretta</b>.
            </div>
          </div>
        </div>

        <div className="hr-soft"></div>

        {/* regole partita */}
        <div className="eyebrow" style={{ marginBottom: 16 }}>Regole di gioco</div>
        <div className="stack g18" style={{ gap: 18 }}>
          <RuleBlock n="01" title="Durata della partita">
            Un <b>tempo unico da 10 minuti</b>. Nella fase a eliminazione diretta il tempo di gioco sale a <b>15 minuti</b>.
          </RuleBlock>
          <RuleBlock n="02" title="Cronometro e time-out">
            Il cronometro viene fermato solo durante i <b>time-out</b>: uno per squadra.
          </RuleBlock>
          <RuleBlock n="03" title="Come si vince">
            Vince la prima squadra che arriva a <b>21 punti</b>, oppure chi ha il <b>punteggio maggiore</b> allo scadere del tempo.
          </RuleBlock>
          <RuleBlock n="04" title="Regolamento FIBA">
            Per tutto ciò che non è contemplato nel presente regolamento valgono le <b>norme del regolamento FIBA</b>.
          </RuleBlock>
        </div>

        <div className="card card-pad" style={{ marginTop: 24, borderLeft: '4px solid var(--orange)' }}>
          <div className="row between" style={{ alignItems: 'baseline' }}>
            <div className="h3">Quota d'iscrizione</div>
            <span className="display" style={{ fontSize: 26, color: 'var(--orange)' }}>22€</span>
          </div>
          <div className="small" style={{ marginTop: 6, lineHeight: 1.55 }}>
            <b>22€ a giocatore.</b> Dopo aver compilato e firmato il modulo, lo staff ti invia il <b>link PayPal</b> per il pagamento. L'iscrizione è valida <b>solo dopo aver effettuato il pagamento e le firme</b>.
          </div>
        </div>

        <div className="notice" style={{ marginTop: 14 }}>
          All'atto dell'iscrizione le squadre dichiarano di accettare incondizionatamente il presente regolamento.
        </div>

        <div className="stack g10" style={{ marginTop: 24 }}>
          <Btn variant="primary" size="lg" block onClick={() => go('reg-team')}><Ic.users style={{ width: 18, height: 18 }} /> Iscrivi la tua squadra</Btn>
          <Btn variant="ghost" block onClick={() => go('home')}>Torna alla home</Btn>
        </div>
      </div>
    </div>);

}

Object.assign(window, { Home, Regolamento });