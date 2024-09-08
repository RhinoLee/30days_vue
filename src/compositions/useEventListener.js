import { getCurrentScope, onScopeDispose, unref, watch } from 'vue'
import { defaultWindow, noop } from '@/helper'

const toString = Object.prototype.toString
export function isObject(val) {
  return toString.call(val) === '[object Object]'
}

export function toValue(r) {
  return typeof r === 'function'
    ? r()
    : unref(r)
}

export function unrefElement(elRef) {
  const plain = toValue(elRef)
  // 有 $el 的話是 vue component
  return plain?.$el ?? plain
}

export function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}

export function useEventListener(target, event, listener, options) {
  let _target
  let events
  let listeners
  let _options = options

  if (typeof target === 'string' || Array.isArray(target)) {
    _target = defaultWindow
  }
  _target = target
  events = event
  listeners = listener
  _options = options

  if (!_target)
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
    () => [unrefElement(target), toValue(_options)],
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
