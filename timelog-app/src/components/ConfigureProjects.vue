<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>Configure projects</h2>
      <ul class="project-list">
        <li v-for="p in projects" :key="p.id">
          <span>{{ p.name }}</span>
          <button class="btn-remove" @click="emit('remove-project', p.id)" title="Remove">&#x2715;</button>
        </li>
      </ul>
      <div class="add-row">
        <input v-model.trim="newName" placeholder="New project name" @keydown.enter.prevent="add" />
        <button class="btn-add" :disabled="!newName" @click="add">Add</button>
      </div>
      <div class="actions">
        <button class="btn-done" @click="emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '../types'

defineProps<{ projects: Project[] }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-project', name: string): void
  (e: 'remove-project', id: string): void
}>()

const newName = ref('')

function add() {
  if (!newName.value) return
  emit('add-project', newName.value)
  newName.value = ''
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
  width: 360px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}

h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 14px;
}

.project-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  max-height: 260px;
  overflow-y: auto;
}

.project-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}

.btn-remove {
  border: none;
  background: none;
  cursor: pointer;
  color: #999;
  font-size: 13px;
  padding: 0 2px;
}

.btn-remove:hover {
  color: #c62828;
}

.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.add-row input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.add-row input:focus {
  border-color: #1a73e8;
}

.btn-add {
  padding: 6px 14px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.btn-add:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.btn-done {
  padding: 7px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-done:hover {
  background: #f5f5f5;
}
</style>
