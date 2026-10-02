import { resetPasswordSchema } from '@storekit/validation';
import { callBackend, toRouteError, clientIpFromRequest } from '../../../../../lib/backend.js';
import { readJson } from '../../../../../lib/validate.js';

export async function POST(request) {
  try {
    const input = await readJson(request, resetPasswordSchema);
    const data = await callBackend('/auth/reset-password', {
      method: 'POST',
      body: input,
      clientIp: clientIpFromRequest(request),
    });
    return Response.json({ success: true, data });
  } catch (error) {
    return toRouteError(error);
  }
}
