import { TRIAL_DAYS } from '@storekit/shared';
import { LegalPage, LegalSection } from '../../../components/LegalPage.jsx';
import { SITE } from '../../../lib/site.js';

export const metadata = {
  title: 'Refund policy',
  description: `How refunds work for a ${SITE.name} subscription.`,
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund policy" updated="23 September 2026">
      <LegalSection title="This covers your StoreKit subscription">
        <p>
          This is about what you pay StoreKit for your subscription. It has nothing to do with
          what your customers pay you — that is cash on delivery or UPI, paid directly to you,
          and any refund to a customer is between you and them.
        </p>
      </LegalSection>

      <LegalSection title="During the trial">
        <p>
          Every store gets {TRIAL_DAYS} days free with no card required. You are never charged
          during the trial, so there is nothing to refund.
        </p>
      </LegalSection>

      <LegalSection title="Cancelling a paid plan">
        <p>
          You can cancel at any time. Your store stays live and orderable until the end of the
          period you have already paid for. We do not refund the unused part of a period you have
          already paid for.
        </p>
      </LegalSection>

      <LegalSection title="If a payment failed or was charged twice">
        <p>
          If a payment did not go through but you were charged, or you were charged more than
          once for the same period, contact us with your payment id and we will look into it and
          refund the incorrect charge.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Billing issues: {' '}
          <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-accent-700 hover:underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
