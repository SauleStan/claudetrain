<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>Log work</h2>
      <form @submit.prevent="submit">
        <div class="field">
          <label>Project</label>
          <select v-model="projectId" required>
            <option value="" disabled>Select a project</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>Date</label>
          <input type="date" v-model="date" required />
        </div>
        <div class="field">
          <label>Hours</label>
          <input type="number" v-model.number="hours" min="0.5" max="24" step="0.5" placeholder="e.g. 8" required />
        </div>
        <div class="actions">
          <button type="button" class="btn-cancel" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn-submit" :disabled="!projectId || !date || !hours">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project, LogEntry } from '../types'

const props = defineProps<{
  projects: Project[]
  prefill: { date: string; projectId: string } | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-entry', entry: Omit<LogEntry, 'id'>): void
}>()

const projectId = ref(props.prefill?.projectId ?? '')
const date = ref(props.prefill?.date ?? new Date().toISOString().slice(0, 10))
const hours = ref<number | null>(null)

watch(() => props.prefill, (p) => {
  if (p) { projectId.value = p.projectId; date.value = p.date }
})

function submit() {
  if (!projectId.value || !date.value || !hours.value) return
  emit('add-entry', { projectId: projectId.value, date: date.value, hours: hours.value })
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 340px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}

h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #444;
}

select,
input {
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

select:focus,
input:focus {
  border-color: #1a73e8;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.btn-cancel {
  padding: 7px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-submit {
  padding: 7px 20px;
  border: none;
  border-radius: 4px;
  background: #1a73e8;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit:hover:not(:disabled) {
  background: #1558b0;
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
