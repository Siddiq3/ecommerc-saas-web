import { Urbanist, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SITE, siteUrl } from '../lib/site.js';

/**
 * Two typefaces, with distinct jobs — the same pairing auto-garage's website uses.
 *
 * Urbanist carries the headlines: tall, slightly geometric letterforms that read as a
 * confident consumer product rather than a B2B dashboard. Plus Jakarta Sans carries body
 * copy, where its larger x-height stays legible at 16px on a phone.
 *
 * Both are self-hosted by next/font at build time, so there is no render-blocking request
 * to Google and no layout shift when they land.
 */
const display = Urbanist({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-urbanist',
  display: 'swap',
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e2511e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                     focus:rounded-md focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
