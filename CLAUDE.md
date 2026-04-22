# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `timelog-app/`:

- Dev server: `npm run dev`
- Type-check + build: `npm run build`
- Preview production build: `npm run preview`

## Target UI

A Tempo/spreadsheet-style timesheet calendar (see screenshot). Key characteristics:

- **Layout:** days as columns (1–30/31), projects as rows — not a month grid
- **Header toolbar:** Today button · prev/next arrows · date range label · Month/Week toggle · "Working from Home" primary CTA · "Configure projects" · "Log work"
- **Left column:** "X% logged" progress bar + expandable project rows (⊙ icon)
- **Day columns:** today highlighted in blue; weekends (S/S) have a cream background and no expected-hours values
- **Summary rows** (below projects): Daily hours total · Expected hours (8 h per workday) · Difference (logged − expected, shown red when negative)
- **Row totals:** Σ column on the far right per project and per summary row
- **Period status:** "open" label at the bottom center · "Close period" green button

## Architecture

**Stack:** Vue 3 + Vite + TypeScript. No router, no state library — all state lives in `App.vue` via `ref`.

**Data model** (`src/types.ts`):

```ts
interface Project { id: string; name: string }
interface LogEntry { id: string; date: string; projectId: string; hours: number }
```

**Component hierarchy:**

```
App.vue                    — owns projects[], entries[], currentMonth, view ('month'|'week')
  CalendarToolbar.vue      — Today / prev-next / date label / Month-Week toggle / action buttons
  TimesheetGrid.vue        — scrollable grid: project rows × day columns
    ProjectRow.vue         — one row per project; cells emit log-hours
    SummaryRows.vue        — Daily total / Expected / Difference rows
  LogWorkModal.vue         — modal opened by "Log work" button; project + date + hours form
  ConfigureProjects.vue    — modal to add/remove projects
```

State flows down as props; mutations bubble up via `emit`. `App.vue` is the single source of truth for `entries[]` and `projects[]`.

**Key derived values (computed in `App.vue`):**
- `entriesByDateAndProject` — `Map<date, Map<projectId, hours>>` for O(1) cell lookup
- `dailyTotals` — sum of all project hours per day
- `expectedHours` — 8 for weekdays, 0 for weekends
- `percentLogged` — `sum(dailyTotals) / sum(expectedHours) * 100`
