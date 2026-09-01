import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const scenes = [
  ['01', 'console'],
  ['02', 'launch'],
  ['03', 'home'],
  ['04', 'docs'],
  ['05', 'explore'],
  ['06', 'create'],
  ['07', 'settings'],
  ['08', 'updates'],
  ['09', 'pricing'],
];

const outputDirectory = resolve('public/screenshots');
await mkdir(outputDirectory, { recursive: true });

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
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const runtimeErrors = [];

page.on('pageerror', (error) => runtimeErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') runtimeErrors.push(message.text());
});

try {
  const baseUrl = `http://127.0.0.1:${address.port}`;
  for (const [index, scene] of scenes) {
    await page.goto(`${baseUrl}/?view=${scene}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(
      (expectedScene) => document.querySelector('.page-outlet')?.dataset.page === expectedScene,
      scene,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: resolve(outputDirectory, `${index}-${scene}.png`),
      animations: 'disabled',
      caret: 'hide',
    });
  }
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolveClose, rejectClose) => {
    previewServer.httpServer.close((error) => (error ? rejectClose(error) : resolveClose()));
  });
}

if (runtimeErrors.length > 0) {
  throw new Error(`Screenshot run emitted browser errors:\n${runtimeErrors.join('\n')}`);
}

console.log(`Captured ${scenes.length} screenshots in ${outputDirectory}`);
