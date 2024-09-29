<script setup>
import { useScreenOrientation } from '@/compositions/useScreenOrientation'

const { isSupported, orientation, angle } = useScreenOrientation()
</script>

<template>
  <h2>UseScreenOrientationDemo</h2>
  <div>isSupported: {{ isSupported }}</div>
  <div>orientation: {{ orientation }}</div>
  <div>angle: {{ angle }}</div>
</template>
