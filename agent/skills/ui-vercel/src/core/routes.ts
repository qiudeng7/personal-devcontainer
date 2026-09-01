import { type PageId, pageIds } from './types';

const defaultPage: PageId = 'console';

export function isPageId(value: string | null): value is PageId {
  return value !== null && pageIds.some((page) => page === value);
}

export function pageFromSearch(search: string): PageId {
  const value = new URLSearchParams(search).get('view');
  return isPageId(value) ? value : defaultPage;
}

export function urlForPage(page: PageId): string {
  const url = new URL(window.location.href);
  url.searchParams.set('view', page);
  url.hash = '';
  return `${url.pathname}${url.search}`;
}
