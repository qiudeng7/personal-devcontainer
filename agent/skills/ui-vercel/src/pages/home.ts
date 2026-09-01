import { icons, triangle } from '../components/icons';
import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';

function renderHome(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="home-page">
      <nav class="home-navigation"><a href="?view=home" data-view="home">${triangle()}<b>Pulse</b></a><div><a href="?view=updates" data-view="updates">Changelog</a><button class="ui-button ui-button--secondary ui-button--small" type="button" data-command-trigger><span>⌘</span> Command</button></div></nav>
      <section class="home-hero"><div class="home-copy"><span class="live-kicker"><i></i>Observability, without the noise</span><h1>Know what changed.<br><em>Before users do.</em></h1><p>One calm view for traces, errors, and deployments—designed to reveal the signal without slowing down your team.</p><div><a class="ui-button ui-button--primary" href="?view=console" data-view="console">Explore a Trace ${icons.arrow}</a><button class="ui-button ui-button--quiet" type="button" data-notify="Video preview opened">▶ Watch 90 sec</button></div></div>
        <div class="trace-stage"><div class="trace-orbit" aria-hidden="true"></div><article class="trace-card" data-tilt-card><header><span class="ui-status" data-tone="success"><i></i>POST /v1/generate</span><code>842ms</code></header><div class="waterfall"><div><span>edge</span><i style="--start:0%;--width:100%"></i><small>842ms</small></div><div><span>auth</span><i style="--start:4%;--width:16%"></i><small>134ms</small></div><div><span>model</span><i class="hot" style="--start:24%;--width:64%"></i><small>536ms</small></div><div><span>stream</span><i style="--start:39%;--width:51%"></i><small>429ms</small></div></div><footer><span>iad1</span><span>gpt-5.6</span><span>200 OK</span></footer></article><div class="floating-metric one"><small>P95</small><b>188 ms</b></div><div class="floating-metric two"><small>ERRORS</small><b>0.02%</b></div></div>
      </section>
      <section class="home-stats"><article><small>Events today</small><strong>18,492,031</strong><span>+12.8%</span></article><article><small>Cold starts</small><strong>0.09%</strong><span>Global</span></article><article><small>Time to insight</small><strong>3.2 min</strong><span>−41.0%</span></article></section>
      <dialog class="ui-dialog command-menu" aria-labelledby="command-title"><header><h2 id="command-title">Command Menu</h2><button type="button" aria-label="Close command menu" data-dialog-close>×</button></header><div class="ui-dialog__body"><label>${icons.search}<input type="search" placeholder="Search commands…" autofocus></label><div data-command-list><a href="?view=create" data-view="create"><span>↗</span><b>Create deployment</b><kbd>⌘ D</kbd></a><a href="?view=console" data-view="console"><span>⌁</span><b>Inspect latest trace</b><kbd>⌘ T</kbd></a><a href="?view=settings" data-view="settings"><span>◐</span><b>Open preferences</b><kbd>⌘ ,</kbd></a><p class="command-empty" hidden>No matching commands</p></div></div></dialog>
    </div>
  `);
  const card = query<HTMLElement>(element, '[data-tilt-card]');
  const dialog = query<HTMLDialogElement>(element, '.command-menu');
  const trigger = query<HTMLButtonElement>(element, '[data-command-trigger]');
  let animationFrame = 0;
  let nextTransform = '';
  let cardBounds: DOMRect | undefined;

  const resetTilt = (): void => {
    if (animationFrame !== 0) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    cardBounds = undefined;
    delete card.dataset.tracking;
    card.style.transform = '';
  };

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    listen(
      card,
      'pointerenter',
      () => {
        cardBounds = card.getBoundingClientRect();
      },
      context.signal,
    );
    listen(
      card,
      'pointermove',
      (event) => {
        if (!cardBounds) return;
        const x = (event.clientX - cardBounds.left) / cardBounds.width - 0.5;
        const y = (event.clientY - cardBounds.top) / cardBounds.height - 0.5;
        nextTransform = `rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
        card.dataset.tracking = 'true';
        if (animationFrame !== 0) return;
        animationFrame = requestAnimationFrame(() => {
          card.style.transform = nextTransform;
          animationFrame = 0;
        });
      },
      context.signal,
    );
    listen(card, 'pointerleave', resetTilt, context.signal);
    context.signal.addEventListener('abort', resetTilt, { once: true });
  }
  listen(trigger, 'click', () => dialog.showModal(), context.signal);
  listen(
    query<HTMLButtonElement>(dialog, '[data-dialog-close]'),
    'click',
    () => dialog.close(),
    context.signal,
  );
  const commandSearch = query<HTMLInputElement>(dialog, 'input[type="search"]');
  const commandLinks = queryAll<HTMLAnchorElement>(dialog, '[data-command-list] a');
  const commandEmpty = query<HTMLElement>(dialog, '.command-empty');
  listen(
    commandSearch,
    'input',
    () => {
      const term = commandSearch.value.trim().toLowerCase();
      let visibleCommands = 0;
      for (const link of commandLinks) {
        link.hidden = term !== '' && !link.textContent?.toLowerCase().includes(term);
        if (!link.hidden) visibleCommands += 1;
      }
      commandEmpty.hidden = visibleCommands !== 0;
    },
    context.signal,
  );
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

export const homePage: PageDefinition = {
  id: 'home',
  index: '03',
  label: 'Home',
  shortLabel: '首页',
  theme: 'dark',
  render: renderHome,
};
