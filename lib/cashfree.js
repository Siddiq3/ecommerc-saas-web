'use client';

const SCRIPT_SRC = 'https://sdk.cashfree.com/js/v3/cashfree.js';

/**
 * Loads the Cashfree checkout SDK once and caches the promise.
 *
 * This runs only on the billing website. The mobile app never loads it, never embeds it,
 * and has no payment code at all, which is what keeps checkout outside the app.
 */
let loader = null;

export const loadCashfree = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Cashfree) return Promise.resolve(window.Cashfree);

  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Cashfree));
        existing.addEventListener('error', () => reject(new Error('checkout_script_failed')));
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.Cashfree);
      script.onerror = () => {
        // Let a later attempt retry rather than caching the failure forever.
        loader = null;
        reject(new Error('checkout_script_failed'));
      };
      document.head.appendChild(script);
    });
  }

  return loader;
};

/**
 * Opens checkout and resolves with the order to confirm, or null if the customer closed
 * the sheet without paying.
 *
 * What comes back from the SDK is never treated as proof of payment — only as a hint
 * that the flow finished. The order id is ours, minted server-side at checkout, and the
 * backend asks Cashfree whether it was actually paid. Dismissal resolves to null rather
 * than rejecting: a customer closing the sheet is a normal outcome, not an error.
 */
export const openCheckout = async (checkout) => {
  const Cashfree = await loadCashfree();
  if (!Cashfree) throw new Error('checkout_unavailable');

  const cashfree = await Cashfree({ mode: checkout.cashfreeMode === 'production' ? 'production' : 'sandbox' });

  const result = await cashfree.checkout({
    paymentSessionId: checkout.paymentSessionId,
    // A modal over our own page, so the customer never leaves the billing site and the
    // return does not depend on a redirect surviving the browser's back stack.
    redirectTarget: '_modal',
  });

  // The SDK reports a failed or abandoned attempt in `error`; either way there is nothing
  // to confirm, and the customer is already looking at Cashfree's own message.
  if (result?.error) return null;

  return { order_id: checkout.orderId };
};
