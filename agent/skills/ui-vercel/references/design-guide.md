# Framework-neutral product UI design guide

Read this reference only when comparing page scenes, adapting the system across frameworks, or using
the extended delivery checklist. The concise `SKILL.md` remains the single Agent entrypoint.

Use this playbook when an interface should feel precise, calm, technical, and product-led. It is a
source document for Agents working in this repository. It does not require React, Vue, or this
reference implementation's TypeScript runtime.

## Source priority

When instructions conflict, follow this order:

1. The user's product and interaction requirements.
2. Semantic state and accessibility contracts in `components/*/README.md`.
3. Semantic tokens in `components/tokens/tokens.css` and `tokens.json`.
4. The closest scene in `src/pages/` and `src/styles/pages/`.
5. Decorative details from other scenes.

Do not copy a whole page when only one primitive is needed. Do not copy the fictional Northstar
brand, sample data, or prose into a real product unless the user asks for it.

## Choose the scene before composing

| Product need | Primary scene | Useful secondary references |
| --- | --- | --- |
| Monitor and operate a product | `console` | `settings`, `updates` |
| Explain a product and drive activation | `launch` | `pricing`, `home` |
| Establish a strong brand entry point | `home` | `launch`, `explore` |
| Teach an API or developer workflow | `docs` | `updates`, `create` |
| Browse templates or catalog items | `explore` | `home`, `pricing` |
| Guide setup through ordered decisions | `create` | `docs`, `console` |
| Manage dense preferences and access | `settings` | `console`, `pricing` |
| Communicate releases over time | `updates` | `docs`, `explore` |
| Compare plans and support purchase | `pricing` | `launch`, `settings` |

Use one scene as the structural model. Borrow only small patterns from secondary references so the
page keeps a clear information hierarchy.

## Visual language

- Prefer neutral surfaces, hairline borders, compact controls, and deliberate empty space.
- Use a single strong black/white action per decision area; secondary actions should recede.
- Build hierarchy with type scale, density, and grouping before adding color.
- Use the mono face for metadata, timestamps, code, indices, and terse labels—not body copy.
- Keep corner radii restrained. Large rounded cards should signal a distinct object, not decorate
  every section.
- Grids and radial light are supporting surfaces. They must not lower contrast or dominate content.
- Use semantic tokens. Never spread raw near-identical gray values across a new implementation.

## Component contract

The portable components live under `components/`. Preserve these interfaces when adapting them:

- **Button:** native button or valid link; visible focus; disabled means truly unavailable.
- **Tabs:** `role=tablist`, `role=tab`, `aria-selected`, and a real corresponding tabpanel.
- **Status:** communicate tone in text or accessible labeling, not color alone.
- **Data table:** use a semantic table for tabular relationships; add a mobile strategy explicitly.
- **Form field:** bind every control to a visible label and expose errors beside the field.
- **Dialog:** use native dialog behavior where available; restore focus and support Escape.

Copy the semantic HTML first, then translate state binding into the target framework. CSS classes and
tokens can be retained or mapped to the target design system.

## Interaction rules

- A control that looks interactive must perform a real, immediate action.
- Navigation must use a real URL. Preserve open-in-new-tab and browser history behavior.
- Never use `href="#"` as a button substitute.
- A selected tab must reveal different content, not merely change its underline.
- Filters must change the visible result set and expose the empty state.
- Multi-step flows must preserve completed choices when moving backward.
- Destructive actions require explicit confirmation; do not hide them behind ambiguous icon-only
  controls.
- Provide pending, success, empty, and error states for operations that can take time or fail.

## Performance rules

- When the target architecture has a persistent application shell, keep it mounted and replace the
  smallest useful route outlet.
- Scope event listeners, observers, animation frames, and timers to the page/component lifecycle;
  dispose them when that scope leaves the document.
- Batch pointer or scroll visual work with `requestAnimationFrame`.
- Animate transforms and opacity. Avoid continuous layout reads followed by layout writes.
- Do not place large animated `backdrop-filter`, blur, or shadow regions under pointer-driven effects.
- Respect `prefers-reduced-motion`; decorative motion must not be required to understand state.
- Test repeated navigation and repeated clicks, not only the first render.

## Accessibility and responsive behavior

- Use landmarks and native elements before adding ARIA.
- Preserve keyboard order and visible focus at every breakpoint.
- Keep controls at a practical touch size even when labels and data are visually compact.
- Collapse navigation intentionally. Do not let it overflow off-screen without an alternate path.
- For dense tables, choose horizontal scrolling, priority columns, or a card transformation based on
  the data relationship; do not silently drop data.
- Verify text and status contrast on both light and dark scenes.

## Adapting to a framework

### Vue

Represent component state with `ref`/`computed`, bind ARIA attributes from the same state, and dispose
global effects through `onUnmounted`. Keep templates semantic; a component library is optional.

### React

Represent state locally until multiple routes genuinely share it. Clean up effects, avoid remounting
the global shell on every route, and do not turn static visual primitives into stateful components.

### Server-rendered or plain HTML

Render the semantic default state on the server. Add small delegated event handlers for tabs,
filters, and dialogs. The page must remain navigable when enhancement code is delayed.

### Other languages

Map `tokens.json` into native theme constants and treat every component README as an interface
contract. The source language may change; visual tokens, semantic structure, and state behavior do
not.

## Delivery checklist

Before calling an adapted page complete:

- [ ] The chosen scene matches the product task.
- [ ] Every visible control has a real destination or state transition.
- [ ] Loading, empty, error, and success behavior is defined where applicable.
- [ ] Keyboard and mobile paths work without hidden controls.
- [ ] Repeated navigation does not accumulate listeners, timers, or animation work.
- [ ] Type, lint, test, and production build checks pass in the target repository.
- [ ] Reference screenshots are refreshed when a visual change is approved.

Canonical screenshots live in `public/screenshots/`. The current public preview URL is maintained in
`README.md` so deployment metadata has one source of truth.
