import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader.jsx';
import { SiteFooter } from '../../components/SiteFooter.jsx';
import { PlanCards } from '../../components/PlanCards.jsx';
import { Reveal } from '../../components/Reveal.jsx';
import { Faq } from '../../components/Faq.jsx';
import { AppBadges } from '../../components/AppBadges.jsx';
import { TRIAL_DAYS } from '@storekit/shared';

export const metadata = {
  title: 'Pricing',
  description: `Simple plans for small shops. Start with ${TRIAL_DAYS} days free, no card required.`,
};

const FAQ = [
  {
    q: 'What happens after the free trial?',
    a: `Your store keeps everything you added. You pick a plan from inside the app to carry on selling, and nothing is deleted while you decide.`,
  },
  {
    q: 'Do I need a card to start?',
    a: 'No. The trial starts the moment you create your store, and we only ask for payment details if you choose a plan.',
  },
  {
    q: 'How do my customers pay me?',
    a: 'Cash on delivery and UPI. Customers pay you directly. StoreKit never sits between you and your money, and takes no cut of your sales.',
  },
  {
    q: 'Can I change plan later?',
    a: 'Yes, up or down, whenever you like. If you move down to a smaller plan we will tell you first if your store is over that plan’s limits.',
  },
  {
    q: 'Do I need my own domain?',
    a: 'No. Every store gets a StoreKit link the moment it is created. If you want your own domain instead, connect it on the Business plan (one domain) or the Pro plan.',
  },
  {
    q: 'What happens to my domains if I move to a smaller plan?',
    a: 'Nothing is removed. Domains you have already connected stay active. You just cannot add another until you are back within your new plan’s allowance, and you choose which ones to remove.',
  },
  {
    q: 'Can I cancel?',
    a: 'Any time. Your store stays live until the end of the period you have already paid for.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Reveal />
      <SiteHeader />

      <main id="main">
        <section className="relative overflow-hidden">
          <div className="aurora" aria-hidden="true" />
          <div className="absolute inset-0 grid-texture" aria-hidden="true" />

          <div className="shell relative pb-20 pt-14 sm:pt-20">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">💳 Pricing</p>
              <h1 className="display-1 mt-4">
                Priced for a small shop <span aria-hidden="true" className="emoji">🏷️</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-600 sm:text-xl">
                {TRIAL_DAYS} days free on every plan. No card to start, no commission on your sales.
              </p>
            </div>

            <div data-reveal style={{ '--reveal-delay': '120ms' }}>
              <PlanCards />
            </div>
          </div>
        </section>

        <section className="bg-canvas py-20 sm:py-24">
          <div className="shell">
            <h2 data-reveal className="display-2 text-center">
              Questions people ask <span aria-hidden="true" className="emoji">🙋</span>
            </h2>

<Faq items={FAQ} />
          </div>
        </section>

        <section className="py-20">
          <div className="shell">
            <div
              data-reveal
              className="relative overflow-hidden rounded-xl bg-ink-900 px-8 py-16 text-center sm:px-16"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(55% 70% at 22% 0%, rgb(255 255 255 / 0.1) 0%, transparent 60%), radial-gradient(45% 60% at 88% 100%, rgb(130 176 152 / 0.16) 0%, transparent 60%)',
                }}
              />
              <h2 className="display-2 relative text-white">Try it before you pay for it</h2>
              <p className="relative mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/85">
                Add your products, share your link, and see if customers order. Then pick a plan.
              </p>
              <AppBadges className="relative mt-9" />
              <Link
                href="/#features"
                className="relative mt-6 inline-block text-sm font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline"
              >
                See what is included
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
