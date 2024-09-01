import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useEventListener } from './useEventListener'
import { noop } from '@/helper'

describe('useEventListener', () => {
  // 這邊會選擇使用 capture: true 測試應該是有用意的
  // 參考 MDN：https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
  const options = { capture: true }
  let stop
  let target
  let removeSpy
  let addSpy

  beforeEach(() => {
    target = document.createElement('div')
    removeSpy = vi.spyOn(target, 'removeEventListener')
    addSpy = vi.spyOn(target, 'addEventListener')
  })

  it('should be defined', () => {
    expect(useEventListener).toBeDefined()
  })

  describe('give both none array', () => {
    const listener = vi.fn()
    const event = 'click'

    beforeEach(() => {
      listener.mockReset()
      stop = useEventListener(target, event, listener, options)
    })

    it('should add listener', () => {
      expect(addSpy).toBeCalledTimes(1)
    })

    it('should trigger listener', () => {
      expect(listener).not.toBeCalled()
      target.dispatchEvent(new MouseEvent('click'))
      expect(listener).toBeCalledTimes(1)
    })

    it('should remove listener', () => {
      expect(removeSpy).not.toBeCalled()
      stop()
      expect(removeSpy).toBeCalledTimes(1)
      expect(removeSpy).toBeCalledWith(event, listener, options)
    })
  })

  describe('given array of events but single listener', () => {
    const listener = vi.fn()
    const events = ['click', 'scroll', 'blur', 'resize']

    beforeEach(() => {
      listener.mockReset()
      stop = useEventListener(target, events, listener, options)
    })

    it('should add listener for all events', () => {
      events.forEach(event => expect(addSpy).toBeCalledWith(event, listener, options))
    })

    it('should trigger listener with all events', () => {
      expect(listener).not.toBeCalled()
      events.forEach((event, index) => {
        target.dispatchEvent(new Event(event))
        expect(listener).toBeCalledTimes(index + 1)
      })
    })

    it('should remove listener with all events', () => {
      expect(removeSpy).not.toBeCalled()

      stop()

      expect(removeSpy).toBeCalledTimes(events.length)
      events.forEach(event => expect(removeSpy).toBeCalledWith(event, listener, options))
    })
  })

  describe('given single event but array of listeners', () => {
    const listeners = [vi.fn(), vi.fn(), vi.fn()]
    const event = 'click'

    beforeEach(() => {
      listeners.forEach(listener => listener.mockReset())
      stop = useEventListener(target, event, listeners, options)
    })

    it('should add all listeners', () => {
      listeners.forEach(listener => expect(addSpy).toBeCalledWith(event, listener, options))
    })

    it('should call all listeners with single click event', () => {
      listeners.forEach(listener => expect(listener).not.toBeCalled())

      target.dispatchEvent(new Event(event))

      listeners.forEach(listener => expect(listener).toBeCalledTimes(1))
    })

    it('should remove listeners', () => {
      expect(removeSpy).not.toBeCalled()

      stop()

      expect(removeSpy).toBeCalledTimes(listeners.length)
      listeners.forEach(listener => expect(removeSpy).toBeCalledWith(event, listener, options))
    })
  })

  describe('given both array of events and listeners', () => {
    const listeners = [vi.fn(), vi.fn(), vi.fn()]
    const events = ['click', 'scroll', 'blur', 'resize', 'custom-event']

    beforeEach(() => {
      listeners.forEach(listener => listener.mockReset())
      stop = useEventListener(target, events, listeners, options)
    })

    it('should add all listeners for all events', () => {
      listeners.forEach((listener) => {
        events.forEach((event) => {
          expect(addSpy).toBeCalledWith(event, listener, options)
        })
      })
    })

    it('should call all listeners with all events', () => {
      events.forEach((event, index) => {
        target.dispatchEvent(new Event(event))
        listeners.forEach(listener => expect(listener).toBeCalledTimes(index + 1))
      })
    })

    it('should remove all listeners with all events', () => {
      expect(removeSpy).not.toBeCalled()

      stop()

      listeners.forEach((listener) => {
        events.forEach((event) => {
          expect(removeSpy).toBeCalledWith(event, listener, options)
        })
      })
    })
  })

  describe('target is invalid', () => {
    const target = ref(document.createElement('div'))
    const listener = vi.fn()

    it('should not listen when target is invalid', async () => {
      useEventListener(target, 'click', listener)
      const el = target.value
      target.value = null
      await nextTick()
      el?.dispatchEvent(new MouseEvent('click'))
      await nextTick()

      expect(listener).toHaveBeenCalledTimes(0)
      expect(useEventListener(null, 'click', listener)).toBe(noop)
    })
  })
})
