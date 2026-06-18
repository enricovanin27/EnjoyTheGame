/* brand.jsx — shared ENJOY THE GAME marks. Exports to window. */

/* The brand "D": right-half disc split into 4 colored wedges. */
function DMark({ size = 28, style = {} }) {
  return <div className="dmark" style={{ width: size, height: size, ...style }} />;
}

/* Compact horizontal lockup for footers: mark + wordmark. */
function Lockup({ color = 'currentColor', size = 22 }) {
  return (
    <div className="lockup">
      <DMark size={size} style={{ marginRight: 2 }} />
      <span className="lk-txt" style={{ color, fontSize: size * 0.64 }}>ENJOY THE GAME</span>
    </div>
  );
}

/* Stacked hero wordmark — ENJOY / THE / GAME, optional outline word. */
function WordmarkStack({ size = 64, color = 'currentColor', outlineWord = null, align = 'left' }) {
  const words = ['ENJOY', 'THE', 'GAME'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start' }}>
      {words.map((w) => {
        const outline = w === outlineWord;
        return (
          <span key={w} className="k-display" style={{
            fontSize: size, color: outline ? 'transparent' : color,
            WebkitTextStroke: outline ? `${Math.max(1.4, size * 0.022)}px ${color}` : undefined,
          }}>{w}</span>
        );
      })}
    </div>
  );
}

/* A row of the 4 brand colors as a thin rule / accent. */
function ColorRule({ height = 6, width = '100%', radius = 999 }) {
  const cols = ['var(--orange)', 'var(--red)', 'var(--sand)', 'var(--teal)'];
  return (
    <div style={{ display: 'flex', width, height, borderRadius: radius, overflow: 'hidden' }}>
      {cols.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
    </div>
  );
}

Object.assign(window, { DMark, Lockup, WordmarkStack, ColorRule });
