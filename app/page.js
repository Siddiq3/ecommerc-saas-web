import Link from 'next/link';
import { BILLING_PLANS, TRIAL_DAYS, formatMoney } from '@storekit/shared';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { PlanFeatureList } from '../components/PlanFeatureList.jsx';
import { PriceText } from '../components/PriceText.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { StoreCarousel } from '../components/StoreCarousel.jsx';
import { AppBadges } from '../components/AppBadges.jsx';
import { Faq } from '../components/Faq.jsx';
import { FeatureWalkthrough } from '../components/FeatureWalkthrough.jsx';
import { ScrollStage } from '../components/ScrollStage.jsx';
import { Logo } from '../components/Logo.jsx';
import { demoStoreUrl } from '../lib/site.js';

/**
 * The landing page, told as one story:
 * the DMs a seller answers by hand all day  →  they collapse into one phone (the store)
 *  →  what the app does, card by card  →  proof  →  price  →  questions  →  start.
 */

// The app's palette: ink, orange, burnt orange, peach, amber.
const INK = 'var(--color-brand-900)';
const RUST = 'var(--color-brand-700)';
const PEACH = 'var(--color-brand-300)';
const AMBER = 'var(--color-amber)';
const ORANGE = 'var(--color-accent-600)';

// Bubbles ring a phone in the middle. side: which side of the phone; y: % of screen
// height; off: extra px away from the phone. Light bubbles carry dark text.
// `sm` ones are hidden on phones.
const DMS = [
  { text: 'is this still available?', emoji: '🤔', b: INK, side: 'l', y: 40, off: 40 },
  { text: 'price pls', emoji: '🙏', b: AMBER, fg: '#101014', side: 'r', y: 38, off: 70 },
  { text: 'size M hai?', emoji: '👕', b: ORANGE, side: 'l', y: 50, off: 150 },
  { text: "where's my order??", emoji: '😰', b: PEACH, fg: '#101014', side: 'r', y: 48, off: 10 },
  { text: 'send your UPI id', emoji: '💸', b: RUST, side: 'l', y: 60, off: 20 },
  { text: 'COD available?', emoji: '🤞', b: AMBER, fg: '#101014', side: 'r', y: 58, off: 160, sm: true },
  { text: 'send more pics of the blue one', emoji: '📸', b: PEACH, fg: '#101014', side: 'l', y: 70, off: 100, sm: true },
  { text: 'can you deliver to Pune?', emoji: '🚚', b: INK, side: 'r', y: 68, off: 40 },
  { text: 'any discount for 2?', emoji: '😊', b: ORANGE, side: 'l', y: 81, off: 30, sm: true },
  { text: 'kab tak aayega?', emoji: '📦', b: RUST, side: 'r', y: 79, off: 130 },
];

// What the merchant sees once the DMs become a store. Cycled around the hero phone.
const TOASTS = [
  { icon: '🛍️', title: 'New order · ₹1,299', sub: 'Oxford shirt, size M', pos: '-left-24 top-[18%] sm:-left-40' },
  { icon: '✅', title: 'UPI payment received', sub: '₹1,169 · ORD-000002', pos: '-right-20 top-[42%] sm:-right-36' },
  { icon: '🚚', title: 'Order shipped', sub: 'to Pune · arriving Friday', pos: '-left-16 bottom-[16%] sm:-left-32' },
];

const MARQUEE = ['boutiques', 'home bakers', 'jewellery', 'thrift stores', 'plant shops', 'handmade', 'menswear', 'cosmetics', 'perfumes', 'home decor'];

