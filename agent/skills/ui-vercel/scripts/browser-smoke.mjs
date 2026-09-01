import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { preview } from 'vite';

const previewServer = await preview({
  logLevel: 'error',
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: false,
  },
});

const address = previewServer.httpServer.address();
if (!address || typeof address === 'string') {
  previewServer.httpServer.close();
  throw new Error('Unable to resolve the Vite preview server address.');
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const runtimeErrors = [];
const passedChecks = [];
let activeScene = 'startup';

page.on('pageerror', (error) => {
  runtimeErrors.push(`[${activeScene}] pageerror: ${error.message}`);
});
page.on('console', (message) => {
  if (message.type() === 'error') {
    runtimeErrors.push(`[${activeScene}] console: ${message.text()}`);
  }
});

function pass(label) {
  passedChecks.push(label);
}

async function expectVisible(locator, label) {
  assert.equal(await locator.isVisible(), true, label);
  pass(label);
}

async function openScene(scene) {
  activeScene = scene;
  const response = await page.goto(`http://127.0.0.1:${address.port}/?view=${scene}`, {
    waitUntil: 'networkidle',
  });
  assert.equal(response?.ok(), true, `${scene} returned a successful response`);
  await page.waitForFunction(
    (expectedScene) => document.querySelector('.page-outlet')?.dataset.page === expectedScene,
    scene,
  );
}

try {
  await openScene('console');
  await page.locator('#console-tab-overview').focus();
  await page.keyboard.press('ArrowRight');
  await expectVisible(
    page.locator('#console-panel-deployments'),
    'Console keyboard tabs reveal the matching panel',
  );
  assert.equal(
    await page.locator('#console-tab-deployments').getAttribute('aria-selected'),
    'true',
  );
  pass('Console tabs update aria-selected');

  await openScene('home');
  await page.locator('[data-command-trigger]').click();
  await page.locator('dialog input[type="search"]').fill('preferences');
  assert.equal(await page.locator('[data-command-list] a:visible').count(), 1);
  assert.match(
    (await page.locator('[data-command-list] a:visible').textContent()) ?? '',
    /Open preferences/,
  );
  pass('Command search hides nonmatching commands');
  await page.locator('dialog input[type="search"]').fill('no matching command');
  await expectVisible(page.locator('.command-empty'), 'Command search exposes its empty state');
  await page.locator('[data-dialog-close]').click();

  await openScene('docs');
  await page.locator('[data-command="pnpm"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-command="npm"]').getAttribute('aria-selected'), 'true');
  assert.match(
    (await page.locator('[data-command-output]').textContent()) ?? '',
    /npx northstar init/,
  );
  pass('Docs keyboard tabs change the command and semantic state');

  await openScene('explore');
  await page.locator('input[aria-label="Search templates"]').fill('no matching template');
  assert.equal(await page.locator('.template-card:visible').count(), 0);
  await expectVisible(page.locator('.empty-results'), 'Explore filtering exposes its empty state');

  await openScene('create');
  const selectedRepository = page.locator('[data-repository]').first();
  const repositoryName = await selectedRepository.getAttribute('data-repository');
  assert.ok(repositoryName, 'Expected a repository fixture name.');
  await selectedRepository.click();
  assert.equal(await page.locator('[data-step-panel="import"] [data-next]').isEnabled(), true);
  await page.locator('[data-step-panel="import"] [data-next]').click();
  await page.locator('[name="project-name"]').fill('browser-smoke-project');
  await page.locator('[name="framework"]').selectOption({ label: 'Vue' });
  await page.locator('[data-step-panel="configure"] [data-next]').click();
  assert.equal(await page.locator('[data-review-name]').textContent(), 'browser-smoke-project');
  assert.equal(await page.locator('[data-review-framework]').textContent(), 'Vue');
  assert.ok(
    ((await page.locator('[data-review-repository]').textContent()) ?? '').includes(repositoryName),
  );
  await page.locator('[data-step-panel="deploy"] [data-back]').click();
  assert.equal(await page.locator('[name="project-name"]').inputValue(), 'browser-smoke-project');
  assert.equal(await page.locator('[name="framework"]').inputValue(), 'Vue');
  await page.locator('[data-step-panel="configure"] [data-back]').click();
  assert.equal(await selectedRepository.getAttribute('aria-pressed'), 'true');
  pass('Create wizard preserves repository and configuration state when moving backward');

  await openScene('settings');
  const settingsSwitch = page.locator('[data-settings-panel="general"] .ui-switch').first();
  const checkedBefore = await settingsSwitch.getAttribute('aria-checked');
  await settingsSwitch.click();
  assert.notEqual(await settingsSwitch.getAttribute('aria-checked'), checkedBefore);
  pass('Settings switch changes aria-checked');

  await openScene('updates');
  await page.locator('input[aria-label="Search updates"]').fill('no matching update');
  assert.equal(await page.locator('[data-update-category]:visible').count(), 0);
  await expectVisible(page.locator('.updates-empty'), 'Updates filtering exposes its empty state');

  await openScene('pricing');
  const proPrice = page.locator('[data-plan="pro"] [data-price]');
  const monthlyPrice = await proPrice.textContent();
  await page.locator('[data-period="yearly"]').click();
  assert.notEqual(await proPrice.textContent(), monthlyPrice);
  assert.equal(await page.locator('[data-period="yearly"]').getAttribute('aria-pressed'), 'true');
  pass('Pricing period changes prices and aria-pressed');

  assert.deepEqual(runtimeErrors, [], `Browser runtime errors:\n${runtimeErrors.join('\n')}`);
  pass('No pageerror or console error was emitted');

  console.log(`Browser smoke passed ${passedChecks.length} checks:`);
  for (const check of passedChecks) console.log(`- ${check}`);
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolveClose, rejectClose) => {
    previewServer.httpServer.close((error) => (error ? rejectClose(error) : resolveClose()));
  });
}
