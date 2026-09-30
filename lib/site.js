/** Product naming and marketing copy constants, kept out of the components. */
const setting = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Site settings are read on the server, by these plain names (SITE_URL, STOREFRONT_URL, APP_DEEP_LINK, PLAY_STORE_URL,
 * APP_STORE_URL). None needs a NEXT_PUBLIC_ prefix: a value the browser must have (the app-store link in the header)
 * reaches it as a prop from a server component, not from an environment variable baked into the bundle, so changing one
 * needs a redeploy, not a rebuild of the client code. The old NEXT_PUBLIC_ names are still read if the plain one is
 * unset, so an existing deployment keeps working.
 */
const fromEnv = (name) => setting(process.env[name]) || setting(process.env[`NEXT_PUBLIC_${name}`]);

export const SITE = {
  name: 'StoreKit',
  tagline: 'Your shop, online in an afternoon',
  description:
    'Take orders on WhatsApp and Instagram without the mess. StoreKit gives your shop a real online store, with cash on delivery and UPI built in.',
  supportEmail: 'help@storekit.app',
  // The storefront root. Stores are served at {slug}.<this host>; see storeHostname in @storekit/shared.
  storefrontUrl: fromEnv('STOREFRONT_URL') || 'https://storekit.site',
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
  const configured = validUrl(fromEnv('SITE_URL'));
  if (configured) return configured;
  const vercel = setting(process.env.VERCEL_PROJECT_PRODUCTION_URL) || setting(process.env.VERCEL_URL);
  return validUrl(vercel ? `https://${vercel}` : '') || 'http://localhost:3002';
};
const DEFAULT_DEEP_LINK = 'storekit://payment-success';
// An app scheme or https, never script or plain http. Configuration, not input, but it is
// written into an href and assigned to location, so a bad value is not worth trusting.
const SAFE_DEEP_LINK = /^(?:https:\/\/|(?!(?:javascript|data|vbscript|file|https?):)[a-z][a-z0-9+.-]*:\/\/)[^\s"'<>]*$/i;
export const appDeepLink = () => {
  const configured = fromEnv('APP_DEEP_LINK');
  return configured && SAFE_DEEP_LINK.test(configured) ? configured : DEFAULT_DEEP_LINK;
};
export const appStoreUrl = () => fromEnv('APP_STORE_URL') || '#';

/**
 * Who operates the service, for the privacy policy and the account-deletion page. These are
 * facts only the owner can supply, so nothing is guessed: until a variable is set, the page
 * shows a visible "to be completed" marker in its place rather than an invented value.
 *
 *   LEGAL_ENTITY_NAME     the registered business or person that runs StoreKit
 *   LEGAL_ADDRESS         its postal address
 *   GRIEVANCE_OFFICER     name (and title) of the person who handles privacy complaints
 *   WEBSITE_HOST          the provider that hosts this website (its company name)
 */
export const legalDetails = () => ({
  entityName: fromEnv('LEGAL_ENTITY_NAME'),
  address: fromEnv('LEGAL_ADDRESS'),
  grievanceOfficer: fromEnv('GRIEVANCE_OFFICER'),
  websiteHost: fromEnv('WEBSITE_HOST'),
});
export const playStoreUrl = () => fromEnv('PLAY_STORE_URL') || '#';

/** What browser-side components need from the settings. Call it in a server component and pass it down. */
export const clientSiteConfig = () => ({ appStoreUrl: appStoreUrl(), playStoreUrl: playStoreUrl() });
