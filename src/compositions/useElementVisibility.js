import { ref } from 'vue'
import { defaultWindow } from '@/helper'
import { useIntersectionObserver } from '@/compositions/useIntersectionObserver'

export function useElementVisibility(element, options = {}) {
  const { window = defaultWindow, scrollTarget, threshold = 0 } = options
  const elementIsVisible = ref(false)

  useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = elementIsVisible.value

      // Get the latest value of isIntersecting based on the entry time
      let latestTime = 0
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time
          isIntersecting = entry.isIntersecting
        }
      }
      elementIsVisible.value = isIntersecting
    },
    {
      root: scrollTarget,
      window,
      threshold,
    },
  )

  return elementIsVisible
}
