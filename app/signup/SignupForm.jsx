'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TRIAL_DAYS } from '@storekit/shared';
import { signupSchema } from '@storekit/validation';

/** First message per field, in the same shape the field inputs below expect. */
const fieldErrorsFrom = (issues) => {
  const errors = {};
  for (const issue of issues) errors[issue.path[0]] ??= issue.message;
  return errors;
};

const FIELDS = [
  { id: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { id: 'phone', label: 'Mobile number', type: 'tel', autoComplete: 'tel', inputMode: 'numeric', placeholder: '98765 43210' },
  { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
];

/**
 * Account creation. Checked against the exact schema the API applies, so the form answers
 * before the network does. On success the merchant is sent to the app to sign in and set
 * up their store, which is when the free trial starts.
 */
export function SignupForm({ appBadges }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', acceptedTerms: false });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [busy, setBusy] = useState(false);
  const [createdFor, setCreatedFor] = useState(null);

  const set = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function onSubmit(event) {
    event.preventDefault();
    setFailure(null);

    const result = signupSchema.safeParse({ ...values, acceptedTerms: values.acceptedTerms || undefined });
    if (!result.success) {
      setErrors(fieldErrorsFrom(result.error.issues));
      return;
    }
    setErrors({});

    setBusy(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const payload = await response.json();

      if (!payload.success) {
        const fields = {};
        for (const detail of payload.error?.details ?? []) if (detail?.path) fields[detail.path] ??= detail.message;
        setErrors(fields);
        setFailure(payload.error?.message ?? 'Something went wrong. Please try again.');
        return;
      }

      setCreatedFor(payload.data.email);
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  if (createdFor) {
    return (
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Your account is ready</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Open the StoreKit app and sign in with <span className="font-medium text-ink-900">{createdFor}</span> to set up
          your store. Your {TRIAL_DAYS}-day free trial starts when your store is created.
        </p>
        {appBadges}
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md p-8">
      <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        {TRIAL_DAYS} days free when you set up your store. No card needed.
      </p>

      {failure && (
        <div role="alert" className="mt-5 rounded-lg border border-danger/25 bg-red-50 p-4 text-sm text-danger">
          {failure}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-ink-800">{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              placeholder={field.placeholder}
              className="field"
              style={errors[field.id] ? { borderColor: 'var(--color-danger)' } : undefined}
              value={values[field.id]}
              onChange={set(field.id)}
              aria-invalid={Boolean(errors[field.id])}
              aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
            />
            {errors[field.id] && <p id={`${field.id}-error`} className="mt-1.5 text-sm text-danger">{errors[field.id]}</p>}
          </div>
        ))}

        <div>
          <label className="flex items-start gap-2.5 text-sm text-ink-600">
            <input type="checkbox" className="mt-0.5" checked={values.acceptedTerms} onChange={set('acceptedTerms')} />
            <span>
              I agree to the <Link href="/legal/terms" className="font-medium text-accent-700 hover:underline">Terms</Link> and{' '}
              <Link href="/legal/privacy" className="font-medium text-accent-700 hover:underline">Privacy policy</Link>.
            </span>
          </label>
          {errors.acceptedTerms && <p className="mt-1.5 text-sm text-danger">{errors.acceptedTerms}</p>}
        </div>

        <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
          {busy ? 'Creating your account…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-ink-500">
          Already have an account? Sign in in the StoreKit app.
        </p>
      </form>
    </div>
  );
}
