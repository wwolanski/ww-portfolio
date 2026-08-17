# Wojciech Wolanski — portfolio

## Source of truth


A high-fidelity, responsive implementation of the supplied visual concept. The landing page keeps the original editorial composition while every artwork becomes an interactive entry into a dedicated page.

## Stack

- React 19 and TypeScript in strict mode
- Vite 8
- Tailwind CSS 4 with CSS-first design tokens
- React Router in declarative mode
- Vitest and Testing Library

## Run locally

```bash
npm install
npm run dev
```

For a full verification pass:

```bash
npm run check
```

## Architecture

The code uses a deliberately small section/feature-first structure:

- `pages/` owns route-level composition;
- `components/layout/` contains the shared sticky artwork shell and navigation;
- `features/theme/` isolates persistent light/dark mode state;
- `content/` keeps portfolio data separate from presentation;
- `components/ui/` contains only genuinely reused UI.

Static TypeScript modules are used for content because the site currently has one author and a small editorial surface. A CMS would add operational cost without improving the current workflow.

## Quality decisions

- Semantic landmarks, skip link, visible focus states, keyboard-safe controls and reduced-motion support are included by default.
- Theme preference is stored locally; dark is the intentional first-visit default.
- Images include intrinsic dimensions to prevent layout shift.
- TypeScript enables strict checks, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and unused-code checks.
- Tests target user-visible behavior: navigation, theme persistence, and article filtering.
- No global state library is used because the only shared state is the theme.

## Trade-offs

The supplied artwork is loaded as SVG because it is the defining visual asset and should remain sharp at every size. It is loaded once by Vite and reused as both the home cards and route panels.

The newsletter and project URLs are presentation-ready placeholders. They intentionally do not simulate a successful backend operation; production deployment should connect them to real endpoints and validation at the server boundary.
