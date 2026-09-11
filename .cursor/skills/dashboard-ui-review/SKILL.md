---
name: dashboard-ui-review
description: Structured UI/UX review for AWT React dashboard screens — design-system reuse, theme tokens, responsive layout, WCAG accessibility, loading/empty/error states, and dark mode. Use when reviewing UI, checking a11y, fixing layout density, or verifying HIG-like quality on web.
origin: adapted-from-rshankras/claude-code-apple-skills/ios/ui-review
---

# Dashboard UI Review

Review React/TSX in `apps/web` against AWT kit + WCAG 2.1 AA habits (not Apple HIG APIs).

## When this skill activates

- "Review UI", "check accessibility", "fix responsive", "design review"
- Before shipping a dashboard page or shared component

## Process

1. Identify files (user path or recent `presentation` / `UI` changes).
2. Prefer reviewing screens that compose kit components; then the primitives themselves.
3. Report findings with severity and concrete fix (component/token/class).

## Checklist

### Design system

- [ ] Uses `shared/components/UI` primitives — no parallel one-off controls
- [ ] Colors/surfaces from `theme.css` tokens — no hard-coded hex in JSX
- [ ] Light + dark both readable
- [ ] Spacing/typography consistent with neighboring screens

### Layout & responsive

- [ ] Mobile-first; no horizontal overflow at ~360px
- [ ] Touch targets ≥ 44px on small viewports
- [ ] Page header actions stack on narrow, row on `md+`
- [ ] Tables scroll or switch to card/list pattern on small screens when needed
- [ ] Sidebar/appbar behavior matches existing shell

### States

- [ ] Loading scoped to the panel (not whole shell) when possible
- [ ] Empty uses kit `Empty` with CTA
- [ ] Error uses alert patterns; recoverable when possible
- [ ] Destructive actions confirm (`AlertDialog` / modal)

### Accessibility

- [ ] Semantic headings / landmarks
- [ ] Icon-only buttons have `aria-label`
- [ ] Focus visible; keyboard can reach all actions
- [ ] Not color-only status (pair icon/text)
- [ ] Forms: labels tied to inputs; errors announced per field
- [ ] `prefers-reduced-motion` respected for non-essential animation

### Copy

- [ ] i18n keys — no stray hard-coded UI strings
- [ ] Run `ux-writing` PACE on primary CTAs and empties

## Anti-patterns to flag

- Hard-coded `#fff` / `#000` / brand hex in components
- Fixed pixel fonts that ignore hierarchy
- Missing labels on icon buttons
- Important status by color only
- Full-page spinner for a table refresh
- New card/table markup instead of kit

## Output format

```
Severity | Location | Issue | Fix
```

Severities: Critical (blocks task/a11y) · High · Medium · Low · Strength

## Related

- `awt-dashboard-ui` — build rules
- `ux-writing` — copy rewrite table
