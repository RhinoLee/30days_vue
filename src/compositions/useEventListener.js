import { getCurrentScope, onScopeDispose, watch } from 'vue'
import { defaultWindow, noop, toValue, unrefElement } from '@/helper'

const toString = Object.prototype.toString
export function isObject(val) {
  return toString.call(val) === '[object Object]'
}

export function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}

export function useEventListener(...args) {
  let target
  let events
  let listeners
  let options

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events, listeners, options] = args
    target = defaultWindow
  }
  else {
    [target, events, listeners, options] = args
  }

  if (!target)
    return noop

  if (!Array.isArray(events))
    events = [events]
  if (!Array.isArray(listeners))
    listeners = [listeners]

  // 用來收集 removeEventListener function
  const cleanups = []
  const cleanup = () => {
    cleanups.forEach(cleanup => cleanup())
    cleanups.length = 0
  }

  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options]) => {
      cleanup()
      if (!el)
        return

      const optionsClone = isObject(options) ? { ...options } : options
      cleanups.push(...events.flatMap((event) => {
        return listeners.map(listener => register(el, event, listener, optionsClone))
      }))
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(stop)

  return stop
};
