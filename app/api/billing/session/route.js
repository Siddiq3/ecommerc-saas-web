import { cookies } from 'next/headers';
import { redeemHandoffSchema } from '@storekit/validation';
import { callBackend, toRouteError, SESSION_COOKIE, sessionCookieOptions } from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';

/**
 * Exchanges the single-use handoff token from the app for a billing session.
 *
 * The session token is written straight into an httpOnly cookie and never returned to the
 * page, so no script on this site can read it. The handoff token is spent by this call,
 * which is why the page strips it from the URL immediately afterwards.
 */
export async function POST(request) {
  try {
    // The token must look like the compact JWT the app was issued before it is spent.
    const { token } = await readJson(request, redeemHandoffSchema);

    const data = await callBackend('/billing/session', { method: 'POST', body: { token } });

    const jar = await cookies();
    jar.set(SESSION_COOKIE, data.session.token, sessionCookieOptions(data.session.expiresInSeconds));

    // Account context and plan state are safe to render; the token itself is not.
    return Response.json({ success: true, data: { account: data.account, status: data.status } });
  } catch (error) {
    return toRouteError(error);
  }
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  return Response.json({ success: true, data: { cleared: true } });
}
