<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h3 class="modal-title">记录便便</h3>
          <button class="close-btn" @click="close">×</button>
        </header>
        
        <form @submit.prevent="save" class="form">
          <!-- 颜色 -->
          <div class="form-group">
            <label class="form-label">颜色</label>
            <div class="type-selector">
              <button 
                v-for="c in colors" 
                :key="c.value"
                type="button"
                class="type-btn" 
                :class="{ active: form.color === c.value }"
                @click="form.color = c.value as PoopColor"
              >
                {{ c.label }}
              </button>
            </div>
          </div>
          
          <!-- 性状 -->
          <div class="form-group">
            <label class="form-label">性状</label>
            <div class="type-selector">
              <button 
                v-for="c in consistencies" 
                :key="c.value"
                type="button"
                class="type-btn" 
                :class="{ active: form.consistency === c.value }"
                @click="form.consistency = c.value as PoopConsistency"
              >
                {{ c.label }}
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
import type { PoopColor, PoopConsistency } from '../types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const store = useCareStore()

// 颜色选项
const colors = [
  { label: '黄色', value: 'yellow' },
  { label: '绿色', value: 'green' },
  { label: '棕色', value: 'brown' },
  { label: '黑色', value: 'black' },
  { label: '其他', value: 'other' }
]

// 性状选项
const consistencies = [
  { label: '稀便', value: 'liquid' },
  { label: '软便', value: 'soft' },
  { label: '成形', value: 'formed' },
  { label: '硬便', value: 'hard' }
]

// 表单数据
const form = reactive({
  color: 'yellow' as PoopColor,
  consistency: 'soft' as PoopConsistency,
  notes: ''
})

// 重置表单
const resetForm = () => {
  form.color = 'yellow'
  form.consistency = 'soft'
  form.notes = ''
}

// 关闭弹窗
const close = () => {
  emit('update:modelValue', false)
  resetForm()
}

// 保存记录
const save = () => {
  store.addPoopRecord({
    timestamp: Date.now(),
    color: form.color,
    consistency: form.consistency,
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
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.type-btn {
  padding: 10px 6px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  border-color: #f59e0b;
  background: #fffeec;
  color: #f59e0b;
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
  background: #f59e0b;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover {
  background: #d97706;
}
</style>