import { SignupForm } from './SignupForm.jsx';
import { Logo } from '../../components/Logo.jsx';
import { AppBadges } from '../../components/AppBadges.jsx';
import { SITE } from '../../lib/site.js';

export const metadata = {
  title: 'Create your account',
  description: `Create your ${SITE.name} account, then set up your store in the app.`,
};

export default function SignupPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="shell flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <main id="main" className="shell flex min-h-[calc(100dvh-4rem)] items-center justify-center py-16">
        {/* Server-rendered badges handed to the form, which shows them once the account exists. */}
        <SignupForm appBadges={<AppBadges className="mt-6" />} />
      </main>
    </div>
  );
}
