import { z } from 'zod';
import { BILLING_CYCLES } from '@storekit/shared';
import { compactJwt } from './primitives.js';

/**
 * Billing schemas, shared by the API and the website so the browser rejects exactly what
 * the server would. Every object is `.strict()`.
 *
 * Razorpay identifiers have fixed prefixes and an alphanumeric body; checkout signatures
 * are hex-encoded HMAC-SHA256. Matching those shapes means a value that could not have
 * come from Razorpay never reaches the signature check at all.
 */

const razorpayId = (prefix, label) =>
  z.string().regex(new RegExp(`^${prefix}_[A-Za-z0-9]{8,32}$`), `Invalid ${label}`);

export const razorpayPaymentId = razorpayId('pay', 'payment reference');
export const razorpayOrderId = razorpayId('order', 'order reference');
export const razorpaySubscriptionId = razorpayId('sub', 'subscription reference');
export const razorpaySignature = z.string().regex(/^[a-f0-9]{64}$/, 'Invalid payment signature');

export const paidPlanIdSchema = z.enum(['starter', 'growth', 'pro']);

export const planSelectionSchema = z
  .object({
    planId: paidPlanIdSchema,
    cycle: z.enum(BILLING_CYCLES).default('monthly'),
    mode: z.enum(['subscription', 'one_time']).default('subscription'),
  })
  .strict();

/** The single-use handoff token the app puts in the billing URL. */
export const redeemHandoffSchema = z.object({ token: compactJwt }).strict();

export const confirmCheckoutSchema = z
  .object({
    razorpay_payment_id: razorpayPaymentId,
    razorpay_subscription_id: razorpaySubscriptionId.optional(),
    razorpay_order_id: razorpayOrderId.optional(),
    razorpay_signature: razorpaySignature,
  })
  .strict()
  // Exactly one of the two: a subscription checkout returns a subscription id, a one-time
  // one returns an order id. Both, or neither, is not a response Razorpay produces.
  .refine((v) => Boolean(v.razorpay_subscription_id) !== Boolean(v.razorpay_order_id), {
    path: ['razorpay_order_id'],
    message: 'Invalid payment confirmation',
  });

/** Query string on the website's success page, which is shareable and so untrusted. */
export const paymentSuccessQuerySchema = z
  .object({ plan: paidPlanIdSchema.optional() })
  .strict();
