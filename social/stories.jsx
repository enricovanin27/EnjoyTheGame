/* stories.jsx — vertical 9:16 stories (600×1067), playful tone. */

function StoryChrome({ light }) {
  return (
    <React.Fragment>
      <div className="ig-bar" />
      <div className="ig-top">
        <div className="ig-av"><DMark size={22} /></div>
        <div className="ig-handle">enjoythegame3x3 <span className="t">2h</span></div>
        <div className="ig-x" style={{ color: light ? 'var(--ink)' : '#fff' }}>×</div>
      </div>
    </React.Fragment>
  );
}

/* ── STORY 1 · SONDAGGIO (poll sticker) ────────────────────── */
function StorySondaggio() {
  return (
    <div className="story story--teal">
      <div className="post-deco" style={{ right: -120, top: 120 }}><DMark size={300} style={{ opacity: 0.12 }} /></div>
      <StoryChrome />
      <div className="story-pad" style={{ justifyContent: 'center', gap: 30 }}>
        <div>
          <div className="k-eyebrow" style={{ fontSize: 14, color: 'var(--sand)' }}>Sondaggio del giorno</div>
          <h2 className="k-display" style={{ fontSize: 50, color: '#fff', marginTop: 14 }}>Quest'anno la coppa la alzi tu?</h2>
        </div>
        <div className="sticker poll" style={{ transform: 'rotate(-2deg)' }}>
          <div className="poll-q">Sii onesto.</div>
          <div className="poll-opts" style={{ borderTop: '2px solid #ECE6DC' }}>
            <div className="poll-opt" style={{ color: 'var(--orange-ink)' }}>Ovvio.</div>
            <div className="poll-opt" style={{ color: 'var(--ink-3)' }}>Vengo a guardare.</div>
          </div>
        </div>
        <div className="k-body" style={{ fontSize: 16, color: 'rgba(255,255,255,.8)', textAlign: 'center' }}>
          Rispondi qui sopra. Niente di personale.
        </div>
      </div>
    </div>
  );
}

/* ── STORY 2 · COUNTDOWN (countdown sticker) ──────────────── */
function StoryCountdown() {
  return (
    <div className="story story--orange">
      <div className="post-deco" style={{ left: -130, bottom: 80 }}><DMark size={320} style={{ opacity: 0.16 }} /></div>
      <StoryChrome />
      <div className="story-pad" style={{ justifyContent: 'center', gap: 34, alignItems: 'center' }}>
        <WordmarkStack size={56} color="#fff" outlineWord="THE" align="center" />
        <div className="sticker countdown-st" style={{ transform: 'rotate(2deg)' }}>
          <div className="countdown-lbl">25 Luglio 2026</div>
          <div className="countdown-num">10 : 04 : 11</div>
          <div className="countdown-lbl" style={{ marginTop: 2 }}>giorni · ore · min</div>
        </div>
        <div className="k-body" style={{ fontSize: 19, color: '#fff', fontWeight: 700, textAlign: 'center', maxWidth: 380 }}>
          Segna la data, o piangi dopo.
        </div>
      </div>
    </div>
  );
}

/* ── STORY 3 · POV MEME ────────────────────────────────────── */
function StoryPov() {
  return (
    <div className="story story--teal">
      <StoryChrome />
      <div className="story-pad" style={{ justifyContent: 'center' }}>
        <div className="k-mono" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '.14em', color: 'var(--orange)', textTransform: 'uppercase' }}>POV</div>
        <h2 className="k-display" style={{ fontSize: 58, color: '#fff', marginTop: 22 }}>
          Hai detto<br /><span style={{ color: 'var(--sand)' }}>“gioco solo<br />in difesa”</span><br />e sei già<br />senza fiato.
        </h2>
        <div style={{ marginTop: 30, width: 160 }}><ColorRule height={8} /></div>
        <div className="k-body" style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', marginTop: 24 }}>
          Iscrizioni aperte. Allenati. Forse.
        </div>
      </div>
    </div>
  );
}

/* ── STORY 4 · TAGGA LA SQUADRA (mention sticker) ──────────── */
function StoryTag() {
  return (
    <div className="story story--paper on-light">
      <div className="post-deco" style={{ right: -110, bottom: 140 }}><DMark size={260} style={{ opacity: 0.5 }} /></div>
      <StoryChrome light />
      <div className="story-pad" style={{ justifyContent: 'center', gap: 26 }}>
        <div>
          <div className="k-eyebrow" style={{ fontSize: 14, color: 'var(--orange-ink)' }}>Formazione</div>
          <h2 className="k-display" style={{ fontSize: 52, color: 'var(--ink)', marginTop: 14 }}>Tagga i 2 che<br />porteresti<br />sul campo.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <div className="mention" style={{ transform: 'rotate(-2deg)' }}>@ il_tuo_play</div>
          <div className="mention" style={{ transform: 'rotate(1.5deg)', marginLeft: 40 }}>@ il_tuo_pivot</div>
        </div>
        <div className="k-body" style={{ fontSize: 17, color: 'var(--ink-2)', marginTop: 6, fontWeight: 700 }}>
          La riserva la scegli dopo. Forse.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StorySondaggio, StoryCountdown, StoryPov, StoryTag });
