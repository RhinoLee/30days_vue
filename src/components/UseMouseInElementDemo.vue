<script setup>
import { ref } from 'vue'
import { useMouseInElement } from '@/compositions/useMouseInElement'

const boxRef = ref(null)
const {
  x,
  y,
  sourceType,
  elementX,
  elementY,
  elementPositionX,
  elementPositionY,
  elementHeight,
  elementWidth,
  isOutside,
} = useMouseInElement(boxRef)
</script>

<template>
  <h3>UseMouseInElementDemo</h3>
  <div ref="boxRef" class="box">
    <span>box</span>
  </div>

  <div class="info">
    <div>
      <span>x: </span>
      <span>{{ x }}</span>
    </div>
    <div>
      <span>y: </span>
      <span>{{ y }}</span>
    </div>
    <div>
      <span>sourceType: </span>
      <span>{{ sourceType }}</span>
    </div>
    <div>
      <span>elementX: </span>
      <span>{{ elementX }}</span>
    </div>
    <div>
      <span>elementY: </span>
      <span>{{ elementY }}</span>
    </div>
    <div>
      <span>elementPositionX: </span>
      <span>{{ elementPositionX }}</span>
    </div>
    <div>
      <span>elementPositionY: </span>
      <span>{{ elementPositionY }}</span>
    </div>
    <div>
      <span>elementHeight: </span>
      <span>{{ elementHeight }}</span>
    </div>
    <div>
      <span>elementWidth: </span>
      <span>{{ elementWidth }}</span>
    </div>
    <div>
      <span>isOutside: </span>
      <span>{{ isOutside }}</span>
    </div>
  </div>
</template>

<style>
.box {
  width: 300px;
  height: 300px;
  background: #ccc;
}
</style>
