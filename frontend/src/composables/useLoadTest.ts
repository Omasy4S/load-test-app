import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Настройки теста
export const requestsCount = ref(100)
export const delayMs = ref(10)
export const concurrency = ref(5)
export const limit = ref(10)

// Состояние
export const isRunning = ref(false)
export const shouldStop = ref(false)
export const totalSent = ref(0)
export const successCount = ref(0)
export const errorCount = ref(0)
export const startTime = ref<number | null>(null)
export const currentTime = ref<number>(Date.now())
export const responseTimes = ref<number[]>([])

let timeInterval: number | null = null

// Вычисляемые значения
export const elapsedTime = computed(() => {
  if (!startTime.value) return '0.00'
  const elapsed = (currentTime.value - startTime.value) / 1000
  return elapsed.toFixed(2)
})

export const progressPercent = computed(() => {
  if (requestsCount.value === 0) return 0
  return Math.round((totalSent.value / requestsCount.value) * 100)
})

export const avgResponseTime = computed(() => {
  if (responseTimes.value.length === 0) return '0'
  const avg = responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length
  return avg.toFixed(0)
})

export const requestsPerSecond = computed(() => {
  if (!startTime.value || successCount.value === 0) return '0'
  const elapsed = (currentTime.value - startTime.value) / 1000
  if (elapsed === 0) return '0'
  return (successCount.value / elapsed).toFixed(1)
})

export const timeBuckets = computed(() => {
  const buckets = { fast: 0, medium: 0, slow: 0, verySlow: 0 }
  responseTimes.value.forEach(time => {
    if (time < 50) buckets.fast++
    else if (time < 200) buckets.medium++
    else if (time < 500) buckets.slow++
    else buckets.verySlow++
  })
  return buckets
})

export function getTimePercent(bucket: 'fast' | 'medium' | 'slow' | 'verySlow'): number {
  const total = responseTimes.value.length
  if (total === 0) return 0
  return (timeBuckets.value[bucket] / total) * 100
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function sendRequest(): Promise<void> {
  const start = performance.now()
  try {
    const offset = Math.floor(Math.random() * 49000)
    const response = await fetch(`${API_URL}/items?limit=${limit.value}&offset=${offset}`)
    
    if (response.ok) {
      successCount.value++
      const end = performance.now()
      responseTimes.value.push(end - start)
    } else {
      errorCount.value++
    }
  } catch {
    errorCount.value++
  }
  totalSent.value++
}

export async function startTest(): Promise<void> {
  isRunning.value = true
  shouldStop.value = false
  totalSent.value = 0
  successCount.value = 0
  errorCount.value = 0
  responseTimes.value = []
  startTime.value = Date.now()
  
  timeInterval = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 100)

  const totalRequests = requestsCount.value
  let sentRequests = 0

  while (sentRequests < totalRequests && !shouldStop.value) {
    const batch: Promise<void>[] = []
    const batchSize = Math.min(concurrency.value, totalRequests - sentRequests)
    
    for (let i = 0; i < batchSize; i++) {
      batch.push(sendRequest())
    }
    
    await Promise.all(batch)
    sentRequests += batchSize
    
    if (delayMs.value > 0 && sentRequests < totalRequests) {
      await delay(delayMs.value)
    }
  }

  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
  currentTime.value = Date.now()
  isRunning.value = false
}

export function stopTest(): void {
  shouldStop.value = true
}
