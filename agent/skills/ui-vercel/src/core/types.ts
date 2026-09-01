export const pageIds = [
  'console',
  'launch',
  'home',
  'docs',
  'explore',
  'create',
  'settings',
  'updates',
  'pricing',
] as const;

export type PageId = (typeof pageIds)[number];
export type Theme = 'light' | 'dark';

export interface PageContext {
  readonly signal: AbortSignal;
  navigate(page: PageId): void;
  notify(message: string): void;
}

export interface PageDefinition {
  readonly id: PageId;
  readonly index: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly theme?: Theme;
  render(context: PageContext): HTMLElement;
}
