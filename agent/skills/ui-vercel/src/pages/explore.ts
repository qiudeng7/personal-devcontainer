import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';
import { siteNavigation } from './shared';

const templates = [
  {
    category: 'AI',
    tone: 'agent',
    title: 'Autonomous Research Agent',
    copy: 'A tool-using research workspace with sources, traces, and durable memory.',
    stack: 'Vite · Postgres',
  },
  {
    category: 'ECOMMERCE',
    tone: 'commerce',
    title: 'Minimal Commerce',
    copy: 'A fast storefront with product search, cart state, and edge-rendered checkout.',
    stack: 'Nuxt · Shopify',
  },
  {
    category: 'DOCUMENTATION',
    tone: 'docs',
    title: 'Signal Documentation',
    copy: 'Searchable product documentation with versioning and an AI answer layer.',
    stack: 'Vite · MDX',
  },
  {
    category: 'SAAS',
    tone: 'dashboard',
    title: 'Control Plane',
    copy: 'A multi-tenant operations dashboard with roles, usage, and billing.',
    stack: 'Vue · Supabase',
  },
  {
    category: 'BLOG',
    tone: 'editorial',
    title: 'Editorial Grid',
    copy: 'A typography-led publication with visual stories and a focused reading mode.',
    stack: 'Astro · Sanity',
  },
  {
    category: 'OBSERVABILITY',
    tone: 'status',
    title: 'Status Monitor',
    copy: 'Public uptime, incident timelines, and subscriber notifications.',
    stack: 'Svelte · Redis',
  },
] as const;

function renderExplore(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="explore-page">${siteNavigation('explore', 'Deploy Template')}<header class="explore-hero"><span class="eyebrow">START WITH A WORKING FOUNDATION</span><h1>Find your starting point.</h1><p>Production-ready templates for every framework and use case. Fork one, make it yours, and deploy in minutes.</p><label>${'⌕'}<input type="search" placeholder="Search templates" aria-label="Search templates"><kbd>⌘ K</kbd></label></header>
      <div class="explore-layout"><aside><b>Use Case</b><div role="group" aria-label="Template category"><button class="active" type="button" data-filter="ALL">All templates <span>340</span></button><button type="button" data-filter="AI">AI <span>86</span></button><button type="button" data-filter="SAAS">SaaS <span>42</span></button><button type="button" data-filter="ECOMMERCE">Ecommerce <span>28</span></button><button type="button" data-filter="DOCUMENTATION">Documentation <span>19</span></button></div><b>Framework</b><label><input type="checkbox">Vue</label><label><input type="checkbox">Nuxt</label><label><input type="checkbox">Vite</label><label><input type="checkbox">Astro</label></aside>
        <section class="template-results"><header><div><b>Featured templates</b><small data-result-count>${templates.length} hand-picked foundations</small></div><button class="ui-button ui-button--secondary ui-button--small" type="button" data-sort-templates aria-pressed="false">Recommended</button></header><div class="template-grid">${templates.map((template, index) => `<article class="template-card" data-category="${template.category}" data-framework="${template.stack.split(' · ')[0]?.toUpperCase()}" data-original-order="${index}"><div class="template-art ${template.tone}"><div><i></i><i></i><i></i><span></span></div></div><div class="template-copy"><span>${template.category}</span><h2>${template.title}</h2><p>${template.copy}</p><footer><small>${template.stack}</small><button type="button" data-notify="Previewed ${template.title}">Preview ↗</button></footer></div></article>`).join('')}</div><div class="empty-results" hidden><b>No matching templates</b><span>Try a different category or search term.</span></div></section>
      </div>
    </div>
  `);
  const search = query<HTMLInputElement>(element, 'input[type="search"]');
  const filters = queryAll<HTMLButtonElement>(element, '[data-filter]');
  const frameworkFilters = queryAll<HTMLInputElement>(element, 'aside input[type="checkbox"]');
  const cards = queryAll<HTMLElement>(element, '.template-card');
  const cardGrid = query<HTMLElement>(element, '.template-grid');
  const sortButton = query<HTMLButtonElement>(element, '[data-sort-templates]');
  const count = query<HTMLElement>(element, '[data-result-count]');
  const empty = query<HTMLElement>(element, '.empty-results');
  let category = 'ALL';

  const applyFilters = (): void => {
    const term = search.value.trim().toLowerCase();
    const frameworks = frameworkFilters
      .filter((filter) => filter.checked)
      .map((filter) => filter.parentElement?.textContent?.trim().toUpperCase());
    let visible = 0;
    for (const card of cards) {
      const matchCategory = category === 'ALL' || card.dataset.category === category;
      const matchFramework =
        frameworks.length === 0 || frameworks.includes(card.dataset.framework?.toUpperCase());
      const matchSearch = term === '' || card.textContent?.toLowerCase().includes(term) === true;
      card.hidden = !(matchCategory && matchFramework && matchSearch);
      if (!card.hidden) visible += 1;
    }
    count.textContent = `${visible} matching foundation${visible === 1 ? '' : 's'}`;
    empty.hidden = visible !== 0;
  };

  for (const filter of filters) {
    listen(
      filter,
      'click',
      () => {
        category = filter.dataset.filter ?? 'ALL';
        for (const candidate of filters) candidate.classList.toggle('active', candidate === filter);
        applyFilters();
      },
      context.signal,
    );
  }
  listen(search, 'input', applyFilters, context.signal);
  for (const filter of frameworkFilters) listen(filter, 'change', applyFilters, context.signal);
  listen(
    sortButton,
    'click',
    () => {
      const sortByName = sortButton.getAttribute('aria-pressed') !== 'true';
      sortButton.setAttribute('aria-pressed', String(sortByName));
      sortButton.textContent = sortByName ? 'Name A–Z' : 'Recommended';
      const sortedCards = [...cards].sort((left, right) => {
        if (sortByName) return left.textContent?.localeCompare(right.textContent ?? '') ?? 0;
        return Number(left.dataset.originalOrder) - Number(right.dataset.originalOrder);
      });
      cardGrid.append(...sortedCards);
    },
    context.signal,
  );
  for (const control of queryAll<HTMLElement>(element, '[data-notify]')) {
    listen(
      control,
      'click',
      () => context.notify(control.dataset.notify ?? 'Action completed'),
      context.signal,
    );
  }
  return element;
}

export const explorePage: PageDefinition = {
  id: 'explore',
  index: '05',
  label: 'Explore',
  shortLabel: '市场',
  render: renderExplore,
};
