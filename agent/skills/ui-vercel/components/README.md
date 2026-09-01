# Framework-neutral components

This directory is the portable layer of the repository. Each component is expressed as:

- semantic HTML in `example.html`;
- standalone CSS with `ui-*` class names;
- a short contract in `README.md` describing states, accessibility, and adaptation points.

The TypeScript reference implementation imports these CSS files directly. An AI adapting the design to Vue, React,
Svelte, server-rendered templates, or plain HTML should preserve the markup semantics and state
attributes while translating only the rendering mechanism.

## Index

| Component | Contract | State interface |
| --- | --- | --- |
| Tokens | `tokens/` | CSS custom properties and JSON |
| Button | `button/` | classes and `disabled` |
| Tabs | `tabs/` | `aria-selected`, `role=tab` |
| Status | `status/` | `data-tone` |
| Data table | `data-table/` | semantic table markup |
| Form field | `form-field/` | native labels, inputs, `aria-checked` |
| Dialog | `dialog/` | native `<dialog>` |

These are visual and interaction contracts, not a published component package.
