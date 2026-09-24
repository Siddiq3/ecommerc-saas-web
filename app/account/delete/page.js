import { AccountDeleteClient } from '../../../components/AccountDeleteClient.jsx';
import { Logo } from '../../../components/Logo.jsx';
import { appDeepLink, SITE } from '../../../lib/site.js';

export const metadata = {
  title: 'Delete your account',
  // Carries account context and a one-time code: never indexed, never cached, and no
  // referrer, so nothing this page loads is told the URL it was opened with.
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
};

export const dynamic = 'force-dynamic';

export default function AccountDeletePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center">
          <Logo />
          <span className="ml-auto text-sm text-ink-500">Account</span>
        </div>
      </header>

      <main id="main" className="shell pt-10">
        <AccountDeleteClient deepLink={appDeepLink()} supportEmail={SITE.supportEmail} />
      </main>
    </div>
  );
}
