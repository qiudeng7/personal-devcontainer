import { icons, triangle } from '../components/icons';
import { elementFromHtml, listen, queryAll } from '../core/dom';
import type { PageContext, PageDefinition } from '../core/types';

const sectionNames = ['General', 'Members', 'Billing', 'Security', 'Notifications'] as const;

function switchRows(rows: readonly [string, string, boolean][]): string {
  return rows
    .map(
      ([title, copy, checked]) =>
        `<div class="settings-switch-row"><div><b>${title}</b><small>${copy}</small></div><button class="ui-switch" type="button" role="switch" aria-checked="${checked}"><i></i></button></div>`,
    )
    .join('');
}

function renderSettings(context: PageContext): HTMLElement {
  const element = elementFromHtml<HTMLElement>(`
    <div class="settings-page"><header class="settings-topbar"><div>${triangle()}<span>Qiudeng</span>${icons.chevron}<b>Settings</b></div><a class="avatar-control" href="?view=console" data-view="console">Q</a></header><div class="settings-layout"><aside><h2>Settings</h2>${sectionNames.map((section, index) => `<button type="button" data-settings-section="${section.toLowerCase()}" class="${index === 0 ? 'active' : ''}">${section}</button>`).join('')}<small>PROJECT</small><a href="?view=console" data-view="console">Environment Variables</a><a href="?view=console" data-view="console">Domains</a><a href="?view=console" data-view="console">Functions</a></aside>
      <div class="settings-panels"><section data-settings-panel="general"><header class="settings-heading"><div><h1>General</h1><p>Manage your team profile and default preferences.</p></div><button class="ui-button ui-button--primary ui-button--small" type="button" data-save-settings>Save Changes</button></header><article class="settings-card"><header><h2>Team Profile</h2><p>This information is visible to everyone in your team.</p></header><div class="settings-form-row"><label>Team Avatar<small>Choose a square image at least 256 × 256 px.</small></label><div class="avatar-upload"><span>Q</span><button type="button" data-notify="Avatar picker opened">Upload</button><button type="button" data-notify="Avatar removed">Remove</button></div></div><div class="settings-form-row"><label for="team-name">Team Name<small>A human-friendly name for your workspace.</small></label><input class="ui-input" id="team-name" value="Qiudeng's projects"></div><div class="settings-form-row"><label for="team-slug">Team Slug<small>Used in dashboard links and generated URLs.</small></label><input class="ui-input" id="team-slug" value="qiudeng"></div></article><article class="settings-card"><header><h2>Interface Preferences</h2><p>Choose how the dashboard behaves for this account.</p></header>${switchRows(
        [
          ['Compact navigation', 'Show more projects and settings in the sidebar.', true],
          ['Preview toolbar', 'Enable collaboration tools on preview deployments.', true],
        ],
      )}</article></section>
      <section data-settings-panel="members" hidden><header class="settings-heading"><div><h1>Members</h1><p>Manage access to this team.</p></div><button class="ui-button ui-button--primary ui-button--small" type="button" data-notify="Member invitation opened">Invite Member</button></header><div class="ui-table-frame"><table class="ui-table"><thead><tr><th>Member</th><th>Role</th><th>Joined</th></tr></thead><tbody><tr><td><b>Qiudeng</b><small>you@example.com</small></td><td>Owner</td><td>Aug 2024</td></tr><tr><td><b>Maria Chen</b><small>maria@example.com</small></td><td>Member</td><td>Jul 2026</td></tr><tr><td><b>Leo Zhang</b><small>leo@example.com</small></td><td>Developer</td><td>Jul 2026</td></tr></tbody></table></div></section>
      <section data-settings-panel="billing" hidden><header class="settings-heading"><div><h1>Billing</h1><p>Review plan usage, payment method, and invoices.</p></div><a class="ui-button ui-button--secondary ui-button--small" href="?view=pricing" data-view="pricing">Compare Plans</a></header><article class="billing-summary"><span class="eyebrow">CURRENT PLAN</span><div><h2>Pro</h2><strong>$40.00 <small>/ month</small></strong></div><p>2 paid members · Renews September 1, 2026</p><div class="billing-meter"><i></i></div><footer><span>681 GB of 1 TB data transfer</span><button type="button" data-notify="Invoice history opened">View Invoices</button></footer></article></section>
      <section data-settings-panel="security" hidden><header class="settings-heading"><div><h1>Security</h1><p>Protect accounts, deployments, and team resources.</p></div></header><article class="settings-card"><header><h2>Authentication</h2><p>Apply security controls to every team member.</p></header>${switchRows(
        [
          [
            'Require passkeys',
            'Require phishing-resistant authentication for privileged actions.',
            true,
          ],
          [
            'Enforce two-factor authentication',
            'Members must configure a second authentication factor.',
            false,
          ],
          [
            'Protect preview deployments',
            'Require authentication before a preview can load.',
            true,
          ],
        ],
      )}</article></section>
      <section data-settings-panel="notifications" hidden><header class="settings-heading"><div><h1>Notifications</h1><p>Choose which product events reach you.</p></div><button class="ui-button ui-button--primary ui-button--small" type="button" data-save-settings>Save Changes</button></header><article class="settings-card"><header><h2>Deployment Events</h2><p>These preferences apply to all projects in this team.</p></header>${switchRows(
        [
          ['Production deployments', 'Notify when production becomes ready or fails.', true],
          ['Preview deployments', 'Notify for every branch preview.', false],
          ['Security events', 'Notify when protection rules block traffic.', true],
        ],
      )}</article></section>
      </div></div>
    </div>
  `);
  const sectionButtons = queryAll<HTMLButtonElement>(element, '[data-settings-section]');
  const panels = queryAll<HTMLElement>(element, '[data-settings-panel]');
  for (const button of sectionButtons) {
    listen(
      button,
      'click',
      () => {
        for (const candidate of sectionButtons)
          candidate.classList.toggle('active', candidate === button);
        for (const panel of panels)
          panel.hidden = panel.dataset.settingsPanel !== button.dataset.settingsSection;
      },
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
  for (const save of queryAll<HTMLButtonElement>(element, '[data-save-settings]')) {
    listen(save, 'click', () => context.notify('Settings saved'), context.signal);
  }
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

export const settingsPage: PageDefinition = {
  id: 'settings',
  index: '07',
  label: 'Settings',
  shortLabel: '设置',
  render: renderSettings,
};
