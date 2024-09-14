import { unref } from 'vue'

export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
export const defaultWindow = isClient ? window : undefined

export function noop() {}

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
