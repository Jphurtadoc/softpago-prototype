---
name: dashboard-ui-prototyping
description: Explore divergent dashboard UI directions as named Storybook stories before committing to one layout. Remix strongest parts, fill lived-in sample data and edge states (empty/loading/error/dense). Use early on UI-heavy screens in apps/web — after requirements, before locking layout.
origin: adapted-from-rshankras/claude-code-apple-skills/design/ui-prototyping
---

# Dashboard UI Prototyping

Avoid anchoring on the first layout guess. Explore **divergent** options as real React + Storybook stories that reuse the AWT kit.

## When this skill activates

- New dashboard page / dense panel / navigation shape unclear
- User asks for alternatives, redesign options, or "how should this look"
- Before a large UI rewrite

## Method — go wide → remix → lived-in → tune

### Stage 1 — Go wide

1. Lock brief: one screen, 3–5 must-have features, mood (dense ops / calm overview / marketing-lite), 0–2 reference UIs.
2. Produce **4–6 divergent** layouts. Divergence = organizing metaphor (table-first vs split master-detail vs KPI strip + list vs drawer-driven), not just tint.
3. Each variation = named Storybook story (or clearly named component): `"Ops Dense"`, `"Overview Cards"`, `"Master Detail"`.
4. Only requested features — no invented widgets.
5. Compose from `shared/components/UI` + theme tokens.

### Stage 2 — Remix + lived-in

1. User picks elements by story name. Build hybrids.
2. Sample data must be messy and realistic (long names, empty fields, many rows).
3. Edge stories minimum:
   - Empty
   - Loading
   - Error
   - Dense / many rows / long labels

### Stage 3 — Tune

- Subtle motion only (drawer/modal enter, row hover) — CSS transitions / existing kit patterns
- Verify `sm` / `md` / `lg` breakpoints and light/dark
- Record decision so implementation does not drift

## Output

Short decision note (chat or `PROTOTYPE.md` only if user asks for a file):

```markdown
# UI Prototype — [Screen]

## Variations
| Story name | Idea | Verdict |

## Chosen direction
## Edge states covered
## Kit components used
```

## Rules

- Agents propose; user chooses.
- No Swift / Apple Preview APIs — Storybook + React only.
- Pair with `awt-dashboard-ui` and `dashboard-ui-review` after a direction wins.
