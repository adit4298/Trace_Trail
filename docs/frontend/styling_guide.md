# Frontend Styling Guide

Trace Trail combines Tailwind utility classes with global CSS variables for
consistent theming. Follow these guidelines to keep the UI accessible and easy
to maintain.

---

## Core Principles

1. **Design tokens first** — Colors, spacing, typography live in
   `src/styles/variables.css`. Reference them via CSS variables or Tailwind
   config so updates propagate globally.
2. **Utility + component classes** — Use Tailwind utilities for layout and
   spacing, then wrap reusable patterns in component-specific classes defined in
   `src/styles/globals.css`.
3. **Dark mode ready** — `ThemeContext` toggles a `data-theme` attribute. Scope
   color overrides under `[data-theme='dark']`.

---

## Tailwind Configuration

- File: `tailwind.config.js`
- `content` scans `index.html` and everything in `src/**/*.{ts,tsx}` — extend if
  you add new directories.
- Customize theme extensions (`colors`, `boxShadow`, `fontFamily`) when tokens
  diverge from defaults.

---

## CSS Files

| File                     | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `index.css`              | Resets + mounts Tailwind base layers           |
| `styles/globals.css`     | Semantic classes (`.card`, `.pill`, `.chip`)    |
| `styles/animations.css`  | Keyframes shared by loaders + transitions      |

Keep CSS files small and composable; prefer `@layer components` when defining
Tailwind component classes.

---

## Accessibility

- Ensure color contrast ratio ≥ 4.5:1 (use the design tokens already validated
  by Design team).
- Focus states are mandatory. Use `:focus-visible` styles to avoid outlines only
  when appropriate.
- Animate responsibly: prefer 200–400ms durations and allow users to reduce
  motion via `prefers-reduced-motion`.

---

## Asset Pipeline

- Static images live in `src/assets/images/`.
- Lottie animations (`loading.json`, `success.json`) sit in
  `src/assets/animations/`.
- SVG icons (platform logos) live in `src/assets/icons/`.

Import SVGs as React components via Vite or use `<img>` for simple cases.

---

## Theming Tips

- Use CSS variables inside Tailwind config:

```js
colors: {
  brand: {
    DEFAULT: 'var(--color-brand)',
    emphasis: 'var(--color-brand-emphasis)',
  },
}
```

- Toggle theme via `document.documentElement.dataset.theme`.
- Persist theme preference in `useLocalStorage` (see `ThemeContext`).

---

## Linting & Formatting

- Run `npm run lint` to catch unused classes or invalid CSS.
- `npm run format` aligns CSS + TS formatting using Prettier.
- Optional: add `stylelint` in the future; track in backlog issue TT-89.


