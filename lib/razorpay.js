'use client';

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Loads Razorpay Checkout once and caches the promise.
 *
 * This runs only on the billing website. The mobile app never loads it, never embeds it,
 * and has no payment code at all, which is what keeps checkout outside the app.
 */
let loader = null;

export const loadRazorpay = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Razorpay) return Promise.resolve(window.Razorpay);

  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Razorpay));
        existing.addEventListener('error', () => reject(new Error('checkout_script_failed')));
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.Razorpay);
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
 * Opens checkout and resolves with the provider's signed response.
 *
 * Dismissal resolves to null rather than rejecting: a customer closing the sheet is a
 * normal outcome, not an error to show them.
 */
export const openCheckout = async (checkout, { storeName, email, onDismiss }) => {
  const Razorpay = await loadRazorpay();
  if (!Razorpay) throw new Error('checkout_unavailable');

  return new Promise((resolve, reject) => {
    const options = {
      key: checkout.razorpayKeyId,
      name: 'StoreKit',
      description: `${checkout.planName} plan, billed ${checkout.cycle}`,
      image: '/icon.svg',
      prefill: { email, name: storeName },
      theme: { color: '#e2511e' },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => {
          onDismiss?.();
          resolve(null);
        },
        escape: true,
      },
      notes: { plan: checkout.planId, cycle: checkout.cycle },
    };

    // A subscription and a one-time order are opened with different identifiers.
    if (checkout.mode === 'subscription') options.subscription_id = checkout.subscriptionId;
    else {
      options.order_id = checkout.orderId;
      options.amount = checkout.amount;
      options.currency = checkout.currency;
    }

    try {
      const instance = new Razorpay(options);
      instance.on('payment.failed', (event) => {
        reject(new Error(event?.error?.description ?? 'Your payment could not be completed.'));
      });
      instance.open();
    } catch {
      reject(new Error('checkout_unavailable'));
    }
  });
};
