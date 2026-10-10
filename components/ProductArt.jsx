import Image from 'next/image';

const PHOTO_ALTS = {
  watch: 'Steel wristwatch styled on dark fabric',
  jewellery: 'Blue gemstone earrings arranged on a green leaf',
  cosmetics: 'Amber skincare dropper bottle on a wooden display stand',
  apparel: 'Navy, white and burgundy shirts styled on a wooden table',
  perfume: 'Black perfume bottle styled with red flowers',
  decor: 'White ceramic vase with green leaves against a grey wall',
};

/** Locally hosted product photos for the example storefront cards. */
export function ProductArt({ kind = 'apparel', className = '', priority = false }) {
  const category = PHOTO_ALTS[kind] ? kind : 'apparel';
  return (
    <div className={`relative overflow-hidden bg-ink-100 ${className}`}>
      <Image
        src={`/images/hero/${category}.jpg`}
        alt={PHOTO_ALTS[category]}
        fill
        sizes={priority ? '(max-width: 639px) 156px, (max-width: 1023px) 248px, 292px' : '(max-width: 639px) 260px, 290px'}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
