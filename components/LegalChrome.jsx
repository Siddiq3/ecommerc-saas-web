import Link from 'next/link';
import { Logo } from './Logo.jsx';
import { SITE } from '../lib/site.js';

/**
 * Header and footer for the legal and account-deletion pages.
 *
 * The Android app links to these pages, and the app is consumption-only: a page it opens
 * must not lead on to plans, pricing or checkout. So this chrome carries no product
 * navigation at all — the logo is not a link to the marketing home page, and the footer
 * lists only the legal pages and support. The rest of the site keeps SiteHeader/SiteFooter.
 */

const LEGAL_LINKS = [
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/privacy', label: 'Privacy policy' },
  { href: '/legal/refunds', label: 'Refunds' },
  { href: '/account/delete', label: 'Delete your account' },
];

export function LegalHeader({ label }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="shell flex h-16 items-center">
        <Logo />
        {label ? <span className="ml-auto text-sm text-ink-500">{label}</span> : null}
      </div>
    </header>
  );
}

export function LegalFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="shell flex flex-col gap-4 py-8 text-sm text-ink-600 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Legal">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-ink-900">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-ink-500">
          &copy; {new Date().getFullYear()} {SITE.name} ·{' '}
          <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-accent-700 hover:text-accent-900">
            {SITE.supportEmail}
          </a>
        </p>
      </div>
    </footer>
  );
}
