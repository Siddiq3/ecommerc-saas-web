'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { forgotPasswordSchema, resetPasswordSchema } from '@storekit/validation';

const fieldErrorsFrom = (issues) => {
  const errors = {};
  for (const issue of issues) errors[issue.path[0]] ??= issue.message;
  return errors;
};

export function ForgotPasswordForm() {
  const [step, setStep] = useState('request');
  const [values, setValues] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const set = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function sendCode() {
    setFailure(null);
    const result = forgotPasswordSchema.safeParse({ email: values.email });
    if (!result.success) {
      setErrors(fieldErrorsFrom(result.error.issues));
      return;
    }

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

      setStep('reset');
      setCooldown(payload.data?.resendAfterSeconds ?? 60);
      setNotice(payload.data?.message ?? 'If that email is registered, a reset code is on its way.');
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setFailure(null);

    if (values.newPassword !== values.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const result = resetPasswordSchema.safeParse({
      email: values.email,
      code: values.code,
      newPassword: values.newPassword,
    });
    if (!result.success) {
      setErrors(fieldErrorsFrom(result.error.issues));
      return;
    }

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

      setStep('done');
      setNotice('Password updated. You can now sign in with your new password.');
    } catch {
      setFailure('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card w-full max-w-md p-8">
      <p className="eyebrow">Account recovery</p>
      <h1 className="mt-2 text-2xl font-bold text-ink-900">
        {step === 'request' ? 'Reset your password' : step === 'reset' ? 'Choose a new password' : 'Password updated'}
      </h1>
      <p className="mt-1.5 text-sm text-ink-500">
        {step === 'request'
          ? 'Enter your account email and we will send a six-digit reset code.'
          : step === 'reset'
            ? `Enter the code sent to ${values.email} and choose a new password.`
            : 'Your old sessions have been ended for security.'}
      </p>

      {failure && (
        <div role="alert" className="mt-5 rounded-lg border border-danger/25 bg-red-50 p-4 text-sm text-danger">
          {failure}
        </div>
      )}
      {notice && (
        <div role="status" className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {step === 'request' && (
        <div className="mt-6 space-y-4">
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
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="mt-1.5 text-sm text-danger">{errors.email}</p>}
          </div>

          <button type="button" disabled={busy} className="btn-primary w-full" onClick={sendCode}>
            {busy ? 'Sending…' : 'Send reset code'}
          </button>
        </div>
      )}

      {step === 'reset' && (
        <form onSubmit={resetPassword} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-ink-800">6-digit code</label>
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="field"
              value={values.code}
              onChange={set('code')}
              aria-invalid={Boolean(errors.code)}
            />
            {errors.code && <p className="mt-1.5 text-sm text-danger">{errors.code}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-ink-800">New password</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className="field"
              value={values.newPassword}
              onChange={set('newPassword')}
              aria-invalid={Boolean(errors.newPassword)}
            />
            {errors.newPassword && <p className="mt-1.5 text-sm text-danger">{errors.newPassword}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink-800">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="field"
              value={values.confirmPassword}
              onChange={set('confirmPassword')}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && <p className="mt-1.5 text-sm text-danger">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Updating…' : 'Set new password'}
          </button>

          <button
            type="button"
            disabled={busy || cooldown > 0}
            className="btn-secondary w-full"
            onClick={sendCode}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
        </form>
      )}

      {step === 'done' && (
        <Link href="/login" className="btn-primary mt-6 flex w-full items-center justify-center">
          Back to sign in
        </Link>
      )}

      {step !== 'done' && (
        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href="/login" className="font-medium text-accent-700 hover:underline">Back to sign in</Link>
        </p>
      )}
    </div>
  );
}
