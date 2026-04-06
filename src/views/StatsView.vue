<template>
  <div class="stats-view">
    <header class="header">
      <h1 class="title">统计分析</h1>
    </header>

    <!-- 时间范围选择 -->
    <div class="range-selector">
      <button 
        v-for="r in ranges" 
        :key="r.value"
        class="range-btn" 
        :class="{ active: selectedRange === r.value }"
        @click="selectedRange = r.value"
      >
        {{ r.label }}
      </button>
    </div>

    <!-- 奶量趋势图 -->
    <div class="chart-card">
      <h2 class="chart-title">
        <span class="chart-icon">🍼</span>
        奶量趋势 (ml)
      </h2>
      <div class="chart-container">
        <canvas ref="feedingChartRef"></canvas>
      </div>
      <div class="chart-summary">
        <div class="summary-stat">
          <span class="stat-label">平均</span>
          <span class="stat-value">{{ feedingAvg }} ml</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">总计</span>
          <span class="stat-value">{{ feedingTotal }} ml</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">最多</span>
          <span class="stat-value">{{ feedingMax }} ml</span>
        </div>
      </div>
    </div>

    <!-- 尿布次数图 -->
    <div class="chart-card">
      <h2 class="chart-title">
        <span class="chart-icon">👶</span>
        尿布次数
      </h2>
      <div class="chart-container">
        <canvas ref="diaperChartRef"></canvas>
      </div>
      <div class="chart-summary">
        <div class="summary-stat">
          <span class="stat-label">平均</span>
          <span class="stat-value">{{ diaperAvg }} 次</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">总计</span>
          <span class="stat-value">{{ diaperTotal }} 次</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">最多</span>
          <span class="stat-value">{{ diaperMax }} 次</span>
        </div>
      </div>
    </div>

    <!-- 今日概览 -->
    <div class="overview-card">
      <h2 class="chart-title">今日概览</h2>
      <div class="overview-grid">
        <div class="overview-item">
          <span class="overview-icon">🍼</span>
          <span class="overview-value">{{ todayFeedingCount }}</span>
          <span class="overview-label">喂奶次数</span>
        </div>
        <div class="overview-item">
          <span class="overview-icon">💧</span>
          <span class="overview-value">{{ todayPeeCount }}</span>
          <span class="overview-label">尿尿次数</span>
        </div>
        <div class="overview-item">
          <span class="overview-icon">💩</span>
          <span class="overview-value">{{ todayPoopCount }}</span>
          <span class="overview-label">便便次数</span>
        </div>
        <div class="overview-item">
          <span class="overview-icon">💊</span>
          <span class="overview-value">{{ todayADTaken ? '是' : '否' }}</span>
          <span class="overview-label">AD补充</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useCareStore } from '../stores/care'

Chart.register(...registerables)

const store = useCareStore()

// 时间范围选项
const ranges = [
  { label: '7天', value: 7 },
  { label: '14天', value: 14 },
  { label: '30天', value: 30 }
]

const selectedRange = ref(7)

// Chart refs
const feedingChartRef = ref<HTMLCanvasElement | null>(null)
const diaperChartRef = ref<HTMLCanvasElement | null>(null)
let feedingChart: Chart | null = null
let diaperChart: Chart | null = null

// 获取统计数据
const feedingTrend = computed(() => store.getFeedingTrend(selectedRange.value))
const diaperTrend = computed(() => store.getDiaperTrend(selectedRange.value))

// 统计计算
const feedingTotal = computed(() => {
  return feedingTrend.value.reduce((sum, d) => sum + d.total, 0)
})

const feedingAvg = computed(() => {
  if (feedingTrend.value.length === 0) return 0
  return Math.round(feedingTotal.value / feedingTrend.value.length)
})

const feedingMax = computed(() => {
  if (feedingTrend.value.length === 0) return 0
  return Math.max(...feedingTrend.value.map(d => d.total))
})

const diaperTotal = computed(() => {
  return diaperTrend.value.reduce((sum, d) => sum + d.count, 0)
})

const diaperAvg = computed(() => {
  if (diaperTrend.value.length === 0) return 0
  return Math.round(diaperTotal.value / diaperTrend.value.length)
})

const diaperMax = computed(() => {
  if (diaperTrend.value.length === 0) return 0
  return Math.max(...diaperTrend.value.map(d => d.count))
})

// 今日数据
const todayRecords = computed(() => store.getTodayRecords())

const todayFeedingCount = computed(() => todayRecords.value.feeding.length)
const todayPeeCount = computed(() => todayRecords.value.pee.length)
const todayPoopCount = computed(() => todayRecords.value.poop.length)
const todayADTaken = computed(() => {
  return todayRecords.value.ad.some(r => r.taken)
})

// 渲染图表
const renderCharts = () => {
  nextTick(() => {
    // 奶量趋势图
    if (feedingChartRef.value) {
      if (feedingChart) feedingChart.destroy()
      
      const data = feedingTrend.value
      feedingChart = new Chart(feedingChartRef.value, {
        type: 'line',
        data: {
          labels: data.map(d => d.date),
          datasets: [{
            label: '奶量 (ml)',
            data: data.map(d => d.total),
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#f97316'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }

    // 尿布次数图
    if (diaperChartRef.value) {
      if (diaperChart) diaperChart.destroy()
      
      const data = diaperTrend.value
      diaperChart = new Chart(diaperChartRef.value, {
        type: 'bar',
        data: {
          labels: data.map(d => d.date),
          datasets: [{
            label: '尿布次数',
            data: data.map(d => d.count),
            backgroundColor: '#38bdf8',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              },
              ticks: {
                stepSize: 1
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }
  })
}

watch(selectedRange, () => {
  renderCharts()
})

onMounted(() => {
  renderCharts()
})
</script>

<style scoped>
.stats-view {
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

/* 时间范围选择 */
.range-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.range-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.range-btn.active {
  background: #0ea5e9;
  color: #ffffff;
}

/* 图表卡片 */
.chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.chart-icon {
  margin-right: 8px;
}

.chart-container {
  height: 200px;
  margin-bottom: 16px;
}

.chart-summary {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.summary-stat {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #9ca3af;
  display: block;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* 今日概览 */
.overview-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.overview-item {
  text-align: center;
}

.overview-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: block;
}

.overview-label {
  font-size: 12px;
  color: #9ca3af;
}
</style>