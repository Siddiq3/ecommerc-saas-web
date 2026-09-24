'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BILLING_PLANS, TRIAL_DAYS, PLAN_STATUS_LABELS,
  priceFor, effectiveMonthlyPrice, yearlySavingPercent, formatMoney,
} from '@storekit/shared';
import { Logo } from './Logo.jsx';
import { handoffCode, confirmCheckoutSchema, planSelectionSchema } from '@storekit/validation';
import { openCheckout } from '../lib/cashfree.js';
import { PlanFeatureList } from './PlanFeatureList.jsx';

const Spinner = ({ label }) => (
  <div className="flex flex-col items-center gap-4 py-24" role="status">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-spin text-accent-600">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    <p className="text-sm text-ink-500">{label}</p>
  </div>
);

const Notice = ({ tone = 'error', title, children, action }) => {
  const tones = {
    error: 'border-danger/25 bg-red-50',
    warn: 'border-warning/25 bg-amber-50',
    info: 'border-line bg-canvas',
  };
  return (
    <div role="alert" className={`rounded-lg border p-5 ${tones[tone]}`}>
      <p className={`font-semibold ${tone === 'error' ? 'text-danger' : 'text-ink-900'}`}>{title}</p>
      {children && <div className="mt-1.5 text-sm leading-relaxed text-ink-600">{children}</div>}
      {action}
    </div>
  );
};

/**
 * The billing page.
 *
 * It is reached only from the app, which opens it in the device's real browser with a
 * single-use, opaque code in the URL. That code is exchanged for an httpOnly session
 * cookie and wiped from the address bar, so it cannot be re-shared from browser history.
 * It is not a login credential and carries no identity: it is a lookup key the server
 * spends on first use.
 */
