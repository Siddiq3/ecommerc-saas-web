import { adminLeadSchema } from '@storekit/validation';
import { toRouteError } from '../../../../../../lib/backend.js';
import { readJson } from '../../../../../../lib/validate.js';
import { adminCall } from '../../../../../../lib/admin.js';

export async function PATCH(request, { params }) {
  try {
    const { ownerId } = await params;
    if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(ownerId)) {
      return Response.json({ success: false, error: { code: 'NOT_FOUND', message: 'Seller not found' } }, { status: 404 });
    }
    const body = await readJson(request, adminLeadSchema);
    return Response.json({ success: true, data: await adminCall(`/admin/sellers/${ownerId}/lead`, { method: 'PATCH', body }) });
  } catch (error) {
    return toRouteError(error);
  }
}
