import { elementFromHtml, isModifiedClick, query, queryAll } from '../core/dom';
import { isPageId, urlForPage } from '../core/routes';
import type { PageDefinition, PageId } from '../core/types';
import { triangle } from './icons';

export interface Shell {
  readonly element: HTMLElement;
  readonly outlet: HTMLElement;
  setActive(page: PageId): void;
}

export function createShell(
  pages: readonly PageDefinition[],
  onNavigate: (page: PageId) => void,
): Shell {
  const element = elementFromHtml<HTMLElement>(`
    <div class="app-shell">
      <header class="lab-header">
        <a class="lab-brand" href="${urlForPage('console')}" data-page="console">
          ${triangle()}<span>UI Reference</span><small>ui-vercel</small>
        </a>
        <nav class="lab-navigation" aria-label="页面样板">
          ${pages
            .map(
              (page) => `<a href="${urlForPage(page.id)}" data-page="${page.id}">
                <span>${page.index} · ${page.label}</span><b>${page.shortLabel}</b>
              </a>`,
            )
            .join('')}
        </nav>
        <span class="lab-count">${pages.length} scenes</span>
      </header>
      <main class="page-outlet" data-page-outlet tabindex="-1"></main>
    </div>
  `);
  const outlet = query<HTMLElement>(element, '[data-page-outlet]');
  const links = queryAll<HTMLAnchorElement>(element, '[data-page]');

  element.addEventListener('click', (event) => {
    if (!(event instanceof MouseEvent) || isModifiedClick(event)) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-page]');
    if (!link) return;
    const page = link.dataset.page ?? null;
    if (!isPageId(page)) return;
    event.preventDefault();
    onNavigate(page);
  });

  return {
    element,
    outlet,
    setActive(page: PageId) {
      for (const link of links) {
        const isActive = link.dataset.page === page;
        link.toggleAttribute('aria-current', isActive);
      }
    },
  };
}
