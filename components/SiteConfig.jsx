'use client';

import { createContext, useContext } from 'react';

/**
 * Site settings for components that run in the browser. The values are read from the server's environment by the root
 * layout (lib/site.js `clientSiteConfig`) and handed down here, so no setting needs a NEXT_PUBLIC_ name to reach them.
 */
const SiteConfigContext = createContext({ appStoreUrl: '#', playStoreUrl: '#' });

export function SiteConfigProvider({ value, children }) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export const useSiteConfig = () => useContext(SiteConfigContext);
