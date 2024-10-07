import { computed, ref, watch } from 'vue'
import { defaultWindow, noop, notNullish, toValue, unrefElement } from '@/helper'
import { tryOnScopeDispose } from '@/utils/shared'
import { useSupported } from '@/compositions/useSupported'

export function useIntersectionObserver(target, callback, options = {}) {
  const {
    root,
    rootMargin = '0px',
    threshold = 0.1,
    window = defaultWindow,
    immediate = true,
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)
  const targets = computed(() => {
    const _target = toValue(target)
    return (Array.isArray(_target) ? _target : [_target]).map(unrefElement).filter(notNullish)
  })

  let cleanup = noop
  const isActive = ref(immediate)

  const stopWatch = isSupported.value
    ? watch(
      () => [targets.value, unrefElement(root), isActive.value],
      ([targets, root]) => {
        cleanup()
        if (!isActive.value)
          return

        if (!targets.length)
          return

        const observer = new IntersectionObserver(
          callback,
          {
            root: unrefElement(root),
            rootMargin,
            threshold,
          },
        )

        targets.forEach(el => el && observer.observe(el))

        cleanup = () => {
          observer.disconnect()
          cleanup = noop
        }
      },
      { immediate, flush: 'post' },
    )
    : noop

  const stop = () => {
    cleanup()
    stopWatch()
    isActive.value = false
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    isActive,
    pause() {
      cleanup()
      isActive.value = false
    },
    resume() {
      isActive.value = true
    },
    stop,
  }
}
