import { noop, toValue } from '@/helper'

export function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, this: this, args }))
        .then(resolve)
        .catch(reject)
    })
  };

  return wrapper
}

export function throttleFilter(ms, trailing = true, leading = true, rejectOnCancel = false) {
  let lastExec = 0
  let timer
  let isLeading = true
  let lastValue
  let lastRejector = noop

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
      lastRejector()
      lastRejector = noop
    }
  }

  return function (_invoke) {
    const duration = Date.now() - lastExec
    const invoke = () => {
      return lastValue = _invoke()
    }

    clear()

    if (duration >= ms && (leading || !isLeading)) {
      lastExec = Date.now()
      invoke()
    }
    else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve
        timer = setTimeout(() => {
          lastExec = Date.now()
          resolve(invoke())
          clear()
        }, Math.max(0, ms - duration))
      })
    }

    if (!leading && !timer) {
      timer = setTimeout(() => {
        isLeading = true
      }, ms)
    }

    isLeading = false
    return lastValue
  }
}

export function debounceFilter(ms, options) {
  let timer
  let lastRejector

  const _clearTimeout = (timer) => {
    clearTimeout(timer)
    lastRejector()
    lastRejector = noop
  }

  const filter = (invoke) => {
    const duration = toValue(ms)

    // 每次 filter 被觸發，就要先清空 timer，重新計算 timeout，因為只需要拿最後一次的 setTimeout 執行
    if (timer)
      _clearTimeout(timer)

    if (duration <= 0) {
      return Promise.resolve(invoke())
    }

    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve

      timer = setTimeout(() => {
        resolve(invoke())
      }, duration)
    })
  }

  return filter
}
