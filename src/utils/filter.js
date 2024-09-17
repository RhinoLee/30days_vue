export function throttleFilter(fn, ms, trailing = true) {
  let lastExec = 0
  let timer = null

  return function () {
    const duration = Date.now() - lastExec

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (duration >= ms) {
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
  }
}
