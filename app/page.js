import Link from 'next/link';
import { BILLING_PLANS, TRIAL_DAYS, formatMoney } from '@storekit/shared';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { PriceText } from '../components/PriceText.jsx';
import { StoreFan } from '../components/StoreFan.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { StoreCarousel } from '../components/StoreCarousel.jsx';
import { Counter } from '../components/Counter.jsx';
import { AppBadges } from '../components/AppBadges.jsx';
import { Faq } from '../components/Faq.jsx';

/**
 * The landing page.
 *
 * Structured as one argument, told once: here is the problem (orders scattered across
 * chats), here is the thing (a real storefront), here is proof it works, here is what it
 * costs. Each section is one idea; nothing is repeated in different words.
 */

const FEATURES = [
  {
    emoji: '🔗',
    title: 'One link that is actually yours',
    body: 'Your shop gets its own page. Put it in your Instagram bio or send it on WhatsApp — customers browse and order without downloading a thing.',
  },
  {
    emoji: '💸',
    title: 'UPI and cash on delivery',
    body: 'The payments your customers already use. UPI references land in your dashboard to confirm against your own bank record.',
  },
  {
    emoji: '🛒',
    title: 'No sign-up to buy',
    body: 'No account, no password, no drop-off. They pick, enter an address, and the order lands on your phone.',
  },
  {
    emoji: '📐',
    title: 'Sizes, colours and stock',
    body: 'Stock per size and colour. When the last one sells it stops being orderable, so you never take an order you cannot fill.',
  },
  {
    emoji: '🎟️',
    title: 'Coupons and delivery rules',
    body: 'Run a discount code, set a flat delivery charge, or make delivery free over an amount you choose.',
  },
  {
    emoji: '🔒',
    title: 'Built to be trusted',
    body: 'Your customers’ details stay yours. Payments are verified, and every change to an order is recorded.',
  },
];

const STEPS = [
  {
    n: '01',
    emoji: '📸',
    title: 'Add your products',
    body: 'Photograph, price, publish. Sizes and colours if you need them, skipped entirely if you do not.',
  },
  {
    n: '02',
    emoji: '🔗',
    title: 'Share your link',
    body: 'Post it once. Every customer who taps it lands in a store that looks like it was built for you.',
  },
  {
    n: '03',
    emoji: '📦',
    title: 'Take the order',
    body: 'Confirm the payment, pack it, mark it shipped. Your customer can follow it the whole way.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'I was copying addresses out of WhatsApp into a notebook. Now the order arrives with the address already on it.',
    name: 'Asha R.',
    role: 'Boutique · Hyderabad',
    tone: 'bg-[#527a66]',
  },
  {
    quote: 'Customers stopped asking “is this still available”. If it is on the page, it is in stock.',
    name: 'Meera K.',
    role: 'Home baker · Pune',
    tone: 'bg-[#8b6d47]',
  },
  {
    quote: 'Setting it up took one evening. The part I expected to be hard — taking payment — was the easy bit.',
    name: 'Rahul S.',
    role: 'Thrift store · Bengaluru',
    tone: 'bg-[#4e716f]',
  },
];

const HOME_FAQ = [
  {
    q: 'Do I need a card to start?',
    a: `No. The ${TRIAL_DAYS}-day trial starts the moment you create your store, and we only ask for payment details if you decide to carry on.`,
  },
  {
    q: 'How do my customers pay me?',
    a: 'Cash on delivery and UPI, and they pay you directly. StoreKit never sits between you and your money, and takes no cut of your sales.',
  },
  {
    q: 'Do I need a website or a domain?',
    a: 'No. Your store gets its own link the moment you create it. You can point your own domain at it later if you want to.',
  },
  {
    q: 'What if I already sell on WhatsApp and Instagram?',
    a: 'Keep doing exactly that. Share your store link instead of a price list, and the order arrives with the address, the items and the payment already attached.',
  },
];

