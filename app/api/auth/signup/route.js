import { signupSchema } from '@storekit/validation';
import { callBackend, toRouteError, clientIpFromRequest } from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';

/**
 * Creates a StoreKit account from the website — the only place accounts are created; the
 * Android app only signs in.
 *
 * The API answers a sign-up with a signed-in session, exactly as it answers a sign-in.
 * This site has no use for that session (the merchant sets up their store in the app), so
 * it is ended straight away and no token ever reaches the browser. The free trial starts
 * later, when the merchant creates their store.
 */
export async function POST(request) {
  try {
    const input = await readJson(request, signupSchema);
    const clientIp = clientIpFromRequest(request);

    const result = await callBackend('/auth/signup', { method: 'POST', body: input, clientIp });

    const accessToken = result?.tokens?.accessToken;
    if (accessToken) {
      await callBackend('/auth/logout', { method: 'POST', sessionToken: accessToken, clientIp }).catch(() => undefined);
    }

    return Response.json({ success: true, data: { email: input.email } }, { status: 201 });
  } catch (error) {
    return toRouteError(error);
  }
}
