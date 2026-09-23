'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A number that counts up the first time it is scrolled into view.
 *
 * The final value is what renders on the server and what the component holds until an
 * animation is actually about to start. That ordering matters: these figures carry
 * meaning ("3 days free"), so a counter stuck at its starting value would not be a
 * missing flourish, it would be false copy. There is no state in which this shows 0
 * unless it is mid-count.
 *
 * Eased rather than linear — a linear count reads as a loading spinner, an eased one
 * reads as a result landing.
 */
export function Counter({ to, duration = 1400, prefix = '', suffix = '', className = '' }) {
  const [value, setValue] = useState(to);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const animate = () => {
      if (started.current) return;
      started.current = true;

      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo: quick off the mark, settling gently on the final figure.
        const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
        setValue(Math.round(eased * to));
        if (progress < 1) requestAnimationFrame(step);
        else setValue(to);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            animate();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
