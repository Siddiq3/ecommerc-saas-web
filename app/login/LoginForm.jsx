'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema } from '@storekit/validation';

const CREDENTIALS_SCHEMA = loginSchema.pick({ email: true, mobile: true, password: true });

/** First message per field, in the same shape the field inputs below expect. */
const fieldErrorsFrom = (issues) => {
  const errors = {};
  for (const issue of issues) errors[issue.path[0]] ??= issue.message;
  return errors;
};

export function LoginForm() {
  const router = useRouter();

  const [values, setValues] = useState({ email: '', mobile: '', password: '' });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function onSubmit(event) {
    event.preventDefault();
    setFailure(null);

    // Checked client-side against the exact schema the API enforces, before a request is
    // ever sent — the same "type, length, format" rule the rest of this app applies.
    const result = CREDENTIALS_SCHEMA.safeParse(values);
    if (!result.success) {
      setErrors(fieldErrorsFrom(result.error.issues));
      return;
    }
    setErrors({});

    setBusy(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const payload = await response.json();

      if (!payload.success) {
        setFailure(payload.error?.message ?? 'Something went wrong. Please try again.');
        setBusy(false);
        return;
      }

      router.replace('/billing');
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-8">
      <p className="eyebrow">Billing</p>
      <h1 className="mt-2 text-2xl font-bold text-ink-900">Sign in</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        Use the same email, mobile number and password as the StoreKit app.
      </p>

      {failure && (
        <div role="alert" className="mt-5 rounded-lg border border-danger/25 bg-red-50 p-4 text-sm text-danger">
          {failure}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="field"
            style={errors.email ? { borderColor: 'var(--color-danger)' } : undefined}
            value={values.email}
            onChange={set('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="mt-1.5 text-sm text-danger">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-ink-800">
            Mobile number
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="98765 43210"
            className="field"
            style={errors.mobile ? { borderColor: 'var(--color-danger)' } : undefined}
            value={values.mobile}
            onChange={set('mobile')}
            aria-invalid={Boolean(errors.mobile)}
            aria-describedby={errors.mobile ? 'mobile-error' : undefined}
          />
          {errors.mobile && <p id="mobile-error" className="mt-1.5 text-sm text-danger">{errors.mobile}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-800">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="field pr-11"
              style={errors.password ? { borderColor: 'var(--color-danger)' } : undefined}
              value={values.password}
              onChange={set('password')}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400 hover:text-ink-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M6.6 6.7C4.5 8.1 3 10 3 12c0 0 3.5 7 9 7 1.6 0 3-0.4 4.2-1.1M17.6 17.4C19.7 16 21 14 21 12c0-0.7-.8-2.4-2.2-4M9.9 4.2c.7-.1 1.4-.2 2.1-.2 5.5 0 9 7 9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p id="password-error" className="mt-1.5 text-sm text-danger">{errors.password}</p>}
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        No account yet?{' '}
        <Link href="/pricing" className="font-medium text-accent-700 hover:underline">
          See plans
        </Link>
      </p>
    </div>
  );
}
