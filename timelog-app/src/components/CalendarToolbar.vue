<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <button class="btn-ghost" @click="emit('today')">Today</button>
      <button class="btn-icon" @click="emit('prev')">&#8249;</button>
      <button class="btn-icon" @click="emit('next')">&#8250;</button>
      <span class="date-range">{{ dateRange }}</span>
      <div class="view-toggle">
        <button :class="{ active: view === 'month' }" @click="emit('set-view', 'month')">Month</button>
        <button :class="{ active: view === 'week' }" @click="emit('set-view', 'week')">Week</button>
      </div>
    </div>
    <div class="toolbar-right">
      <button :class="['btn-wfh', { active: wfhActive }]" @click="emit('toggle-wfh')">
        Working from Home
      </button>
      <button class="btn-ghost" @click="emit('open-configure')">Configure projects</button>
      <button class="btn-ghost" @click="emit('open-log-work', null)">Log work</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { View } from '../types'

defineProps<{
  dateRange: string
  view: View
  wfhActive: boolean
}>()

const emit = defineEmits<{
  (e: 'today'): void
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'set-view', v: View): void
  (e: 'toggle-wfh'): void
  (e: 'open-configure'): void
  (e: 'open-log-work', prefill: { date: string; projectId: string } | null): void
}>()
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-ghost {
  padding: 5px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: #333;
}

.btn-ghost:hover {
  background: #f5f5f5;
}

.btn-icon {
  padding: 4px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: #555;
}

.btn-icon:hover {
  background: #f5f5f5;
}

.date-range {
  font-size: 13px;
  color: #333;
  padding: 0 6px;
  white-space: nowrap;
}

.view-toggle {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.view-toggle button {
  padding: 5px 14px;
  border: none;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: #555;
}

.view-toggle button + button {
  border-left: 1px solid #ccc;
}

.view-toggle button.active {
  background: #e8eaf6;
  color: #333;
  font-weight: 500;
}

.btn-wfh {
  padding: 5px 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: #555;
  transition: background 0.15s, color 0.15s;
}

.btn-wfh.active {
  background: #1a73e8;
  border-color: #1a73e8;
  color: #fff;
  font-weight: 500;
}

.btn-wfh:not(.active):hover {
  background: #f5f5f5;
}
</style>
