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

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState('request');
  const [values, setValues] = useState({ email: '', code: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (field) => (event) => {
    const value = field === 'code' ? event.target.value.replace(/\D/g, '').slice(0, 6) : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFailure(null);
  };

  async function requestCode(event) {
    event.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email: values.email });
    if (!result.success) return setErrors(fieldErrorsFrom(result.error.issues));
    setBusy(true); setFailure(null); setErrors({});
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.data),
      });
      const payload = await response.json();
      if (!payload.success) return setFailure(payload.error?.message ?? 'Could not send the reset code.');
      setStep('reset');
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    const result = resetPasswordSchema.safeParse(values);
    if (!result.success) return setErrors(fieldErrorsFrom(result.error.issues));
    setBusy(true); setFailure(null); setErrors({});
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.data),
      });
      const payload = await response.json();
      if (!payload.success) return setFailure(payload.error?.message ?? 'Could not reset your password.');
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
        {step === 'request' ? 'Enter the email linked to your StoreKit account.' : 'Enter the six-digit code and choose a new password.'}
      </p>

      {failure && <div role="alert" className="mt-5 rounded-lg border border-danger/25 bg-red-50 p-4 text-sm text-danger">{failure}</div>}

      {step === 'request' ? (
        <form onSubmit={requestCode} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">Email address</label>
            <input id="email" type="email" autoComplete="email" className="field" value={values.email} onChange={set('email')} />
            {errors.email && <p className="mt-1.5 text-sm text-danger">{errors.email}</p>}
          </div>
          <p className="text-xs leading-5 text-ink-500">For privacy, the response is the same whether or not an account exists.</p>
          <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Sending…' : 'Send reset code'}</button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-ink-800">Verification code</label>
            <input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="field text-center tracking-[0.3em]" value={values.code} onChange={set('code')} />
            {errors.code && <p className="mt-1.5 text-sm text-danger">{errors.code}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-ink-800">New password</label>
            <input id="newPassword" type="password" autoComplete="new-password" className="field" value={values.newPassword} onChange={set('newPassword')} />
            {errors.newPassword && <p className="mt-1.5 text-sm text-danger">{errors.newPassword}</p>}
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Resetting…' : 'Reset password'}</button>
          <button type="button" onClick={() => setStep('request')} className="btn-secondary w-full">Use a different email</button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link href="/login" className="font-medium text-accent-700 hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
