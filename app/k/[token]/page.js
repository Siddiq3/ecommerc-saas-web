import { notFound } from 'next/navigation';
import { bookShareToken } from '@storeflick/validation';
import { Logo } from '../../../components/Logo.jsx';
import { BackendError, callBackend } from '../../../lib/backend.js';

export const metadata = {
  title: 'Your account',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export const dynamic = 'force-dynamic';

const rupees = (paise) => `₹${(Math.abs(paise) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const day = (date) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
/** A UPI payment link to the shop, with the amount filled in; phones open it in a UPI app. */
const upiLink = (upi, paise, note) => {
  const q = new URLSearchParams({ pa: upi.id, pn: upi.name ?? '', am: (paise / 100).toFixed(2), cu: 'INR', tn: note });
  return `upi://pay?${q.toString().replace(/\+/g, '%20')}`;
};

/** Entries that take off what the customer owes. */
const PAID = ['collection', 'salesReturn'];

const LABEL = {
  sale: 'Bill on credit', due: 'Earlier dues', collection: 'Payment received', salesReturn: 'Goods returned',
};

/**
 * A customer's khata with a shop, from the link the shop shared. The link's token is the only
 * key: no sign-in, nothing to guess, and the shop can turn it off. Notes stay with the shop.
 */
export default async function SharedLedgerPage({ params }) {
  const { token } = await params;
  if (!bookShareToken.safeParse(token).success) notFound();

  let ledger;
  try {
    ledger = await callBackend(`/public/khata/${token}`);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  }

  const { store, party, balance, entries } = ledger;
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center"><Logo /></div>
      </header>
      <main id="main" className="shell max-w-2xl py-8">
        <p className="text-sm text-ink-600">Your account with</p>
        <h1 className="text-2xl font-bold text-ink-900">{store.name}</h1>
        {store.phone ? <p className="text-sm text-ink-600">Phone: +91 {store.phone}</p> : null}

        <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-ink-600">{party.name}</p>
          <p className={`mt-1 text-3xl font-bold ${balance > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {balance > 0 ? `${rupees(balance)} due` : balance < 0 ? `${rupees(balance)} advance` : 'All settled'}
          </p>
        </section>

        {store.upi && balance > 0 ? (
          <section className="mt-4 rounded-2xl border border-line bg-surface p-5">
            <a href={upiLink(store.upi, balance, `${party.name} khata`)} className="btn btn-primary block w-full text-center">
              Pay {rupees(balance)} by UPI
            </a>
            <p className="mt-3 text-sm text-ink-600">Opens GPay, PhonePe, Paytm or any UPI app on this phone. UPI ID: <b className="text-ink-900">{store.upi.id}</b></p>
          </section>
        ) : null}

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-left text-xs uppercase tracking-wide text-ink-600">
              <tr><th className="p-3">Date</th><th className="p-3 text-right">Given</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">Balance</th></tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="border-t border-line align-top">
                  <td className="p-3">
                    <div className="text-ink-900">{day(e.date)}</div>
                    <div className="text-xs text-ink-600">
                      {LABEL[e.kind] ?? ''}{e.billNo ? ` · Bill ${e.billNo}` : ''}
                    </div>
                    {e.items?.length ? <div className="text-xs text-ink-600">{e.items.map((it) => `${it.name} × ${it.qty} ${it.unit}`).join(', ')}</div> : null}
                  </td>
                  <td className="p-3 text-right text-red-700">{!PAID.includes(e.kind) ? rupees(e.amount) : ''}</td>
                  <td className="p-3 text-right text-green-700">{PAID.includes(e.kind) ? rupees(e.amount) : ''}</td>
                  <td className="p-3 text-right text-ink-900">{e.balanceAfter < 0 ? `${rupees(e.balanceAfter)} adv.` : rupees(e.balanceAfter)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p className="mt-6 text-xs text-ink-600">Kept by {store.name} with StoreFlick. Questions about an entry? Please contact the shop.</p>
      </main>
    </div>
  );
}
