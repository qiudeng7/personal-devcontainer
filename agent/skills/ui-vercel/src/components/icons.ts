export const icons = {
  arrow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
  branch:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5" cy="4" r="2"/><circle cx="11" cy="12" r="2"/><path d="M5 6v2c0 2.2 1.8 4 4 4M11 10V4"/></svg>',
  chevron: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>',
  globe:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2.2 2 9.8 0 12M8 2c-2 2.2-2 9.8 0 12"/></svg>',
  pulse: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8h3l1.5-4 3 8L10 8h5"/></svg>',
  search:
    '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>',
} as const;

export function triangle(className = ''): string {
  return `<span class="brand-triangle ${className}" aria-hidden="true"></span>`;
}
