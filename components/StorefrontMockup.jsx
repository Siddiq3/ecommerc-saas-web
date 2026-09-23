import { PriceText } from './PriceText.jsx';

/**
 * The hero visual: a merchant's live storefront, with the order landing on their phone.
 *
 * Drawn rather than photographed. There are no product photographs to ship yet, and a
 * grey placeholder box reads as an unfinished page — so each product is a layered gradient
 * that suggests fabric or metal without pretending to be a real garment. It costs nothing
 * to download, it is sharp at any density, and it never 404s.
 *
 * Swap this for real screenshots the moment there are stores worth showing.
 */

const PRODUCTS = [
  {
    name: 'Cotton Anarkali Kurti',
    price: 129900,
    mrp: 179900,
    tag: 'Bestseller',
    // Warm terracotta, the way a cotton print photographs in daylight.
    art: 'radial-gradient(120% 90% at 20% 15%, #f6e3cd 0%, transparent 60%), linear-gradient(150deg, #dcbb92 0%, #b08a5e 55%, #8b6d47 100%)',
  },
  {
    name: 'Silk Blend Saree',
    price: 249900,
    mrp: 329900,
    tag: null,
    // Deep emerald with a sheen line, which is what reads as silk.
    art: 'linear-gradient(255deg, rgb(255 255 255 / 0.28) 0%, transparent 38%), linear-gradient(145deg, #a3c7b3 0%, #6b9a82 55%, #40604f 100%)',
  },
  {
    name: 'Oxidised Jhumka Set',
    price: 44900,
    mrp: 69900,
    tag: 'Low stock',
    // Cool metal: a bright highlight against slate.
    art: 'radial-gradient(90% 70% at 70% 20%, #f4f4f5 0%, transparent 55%), linear-gradient(160deg, #c8c8cb 0%, #78787c 60%, #3a3a3e 100%)',
  },
];

const Swatch = ({ art }) => (
  <div className="relative aspect-square overflow-hidden rounded-lg" style={{ backgroundImage: art }}>
    {/* A soft vignette, so a flat gradient reads as a photographed object. */}
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ backgroundImage: 'radial-gradient(100% 80% at 50% 0%, transparent 40%, rgb(12 10 9 / 0.22) 100%)' }}
    />
  </div>
);

export function StorefrontMockup() {
  return (
    // pt/pb leave room for the chips that hang past the card's corners.
  <div className="relative mx-auto max-w-4xl px-1 pb-10 pt-8">
      {/* ── The storefront, in a browser ── */}
      <div
        className="float-soft overflow-hidden rounded-xl border border-line bg-surface"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 flex items-center gap-1.5 rounded-md bg-surface px-3 py-1 text-xs text-ink-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            storekit.site/asha-boutique
          </span>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#527a66] text-sm font-bold text-white">
                AB
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-ink-900">Asha Boutique</span>
                <span className="block text-xs text-ink-500">Hyderabad · Free delivery over ₹999</span>
              </span>
            </div>
            <span className="hidden gap-2 sm:flex">
              {['New in', 'Sarees', 'Kurtis'].map((label) => (
                <span key={label} className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-ink-600">
                  {label}
                </span>
              ))}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
            {PRODUCTS.map((item) => (
              <div key={item.name}>
                <div className="relative">
                  <Swatch art={item.art} />
                  {item.tag && (
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.tag === 'Low stock' ? 'bg-[#f3e4d0] text-[#7a5a30]' : 'bg-white/92 text-ink-800'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 truncate text-xs font-medium text-ink-900 sm:text-sm">{item.name}</p>
                <p className="mt-0.5 flex items-baseline gap-1.5 text-xs sm:text-sm">
                  <span className="font-semibold text-ink-900">
                    <PriceText paise={item.price} />
                  </span>
                  <span className="text-ink-400 line-through">
                    <PriceText paise={item.mrp} />
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating proof that the order reaches the merchant ── */}
      <div className="float-soft-delayed glass absolute -bottom-1 -left-4 hidden w-60 rounded-lg p-3.5 sm:block lg:-left-12">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink-900">New order · ₹1,299</span>
            <span className="block text-xs text-ink-500">Priya M. · Cotton Anarkali · UPI</span>
          </span>
        </div>
      </div>

      <div className="float-soft glass absolute -right-4 top-0 hidden rounded-lg px-4 py-3 sm:block lg:-right-12">
        <span className="block text-xs font-medium text-ink-500">Today</span>
        <span className="block font-display text-2xl font-bold text-ink-900">₹18,420</span>
        <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-accent-700">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 16l6-6 4 4 6-8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          24% vs yesterday
        </span>
      </div>
    </div>
  );
}
