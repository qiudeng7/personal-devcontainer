export function elementFromHtml<T extends HTMLElement>(markup: string): T {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  const element = template.content.firstElementChild;

  if (!(element instanceof HTMLElement)) {
    throw new Error('Expected template to contain one root HTML element.');
  }

  return element as T;
}

export function query<T extends Element>(root: ParentNode, selector: string): T {
  const result = root.querySelector<T>(selector);
  if (!result) throw new Error(`Required element not found: ${selector}`);
  return result;
}

export function queryAll<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function listen<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  signal: AbortSignal,
): void {
  target.addEventListener(type, listener as EventListener, { signal });
}

export function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}
