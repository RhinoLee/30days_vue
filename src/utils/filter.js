export function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    filter(() => fn.apply(this, args), { fn, this: this, args })
  };

  return wrapper
}

export function throttleFilter(ms, trailing = false, leading = false) {
  let lastExec = 0
  let timer = null
  let isLeading = true

  return function (invoke) {
    const duration = Date.now() - lastExec

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (duration >= ms && (leading || !isLeading)) {
      lastExec = Date.now()
      invoke()
    }
    else if (trailing) {
      timer = setTimeout(() => {
        lastExec = Date.now()
        invoke()
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
