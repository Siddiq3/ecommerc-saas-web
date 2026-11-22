import { LegalPage, LegalSection } from '../../components/LegalPage.jsx';
import { SITE, legalDetails } from '../../lib/site.js';

export const metadata = {
  title: 'Contact us',
  description: `How to reach ${SITE.name} for help with your store, your account or a payment.`,
};

export default function ContactPage() {
  const legal = legalDetails();
  const email = (
    <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-accent-700 hover:underline">{SITE.supportEmail}</a>
  );

  return (
    <LegalPage title="Contact us" updated="23 November 2026">
      <LegalSection title="Email">
        <p>
          For help with your store, your account, your subscription or a payment, email {email}. We reply within
          two working days.
        </p>
      </LegalSection>

      <LegalSection title="Phone">
        <p>
          Call or WhatsApp{' '}
          <a href="tel:+919581525613" className="font-medium text-accent-700 hover:underline">+91 95815 25613</a>.
        </p>
      </LegalSection>

      <LegalSection title="Who runs StoreFlick">
        <p>
          {SITE.name} is operated by <strong>{legal.entityName}</strong>.
        </p>
        <p>{legal.address}</p>
      </LegalSection>

      <LegalSection title="Payments and refunds">
        <p>
          If you were charged incorrectly for your {SITE.name} subscription, email {email} with your payment id. How
          refunds and cancellations work is set out in our{' '}
          <a href="/legal/refunds" className="font-medium text-accent-700 hover:underline">refunds &amp; cancellation policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="Grievance officer">
        <p>
          For a complaint about how your data is handled, write to our grievance officer, {legal.grievanceOfficer}, at{' '}
          {email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
