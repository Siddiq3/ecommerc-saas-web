'use client';

import { useEffect, useRef, useState } from 'react';
import { handoffCode, accountDeletionRequestSchema, DELETION_REASONS } from '@storekit/validation';

/**
 * The account-deletion form.
 *
 * Reached only from the app, which opens it in the device's real browser with a
 * single-use, opaque code in the URL — the same handoff billing uses. The code is
 * exchanged for an httpOnly session cookie and wiped from the address bar before anything
 * else happens.
 *
 * Nothing here deletes anything. It files a request that a person reads, which is the
 * point: an account carries orders, invoices and a paid plan, and one tap in an app is
 * not the right amount of friction for erasing all of it. Deleting a *store* is the
 * immediate, self-service action, and it lives in the app.
 */

const REASON_LABELS = {
  not_using: 'I am not using it any more',
  too_expensive: 'It costs too much',
  missing_features: 'It is missing something I need',
  switching: 'I am moving to something else',
  privacy: 'I want my data removed',
  other: 'Something else',
};

const Spinner = ({ label }) => (
  <div className="flex flex-col items-center gap-4 py-24" role="status">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-spin text-accent-600">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    <p className="text-sm text-ink-500">{label}</p>
  </div>
);

const Notice = ({ tone = 'error', title, children }) => (
  <div role="alert" className={`rounded-lg border p-5 ${tone === 'error' ? 'border-danger/25 bg-red-50' : 'border-line bg-canvas'}`}>
    <p className={`font-semibold ${tone === 'error' ? 'text-danger' : 'text-ink-900'}`}>{title}</p>
    {children && <div className="mt-1.5 text-sm leading-relaxed text-ink-600">{children}</div>}
  </div>
);

export function AccountDeleteClient({ deepLink, supportEmail }) {
  const [phase, setPhase] = useState('authenticating');
  const [account, setAccount] = useState(null);
  const [request, setRequest] = useState(null);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const exchanged = useRef(false);

  /* ── Code exchange, once per page load ── */
  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const params = new URLSearchParams(window.location.search);
    // The URL is attacker-controllable, so the code is checked against the shape the API
    // mints before it is sent anywhere. A malformed one is treated as no code.
    const parsed = handoffCode.safeParse(params.get('code') ?? '');
    const code = parsed.success ? parsed.data : null;

    if (params.has('code')) {
      const clean = new URL(window.location.href);
      clean.searchParams.delete('code');
      window.history.replaceState({}, '', clean.pathname + (clean.search || ''));
    }

    const start = async () => {
      try {
        // No code: the visitor may still hold a session cookie from a moment ago — a
        // refresh, or a back button after filing.
        const response = await fetch(code ? '/api/account/deletion/session' : '/api/account/deletion/request', {
          method: code ? 'POST' : 'GET',
          headers: code ? { 'Content-Type': 'application/json' } : undefined,
          body: code ? JSON.stringify({ code }) : undefined,
        });
        const payload = await response.json();

        if (!response.ok || payload.success === false) {
          setError(payload.error ?? { message: 'This link is no longer valid.' });
          setPhase('locked');
          return;
        }

        if (payload.data.account) setAccount(payload.data.account);
        setRequest(payload.data.request ?? null);
        setPhase(payload.data.request ? 'filed' : 'form');
      } catch {
        setError({ message: 'We could not reach the server. Check your connection and try again.' });
        setPhase('locked');
      }
    };

    start();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError(null);

    // The same schema the route and the API apply, so the form answers before the network
    // does and the three layers cannot disagree about what is valid.
    const input = accountDeletionRequestSchema.safeParse({ reason, details: details.trim(), confirm: true });
    if (!input.success) {
      setError({ message: input.error.issues[0].message });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/account/deletion/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input.data),
      });
      const payload = await response.json();

      if (!response.ok || payload.success === false) {
        setError(payload.error ?? { message: 'We could not file your request. Please try again.' });
        return;
      }

      setRequest(payload.data.request);
      setPhase('filed');
    } catch {
      setError({ message: 'We could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  };

  if (phase === 'authenticating') return <Spinner label="Opening your account…" />;

  if (phase === 'locked') {
    return (
      <div className="mx-auto max-w-md py-16">
        <Notice title={error?.message ?? 'This link is no longer valid.'}>
          <p>These links are single-use and expire after a couple of minutes, which is what keeps your account safe if one is ever shared.</p>
          <p className="mt-3">Open the StoreKit app, go to Account and tap Delete account again for a fresh link.</p>
          <p className="mt-3">
            Cannot get into the app? Email <a className="underline" href={`mailto:${supportEmail}`}>{supportEmail}</a> from
            the address on your account and we will handle it there.
          </p>
        </Notice>
        <a href={deepLink} className="btn-secondary mt-5 w-full">Return to the app</a>
      </div>
    );
  }

  if (phase === 'filed') {
    return (
      <div className="mx-auto max-w-md py-16">
        <Notice tone="info" title="We have your request">
          <p>
            A person on our team will review it, delete your account and its data, and email
            {account?.email ? <> <span className="font-medium text-ink-900">{account.email}</span></> : ' you'} when it is done.
          </p>
          {request?.requestId && <p className="mt-3">Reference: <span className="font-mono text-ink-900">{request.requestId}</span></p>}
          <p className="mt-3">
            Changed your mind? Email <a className="underline" href={`mailto:${supportEmail}`}>{supportEmail}</a> with that
            reference and we will stop it.
          </p>
        </Notice>
        <a href={deepLink} className="btn-secondary mt-5 w-full">Return to the app</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="display-3">Delete your account</h1>
      <p className="mt-3 text-ink-600">
        This closes the account for <span className="font-medium text-ink-900">{account?.email}</span>
        {account?.storeName ? <> and deletes <span className="font-medium text-ink-900">{account.storeName}</span></> : null}
        {' '}— your products, orders, customers and everything else we hold for you.
      </p>

      <div className="card mt-6 p-5 text-sm leading-relaxed text-ink-600">
        <p className="font-semibold text-ink-900">Before you do</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>It cannot be undone, and we cannot restore your orders or customer list afterwards.</li>
          <li>Your store link becomes free for anyone else to take.</li>
          <li>Time left on a paid plan is not refunded.</li>
          <li>Records we are required to keep for tax or fraud rules are held for as long as the law says, then deleted.</li>
        </ul>
        <p className="mt-3">
          Only wanted to close your storefront? You can delete the store from the app and keep your account.
        </p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium text-ink-900" htmlFor="reason">Why are you leaving?</label>
          <select
            id="reason"
            className="field mt-1.5"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
          >
            <option value="" disabled>Choose a reason</option>
            {DELETION_REASONS.map((value) => (
              <option key={value} value={value}>{REASON_LABELS[value] ?? value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-900" htmlFor="details">Tell us a little more</label>
          <p className="mt-1 text-sm text-ink-500">
            What should we know before we delete this? If something went wrong, this is where a human will read it.
          </p>
          <textarea
            id="details"
            className="field mt-1.5 min-h-32"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            maxLength={1000}
            required
          />
          <p className="mt-1 text-right text-xs text-ink-400">{details.length}/1000</p>
        </div>

        {error && <Notice title={error.message} />}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Sending…' : 'Request account deletion'}
        </button>
        <a href={deepLink} className="btn-ghost w-full">Cancel and return to the app</a>
      </form>
    </div>
  );
}
