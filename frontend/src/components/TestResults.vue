<template>
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
</template>

<script setup lang="ts">
import {
  isRunning,
  totalSent,
  successCount,
  errorCount,
  elapsedTime,
  avgResponseTime,
  requestsPerSecond,
  progressPercent
} from '../composables/useLoadTest'
</script>

<style scoped>
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

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
