import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { confirmCheckoutSchema } from '@storekit/validation';
import { callBackend, toRouteError, SESSION_COOKIE } from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';

/**
 * Hands the finished order to the backend, which asks Cashfree whether it was paid before
 * granting anything. The browser is not trusted to declare a payment successful; it only
 * names the order to look at.
 */
export async function POST(request) {
  try {
    const jar = await cookies();
    const sessionToken = jar.get(SESSION_COOKIE)?.value;
    if (!sessionToken) {
      return Response.json(
        { success: false, error: { code: 'UNAUTHENTICATED', message: 'Your billing session has ended.' } },
        { status: 401 },
      );
    }

    /*
     * Validated before anything is used. The order id is interpolated into the
     * idempotency header below, so it has to be known to match the shape this system
     * mints — an unvalidated value there is a header the browser gets to write.
     */
    const payload = await readJson(request, confirmCheckoutSchema);

    const data = await callBackend('/billing/confirm', {
      method: 'POST',
      sessionToken,
      idempotencyKey: `confirm-${payload.order_id ?? randomUUID()}`,
      body: payload,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return toRouteError(error);
  }
}
