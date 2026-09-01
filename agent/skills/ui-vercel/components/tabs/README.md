# Tabs contract

Tabs switch sibling views without navigation. Use `role="tablist"`, native buttons with
`role="tab"`, `aria-selected`, and a matching `aria-controls`. Switching must update actual
content immediately; never change only the selected styling.

Keep only the selected tab in the keyboard tab order. Left and Right Arrow should move selection and
focus, while switching also updates the matching panel's `hidden` state.
