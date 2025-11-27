<template>
  <div class="container">
    <h1>
      <svg class="icon-title" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      Нагрузочное тестирование API
    </h1>
    
    <div class="card">
      <h2>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Настройки теста
      </h2>
      
      <div class="form-group">
        <label for="requestsCount">Количество запросов:</label>
        <input 
          id="requestsCount"
          type="number" 
          v-model.number="requestsCount" 
          min="1" 
          max="10000"
          :disabled="isRunning"
        />
      </div>
      
      <div class="form-group">
        <label for="delayMs">Задержка между запросами (мс):</label>
        <input 
          id="delayMs"
          type="number" 
          v-model.number="delayMs" 
          min="0" 
          max="5000"
          :disabled="isRunning"
        />
      </div>
      
      <div class="form-group">
        <label for="concurrency">Параллельных запросов:</label>
        <input 
          id="concurrency"
          type="number" 
          v-model.number="concurrency" 
          min="1" 
          max="100"
          :disabled="isRunning"
        />
      </div>

      <div class="form-group">
        <label for="limit">Limit (записей на запрос):</label>
        <input 
          id="limit"
          type="number" 
          v-model.number="limit" 
          min="1" 
          max="1000"
          :disabled="isRunning"
        />
      </div>
      
      <button 
        @click="startTest" 
        :disabled="isRunning"
        class="btn-start"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        {{ isRunning ? 'Тест выполняется...' : 'Старт нагрузочного теста' }}
      </button>
      
      <button 
        @click="stopTest" 
        :disabled="!isRunning"
        class="btn-stop"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12"/>
        </svg>
        Остановить
      </button>
    </div>
    
    <div class="card results" v-if="totalSent > 0 || isRunning">
      <h2>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Результаты
      </h2>
      
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-value">{{ totalSent }}</span>
          <span class="stat-label">Отправлено</span>
        </div>
        
        <div class="stat success">
          <span class="stat-value">{{ successCount }}</span>
          <span class="stat-label">Успешно</span>
        </div>
        
        <div class="stat error">
          <span class="stat-value">{{ errorCount }}</span>
          <span class="stat-label">Ошибок</span>
        </div>
        
        <div class="stat">
          <span class="stat-value">{{ elapsedTime }}</span>
          <span class="stat-label">Время (сек)</span>
        </div>
        
        <div class="stat">
          <span class="stat-value">{{ avgResponseTime }}</span>
          <span class="stat-label">Сред. время (мс)</span>
        </div>
        
        <div class="stat">
          <span class="stat-value">{{ requestsPerSecond }}</span>
          <span class="stat-label">Запросов/сек</span>
        </div>
      </div>
      
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
      <p class="progress-text">{{ progressPercent }}% завершено</p>
    </div>
    
    <div class="card" v-if="responseTimes.length > 0">
      <h2>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Распределение времени ответа
      </h2>
      <div class="time-distribution">
        <div class="time-bar">
          <span class="time-label">&lt;50мс:</span>
          <div class="time-fill fast" :style="{ width: getTimePercent('fast') + '%' }"></div>
          <span class="time-count">{{ timeBuckets.fast }}</span>
        </div>
        <div class="time-bar">
          <span class="time-label">50-200мс:</span>
          <div class="time-fill medium" :style="{ width: getTimePercent('medium') + '%' }"></div>
          <span class="time-count">{{ timeBuckets.medium }}</span>
        </div>
        <div class="time-bar">
          <span class="time-label">200-500мс:</span>
          <div class="time-fill slow" :style="{ width: getTimePercent('slow') + '%' }"></div>
          <span class="time-count">{{ timeBuckets.slow }}</span>
        </div>
        <div class="time-bar">
          <span class="time-label">&gt;500мс:</span>
          <div class="time-fill very-slow" :style="{ width: getTimePercent('verySlow') + '%' }"></div>
          <span class="time-count">{{ timeBuckets.verySlow }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// API URL - в Docker используем относительный путь или переменную окружения
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Настройки теста
const requestsCount = ref(100)
const delayMs = ref(10)
const concurrency = ref(5)
const limit = ref(10)

// Состояние
const isRunning = ref(false)
const shouldStop = ref(false)
const totalSent = ref(0)
const successCount = ref(0)
const errorCount = ref(0)
const startTime = ref<number | null>(null)
const currentTime = ref<number>(Date.now())
const responseTimes = ref<number[]>([])

// Интервал для обновления времени
let timeInterval: number | null = null

// Вычисляемые значения
const elapsedTime = computed(() => {
  if (!startTime.value) return '0.00'
  const elapsed = (currentTime.value - startTime.value) / 1000
  return elapsed.toFixed(2)
})

const progressPercent = computed(() => {
  if (requestsCount.value === 0) return 0
  return Math.round((totalSent.value / requestsCount.value) * 100)
})

const avgResponseTime = computed(() => {
  if (responseTimes.value.length === 0) return '0'
  const avg = responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length
  return avg.toFixed(0)
})

const requestsPerSecond = computed(() => {
  if (!startTime.value || successCount.value === 0) return '0'
  const elapsed = (currentTime.value - startTime.value) / 1000
  if (elapsed === 0) return '0'
  return (successCount.value / elapsed).toFixed(1)
})

const timeBuckets = computed(() => {
  const buckets = { fast: 0, medium: 0, slow: 0, verySlow: 0 }
  responseTimes.value.forEach(time => {
    if (time < 50) buckets.fast++
    else if (time < 200) buckets.medium++
    else if (time < 500) buckets.slow++
    else buckets.verySlow++
  })
  return buckets
})

function getTimePercent(bucket: 'fast' | 'medium' | 'slow' | 'verySlow'): number {
  const total = responseTimes.value.length
  if (total === 0) return 0
  return (timeBuckets.value[bucket] / total) * 100
}

// Функция задержки
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Отправка одного запроса
async function sendRequest(): Promise<void> {
  const start = performance.now()
  try {
    const offset = Math.floor(Math.random() * 49000) // Случайный offset для реалистичности
    const response = await fetch(`${API_URL}/items?limit=${limit.value}&offset=${offset}`)
    
    if (response.ok) {
      successCount.value++
      const end = performance.now()
      responseTimes.value.push(end - start)
    } else {
      errorCount.value++
    }
  } catch (error) {
    errorCount.value++
  }
  totalSent.value++
}

// Запуск теста
async function startTest(): Promise<void> {
  // Сброс состояния
  isRunning.value = true
  shouldStop.value = false
  totalSent.value = 0
  successCount.value = 0
  errorCount.value = 0
  responseTimes.value = []
  startTime.value = Date.now()
  
  // Запуск обновления времени
  timeInterval = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 100)

  // Отправка запросов с учетом параллельности
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

  // Завершение теста
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
  currentTime.value = Date.now()
  isRunning.value = false
}

// Остановка теста
function stopTest(): void {
  shouldStop.value = true
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: #fff;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: #e94560;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-title {
  width: 32px;
  height: 32px;
  color: #f7dc6f;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ccc;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
}

.form-group input:disabled {
  opacity: 0.5;
}

button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
}

.btn-start {
  background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
  color: #fff;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
}

.btn-stop {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-stop:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
}

.stat.success .stat-value {
  color: #4ecdc4;
}

.stat.error .stat-value {
  color: #ff6b6b;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4 0%, #e94560 100%);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  color: #888;
  font-size: 0.9rem;
}

.time-distribution {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.time-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-label {
  width: 80px;
  font-size: 0.85rem;
  color: #888;
}

.time-fill {
  height: 20px;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.time-fill.fast {
  background: #4ecdc4;
}

.time-fill.medium {
  background: #f7dc6f;
}

.time-fill.slow {
  background: #f39c12;
}

.time-fill.very-slow {
  background: #e74c3c;
}

.time-count {
  font-size: 0.85rem;
  color: #ccc;
  min-width: 40px;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>
