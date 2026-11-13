'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/** Seller tracking for the StoreKit team: who signed up, trial/plan state, and call notes. */

const PLAN = {
  trial_active: ['Trial', 'bg-blue-50 text-blue-700'],
  trial_expired: ['Trial ended', 'bg-red-50 text-red-700'],
  subscribed: ['Paid', 'bg-green-50 text-green-700'],
  cancelled: ['Cancelled', 'bg-amber-50 text-amber-700'],
  past_due: ['Payment failed', 'bg-red-50 text-red-700'],
  no_store: ['No store', 'bg-slate-100 text-slate-600'],
};
const STAGES = {
  new: 'Not called', contacted: 'Called', interested: 'Interested',
  follow_up: 'Follow up', converted: 'Converted', not_interested: 'Not interested',
};
/** Local calendar date (India), not UTC: after 5:30pm UTC the dates differ. */
const localDate = (offsetDays = 0) => {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const FILTERS = [
  ['all', 'All', () => true],
  ['todo', 'Follow-ups due', (s) => s.lead.followUpAt && s.lead.followUpAt <= localDate()],
  ['ending', 'Trial ending (≤3d)', (s) => s.planStatus === 'trial_active' && s.trialDaysLeft <= 3],
  ['expired', 'Trial ended', (s) => s.planStatus === 'trial_expired'],
  ['new', 'Not called', (s) => s.lead.stage === 'new' && s.planStatus !== 'subscribed'],
  ['nostore', 'No store', (s) => s.planStatus === 'no_store'],
  ['paid', 'Paid', (s) => s.planStatus === 'subscribed'],
];
const digits = (p) => String(p ?? '').replace(/\D/g, '').slice(-10);
const short = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—');

const api = async (url, init) => {
  const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json' } });
  const body = await res.json().catch(() => ({}));
  if (!body.success) {
    const error = new Error(body.error?.message ?? 'Something went wrong.');
    error.status = res.status;
    throw error;
  }
  return body.data;
};

const csvCell = (v) => {
  const s = String(v ?? '');
  // Leading = + - @ would run as a formula in Excel/Sheets.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};
const downloadCsv = (rows) => {
  const head = ['Name', 'Phone', 'Email', 'Store', 'Store link', 'Plan', 'Trial days left', 'Products', 'Orders this month', 'Joined', 'Marketing opt-in', 'Stage', 'Follow up', 'Notes'];
  const lines = rows.map((s) => [
    s.name, s.phone, s.email, s.store?.name, s.store?.slug, PLAN[s.planStatus]?.[0] ?? s.planStatus, s.trialDaysLeft ?? '',
    s.products, s.ordersThisMonth, s.signedUpAt?.slice(0, 10), s.marketingOptIn ? 'yes' : 'no',
    STAGES[s.lead.stage], s.lead.followUpAt ?? '', s.lead.note,
  ].map(csvCell).join(','));
  const blob = new window.Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `sellers-${localDate()}.csv` });
  a.click();
  URL.revokeObjectURL(a.href);
};

export function AdminSellers({ signedIn: initiallySignedIn }) {
  const [signedIn, setSignedIn] = useState(initiallySignedIn);
  const [sellers, setSellers] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setSellers((await api('/api/admin/sellers')).sellers);
    } catch (e) {
      if (e.status === 401 || e.status === 404) setSignedIn(false);
      else setError(e.message);
    }
  }, []);

  useEffect(() => { if (signedIn) load(); }, [signedIn, load]);

  const shown = useMemo(() => {
    const test = FILTERS.find(([key]) => key === filter)[2];
    const q = query.trim().toLowerCase();
    return (sellers ?? []).filter((s) => test(s) && (!q || [s.name, s.email, s.phone, s.store?.name, s.store?.slug].join(' ').toLowerCase().includes(q)));
  }, [sellers, filter, query]);

  if (!signedIn) return <AdminLogin onDone={() => setSignedIn(true)} />;
  if (error) return <p role="alert" className="text-danger">{error} <button className="underline" onClick={load}>Retry</button></p>;
  if (!sellers) return <p className="text-ink-500">Loading sellers…</p>;

  const count = (status) => sellers.filter((s) => s.planStatus === status).length;
  const logout = async () => { await api('/api/admin/logout', { method: 'POST' }).catch(() => undefined); setSignedIn(false); setSellers(null); };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Signed up', sellers.length], ['On trial', count('trial_active')], ['Trial ended', count('trial_expired')], ['Paid', count('subscribed')]].map(([label, n]) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-bold text-ink-900">{n}</p>
            <p className="text-sm text-ink-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input className="field max-w-xs" placeholder="Search name, phone, email, store" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search sellers" />
        {FILTERS.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} aria-pressed={filter === key}
            className={`rounded-full border px-3 py-1.5 text-sm ${filter === key ? 'border-ink-900 bg-ink-900 text-white' : 'border-line bg-surface text-ink-700'}`}>
            {label}
          </button>
        ))}
        <span className="ml-auto flex gap-2">
          <button className="btn btn-secondary" onClick={load}>Refresh</button>
          <button className="btn btn-secondary" onClick={() => downloadCsv(shown)}>Export CSV</button>
          <button className="btn btn-ghost" onClick={logout}>Sign out</button>
        </span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line text-ink-500">
            <tr>{['Seller', 'Store', 'Plan', 'Activity', 'Follow-up', 'Contact'].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {shown.map((s) => <Row key={s.ownerId} s={s} onEdit={() => setEditing(s)} />)}
            {!shown.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-500">Nobody matches this filter.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <LeadEditor seller={editing} onClose={() => setEditing(null)}
          onSaved={(lead) => { setSellers((list) => list.map((x) => (x.ownerId === editing.ownerId ? { ...x, lead } : x))); setEditing(null); }} />
      )}
    </div>
  );
}

