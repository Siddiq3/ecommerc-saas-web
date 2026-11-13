import 'server-only';
import { cookies } from 'next/headers';
import { BackendError, callBackend } from './backend.js';

/**
 * Platform-admin session for /admin (seller tracking). Only for owner ids in the API's
 * ADMIN_OWNER_IDS; the API answers 404 to anyone else, whatever this site does.
 *
 * Unlike billing, this needs a full API session, so the access and refresh tokens live in
 * httpOnly cookies on this site and never reach browser JavaScript. Both expire after 12
 * hours, so a forgotten laptop does not stay signed in for the refresh token's 30 days.
 */
const ACCESS = 'sk_admin_at';
const REFRESH = 'sk_admin_rt';
const MAX_AGE = 12 * 60 * 60;

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: MAX_AGE,
};

export const saveAdminTokens = async (tokens) => {
  const jar = await cookies();
  jar.set(ACCESS, tokens.accessToken, options);
  jar.set(REFRESH, tokens.refreshToken, options);
};

export const clearAdminTokens = async () => {
  const jar = await cookies();
  jar.delete(ACCESS);
  jar.delete(REFRESH);
};

export const hasAdminSession = async () => Boolean((await cookies()).get(REFRESH)?.value);

/** Calls the API as the signed-in admin, refreshing the 15-minute access token once if it has expired. */
export const adminCall = async (path, init = {}) => {
  const jar = await cookies();
  const access = jar.get(ACCESS)?.value;
  const refresh = jar.get(REFRESH)?.value;
  if (!refresh) throw new BackendError('UNAUTHENTICATED', 'Please sign in.', 401);

  try {
    return await callBackend(path, { ...init, sessionToken: access });
  } catch (error) {
    if (!(error instanceof BackendError) || error.status !== 401) throw error;
    let rotated;
    try {
      rotated = await callBackend('/auth/refresh', { method: 'POST', body: { refreshToken: refresh } });
    } catch {
      await clearAdminTokens();
      throw new BackendError('UNAUTHENTICATED', 'Your admin session ended. Please sign in again.', 401);
    }
    await saveAdminTokens(rotated.tokens);
    return callBackend(path, { ...init, sessionToken: rotated.tokens.accessToken });
  }
};
