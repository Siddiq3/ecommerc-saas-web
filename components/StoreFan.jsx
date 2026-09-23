import { ProductArt } from './ProductArt.jsx';

/**
 * The hero's fan of example storefronts.
 *
 * A shallow arc of tilted, overlapping store cards, each tagged with a coloured speech
 * bubble naming its category. It does the persuading before a word of copy is read: a
 * merchant sees a shop that looks like theirs and understands the product immediately.
 *
 * Every card is drawn — layout, gradient "photography", overlaid headline — rather than
 * screenshotted, because there are no real stores to screenshot yet and a grey rectangle
 * would undo the whole effect. The shape of each card matches a real storefront, so these
 * can be swapped for screenshots one at a time without touching the fan itself.
 */

const STORES = [
  {
    kind: 'watch', label: 'Watch Store', emoji: '⌚', bubble: '#b08b5e',
    headline: 'The kind of bold that grabs everyone', cta: 'Shop Now',
    nav: ['Home', 'New in', 'Straps'], tone: 'dark',
  },
  {
    kind: 'jewellery', label: 'Jewellery', emoji: '💍', bubble: '#82b098',
    headline: 'Everyday gold, made to last', cta: 'Explore',
    nav: ['Rings', 'Jhumkas', 'Chains'], tone: 'light',
  },
  {
    kind: 'cosmetics', label: 'Cosmetics', emoji: '💄', bubble: '#a982b0',
    headline: 'A headline so good they cannot help but click', cta: 'Shop Now',
    nav: ['Skin', 'Serums', 'Sets'], tone: 'dark',
  },
  {
    kind: 'apparel', label: "Men's Wear", emoji: '👕', bubble: '#3a62e6',
    headline: 'Built for the everyday', cta: 'Buy now',
    nav: ['Shirts', 'Jackets', 'Sale'], tone: 'light',
  },
  {
    kind: 'perfume', label: 'Perfume Store', emoji: '✨', bubble: '#db7373',
    headline: 'Beyond the basics', cta: 'Discover',
    nav: ['Oud', 'Floral', 'Gifting'], tone: 'dark',
  },
  {
    kind: 'decor', label: 'Home Decor', emoji: '🏠', bubble: '#729d9b',
    headline: 'The collection', cta: 'Shop Now',
    nav: ['Vases', 'Baskets', 'Lamps'], tone: 'light',
  },
];

/**
 * The arc. Outer cards sit lower and lean harder, which is what makes the row read as a
 * curve rather than a stack. Angles are hand-set rather than computed — a formula gives an
 * even fan, and an even fan looks mechanical.
 */
const ARC = [
  { rotate: -11, y: 58, z: 1 },
  { rotate: -7, y: 30, z: 2 },
  { rotate: -3, y: 8, z: 3 },
  { rotate: 1.5, y: 0, z: 4 },
  { rotate: 6, y: 14, z: 5 },
  { rotate: 10.5, y: 44, z: 6 },
];

const StoreCard = ({ store }) => (
  <div className="overflow-hidden rounded-xl bg-surface" style={{ boxShadow: 'var(--shadow-float)' }}>
    {/* Search bar, the one piece of chrome every storefront shows. */}
    <div className="flex items-center gap-2 px-3 pt-3">
      <div className="flex h-5 flex-1 items-center gap-1.5 rounded-full bg-canvas px-2">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" className="text-ink-400" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="3" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="text-[6px] text-ink-400">Search products</span>
      </div>
      <span className="h-2 w-2 rounded-full bg-ink-200" />
    </div>

    <div className="flex items-center gap-3 px-3 py-2">
      {store.nav.map((item) => (
        <span key={item} className="text-[6px] font-medium text-ink-600">{item}</span>
      ))}
    </div>

    {/* The full-bleed campaign image, with the headline a real store would overlay. */}
    <div className="relative">
      <ProductArt kind={store.kind} className="aspect-[4/3] w-full" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p
          className={`font-display text-[11px] font-bold leading-tight ${
            store.tone === 'dark' ? 'text-white' : 'text-white'
          }`}
          style={{ textShadow: '0 1px 6px rgb(0 0 0 / 0.45)' }}
        >
          {store.headline}
        </p>
        <span className="mt-1.5 inline-block rounded-full bg-white px-2 py-[3px] text-[6px] font-bold text-ink-900">
          {store.cta}
        </span>
      </div>
    </div>
  </div>
);

const Bubble = ({ store }) => (
  <span
    className="relative inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-card"
    style={{ backgroundColor: store.bubble }}
  >
    {store.label}
    <span aria-hidden="true">{store.emoji}</span>
    {/* The tail, drawn as a rotated square tucked under the bubble's bottom-left. */}
    <span
      aria-hidden="true"
      className="absolute -bottom-1 left-3 h-2.5 w-2.5 rotate-45 rounded-[2px]"
      style={{ backgroundColor: store.bubble }}
    />
  </span>
);

export function StoreFan() {
  return (
    <div className="fan relative w-full overflow-hidden pb-28 pt-14" aria-label="Example storefronts across categories">
      {/*
        Fixed card widths with a negative overlap, rather than percentage flex.
        The row comes out wider than the viewport on purpose and bleeds off both edges,
        which is what sells it as a shelf that carries on rather than six cards that
        happen to fit.
      */}
      <div className="relative left-1/2 flex w-max -translate-x-1/2 pl-[52px] sm:pl-[64px]">
        {STORES.map((store, index) => {
          const arc = ARC[index];
          return (
            <div
              key={store.label}
              className="fan-card relative -ml-[52px] w-[188px] shrink-0 sm:-ml-[64px] sm:w-[248px] lg:w-[292px]"
              style={{
                zIndex: arc.z,
                '--fan-rotate': `${arc.rotate}deg`,
                '--fan-y': `${arc.y}px`,
                '--fan-delay': `${index * 90}ms`,
              }}
            >
              <span
                className="fan-bubble absolute -top-4 left-[6%] z-10"
                style={{ '--fan-delay': `${index * 90 + 260}ms` }}
              >
                <Bubble store={store} />
              </span>
              <StoreCard store={store} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
