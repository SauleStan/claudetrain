<template>
  <div class="grid-wrap">
    <div class="grid-scroll">
      <table class="grid">
        <!-- Header row: progress badge + day columns + Σ -->
        <thead>
          <tr>
            <th class="label-col sticky-col">
              <div class="progress-badge">{{ percentLogged }}% logged</div>
            </th>
            <th
              v-for="day in days"
              :key="day.date"
              class="day-header"
              :class="{ 'col-today': day.isToday, 'col-weekend': day.isWeekend }"
            >
              <div class="day-num">{{ day.num }}</div>
              <div class="day-letter">{{ day.letter }}</div>
            </th>
            <th class="sigma-col">&#x3A3;</th>
          </tr>
        </thead>

        <!-- Project rows -->
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td class="label-col sticky-col project-label">
              <span class="expand-icon">&#x2299;</span>
              <a class="project-link">{{ project.name }}</a>
            </td>
            <td
              v-for="day in days"
              :key="day.date"
              class="entry-cell"
              :class="{ 'col-today': day.isToday, 'col-weekend': day.isWeekend }"
              @click="emit('log-hours', { date: day.date, projectId: project.id })"
            >
              {{ hoursLookup[day.date]?.[project.id] || '' }}
            </td>
            <td class="sigma-col row-sigma">{{ projectTotal(project.id) || 0 }}</td>
          </tr>
        </tbody>

        <!-- Summary rows -->
        <tfoot>
          <tr class="summary-row">
            <td class="label-col sticky-col summary-label">Daily hours total:</td>
            <td
              v-for="day in days"
              :key="day.date"
              class="summary-cell"
              :class="{ 'col-today': day.isToday, 'col-weekend': day.isWeekend }"
            >
              {{ dailyTotals[day.date] || '' }}
            </td>
            <td class="sigma-col row-sigma"><strong>{{ totalLogged }}</strong></td>
          </tr>
          <tr class="summary-row">
            <td class="label-col sticky-col summary-label">Expected hours:</td>
            <td
              v-for="day in days"
              :key="day.date"
              class="summary-cell"
              :class="{ 'col-today': day.isToday, 'col-weekend': day.isWeekend }"
            >
              {{ expectedHours[day.date] || '' }}
            </td>
            <td class="sigma-col row-sigma"><strong>{{ totalExpected }}</strong></td>
          </tr>
          <tr class="summary-row">
            <td class="label-col sticky-col summary-label">Difference:</td>
            <td
              v-for="day in days"
              :key="day.date"
              class="summary-cell"
              :class="{ 'col-today': day.isToday, 'col-weekend': day.isWeekend }"
            >
              <span v-if="getDiff(day.date) !== 0" :class="{ negative: getDiff(day.date) < 0 }">
                {{ getDiff(day.date) }}
              </span>
            </td>
            <td class="sigma-col row-sigma">
              <strong :class="{ negative: totalDiff < 0 }">{{ totalDiff }}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project, DayInfo } from '../types'

const props = defineProps<{
  projects: Project[]
  days: DayInfo[]
  hoursLookup: Record<string, Record<string, number>>
  dailyTotals: Record<string, number>
  expectedHours: Record<string, number>
  percentLogged: number
}>()

const emit = defineEmits<{
  (e: 'log-hours', payload: { date: string; projectId: string }): void
}>()

function projectTotal(projectId: string): number {
  return props.days.reduce((sum, day) => sum + (props.hoursLookup[day.date]?.[projectId] ?? 0), 0)
}

const totalLogged = computed(() =>
  props.days.reduce((sum, day) => sum + (props.dailyTotals[day.date] ?? 0), 0)
)

const totalExpected = computed(() =>
  props.days.reduce((sum, day) => sum + (props.expectedHours[day.date] ?? 0), 0)
)

const totalDiff = computed(() => totalLogged.value - totalExpected.value)

function getDiff(date: string): number {
  return (props.dailyTotals[date] ?? 0) - (props.expectedHours[date] ?? 0)
}
</script>

<style scoped>
.grid-wrap {
  background: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 4px 4px 0 0;
  border-bottom: none;
}

.grid-scroll {
  overflow-x: auto;
}

.grid {
  border-collapse: collapse;
  width: 100%;
  min-width: max-content;
  font-size: 12px;
}

/* Sticky label column */
.sticky-col {
  position: sticky;
  left: 0;
  z-index: 2;
  background: #fff;
}

.label-col {
  min-width: 170px;
  padding: 6px 10px;
  border-right: 1px solid #d8d8d8;
}

/* Day header cells */
.day-header {
  min-width: 36px;
  width: 36px;
  text-align: center;
  padding: 4px 2px 6px;
  border: 1px dashed #e0e0e0;
  vertical-align: bottom;
  font-weight: normal;
}

.day-num { font-size: 12px; color: #333; line-height: 1.3; }
.day-letter { font-size: 11px; color: #888; }

/* Sigma column */
.sigma-col {
  min-width: 44px;
  width: 44px;
  text-align: center;
  padding: 4px 6px;
  border-left: 1px solid #d8d8d8;
}

/* Row coloring */
.col-today { background: #ddeeff !important; }
.col-weekend { background: #fffde7; }
.col-today.col-weekend { background: #ddeeff !important; }

/* Progress badge */
.progress-badge {
  display: inline-block;
  background: #e0e0e0;
  color: #555;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 3px;
}

/* Project rows */
.project-label {
  border-bottom: 1px solid #e8e8e8;
}

.expand-icon {
  margin-right: 6px;
  color: #1a73e8;
  font-size: 14px;
  cursor: pointer;
}

.project-link {
  color: #1a73e8;
  cursor: pointer;
  font-size: 13px;
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

/* Entry cells (clickable) */
.entry-cell {
  text-align: center;
  padding: 6px 2px;
  border: 1px dashed #e0e0e0;
  cursor: pointer;
  color: #333;
  font-size: 12px;
}

.entry-cell:hover {
  background: #e8f4fd !important;
}

/* Row sigma */
.row-sigma {
  font-size: 12px;
  color: #333;
}

/* Summary rows */
.summary-row .sticky-col {
  border-top: 1px solid #d8d8d8;
}

.summary-label {
  text-align: right;
  font-size: 12px;
  color: #555;
  padding-right: 12px;
}

.summary-cell {
  text-align: center;
  padding: 4px 2px;
  border: 1px dashed #e0e0e0;
  font-size: 12px;
  color: #555;
}

.negative {
  color: #c62828;
}
</style>
