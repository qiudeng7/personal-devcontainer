import { elementFromHtml, query } from '../core/dom';

export interface ToastController {
  readonly element: HTMLElement;
  show(message: string): void;
}

export function createToastController(): ToastController {
  const element = elementFromHtml<HTMLElement>(`
    <div class="app-toast" role="status" aria-live="polite" aria-atomic="true">
      <span class="app-toast__mark" aria-hidden="true">✓</span>
      <span data-toast-message></span>
    </div>
  `);
  const messageElement = query<HTMLElement>(element, '[data-toast-message]');
  let hideTimer: number | undefined;

  return {
    element,
    show(message: string) {
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      messageElement.textContent = message;
      element.dataset.visible = 'true';
      hideTimer = window.setTimeout(() => {
        delete element.dataset.visible;
        hideTimer = undefined;
      }, 1800);
    },
  };
}
