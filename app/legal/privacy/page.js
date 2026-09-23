import { LegalPage, LegalSection } from '../../../components/LegalPage.jsx';
import { SITE } from '../../../lib/site.js';

export const metadata = {
  title: 'Privacy policy',
  description: `How ${SITE.name} handles your data and your customers' data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="23 September 2026">
      <LegalSection title="What we collect">
        <p>
          To run your store: your email, mobile number and password, your store and product
          details, and the orders your customers place — their name, delivery address and phone
          number, so you can fulfil the order.
        </p>
        <p>
          To bill your subscription: your email and store name are passed to Razorpay to process
          payment. We do not see or store your card or UPI details — Razorpay handles that
          directly.
        </p>
      </LegalSection>

      <LegalSection title="How it is used">
        <p>
          Your store and product data is used to run your storefront. Your customers&rsquo; order
          details are used only to get their order to them and are visible to you, the merchant —
          not sold or shared with anyone else. Every change made to an order is recorded, so
          there is a record of what happened to it.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          Razorpay, to process subscription payments. We do not sell your data or your
          customers&rsquo; data, and do not share it with anyone else except where required by
          law.
        </p>
      </LegalSection>

      <LegalSection title="Your data, your control">
        <p>
          You can export or delete your store&rsquo;s data from inside the app. If you need help
          with a data request, contact us and we will act on it.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy: {' '}
          <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-accent-700 hover:underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
