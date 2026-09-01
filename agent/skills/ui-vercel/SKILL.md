---
name: ui-vercel
description: Design or implement restrained, precise, product-led web interfaces inspired by Vercel's visual language. Use only when the user's current request explicitly mentions Vercel or asks for a Vercel-style interface. Do not invoke for generic UI or frontend work, even when similar patterns might fit. Do not copy Vercel trademarks, copy, or existing product pages.
---

# Vercel-style UI

Preserve the user's chosen technology stack. This skill provides visual language, page structure,
and interaction contracts; it does not require the reference implementation's native TypeScript
runtime.

## Workflow

1. Choose one primary scene for the product task. Read the scene table in
   [the design guide](./references/design-guide.md) only when comparing scenes; do not assemble a
   page from several complete scene layouts.
2. Read only the matching `src/pages/<scene>.ts`, `src/styles/pages/<scene>.css`, and the component
   contracts needed for the task.
3. Start from the semantic tokens in [components/tokens](./components/tokens). Use
   [components/README.md](./components/README.md) to locate specific markup and state contracts.
4. Translate the structure into the target framework while preserving native semantics, ARIA state,
   and real interactions. Do not copy the Northstar sample brand, sample data, or copy.
5. Before delivery, test keyboard, mobile, repeated navigation, and repeated clicks. Every control
   that looks interactive must have a real destination or state transition.

## Invariants

- Establish hierarchy with type, spacing, density, and hairline borders before adding color.
- Use real URLs for links; never substitute `href="#"` for a button.
- Tabs reveal matching content, and filters change results and expose an empty state.
- Dispose page-scoped listeners, timers, observers, and animation frames on teardown.
- Batch pointer and scroll effects with `requestAnimationFrame` and respect
  `prefers-reduced-motion`.
- Avoid large continuously blurred regions, frame-by-frame layout read/write cycles, and global state
  added only for decoration.

Read [the design guide](./references/design-guide.md) only for cross-scene comparison,
framework-specific adaptation, or the extended delivery checklist. Use the
[screenshot gallery](./README.md#页面截图) or the live preview linked from the README for visual
selection.
