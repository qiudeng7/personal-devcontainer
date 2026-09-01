import { icons, triangle } from '../components/icons';
import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';

const commands = {
  pnpm: '$ pnpm dlx northstar init',
  npm: '$ npx northstar init',
  bun: '$ bunx northstar init',
} as const;

function renderDocs(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="docs-page">
      <header class="docs-header"><a href="?view=home" data-view="home">${triangle()}<b>Northstar</b><span>Docs</span></a><button class="docs-search" type="button" data-notify="Documentation search opened">${icons.search}<span>Search documentation…</span><kbd>⌘ K</kbd></button><nav><a href="?view=docs" data-view="docs" aria-current="page">Guides</a><a href="?view=explore" data-view="explore">Examples</a><a href="?view=pricing" data-view="pricing">Pricing</a></nav></header>
      <div class="docs-layout"><aside class="docs-sidebar" aria-label="Documentation sections"><small>GET STARTED</small><button class="active" type="button" data-notify="Introduction selected">Introduction</button><button type="button" data-notify="Quickstart selected">Quickstart</button><button type="button" data-notify="Core concepts selected">Core Concepts</button><small>BUILD</small><button type="button" data-notify="Projects selected">Projects</button><button type="button" data-notify="Deployments selected">Deployments</button><button type="button" data-notify="Functions selected">Functions</button><button type="button" data-notify="AI Gateway selected">AI Gateway</button><small>OPERATE</small><button type="button" data-notify="Observability selected">Observability</button><button type="button" data-notify="Security selected">Security</button></aside>
        <article class="docs-article"><div class="docs-breadcrumb">Docs ${icons.chevron} Getting Started ${icons.chevron} Introduction</div><span class="eyebrow">GETTING STARTED</span><h1>Build your first project</h1><p class="docs-lead">Connect a repository, create a deployment, and ship your application to the global network in a few minutes.</p><button class="docs-ai-card" type="button" data-notify="AI assistant opened"><span>✦</span><div><b>Ask AI about this page</b><small>Get an answer grounded in the latest documentation.</small></div>${icons.arrow}</button>
          <h2 id="create-project">Create a project</h2><p>A project groups deployments, domains, environment variables, and analytics for one application. Start from the dashboard or use the CLI.</p><div class="docs-code"><header><div role="tablist" aria-label="Package manager"><button id="docs-command-pnpm" type="button" role="tab" aria-selected="true" aria-controls="docs-command-panel" tabindex="0" data-command="pnpm">pnpm</button><button id="docs-command-npm" type="button" role="tab" aria-selected="false" aria-controls="docs-command-panel" tabindex="-1" data-command="npm">npm</button><button id="docs-command-bun" type="button" role="tab" aria-selected="false" aria-controls="docs-command-panel" tabindex="-1" data-command="bun">bun</button></div><button type="button" data-copy-code>Copy</button></header><pre id="docs-command-panel" role="tabpanel" aria-labelledby="docs-command-pnpm"><code data-command-output>${commands.pnpm}</code>
<span>◆  Link to an existing project?</span> <b>No</b>
<span>◆  Project created:</span> atlas-console</pre></div>
          <h2 id="deploy-application">Deploy your application</h2><p>Every push creates an immutable deployment. Production traffic moves only after all checks complete.</p><ol class="docs-steps"><li><span>1</span><div><b>Connect Git</b><small>Choose a repository from your Git provider.</small></div></li><li><span>2</span><div><b>Configure</b><small>Confirm build settings and environment variables.</small></div></li><li><span>3</span><div><b>Ship</b><small>Review the preview and promote it to production.</small></div></li></ol><a class="docs-next" href="?view=create" data-view="create"><small>NEXT</small><b>Interactive Quickstart</b>${icons.arrow}</a>
        </article><aside class="docs-toc"><b>On this page</b><a href="#create-project">Create a project</a><a href="#deploy-application">Deploy your application</a><hr><button type="button" data-notify="Edit link copied">Edit this page ↗</button><button type="button" data-notify="Feedback form opened">Give feedback ↗</button></aside></div>
    </div>
  `);
  const output = query<HTMLElement>(element, '[data-command-output]');
  const outputPanel = query<HTMLElement>(element, '#docs-command-panel');
  const commandTabs = queryAll<HTMLButtonElement>(element, '[data-command]');
  const selectCommand = (tab: HTMLButtonElement): void => {
    for (const candidate of commandTabs) {
      const isSelected = candidate === tab;
      candidate.setAttribute('aria-selected', String(isSelected));
      candidate.tabIndex = isSelected ? 0 : -1;
    }
    outputPanel.setAttribute('aria-labelledby', tab.id);
    output.textContent = commands[tab.dataset.command as keyof typeof commands];
  };
  commandTabs.forEach((tab, index) => {
    listen(tab, 'click', () => selectCommand(tab), context.signal);
    listen(
      tab,
      'keydown',
      (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + commandTabs.length) % commandTabs.length;
        const nextTab = commandTabs[nextIndex];
        if (!nextTab) return;
        selectCommand(nextTab);
        nextTab.focus();
      },
      context.signal,
    );
  });
  for (const sectionButton of queryAll<HTMLButtonElement>(element, '.docs-sidebar button')) {
    listen(
      sectionButton,
      'click',
      () => {
        for (const candidate of queryAll<HTMLButtonElement>(element, '.docs-sidebar button')) {
          candidate.classList.toggle('active', candidate === sectionButton);
        }
      },
      context.signal,
    );
  }
  const copyButton = query<HTMLButtonElement>(element, '[data-copy-code]');
  listen(
    copyButton,
    'click',
    () => {
      const writeRequest = navigator.clipboard?.writeText(output.textContent ?? '');
      void writeRequest?.catch(() => undefined);
      copyButton.textContent = 'Copied';
      context.notify('Command copied');
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

export const docsPage: PageDefinition = {
  id: 'docs',
  index: '04',
  label: 'Docs',
  shortLabel: '文档',
  render: renderDocs,
};
