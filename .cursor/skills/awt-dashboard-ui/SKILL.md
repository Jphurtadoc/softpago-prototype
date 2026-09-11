---
name: awt-dashboard-ui
description: Build and improve AWT dashboard screens using the project's own UI kit (apps/web/src/shared/components/UI), theme tokens, responsive Tailwind layouts, and i18n. Use when designing layouts, composing dashboard pages, adding/extending UI components, or fixing responsive/theme issues in apps/web.
---

# AWT Dashboard UI

React dashboard with a **first-party component kit**. Prefer existing primitives over new one-offs or raw HTML.

## Stack anchors

- App: `apps/web` (Vite + React + React Router + Tailwind v4)
- Kit: `apps/web/src/shared/components/UI/`
- Tokens: `apps/web/src/shared/theme/theme.css` (`@theme` — brand, surfaces, text, semantic colors)
- Fonts: Poppins via `--font-sans` / `--font-heading`
- i18n: `react-i18next` — no hard-coded user-facing Spanish/English strings in components
- Stories: colocated `*.stories.tsx` (Storybook) for new/changed UI

## Hard rules

1. **Reuse before invent.** Search `shared/components/UI` for Button, Table, Card, Modal, Drawer, Empty, Spinner, Alert, Tabs, Sidebar, Pagination, TextField, Select, Menu, Badge, etc. Extend variants/props; do not fork parallel components.
2. **Tokens only.** Colors, surfaces, borders from theme CSS variables / Tailwind theme — no hex/rgb in JSX except rare brand assets.
3. **Compose screens from kit + feature modules.** Page/section code lives under `modules/**/presentation`; shared chrome under `shared/`.
4. **Responsive by default.** Mobile-first: stack → tablet split → desktop density. Sidebar/appbar collapse patterns already in kit — follow them.
5. **States are part of the UI.** Every list/detail needs loading (Spinner/skeleton), empty (`Empty`), error (`LoadErrorAlert` / alert), and success feedback.
6. **Accessibility.** Semantic landmarks, keyboard reachability, `aria-label` on icon-only controls, focus visible, contrast via theme pairs light/dark.
7. **Micro-interactions subtle.** Transition opacity/transform on hover/open; respect `prefers-reduced-motion`. No decorative motion that blocks work.

## Layout patterns (dashboard)

- **Shell:** appbar + sidebar + main content; content scrolls, chrome stays.
- **Page header:** title + short description + primary actions (right-aligned on `md+`, stacked on mobile).
- **Work surfaces:** tables for dense data; cards for summaries/KPIs; drawers/modals for create/edit — not new full pages for small forms.
- **Density:** desktop can be compact; touch targets ≥ 44px on mobile.
- **One job per section:** one heading, one supporting line, one primary CTA cluster.

## Component workflow

1. Grep/Glob existing kit component + story.
2. If gap: add under `shared/components/UI/<kebab-name>/` with `index.ts`, component, story; export named + match local patterns (`cn`, CVA if used).
3. Wire feature UI to kit; keep business logic in hooks/use-cases, not inside primitives.
4. Verify light + dark (`data-theme` / `.dark`) and narrow viewport.

## Anti-patterns

- New `div` card with ad-hoc border/shadow when `Card` exists
- Inline hex colors or one-off spacing scales
- Dashboard “wall of cards” without hierarchy
- Untranslated copy
- Blocking spinners for the whole shell when only a panel loads

## Related skills

- `ux-writing` — labels, empty/error copy
- `dashboard-ui-review` — structured UI/a11y pass
- `dashboard-ui-prototyping` — divergent layout options via Storybook
