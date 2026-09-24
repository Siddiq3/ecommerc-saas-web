/**
 * What a plan includes and what it does not: a tick or a cross beside every feature, the same
 * list for every plan so the three cards line up and the gap between them is visible at a glance.
 *
 * Reads `plan.featureList` (from the shared plan data) and decides nothing itself. A cross is drawn
 * quieter than a tick — you should see what you get first — but never hidden, and both carry text
 * for screen readers because a symbol alone says nothing to them.
 */
const Tick = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-accent-600">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-ink-400">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export function PlanFeatureList({ features, className = 'mt-8 space-y-3.5' }) {
  return (
    <ul className={className}>
      {features.map((feature) => (
        <li key={feature.label} className="flex gap-2.5 text-sm leading-relaxed">
          {feature.included ? <Tick /> : <Cross />}
          <span className={feature.included ? 'text-ink-700' : 'text-ink-400'}>
            <span className="sr-only">{feature.included ? 'Included: ' : 'Not included: '}</span>
            {feature.label}
            {feature.note && <span className="ml-1.5 whitespace-nowrap text-xs font-medium text-ink-500">{feature.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export { Tick, Cross };
