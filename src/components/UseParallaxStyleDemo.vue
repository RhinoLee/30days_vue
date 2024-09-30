<script setup>
import { computed, reactive, ref } from 'vue'
import { useParallax } from '@/compositions/useParallax'

const target = ref(null)

const parallax = reactive(useParallax(target))

// 整個視差效果的容器樣式，有多做一個 border 標示，最外層的 border 就是這個 target 的範圍
const targetStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  border: '1px solid #cdcdcd',
  transition: '.3s ease-out all',
}

// 主要用途 -> perspective: '300px' 建立 3D 空間，影響子元素的 3D 變換效果。
const containerStyle = {
  margin: '3em auto',
  perspective: '300px',
}

// 卡片基本樣式
const cardStyle = computed(() => ({
  background: '#fff',
  height: '20rem',
  width: '15rem',
  borderRadius: '5px',
  border: '1px solid #cdcdcd',
  overflow: 'hidden',
  transition: '.3s ease-out all',
  boxShadow: '0 0 20px 0 rgba(255, 255, 255, 0.25)',
}))

// 卡片內部的小視窗，子元素圖片都會在視窗裡呈現
const cardWindowStyle = {
  overflow: 'hidden',
  fontSize: '6rem',
  position: 'absolute',
  top: 'calc(50% - 1em)',
  left: 'calc(50% - 1em)',
  height: '2em',
  width: '2em',
  margin: 'auto',
}

// 定義所有圖層的基本樣式，讓他們填滿卡片內部的小視窗
const layerBase = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  transition: '.3s ease-out all',
}

const layer0 = computed(() => ({
  ...layerBase,
}))

const layer1 = computed(() => ({
  ...layerBase,
}))

const layer2 = computed(() => ({
  ...layerBase,
}))

const layer3 = computed(() => ({
  ...layerBase,
}))

const layer4 = layerBase
</script>

<template>
  <div>
    <div ref="target" :style="targetStyle">
      <div :style="containerStyle">
        <div :style="cardStyle">
          <div :style="cardWindowStyle">
            <img
              :style="layer0"
              src="https://jaromvogel.com/images/design/jumping_rabbit/page2layer0.png"
              alt=""
            >
            <img
              :style="layer1"
              src="https://jaromvogel.com/images/design/jumping_rabbit/page2layer1.png"
              alt=""
            >
            <img
              :style="layer2"
              src="https://jaromvogel.com/images/design/jumping_rabbit/page2layer2.png"
              alt=""
            >
            <img
              :style="layer3"
              src="https://jaromvogel.com/images/design/jumping_rabbit/page2layer3.png"
              alt=""
            >
            <img
              :style="layer4"
              src="https://jaromvogel.com/images/design/jumping_rabbit/page2layer4.png"
              alt=""
            >
          </div>
        </div>
      </div>
      <div class="note opacity-1">
        Credit of images to
        <a
          href="https://codepen.io/jaromvogel"
          target="__blank"
        >Jarom Vogel</a>
      </div>
    </div>
  </div>
</template>
