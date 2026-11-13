import { loginSchema } from '@storekit/validation';
import { callBackend, toRouteError, clientIpFromRequest } from '../../../../lib/backend.js';
import { readJson } from '../../../../lib/validate.js';
import { saveAdminTokens } from '../../../../lib/admin.js';

/** Admin sign-in. A valid seller login that is not an admin is ended at once and refused. */
export async function POST(request) {
  try {
    const credentials = await readJson(request, loginSchema.pick({ identifier: true, password: true }));
    const clientIp = clientIpFromRequest(request);
    const login = await callBackend('/auth/login', { method: 'POST', body: credentials, clientIp });

    if (!login.user?.isAdmin) {
      await callBackend('/auth/logout', { method: 'POST', sessionToken: login.tokens?.accessToken, clientIp }).catch(() => undefined);
      return Response.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'This account is not an admin.' } },
        { status: 403 },
      );
    }

    await saveAdminTokens(login.tokens);
    return Response.json({ success: true, data: { name: login.user.name } });
  } catch (error) {
    return toRouteError(error);
  }
}
