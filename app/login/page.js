import { Suspense } from 'react';
import { LoginForm } from './LoginForm.jsx';
import { Logo } from '../../components/Logo.jsx';

export const metadata = {
  title: 'Sign in',
  description: 'Sign in to manage your StoreKit subscription and billing.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <main id="main" className="shell flex min-h-[calc(100dvh-4rem)] items-center justify-center py-16">
        <Suspense fallback={<div className="card w-full max-w-md p-8"><p className="text-sm text-ink-500">Loading…</p></div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
