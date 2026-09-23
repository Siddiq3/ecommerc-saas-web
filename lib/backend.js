import 'server-only';

/**
 * Server-side client for the StoreKit API.
 *
 * `API_BASE_URL` has no NEXT_PUBLIC prefix, so it never reaches the browser bundle, and
 * neither does the billing session token: every call the browser makes goes through this
 * app's own route handlers, which read the session from an httpOnly cookie.
 */
const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8787/v1';

export class BackendError extends Error {
  constructor(code, message, status, details) {
    super(message);
    this.name = 'BackendError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const callBackend = async (path, { method = 'GET', body, sessionToken, idempotencyKey, clientIp } = {}) => {
  // The API's requireJson middleware demands Content-Type: application/json on every
  // POST/PATCH/PUT, whether or not that request carries a body — so a body-less action
  // (cancel, the billing handoff) still needs the header and a serialised `{}`, or the
  // backend answers 415 before this call's own logic ever runs.
  const sendsBody = body !== undefined || ['POST', 'PATCH', 'PUT'].includes(method);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(sendsBody ? { 'Content-Type': 'application/json' } : {}),
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
        // Forwarded so the backend's rate limiter keys off the real visitor rather than
        // this server's own address — every login attempt would otherwise share one
        // bucket, and one abusive visitor would lock everyone else out.
        ...(clientIp ? { 'X-Forwarded-For': clientIp } : {}),
      },
      ...(sendsBody ? { body: JSON.stringify(body ?? {}) } : {}),
      cache: 'no-store',
    });
  } catch {
    // A network failure here is our infrastructure, not the customer's mistake.
    throw new BackendError('SERVICE_UNAVAILABLE', 'We could not reach the billing service. Please try again.', 503);
  }

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new BackendError('INTERNAL_ERROR', 'Something went wrong. Please try again.', response.status);
  }

  if (!response.ok || payload.success === false) {
    const error = payload.error ?? {};
    throw new BackendError(
      error.code ?? 'INTERNAL_ERROR',
      error.message ?? 'Something went wrong. Please try again.',
      response.status,
      error.details,
    );
  }

  return payload.data;
};

/** Uniform JSON error for this app's own route handlers. */
export const toRouteError = (error) => {
  const known = error instanceof BackendError;
  return Response.json(
    {
      success: false,
      error: {
        code: known ? error.code : 'INTERNAL_ERROR',
        message: known ? error.message : 'Something went wrong. Please try again.',
      },
    },
    { status: known ? error.status : 500 },
  );
};

/**
 * The visitor's real address, read the same way the backend itself reads it — so a
 * request this server relays carries the address the rate limiter should actually key
 * on, not this server's own.
 */
export const clientIpFromRequest = (request) => {
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || undefined;
  return undefined;
};

export const SESSION_COOKIE = 'sk_billing';

/** Cookie options shared by every route that touches the billing session. */
export const sessionCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // Lax, not Strict: the customer arrives from an external browser navigation, and Strict
  // would drop the cookie on that first cross-site hop back from the payment provider.
  sameSite: 'lax',
  path: '/',
  maxAge,
});
