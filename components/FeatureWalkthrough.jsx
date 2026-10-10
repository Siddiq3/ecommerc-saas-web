'use client';

import { useEffect, useRef, useState } from 'react';
import './FeatureWalkthrough.css';

const MEDIA = '/media/ss-menswear';
const CHAPTERS = [
  { id: 'setup', label: 'Set up your store', title: 'Your shop, ready to go online', body: 'Choose what you sell, name your business, add your address and pick a storefront style. Follow SS Mensware from setup to a real shop.', steps: ['Choose Clothing & Fashion', 'Add your store name and contact details', 'Pick a style and create your store'] },
  { id: 'home', label: 'Your dashboard', title: 'Know what needs you today', body: 'Open SS Mensware to see your store status, today’s sales and the orders waiting for your attention.', steps: ['Check that your store is live', 'Review today’s sales', 'See orders that need action'] },
  { id: 'products', label: 'Products & stock', title: 'Every size has its own stock', body: 'Keep shirts, tees and denim together in one catalogue. Open a product to see prices, sizes and the stock available for each option.', steps: ['Browse the menswear catalogue', 'Open the Oxford shirt', 'Check sizes, prices and stock'] },
  { id: 'storefront', label: 'Customer website', title: 'A proper storefront, on one link', body: 'Customers open SS Mensware in their browser, explore categories and browse the collection. No app download needed.', steps: ['Open the store link', 'Explore shirts, tees and denim', 'Browse the complete collection'] },
  { id: 'checkout', label: 'Cart & checkout', title: 'From “I like it” to an order', body: 'Choose a size, add it to the bag and apply WELCOME10. Enter delivery details and place a cash-on-delivery order without creating an account.', steps: ['Choose a size and add to cart', 'Apply a coupon', 'Enter an address and place the order'] },
  { id: 'orders', label: 'Manage orders', title: 'All the details, already on your phone', body: 'Open an order to see the customer, delivery address, items and payment method. Keep fulfilment moving from the same screen.', steps: ['Find the customer’s order', 'Review items and delivery details', 'Follow the order status'] },
  { id: 'payments', label: 'UPI & COD', title: 'Let customers pay their way', body: 'Offer cash on delivery and manual UPI payments. Set your UPI details so customers know where to pay; verify their reference against your bank record.', steps: ['Open store details & payments', 'Set the UPI ID and display name', 'Offer cash on delivery'] },
  { id: 'delivery', label: 'Delivery rules', title: 'Delivery that works for your business', body: 'Set delivery charges, estimated arrival times and a free-delivery threshold. Limit service to selected pincodes when you need to.', steps: ['Review the delivery method', 'Set charges and free-delivery threshold', 'Choose the areas you serve'] },
  { id: 'coupons', label: 'Discount coupons', title: 'Give customers a reason to come back', body: 'Manage discount codes and their conditions. SS Mensware uses WELCOME10 for 10% off eligible orders.', steps: ['Open your coupon list', 'Review the discount and limits', 'Use the code at checkout'] },
  { id: 'categories', label: 'Categories', title: 'Make your collection easy to browse', body: 'Organise your catalogue into Shirts, T-Shirts and Denim. Manage categories from the app so customers can find what they want.', steps: ['See the store categories', 'Open category settings', 'Organise the catalogue'] },
  { id: 'customers', label: 'Customers', title: 'Know who buys from you', body: 'View your customers and their order history in one place. The demo uses sample customer details throughout.', steps: ['Browse customers', 'Open Demo Buyer', 'Review their order history'] },
  { id: 'analytics', label: 'Sales analytics', title: 'See how your shop is doing', body: 'Review sales, orders, average order value and your store’s visitor journey. Compare periods and see your best sellers.', steps: ['Review sales and orders', 'Check visitor conversion', 'See best-selling products'] },
  { id: 'policies', label: 'Store policies', title: 'Give shoppers clear expectations', body: 'Set the return window and manage the policy pages shown in your storefront footer. Review the templates for your own business.', steps: ['Set the product return window', 'Manage published policy pages', 'Review policy text'] },
  { id: 'activity', label: 'Activity history', title: 'Keep up with what changed', body: 'The activity feed brings store events together, including new orders and their payment method.', steps: ['Open the activity feed', 'Review the latest order event', 'See when it happened'] },
  { id: 'social', label: 'Share your store', title: 'Put your store link where you sell', body: 'Copy your storefront link to share it on WhatsApp or Instagram. Instagram Auto DM is marked coming soon in the app.', steps: ['Open the Social tab', 'Review your storefront link', 'Copy the link to share'] },
  { id: 'account', label: 'Account & domain', title: 'Your store controls, together', body: 'Find store settings, profile and account controls in one place. Custom domains require an eligible plan; this trial demo shows that availability.', steps: ['Browse store settings', 'Check custom-domain availability', 'Find your account controls'] },
];

const GROUPS = [
  { title: 'Build Easy.', color: '#B2BEF2', badge: 'linear-gradient(135deg,#4C46D6,#6454D8)', ids: ['setup', 'storefront', 'home', 'social'] },
  { title: 'Add Products Easy.', color: '#B8E2B1', badge: 'linear-gradient(180deg,#C68E4D,#D55E4F)', ids: ['products', 'categories', 'coupons'] },
  { title: 'Manage Orders Easy.', color: '#FFE8BB', badge: 'linear-gradient(135deg,#B46913,#C79229)', ids: ['orders', 'delivery', 'customers', 'activity'] },
  { title: 'Collect Payments Easy.', color: '#E4D5F5', badge: 'linear-gradient(135deg,#6850B2,#9063C2)', ids: ['payments', 'checkout', 'delivery', 'coupons'] },
  { title: 'Run Your Store Easy.', color: '#D0E8F3', badge: 'linear-gradient(135deg,#287692,#4295AD)', ids: ['analytics', 'policies', 'account'] },
];

