import { cookies } from 'next/headers';
import { redeemHandoffSchema } from '@storekit/validation';
import {
  callBackend, toRouteError, clientIpFromRequest, ACCOUNT_COOKIE, sessionCookieOptions,
} from '../../../../../lib/backend.js';
import { readJson } from '../../../../../lib/validate.js';

/**
 * Exchanges the single-use code from the app for a session that can do one thing: file an
 * account-deletion request. The token goes straight into an httpOnly cookie, exactly as
 * the billing handoff does, so no script on this page can read or forward it.
 */
export async function POST(request) {
  try {
    const { code } = await readJson(request, redeemHandoffSchema);

    const data = await callBackend('/account/deletion/session', {
      method: 'POST',
      body: { code },
      clientIp: clientIpFromRequest(request),
    });

    const jar = await cookies();
    jar.set(ACCOUNT_COOKIE, data.session.token, sessionCookieOptions(data.session.expiresInSeconds));

    return Response.json({ success: true, data: { account: data.account, request: data.request } });
  } catch (error) {
    return toRouteError(error);
  }
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(ACCOUNT_COOKIE);
  return Response.json({ success: true, data: { cleared: true } });
}
