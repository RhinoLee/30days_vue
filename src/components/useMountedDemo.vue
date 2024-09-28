<script setup>
import { useMounted } from '@/compositions/useMounted'

const isMounted = useMounted()
</script>

<template>
  <h2>useMountedDemo</h2>
  <div>{{ isMounted ? 'mounted' : 'unmounted' }}</div>
</template>
