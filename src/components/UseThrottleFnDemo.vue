<script setup>
import { ref } from 'vue'
import { useThrottleFn } from '@/compositions/useThrottleFn'

const clicked = ref(0)
const updated = ref(0)

function updateValue() {
  console.log('this: ', this) // {}
  updated.value += 1
}

// traling 要是 true，rejectOnCancel 才會有效果
const throttledFn = useThrottleFn(updateValue, 3000, true, false)

async function clickHandler() {
  clicked.value += 1
  const testThis = {}
  try {
    throttledFn.apply(testThis)
    console.log('after throttledFn()')
  }
  catch {
    // 連續觸發時，上一次觸發被 throttle cancel 掉，目標是可以在這邊獲得通知
    console.error('cancel')
  }
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
