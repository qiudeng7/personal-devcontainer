import { icons, triangle } from '../components/icons';
import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';

const deployments = [
  {
    status: 'Ready',
    tone: 'success',
    name: 'atlas-console-git-main',
    source: 'main',
    hash: '8ca21f4',
    age: '2m ago',
  },
  {
    status: 'Ready',
    tone: 'success',
    name: 'atlas-console-git-observability',
    source: 'feature/observability',
    hash: '2fe902d',
    age: '48m ago',
  },
  {
    status: 'Building',
    tone: 'info',
    name: 'atlas-console-git-settings',
    source: 'feature/settings',
    hash: 'b772aa1',
    age: '1h ago',
  },
  {
    status: 'Ready',
    tone: 'success',
    name: 'atlas-console-git-main-x8p3',
    source: 'main',
    hash: '0c13fd7',
    age: 'Yesterday',
  },
] as const;

const logs = [
  ['12:48:04.821', 'INFO', 'POST /api/generate', 'Stream completed · 842 ms'],
  ['12:48:02.190', 'INFO', 'GET /api/projects', 'Cache hit · iad1'],
  ['12:47:58.302', 'WARN', 'POST /api/webhook', 'Retry scheduled · attempt 2/3'],
  ['12:47:51.927', 'INFO', 'GET /dashboard', '200 · edge rendered'],
  ['12:47:43.114', 'INFO', 'GET /api/health', '200 · 18 ms'],
  ['12:47:39.640', 'ERROR', 'POST /api/import', 'Repository permission denied'],
] as const;

function overviewPanel(): string {
  return `
    <section class="console-overview" id="console-panel-overview" role="tabpanel" aria-labelledby="console-tab-overview">
      <article class="deployment-summary">
        <div class="deployment-preview">
          <div class="preview-window"><span>A</span><div><i></i><i></i><i></i></div></div>
          <span class="preview-environment"><i></i>Production</span>
        </div>
        <div class="deployment-copy">
          <header><span class="ui-status" data-tone="success"><i></i>Ready</span><time>2m ago</time></header>
          <h2>atlas-console-git-main-qiudeng.vercel.app</h2>
          <p class="commit">${icons.branch}<code>main</code><span>8ca21f4</span><span>Refine edge telemetry panel</span></p>
          <dl><div><dt>Build Duration</dt><dd>28s</dd></div><div><dt>Regions</dt><dd>Hong Kong · Tokyo</dd></div><div><dt>Runtime</dt><dd>Node.js 22.x</dd></div><div><dt>Source</dt><dd>qiudeng7/atlas</dd></div></dl>
          <button class="ui-button ui-button--quiet" type="button" data-notify="Deployment details opened">View Deployment ${icons.arrow}</button>
        </div>
      </article>
      <section class="metric-cards" aria-label="Project metrics">
        <article><span>Requests</span><strong>2.4M</strong><small>↑ 14% from last week</small><div class="mini-chart one"></div></article>
        <article><span>Fast Data Transfer</span><strong>81.2 GB</strong><small>32% of monthly limit</small><div class="usage-meter"><i></i></div></article>
        <article><span>Edge Errors</span><strong>0.03%</strong><small>↓ 0.12% from last week</small><div class="mini-chart two"></div></article>
      </section>
    </section>`;
}

function deploymentsPanel(): string {
  return `
    <section id="console-panel-deployments" role="tabpanel" aria-labelledby="console-tab-deployments" hidden>
      <header class="panel-heading"><div><h2>Deployments</h2><p>Every build created from the connected Git repository.</p></div><button class="ui-button ui-button--secondary ui-button--small" type="button" data-notify="Deployment filters are ready">Filter</button></header>
      <div class="ui-table-frame"><table class="ui-table deployments-table"><thead><tr><th>Status</th><th>Deployment</th><th>Source</th><th>Created</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
        ${deployments.map((item) => `<tr><td><span class="ui-status" data-tone="${item.tone}"><i></i>${item.status}</span></td><td><button type="button" data-notify="Opened ${item.name}">${item.name}</button><small>${item.name}.vercel.app</small></td><td><code>${item.source}</code><small>${item.hash}</small></td><td><time>${item.age}</time></td><td><button class="row-menu" type="button" aria-label="More actions" data-notify="Deployment actions opened">•••</button></td></tr>`).join('')}
      </tbody></table></div>
    </section>`;
}

