<template>
  <div class="history-view">
    <header class="header">
      <h1 class="title">历史记录</h1>
    </header>

    <!-- 日期选择器 -->
    <div class="date-picker">
      <button class="date-btn" @click="prevDay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>
      <div class="selected-date">
        <input 
          type="date" 
          v-model="selectedDateStr" 
          @change="onDateChange"
          class="date-input"
        />
        <span class="date-display">{{ formattedDate }}</span>
      </div>
      <button class="date-btn" @click="nextDay" :disabled="isToday">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>
    </div>

    <!-- 数据统计 -->
    <div class="day-summary">
      <div class="summary-item">
        <span class="summary-icon">🍼</span>
        <span class="summary-value">{{ dayRecords.feeding.length }}</span>
        <span class="summary-label">喂奶</span>
      </div>
      <div class="summary-item">
        <span class="summary-icon">💧</span>
        <span class="summary-value">{{ dayRecords.pee.length }}</span>
        <span class="summary-label">尿尿</span>
      </div>
      <div class="summary-item">
        <span class="summary-icon">💩</span>
        <span class="summary-value">{{ dayRecords.poop.length }}</span>
        <span class="summary-label">便便</span>
      </div>
      <div class="summary-item">
        <span class="summary-icon">💊</span>
        <span class="summary-value">{{ dayRecords.ad.length }}</span>
        <span class="summary-label">AD</span>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="records-section">
      <div v-if="mergedRecords.length === 0" class="empty-state">
        <p>当天暂无记录</p>
      </div>
      
      <div v-else class="records-list">
        <!-- 喂奶记录 -->
        <template v-if="dayRecords.feeding.length > 0">
          <div class="records-group-title">喂奶记录</div>
          <div v-for="r in dayRecords.feeding" :key="r.id" class="record-item feeding">
            <div class="record-main">
              <span class="record-icon">🍼</span>
              <div class="record-content">
                <div class="record-title">{{ getFeedingTypeLabel(r.type) }}</div>
                <div class="record-detail">{{ getFeedingDetail(r) }}</div>
              </div>
            </div>
            <div class="record-right">
              <span class="record-time">{{ formatTime(r.timestamp) }}</span>
              <button class="delete-btn" @click="deleteFeeding(r.id)">删除</button>
            </div>
          </div>
        </template>

        <!-- 尿尿记录 -->
        <template v-if="dayRecords.pee.length > 0">
          <div class="records-group-title">尿尿记录</div>
          <div v-for="r in dayRecords.pee" :key="r.id" class="record-item pee">
            <div class="record-main">
              <span class="record-icon">💧</span>
              <div class="record-content">
                <div class="record-title">{{ getDiaperTypeLabel(r.diaperType) }}</div>
                <div class="record-detail">{{ r.notes || '无备注' }}</div>
              </div>
            </div>
            <div class="record-right">
              <span class="record-time">{{ formatTime(r.timestamp) }}</span>
              <button class="delete-btn" @click="deletePee(r.id)">删除</button>
            </div>
          </div>
        </template>

        <!-- 便便记录 -->
        <template v-if="dayRecords.poop.length > 0">
          <div class="records-group-title">便便记录</div>
          <div v-for="r in dayRecords.poop" :key="r.id" class="record-item poop">
            <div class="record-main">
              <span class="record-icon">💩</span>
              <div class="record-content">
                <div class="record-title">{{ getPoopColorLabel(r.color) }} {{ getPoopConsistencyLabel(r.consistency) }}</div>
                <div class="record-detail">{{ r.notes || '无备注' }}</div>
              </div>
            </div>
            <div class="record-right">
              <span class="record-time">{{ formatTime(r.timestamp) }}</span>
              <button class="delete-btn" @click="deletePoop(r.id)">删除</button>
            </div>
          </div>
        </template>

        <!-- AD记录 -->
        <template v-if="dayRecords.ad.length > 0">
          <div class="records-group-title">AD记录</div>
          <div v-for="r in dayRecords.ad" :key="r.id" class="record-item ad">
            <div class="record-main">
              <span class="record-icon">💊</span>
              <div class="record-content">
                <div class="record-title">{{ r.taken ? '已补充' : '未补充' }}</div>
                <div class="record-detail">{{ r.notes || '无备注' }}</div>
              </div>
            </div>
            <div class="record-right">
              <span class="record-time">{{ formatTime(r.timestamp) }}</span>
              <button class="delete-btn" @click="deleteAD(r.id)">删除</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCareStore } from '../stores/care'

