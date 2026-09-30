/**
 * How long StoreKit keeps each kind of data, in one place.
 *
 * The privacy policy and the account-deletion page both render from this list, so the two
 * can never disagree. Every period here is what the backend actually does (a DynamoDB TTL
 * or an explicit delete in the API) — change it only together with the code it describes.
 */

export const RETENTION = [
  {
    data: 'Your account (name, email, mobile number, password hash)',
    period: 'Until you delete your account.',
  },
  {
    data: 'Your store: products, images, categories, coupons, policies, delivery and payment settings, custom domains',
    period: 'Until you delete the store or your account.',
  },
  {
    data: 'Orders and your customers’ details (name, mobile, email if given, delivery address, UPI payment reference)',
    period: 'Until you delete the store or your account.',
  },
  {
    data: 'Signed-in sessions (device name, IP address, browser or app details)',
    period: 'Up to 30 days after last use, or until you sign out, end the session or delete your account.',
  },
  {
    data: 'One-time sign-in and verification codes',
    period: 'Minutes; stored only as a keyed hash.',
  },
  {
    data: 'Storefront visitor counting (a daily one-way hash of IP address and browser details)',
    period: '48 hours.',
  },
  {
    data: 'Store analytics (daily counts of views, searches and orders)',
    period: '30, 90 or 365 days, depending on your plan.',
  },
  {
    data: 'In-app notifications',
    period: '180 days.',
  },
  {
    data: 'Audit log of changes made in your store',
    period: '2 years, or until the store is deleted.',
  },
  {
    data: 'Subscription billing history (plan, billing period, amount, payment reference — no card or UPI details)',
    period: '2 years, then deleted automatically. Kept after account deletion for accounting.',
  },
  {
    data: 'Checkout references and payment-provider notifications for your subscription',
    period: '90 days and 30 days respectively. Kept after account deletion until then.',
  },
  {
    data: 'A record that your email address has had the free trial (a one-way keyed hash of the address, nothing else)',
    period: 'Kept after account deletion, with no expiry, so the introductory free trial is given once per email address.',
  },
  {
    data: 'The record that an account was deleted (account id, time, number of stores removed)',
    period: '2 years, then deleted automatically.',
  },
  {
    data: 'Database backups',
    period: 'Deleted data can remain in point-in-time database backups for up to 35 days.',
  },
];