function analyticsPanel(): string {
  const heights = [42, 57, 49, 72, 68, 86, 78, 93, 81, 100, 88, 112, 102, 126];
  return `
    <section id="console-panel-analytics" role="tabpanel" aria-labelledby="console-tab-analytics" hidden>
      <header class="panel-heading"><div><h2>Web Analytics</h2><p>Privacy-friendly traffic insights for the last 7 days.</p></div><button class="ui-button ui-button--secondary ui-button--small" type="button" data-notify="Date range selector opened">Last 7 Days</button></header>
      <article class="analytics-card"><header><dl><div><dt>Pageviews</dt><dd>48,291 <small>↑ 18.4%</small></dd></div><div><dt>Visitors</dt><dd>21,804 <small>↑ 11.2%</small></dd></div><div><dt>Bounce Rate</dt><dd>32.8% <small>↓ 2.1%</small></dd></div></dl></header><div class="bar-chart" aria-label="Pageviews over 7 days">${heights.map((height, index) => `<i style="--bar-height:${height}px;--bar-index:${index}" aria-hidden="true"></i>`).join('')}<footer><span>Aug 13</span><span>Aug 14</span><span>Aug 15</span><span>Aug 16</span><span>Aug 17</span><span>Aug 18</span><span>Today</span></footer></div></article>
      <div class="analytics-lists"><article><h3>Top Pages</h3><ol><li><span>/dashboard</span><b>18,402</b></li><li><span>/docs/getting-started</span><b>9,881</b></li><li><span>/pricing</span><b>7,209</b></li></ol></article><article><h3>Top Referrers</h3><ol><li><span>Direct</span><b>42%</b></li><li><span>google.com</span><b>31%</b></li><li><span>github.com</span><b>18%</b></li></ol></article></div>
    </section>`;
}

function logsPanel(): string {
  return `
    <section id="console-panel-logs" role="tabpanel" aria-labelledby="console-tab-logs" hidden>
      <header class="panel-heading"><div><h2>Runtime Logs</h2><p>Live events from functions and edge requests.</p></div><span class="ui-status" data-tone="success"><i></i>Live</span></header>
      <div class="log-toolbar"><label>${icons.search}<input type="search" aria-label="Search logs" placeholder="Search logs…"></label><button type="button" data-log-level-filter>All Levels</button><button type="button" data-log-source-filter>All Sources</button></div>
      <div class="log-viewer" role="log"><header><span>TIME</span><span>LEVEL</span><span>REQUEST</span><span>MESSAGE</span></header>${logs.map(([time, level, request, message]) => `<div data-log-row data-log-level="${level.toLowerCase()}" data-log-source="${request.includes('/api/') ? 'function' : 'page'}"><time>${time}</time><span data-level="${level.toLowerCase()}">${level}</span><code>${request}</code><p>${message}</p></div>`).join('')}<p class="log-empty" hidden>No logs match these filters.</p></div>
    </section>`;
}

