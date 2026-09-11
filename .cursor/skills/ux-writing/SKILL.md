---
name: ux-writing
description: Interface copy for the AWT dashboard — voice/tone, PACE framework, alert anatomy, empty/error states, feature naming, and small edits that improve UX. Adapted from Apple UX writing sessions for React + i18n. Use when writing or reviewing user-facing text (labels, alerts, empty states, errors, buttons, onboarding).
origin: adapted-from-rshankras/claude-code-apple-skills/design/ux-writing
---

# UX Writing (AWT)

Interface text is interface design. Write for operators using a multi-tenant dashboard.

## When this skill activates

- Labels, buttons, alerts, empty states, errors, onboarding, tooltips
- Naming a feature, filter, or setting
- Preparing copy that must survive `react-i18next` translation

## PACE

- **Purpose** — what must this screen communicate? Headers + primary buttons should carry the screen alone.
- **Anticipation** — what does the user do next? Write for that.
- **Context** — mid-task vs idle; say less under pressure.
- **Empathy** — person with a problem, not a system dumping codes.

## Four small edits

1. Cut filler: easily / quickly / simply / just
2. Kill repetition — merge redundant sentences
3. Lead with the why (benefit before action)
4. Keep a word list — one approved term per concept (e.g. "cuenta" not mixed with "cliente" for the same entity)

## Alert anatomy

Alerts interrupt — only for things the user must know now.

- **Title:** main point, one sentence
- **Message:** only if needed
- Title + buttons alone must convey the situation
- Name the fix; avoid vague hedging

## Empty / error / i18n

- **Empty:** say what will appear and how; offer a CTA via kit `Empty`
- **Error:** user-friendly message; no stack traces or Mongo codes in UI
- **i18n:** put strings in locale files; plain language; leave room for longer translations

## Output format

```
Location | Current | Problem (PACE / filler / jargon) | Rewrite | i18n key
```

Order by exposure (nav labels before deep-screen prose).

## References

- https://developer.apple.com/videos/play/wwdc2022/10037/
- https://developer.apple.com/videos/play/wwdc2024/10140/
- Pair with `awt-dashboard-ui` for component placement of copy
