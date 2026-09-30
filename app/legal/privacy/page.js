import Link from 'next/link';
import { Configured, LegalPage, LegalSection, RetentionTable } from '../../../components/LegalPage.jsx';
import { SITE, legalDetails } from '../../../lib/site.js';
import { RETENTION } from '../../../lib/retention.js';

export const metadata = {
  title: 'Privacy policy',
  description: `How ${SITE.name} handles your data and your customers' data.`,
};

const List = ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;

const Email = () => (
  <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-accent-700 hover:underline">
    {SITE.supportEmail}
  </a>
);

/**
 * Every statement here describes what the code in this project actually does. Where a
 * fact can only come from the owner (who runs the service, where), it is a configurable
 * value that shows a visible marker until set — see legalDetails in lib/site.js.
 */
export default function PrivacyPage() {
  const legal = legalDetails();

  return (
    <LegalPage title="Privacy policy" updated="30 September 2026">
      <LegalSection title="Who we are">
        <p>
          {SITE.name} (&ldquo;we&rdquo;) is a service for shop owners (&ldquo;merchants&rdquo;): the {SITE.name} Android
          app, where a merchant runs their store; the online storefront their customers order from; and this
          website, where merchants choose and pay for a plan.
        </p>
        <p>
          {SITE.name} is operated by <Configured value={legal.entityName} label="legal entity name" />,{' '}
          <Configured value={legal.address} label="postal address" />. For anything in this policy, email <Email />.
        </p>
      </LegalSection>

      <LegalSection title="What we collect from merchants">
        <List>
          <li>
            <strong>Account:</strong> your name, email address and mobile number, and your password — stored only as a
            salted hash, never in readable form.
          </li>
          <li>
            <strong>Sign-in and security:</strong> for each signed-in device, a device name, a random identifier the app
            creates on install, the IP address and browser or app details it signs in from, and when it was last used.
            We also count failed sign-in attempts, to lock out password guessing.
          </li>
          <li>
            <strong>Your store:</strong> the store&rsquo;s name, link, description, contact details and address; your UPI
            ID and any UPI QR image you upload; products, images, categories, coupons, delivery rules and store policies;
            and any custom domain you connect.
          </li>
          <li>
            <strong>Your subscription:</strong> your plan, billing period, amounts paid and payment references.
          </li>
        </List>
      </LegalSection>

      <LegalSection title="What we hold for merchants about their customers">
        <p>
          When a customer orders from a merchant&rsquo;s storefront we store, on the merchant&rsquo;s behalf, what is
          needed to deliver it: the customer&rsquo;s name, mobile number, email address if they give one, delivery
          address, what they ordered and, for UPI orders, the payment reference they enter. It is visible to that
          merchant, used only to run their store, and not sold or shared with anyone else.
        </p>
        <p>
          To show merchants how their store is doing, the storefront counts visits, product views and searches.
          Visitors are counted by a one-way hash of their IP address and browser details, combined with a secret and
          the date, which cannot be turned back into either and changes every day. Merchants only see totals.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <List>
          <li>To run your account and storefront, and take and manage your customers&rsquo; orders.</li>
          <li>To keep accounts secure: sign-in, managing signed-in devices, and locking out repeated failed attempts.</li>
          <li>To check, when you set a password, whether it appears in known data breaches (see below).</li>
          <li>To bill your plan and answer questions about a payment.</li>
          <li>To email you about your account, such as a receipt for a request you make.</li>
        </List>
        <p>We do not sell personal data and do not use it for advertising.</p>
      </LegalSection>

      <LegalSection title="Who processes it for us">
        <List>
          <li>
            <strong>Amazon Web Services</strong> runs our API and database and sends our emails (Amazon SES), in the
            India (Mumbai) region unless configured otherwise.
          </li>
          <li>
            <strong>Cloudflare</strong> hosts the storefronts, stores product and store images, and, where custom
            domains are switched on, serves a merchant&rsquo;s own domain.
          </li>
          <li>
            <strong>Cashfree Payments</strong> processes plan payments. To start a payment we pass it a name, your email
            and your mobile number. Card and UPI details are entered with Cashfree directly; we never see or store them.
          </li>
          <li>
            <strong>Have I Been Pwned</strong> (Pwned Passwords): when you set a password we send the first five
            characters of its SHA-1 hash — never the password or the full hash — to check it against known breaches.
          </li>
          <li>
            <strong>Website hosting:</strong> <Configured value={legal.websiteHost} label="provider that hosts this website" />.
          </li>
        </List>
        <p>We share data with anyone else only where the law requires it.</p>
      </LegalSection>

      <LegalSection title="Cookies and storage on your device">
        <List>
          <li>
            <strong>This website</strong> sets a cookie only while you are signed in to manage or pay for a plan
            (<code>sk_billing</code>) or asking for account deletion (<code>sk_account</code>). Each holds a short-lived
            session, cannot be read by scripts on the page, and is needed for that step to work. There are no analytics
            or advertising cookies.
          </li>
          <li>
            <strong>Storefronts</strong> keep a customer&rsquo;s cart in the browser&rsquo;s local storage and an entered
            coupon code in session storage, on that store&rsquo;s own address. They set no cookies of their own.
          </li>
          <li>
            <strong>The app</strong> keeps your sign-in tokens in the device&rsquo;s secure, encrypted storage, plus a
            random install identifier. It contains no advertising or analytics SDK.
          </li>
        </List>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <RetentionTable rows={RETENTION} />
      </LegalSection>

      <LegalSection title="Deleting your data">
        <List>
          <li>
            <strong>Delete a store</strong> in the app (Account → Delete store). The store and everything in it are
            erased straight away; your account stays.
          </li>
          <li>
            <strong>Delete your account</strong> in the app (Account → Delete account). Your account, every store you
            solely own and all their data are erased straight away, and every device is signed out.
          </li>
          <li>
            <strong>Without the app</strong>, email <Email /> from the address on your account.
          </li>
        </List>
        <p>
          What is deleted and what is kept is set out on the{' '}
          <Link href="/account/delete" className="font-medium text-accent-700 hover:underline">account deletion page</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can see and correct your account details in the app (Account → Profile) and your store details under
          Account → Store details &amp; payments. To ask for a copy of your data, to correct something you cannot edit
          yourself, or to complain about how we handle it, email <Email />. Customers of a store can contact that
          store&rsquo;s merchant, or us.
        </p>
        <p>
          Grievance officer: <Configured value={legal.grievanceOfficer} label="grievance officer name and title" />,
          reachable at <Email />.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          Data is encrypted in transit and at rest in our database. Passwords are hashed, sign-in codes are stored only
          as keyed hashes, and links that take you from the app to this website carry a single-use code that expires
          within minutes, never your sign-in token.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>If we change this policy, we will update the date at the top of this page.</p>
      </LegalSection>
    </LegalPage>
  );
}
