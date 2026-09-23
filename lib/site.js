/** Product naming and marketing copy constants, kept out of the components. */
export const SITE = {
  name: 'StoreKit',
  tagline: 'Your shop, online in an afternoon',
  description:
    'Take orders on WhatsApp and Instagram without the mess. StoreKit gives your shop a real online store, with cash on delivery and UPI built in.',
  supportEmail: 'help@storekit.app',
};

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';
export const appDeepLink = () => process.env.NEXT_PUBLIC_APP_DEEP_LINK ?? 'storekit://payment-success';
export const appStoreUrl = () => process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#';
export const playStoreUrl = () => process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#';

export const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
];
