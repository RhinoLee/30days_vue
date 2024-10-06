import { computed, reactive, ref } from 'vue'
import { noop, toValue, unrefElement } from '@/helper'
import { tryOnMounted } from '@/utils/shared'
import { useEventListener } from '@/compositions/useEventListener'
import { useDebounceFn } from '@/compositions/useDebounceFn'

const ARRIVED_STATE_THRESHOLD_PIXELS = 1

export function useScroll(element, options = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
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
    onError = (e) => { console.error(e) },
  } = options

  const internalX = ref(0)
  const internalY = ref(0)

  const isScrolling = ref(false)
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })
  const directions = reactive({
    left: false,
    right: false,
    top: false,
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

  const onScrollEnd = (e) => {
    // dedupe if support native scrollend event
    if (!isScrolling.value)
      return

    isScrolling.value = false
    directions.left = false
    directions.right = false
    directions.top = false
    directions.bottom = false
    onStop(e)
  }

  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle)

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

    directions.left = scrollLeft < internalX.value
    directions.right = scrollLeft > internalX.value

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

    directions.top = scrollTop < internalY.value
    directions.bottom = scrollTop > internalY.value

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

    isScrolling.value = true
    setArrivedState(eventTarget)
    onScrollEndDebounced(e)
  }

  tryOnMounted(() => {
    try {
      const _element = toValue(element)
      if (!_element)
        return
      setArrivedState(_element)
    }
    catch (e) {
      onError(e)
    }
  })

  useEventListener(
    element,
    'scroll',
    onScrollHandler,
    eventListenerOptions,
  )

  useEventListener(
    element,
    'scrollend',
    onScrollEnd,
    eventListenerOptions,
  )

  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element)

      if (window && _element)
        setArrivedState(_element)
    },
  }
}
