<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h3 class="modal-title">记录喂奶</h3>
          <button class="close-btn" @click="close">×</button>
        </header>
        
        <form @submit.prevent="save" class="form">
          <!-- 喂奶类型 -->
          <div class="form-group">
            <label class="form-label">喂奶方式</label>
            <div class="type-selector">
              <button 
                v-for="t in feedingTypes" 
                :key="t.value"
                type="button"
                class="type-btn" 
                :class="{ active: form.type === t.value }"
                @click="form.type = t.value"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
          
          <!-- 母乳亲喂 - 喂养时长 -->
          <div v-if="form.type === 'breast_direct'" class="form-group">
            <label class="form-label">喂养时长</label>
            <div class="input-group">
              <input 
                type="number" 
                v-model="form.duration"
                class="form-input"
                placeholder="0"
                min="0"
              />
              <span class="input-suffix">分钟</span>
            </div>
          </div>
          
          <!-- 瓶喂/奶粉 - 奶量 -->
          <div v-else class="form-group">
            <label class="form-label">奶量</label>
            <div class="input-group">
              <input 
                type="number" 
                v-model="form.amount"
                class="form-input"
                placeholder="0"
                min="0"
              />
              <span class="input-suffix">ml</span>
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
import { watch, reactive } from 'vue'
import { useCareStore } from '../stores/care'
import type { FeedingType } from '../types'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const store = useCareStore()

// 喂奶类型选项
const feedingTypes: { label: string; value: FeedingType }[] = [
  { label: '母乳亲喂', value: 'breast_direct' },
  { label: '母乳瓶喂', value: 'breast_bottle' },
  { label: '奶粉', value: 'formula' },
  { label: '混合', value: 'mixed' }
]

// 表单数据
const form = reactive({
  type: 'breast_direct' as FeedingType,
  duration: 0,
  amount: 0,
  notes: ''
})

// 重置表单
const resetForm = () => {
  form.type = 'breast_direct'
  form.duration = 0
  form.amount = 0
  form.notes = ''
}

// 关闭弹窗
const close = () => {
  emit('update:modelValue', false)
  resetForm()
}

// 保存记录
const save = () => {
  store.addFeedingRecord({
    timestamp: Date.now(),
    type: form.type,
    duration: form.type === 'breast_direct' ? form.duration : undefined,
    amount: form.type !== 'breast_direct' ? form.amount : undefined,
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
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.type-btn {
  padding: 12px 8px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  border-color: #0ea5e9;
  background: #f0f9ff;
  color: #0ea5e9;
}

.input-group {
  display: flex;
  align-items: center;
}

.form-input {
  flex: 1;
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

.input-suffix {
  margin-left: 12px;
  color: #9ca3af;
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