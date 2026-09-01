import { icons, triangle } from '../components/icons';
import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';
import { siteNavigation } from './shared';

const updates = [
  {
    date: 'AUG 18',
    category: 'AI',
    title: 'Faster tool calls with regional model routing',
    copy: 'The AI Gateway now selects the closest healthy provider endpoint while preserving your fallback order.',
    product: 'Gateway',
    symbol: '✦',
  },
  {
    date: 'AUG 14',
    category: 'PLATFORM',
    title: 'Rolling releases are now generally available',
    copy: 'Shift production traffic gradually, watch live health signals, and stop a rollout before users are affected.',
    product: 'Platform',
    symbol: '◒',
  },
  {
    date: 'AUG 09',
    category: 'DESIGN',
    title: 'A calmer deployment experience',
    copy: 'Deployment details now prioritize the build signal, group related checks, and keep logs one click away.',
    product: 'Dashboard',
    symbol: triangle('update-triangle'),
  },
  {
    date: 'JUL 31',
    category: 'SECURITY',
    title: 'Passkeys for every team member',
    copy: 'Secure accounts with device-bound credentials and enforce phishing-resistant authentication at the team level.',
    product: 'Security',
    symbol: '⌁',
  },
] as const;

function renderUpdates(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="updates-page">${siteNavigation('updates')}<header class="updates-hero grid-surface"><div><span class="eyebrow">WHAT'S NEW</span><h1>Changelog</h1><p>New products, smarter workflows, and the small details that make building feel faster.</p></div><label>${icons.search}<input type="search" aria-label="Search updates" placeholder="Search updates"></label></header>
      <nav class="updates-filters" aria-label="Update categories">${['ALL', 'AI', 'PLATFORM', 'DESIGN', 'SECURITY'].map((category, index) => `<button type="button" data-update-filter="${category}" class="${index === 0 ? 'active' : ''}">${category === 'ALL' ? 'All' : category.charAt(0) + category.slice(1).toLowerCase()}</button>`).join('')}</nav>
      <section class="updates-list">${updates.map((update, index) => `<article data-update-category="${update.category}"><time>${update.date}</time><div class="update-art art-${index + 1}"><span>${update.symbol}</span></div><div><span class="eyebrow">${update.category}</span><h2>${update.title}</h2><p>${update.copy}</p><footer><b>${update.product}</b><small>${index + 3} min read</small><button type="button" data-notify="Opened ${update.title}">Read More ${icons.arrow}</button></footer></div></article>`).join('')}</section><div class="updates-empty" hidden><b>No matching updates</b><span>Try a different category or search.</span></div><button class="ui-button ui-button--secondary updates-more" type="button" data-notify="Older updates loaded">Show More Updates</button>
    </div>
  `);
  const search = query<HTMLInputElement>(element, 'input[type="search"]');
  const filters = queryAll<HTMLButtonElement>(element, '[data-update-filter]');
  const entries = queryAll<HTMLElement>(element, '[data-update-category]');
  const empty = query<HTMLElement>(element, '.updates-empty');
  let category = 'ALL';

  const filterEntries = (): void => {
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    for (const entry of entries) {
      const matchesCategory = category === 'ALL' || entry.dataset.updateCategory === category;
      const matchesTerm = term === '' || entry.textContent?.toLowerCase().includes(term) === true;
      entry.hidden = !(matchesCategory && matchesTerm);
      if (!entry.hidden) visible += 1;
    }
    empty.hidden = visible !== 0;
  };
  for (const filter of filters) {
    listen(
      filter,
      'click',
      () => {
        category = filter.dataset.updateFilter ?? 'ALL';
        for (const candidate of filters) candidate.classList.toggle('active', candidate === filter);
        filterEntries();
      },
      context.signal,
    );
  }
  listen(search, 'input', filterEntries, context.signal);
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

export const updatesPage: PageDefinition = {
  id: 'updates',
  index: '08',
  label: 'Updates',
  shortLabel: '更新',
  render: renderUpdates,
};
