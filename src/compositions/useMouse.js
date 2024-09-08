import { ref } from 'vue'
import { useEventListener } from '@/compositions/useEventListener'
import { defaultWindow } from '@/helper'

const UseMouseBuiltinExtractors = {
  page: event => [event.pageX, event.pageY],
  client: event => [event.clientX, event.clientY],
  screen: event => [event.screenX, event.screenY],
}

export function useMouse(options = {}) {
  const {
    type = 'page',
    touch = true,
    initialValue = { x: 0, y: 0 },
    resetOnTouchEnds = false,
    window = defaultWindow,
    target = window,
    scroll = true,
  } = options

  const x = ref(initialValue.x)
  const y = ref(initialValue.y)
  const sourceType = ref(null)
  let _prevMouseEvent = null

  // type 可以傳入客製化選項，像是官網範例就是用 (event) => [event.offsetX, event.offsetY] 來取得 offset 數值
  const extractor = typeof type === 'function'
    ? type
    : UseMouseBuiltinExtractors[type]

  const mouseHandler = (event) => {
    const result = extractor(event)
    _prevMouseEvent = event

    if (result) {
      [x.value, y.value] = result
      sourceType.value = 'mouse'
    }
  }

  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0])
      if (result) {
        [x.value, y.value] = result
        sourceType.value = 'touch'
      }
    }
  }

  const scrollHandler = () => {
    if (!_prevMouseEvent || !window)
      return
    const pos = extractor(_prevMouseEvent)

    if (_prevMouseEvent instanceof MouseEvent && pos) {
      x.value = pos[0] + window.scrollX
      y.value = pos[1] + window.scrollY
    }
  }

  const reset = () => {
    x.value = initialValue.x
    y.value = initialValue.y
  }

  const mouseHandlerWrapper = event => mouseHandler(event)
  const touchHandlerWrapper = event => touchHandler(event)
  const scrollHandlerWrapper = event => scrollHandler(event)

  if (target) {
    const listenerOptions = { passive: true }
    useEventListener(target, ['mousemove', 'dragover'], mouseHandlerWrapper, listenerOptions)
    if (touch && type !== 'movement') {
      useEventListener(target, ['touchstart', 'touchmove'], touchHandlerWrapper, listenerOptions)
      if (resetOnTouchEnds) {
        useEventListener(target, 'touchend', reset, listenerOptions)
      }
    }
    if (scroll && type === 'page')
      useEventListener(window, 'scroll', scrollHandlerWrapper, listenerOptions)
  }

  return {
    x,
    y,
    sourceType,
  }
}