function renderConsole(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="console-page">
      <aside class="console-sidebar"><button class="team-picker" type="button" data-notify="Workspace switcher opened"><span>Q</span><b>Qiudeng's projects</b><i>⌄</i></button><nav aria-label="Console navigation"><a href="?view=console" data-view="console" aria-current="page">⌂<span>Overview</span></a><a href="?view=explore" data-view="explore">▱<span>Integrations</span></a><a href="?view=updates" data-view="updates">◈<span>Activity</span></a><small>PROJECT</small><a href="?view=console" data-view="console">${triangle('small')}<span>atlas-console</span></a><a href="?view=settings" data-view="settings">○<span>Settings</span></a></nav><footer><span class="ui-status" data-tone="success"><i></i>All systems operational</span></footer></aside>
      <div class="console-main"><header class="console-topbar"><div><span>Projects</span>${icons.chevron}<b>atlas-console</b></div><button class="avatar-control" type="button" data-notify="Account menu opened">Q</button></header><div class="console-content"><header class="project-heading"><div><span class="eyebrow">PROJECT OVERVIEW</span><h1>atlas-console</h1><p>Production control plane for your edge applications.</p></div><button class="ui-button ui-button--primary" type="button" data-notify="Deployment queued">Deploy ↗</button></header>
        <div class="ui-tabs console-tabs" role="tablist" aria-label="Project sections">${['Overview', 'Deployments', 'Analytics', 'Logs'].map((label, index) => `<button class="ui-tab" id="console-tab-${label.toLowerCase()}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="console-panel-${label.toLowerCase()}" tabindex="${index === 0 ? '0' : '-1'}">${label}</button>`).join('')}</div>
        <div class="console-panels">${overviewPanel()}${deploymentsPanel()}${analyticsPanel()}${logsPanel()}</div>
      </div></div>
    </div>
  `);
  const tabs = queryAll<HTMLButtonElement>(element, '[role="tab"]');
  const panels = queryAll<HTMLElement>(element, '[role="tabpanel"]');

  const activateTab = (tab: HTMLButtonElement, focus = false): void => {
    for (const candidate of tabs) {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.getAttribute('aria-labelledby') !== tab.id;
    if (focus) tab.focus();
  };

  for (const tab of tabs) {
    listen(tab, 'click', () => activateTab(tab), context.signal);
    listen(
      tab,
      'keydown',
      (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const currentIndex = tabs.indexOf(tab);
        const target = tabs[(currentIndex + direction + tabs.length) % tabs.length];
        if (target) activateTab(target, true);
      },
      context.signal,
    );
  }

  for (const control of queryAll<HTMLElement>(element, '[data-notify]')) {
    listen(
      control,
      'click',
      () => context.notify(control.dataset.notify ?? 'Action completed'),
      context.signal,
    );
  }

  const search = query<HTMLInputElement>(element, 'input[aria-label="Search logs"]');
  const logRows = queryAll<HTMLElement>(element, '[data-log-row]');
  const logEmpty = query<HTMLElement>(element, '.log-empty');
  const levelButton = query<HTMLButtonElement>(element, '[data-log-level-filter]');
  const sourceButton = query<HTMLButtonElement>(element, '[data-log-source-filter]');
  const levelOptions = [
    ['all', 'All Levels'],
    ['info', 'Info'],
    ['warn', 'Warnings'],
    ['error', 'Errors'],
  ] as const;
  const sourceOptions = [
    ['all', 'All Sources'],
    ['function', 'Functions'],
    ['page', 'Pages'],
  ] as const;
  let levelIndex = 0;
  let sourceIndex = 0;

  const applyLogFilters = (): void => {
    const queryText = search.value.trim().toLowerCase();
    const level = levelOptions[levelIndex]?.[0] ?? 'all';
    const source = sourceOptions[sourceIndex]?.[0] ?? 'all';
    let visibleRows = 0;
    for (const row of logRows) {
      const matchesText =
        queryText === '' || row.textContent?.toLowerCase().includes(queryText) === true;
      const matchesLevel = level === 'all' || row.dataset.logLevel === level;
      const matchesSource = source === 'all' || row.dataset.logSource === source;
      row.hidden = !(matchesText && matchesLevel && matchesSource);
      if (!row.hidden) visibleRows += 1;
    }
    logEmpty.hidden = visibleRows !== 0;
  };

  listen(search, 'input', applyLogFilters, context.signal);
  listen(
    levelButton,
    'click',
    () => {
      levelIndex = (levelIndex + 1) % levelOptions.length;
      levelButton.textContent = levelOptions[levelIndex]?.[1] ?? 'All Levels';
      applyLogFilters();
    },
    context.signal,
  );
  listen(
    sourceButton,
    'click',
    () => {
      sourceIndex = (sourceIndex + 1) % sourceOptions.length;
      sourceButton.textContent = sourceOptions[sourceIndex]?.[1] ?? 'All Sources';
      applyLogFilters();
    },
    context.signal,
  );

  return element;
}

export const consolePage: PageDefinition = {
  id: 'console',
  index: '01',
  label: 'Console',
  shortLabel: '后台',
  render: renderConsole,
};
