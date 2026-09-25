/** Product naming and marketing copy constants, kept out of the components. */
const setting = (value) => (typeof value === 'string' ? value.trim() : '');

export const SITE = {
  name: 'StoreKit',
  tagline: 'Your shop, online in an afternoon',
  description:
    'Take orders on WhatsApp and Instagram without the mess. StoreKit gives your shop a real online store, with cash on delivery and UPI built in.',
  supportEmail: 'help@storekit.app',
  // The storefront root. Stores are served at {slug}.<this host>; see storeHostname in @storekit/shared.
  storefrontUrl: setting(process.env.NEXT_PUBLIC_STOREFRONT_URL) || 'https://storekit.site',
};

/**
 * A blank is not a value. Hosting dashboards let a variable exist with nothing in it, and `?? fallback` would treat that
 * as set — `new URL('')` then fails the whole build. Empty, whitespace and a value that is not an absolute URL all
 * fall through to the next source.
 */
const validUrl = (value) => {
  try { return new URL(value).origin === 'null' ? '' : value.replace(/\/+$/, ''); } catch { return ''; }
};

/** This site's own address: the configured one, else the Vercel deployment's, else local development. */
export const siteUrl = () => {
  const configured = validUrl(setting(process.env.NEXT_PUBLIC_SITE_URL));
  if (configured) return configured;
  const vercel = setting(process.env.VERCEL_PROJECT_PRODUCTION_URL) || setting(process.env.VERCEL_URL);
  return validUrl(vercel ? `https://${vercel}` : '') || 'http://localhost:3002';
};
const DEFAULT_DEEP_LINK = 'storekit://payment-success';
// An app scheme or https, never script or plain http. Configuration, not input, but it is
// written into an href and assigned to location, so a bad value is not worth trusting.
const SAFE_DEEP_LINK = /^(?:https:\/\/|(?!(?:javascript|data|vbscript|file|https?):)[a-z][a-z0-9+.-]*:\/\/)[^\s"'<>]*$/i;
export const appDeepLink = () => {
  const configured = setting(process.env.NEXT_PUBLIC_APP_DEEP_LINK);
  return configured && SAFE_DEEP_LINK.test(configured) ? configured : DEFAULT_DEEP_LINK;
};
export const appStoreUrl = () => setting(process.env.NEXT_PUBLIC_APP_STORE_URL) || '#';
export const playStoreUrl = () => setting(process.env.NEXT_PUBLIC_PLAY_STORE_URL) || '#';

export const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
];