export function BillingClient({ deepLink }) {
  const router = useRouter();
  const [phase, setPhase] = useState('authenticating');
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState(null);
  const [cycle, setCycle] = useState('monthly');
  const [selected, setSelected] = useState('growth');
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
    const codeParam = handoffCode.safeParse(params.get('code') ?? '');
    const code = codeParam.success ? codeParam.data : null;
    const view = params.get('view') === 'manage' ? 'manage' : null;

    // Clear the code from the URL before anything else can read or persist it — whether or
    // not it was well formed, since a malformed one is still not something to keep around.
    if (params.has('code')) {
      const clean = new URL(window.location.href);
      clean.searchParams.delete('code');
      window.history.replaceState({}, '', clean.pathname + (clean.search || ''));
    }

    const start = async () => {
      // No code: the customer may already hold a valid session cookie from earlier.
      const endpoint = code ? '/api/billing/session' : '/api/billing/status';
      try {
        const response = await fetch(endpoint, {
          method: code ? 'POST' : 'GET',
          headers: code ? { 'Content-Type': 'application/json' } : undefined,
          body: code ? JSON.stringify({ code }) : undefined,
        });
        const payload = await response.json();

        if (!response.ok || payload.success === false) {
          setError(payload.error ?? { code: 'UNAUTHENTICATED', message: 'This billing link is no longer valid.' });
          setPhase('locked');
          return;
        }

        if (code) {
          setAccount(payload.data.account);
          setStatus(payload.data.status);
        } else {
          setStatus(payload.data);
        }

        if (payload.data.status?.billingCycle) setCycle(payload.data.status.billingCycle);
        if (view === 'manage') setPhase('manage');
        else setPhase('ready');
      } catch {
        setError({ code: 'SERVICE_UNAVAILABLE', message: 'We could not reach the billing service.' });
        setPhase('locked');
      }
    };

    start();
  }, []);

  /* ── Checkout ── */
  const startCheckout = async () => {
    setBusy(true);
    setError(null);

    try {
      // Validated in the browser with the same schema the route and the API apply, so a
      // corrupted selection never becomes a request at all.
      const selection = planSelectionSchema.safeParse({ planId: selected, cycle });
      if (!selection.success) {
        setError({ code: 'VALIDATION_ERROR', message: selection.error.issues[0].message });
        setBusy(false);
        return;
      }

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selection.data),
      });
      const payload = await response.json();

      if (!payload.success) {
        setError(payload.error);
        setBusy(false);
        return;
      }

      const result = await openCheckout(payload.data);

      // Customer closed the sheet without paying. Nothing to report.
      if (!result) {
        setBusy(false);
        return;
      }

      /*
       * Only the order id is relayed, and it is checked against the shape this system
       * mints. Whether that order was paid is decided by the backend asking Cashfree —
       * nothing the browser says here can grant a plan.
       */
      const checkoutResult = confirmCheckoutSchema.safeParse(result);
      if (!checkoutResult.success) {
        setError({
          code: 'VALIDATION_ERROR',
          message: 'The payment response could not be read. If money has left your account, contact support with your order id.',
        });
        setBusy(false);
        return;
      }

      const confirmation = await fetch('/api/billing/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutResult.data),
      });
      const confirmed = await confirmation.json();

      if (!confirmed.success) {
        setError({
          code: confirmed.error?.code,
          message:
            'Your payment went through but we could not confirm it here. It will update shortly. Contact us if it does not.',
        });
        setBusy(false);
        return;
      }

      /*
       * Cashfree has not marked the order paid. That is the normal answer for a payment
       * that is still settling — a bank page finished a moment ago, or the method is a
       * slow one — so it is not framed as a failure, and the webhook will land shortly.
       */
      if (confirmed.data?.paid === false) {
        setError({
          tone: 'info',
          code: 'PAYMENT_PENDING',
          message:
            'We have not seen that payment complete yet. If it was charged, your plan will update within a few minutes.',
        });
        setBusy(false);
        return;
      }

      window.location.href = `/payment-success?plan=${encodeURIComponent(selected)}`;
    } catch (checkoutError) {
      setError({
        code: 'CHECKOUT_FAILED',
        message:
          checkoutError?.message === 'checkout_unavailable'
            ? 'We could not open the payment window. Check your connection and try again.'
            : checkoutError?.message ?? 'Your payment could not be completed.',
      });
      setBusy(false);
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm('Cancel your subscription? Your store stays live until the end of the period you have paid for.')) return;
    setBusy(true);
    try {
      const response = await fetch('/api/billing/cancel', { method: 'POST' });
      const payload = await response.json();
      if (payload.success) setStatus(payload.data.status);
      else setError(payload.error);
    } finally {
      setBusy(false);
    }
  };

  /**
   * Only relevant to a direct website sign-in: the app-handoff visit ends when the tab is
   * closed anyway. Clears the httpOnly cookie server-side and returns to the login page.
   */
  const signOut = async () => {
    await fetch('/api/billing/session', { method: 'DELETE' }).catch(() => undefined);
    router.replace('/login');
  };

  /* ── Render ── */

  if (phase === 'authenticating') return <Spinner label="Signing you in…" />;

  if (phase === 'locked') {
    return (
      <div className="mx-auto max-w-md py-16">
        <Notice title={error?.message ?? 'This billing link is no longer valid.'}>
          <p>
            Billing links are single-use and expire after a couple of minutes, which keeps your account
            safe if a link is ever shared.
          </p>
          <p className="mt-3">Open the StoreKit app and tap Upgrade again to get a fresh link.</p>
        </Notice>
        <a href={deepLink} className="btn-secondary mt-5 w-full">
          Return to the app
        </a>
      </div>
    );
  }

  const saving = yearlySavingPercent();
  const currentPlan = BILLING_PLANS.find((p) => p.planId === status?.planId);

  return (
    <div className="mx-auto max-w-5xl pb-20">
      {/* Account bar */}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <Logo showWord={false} />
          <div>
            <p className="font-semibold text-ink-900">{account?.storeName ?? status?.storeName ?? 'Your store'}</p>
            <p className="text-sm text-ink-500">{account?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {status && (
            <div className="text-right">
              <span
                className={`pill ${
                  status.entitled ? 'bg-accent-50 text-accent-700' : 'bg-amber-50 text-warning'
                }`}
              >
                {PLAN_STATUS_LABELS[status.plan_status] ?? status.plan_status}
              </span>
              {status.plan_status === 'trial_active' && (
                <p className="mt-1.5 text-sm text-ink-500">
                  {status.trialDaysRemaining} {status.trialDaysRemaining === 1 ? 'day' : 'days'} left
                </p>
              )}
              {status.plan_status === 'subscribed' && currentPlan && (
                <p className="mt-1.5 text-sm text-ink-500">
                  {currentPlan.name}, renews{' '}
                  {new Date(status.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              )}
            </div>
          )}
          <button type="button" onClick={signOut} className="text-sm font-medium text-ink-500 hover:text-ink-900">
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <Notice tone={error.tone ?? 'error'} title={error.message} />
        </div>
      )}

      {status?.plan_status === 'past_due' && (
        <div className="mt-6">
          <Notice tone="warn" title="Your last payment did not go through">
            Pick a plan below to restart your subscription. Your store and products are untouched.
          </Notice>
        </div>
      )}

      {/* Manage view for an existing subscriber */}
      {phase === 'manage' && status?.hasSubscription && !status?.cancelledAt && (
        <div className="card mt-6 p-6">
          <h2 className="text-lg font-semibold">Manage your subscription</h2>
          <p className="mt-2 text-ink-600">
            You are on the {currentPlan?.name} plan, billed {status.billingCycle ?? 'monthly'}.
          </p>
          <button type="button" onClick={cancelSubscription} disabled={busy} className="btn-secondary mt-5 text-danger">
            Cancel subscription
          </button>
        </div>
      )}

      {status?.cancelledAt && (
        <div className="mt-6">
          <Notice tone="warn" title="Your subscription is set to end">
            Your store stays live until{' '}
            {new Date(status.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}. Pick a
            plan below to continue after that.
          </Notice>
        </div>
      )}

      {/* Plan selection */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {status?.hasSubscription ? 'Change your plan' : 'Choose your plan'}
        </h1>
        <p className="mt-2 text-ink-600">
          {status?.plan_status === 'trial_active'
            ? `Your trial has ${status.trialDaysRemaining} ${status.trialDaysRemaining === 1 ? 'day' : 'days'} left. Pick a plan to keep selling after it ends.`
            : 'Pick a plan to unlock your store.'}
        </p>

        {/* Cycle toggle */}
        <div className="mt-7 inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-card">
          {['monthly', 'yearly'].map((option) => {
            const active = cycle === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setCycle(option)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  active ? 'bg-accent-600 text-white' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {option}
                {option === 'yearly' && (
                  <span className={`ml-2 text-xs font-bold ${active ? 'text-accent-100' : 'text-accent-700'}`}>
                    save {saving}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {BILLING_PLANS.map((plan) => {
            const active = selected === plan.planId;
            const isCurrent = status?.plan_status === 'subscribed' && status?.planId === plan.planId;

            return (
              <button
                key={plan.planId}
                type="button"
                onClick={() => setSelected(plan.planId)}
                aria-pressed={active}
                className={`card p-6 text-left transition-all ${
                  active ? 'ring-2 ring-accent-600' : 'hover:border-line-strong'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink-900">{plan.name}</h3>
                    <p className="mt-0.5 text-sm text-ink-500">{plan.tagline}</p>
                  </div>
                  {isCurrent && <span className="pill bg-accent-50 text-accent-700">Current</span>}
                </div>

                <p className="mt-5">
                  <span className="text-3xl font-bold text-ink-900">
                    {formatMoney(effectiveMonthlyPrice(plan.planId, cycle))}
                  </span>
                  <span className="text-sm text-ink-500"> / month</span>
                </p>
                {cycle === 'yearly' && (
                  <p className="mt-1 text-sm text-ink-500">{formatMoney(priceFor(plan.planId, cycle))} billed yearly</p>
                )}

                <PlanFeatureList features={plan.featureList} className="mt-5 space-y-2.5" />
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={startCheckout} disabled={busy} className="btn-primary px-8 py-3.5 text-base">
            {busy ? 'Opening payment…' : `Pay ${formatMoney(priceFor(selected, cycle))}`}
          </button>
          <p className="text-sm text-ink-500">
            Secure payment by Cashfree. {TRIAL_DAYS}-day trial applies before your first charge.
          </p>
        </div>

        <p className="mt-8 text-sm text-ink-500">
          Finished here?{' '}
          <a href={deepLink} className="font-medium text-accent-700 hover:text-accent-900">
            Return to the app
          </a>
          .
        </p>
      </div>
    </div>
  );
}
