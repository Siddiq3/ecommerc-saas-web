'use client';

import { useState } from 'react';
import {
  BILLING_PLANS, PLANS, COMPARISON_ROWS, TRIAL_DAYS,
  priceFor, effectiveMonthlyPrice, yearlySavingPercent, formatMoney,
} from '@storekit/shared';
import { appStoreUrl } from '../lib/site.js';

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-accent-600">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Dash = () => (
  <span aria-hidden="true" className="text-ink-400">
    &ndash;
  </span>
);

/** Renders a limit from the entitlement table in the unit a shopkeeper thinks in. */
const formatLimit = (value, format) => {
  if (format === 'boolean') return value;
  if (format === 'bytes') {
    const gb = value / (1024 * 1024 * 1024);
    return gb >= 1 ? `${Math.round(gb)} GB` : `${Math.round(value / (1024 * 1024))} MB`;
  }
  if (format === 'days') return value >= 365 ? `${Math.round(value / 365)} year${value >= 730 ? 's' : ''}` : `${value} days`;
  return new Intl.NumberFormat('en-IN').format(value);
};

export function PlanCards() {
  const [cycle, setCycle] = useState('monthly');
  const saving = yearlySavingPercent();

  return (
    <>
      {/* Billing cycle toggle */}
      <div className="mt-10 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing cycle"
          className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-card"
        >
          {[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ].map((option) => {
            const active = cycle === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCycle(option.value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  active ? 'bg-accent-600 text-white' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {option.label}
                {option.value === 'yearly' && (
                  <span className={`ml-2 text-xs font-bold ${active ? 'text-accent-100' : 'text-accent-700'}`}>
                    save {saving}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-ink-500" aria-live="polite">
        {cycle === 'yearly'
          ? 'Billed once a year. Works out to ten months for twelve.'
          : 'Billed every month. Switch to yearly whenever you like.'}
      </p>

      {/* Plan cards */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {BILLING_PLANS.map((plan) => {
          const total = priceFor(plan.planId, cycle);
          const perMonth = effectiveMonthlyPrice(plan.planId, cycle);

          return (
            <div
              key={plan.planId}
              className={`card relative flex flex-col p-7 ${
                plan.popular ? 'ring-2 ring-accent-600 lg:-my-3 lg:py-10' : ''
              }`}
            >
              {plan.popular && (
                <span className="pill absolute -top-3 left-7 bg-accent-600 text-white">Most popular</span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{plan.tagline}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-ink-900">{formatMoney(perMonth)}</span>
                <span className="text-sm text-ink-500"> / month</span>
                {cycle === 'yearly' && (
                  <p className="mt-1.5 text-sm text-ink-500">{formatMoney(total)} billed yearly</p>
                )}
              </div>

              <a
                href={appStoreUrl()}
                className={`${plan.popular ? 'btn-primary' : 'btn-secondary'} mt-7 w-full py-3`}
              >
                Start {TRIAL_DAYS}-day trial
              </a>

              <ul className="mt-8 space-y-3.5">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Comparison table. Scrolls horizontally on a phone rather than shrinking to
          illegibility, which is the one place a wide table is acceptable. */}
      <div className="mt-24">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Compare every plan</h2>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Feature comparison across StoreKit plans</caption>
            <thead>
              <tr className="border-b border-line-strong">
                <th scope="col" className="py-4 pr-4 text-sm font-semibold text-ink-900">
                  Feature
                </th>
                {BILLING_PLANS.map((plan) => (
                  <th key={plan.planId} scope="col" className="px-4 py-4 text-sm font-semibold text-ink-900">
                    {plan.name}
                    <span className="mt-0.5 block text-xs font-normal text-ink-500">
                      {formatMoney(effectiveMonthlyPrice(plan.planId, cycle))}/mo
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-line">
                  <th scope="row" className="py-4 pr-4 text-sm font-normal text-ink-700">
                    {row.label}
                  </th>
                  {BILLING_PLANS.map((plan) => {
                    const value = PLANS[plan.planId]?.[row.key];
                    const display = formatLimit(value, row.format);
                    return (
                      <td key={plan.planId} className="px-4 py-4 text-sm text-ink-800">
                        {row.format === 'boolean' ? (
                          display ? <Check /> : <Dash />
                        ) : (
                          display
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
