<script setup>
import { ref } from 'vue'
import { useElementVisibility } from '@/compositions/useElementVisibility'

const el = ref(null)
const isVisible = useElementVisibility(el)
</script>

<template>
  <h2>UseElementVisibilityDemo</h2>
  <div>
    <div ref="el" class="max-w-100 relative area bg-white dark:bg-gray-800 shadow-lg z-60">
      Target Element (scroll down)
    </div>
  </div>
  <div class="float m-3 area shadow-lg">
    Element
    <div
      class="font-bold"
    >
      {{ isVisible ? 'inside' : 'outside' }}
    </div>
    the viewport
  </div>
</template>

<style scoped>
.area {
  border-width: 2px;
  border-style: dashed;
  padding: 1rem;
}
.float {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1rem 2rem;
  border: 1px dashed #e2e2e3;
  background: #fff;
  z-index: 100;
  min-width: 100px;
}
</style>
