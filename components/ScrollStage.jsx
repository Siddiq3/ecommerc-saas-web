'use client';

import { useEffect, useRef } from 'react';

/**
 * A tall section with a sticky stage. Publishes scroll progress through it (0 → 1) as the
 * CSS variable `--p`, and every animation inside is plain CSS computed from that number.
 */
export function ScrollStage({ className = '', style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={ref} className={`relative ${className}`} style={{ '--p': 0, ...style }} {...rest}>
      <div className="sticky top-0 h-dvh overflow-hidden">{children}</div>
    </section>
  );
}
