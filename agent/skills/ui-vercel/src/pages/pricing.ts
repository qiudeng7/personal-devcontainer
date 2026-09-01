import { icons } from '../components/icons';
import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';
import { siteNavigation } from './shared';

type BillingPeriod = 'monthly' | 'yearly';

interface Plan {
  readonly name: string;
  readonly description: string;
  readonly monthlyPrice: number | null;
  readonly yearlyPrice: number | null;
  readonly action: 'start' | 'contact';
  readonly highlighted?: boolean;
  readonly features: readonly string[];
}

const plans: readonly Plan[] = [
  {
    name: 'Hobby',
    description: 'For personal projects and experiments.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    action: 'start',
    features: [
      'Import from any Git provider',
      'Automatic HTTPS and previews',
      '100 GB monthly transfer',
    ],
  },
  {
    name: 'Pro',
    description: 'For teams shipping production software.',
    monthlyPrice: 20,
    yearlyPrice: 16,
    action: 'start',
    highlighted: true,
    features: ['Everything in Hobby', '1 TB monthly transfer', 'Team collaboration and analytics'],
  },
  {
    name: 'Enterprise',
    description: 'For organizations with advanced requirements.',
    monthlyPrice: null,
    yearlyPrice: null,
    action: 'contact',
    features: ['Everything in Pro', 'SAML SSO and audit logs', 'Dedicated support and SLAs'],
  },
];

const questions = [
  ['Can I change plans later?', 'Yes. You can move between plans as your team and usage change.'],
  [
    'What counts as a team member?',
    'A member is anyone invited to collaborate inside your workspace.',
  ],
  [
    'Is annual billing refundable?',
    'Annual plans follow the terms shown during checkout for your region.',
  ],
] as const;

function priceLabel(plan: Plan, period: BillingPeriod): string {
  const price = period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  if (price === null) return '<strong>Custom</strong><small>Tailored to your organization</small>';
  if (price === 0) return '<strong>$0</strong><small>Free forever</small>';
  return `<strong>$${price}</strong><small>per member / month${period === 'yearly' ? ', billed annually' : ''}</small>`;
}

function planCard(plan: Plan): string {
  return `<article class="pricing-card${plan.highlighted ? ' pricing-card--featured' : ''}" data-plan="${plan.name.toLowerCase()}">
    ${plan.highlighted ? '<span class="pricing-card__flag">Most popular</span>' : ''}
    <header>
      <h2>${plan.name}</h2>
      <p>${plan.description}</p>
    </header>
    <div class="pricing-card__price" data-price>${priceLabel(plan, 'monthly')}</div>
    ${
      plan.action === 'contact'
        ? '<button class="ui-button ui-button--secondary" type="button" data-contact-sales>Contact Sales</button>'
        : '<a class="ui-button ui-button--primary" href="?view=create" data-view="create">Start Deploying</a>'
    }
    <ul>${plan.features.map((feature) => `<li><span aria-hidden="true">✓</span>${feature}</li>`).join('')}</ul>
  </article>`;
}

function renderPricing(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="pricing-page">
      ${siteNavigation('pricing')}
      <section class="pricing-hero grid-surface">
        <span class="eyebrow">SIMPLE, PREDICTABLE PRICING</span>
        <h1>Find a plan to power<br>your next idea.</h1>
        <p>Start free, then add collaboration and scale when your product needs them.</p>
        <div class="pricing-period" role="group" aria-label="Billing period">
          <button type="button" data-period="monthly" aria-pressed="true">Monthly</button>
          <button type="button" data-period="yearly" aria-pressed="false">Yearly <small>Save 20%</small></button>
        </div>
      </section>
      <section class="pricing-grid" aria-label="Plans">
        ${plans.map(planCard).join('')}
      </section>
      <section class="pricing-comparison">
        <div>
          <span class="eyebrow">INCLUDED IN EVERY PLAN</span>
          <h2>A complete platform from the first deploy.</h2>
        </div>
        <ul>
          <li>${icons.globe}<span><b>Global delivery</b><small>Serve assets near every visitor.</small></span></li>
          <li>${icons.branch}<span><b>Preview environments</b><small>Review every branch before production.</small></span></li>
          <li>${icons.pulse}<span><b>Observability</b><small>Understand traffic, errors, and performance.</small></span></li>
        </ul>
      </section>
      <section class="pricing-faq">
        <header><span class="eyebrow">FAQ</span><h2>Common questions</h2></header>
        <div>${questions
          .map(
            ([question, answer], index) => `<details${index === 0 ? ' open' : ''}>
              <summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p>
            </details>`,
          )
          .join('')}</div>
      </section>
    </div>
  `);

  const periodButtons = queryAll<HTMLButtonElement>(element, '[data-period]');
  for (const button of periodButtons) {
    listen(
      button,
      'click',
      () => {
        const period = button.dataset.period as BillingPeriod;
        for (const candidate of periodButtons) {
          candidate.setAttribute('aria-pressed', String(candidate === button));
        }
        plans.forEach((plan) => {
          const card = query<HTMLElement>(element, `[data-plan="${plan.name.toLowerCase()}"]`);
          query<HTMLElement>(card, '[data-price]').innerHTML = priceLabel(plan, period);
        });
      },
      context.signal,
    );
  }

  const contactButton = query<HTMLButtonElement>(element, '[data-contact-sales]');
  listen(contactButton, 'click', () => context.notify('Sales contact form opened'), context.signal);

  return element;
}

export const pricingPage: PageDefinition = {
  id: 'pricing',
  index: '09',
  label: 'Pricing',
  shortLabel: '定价',
  render: renderPricing,
};
