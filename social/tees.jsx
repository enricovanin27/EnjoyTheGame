/* tees.jsx — t-shirt mockups: clean tee silhouette + 3 design directions. */

const TEE_PATH = "M130 26 C150 44 170 44 190 26 C200 30 210 34 218 39 L276 66 C283 70 286 77 283 86 L271 122 C269 130 262 132 254 129 L218 113 L226 316 C226 323 221 327 214 327 L106 327 C99 327 94 323 94 316 L102 113 L66 129 C58 132 51 130 48 122 L37 86 C34 77 37 70 44 66 L102 39 C110 34 120 30 130 26 Z";

/* clean short-sleeve tee with collar ribbing + soft shadow */
function Tee({ fabric, outline = 'rgba(0,0,0,.06)', collar, w = 340, children, printStyle }) {
  const h = w * 360 / 320;
  return (
    <div className="tee-svg-wrap" style={{ width: w, height: h }}>
      <svg viewBox="0 0 320 360" width={w} height={h} style={{ display: 'block', filter: 'drop-shadow(0 16px 26px rgba(0,0,0,.14))', overflow: 'visible' }}>
        <path d={TEE_PATH} fill={fabric} stroke={outline} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M130 26 C150 44 170 44 190 26" fill="none" stroke={collar} strokeWidth="6" strokeLinecap="round" opacity=".85" />
        <path d="M125 30 C150 52 170 52 195 30" fill="none" stroke={collar} strokeWidth="2" opacity=".45" />
      </svg>
      <div className="tee-print" style={printStyle}>{children}</div>
    </div>
  );
}

/* varsity-style text on an arc (y2k / jersey look) */
let arcSeq = 0;
function ArcText({ text, color, size = 22, width = 200, up = true, weight = 800, spacing = '.02em' }) {
  const id = 'arc' + (++arcSeq);
  const h = width * 0.42;
  const d = up
    ? `M14 ${h - 8} A ${width / 2 - 14} ${h - 14} 0 0 1 ${width - 14} ${h - 8}`
    : `M14 14 A ${width / 2 - 14} ${h - 14} 0 0 0 ${width - 14} 14`;
  return (
    <svg viewBox={`0 0 ${width} ${h}`} width={width} style={{ display: 'block', overflow: 'visible' }}>
      <path id={id} d={d} fill="none" />
      <text fill={color} style={{ fontFamily: 'var(--display)', fontWeight: weight, fontSize: size, letterSpacing: spacing }}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">{text}</textPath>
      </text>
    </svg>
  );
}

function TeeWrap({ cap, children }) {
  return <div className="tee-wrap"><div className="tee-svg-wrap-outer">{children}</div><span className="tee-cap">{cap}</span></div>;
}

function BoardHead({ dir, sub, swatch, color }) {
  return (
    <div className="tee-head">
      <div>
        <div className="tee-dir">{dir}</div>
        <div className="tee-sub">{sub}</div>
      </div>
      <div className="tee-swatch-row">
        <span className="tee-color-lbl">{color}</span>
        <span className="tee-swatch" style={{ background: swatch }} />
      </div>
    </div>
  );
}

/* areas (as % of tee box) */
const AREA_FULL = { left: '31%', top: '22%', width: '38%', height: '62%' };
const AREA_CHEST = { left: '38%', top: '25%', width: '24%', height: '15%' };
const AREA_NECK = { left: '35%', top: '17%', width: '30%', height: '9%' };

/* ════════ DIRECTION A · BOLD BACK PRINT — black ════════ */
function TeeBold() {
  const ink = '#16130E', collar = '#2c2820';
  return (
    <div className="tee-board">
      <BoardHead dir="A · Back hit" color="Nero" swatch={ink}
        sub="Logo piccolo sul petto, grafica grande sulla schiena. Streetwear: la indossi anche fuori dal campo." />
      <div className="tee-stage">
        <TeeWrap cap="Fronte">
          <Tee fabric={ink} collar={collar} outline="rgba(255,255,255,.06)" printStyle={AREA_CHEST}>
            <DMark size={28} />
            <span className="k-mono" style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.22em', marginTop: 7 }}>3VS3</span>
          </Tee>
        </TeeWrap>
        <TeeWrap cap="Retro">
          <Tee fabric={ink} collar={collar} outline="rgba(255,255,255,.06)" printStyle={AREA_FULL}>
            <div style={{ width: '92%', marginBottom: 10 }}><ColorRule height={5} /></div>
            <WordmarkStack size={30} color="#fff" outlineWord="THE" align="center" />
            <div style={{ width: '92%', marginTop: 10 }}><ColorRule height={5} /></div>
            <span className="k-mono" style={{ color: 'var(--sand)', fontSize: 9, fontWeight: 700, letterSpacing: '.26em', marginTop: 11 }}>PAESE — TV — 2026</span>
          </Tee>
        </TeeWrap>
      </div>
    </div>
  );
}

