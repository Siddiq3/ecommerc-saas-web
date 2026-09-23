import { appStoreUrl, playStoreUrl } from '../lib/site.js';

/**
 * Store download buttons.
 *
 * Drawn rather than using Apple's and Google's official badge artwork: both are
 * trademarked and come with brand guidelines about clear space and minimum size that a
 * copied PNG tends to break. These are plainly our own buttons, which is allowed, and
 * they inherit the page's type instead of fighting it.
 */

const AppleMark = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85-.7 0-1.85-.83-3.05-.81-1.55.02-3 .9-3.8 2.3-1.63 2.82-.42 7 1.16 9.3.78 1.12 1.7 2.38 2.9 2.34 1.17-.05 1.6-.75 3.02-.75 1.4 0 1.8.75 3.03.73 1.25-.02 2.04-1.14 2.8-2.27.88-1.3 1.25-2.56 1.27-2.63-.03-.01-2.43-.93-2.45-3.7zM14.2 5.5c.64-.78 1.07-1.85.95-2.93-.92.04-2.03.61-2.69 1.38-.59.69-1.1 1.79-.96 2.84 1.02.08 2.06-.52 2.7-1.29z" />
  </svg>
);

const PlayMark = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.6 2.2c-.27.28-.43.72-.43 1.29v17.02c0 .57.16 1.01.43 1.29l.06.05 9.54-9.54v-.22L3.66 2.55z" fill="#4285f4" />
    <path d="m16.4 15.5-3.2-3.2v-.22l3.2-3.2.07.04 3.79 2.15c1.08.61 1.08 1.62 0 2.24l-3.79 2.15z" fill="#fbbc04" />
    <path d="M16.47 15.46 13.2 12.2 3.6 21.8c.36.38.94.42 1.6.05l11.27-6.4z" fill="#ea4335" />
    <path d="M16.47 8.94 5.2 2.55c-.66-.38-1.24-.33-1.6.05l9.6 9.6z" fill="#34a853" />
  </svg>
);

const Badge = ({ href, mark, top, bottom }) => (
  <a
    href={href}
    className="group inline-flex items-center gap-3 rounded-md border border-white/15 bg-ink-900 px-5 py-2.5
               text-white transition-transform duration-200 hover:-translate-y-0.5"
  >
    {mark}
    <span className="text-left leading-tight">
      <span className="block text-[10px] uppercase tracking-wide text-white/55">{top}</span>
      <span className="block font-display text-base font-bold">{bottom}</span>
    </span>
  </a>
);

export function AppBadges({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Badge href={appStoreUrl()} mark={<AppleMark />} top="Download on the" bottom="App Store" />
      <Badge href={playStoreUrl()} mark={<PlayMark />} top="Get it on" bottom="Google Play" />
    </div>
  );
}
