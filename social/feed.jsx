/* feed.jsx — square feed posts (600×600). Exports each to window. */

const ETG = {
  handle: '@enjoythegame3x3',
  dates: '25–26 LUGLIO 2026',
  place: 'Oratorio di Paese · Treviso'
};

/* small reusable footer */
function PostFoot({ light }) {
  return (
    <div className="post-foot">
      <span className="handle" style={{ opacity: light ? 0.85 : 0.7 }}>{ETG.handle}</span>
      <div style={{ width: 120 }}><ColorRule height={5} /></div>
    </div>);

}

function InfoRow({ k, v, light, accent }) {
  return (
    <div className="info-row" style={{ borderTopColor: light ? 'var(--line)' : 'rgba(255,255,255,.16)', margin: "0px" }}>
      <span className="ir-k" style={{ color: light ? 'var(--ink-3)' : undefined, opacity: light ? 1 : 0.65 }}>{k}</span>
      <span className="ir-v" style={{ color: accent || (light ? 'var(--ink)' : '#fff') }}>{v}</span>
    </div>);

}

/* ── POST 1 · SAVE THE DATE / INFO GENERALE ────────────────── */
function PostSaveDate() {
  return (
    <div className="post post--teal">
      <div className="post-deco" style={{ right: -150, top: -60 }}>
        <DMark size={420} style={{ opacity: 0.14 }} />
      </div>
      <div className="post-pad">
        <div className="post-top">
          <Lockup color="#fff" size={22} />
          <span className="k-chip k-chip--orange">4ª Edizione</span>
        </div>
        <div style={{ marginTop: 46 }}>
          <div className="k-eyebrow" style={{ fontSize: 14, color: 'var(--sand)' }}>Torneo 3vs3 · Basket</div>
          <div style={{ marginTop: 16 }}><WordmarkStack size={74} color="#fff" outlineWord="THE" /></div>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div className="k-display" style={{ fontSize: 58, color: 'var(--orange)' }}>25<span style={{ color: '#fff', margin: '0 6px' }}>–</span>26</div>
          <div className="k-display" style={{ fontSize: 26, color: '#fff', marginTop: 6, letterSpacing: '.02em' }}>LUGLIO 2026</div>
          <div className="k-body" style={{ fontSize: 17, color: 'rgba(255,255,255,.82)', marginTop: 14 }}>{ETG.place}</div>
        </div>
        <div style={{ height: 26 }} />
        <PostFoot light />
      </div>
    </div>);

}

/* ── POST 2 · ISCRIZIONI / LINEE GUIDA ─────────────────────── */
function PostIscrizioni() {
  const steps = [
  ['Apri il sito', 'Lo trovi nel link in bio. Lì si fa tutto.'],
  ['Crea la squadra', 'Bastano 3 giocatori (max 4 con la riserva).'],
  ['Gira il codice', 'Ricevi un codice: mandalo ai compagni di squadra.'],
  ['Firmate il modulo', 'Ognuno mette i suoi dati e firma. Finito.']];

  return (
    <div className="post post--paper">
      <div className="post-pad">
        <div className="post-top">
          <span className="k-chip k-chip--orange">Iscrizioni aperte</span>
          <Lockup color="var(--ink)" size={20} />
        </div>
        <h2 className="k-display" style={{ fontSize: 46, marginTop: 26 }}>Come ci si<br />iscrive</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 17, marginTop: 26 }}>
          {steps.map((s, i) =>
          <div className="step" key={i}>
              <div className="step-n">{i + 1}</div>
              <div>
                <p className="step-t">{s[0]}</p>
                <p className="step-s">{s[1]}</p>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 'auto' }} />
        <div className="k-body" style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 18, fontWeight: 700 }}>
          <span style={{ color: 'var(--red)' }}>Solo 16 squadre.</span> Quando è piena, è piena.
        </div>
        <PostFoot />
      </div>
    </div>);

}

