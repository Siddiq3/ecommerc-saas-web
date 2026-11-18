/**
 * The StoreFlick logo: the bag-and-bolt mark plus the two-tone wordmark. Both are transparent
 * PNGs cut from the master logo (public/brand), so they sit cleanly on any light surface.
 */
export function Logo({ className = '', showWord = true }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/brand/storeflick-mark-sm.png"
        alt={showWord ? '' : 'StoreFlick'}
        width="202"
        height="216"
        className="h-9 w-auto shrink-0"
      />
      {showWord && (
        <img
          src="/brand/storeflick-wordmark-sm.png"
          alt="StoreFlick"
          width="560"
          height="88"
          className="h-5 w-auto sm:h-[1.4rem]"
        />
      )}
    </span>
  );
}
