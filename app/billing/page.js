import { BillingClient } from '../../components/BillingClient.jsx';
import { Logo } from '../../components/Logo.jsx';
import { appDeepLink } from '../../lib/site.js';

export const metadata = {
  title: 'Billing',
  // This page carries account context and must never be indexed or cached.
  robots: { index: false, follow: false, nocache: true },
  // The one-time code is in this page's URL until the client script clears it. No
  // referrer means nothing this page loads or links to is ever told that URL.
  referrer: 'no-referrer',
};

export const dynamic = 'force-dynamic';

export default function BillingPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center">
          <Logo />
          <span className="ml-auto text-sm text-ink-500">Secure billing</span>
        </div>
      </header>

      <main id="main" className="shell pt-10">
        <BillingClient deepLink={appDeepLink()} />
      </main>
    </div>
  );
}
