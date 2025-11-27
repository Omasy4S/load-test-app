<template>
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
</template>

<script setup lang="ts">
import {
  responseTimes,
  timeBuckets,
  getTimePercent
} from '../composables/useLoadTest'
</script>

<style scoped>
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
</style>
