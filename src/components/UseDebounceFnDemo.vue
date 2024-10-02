<script setup>
import { ref } from 'vue'
import { useDebounceFn } from '@/compositions/useDebounceFn'

const clicked = ref(0)
const updated = ref(0)

function updateValue() {
  console.log('this: ', this) // {}
  updated.value += 1
}

const debounceFn = useDebounceFn(updateValue, 1000, { maxWait: 5000, rejectOnCancel: false })

async function clickHandler() {
  clicked.value += 1
  const testThis = {}
  try {
    debounceFn.apply(testThis)
    console.log('after debounceFn()')
  }
  catch {
    // 連續觸發時，上一次觸發被 debounce cancel 掉，目標是可以在這邊獲得通知
    console.error('cancel')
  }
}
</script>

<template>
  <h2>UseDebounceFnDemo</h2>
  <div class="box" @click="clickHandler">
    <span>click debounce box</span>
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
