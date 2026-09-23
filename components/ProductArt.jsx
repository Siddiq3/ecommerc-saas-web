/**
 * Drawn product artwork.
 *
 * There are no product photographs to ship, and a grey box reads as an unfinished page.
 * Each category gets an SVG silhouette on a tuned gradient instead: it suggests a real
 * object, stays sharp at any density, adds nothing to the download, and cannot 404.
 *
 * Replace with photography the moment there is any. The shape of the component — a
 * `kind` and a fixed aspect box — is deliberately the same shape an <Image> would take.
 */

const PALETTES = {
  /**
   * Muted, slightly greyed tones rather than saturated ones. A hot pink or a vivid purple
   * reads as a placeholder; these read as an object photographed under studio light, and
   * they let the black type stay the loudest thing on the card.
   */
  watch: { from: '#57575a', to: '#1c1c1e', ink: '#ededef', glow: 'rgb(255 255 255 / 0.3)' },
  jewellery: { from: '#dcbb92', to: '#8b6d47', ink: '#fdf8f1', glow: 'rgb(255 255 255 / 0.42)' },
  cosmetics: { from: '#e8a0a0', to: '#a94f4f', ink: '#fff5f5', glow: 'rgb(255 255 255 / 0.4)' },
  apparel: { from: '#a3c7b3', to: '#527a66', ink: '#f4fbf7', glow: 'rgb(255 255 255 / 0.4)' },
  perfume: { from: '#c3a5c8', to: '#7d5a85', ink: '#faf5fb', glow: 'rgb(255 255 255 / 0.4)' },
  decor: { from: '#9bbdbb', to: '#4e716f', ink: '#f4fafa', glow: 'rgb(255 255 255 / 0.4)' },
};

/* Simple, generous silhouettes. At this size, detail turns to mud — shape is what reads. */
const SHAPES = {
  watch: (
    <>
      <rect x="40" y="14" width="20" height="24" rx="6" />
      <rect x="40" y="62" width="20" height="24" rx="6" />
      <circle cx="50" cy="50" r="19" fill="none" strokeWidth="4" />
      <path d="M50 40v10l7 5" fill="none" strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  jewellery: (
    <>
      <circle cx="50" cy="58" r="20" fill="none" strokeWidth="4.5" />
      <path d="M50 12l9 12-9 11-9-11z" />
      <path d="M41 24h18" fill="none" strokeWidth="3" />
    </>
  ),
  cosmetics: (
    <>
      <rect x="40" y="12" width="20" height="13" rx="3" />
      <path d="M36 30h28a6 6 0 0 1 6 6v44a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V36a6 6 0 0 1 6-6z" />
      <path d="M38 48h24" fill="none" strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />
    </>
  ),
  apparel: (
    <>
      {/* Kurta: shoulders, sleeves, body, and a neckline closed across the collar. */}
      <path d="M36 15l-21 12 8 17 9-4v48h36V40l9 4 8-17-21-12-9 8H45z" />
      <path d="M45 15c1 6 3 9 5 9s4-3 5-9" fill="none" strokeWidth="3" opacity="0.45" />
      <path d="M32 60h36" fill="none" strokeWidth="2.5" opacity="0.28" />
    </>
  ),
  perfume: (
    <>
      <rect x="43" y="10" width="14" height="12" rx="2" />
      <rect x="45" y="22" width="10" height="8" />
      <path d="M34 34h32a6 6 0 0 1 6 6v42a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8V40a6 6 0 0 1 6-6z" />
      <rect x="38" y="52" width="24" height="18" rx="3" opacity="0.4" />
    </>
  ),
  decor: (
    <>
      <path d="M38 14h24l-5 16c9 6 14 15 14 26 0 16-12 28-21 28s-21-12-21-28c0-11 5-20 14-26z" />
      <ellipse cx="50" cy="56" rx="11" ry="8" opacity="0.35" />
    </>
  ),
};

export function ProductArt({ kind = 'apparel', className = '' }) {
  const palette = PALETTES[kind] ?? PALETTES.apparel;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(150deg, ${palette.from} 0%, ${palette.to} 100%)` }}
    >
      {/* Studio light from the top-left, which is what stops a flat fill reading as flat. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(70% 55% at 22% 12%, ${palette.glow} 0%, transparent 65%)` }}
      />
      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full"
        fill={palette.ink}
        stroke={palette.ink}
        strokeWidth="0"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <g opacity="0.92" transform="translate(0,3) scale(0.92) translate(4,0)">
          {SHAPES[kind] ?? SHAPES.apparel}
        </g>
      </svg>
      {/* Contact shadow, so the object sits on the surface rather than floating on it. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ backgroundImage: 'linear-gradient(to top, rgb(0 0 0 / 0.24) 0%, transparent 100%)' }}
      />
    </div>
  );
}
