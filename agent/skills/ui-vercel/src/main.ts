import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/base.css';
import './styles/shell.css';
import './styles/pages/site.css';
import './styles/pages/console.css';
import './styles/pages/launch.css';
import './styles/pages/home.css';
import './styles/pages/docs.css';
import './styles/pages/explore.css';
import './styles/pages/create.css';
import './styles/pages/settings.css';
import './styles/pages/updates.css';
import './styles/pages/pricing.css';
import './styles/motion.css';

import { createShell } from './components/shell';
import { createToastController } from './components/toast';
import { query } from './core/dom';
import { Router } from './core/router';
import { pages } from './pages';

const app = query<HTMLElement>(document, '#app');
const toast = createToastController();

let router: Router;
const shell = createShell(pages, (page) => router.navigate(page));

app.replaceChildren(shell.element, toast.element);

router = new Router({
  outlet: shell.outlet,
  pages,
  onActivePageChange: (page) => shell.setActive(page),
  notify: (message) => toast.show(message),
});

router.start();
