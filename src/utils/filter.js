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

export function throttleFilter(ms, trailing = false, leading = false, rejectOnCancel = false) {
  const noop = () => {}
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
        }, ms - duration)
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
