import Link from 'next/link';
import { RetentionTable } from './LegalPage.jsx';
import { RETENTION } from '../lib/retention.js';
import { SITE } from '../lib/site.js';

const List = ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;

/** What is erased and what is kept. Kept rows come from lib/retention.js, like the privacy policy. */
const KEPT = RETENTION.filter((row) => /account deletion|was deleted|backups/i.test(`${row.data} ${row.period}`));

/**
 * The public explanation of account deletion: how to ask for it, with or without the app,
 * and exactly what happens. Server-rendered and needs no sign-in, so it is what anyone
 * following the "delete your account" link from the app listing reads.
 */
export function AccountDeletionInfo({ supportEmail = SITE.supportEmail }) {
  const email = (
    <a href={`mailto:${supportEmail}`} className="font-medium text-accent-700 hover:underline">{supportEmail}</a>
  );

  return (
    <div className="space-y-8 leading-relaxed text-ink-700">
      <section>
        <h2 className="text-lg font-semibold text-ink-900">How to delete your {SITE.name} account</h2>
        <div className="mt-3 space-y-3">
          <p><strong>In the app</strong> (fastest):</p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Open the {SITE.name} app and sign in.</li>
            <li>Go to <strong>Account</strong> and tap <strong>Delete account</strong>.</li>
            <li>Read what will be deleted, tick the box, and confirm.</li>
          </ol>
          <p>
            Your account is deleted straight away and you are signed out on every device. If your plan has lapsed, the
            same <strong>Delete account</strong> button is on the screen the app shows you.
          </p>
          <p>
            <strong>Without the app</strong> — for example if you have uninstalled it or cannot sign in — email {email}{' '}
            from the email address on your account and ask us to delete it. We may ask you to confirm the request from
            that address before we act on it, and we will email you when it is done.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink-900">What is deleted</h2>
        <div className="mt-3">
          <List>
            <li>Your account: name, email address, mobile number and password.</li>
            <li>Every store you are the only owner of, including its link and any connected custom domain.</li>
            <li>Those stores&rsquo; products, images, categories, coupons, policies, delivery and payment settings.</li>
            <li>Their orders and customer details, notifications, analytics and change history.</li>
            <li>Your signed-in sessions on every device, pending sign-in codes and any earlier deletion request.</li>
            <li>Your access to any store owned by someone else (that store and its data are theirs and stay).</li>
          </List>
          <p className="mt-3">Deletion cannot be undone, and time left on a paid plan is not refunded.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink-900">What is kept, and for how long</h2>
        <div className="mt-3 space-y-3">
          <RetentionTable rows={KEPT} />
          <p>
            These records contain no card or UPI details. Card and UPI payments for your plan are handled by Cashfree
            Payments, which keeps its own records under its own policy.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink-900">Only want to close your store?</h2>
        <p className="mt-3">
          In the app, go to <strong>Account</strong> and tap <strong>Delete store</strong>. The store and everything in
          it are deleted straight away, and your account stays so you can start again.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink-900">Questions</h2>
        <p className="mt-3">
          Email {email}. How we handle data is set out in our{' '}
          <Link href="/legal/privacy" className="font-medium text-accent-700 hover:underline">privacy policy</Link>.
        </p>
      </section>
    </div>
  );
}
