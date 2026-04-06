import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FeedingRecord, PeeRecord, PoopRecord, ADRecord } from '../types'

export const useCareStore = defineStore('care', () => {
  // 状态
  const feedingRecords = ref<FeedingRecord[]>([])
  const peeRecords = ref<PeeRecord[]>([])
  const poopRecords = ref<PoopRecord[]>([])
  const adRecords = ref<ADRecord[]>([])

  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 添加喂奶记录
  const addFeedingRecord = (record: Omit<FeedingRecord, 'id'>) => {
    feedingRecords.value.push({
      ...record,
      id: generateId()
    })
    // 按时间排序
    feedingRecords.value.sort((a, b) => b.timestamp - a.timestamp)
  }

  // 添加尿尿记录
  const addPeeRecord = (record: Omit<PeeRecord, 'id'>) => {
    peeRecords.value.push({
      ...record,
      id: generateId()
    })
    peeRecords.value.sort((a, b) => b.timestamp - a.timestamp)
  }

  // 添加便便记录
  const addPoopRecord = (record: Omit<PoopRecord, 'id'>) => {
    poopRecords.value.push({
      ...record,
      id: generateId()
    })
    poopRecords.value.sort((a, b) => b.timestamp - a.timestamp)
  }

  // 添加AD记录
  const addADRecord = (record: Omit<ADRecord, 'id'>) => {
    adRecords.value.push({
      ...record,
      id: generateId()
    })
    adRecords.value.sort((a, b) => b.timestamp - a.timestamp)
  }

  // 删除记录
  const deleteFeedingRecord = (id: string) => {
    feedingRecords.value = feedingRecords.value.filter(r => r.id !== id)
  }

  const deletePeeRecord = (id: string) => {
    peeRecords.value = peeRecords.value.filter(r => r.id !== id)
  }

  const deletePoopRecord = (id: string) => {
    poopRecords.value = poopRecords.value.filter(r => r.id !== id)
  }

  const deleteADRecord = (id: string) => {
    adRecords.value = adRecords.value.filter(r => r.id !== id)
  }

  // 获取当天记录
  const getTodayRecords = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()
    
    return {
      feeding: feedingRecords.value.filter(r => r.timestamp >= todayStart),
      pee: peeRecords.value.filter(r => r.timestamp >= todayStart),
      poop: poopRecords.value.filter(r => r.timestamp >= todayStart),
      ad: adRecords.value.filter(r => r.timestamp >= todayStart)
    }
  }

  // 获取指定日期的记录
  const getRecordsByDate = (date: Date) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    
    return {
      feeding: feedingRecords.value.filter(r => r.timestamp >= start.getTime() && r.timestamp <= end.getTime()),
      pee: peeRecords.value.filter(r => r.timestamp >= start.getTime() && r.timestamp <= end.getTime()),
      poop: poopRecords.value.filter(r => r.timestamp >= start.getTime() && r.timestamp <= end.getTime()),
      ad: adRecords.value.filter(r => r.timestamp >= start.getTime() && r.timestamp <= end.getTime())
    }
  }

  // 获取指定日期范围的记录
  const getRecordsByDateRange = (startDate: Date, endDate: Date) => {
    const start = startDate.getTime()
    const end = endDate.getTime()
    
    return {
      feeding: feedingRecords.value.filter(r => r.timestamp >= start && r.timestamp <= end),
      pee: peeRecords.value.filter(r => r.timestamp >= start && r.timestamp <= end),
      poop: poopRecords.value.filter(r => r.timestamp >= start && r.timestamp <= end),
      ad: adRecords.value.filter(r => r.timestamp >= start && r.timestamp <= end)
    }
  }

  // 统计 - 获取最近N天的奶���趋势
  const getFeedingTrend = (days: number = 7) => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const start = new Date()
    start.setDate(start.getDate() - days + 1)
    start.setHours(0, 0, 0, 0)
    
    const records = feedingRecords.value.filter(r => 
      r.timestamp >= start.getTime() && 
      r.timestamp <= end.getTime() &&
      (r.amount && r.amount > 0)
    )
    
    // 按天分组
    const trend: { date: string; total: number }[] = []
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
      const dayStart = new Date(d)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(d)
      dayEnd.setHours(23, 59, 59, 999)
      
      const dayTotal = records
        .filter(r => r.timestamp >= dayStart.getTime() && r.timestamp <= dayEnd.getTime())
        .reduce((sum, r) => sum + (r.amount || 0), 0)
      
      trend.push({ date: dateStr, total: dayTotal })
    }
    
    return trend.reverse()
  }

  // 统计 - 获取最近N天的尿布次数
  const getDiaperTrend = (days: number = 7) => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const start = new Date()
    start.setDate(start.getDate() - days + 1)
    start.setHours(0, 0, 0, 0)
    
    // 合并尿尿和便便记录
    const allDiaperRecords = [...peeRecords.value, ...poopRecords.value].filter(r =>
      r.timestamp >= start.getTime() && r.timestamp <= end.getTime()
    )
    
    const trend: { date: string; count: number }[] = []
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
      const dayStart = new Date(d)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(d)
      dayEnd.setHours(23, 59, 59, 999)
      
      const dayCount = allDiaperRecords.filter(r => 
        r.timestamp >= dayStart.getTime() && r.timestamp <= dayEnd.getTime()
      ).length
      
      trend.push({ date: dateStr, count: dayCount })
    }
    
    return trend.reverse()
  }

  return {
    // 状态
    feedingRecords,
    peeRecords,
    poopRecords,
    adRecords,
    // 方法
    addFeedingRecord,
    addPeeRecord,
    addPoopRecord,
    addADRecord,
    deleteFeedingRecord,
    deletePeeRecord,
    deletePoopRecord,
    deleteADRecord,
    getTodayRecords,
    getRecordsByDate,
    getRecordsByDateRange,
    getFeedingTrend,
    getDiaperTrend
  }
})