export default function LandingPage() {
  const cheapest = [...BILLING_PLANS].sort((a, b) => a.monthlyPaise - b.monthlyPaise)[0];

  return (
    <>
      <Reveal />
      <SiteHeader />

      <main id="main">
        {/* ───────────── Hero ───────────── */}
        <section className="relative overflow-hidden bg-canvas pb-4 pt-12 sm:pt-16">
          <div className="aurora" aria-hidden="true" />

          <div className="shell relative">
            <h1 className="display-1 word-rise mx-auto max-w-4xl text-center">
              {['Start', 'your', 'online', 'store'].map((word, index) => (
                <span key={word} style={{ '--word-index': index }}>
                  {word}&nbsp;
                </span>
              ))}
              <span style={{ '--word-index': 4 }}>selling&nbsp;</span>
              <span style={{ '--word-index': 5 }}>
                from&nbsp;
                <span className="highlight-ring">
                  {formatMoney(cheapest.monthlyPaise)}
                  <span aria-hidden="true" className="emoji">😮</span>
                </span>
              </span>
            </h1>
          </div>

          {/* Full-bleed: the fan reads as a shelf that carries on past the screen. */}
          <div className="relative mt-6">
            <StoreFan />
          </div>

          <div className="shell relative mt-2 text-center">
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              StoreKit turns your WhatsApp and Instagram shop into a real online store —
              in minutes.
            </p>

            <AppBadges className="mt-9" />

            <p className="mt-5 text-sm text-ink-500">
              <span aria-hidden="true">✨</span> {TRIAL_DAYS} days free · no card needed · cancel anytime
            </p>
          </div>
        </section>

        {/* ───────────── Example stores ───────────── */}
        <section className="overflow-hidden bg-canvas py-20 sm:py-24">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">🏪 Real shops</p>
              <h2 className="display-2 mt-4">This is what yours will look like</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Whatever you sell, the store is built for it. Drag to look around.
              </p>
            </div>
          </div>

          <div data-reveal className="mt-14">
            <StoreCarousel />
          </div>

          <p className="shell mt-12 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            Boutiques · Home bakers · Jewellery · Thrift stores · Plant shops · Handmade
          </p>
        </section>


        {/* ───────────── Features, as a bento grid ───────────── */}
        <section id="features" className="scroll-mt-20 py-24 sm:py-32">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">⚡ Everything you need</p>
              <h2 className="display-2 mt-4">The tedious parts of a shop, handled</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Not a website builder. A shop that already knows what a shop needs to do.
              </p>
            </div>

            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              {/* The lead cell is wider and carries a visual, so the grid has a focal point
                  instead of six identical boxes. */}
              <div data-reveal className="bento lg:col-span-2">
                <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-2 md:items-center">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-canvas text-2xl">
                      <span aria-hidden="true">📱</span>
                    </span>
                    <h3 className="display-3 mt-6">Run the whole thing from your phone</h3>
                    <p className="mt-3 leading-relaxed text-ink-600">
                      Orders, stock, payments and customers. No laptop, no spreadsheet, no
                      “I will update it when I get home”.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="mx-auto w-full max-w-[180px] rounded-xl border border-line bg-canvas p-2.5 shadow-lift">
                      <div className="rounded-lg bg-surface p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Needs you</p>
                        {[
                          { label: 'New orders', count: 3, tone: 'bg-ink-900' },
                          { label: 'Verify payment', count: 1, tone: 'bg-[#c39c6c]' },
                          { label: 'Ready to ship', count: 5, tone: 'bg-[#527a66]' },
                        ].map((row) => (
                          <div key={row.label} className="mt-2.5 flex items-center gap-2">
                            <span className={`h-6 w-6 shrink-0 rounded-md ${row.tone}`} />
                            <span className="flex-1 truncate text-[11px] font-medium text-ink-800">{row.label}</span>
                            <span className="text-[11px] font-bold text-ink-900">{row.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {FEATURES.slice(0, 1).map((feature) => (
                <div key={feature.title} data-reveal style={{ '--reveal-delay': '80ms' }} className="bento p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-canvas text-2xl">
                    <span aria-hidden="true">{feature.emoji}</span>
                  </span>
                  <h3 className="display-3 mt-6">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-600">{feature.body}</p>
                </div>
              ))}

              {FEATURES.slice(1).map((feature, index, all) => (
                <div
                  key={feature.title}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 60}ms` }}
                  className={`bento p-8 ${index === all.length - 1 ? 'lg:col-span-2' : ''}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-canvas text-2xl">
                    <span aria-hidden="true">{feature.emoji}</span>
                  </span>
                  <h3 className="display-3 mt-6">{feature.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink-600">{feature.body}</p>

                  {index === all.length - 1 && (
                    <ul className="mt-7 flex flex-wrap gap-2.5">
                      {['Payments verified by you', 'Every order change recorded', 'Customer data stays yours'].map(
                        (claim) => (
                          <li
                            key={claim}
                            className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink-600"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent-600">
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {claim}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── Dark band: how it works ───────────── */}
        <section id="how" className="scroll-mt-20 bg-ink-900 py-24 sm:py-32">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">🚀 How it works</p>
              <h2 className="display-2 mt-4 text-white">Three steps, then you are selling</h2>
            </div>

            <ol className="mt-16 grid gap-10 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.n} data-reveal style={{ '--reveal-delay': `${index * 90}ms` }} className="relative">
                  <span className="flex items-center gap-3">
                    <span className="font-display text-5xl font-extrabold leading-none text-white/20">{step.n}</span>
                    <span className="text-2xl" aria-hidden="true">{step.emoji}</span>
                  </span>
                  <h3 className="display-3 mt-4 text-white">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/60">{step.body}</p>
                </li>
              ))}
            </ol>

            <div
              data-reveal
              className="mt-20 grid gap-8 rounded-xl border border-white/10 bg-white/5 p-8 sm:grid-cols-3 sm:p-10"
            >
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-white">
                  <Counter to={TRIAL_DAYS} suffix=" days" />
                </p>
                <p className="mt-1.5 text-sm text-white/60">Free, with no card</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-white">0%</p>
                <p className="mt-1.5 text-sm text-white/60">Commission on your sales, ever</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-white">
                  <Counter to={2} suffix=" minutes" />
                </p>
                <p className="mt-1.5 text-sm text-white/60">To add your first product</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── Testimonials ───────────── */}
        <section className="py-24 sm:py-32">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">💬 From shop owners</p>
              <h2 className="display-2 mt-4">What changes on day one</h2>
            </div>

            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((item, index) => (
                <figure
                  key={item.name}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 80}ms` }}
                  className="bento flex flex-col p-8"
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ink-200">
                    <path
                      d="M9 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c0-3 0-6-5-6M20 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c0-3 0-6-5-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink-800">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-6">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${item.tone} text-sm font-bold text-white`}
                    >
                      {item.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink-900">{item.name}</span>
                      <span className="block text-xs text-ink-500">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Said plainly, because a fabricated count would be worse than an empty space. */}
            <p data-reveal className="mt-10 text-center text-xs text-ink-400">
              Early access. These are the problems merchants told us about while we built it.
            </p>
          </div>
        </section>

        {/* ───────────── Pricing teaser ───────────── */}
        <section className="bg-canvas py-24 sm:py-32">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">💳 Pricing</p>
              <h2 className="display-2 mt-4">Pick a plan when you are ready</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Every plan starts with {TRIAL_DAYS} days free. No card until you decide to stay.
              </p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {BILLING_PLANS.map((plan, index) => (
                <div
                  key={plan.planId}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 80}ms` }}
                  className={`relative rounded-xl p-8 transition-shadow ${
                    plan.popular
                      ? 'bg-ink-900 text-white shadow-lift'
                      : 'border border-line bg-canvas shadow-card'
                  }`}
                >
                  {plan.popular && (
                    <span className="pill absolute -top-3 left-8 bg-ink-900 text-white">
                      Most popular
                    </span>
                  )}

                  <h3 className={`display-3 ${plan.popular ? 'text-white' : ''}`}>{plan.name}</h3>
                  <p className={`mt-1.5 text-sm ${plan.popular ? 'text-white/60' : 'text-ink-500'}`}>
                    {plan.tagline}
                  </p>

                  <p className="mt-7 flex items-baseline gap-1.5">
                    <span className={`font-display text-4xl font-bold ${plan.popular ? 'text-white' : 'text-ink-900'}`}>
                      <PriceText paise={plan.monthlyPaise} />
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-ink-500'}`}>/ month</span>
                  </p>

                  <ul className={`mt-7 space-y-2.5 text-sm ${plan.popular ? 'text-white/75' : 'text-ink-600'}`}>
                    {plan.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex gap-2.5">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          className={`mt-0.5 shrink-0 ${plan.popular ? 'text-white/70' : 'text-ink-900'}`}
                        >
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/pricing"
                    className={`mt-8 w-full ${
                      plan.popular ? 'btn bg-white text-ink-900 hover:bg-ink-200' : 'btn-secondary'
                    }`}
                  >
                    See what is included
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── Questions ───────────── */}
        <section className="border-t border-line py-24 sm:py-32">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">🙋 Before you start</p>
              <h2 className="display-2 mt-4">The things people ask first</h2>
            </div>
            <Faq items={HOME_FAQ} />
          </div>
        </section>

        {/* ───────────── Closing CTA ───────────── */}
        <section className="py-24 sm:py-32">
          <div className="shell">
            <div
              data-reveal
              className="relative overflow-hidden rounded-xl bg-ink-900 px-8 py-20 text-center sm:px-16"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(55% 70% at 22% 0%, rgb(255 255 255 / 0.1) 0%, transparent 60%), radial-gradient(45% 60% at 88% 100%, rgb(130 176 152 / 0.16) 0%, transparent 60%)',
                }}
              />
              <div className="relative">
                <h2 className="display-2 text-white">Put your shop online this week</h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                  Download the app, add a few products, share your link. You could be taking
                  orders tonight.
                </p>
                <AppBadges className="mt-10" />
                <p className="mt-6 text-sm text-white/70">
                  <span aria-hidden="true">✨</span>
                {TRIAL_DAYS} days free · no card needed · cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
