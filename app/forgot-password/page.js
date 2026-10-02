import { RecoveryForm } from './RecoveryForm.jsx';
import { Logo } from '../../components/Logo.jsx';

export const metadata = {
  title: 'Reset password',
  description: 'Reset your StoreKit account password.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center"><Logo /></div>
      </header>
      <main id="main" className="shell flex min-h-[calc(100dvh-4rem)] items-center justify-center py-16">
        <RecoveryForm />
      </main>
    </div>
  );
}
