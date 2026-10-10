import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BILLING_PLANS } from '@storekit/shared';
import { callBackend, SESSION_COOKIE, toRouteError } from '../../lib/backend.js';

export async function GET(request) {
  const url = new URL(request.url);
  const requestedPlan = url.searchParams.get('plan');
  const plan = BILLING_PLANS.find((item) => item.planId === requestedPlan)?.planId || 'growth';
  const signup = () => NextResponse.redirect(new URL(`/signup?plan=${plan}`, url));
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return signup();

  try {
    await callBackend('/billing/status', { sessionToken: token });
    return NextResponse.redirect(new URL(`/billing?plan=${plan}`, url));
  } catch (error) {
    if (error.status === 401 || error.status === 403) return signup();
    return toRouteError(error);
  }
}
