import { isModifiedClick } from './dom';
import { isPageId, pageFromSearch, urlForPage } from './routes';
import type { PageContext, PageDefinition, PageId } from './types';

interface RouterOptions {
  readonly outlet: HTMLElement;
  readonly pages: readonly PageDefinition[];
  readonly onActivePageChange: (page: PageId) => void;
  readonly notify: (message: string) => void;
}

export class Router {
  readonly #outlet: HTMLElement;
  readonly #pages: ReadonlyMap<PageId, PageDefinition>;
  readonly #onActivePageChange: (page: PageId) => void;
  readonly #notify: (message: string) => void;
  #pageAbortController?: AbortController;
  #currentPage?: PageId;

  constructor(options: RouterOptions) {
    this.#outlet = options.outlet;
    this.#pages = new Map(options.pages.map((page) => [page.id, page]));
    this.#onActivePageChange = options.onActivePageChange;
    this.#notify = options.notify;

    this.#outlet.addEventListener('click', (event) => {
      if (!(event instanceof MouseEvent) || isModifiedClick(event)) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-view]');
      if (!link) return;
      const page = link.dataset.view ?? null;
      if (!isPageId(page)) return;
      event.preventDefault();
      this.navigate(page);
    });
  }

  start(): void {
    window.addEventListener('popstate', () => this.#render(pageFromSearch(window.location.search)));
    this.#render(pageFromSearch(window.location.search));
  }

  navigate(page: PageId): void {
    if (page === this.#currentPage) return;
    window.history.pushState({}, '', urlForPage(page));
    this.#render(page);
  }

  #render(pageId: PageId): void {
    const definition = this.#pages.get(pageId);
    if (!definition) throw new Error(`Page is not registered: ${pageId}`);

    this.#pageAbortController?.abort();
    this.#pageAbortController = new AbortController();
    const context: PageContext = {
      signal: this.#pageAbortController.signal,
      navigate: (page) => this.navigate(page),
      notify: this.#notify,
    };

    this.#currentPage = pageId;
    this.#outlet.replaceChildren(definition.render(context));
    this.#outlet.dataset.page = pageId;
    document.documentElement.dataset.theme = definition.theme ?? 'light';
    document.title = `${definition.label} · ui-vercel`;
    this.#onActivePageChange(pageId);
    window.scrollTo({ top: 0 });
  }
}