/* ════════ DIRECTION B · TYPOGRAPHIC — cream ════════ */
function TeeType() {
  const fab = '#F1E2CE', collar = '#e2cdb0';
  return (
    <div className="tee-board">
      <BoardHead dir="B · Solo testo" color="Panna" swatch={fab}
        sub="Gioca solo con le parole ENJOY THE GAME. Tono-su-tono, una parola in arancio. Minimal e portabile ovunque." />
      <div className="tee-stage">
        <TeeWrap cap="Fronte">
          <Tee fabric={fab} collar={collar} outline="rgba(0,0,0,.08)" printStyle={{ ...AREA_FULL, top: '24%', height: '58%' }}>
            <div className="k-display" style={{ fontSize: 34, lineHeight: .92, textAlign: 'center', color: 'var(--ink)' }}>
              ENJOY<br /><span style={{ color: 'var(--orange)' }}>THE</span><br />GAME
            </div>
            <span className="k-mono" style={{ color: 'var(--ink-3)', fontSize: 10, fontWeight: 700, letterSpacing: '.3em', marginTop: 14 }}>3 VS 3</span>
          </Tee>
        </TeeWrap>
        <TeeWrap cap="Retro">
          <Tee fabric={fab} collar={collar} outline="rgba(0,0,0,.08)" printStyle={AREA_NECK}>
            <span className="k-mono" style={{ color: 'var(--ink-2)', fontSize: 12, fontWeight: 700, letterSpacing: '.34em' }}>E · T · G</span>
            <span className="k-mono" style={{ color: 'var(--orange-ink)', fontSize: 10, fontWeight: 700, letterSpacing: '.22em', marginTop: 5 }}>PAESE '26</span>
          </Tee>
        </TeeWrap>
      </div>
    </div>
  );
}

/* ════════ DIRECTION C · Y2K / JERSEY — teal ════════ */
function TeeJersey() {
  const fab = '#0A4356', collar = '#073241';
  return (
    <div className="tee-board">
      <BoardHead dir="C · Stile jersey" color="Petrolio" swatch={fab}
        sub="Numero da maglia, testo ad arco varsity, accenti y2k. Sa di basket vero ma con un taglio retro-sport." />
      <div className="tee-stage">
        <TeeWrap cap="Fronte">
          <Tee fabric={fab} collar={collar} outline="rgba(255,255,255,.05)" printStyle={{ ...AREA_FULL, top: '24%' }}>
            <ArcText text="ENJOY · THE · GAME" color="var(--sand)" size={15} width={150} up />
            <div className="k-display tnum" style={{ fontSize: 76, lineHeight: .8, color: 'var(--orange)', WebkitTextStroke: '2px #fff', marginTop: -2 }}>03</div>
            <span className="k-mono" style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.28em', marginTop: 8 }}>PAESE</span>
          </Tee>
        </TeeWrap>
        <TeeWrap cap="Retro">
          <Tee fabric={fab} collar={collar} outline="rgba(255,255,255,.05)" printStyle={{ ...AREA_FULL, top: '20%' }}>
            <ArcText text="PLAYGROUND" color="#fff" size={13} width={150} up />
            <div className="k-display tnum" style={{ fontSize: 70, lineHeight: .8, color: 'var(--sand)', marginTop: 0 }}>26</div>
            <div style={{ width: '80%', marginTop: 8 }}><ColorRule height={5} /></div>
            <span className="k-mono" style={{ color: 'rgba(255,255,255,.7)', fontSize: 9, fontWeight: 700, letterSpacing: '.24em', marginTop: 9 }}>EST. 2026</span>
          </Tee>
        </TeeWrap>
      </div>
    </div>
  );
}

Object.assign(window, { TeeBold, TeeType, TeeJersey });