/* ── shared day-template (giorno 1 / 2) ────────────────────── */
function DayPost({ index, accent, chip, title, rows, kicker }) {
  return (
    <div className="post post--paper">
      <div className="post-deco" style={{ right: 30, top: 34, fontFamily: 'var(--display)', fontWeight: 800, fontSize: 200, lineHeight: 1, color: accent, opacity: 0.1 }}>{index}</div>
      <div className="post-pad">
        <div className="post-top">
          <span className="k-chip" style={{ background: accent, color: '#fff' }}>{chip}</span>
          <Lockup color="var(--ink)" size={20} />
        </div>
        <div style={{ marginTop: 40 }}>
          <div className="k-display" style={{ fontSize: 120, color: accent, lineHeight: .8 }}>{index}</div>
          <h2 className="k-display" style={{ fontSize: 44, marginTop: 12 }}>{title}</h2>
        </div>
        <div style={{ marginTop: 22 }}>
          {rows.map((r, i) => <InfoRow key={i} k={r[0]} v={r[1]} light accent={r[2] ? accent : undefined} />)}
        </div>
        <div style={{ marginTop: 'auto' }} />
        {kicker && <div className="k-body" style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 700, marginBottom: 18 }}>{kicker}</div>}
        <PostFoot />
      </div>
    </div>);

}

function PostGiorno1() {
  return <DayPost index="01" accent="var(--orange)" chip="Giorno 1 · Sab 25 lug"
  title="Fase a gironi"
  rows={[['Si parte', 'ore 10:00'], ['Format', '16 squadre · 4 gironi'], ['Si gioca', 'a 21 punti', true]]}
  kicker="Tradotto: tutti giocano, nessuna scusa per restare a casa." />;
}
function PostGiorno2() {
  return <DayPost index="02" accent="var(--red)" chip="Giorno 2 · Dom 26 lug"
  title="Le finali"
  rows={[['Si decide', 'quarti · semi · finale'], ['Finalissima', 'ore 18:30', true], ['In palio', 'la coppa (e la gloria)']]}
  kicker="Domenica si separano i talenti dai TikTok." />;
}

/* ── POST 5 · COUNTDOWN ─────────────────────────────────────── */
function PostCountdown() {
  return (
    <div className="post post--teal">
      <div className="post-deco" style={{ left: -160, bottom: -140 }}><DMark size={380} style={{ opacity: 0.13, transform: 'rotate(180deg)' }} /></div>
      <div className="post-pad" style={{ alignItems: 'flex-start' }}>
        <div className="post-top" style={{ width: '100%' }}>
          <Lockup color="#fff" size={20} />
          <span className="k-chip k-chip--line" style={{ color: 'var(--sand)' }}>Countdown</span>
        </div>
        <div style={{ margin: 'auto 0' }}>
          <div className="k-eyebrow" style={{ fontSize: 14, color: 'var(--sand)' }}>Mancano</div>
          <div className="k-display tnum" style={{ fontSize: 220, lineHeight: .82, color: 'var(--orange)', marginTop: 4 }}>10</div>
          <div className="k-display" style={{ fontSize: 40, color: '#fff', marginTop: 2 }}>GIORNI</div>
          <div className="k-body" style={{ fontSize: 17, color: 'rgba(255,255,255,.82)', marginTop: 18, maxWidth: 380 }}>Beviti una birra 

          </div>
        </div>
        <PostFoot light />
      </div>
    </div>);

}

/* ── POST 6 · MAGLIA REVEAL (teaser) ───────────────────────── */
function PostMaglia() {
  return (
    <div className="post post--paper">
      <div className="post-pad">
        <div className="post-top">
          <span className="k-chip k-chip--solid-ink">Drop</span>
          <Lockup color="var(--ink)" size={20} />
        </div>
        <div style={{ margin: 'auto 0' }}>
          <div className="k-eyebrow" style={{ fontSize: 14, color: 'var(--orange-ink)' }}>In arrivo</div>
          <h2 className="k-display" style={{ fontSize: 56, marginTop: 14 }}>La maglia<br />ufficiale</h2>
          <p className="k-body" style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 18, maxWidth: 420 }}>
            Non la solita maglia da torneo. Una che ti metti <em>anche</em> il lunedì.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 26, alignItems: 'center' }}>
            {['var(--ink)', 'var(--sand-soft)', 'var(--teal)'].map((c, i) =>
            <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid rgba(0,0,0,.1)' }} />
            )}
            <span className="k-mono" style={{ fontSize: 13, color: 'var(--ink-3)', marginLeft: 6, fontWeight: 700, letterSpacing: '.08em' }}>3 COLORI · FRONTE/RETRO</span>
          </div>
        </div>
        <PostFoot />
      </div>
    </div>);

}

Object.assign(window, { PostSaveDate, PostIscrizioni, PostGiorno1, PostGiorno2, PostCountdown, PostMaglia, ETG });