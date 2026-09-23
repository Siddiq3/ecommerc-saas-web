import { TRIAL_DAYS } from '@storekit/shared';
import { LegalPage, LegalSection } from '../../../components/LegalPage.jsx';
import { SITE } from '../../../lib/site.js';

export const metadata = {
  title: 'Terms of service',
  description: `The terms for using ${SITE.name} to run your store.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="23 September 2026">
      <LegalSection title="What StoreKit is">
        <p>
          StoreKit is a mobile app and storefront that lets a shop owner ("you", "the merchant")
          publish a catalogue of products, take orders from customers by cash on delivery or UPI,
          and manage stock, coupons and delivery rules. This site handles account billing for the
          app; the app itself is where you run your store.
        </p>
      </LegalSection>

      <LegalSection title="Your trial and subscription">
        <p>
          Every store starts with a {TRIAL_DAYS}-day free trial. No payment details are collected
          to start it. If you choose to continue after the trial, you pick a paid plan and pay
          through Razorpay, billed monthly or yearly, on auto-renew or as a one-time payment for
          the period.
        </p>
        <p>
          You can cancel at any time from this site. Your store and its data stay live and
          orderable until the end of the period you have already paid for — cancelling does not
          take your store down immediately.
        </p>
      </LegalSection>

      <LegalSection title="Orders and payments to you">
        <p>
          Your customers pay you directly by cash on delivery or UPI. StoreKit is not a party to
          that payment, never holds your customers&rsquo; money, and takes no commission on your
          sales. You are responsible for fulfilling orders, for the accuracy of your product
          listings and stock, and for any tax or regulatory obligations that come with selling
          your products.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          Your store may not be used to sell anything illegal, to misrepresent stock you do not
          hold, or to collect customer information for anything other than fulfilling their
          order. We can suspend a store that does this.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms as the product changes. Material changes will be reflected
          here with an updated date above.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms: {' '}
          <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-accent-700 hover:underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