// What the app actually does, one card per area (mirrors the merchant app's screens).
const FEATURES = [
  { title: 'products & stock', emoji: '📦', items: ['sizes & colours', 'stock per size', 'categories'], b: ORANGE },
  { title: 'orders', emoji: '🧾', items: ['address & items attached', 'status updates', 'customer history'], b: RUST },
  { title: 'payments', emoji: '💸', items: ['UPI', 'cash on delivery', '0% commission'], b: AMBER },
  { title: 'your storefront', emoji: '🛍️', items: ['one link to share', 'ready-made designs', 'custom domain'], b: INK },
  { title: 'delivery', emoji: '🚚', items: ['delivery charges', 'free-delivery threshold', 'pincodes you serve'], b: ORANGE },
  { title: 'grow sales', emoji: '📈', items: ['discount coupons', 'sales analytics', 'best sellers'], b: RUST },
  { title: 'khata & day book', emoji: '📒', items: ['who owes you', 'daily cash book', 'bills & expenses'], b: AMBER },
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
    a: 'No. Your store gets its own StoreKit link the moment you create it. If you want your own domain, the Business and Pro plans let you connect one.',
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
        {/* ───────────── 1. The DMs ───────────── */}
        <ScrollStage className="dm-stage h-[230vh] bg-white" aria-labelledby="dm-heading">
          <svg aria-hidden="true" className="dm-line absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
            <path
              pathLength="1"
              d="M1500 120C1300 60 1180 160 1240 260S1420 300 1360 160 1080 140 980 360 700 760 380 720 120 820 200 960"
              stroke={ORANGE}
              strokeWidth="14"
              strokeLinecap="round"
            />
          </svg>

          <div className="dm-intro relative px-5 pt-[10vh] text-center sm:pt-[12vh]">
            <h2 id="dm-heading" className="dm-heading mx-auto max-w-4xl">
              Start your online store selling from{' '}
              <span className="whitespace-nowrap italic text-accent-600">
                {formatMoney(cheapest.monthlyPaise)}<span aria-hidden="true" className="emoji not-italic">😮</span>
              </span>
            </h2>
            <p className="serif-italic mt-3 text-xl font-semibold text-ink-700 sm:text-2xl">
              turn these DMs into orders <span aria-hidden="true" className="dm-scroll inline-block not-italic text-accent-600">↓</span>
            </p>
          </div>

          <div className="phone dm-phone" aria-hidden="true">
            <img src="/media/ss-menswear/orders.jpg" alt="" width="540" height="1200" />
          </div>

          {DMS.map((dm, index) => (
            <span
              key={dm.text}
              aria-hidden="true"
              className={`dm dm-${dm.side} ${dm.sm ? 'hidden sm:block' : ''}`}
              style={{ '--y': dm.y, '--off': dm.off, '--i': index }}
            >
              <span className={`chat-bubble ${dm.side === 'r' ? '' : 'tail-right'}`} style={{ '--b': dm.b, '--fg': dm.fg }}>
                {dm.text}
              </span>
              <span className={`dm-emoji ${dm.side === 'r' ? '' : 'dm-emoji-right'}`}>{dm.emoji}</span>
            </span>
          ))}
        </ScrollStage>

        {/* ───────────── 2. Hero ───────────── */}
        <section className="hero-wash relative overflow-hidden">
          <div className="shell grid items-center gap-12 py-20 lg:min-h-[100dvh] lg:grid-cols-2 lg:py-20">
            <div className="order-2 flex justify-center lg:order-1">
              <div className="relative">
                <div className="phone -rotate-[8deg]">
                  <img src="/media/ss-menswear/home.jpg" alt="The StoreKit app: today's sales and new orders for SS Mensware" width="540" height="1200" />
                </div>
                <span aria-hidden="true" className="absolute -bottom-10 left-1/2 h-10 w-[130%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-xl" />
                {TOASTS.map((toast, index) => (
                  <div key={toast.title} aria-hidden="true" className={`toast z-10 ${toast.pos}`} style={{ '--d': `${index * 3}s` }}>
                    <span className="text-xl">{toast.icon}</span>
                    <span>
                      <span className="block font-semibold text-ink-900">{toast.title}</span>
                      <span className="block text-xs text-ink-500">{toast.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 text-center lg:order-2">
              <h1 data-reveal className="display-1">
                meet <span className="whitespace-nowrap italic text-accent-600">StoreKit</span>
                <br />
                your online store
              </h1>
              <p data-reveal className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-600">
                Every DM becomes an order — with the size, address and payment already on it.
                From {formatMoney(cheapest.monthlyPaise)} a month.
              </p>
              <div data-reveal className="mt-8 flex flex-col items-center gap-4">
                <Link href="/signup" className="btn-primary btn-lg px-12">start free</Link>
                <p className="serif-italic text-lg font-semibold text-accent-600">
                  for shops that sell on WhatsApp &amp; Instagram
                </p>
                <AppBadges className="mt-2" />
                <p className="text-sm text-ink-500">
                  <span aria-hidden="true">✨</span> {TRIAL_DAYS} days free · no card needed ·{' '}
                  <a href={demoStoreUrl('ss-mensware')} target="_blank" rel="noreferrer" className="font-semibold text-brand-900 underline underline-offset-2">see a demo store</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── Who it is for ───────────── */}
        <div className="marquee-band overflow-hidden bg-accent-600 py-5" aria-label="Built for every kind of shop">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {MARQUEE.map((item) => (
                  <li key={item} className="flex items-center whitespace-nowrap px-6 font-display text-2xl font-semibold italic text-white sm:text-3xl">
                    {item}<span aria-hidden="true" className="ml-12 text-amber not-italic">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ───────────── 3. What it does: cards turn out of the phone ───────────── */}
        <ScrollStage id="how" className="paper-grid h-[420vh] scroll-mt-0" aria-labelledby="wheel-heading" style={{ '--n': FEATURES.length }}>
          <svg aria-hidden="true" className="dm-line absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
            <path pathLength="1" d="M-40 140C200 40 420 60 500 -20M140 120C60 300 200 460 460 450S1000 340 1120 520 1000 760 860 700" stroke={ORANGE} strokeWidth="14" strokeLinecap="round" />
          </svg>

          <h2 id="wheel-heading" className="display-2 relative mx-auto max-w-2xl px-5 pt-20 text-center sm:pt-24">
            what can <span className="italic text-accent-600">StoreKit</span> do for my shop?
          </h2>

          <ul className="wheel">
            {FEATURES.map((feature, index) => (
              <li key={feature.title} className="wheel-arm" style={{ '--i': index }}>
                <div className="wheel-card" style={{ '--b': feature.b }}>
                  <h3 className="font-sans text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {feature.title} <span aria-hidden="true">{feature.emoji}</span>
                  </h3>
                  <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm font-medium text-white/85 sm:text-base">
                    {feature.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <div className="phone wheel-phone" aria-hidden="true">
            <div className="flex h-full flex-col items-center bg-[#f4efe6] pt-[30%]">
              <Logo />
              <span className="mt-6 rounded-lg bg-[#d9fdd3] px-4 py-2 text-xs text-ink-900 shadow-sm sm:text-sm">what can you do for my shop?</span>
            </div>
          </div>
        </ScrollStage>

        {/* ───────────── 4. See it in action ───────────── */}
        <FeatureWalkthrough />

        <section className="overflow-hidden bg-canvas py-20 sm:py-24">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <h2 className="display-2">this is what <span className="italic text-accent-600">yours</span> will look like</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">Whatever you sell, the store is built for it. Drag to look around.</p>
            </div>
          </div>
          <div data-reveal className="mt-14"><StoreCarousel /></div>
        </section>

        {/* ───────────── 5. Sellers ───────────── */}
        <section className="relative overflow-hidden bg-brand-900 py-24 sm:py-32">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none">
            <path d="M1100 -20C900 120 520 160 470 360S760 700 880 820" stroke={ORANGE} strokeWidth="18" strokeLinecap="round" />
          </svg>
          <div className="shell relative grid items-center gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <figure
                key={item.name}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms`, rotate: ['-2deg', '1.5deg', '-1deg'][index] }}
                className={`rounded-md bg-surface p-6 shadow-float ${index === 2 ? 'lg:col-start-2' : ''} ${index === 1 ? 'lg:col-start-3 lg:row-start-1' : ''}`}
              >
                <figcaption className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${item.tone} text-sm font-bold text-white`}>{item.name.charAt(0)}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">{item.name}</span>
                    <span className="block text-xs text-ink-500">{item.role}</span>
                  </span>
                </figcaption>
                <blockquote className="mt-4 leading-relaxed text-ink-800">{item.quote}</blockquote>
              </figure>
            ))}
            <h2 data-reveal className="display-2 order-first text-center italic text-white lg:order-none lg:col-start-2 lg:row-start-1">
              made with sellers like you
            </h2>
          </div>
          <p data-reveal className="shell relative mt-12 text-center text-xs text-white/60">
            Early access. These are the problems merchants told us about while we built it.
          </p>
        </section>

        {/* ───────────── 6. Pricing ───────────── */}
        <section id="pricing" className="paper-grid scroll-mt-24 py-24 sm:py-32">
          <div className="shell">
            <div data-reveal className="mx-auto max-w-2xl text-center">
              <h2 className="display-2">pick a plan when you are <span className="italic text-accent-600">ready</span></h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">Every plan starts with {TRIAL_DAYS} days free. No card until you decide to stay.</p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {BILLING_PLANS.map((plan, index) => (
                <div
                  key={plan.planId}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 80}ms` }}
                  className={`relative rounded-xl p-8 ${plan.featured ? 'border-2 border-accent-600 bg-surface shadow-lift' : 'border border-line bg-surface shadow-card'}`}
                >
                  {plan.badge && <span className="pill absolute -top-3 left-8 bg-accent-600 text-white">{plan.badge}</span>}
                  <h3 className="display-3">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-500">{plan.tagline}</p>
                  <p className="mt-7 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-semibold text-brand-900"><PriceText paise={plan.monthlyPaise} /></span>
                    <span className="text-sm text-ink-500">/ month</span>
                  </p>
                  <PlanFeatureList features={plan.featureList} className="mt-7 space-y-2.5" />
                  <Link href={`/subscribe?plan=${plan.planId}`} className={`mt-8 w-full ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>Pay now</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── 7. Questions ───────────── */}
        <section className="paper-grid pb-24 sm:pb-32">
          <div className="mx-auto max-w-5xl bg-amber px-6 py-16 sm:px-14 sm:py-20">
            <h2 data-reveal className="display-2 text-center">frequently asked <span className="italic">questions</span></h2>
            <Faq items={HOME_FAQ} />
          </div>
        </section>

        {/* ───────────── 8. Start ───────────── */}
        <section className="paper-grid pb-24 sm:pb-32">
          <div className="shell">
            <div data-reveal className="rounded-xl bg-accent-600 px-6 py-20 text-center sm:py-24">
              <p className="mx-auto max-w-md text-2xl font-medium leading-snug text-white sm:text-3xl">
                the best sellers you know stopped taking orders in DMs
              </p>
              <p className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">now <span className="italic">you</span> can too!</p>
              <Link href="/signup" className="btn-primary btn-lg mt-9 bg-ink-900 px-12 shadow-float hover:bg-ink-700">start free</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