function Row({ s, onEdit }) {
  const [planLabel, planClass] = PLAN[s.planStatus] ?? [s.planStatus, 'bg-slate-100 text-slate-600'];
  const phone = digits(s.phone);
  const due = s.lead.followUpAt && s.lead.followUpAt <= localDate();
  const hello = encodeURIComponent(`Hi ${s.name ?? ''}, this is the StoreKit team. How is ${s.store?.name ?? 'your store'} going?`);
  return (
    <tr className="border-b border-line align-top last:border-0">
      <td className="px-4 py-3">
        <p className="font-medium text-ink-900">{s.name || '—'}</p>
        <p className="text-ink-500">{s.email}</p>
        <p className="text-ink-500">Joined {short(s.signedUpAt)}{s.marketingOptIn ? '' : ' · no marketing opt-in'}</p>
      </td>
      <td className="px-4 py-3">{s.store ? <><p className="text-ink-900">{s.store.name}</p><p className="text-ink-500">/{s.store.slug}</p></> : <span className="text-ink-500">No store yet</span>}</td>
      <td className="px-4 py-3">
        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${planClass}`}>
          {s.planStatus === 'trial_active' ? `${planLabel} · ${s.trialDaysLeft}d left` : planLabel}
        </span>
      </td>
      <td className="px-4 py-3 text-ink-700">{s.products} products<br />{s.ordersThisMonth} orders this month</td>
      <td className="px-4 py-3">
        <button onClick={onEdit} className="text-left">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">{STAGES[s.lead.stage]}</span>
          {s.lead.followUpAt && <span className={`ml-1 text-xs ${due ? 'font-semibold text-red-700' : 'text-ink-500'}`}>{short(s.lead.followUpAt)}</span>}
          <p className="mt-1 max-w-56 text-ink-600 line-clamp-2">{s.lead.note || <span className="text-accent-600 underline">Add note</span>}</p>
        </button>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        {phone ? (
          <>
            <a className="mr-3 font-medium text-accent-600 underline" href={`tel:+91${phone}`}>{s.phone}</a>
            <a className="text-green-700 underline" href={`https://wa.me/91${phone}?text=${hello}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </>
        ) : <span className="text-ink-500">No phone</span>}
      </td>
    </tr>
  );
}

function LeadEditor({ seller, onClose, onSaved }) {
  const [form, setForm] = useState({ stage: seller.lead.stage, note: seller.lead.note ?? '', followUpAt: seller.lead.followUpAt ?? '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onSaved(await api(`/api/admin/sellers/${seller.ownerId}/lead`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: form.stage, note: form.note, followUpAt: form.followUpAt || null }),
      }));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="lead-title" className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg space-y-4 p-6">
        <h2 id="lead-title" className="text-lg font-bold text-ink-900">{seller.name} · {seller.store?.name ?? 'no store'}</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STAGES).map(([key, label]) => (
            <button type="button" key={key} onClick={() => setForm({ ...form, stage: key })} aria-pressed={form.stage === key}
              className={`rounded-full border px-3 py-1.5 text-sm ${form.stage === key ? 'border-ink-900 bg-ink-900 text-white' : 'border-line text-ink-700'}`}>
              {label}
            </button>
          ))}
        </div>
        <label className="block text-sm font-medium text-ink-800">Notes from the call
          <textarea className="field mt-1.5 min-h-28" maxLength={1000} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>
        <label className="block text-sm font-medium text-ink-800">Follow up on
          <div className="mt-1.5 flex gap-2">
            <input type="date" className="field" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} />
            <button type="button" className="btn btn-secondary" onClick={() => setForm({ ...form, followUpAt: localDate(1) })}>Tomorrow</button>
            <button type="button" className="btn btn-ghost" onClick={() => setForm({ ...form, followUpAt: '' })}>Clear</button>
          </div>
        </label>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}

function AdminLogin({ onDone }) {
  const [values, setValues] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify(values) });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-4 p-8">
      <p className="eyebrow">Admin</p>
      <h1 className="text-2xl font-bold text-ink-900">Sign in</h1>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</p>}
      <label className="block text-sm font-medium text-ink-800">Email or mobile number
        <input className="field mt-1.5" autoComplete="username" value={values.identifier} onChange={(e) => setValues({ ...values, identifier: e.target.value })} />
      </label>
      <label className="block text-sm font-medium text-ink-800">Password
        <input type="password" className="field mt-1.5" autoComplete="current-password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
      </label>
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