function FeatureCard({ group, index }) {
  const slides = group.ids.map(id => CHAPTERS.find(item => item.id === id));
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const root = useRef(null);
  const video = useRef(null);
  const chapter = slides[selected];
  const playing = !paused && !expanded && visible && (!reduced || started);
  const choose = (next) => { setSelected(next); setProgress(0); setExpanded(false); setFailed(false); };

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduced(motion.matches);
    syncMotion();
    motion.addEventListener('change', syncMotion);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(root.current);
    return () => { observer.disconnect(); motion.removeEventListener('change', syncMotion); };
  }, []);

  useEffect(() => {
    const player = video.current;
    const sync = () => {
      if (playing && !document.hidden) player.play().catch(() => {});
      else player.pause();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); player.pause(); };
  }, [playing, selected]);

  const toggle = () => { setStarted(true); setPaused(playing); };
  return <section ref={root} className={`feature-group ${index === 2 ? 'feature-orders' : ''} ${index === 3 ? 'feature-payments' : ''}`} aria-labelledby={`feature-heading-${index}`} style={{ '--feature-accent': group.color, '--feature-badge': group.badge }}>
    <div className="feature-container">
      <h2 data-reveal id={`feature-heading-${index}`} className="feature-heading">{group.title}</h2>
      <div data-reveal className={`feature-card ${expanded ? 'is-expanded' : ''}`}>
        <div className="feature-media" key={`media-${chapter.id}`}>
          <div className="feature-phone">
            <video ref={video} src={`${MEDIA}/${chapter.id}.mp4`} poster={`${MEDIA}/${chapter.id}.jpg`} muted playsInline preload="metadata" aria-label={`${chapter.label} — SS Mensware recorded demo`} onError={() => setFailed(true)} onTimeUpdate={e => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))} onEnded={() => choose((selected + 1) % slides.length)} />
          </div>
          {expanded && <button className="feature-scrim" onClick={() => setExpanded(false)} aria-label="Close details" />}
          {failed && <a className="feature-error" href={`${MEDIA}/${chapter.id}.mp4`}>Open demo video</a>}
        </div>
        <div className="feature-copy">
          <div className="feature-copy-content" key={`copy-${chapter.id}`}>
            <div className="feature-callout">
              <span className="feature-badge">{chapter.label}</span>
              <div className="feature-store"><span className="feature-store-mark" aria-hidden="true">SS</span><span>SS Mensware<br /><small>A real app walkthrough</small></span></div>
              {expanded && <button className="feature-close" onClick={() => setExpanded(false)} aria-label="Close details">×</button>}
            </div>
            <h3>{chapter.title}</h3>
            <div className="feature-body"><p>{chapter.body}</p></div>
          </div>
          {!expanded && <button className="feature-learn" onClick={() => setExpanded(true)}>Learn More <span aria-hidden="true">↗</span></button>}
          <div className="feature-controls">
            <div className="feature-progress">
              {slides.map((item, i) => <button key={item.id} className="feature-dot" aria-label={`Watch ${item.label}`} aria-pressed={selected === i} onClick={() => choose(i)}><span className={selected === i ? 'active' : i < selected ? 'complete' : ''}>{selected === i && <span style={{ width: `${progress * 100}%` }} />}</span></button>)}
              <button className="feature-pause" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} slideshow`}><span aria-hidden="true" className={playing ? 'pause-symbol' : 'play-symbol'} /></button>
            </div>
            <div className="feature-arrows">
              <button aria-label="Previous slide" onClick={() => choose((selected - 1 + slides.length) % slides.length)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button>
              <button aria-label="Next slide" onClick={() => choose((selected + 1) % slides.length)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
            </div>
          </div>
        </div>
        {index === 2 && <div className="feature-order-summary">{slides.slice(0, 3).map((item, i) => <button key={item.id} onClick={() => choose(i)} aria-pressed={selected === i}><span className="feature-order-icon" aria-hidden="true">{['☷', '↗', '♧'][i]}</span><h3>{item.title}</h3><p>{item.body}</p></button>)}</div>}
        {index === 3 && <div className="feature-payment-options">{slides.map((item, i) => <button key={item.id} onClick={() => choose(i)} aria-pressed={selected === i}><h3>{item.title}</h3><p>{item.body}</p>{selected === i && <span className="feature-payment-progress" aria-hidden="true"><span style={{ transform: `scaleY(${progress})` }} /></span>}</button>)}</div>}
      </div>
    </div>
  </section>;
}

export function FeatureWalkthrough() {
  return <div id="features" className="feature-walkthrough">
    {GROUPS.map((group, index) => <FeatureCard key={group.title} group={group} index={index} />)}
    <div data-reveal className="feature-footer"><p>Recorded in the real app using SS Mensware and sample orders.</p><a href={`${MEDIA}/full-walkthrough.mp4`}>Watch the full walkthrough ↗</a></div>
  </div>;
}
