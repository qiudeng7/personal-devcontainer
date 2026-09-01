import type { PageDefinition } from '../core/types';
import { consolePage } from './console';
import { createPage } from './create';
import { docsPage } from './docs';
import { explorePage } from './explore';
import { homePage } from './home';
import { launchPage } from './launch';
import { pricingPage } from './pricing';
import { settingsPage } from './settings';
import { updatesPage } from './updates';

export const pages: readonly PageDefinition[] = [
  consolePage,
  launchPage,
  homePage,
  docsPage,
  explorePage,
  createPage,
  settingsPage,
  updatesPage,
  pricingPage,
];
