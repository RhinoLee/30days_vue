import { computed, ref } from 'vue'
import { toValue, unrefElement } from '@/helper'
import { useEventListener } from '@/compositions/useEventListener'

export function useScroll(element, options = {}) {
  const {
    behavior = 'auto',
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
  } = options

  const internalX = ref(0)
  const internalY = ref(0)

  const x = computed({
    get() {
      return internalX.value
    },
    set(x) {
      scrollTo(x, undefined)
    },
  })

  const y = computed({
    get() {
      return internalY.value
    },
    set(y) {
      scrollTo(undefined, y)
    },
  })

  function scrollTo(_x, _y) {
    if (!window)
      return

    const _element = toValue(element)
    if (!_element)
      return

    (_element instanceof Document ? window.document.body : _element)?.scrollTo({
      top: toValue(_y) ?? y.value,
      left: toValue(_x) ?? x.value,
      behavior: toValue(behavior),
    })
    const scrollContainer
      = (_element)?.document?.documentElement // window
      || (_element)?.documentElement // document
      || (_element)
    if (x != null)
      internalX.value = scrollContainer.scrollLeft
    if (y != null)
      internalY.value = scrollContainer.scrollTop
  }

  const setArrivedState = (target) => {
    if (!window)
      return

    const el = (
      (target)?.document?.documentElement
      || (target)?.documentElement
      || unrefElement(target)
    )

    const scrollLeft = el.scrollLeft

    internalX.value = scrollLeft

    let scrollTop = el.scrollTop

    // patch for mobile compatible
    if (target === window.document && !scrollTop)
      scrollTop = window.document.body.scrollTop

    internalY.value = scrollTop
  }

  const onScrollHandler = (e) => {
    if (!window)
      return

    const eventTarget = (
      (e.target).documentElement ?? e.target
    )

    setArrivedState(eventTarget)
  }

  useEventListener(
    element,
    'scroll',
    onScrollHandler,
    eventListenerOptions,
  )

  return {
    x,
    y,
  }
}