const store = useCareStore()

// 当前选择日期
const selectedDate = ref(new Date())
const selectedDateStr = ref(formatDateToInput(selectedDate.value))

function formatDateToInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 日期显示格式化
const formattedDate = computed(() => {
  const date = new Date(selectedDateStr.value + 'T00:00:00')
  return date.toLocaleDateString('zh-CN', { 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
})

// 是否今天
const isToday = computed(() => {
  const today = new Date()
  return selectedDateStr.value === formatDateToInput(today)
})

// 获取当天记录
const dayRecords = computed(() => {
  const date = new Date(selectedDateStr.value + 'T00:00:00')
  return store.getRecordsByDate(date)
})

// 合并记录用于展示
const mergedRecords = computed(() => {
  return [
    ...dayRecords.value.feeding,
    ...dayRecords.value.pee,
    ...dayRecords.value.poop,
    ...dayRecords.value.ad
  ]
})

// 日期切换
const prevDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 1)
  selectedDate.value = date
  selectedDateStr.value = formatDateToInput(date)
}

const nextDay = () => {
  if (isToday.value) return
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 1)
  selectedDate.value = date
  selectedDateStr.value = formatDateToInput(date)
}

const onDateChange = () => {
  const date = new Date(selectedDateStr.value + 'T00:00:00')
  selectedDate.value = date
}

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 类型标签
const getFeedingTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    breast_direct: '母乳亲喂',
    breast_bottle: '母乳瓶喂',
    formula: '奶粉',
    mixed: '混合喂养'
  }
  return labels[type] || type
}

const getFeedingDetail = (record: any) => {
  if (record.type === 'breast_direct') {
    return `${record.duration || 0} 分钟`
  }
  return `${record.amount || 0}ml`
}

const getDiaperTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    diaper: '纸尿裤',
    cloth: '布尿裤',
    pull_up: '拉拉裤'
  }
  return labels[type] || type
}

const getPoopColorLabel = (color: string) => {
  const labels: Record<string, string> = {
    yellow: '黄色',
    green: '绿色',
    brown: '棕色',
    black: '黑色',
    other: '其他'
  }
  return labels[color] || color
}

const getPoopConsistencyLabel = (consistency: string) => {
  const labels: Record<string, string> = {
    liquid: '稀便',
    soft: '软便',
    formed: '成形',
    hard: '硬便'
  }
  return labels[consistency] || consistency
}

// 删除记录
const deleteFeeding = (id: string) => {
  if (confirm('确认删除这条记录？')) {
    store.deleteFeedingRecord(id)
  }
}

const deletePee = (id: string) => {
  if (confirm('确认删除这条记录？')) {
    store.deletePeeRecord(id)
  }
}

const deletePoop = (id: string) => {
  if (confirm('确认删除这条记录？')) {
    store.deletePoopRecord(id)
  }
}

const deleteAD = (id: string) => {
  if (confirm('确认删除这条记录？')) {
    store.deleteADRecord(id)
  }
}
</script>

<style scoped>
.history-view {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

/* 日期选择器 */
.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.date-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
}

.date-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.date-btn svg {
  width: 20px;
  height: 20px;
}

.selected-date {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.date-display {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  cursor: pointer;
}

/* 日统计 */
.day-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.summary-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.summary-icon {
  font-size: 20px;
  display: block;
  margin-bottom: 6px;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  display: block;
}

.summary-label {
  font-size: 12px;
  color: #9ca3af;
}

/* 记录列表 */
.records-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: #9ca3af;
}

.records-group-title {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 12px;
  padding-top: 8px;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
}

.record-item:last-child {
  margin-bottom: 0;
}

.record-main {
  display: flex;
  align-items: center;
}

.record-icon {
  font-size: 20px;
  margin-right: 12px;
}

.record-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.record-detail {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.record-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-time {
  font-size: 12px;
  color: #9ca3af;
}

.delete-btn {
  font-size: 12px;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
}

.delete-btn:hover {
  text-decoration: underline;
}
</style>