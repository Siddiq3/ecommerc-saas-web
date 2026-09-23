/** Wordmark with a simple storefront glyph. Inline SVG so it needs no network request. */
export function Logo({ className = '', showWord = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="9" className="fill-accent-600" />
        <path
          d="M8 13.2 9.6 8.6a1 1 0 0 1 .95-.68h10.9a1 1 0 0 1 .95.68L24 13.2"
          stroke="white"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 13.2c0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9c0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9c0 1.6 1.3 2.9 2.9 2.9"
          stroke="white"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 16.5V23a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6.5"
          stroke="white"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWord && <span className="text-lg font-bold tracking-tight text-ink-900">StoreKit</span>}
    </span>
  );
}
