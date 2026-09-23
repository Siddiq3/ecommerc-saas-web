'use client';

import { useEffect, useRef, useState } from 'react';
import { ProductArt } from './ProductArt.jsx';
import { PriceText } from './PriceText.jsx';

/**
 * Example storefronts, as a drifting rail.
 *
 * Shows what a merchant's shop actually looks like across categories — the single most
 * persuasive thing on the page, because it answers "what will mine look like" before
 * anyone has to read a feature list.
 *
 * The rail animates on a rAF loop rather than a CSS keyframe because it has to be
 * interruptible: it pauses on hover and while the pointer is dragging, and it resumes
 * from wherever it was left. Position is tracked in a ref so scrolling never triggers a
 * React render.
 */

const STORES = [
  { kind: 'apparel', emoji: '👗', store: 'Asha Boutique', item: 'Cotton Anarkali', price: 129900, city: 'Hyderabad' },
  { kind: 'jewellery', emoji: '💍', store: 'Meena Jewels', item: 'Oxidised Jhumkas', price: 44900, city: 'Jaipur' },
  { kind: 'cosmetics', emoji: '💄', store: 'Glow Bar', item: 'Vitamin C Serum', price: 89900, city: 'Mumbai' },
  { kind: 'watch', emoji: '⌚', store: 'Tick & Co.', item: 'Minimal Steel 40mm', price: 349900, city: 'Bengaluru' },
  { kind: 'perfume', emoji: '🧴', store: 'Attar House', item: 'Oud Rose 50ml', price: 189900, city: 'Lucknow' },
  { kind: 'decor', emoji: '🏺', store: 'Clay & Co.', item: 'Terracotta Vase', price: 74900, city: 'Puducherry' },
];

const SPEED_PX_PER_SECOND = 28;

const StoreCard = ({ store }) => (
  <article className="w-[260px] shrink-0 overflow-hidden rounded-xl border border-line bg-surface shadow-card sm:w-[290px]">
    <div className="relative">
      <ProductArt kind={store.kind} className="aspect-[4/3] w-full" />
      <span className="glass absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink-800">
        <span aria-hidden="true">{store.emoji}</span>
        {store.city}
      </span>
    </div>

    <div className="p-4">
      <p className="font-display text-sm font-bold text-ink-900">{store.store}</p>
      <p className="mt-0.5 truncate text-sm text-ink-600">{store.item}</p>
      <p className="mt-2.5 flex items-center justify-between">
        <span className="font-display text-base font-bold text-ink-900">
          <PriceText paise={store.price} />
        </span>
        <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-white">
          In stock
        </span>
      </p>
    </div>
  </article>
);

export function StoreCarousel() {
  const viewport = useRef(null);
  const offset = useRef(0);
  const paused = useRef(false);
  const drag = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      return undefined;
    }

    // One copy's width. The list is rendered twice, so wrapping at half the scroll width
    // puts an identical card in the same place and the seam is invisible.
    const loopWidth = () => el.scrollWidth / 2;

    let frame;
    let last = performance.now();

    const tick = (now) => {
      const elapsed = now - last;
      last = now;

      if (!paused.current && drag.current === null) {
        offset.current += (SPEED_PX_PER_SECOND * elapsed) / 1000;
        const width = loopWidth();
        if (width > 0 && offset.current >= width) offset.current -= width;
        el.scrollLeft = offset.current;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    setReady(true);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Pointer drag, so the rail is steerable and not just decoration. */
  const onPointerDown = (event) => {
    const el = viewport.current;
    if (!el) return;
    drag.current = { x: event.clientX, scroll: el.scrollLeft };
    el.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const el = viewport.current;
    if (!el || drag.current === null) return;
    el.scrollLeft = drag.current.scroll - (event.clientX - drag.current.x);
    // Hand the drifting animation the user's position, or it snaps back on release.
    offset.current = el.scrollLeft;
  };

  const endDrag = (event) => {
    const el = viewport.current;
    drag.current = null;
    el?.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* Fades the rail into the page rather than cutting it at the viewport edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-canvas via-canvas/85 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-canvas via-canvas/85 to-transparent sm:w-40" />

      <div
        ref={viewport}
        className={`flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]{display:none} ${
          ready ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500`}
        style={{ scrollbarWidth: 'none', cursor: 'grab', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-label="Example stores built with StoreKit"
      >
        {STORES.map((store) => (
          <StoreCard key={store.store} store={store} />
        ))}
        {/* The duplicate exists only to make the loop seamless. */}
        {STORES.map((store) => (
          <StoreCard key={`${store.store}-loop`} store={store} />
        ))}
      </div>
    </div>
  );
}
