import { SiteHeader } from './SiteHeader.jsx';
import { SiteFooter } from './SiteFooter.jsx';

/** Shared shell for the three legal pages: same header/footer/typography as the rest of the site. */
export function LegalPage({ title, updated, children }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="display-2">{title}</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated {updated}</p>
          <div className="prose-legal mt-10 space-y-8 leading-relaxed text-ink-700">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
