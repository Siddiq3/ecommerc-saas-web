/** Product naming and marketing copy constants, kept out of the components. */
export const SITE = {
  name: 'StoreKit',
  tagline: 'Your shop, online in an afternoon',
  description:
    'Take orders on WhatsApp and Instagram without the mess. StoreKit gives your shop a real online store, with cash on delivery and UPI built in.',
  supportEmail: 'help@storekit.app',
  // The storefront root. Stores are served at {slug}.<this host>; see storeHostname in @storekit/shared.
  storefrontUrl: process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'https://storekit.site',
};

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';
const DEFAULT_DEEP_LINK = 'storekit://payment-success';
// An app scheme or https, never script or plain http. Configuration, not input, but it is
// written into an href and assigned to location, so a bad value is not worth trusting.
const SAFE_DEEP_LINK = /^(?:https:\/\/|(?!(?:javascript|data|vbscript|file|https?):)[a-z][a-z0-9+.-]*:\/\/)[^\s"'<>]*$/i;
export const appDeepLink = () => {
  const configured = process.env.NEXT_PUBLIC_APP_DEEP_LINK;
  return configured && SAFE_DEEP_LINK.test(configured) ? configured : DEFAULT_DEEP_LINK;
};
export const appStoreUrl = () => process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#';
export const playStoreUrl = () => process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#';

export const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
];
