import { cookies } from 'next/headers';
import { loginSchema } from '@storekit/validation';
import {
  callBackend, toRouteError, clientIpFromRequest, SESSION_COOKIE, sessionCookieOptions,
} from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';

/**
 * Direct email + mobile + password sign-in, for an owner who lands on the website first
 * rather than tapping "Upgrade" inside the app.
 *
 * This does not mint a second kind of session. It performs the same handoff the app
 * performs — sign in, ask the API for a one-time billing handoff code, redeem it — all
 * server-side in one request, so the browser only ever receives the narrow, httpOnly
 * billing-session cookie. The full product access and refresh tokens never reach the
 * browser at all, which is a smaller blast radius than a token kept in sessionStorage.
 */
export async function POST(request) {
  try {
    const credentials = await readJson(request, loginSchema.pick({ email: true, mobile: true, password: true }));
    const clientIp = clientIpFromRequest(request);

    const login = await callBackend('/auth/login', { method: 'POST', body: credentials, clientIp });
    const accessToken = login.tokens?.accessToken;

    if (!login.user?.businesses?.length) {
      // Signed in, but there is nothing to bill yet — send them to the app to finish
      // setting up their store rather than into a billing flow with no store behind it.
      return Response.json(
        {
          success: false,
          error: {
            code: 'NO_STORE',
            message: 'Your account has no store yet. Finish setting it up in the StoreKit app, then come back here to manage billing.',
          },
        },
        { status: 409 },
      );
    }

    const handoff = await callBackend('/me/billing/handoff', { method: 'POST', sessionToken: accessToken, clientIp });
    const code = new URL(handoff.url).searchParams.get('code');

    const session = await callBackend('/billing/session', { method: 'POST', body: { code }, clientIp });

    const jar = await cookies();
    jar.set(SESSION_COOKIE, session.session.token, sessionCookieOptions(session.session.expiresInSeconds));

    return Response.json({ success: true, data: { account: session.account, status: session.status } });
  } catch (error) {
    return toRouteError(error);
  }
}
