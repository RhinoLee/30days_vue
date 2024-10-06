<script setup>
import { computed, ref, toRefs } from 'vue'
import { useScroll } from '@/compositions/useScroll'

const el = ref(null)
const { x, y, arrivedState, directions, isScrolling } = useScroll(el)
const { left, right, top, bottom } = toRefs(arrivedState)
const { left: toLeft, right: toRight, top: toTop, bottom: toBottom } = toRefs(directions)

// Format the numbers with toFixed() to make them
// nicer to display
const displayX = computed({
  get() {
    return x.value.toFixed(1)
  },
  set(val) {
    x.value = Number.parseFloat(val)
  },
})
const displayY = computed({
  get() {
    return y.value.toFixed(1)
  },
  set(val) {
    y.value = Number.parseFloat(val)
  },
})
</script>

<template>
  <h2>UseScrollDemo</h2>
  <div class="demo">
    <div class="flex">
      <div ref="el" class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
        <div class="w-500px h-400px relative">
          <div position="absolute left-0 top-0" bg="gray-500/5" p="x-2 y-1">
            TopLeft
          </div>
          <div position="absolute left-0 bottom-0" bg="gray-500/5" p="x-2 y-1">
            BottomLeft
          </div>
          <div position="absolute right-0 top-0" bg="gray-500/5" p="x-2 y-1">
            TopRight
          </div>
          <div position="absolute right-0 bottom-0" bg="gray-500/5" p="x-2 y-1">
            BottomRight
          </div>
          <div position="absolute left-1/3 top-1/3" bg="gray-500/5" p="x-2 y-1">
            Scroll Me
          </div>
        </div>
      </div>
      <div class="m-auto w-280px pl-4">
        <div class="px-6 py-4 rounded grid grid-cols-[120px_auto] gap-2 bg-gray-500/5">
          <!-- position -->
          <span text="right" opacity="75" class="py-4">X Position</span>
          <div class="text-primary">
            <div>
              <input v-model="displayX" type="number" min="0" max="200" step="10" class="w-full !min-w-0">
            </div>
          </div>
          <span text="right" opacity="75" class="py-4">Y Position</span>
          <div class="text-primary">
            <div>
              <input v-model="displayY" type="number" min="0" max="100" step="10" class="w-full !min-w-0">
            </div>
          </div>
          <!-- arrivedState -->
          <div text="right" opacity="75">
            Top Arrived
          </div>
          {{ top }}
          <div text="right" opacity="75">
            Right Arrived
          </div>
          {{ right }}
          <div text="right" opacity="75">
            Bottom Arrived
          </div>
          {{ bottom }}
          <div text="right" opacity="75">
            Left Arrived
          </div>
          {{ left }}
          <!-- directions -->
          <div text="right" opacity="75">
            Scrolling Up
          </div>
          {{ toTop }}
          <div text="right" opacity="75">
            Scrolling Right
          </div>
          {{ toRight }}
          <div text="right" opacity="75">
            Scrolling Down
          </div>
          {{ toBottom }}
          <div text="right" opacity="75">
            Scrolling Left
          </div>
          {{ toLeft }}
          <!-- isScrolling -->
          <span text="right" opacity="75">isScrolling</span>
          {{ isScrolling }}
        </div>
      </div>
    </div>
  </div>
</template>
