'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { forgotPasswordSchema, resetPasswordSchema } from '@storekit/validation';

const fieldErrorsFrom = (issues) => {
  const errors = {};
  for (const issue of issues) errors[issue.path[0]] ??= issue.message;
  return errors;
};

export function RecoveryForm() {
  const router = useRouter();
  const [step, setStep] = useState('request');
  const [values, setValues] = useState({ email: '', code: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (event) => {
    const value = field === 'code'
      ? event.target.value.replace(/\D/g, '').slice(0, 6)
      : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    setFailure(null);
  };

  async function requestCode(event) {
    event.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email: values.email });
    if (!result.success) {
      setErrors(fieldErrorsFrom(result.error.issues));
      return;
    }
    setErrors({});
    setFailure(null);
    setBusy(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const payload = await response.json();
      if (!payload.success) {
        setFailure(payload.error?.message ?? 'Could not send the reset code. Please try again.');
        return;
      }
      setNotice(payload.data?.message ?? 'If that email is registered, a reset code is on its way.');
      setStep('reset');
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    const result = resetPasswordSchema.safeParse({
      email: values.email,
      code: values.code,
      newPassword: values.newPassword,
    });
    if (!result.success) {
      setErrors(fieldErrorsFrom(result.error.issues));
      return;
    }
    setErrors({});
    setFailure(null);
    setBusy(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const payload = await response.json();
      if (!payload.success) {
        setFailure(payload.error?.message ?? 'Could not reset your password. Please try again.');
        return;
      }
      router.replace('/login?reset=success');
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-8">
      <p className="eyebrow">Account recovery</p>
      <h1 className="mt-2 text-2xl font-bold text-ink-900">Reset your password</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        {step === 'request'
          ? 'Enter the email linked to your StoreKit account.'
          : 'Enter the six-digit code from your email and choose a new password.'}
      </p>

      {notice && (
        <div className="mt-5 rounded-lg border border-emerald-600/20 bg-emerald-50 p-4 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {failure && (
        <div role="alert" className="mt-5 rounded-lg border border-danger/25 bg-red-50 p-4 text-sm text-danger">
          {failure}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={requestCode} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              className="field"
              value={values.email}
              onChange={set('email')}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="mt-1.5 text-sm text-danger">{errors.email}</p>}
          </div>

          <p className="text-xs leading-5 text-ink-500">
            For privacy, the confirmation is the same whether or not an account exists.
          </p>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Sending…' : 'Send reset code'}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-ink-800">6-digit code</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="field text-center text-xl tracking-[0.25em]"
              value={values.code}
              onChange={set('code')}
              aria-invalid={Boolean(errors.code)}
            />
            {errors.code && <p className="mt-1.5 text-sm text-danger">{errors.code}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-ink-800">New password</label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="field pr-11"
                value={values.newPassword}
                onChange={set('newPassword')}
                aria-invalid={Boolean(errors.newPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400 hover:text-ink-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1.5 text-sm text-danger">{errors.newPassword}</p>}
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Resetting…' : 'Set new password'}
          </button>
          <button
            type="button"
            className="w-full py-2 text-sm font-medium text-accent-700 hover:underline"
            onClick={() => { setStep('request'); setNotice(null); setValues((current) => ({ ...current, code: '', newPassword: '' })); }}
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link href="/login" className="font-medium text-accent-700 hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
