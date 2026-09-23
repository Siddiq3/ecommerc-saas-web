import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * Pin the repository root.
   *
   * Next walks up looking for a lockfile to decide what to trace into the build output.
   * There is an unrelated package-lock.json in the home directory above this repo, which
   * it was picking instead — so the root is stated rather than inferred.
   */
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          {
            /**
             * Razorpay Checkout is loaded from their CDN and opens its own iframe, so its
             * origins are allowed explicitly rather than by loosening the policy. Nothing
             * else third-party is permitted.
             */
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.razorpay.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.razorpay.com https://lumberjack.razorpay.com",
              "frame-src https://api.razorpay.com https://*.razorpay.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // The billing page carries account context; it must never be cached anywhere.
        source: '/billing',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
