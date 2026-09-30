import { cookies } from 'next/headers';
import { AccountDeleteClient } from '../../../components/AccountDeleteClient.jsx';
import { AccountDeletionInfo } from '../../../components/AccountDeletionInfo.jsx';
import { LegalFooter, LegalHeader } from '../../../components/LegalChrome.jsx';
import { ACCOUNT_COOKIE } from '../../../lib/backend.js';
import { appDeepLink, SITE } from '../../../lib/site.js';

export const dynamic = 'force-dynamic';

/**
 * Account deletion, two ways in.
 *
 * Opened with a one-time code (older app versions sent merchants here to file a request),
 * or holding the session that code became, it runs the request form. Opened plainly — from
 * the Play listing, the privacy policy or a search — it is a public page that explains how
 * to delete an account with or without the app, and what is deleted and kept.
 */
const handoffInProgress = async (searchParams) =>
  Boolean((await searchParams)?.code) || Boolean((await cookies()).get(ACCOUNT_COOKIE)?.value);

export async function generateMetadata({ searchParams }) {
  const handoff = await handoffInProgress(searchParams);
  return {
    title: 'Delete your account',
    description: `How to delete your ${SITE.name} account and data, with or without the app, and what we keep.`,
    // A URL carrying a one-time code is never indexed or cached. Either way there is no
    // referrer, so nothing this page loads is told the URL it was opened with.
    robots: handoff ? { index: false, follow: false, nocache: true } : { index: true, follow: true },
    referrer: 'no-referrer',
  };
}

export default async function AccountDeletePage({ searchParams }) {
  const handoff = await handoffInProgress(searchParams);

  return (
    <div className="min-h-dvh bg-canvas">
      {/* No product navigation: the app links here (see LegalChrome.jsx). */}
      <LegalHeader label="Account" />

      <main id="main" className="shell pt-10 pb-16">
        {handoff ? (
          <>
            <AccountDeleteClient deepLink={appDeepLink()} supportEmail={SITE.supportEmail} />
            <details className="mx-auto mt-4 max-w-lg rounded-lg border border-line bg-surface p-5">
              <summary className="cursor-pointer font-medium text-ink-900">What is deleted and what is kept</summary>
              <div className="mt-5"><AccountDeletionInfo supportEmail={SITE.supportEmail} /></div>
            </details>
          </>
        ) : (
          <div className="mx-auto max-w-2xl">
            <h1 className="display-2">Delete your account</h1>
            <p className="mt-3 text-ink-600">
              You can delete your {SITE.name} account and its data at any time. Here is how, and exactly what happens.
            </p>
            <div className="mt-10"><AccountDeletionInfo supportEmail={SITE.supportEmail} /></div>
          </div>
        )}
      </main>
      <LegalFooter />
    </div>
  );
}
