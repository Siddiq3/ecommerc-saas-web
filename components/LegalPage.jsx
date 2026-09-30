import { LegalFooter, LegalHeader } from './LegalChrome.jsx';

/**
 * Shared shell for the legal pages. The app links here, so it uses the legal chrome, which has
 * no pricing or plan navigation (see LegalChrome.jsx); the typography matches the rest of the site.
 */
export function LegalPage({ title, updated, children }) {
  return (
    <>
      <LegalHeader />
      <main id="main" className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="display-2">{title}</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated {updated}</p>
          <div className="prose-legal mt-10 space-y-8 leading-relaxed text-ink-700">{children}</div>
        </div>
      </main>
      <LegalFooter />
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

/**
 * A fact only the site owner can supply (see legalDetails in lib/site.js). Until it is set,
 * a visible marker stands in for it, so a missing detail is obvious rather than invented.
 */
export function Configured({ value, label }) {
  if (value) return <>{value}</>;
  return <mark className="rounded bg-amber-100 px-1 text-amber-900">[To be completed: {label}]</mark>;
}

/** The retention table shared by the privacy policy and the account-deletion page. */
export function RetentionTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-canvas text-ink-900">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Data</th>
            <th scope="col" className="px-4 py-3 font-semibold">How long we keep it</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.data} className="align-top">
              <td className="px-4 py-3">{row.data}</td>
              <td className="px-4 py-3">{row.period}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
