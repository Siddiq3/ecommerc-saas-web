import { PaymentSuccess } from '../../components/PaymentSuccess.jsx';
import { Logo } from '../../components/Logo.jsx';
import { paidPlanIdSchema } from '@storekit/validation';
import { appDeepLink } from '../../lib/site.js';

export const metadata = {
  title: 'Payment successful',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;

  /*
   * This URL is shareable, so its query string is untrusted input like any other. The
   * plan is only used if it is one of the real plan ids; anything else is dropped and the
   * page renders its generic wording rather than echoing a stranger's text back.
   */
  const plan = paidPlanIdSchema.safeParse(params?.plan);

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <main id="main" className="shell">
        <PaymentSuccess deepLink={appDeepLink()} planId={plan.success ? plan.data : undefined} />
      </main>
    </div>
  );
}
