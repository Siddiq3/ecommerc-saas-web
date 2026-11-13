import { Logo } from '../../components/Logo.jsx';
import { AdminSellers } from '../../components/AdminSellers.jsx';
import { hasAdminSession } from '../../lib/admin.js';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
};

export const dynamic = 'force-dynamic';

/** Internal: every seller who signed up, for sales follow-up. Not linked from anywhere. */
export default async function AdminPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center">
          <Logo />
          <span className="ml-auto text-sm text-ink-500">Admin · Sellers</span>
        </div>
      </header>
      <main id="main" className="shell py-8">
        <AdminSellers signedIn={await hasAdminSession()} />
      </main>
    </div>
  );
}
