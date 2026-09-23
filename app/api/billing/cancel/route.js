import { cookies } from 'next/headers';
import { callBackend, toRouteError, SESSION_COOKIE } from '../../../../lib/backend.js';

export async function POST() {
  try {
    const jar = await cookies();
    const sessionToken = jar.get(SESSION_COOKIE)?.value;
    if (!sessionToken) {
      return Response.json(
        { success: false, error: { code: 'UNAUTHENTICATED', message: 'Your billing session has ended.' } },
        { status: 401 },
      );
    }

    return Response.json({ success: true, data: await callBackend('/billing/cancel', { method: 'POST', sessionToken }) });
  } catch (error) {
    return toRouteError(error);
  }
}
