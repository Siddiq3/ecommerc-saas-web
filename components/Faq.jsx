'use client';

import { useState } from 'react';

/**
 * An accordion.
 *
 * Height is animated with CSS grid rows rather than max-height: a guessed max-height
 * either clips a long answer or leaves the transition idling through empty space, while
 * `grid-template-rows: 0fr → 1fr` animates to the content's real height.
 *
 * One panel open at a time, so the page does not reflow under the reader as they scan.
 */
export function Faq({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto mt-12 grid max-w-3xl gap-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.q}
            data-reveal
            style={{ '--reveal-delay': `${index * 50}ms` }}
            className={`overflow-hidden rounded-lg border bg-canvas transition-colors duration-200 ${
              isOpen ? 'border-accent-200 bg-accent-50/40' : 'border-line'
            }`}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-center gap-4 p-6 text-left"
              >
                <span className="flex-1 font-display text-base font-bold text-ink-900">{item.q}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen ? 'rotate-45 bg-accent-600 text-white' : 'bg-surface text-ink-500'
                  }`}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={`faq-panel-${index}`}
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              {/* The inner element must be able to collapse to zero, hence overflow-hidden. */}
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-ink-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
