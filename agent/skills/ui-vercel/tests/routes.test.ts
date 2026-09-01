import { describe, expect, it } from 'vitest';
import { isPageId, pageFromSearch } from '../src/core/routes';

describe('page routing', () => {
  it('accepts only registered page identifiers', () => {
    expect(isPageId('console')).toBe(true);
    expect(isPageId('unknown')).toBe(false);
  });

  it('falls back to console for missing or invalid view values', () => {
    expect(pageFromSearch('')).toBe('console');
    expect(pageFromSearch('?view=missing')).toBe('console');
  });

  it('reads a registered view from the query string', () => {
    expect(pageFromSearch('?view=pricing')).toBe('pricing');
  });
});
