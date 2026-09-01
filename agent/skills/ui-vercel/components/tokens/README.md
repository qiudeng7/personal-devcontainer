# Tokens

`tokens.css` is the browser source of truth. `tokens.json` exposes the stable semantic subset to
tools that cannot parse CSS. Prefer semantic names such as `--surface-raised` over literal names
such as `--gray-100` in component code.

Dark surfaces opt in through `[data-theme='dark']`; the system does not silently follow OS theme
because product pages may intentionally choose a presentation.
