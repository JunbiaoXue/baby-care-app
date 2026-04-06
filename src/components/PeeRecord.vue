<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h3 class="modal-title">记录尿尿</h3>
          <button class="close-btn" @click="close">×</button>
        </header>
        
        <form @submit.prevent="save" class="form">
          <!-- 尿布类型 -->
          <div class="form-group">
            <label class="form-label">尿布类型</label>
            <div class="type-selector">
              <button 
                v-for="t in diaperTypes" 
                :key="t.value"
                type="button"
                class="type-btn" 
                :class="{ active: form.diaperType === t.value }"
                @click="form.diaperType = t.value"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
          
          <!-- 备注 -->
          <div class="form-group">
            <label class="form-label">备注（可选）</label>
            <input 
              type="text" 
              v-model="form.notes"
              class="form-input"
              placeholder="添加备注..."
            />
          </div>
          
          <!-- 提交按钮 -->
          <button type="submit" class="submit-btn">
            保存记录
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useCareStore } from '../stores/care'
import type { DiaperType } from '../types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const store = useCareStore()

// 尿布类型选项
const diaperTypes: { label: string; value: DiaperType }[] = [
  { label: '纸尿裤', value: 'diaper' },
  { label: '布尿裤', value: 'cloth' },
  { label: '拉拉裤', value: 'pull_up' }
]

// 表单数据
const form = reactive({
  diaperType: 'diaper' as DiaperType,
  notes: ''
})

// 重置表单
const resetForm = () => {
  form.diaperType = 'diaper'
  form.notes = ''
}

// 关闭弹窗
const close = () => {
  emit('update:modelValue', false)
  resetForm()
}

// 保存记录
const save = () => {
  store.addPeeRecord({
    timestamp: Date.now(),
    diaperType: form.diaperType,
    notes: form.notes
  })
  
  resetForm()
  emit('saved')
}

// 监听弹窗打开
watch(() => props.modelValue, (val) => {
  if (val) {
    resetForm()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.type-btn {
  padding: 12px 8px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  border-color: #0ea5e9;
  background: #f0f9ff;
  color: #0ea5e9;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: #ffffff;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  background: #0ea5e9;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover {
  background: #0284c7;
}
</style>