<template>
  <div class="container">
    <h1>
      <svg class="icon-title" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      Нагрузочное тестирование API
    </h1>
    
    <TestSettings />
    <TestResults />
    <TimeDistribution />
  </div>
</template>

<script setup lang="ts">
import TestSettings from './components/TestSettings.vue'
import TestResults from './components/TestResults.vue'
import TimeDistribution from './components/TimeDistribution.vue'
</script>

<style>
@import './styles/main.css';
</style>
