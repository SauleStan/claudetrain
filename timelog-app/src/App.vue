<template>
  <div class="app">
    <h1 class="page-title">Calendar</h1>

    <CalendarToolbar
      :date-range="dateRange"
      :view="view"
      :wfh-active="wfhActive"
      @today="goToday"
      @prev="goPrev"
      @next="goNext"
      @set-view="view = $event"
      @toggle-wfh="wfhActive = !wfhActive"
      @open-configure="showConfigure = true"
      @open-log-work="openLogWork(null)"
    />

    <TimesheetGrid
      :projects="projects"
      :days="days"
      :hours-lookup="hoursLookup"
      :daily-totals="dailyTotals"
      :expected-hours="expectedHours"
      :percent-logged="percentLogged"
      @log-hours="openLogWork($event)"
    />

    <div class="period-footer">
      <span class="period-status">open</span>
      <button class="btn-close-period">Close period</button>
    </div>

    <LogWorkModal
      v-if="showLogWork"
      :projects="projects"
      :prefill="logWorkPrefill"
      @close="showLogWork = false"
      @add-entry="addEntry"
    />

    <ConfigureProjects
      v-if="showConfigure"
      :projects="projects"
      @close="showConfigure = false"
      @add-project="addProject"
      @remove-project="removeProject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CalendarToolbar from './components/CalendarToolbar.vue'
import TimesheetGrid from './components/TimesheetGrid.vue'
import LogWorkModal from './components/LogWorkModal.vue'
import ConfigureProjects from './components/ConfigureProjects.vue'
import type { Project, LogEntry, DayInfo, View } from './types'

const today = new Date().toISOString().slice(0, 10)
const currentDate = ref(new Date())
const view = ref<View>('month')
const wfhActive = ref(false)
const showLogWork = ref(false)
const showConfigure = ref(false)
const logWorkPrefill = ref<{ date: string; projectId: string } | null>(null)

const projects = ref<Project[]>([
  { id: '1', name: 'Roxit RO' },
  { id: '2', name: 'Visma LT Internal' },
  { id: '3', name: 'Visma LT Vacation' },
  { id: '4', name: 'Visma LT Absence' },
])

const entries = ref<LogEntry[]>([])

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const days = computed<DayInfo[]>(() => {
  const d = currentDate.value
  const year = d.getFullYear()
  const month = d.getMonth()

  if (view.value === 'month') {
    const count = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(year, month, i + 1)
      const iso = date.toISOString().slice(0, 10)
      const dow = date.getDay()
      return { date: iso, num: i + 1, letter: DAY_LETTERS[dow], isToday: iso === today, isWeekend: dow === 0 || dow === 6 }
    })
  }

  // Week view: Monday-based
  const dow = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const iso = day.toISOString().slice(0, 10)
    const dayDow = day.getDay()
    return { date: iso, num: day.getDate(), letter: DAY_LETTERS[dayDow], isToday: iso === today, isWeekend: dayDow === 0 || dayDow === 6 }
  })
})

const dateRange = computed(() => {
  if (!days.value.length) return ''
  const first = new Date(days.value[0].date)
  const last = new Date(days.value[days.value.length - 1].date)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(first)} - ${fmt(last)}, ${last.getFullYear()}`
})

const hoursLookup = computed(() => {
  const map: Record<string, Record<string, number>> = {}
  for (const e of entries.value) {
    if (!map[e.date]) map[e.date] = {}
    map[e.date][e.projectId] = (map[e.date][e.projectId] ?? 0) + e.hours
  }
  return map
})

const dailyTotals = computed(() => {
  const totals: Record<string, number> = {}
  for (const e of entries.value) totals[e.date] = (totals[e.date] ?? 0) + e.hours
  return totals
})

const expectedHours = computed(() => {
  const exp: Record<string, number> = {}
  for (const day of days.value) exp[day.date] = day.isWeekend ? 0 : 8
  return exp
})

const percentLogged = computed(() => {
  const totalExp = days.value.reduce((s, d) => s + (expectedHours.value[d.date] ?? 0), 0)
  if (totalExp === 0) return 0
  const totalLog = days.value.reduce((s, d) => s + (dailyTotals.value[d.date] ?? 0), 0)
  return Math.round((totalLog / totalExp) * 100)
})

function goToday() { currentDate.value = new Date() }

function goPrev() {
  const d = new Date(currentDate.value)
  if (view.value === 'month') d.setMonth(d.getMonth() - 1)
  else d.setDate(d.getDate() - 7)
  currentDate.value = d
}

function goNext() {
  const d = new Date(currentDate.value)
  if (view.value === 'month') d.setMonth(d.getMonth() + 1)
  else d.setDate(d.getDate() + 7)
  currentDate.value = d
}

function openLogWork(prefill: { date: string; projectId: string } | null) {
  logWorkPrefill.value = prefill
  showLogWork.value = true
}

function addEntry(entry: Omit<LogEntry, 'id'>) {
  entries.value.push({ ...entry, id: crypto.randomUUID() })
}

function addProject(name: string) {
  projects.value.push({ id: crypto.randomUUID(), name })
}

function removeProject(id: string) {
  projects.value = projects.value.filter((p) => p.id !== id)
  entries.value = entries.value.filter((e) => e.projectId !== id)
}
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 400;
  color: #1a73e8;
  margin-bottom: 2px;
}

.period-footer {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #d8d8d8;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.period-status {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #bbb;
  font-style: italic;
}

.btn-close-period {
  padding: 6px 16px;
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-close-period:hover {
  background: #388e3c;
}
</style>
