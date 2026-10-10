'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal, coordinated by one observer for the whole page.
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
          if (entry.isIntersecting) entry.target.setAttribute('data-shown', '');
          else entry.target.removeAttribute('data-shown');
        }
      },
      // Reset only once the element leaves the viewport, in either scroll direction.
      { threshold: 0 },
    );

    for (const element of elements) observer.observe(element);

    return () => {
      observer.disconnect();
      root.classList.remove('js-reveal-ready');
      for (const element of elements) element.removeAttribute('data-shown');
    };
  }, []);

  return null;
}
