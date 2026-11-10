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
    <div className="mx-auto mt-10 max-w-3xl divide-y divide-ink-900/20">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q} data-reveal style={{ '--reveal-delay': `${index * 50}ms` }}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-center gap-4 py-7 text-left"
              >
                <span className="flex-1 font-sans text-lg font-medium tracking-normal text-ink-900 sm:text-xl">{item.q}</span>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink-900">
                  <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  {!isOpen && <path d="M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
                </svg>
              </button>
            </h3>

            <div
              id={`faq-panel-${index}`}
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              {/* The inner element must be able to collapse to zero, hence overflow-hidden. */}
              <div className="overflow-hidden">
                <p className="pb-8 text-lg leading-relaxed text-ink-800">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
