import { triangle } from '../components/icons';
import type { PageId } from '../core/types';

interface SiteLink {
  readonly page: PageId;
  readonly label: string;
}

const siteLinks: readonly SiteLink[] = [
  { page: 'console', label: 'Product' },
  { page: 'explore', label: 'Templates' },
  { page: 'docs', label: 'Docs' },
  { page: 'updates', label: 'Changelog' },
  { page: 'pricing', label: 'Pricing' },
];

export function siteNavigation(activePage: PageId, actionLabel = 'Start Deploying'): string {
  return `<nav class="site-navigation" aria-label="Site navigation">
    <a class="site-brand" href="?view=home" data-view="home">${triangle()}<b>Northstar</b></a>
    <div>${siteLinks.map((link) => `<a href="?view=${link.page}" data-view="${link.page}"${link.page === activePage ? ' aria-current="page"' : ''}>${link.label}</a>`).join('')}</div>
    <span><a class="ui-button ui-button--quiet ui-button--small" href="?view=settings" data-view="settings">Sign In</a><a class="ui-button ui-button--primary ui-button--small" href="?view=create" data-view="create">${actionLabel}</a></span>
  </nav>`;
}
