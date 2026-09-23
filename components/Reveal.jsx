'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal, done once for the whole page.
 *
 * One observer for every `[data-reveal]` element beats a component per section: no extra
 * wrapper DOM, no per-element React state, and sections authored as plain server
 * components still animate.
 *
 * The hidden starting state lives behind `.js-reveal-ready` on <html>, which is added
 * here. If this component never runs — JavaScript disabled, a bundle that failed — the
 * class is absent and every element is simply visible. Content is never hidden by
 * default.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (elements.length === 0) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    root.classList.add('js-reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          // One-shot: re-animating on the way back up is distracting, not delightful.
          observer.unobserve(entry.target);
        }
      },
      // Fires a little before the element reaches the fold, so the motion has finished by
      // the time the reader's eye arrives.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    for (const element of elements) observer.observe(element);

    // Anything already on screen at load should not wait for a scroll that may never come.
    requestAnimationFrame(() => {
      for (const element of elements) {
        const box = element.getBoundingClientRect();
        if (box.top < window.innerHeight) {
          element.setAttribute('data-shown', '');
          observer.unobserve(element);
        }
      }
    });

    return () => {
      observer.disconnect();
      root.classList.remove('js-reveal-ready');
    };
  }, []);

  return null;
}
