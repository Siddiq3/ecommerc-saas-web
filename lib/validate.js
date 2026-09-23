import 'server-only';
import { toDetails } from './details.js';
import { BackendError } from './backend.js';

/**
 * Request validation for the route handlers.
 *
 * These endpoints sit between a browser and the billing API, so they are a boundary in
 * their own right: everything arriving from the page is validated against the same
 * schemas the backend enforces, before any value is forwarded, interpolated into a header
 * or written to a cookie.
 */

/**
 * Extends BackendError, not just Error: `toRouteError` in lib/backend.js only maps a
 * known error type to its real status and message, and anything else becomes a generic
 * 500. A validation failure here is exactly as "known" as one the backend itself
 * returns — sharing the base type is what makes toRouteError handle both alike.
 */
export class RequestError extends BackendError {
  constructor(message, details = []) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'RequestError';
  }
}

/**
 * Reads a JSON body and validates it.
 *
 * Malformed JSON is a 400 like any other bad input — not the 500 an uncaught `SyntaxError`
 * from `request.json()` would otherwise produce.
 */
export const readJson = async (request, schema) => {
  let raw;
  try {
    raw = await request.json();
  } catch {
    throw new RequestError('Send a valid JSON body');
  }

  const result = schema.safeParse(raw ?? {});
  if (!result.success) throw new RequestError('Some details need attention', toDetails(result.error.issues));
  return result.data;
};

/** Validates a URLSearchParams against a schema, returning `null` when it does not match. */
export const readQuery = (searchParams, schema) => {
  const result = schema.safeParse(Object.fromEntries(searchParams));
  return result.success ? result.data : null;
};
