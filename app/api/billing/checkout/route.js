import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { planSelectionSchema } from '@storekit/validation';
import { callBackend, toRouteError, SESSION_COOKIE } from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';

/**
 * Creates the Razorpay subscription or order that checkout will open.
 *
 * The plan and cycle are the only things the browser gets to choose. The amount is
 * decided server-side from the plan catalogue, so a tampered request cannot buy a Pro
 * plan at Starter prices.
 */
export async function POST(request) {
  try {
    const jar = await cookies();
    const sessionToken = jar.get(SESSION_COOKIE)?.value;
    if (!sessionToken) {
      return Response.json(
        { success: false, error: { code: 'UNAUTHENTICATED', message: 'Your billing session has ended. Reopen billing from the app.' } },
        { status: 401 },
      );
    }

    // Validated here, not just forwarded: the plan catalogue is a closed set, and a value
    // outside it should never reach the billing API in the first place.
    const selection = await readJson(request, planSelectionSchema);

    const data = await callBackend('/billing/checkout', {
      method: 'POST',
      sessionToken,
      // A retried tap must not create a second subscription in Razorpay.
      idempotencyKey: `checkout-${randomUUID().replace(/-/g, '')}`,
      body: selection,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return toRouteError(error);
  }
}
