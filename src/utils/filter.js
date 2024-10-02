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
  let maxTimer
  let lastRejector

  const _clearTimeout = (timer) => {
    clearTimeout(timer)
    lastRejector()
    lastRejector = noop
  }

  const filter = (invoke) => {
    const duration = toValue(ms)
    const maxDuration = toValue(options.maxWait)

    // 每次 filter 被觸發，就要先清空 timer，重新計算 timeout，因為只需要拿最後一次的 setTimeout 執行
    if (timer)
      _clearTimeout(timer)

    // maxDuration 會在時間到時強制觸發
    if (duration <= 0 || (maxDuration !== undefined && maxDuration <= 0)) {
      if (maxTimer) {
        _clearTimeout(maxTimer)
        maxTimer = null
      }
      return Promise.resolve(invoke())
    }

    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve

      /**
       * 如果有傳入 > 0 的 maxWait，而且還沒設定過 maxTimer，就設定一個 maxTimer，時間就是用傳入的 maxWait option
       * 在 maxTimer 到點要執行 callback 的時候，也有可能有一般的 timer 還在倒數，舉個例子：
       * 在 ms 設定 1000 的情況下，我的最後一次觸發就會讓一般的 timer 開始倒數，只要 1000ms 到了，就會執行傳入的 fn
       * 但如果 1000ms 還沒到，我再觸發下一次，注意下面程式碼，一般 timer 一定會被設置，所以這邊需要針對一般 timer 做清除
       */
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer)
          maxTimer = null
          resolve(invoke())
        }, maxDuration)
      }

      timer = setTimeout(() => {
        // 在一般計時器到點後，要清除 maxTimer，否則會出現 maxTimer 到點後再次執行的非預期狀況
        if (maxTimer)
          _clearTimeout(maxTimer)
        maxTimer = null

        resolve(invoke())
      }, duration)
    })
  }

  return filter
}
