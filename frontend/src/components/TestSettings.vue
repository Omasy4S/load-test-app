<template>
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
</template>

<script setup lang="ts">
import {
  requestsCount,
  delayMs,
  concurrency,
  limit,
  isRunning,
  startTest,
  stopTest
} from '../composables/useLoadTest'
</script>

<style scoped>
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

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}
</style>
