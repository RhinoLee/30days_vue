<script setup>
import { ref } from 'vue'
import { useThrottleFn } from '@/compositions/useThrottleFn'

const clicked = ref(0)
const updated = ref(0)

const throttledFn = useThrottleFn(() => {
  updated.value += 1
}, 1000)

function clickHandler() {
  clicked.value += 1
  throttledFn()
}
</script>

<template>
  <h2>UseThrottleFnDemo</h2>
  <div class="box" @click="clickHandler">
    <span>click throttle box</span>
  </div>
  <div>Button clicked: {{ clicked }}</div>
  <div>Event handler called: {{ updated }}</div>
</template>

<style>
.box {
  width: 300px;
  height: 300px;
  background: #ccc;
}
</style>
