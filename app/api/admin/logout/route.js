import { adminCall, clearAdminTokens } from '../../../../lib/admin.js';

/** Ends the API session too, not just the cookies. */
export async function POST() {
  await adminCall('/auth/logout', { method: 'POST' }).catch(() => undefined);
  await clearAdminTokens();
  return Response.json({ success: true, data: { loggedOut: true } });
}
