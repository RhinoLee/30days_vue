<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import UseMouseInElementDemo from './components/UseMouseInElementDemo.vue'
import UseThrottleFnDemo from './components/UseThrottleFnDemo.vue'
import useMountedDemo from './components/useMountedDemo.vue'
import UseDeviceOrientationDemo from './components/UseDeviceOrientationDemo.vue'
import UseScreenOrientationDemo from './components/UseScreenOrientationDemo.vue'
import UseParallaxDemo from './components/UseParallaxDemo.vue'
import UseParallaxStyleDemo from './components/UseParallaxStyleDemo.vue'
import UseDebounceFnDemo from './components/UseDebounceFnDemo.vue'
import UseScrollDemo from './components/UseScrollDemo.vue'
import UseIntersectionObserverDemo from './components/UseIntersectionObserverDemo.vue'
import UseElementVisibilityDemo from './components/UseElementVisibilityDemo.vue'
import UseInfiniteScrollDemo from './components/UseInfiniteScrollDemo.vue'
import { useMouse } from '@/compositions/useMouse'

const isHelloWorldVisible = ref(true)
const { x, y, sourceType } = useMouse()

function toggleHelloWorld() {
  isHelloWorldVisible.value = !isHelloWorldVisible.value
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" @click="toggleHelloWorld">

    <div class="wrapper">
      <HelloWorld v-if="isHelloWorldVisible" />
    </div>
  </header>

  <main>
    <TheWelcome />
    <div>x: {{ x }}</div>
    <div>y: {{ y }}</div>
    <div>sourceType: {{ sourceType }}</div>

    <UseMouseInElementDemo />
    <UseElementVisibilityDemo />
    <UseInfiniteScrollDemo />
    <UseThrottleFnDemo />
    <useMountedDemo />
    <UseDeviceOrientationDemo />
    <UseScreenOrientationDemo />
    <UseParallaxDemo />
    <UseParallaxStyleDemo />
    <UseDebounceFnDemo />
    <UseScrollDemo />
    <UseIntersectionObserverDemo />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
