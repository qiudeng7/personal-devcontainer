import { triangle } from '../components/icons';
import { elementFromHtml, listen, query, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';

type WizardStep = 'import' | 'configure' | 'deploy';
const stepOrder: readonly WizardStep[] = ['import', 'configure', 'deploy'];

function renderCreate(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="create-page"><header><a href="?view=home" data-view="home">${triangle()}<b>Northstar</b></a><a class="avatar-control" href="?view=settings" data-view="settings">Q</a></header><ol class="create-stepper"><li data-step-marker="import"><span>1</span><b>Import</b></li><i></i><li data-step-marker="configure"><span>2</span><b>Configure</b></li><i></i><li data-step-marker="deploy"><span>3</span><b>Deploy</b></li></ol>
      <section class="wizard-card"><div class="wizard-panel" data-step-panel="import"><header><span class="provider-mark">⌘</span><div><h1>Import a Git repository</h1><p>Select a repository to create your project.</p></div></header><div class="repository-tools"><label>⌕<input type="search" placeholder="Search repositories" aria-label="Search repositories"></label><button type="button" data-notify="Git scope selector opened">qiudeng7 ⌄</button></div><div class="repository-list">${[
        ['A', 'atlas-console', 'Vue · Updated 8 minutes ago'],
        ['N', 'northstar-docs', 'TypeScript · Updated yesterday'],
        ['E', 'edge-worker', 'Rust · Updated 3 days ago'],
        ['D', 'design-system', 'CSS · Updated last week'],
      ]
        .map(
          ([mark, name, meta], index) =>
            `<button type="button" data-repository="${name}" aria-pressed="false"><span class="repository-mark tone-${index}">${mark}</span><div><b>${name}</b><small>${meta}</small></div><em>${index % 2 === 0 ? 'Private' : 'Public'}</em><i>›</i></button>`,
        )
        .join(
          '',
        )}<p class="repository-empty" hidden>No repositories match your search.</p></div><footer><a class="ui-button ui-button--quiet" href="?view=console" data-view="console">Cancel</a><button class="ui-button ui-button--primary" type="button" data-next disabled>Configure Project</button></footer></div>
        <div class="wizard-panel" data-step-panel="configure" hidden><header><span class="provider-mark">A</span><div><h1>Configure project</h1><p data-selected-repository>atlas-console</p></div></header><div class="configuration-form"><label class="ui-field"><span class="ui-field__label">Project Name</span><input class="ui-input" name="project-name" value="atlas-console"><span class="ui-field__help">Used for dashboard and deployment URLs.</span></label><label class="ui-field"><span class="ui-field__label">Framework Preset</span><select class="ui-input" name="framework"><option>Vite</option><option>Vue</option><option>Nuxt</option><option>Other</option></select></label><label class="ui-field"><span class="ui-field__label">Root Directory</span><input class="ui-input" name="root-directory" value="./"><span class="ui-field__help">Directory containing the application source.</span></label><div class="configuration-toggle"><div><b>Build cache</b><small>Reuse dependencies and unchanged output between deployments.</small></div><button class="ui-switch" type="button" role="switch" aria-checked="true"><i></i></button></div></div><footer><button class="ui-button ui-button--quiet" type="button" data-back>Back</button><button class="ui-button ui-button--primary" type="button" data-next>Review Deployment</button></footer></div>
        <div class="wizard-panel" data-step-panel="deploy" hidden><header><span class="provider-mark">↗</span><div><h1>Ready to deploy</h1><p>Review the configuration before creating your project.</p></div></header><dl class="deploy-review"><div><dt>Repository</dt><dd data-review-repository>qiudeng7/atlas-console</dd></div><div><dt>Framework</dt><dd data-review-framework>Vite</dd></div><div><dt>Project Name</dt><dd data-review-name>atlas-console</dd></div><div><dt>Region</dt><dd>Automatic</dd></div></dl><div class="deploy-result" hidden><span class="ui-status" data-tone="success"><i></i>Ready</span><b data-deployment-url>atlas-console.vercel.app</b><small>Production deployment completed successfully.</small></div><footer><button class="ui-button ui-button--quiet" type="button" data-back>Back</button><button class="ui-button ui-button--primary" type="button" data-deploy>Deploy Project</button></footer></div>
      </section><aside class="create-help"><span>?</span><div><b>Need another source?</b><small>Import from GitLab, Bitbucket, or a local directory.</small></div><button type="button" data-notify="Import options opened">View Options</button></aside>
    </div>
  `);
  let currentStep: WizardStep = 'import';
  let selectedRepository = '';
  let deployTimer: number | undefined;
  const panels = queryAll<HTMLElement>(element, '[data-step-panel]');
  const markers = queryAll<HTMLElement>(element, '[data-step-marker]');
  const repositoryButtons = queryAll<HTMLButtonElement>(element, '[data-repository]');
  const repositorySearch = query<HTMLInputElement>(element, '.repository-tools input');
  const repositoryEmpty = query<HTMLElement>(element, '.repository-empty');
  const importNext = query<HTMLButtonElement>(element, '[data-step-panel="import"] [data-next]');

  const showStep = (step: WizardStep): void => {
    currentStep = step;
    const currentIndex = stepOrder.indexOf(step);
    for (const panel of panels) panel.hidden = panel.dataset.stepPanel !== step;
    for (const marker of markers) {
      const markerIndex = stepOrder.indexOf(marker.dataset.stepMarker as WizardStep);
      marker.dataset.state =
        markerIndex < currentIndex ? 'done' : markerIndex === currentIndex ? 'active' : 'pending';
      query<HTMLElement>(marker, 'span').textContent =
        markerIndex < currentIndex ? '✓' : String(markerIndex + 1);
    }
  };
  const syncReview = (): void => {
    const name = query<HTMLInputElement>(element, '[name="project-name"]').value;
    const framework = query<HTMLSelectElement>(element, '[name="framework"]').value;
    query<HTMLElement>(element, '[data-review-repository]').textContent =
      `qiudeng7/${selectedRepository}`;
    query<HTMLElement>(element, '[data-review-name]').textContent = name;
    query<HTMLElement>(element, '[data-review-framework]').textContent = framework;
    query<HTMLElement>(element, '[data-deployment-url]').textContent = `${name}.vercel.app`;
  };
  for (const button of repositoryButtons) {
    listen(
      button,
      'click',
      () => {
        selectedRepository = button.dataset.repository ?? '';
        for (const candidate of repositoryButtons) {
          candidate.setAttribute('aria-pressed', String(candidate === button));
        }
        importNext.disabled = false;
        query<HTMLElement>(element, '[data-selected-repository]').textContent =
          `qiudeng7/${selectedRepository}`;
      },
      context.signal,
    );
  }
  listen(
    repositorySearch,
    'input',
    () => {
      const term = repositorySearch.value.trim().toLowerCase();
      let visibleRepositories = 0;
      for (const button of repositoryButtons) {
        button.hidden = term !== '' && !button.textContent?.toLowerCase().includes(term);
        if (!button.hidden) visibleRepositories += 1;
      }
      repositoryEmpty.hidden = visibleRepositories !== 0;
    },
    context.signal,
  );
  for (const button of queryAll<HTMLButtonElement>(element, '[data-next]')) {
    listen(
      button,
      'click',
      () => {
        if (currentStep === 'import') showStep('configure');
        else if (currentStep === 'configure') {
          syncReview();
          showStep('deploy');
        }
      },
      context.signal,
    );
  }
  for (const button of queryAll<HTMLButtonElement>(element, '[data-back]')) {
    listen(
      button,
      'click',
      () => showStep(currentStep === 'deploy' ? 'configure' : 'import'),
      context.signal,
    );
  }
  for (const toggle of queryAll<HTMLButtonElement>(element, '.ui-switch')) {
    listen(
      toggle,
      'click',
      () =>
        toggle.setAttribute('aria-checked', String(toggle.getAttribute('aria-checked') !== 'true')),
      context.signal,
    );
  }
  const deployButton = query<HTMLButtonElement>(element, '[data-deploy]');
  listen(
    deployButton,
    'click',
    () => {
      deployButton.disabled = true;
      deployButton.textContent = 'Deploying…';
      deployTimer = window.setTimeout(() => {
        query<HTMLElement>(element, '.deploy-result').hidden = false;
        deployButton.textContent = 'Visit Deployment';
        deployButton.disabled = false;
        context.notify('Production deployment is ready');
        deployTimer = undefined;
      }, 900);
    },
    context.signal,
  );
  context.signal.addEventListener(
    'abort',
    () => {
      if (deployTimer !== undefined) window.clearTimeout(deployTimer);
    },
    { once: true },
  );
  for (const control of queryAll<HTMLElement>(element, '[data-notify]')) {
    listen(
      control,
      'click',
      () => context.notify(control.dataset.notify ?? 'Action completed'),
      context.signal,
    );
  }
  showStep('import');
  return element;
}

export const createPage: PageDefinition = {
  id: 'create',
  index: '06',
  label: 'Create',
  shortLabel: '创建',
  render: renderCreate,
};
