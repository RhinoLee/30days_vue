import { computed, reactive, ref } from 'vue'
import { toValue, unrefElement } from '@/helper'
import { useEventListener } from '@/compositions/useEventListener'

const ARRIVED_STATE_THRESHOLD_PIXELS = 1

export function useScroll(element, options = {}) {
  const {
    behavior = 'auto',
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  } = options

  const internalX = ref(0)
  const internalY = ref(0)

  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })

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

    const { display, flexDirection } = getComputedStyle(el)

    const scrollLeft = el.scrollLeft

    const left = Math.abs(scrollLeft) <= (offset.left || 0)
    const right = Math.abs(scrollLeft)
      + el.clientWidth >= el.scrollWidth
      - (offset.right || 0)
      - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.left = right
      arrivedState.right = left
    }
    else {
      arrivedState.left = left
      arrivedState.right = right
    }

    internalX.value = scrollLeft

    let scrollTop = el.scrollTop

    // patch for mobile compatible
    if (target === window.document && !scrollTop)
      scrollTop = window.document.body.scrollTop

    const top = Math.abs(scrollTop) <= (offset.top || 0)
    const bottom = Math.abs(scrollTop)
      + el.clientHeight >= el.scrollHeight
      - (offset.bottom || 0)
      - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.top = bottom
      arrivedState.bottom = top
    }
    else {
      arrivedState.top = top
      arrivedState.bottom = bottom
    }

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
    arrivedState,
  }
}
