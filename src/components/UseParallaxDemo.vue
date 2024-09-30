<script setup>
import { ref } from 'vue'
import { useParallax } from '@/compositions/useParallax'

const boxRef = ref(null)

const { roll, tilt, source } = useParallax(boxRef)
</script>

<template>
  <h2>UseParallaxDemo</h2>
  <div ref="boxRef" class="box">
    hover box
  </div>
  <div>roll: {{ roll }}</div>
  <div>tilt: {{ tilt }}</div>
  <div>source: {{ source }}</div>
</template>

<style>
.box {
  width: 300px;
  height: 300px;
  background: #ccc;
}
</style>
