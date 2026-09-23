'use client';

import { useEffect, useRef, useState } from 'react';
import { getBillingPlan } from '@storekit/shared';

/**
 * Confirmation screen.
 *
 * It tries the deep link once automatically, because the customer's goal is to get back
 * to the app, not to read a receipt. The manual button stays visible regardless: a deep
 * link can silently fail when the app is not installed, when the browser blocks an
 * automatic scheme navigation, or on desktop, and a screen with no way forward is worse
 * than one extra tap.
 */
export function PaymentSuccess({ deepLink, planId }) {
  const [attempted, setAttempted] = useState(false);
  const fired = useRef(false);
  const plan = getBillingPlan(planId);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // A short delay lets the success state paint first, so the customer sees the
    // confirmation even if the app opens immediately on top of it.
    const timer = setTimeout(() => {
      setAttempted(true);
      try {
        window.location.href = deepLink;
      } catch {
        // Blocked or unsupported. The manual button below still works.
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [deepLink]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent-600">
          <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-7 text-3xl font-bold">Payment successful</h1>

      <p className="mt-3 leading-relaxed text-ink-600">
        {plan
          ? `You are on the ${plan.name} plan. Your store is unlocked and ready.`
          : 'Your subscription is active and your store is unlocked.'}
      </p>

      <a href={deepLink} className="btn-primary mt-9 w-full py-3.5 text-base">
        Return to the app
      </a>

      <p className="mt-5 text-sm text-ink-500">
        {attempted
          ? 'If the app did not open, tap the button above, or switch to it yourself and pull down to refresh.'
          : 'Taking you back to the app…'}
      </p>

      <div className="mt-12 w-full border-t border-line pt-8 text-left">
        <h2 className="text-sm font-semibold text-ink-900">What happens next</h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-600">
          <li>A receipt is on its way to your email.</li>
          <li>Your plan renews automatically unless you chose to pay once.</li>
          <li>You can change or cancel your plan any time from Settings in the app.</li>
        </ul>
      </div>
    </div>
  );
}
