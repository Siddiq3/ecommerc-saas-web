import { toRouteError } from '../../../../lib/backend.js';
import { adminCall } from '../../../../lib/admin.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json({ success: true, data: await adminCall('/admin/sellers') });
  } catch (error) {
    return toRouteError(error);
  }
}
