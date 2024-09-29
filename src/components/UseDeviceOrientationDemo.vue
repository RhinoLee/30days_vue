<script setup>
import { useDeviceOrientation } from '@/compositions/useDeviceOrientation'

const { isSupported, isAbsolute, alpha, beta, gamma } = useDeviceOrientation()
</script>

<template>
  <h2>useDeviceOrientationDemo</h2>
  <div>isSupported: {{ isSupported }}</div>
  <div>isAbsolute: {{ isAbsolute }}</div>
  <div>alpha: {{ alpha }}</div>
  <div>beta: {{ beta }}</div>
  <div>gamma: {{ gamma }}</div>
</template>
