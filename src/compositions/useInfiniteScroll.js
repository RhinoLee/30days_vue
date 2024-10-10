import { computed, nextTick, reactive, ref, watch } from 'vue'
import { tryOnUnmounted } from '@/utils/shared'
import { resolveElement, toValue } from '@/helper'
import { useElementVisibility } from '@/compositions/useElementVisibility'
import { useScroll } from '@/compositions/useScroll'

export function useInfiniteScroll(
  element,
  onLoadMore,
  options = {},
) {
  const {
    direction = 'bottom',
    interval = 100,
    canLoadMore = () => true,
  } = options

  const state = reactive(useScroll(
    element,
    {
      ...options,
      offset: {
        [direction]: options.distance ?? 0,
        ...options.offset,
      },
    },
  ))

  const promise = ref()
  const isLoading = computed(() => !!promise.value)

  const observedElement = computed(() => {
    return resolveElement(toValue(element))
  })

  const isElementVisible = useElementVisibility(observedElement)

  function checkAndLoad() {
    state.measure()

    if (!observedElement.value || !isElementVisible.value || !canLoadMore(observedElement.value))
      return

    const { scrollHeight, clientHeight, scrollWidth, clientWidth } = observedElement.value
    const isNarrower = (direction === 'bottom' || direction === 'top')
      ? scrollHeight <= clientHeight
      : scrollWidth <= clientWidth

    if (state.arrivedState[direction] || isNarrower) {
      if (!promise.value) {
        promise.value = Promise.all([
          onLoadMore(state),
          new Promise(resolve => setTimeout(resolve, interval)),
        ])
          .finally(() => {
            promise.value = null
            nextTick(() => checkAndLoad())
          })
      }
    }
  }

  const stop = watch(
    () => [state.arrivedState[direction], isElementVisible.value],
    checkAndLoad,
    { immediate: true },
  )

  tryOnUnmounted(stop)

  return {
    isLoading,
    reset() {
      nextTick(() => checkAndLoad())
    },
  }
}
