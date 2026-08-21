# CSS architecture

`src/styles/index.css` is the only CSS entrypoint. `src/main.tsx` imports it once; components and pages do not import CSS directly.

## Cascade order

The entrypoint declares and uses these layers, from lowest to highest priority:

1. `theme` — Tailwind theme tokens in `tokens.css`.
2. `base` — reset, document defaults, shared variables and keyframes.
3. `components.primitives` — headings, closing sections, theme toggle and language switcher.
4. `components.ui` — reusable links, chips, tags, badges, copy controls and modal UI.
5. `components.layout` — detail shell, visual panel and navigation.
6. `components.content` — MDX typography, code, tables, gallery, TOC and alerts.
7. `components.pages` — page-specific styles for home, projects, blog, skills and about.
8. `utilities` — reserved for utility overrides and Tailwind utilities.

`theme.css` stays unlayered because Tailwind requires `@custom-variant` at the top level. Font-face imports also remain in the entrypoint and are not visual cascade rules.

## Ownership and naming

Each selector has one owner file. Shared components use BEM-style names such as `project-modal__panel`; page roots use a page prefix such as `.about-page` or `.detail-page--projects`. Modifiers use `--`, and state uses explicit classes or attributes such as `.site-links__link--active`, `.language-switcher__option--current`, `.is-expanded` and `[aria-expanded="true"]`.

MDX styles are split by responsibility: `MdxContent.css` owns document layout, typography, code and tables; `MdxTableOfContents.css` owns navigation; `ContentAlert.css` owns alert variants.

## Adding or changing styles

1. Find the owning component/page and edit its CSS file.
2. Keep the selector in that file only; add a page root or BEM block instead of a generic historical class.
3. Add shared primitives to the appropriate component layer and register new files in `index.css`.
4. Run `npm run lint:css`, the relevant unit tests, `npm run build`, and the visual route/state matrix when layout or responsive rules change.
