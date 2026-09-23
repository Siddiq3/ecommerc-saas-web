import { cookies } from 'next/headers';
import { redeemHandoffSchema } from '@storekit/validation';
import {
  callBackend, toRouteError, clientIpFromRequest, SESSION_COOKIE, sessionCookieOptions,
} from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';

/**
 * Exchanges the single-use handoff code from the app for a billing session.
 *
 * The session token is written straight into an httpOnly cookie and never returned to the
 * page, so no script on this site can read it. The code is spent by this call, which is
 * why the page strips it from the URL before making it.
 */
export async function POST(request) {
  try {
    // The code must look like the ones the API mints before it is sent anywhere.
    const { code } = await readJson(request, redeemHandoffSchema);

    const data = await callBackend('/billing/session', {
      method: 'POST',
      body: { code },
      clientIp: clientIpFromRequest(request),
    });

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
