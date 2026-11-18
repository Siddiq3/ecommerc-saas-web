'use client';

import { useEffect, useState } from 'react';
import { INTRO_SEEN_KEY as SEEN_KEY } from '../lib/intro.js';

/**
 * The opening brand animation: the bag mark pops in, a sheen runs across the bolt, the star
 * sparkles, then STOREFLICK and the tagline reveal before the whole curtain lifts off the page.
 *
 * Plays once per browser session. A tap, click or key press skips it, and reduced-motion users
 * get a short static logo instead of the motion. The overlay is server-rendered, so it covers
 * the page from the very first paint instead of popping in after hydration.
 */
export function IntroSplash() {
  const [phase, setPhase] = useState('play'); // play → leave → gone

  useEffect(() => {
    if (document.documentElement.classList.contains('sf-intro-skip')) {
      setPhase('gone');
      return undefined;
    }
    try { window.sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode: just play every time */ }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = [];
    let leaving = false;
    const leave = () => {
      if (leaving) return;
      leaving = true;
      setPhase('leave');
      timers.push(setTimeout(() => setPhase('gone'), reduced ? 250 : 800));
    };

    timers.push(setTimeout(leave, reduced ? 900 : 2700));
    window.addEventListener('pointerdown', leave, { once: true });
    window.addEventListener('keydown', leave, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('pointerdown', leave);
      window.removeEventListener('keydown', leave);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`sf-intro${phase === 'leave' ? ' sf-intro-leave' : ''}`} aria-hidden="true">
      <div className="sf-intro-glow" />
      <div className="sf-intro-stack">
        <div className="sf-intro-mark">
          <span className="sf-intro-ring" />
          <img src="/brand/storeflick-mark.png" alt="" width="443" height="473" fetchPriority="high" />
          <span className="sf-intro-sheen" />
          <svg className="sf-intro-spark" viewBox="0 0 40 40">
            <path d="M20 0 23.5 16.5 40 20 23.5 23.5 20 40 16.5 23.5 0 20 16.5 16.5Z" />
          </svg>
        </div>
        <img className="sf-intro-word" src="/brand/storeflick-wordmark.png" alt="" width="1239" height="194" fetchPriority="high" />
        <img className="sf-intro-tag" src="/brand/storeflick-tagline.png" alt="" width="1342" height="47" />
      </div>
      <div className="sf-intro-bar"><span /></div>
    </div>
  );
}
