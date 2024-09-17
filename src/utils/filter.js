export function throttleFilter(fn, ms, trailing = false, leading = false) {
  let lastExec = 0
  let timer = null
  let isLeading = true

  return function () {
    const duration = Date.now() - lastExec

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (duration >= ms && (leading || !isLeading)) {
      lastExec = Date.now()
      fn()
    }
    else if (trailing) {
      timer = setTimeout(() => {
        lastExec = Date.now()
        fn()
        clearTimeout(timer)
        timer = null
      }, ms - duration)
    }

    if (!leading && !timer) {
      timer = setTimeout(() => {
        isLeading = true
      }, ms)
    }

    isLeading = false
  }
}
