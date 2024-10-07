import { getCurrentInstance, getCurrentScope, nextTick, onMounted, onScopeDispose } from 'vue'

export function promiseTimeout(ms, throwOnTimeout = false, reason = 'Timeout') {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(() => reject(reason), ms)
    else
      setTimeout(resolve, ms)
  })
}

export function getLifeCycleTarget(target) {
  return target || getCurrentInstance()
}

export function tryOnMounted(fn, sync = true, target) {
  const instance = getLifeCycleTarget()
  if (instance)
    onMounted(fn, target)
  else if (sync)
    fn()
  else
    nextTick(fn)
}

export function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}
