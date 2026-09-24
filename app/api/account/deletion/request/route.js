import { cookies } from 'next/headers';
import { accountDeletionRequestSchema } from '@storekit/validation';
import { callBackend, toRouteError, ACCOUNT_COOKIE } from '../../../../../lib/backend.js';
import { readJson } from '../../../../../lib/validate.js';

const sessionToken = async () => (await cookies()).get(ACCOUNT_COOKIE)?.value;

const expired = () =>
  Response.json(
    { success: false, error: { code: 'UNAUTHENTICATED', message: 'This link has expired. Open it again from the app.' } },
    { status: 401 },
  );

export async function GET() {
  try {
    const token = await sessionToken();
    if (!token) return expired();
    return Response.json({ success: true, data: await callBackend('/account/deletion-request', { sessionToken: token }) });
  } catch (error) {
    return toRouteError(error);
  }
}

export async function POST(request) {
  try {
    const token = await sessionToken();
    if (!token) return expired();

    // Validated here against the same schema the API applies, so nothing malformed is
    // relayed on a session that is allowed to close an account.
    const input = await readJson(request, accountDeletionRequestSchema);

    return Response.json({
      success: true,
      data: await callBackend('/account/deletion-request', { method: 'POST', body: input, sessionToken: token }),
    });
  } catch (error) {
    return toRouteError(error);
  }
}
