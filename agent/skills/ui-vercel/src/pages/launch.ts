import { icons, triangle } from '../components/icons';
import { elementFromHtml, listen, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';
import { siteNavigation } from './shared';

function renderLaunch(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="launch-page">
      ${siteNavigation('launch')}
      <section class="launch-hero grid-surface">
        <span class="grid-cross one" aria-hidden="true">+</span><span class="grid-cross two" aria-hidden="true">+</span>
        <div class="launch-copy"><span class="eyebrow">THE ADAPTIVE COMPUTE CLOUD</span><h1>Build at the speed<br>of your ideas.</h1><p>Northstar gives your team the tools and cloud infrastructure to build, scale, and secure a faster web.</p><div><a class="ui-button ui-button--primary launch-cta" href="?view=create" data-view="create">${triangle('small')} Start Deploying</a><button class="ui-button ui-button--secondary" type="button" data-notify="Sales request started">Talk to Sales</button></div></div>
        <div class="ship-pipeline" aria-label="Push, build, and deploy flow"><div class="pipeline-node"><span>⌘</span><small>Push</small></div><i><b></b></i><div class="pipeline-node core">${triangle()}<small>Build</small></div><i><b></b></i><div class="pipeline-node"><span>✓</span><small>Live</small></div></div>
      </section>
      <section class="customer-strip"><p>Interface studies for teams shipping the future</p><div><b>Studio / 01</b><b>Lab / 02</b><b>Systems / 03</b><b>Works / 04</b><b>Research / 05</b></div></section>
      <section class="launch-feature" id="collaboration"><article><span class="eyebrow">01 / PREVIEWS</span><h2>Every change is<br>a place to collaborate.</h2><p>Share a live environment for every branch. Review the real product, leave feedback in context, and ship with confidence.</p><a href="?view=docs" data-view="docs">Explore Previews ${icons.arrow}</a></article><div class="preview-browser"><div class="browser-chrome"><i></i><i></i><i></i><span>atlas-git-feature.vercel.app</span></div><div class="browser-canvas"><div class="canvas-nav"></div><div class="canvas-hero"></div><div><i></i><i></i><i></i></div><span class="comment-pin">3</span></div><article class="review-comment"><span>M</span><div><b>Move this above the fold?</b><small>Maria · just now</small></div><button type="button" data-notify="Reply composer opened">Reply</button></article></div></section>
    </div>
  `);

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

export const launchPage: PageDefinition = {
  id: 'launch',
  index: '02',
  label: 'Launch',
  shortLabel: '引导',
  render: renderLaunch,
};
