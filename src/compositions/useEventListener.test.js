import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, isVue2, nextTick, ref } from 'vue'
import { useEventListener } from './useEventListener'
import { noop } from '@/helper'

describe('useEventListener', () => {
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
    // mock listener function
    const listener = vi.fn()
    const event = 'click'

    beforeEach(() => {
      listener.mockReset()
      stop = useEventListener(target, event, listener, options)
    })

    it('should add listener', () => {
      // 因為 beforeEach 有執行一次 useEventListener，所以 target 的 addEventListener 被執行一次
      expect(addSpy).toBeCalledTimes(1)
    })

    it('should trigger listener', () => {
      expect(listener).not.toBeCalled()
      target.dispatchEvent(new MouseEvent('click'))
      // target 觸發 click event 後，listener 被執行一次
      expect(listener).toBeCalledTimes(1)
    })

    it('should remove listener', () => {
      expect(removeSpy).not.toBeCalled()
      stop()
      // 執行 useEventListener  return 的 stop function，target 的 removeEventListener 被執行一次
      expect(removeSpy).toBeCalledTimes(1)
      // 檢查 target 的 removeEventListener 被執行的時候，參數是否跟之前 addEventListener 的參數一樣
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
        // target 監聽的事件被觸發的時候，參數傳入的每一個 listener 都應該要被執行到
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

  describe('multiple events', () => {
    let target
    let listener

    beforeEach(() => {
      target = ref(document.createElement('div'))
      listener = vi.fn()
    })

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

    function getTargetName(useTarget) {
      return useTarget ? 'element' : 'window'
    }

    function getArgs(useTarget) {
      return (useTarget ? [target, 'click', listener] : ['click', listener])
    }

    function trigger(useTarget) {
      (useTarget ? target.value : window).dispatchEvent(new MouseEvent('click'))
    }

    function testTarget(useTarget) {
      it(`should ${getTargetName(useTarget)} listen event`, async () => {
        useEventListener(...getArgs(useTarget))

        trigger(useTarget)

        await nextTick()

        expect(listener).toHaveBeenCalledTimes(1)
      })

      it(`should ${getTargetName(useTarget)} manually stop listening event`, async () => {
        const stop = useEventListener(...getArgs(useTarget))

        stop()

        trigger(useTarget)

        await nextTick()

        // 測試手動執行 stop() 後觸發的事件，listener 不能被執行
        expect(listener).toHaveBeenCalledTimes(0)
      })

      it(`should ${getTargetName(useTarget)} auto stop listening event`, async () => {
        const scope = effectScope()
        await scope.run(async () => {
          useEventListener(...getArgs(useTarget))
        })

        await scope.stop()

        trigger(useTarget)

        await nextTick()

        expect(listener).toHaveBeenCalledTimes(isVue2 ? 1 : 0)
      })
    }

    testTarget(false) // 不傳 target，target 預設必須是 window
    testTarget(true) // target 是 div element
  })

  it.skipIf(isVue2)('should auto re-register', async () => {
    const target = ref()
    const listener = vi.fn()
    const options = ref(false)
    useEventListener(target, 'click', listener, options)

    const el = document.createElement('div')
    const addSpy = vi.spyOn(el, 'addEventListener')
    const removeSpy = vi.spyOn(el, 'removeEventListener')
    target.value = el
    await nextTick()
    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenLastCalledWith('click', listener, false)
    expect(removeSpy).toHaveBeenCalledTimes(0)

    options.value = true
    await nextTick()
    expect(addSpy).toHaveBeenCalledTimes(2)
    expect(addSpy).toHaveBeenLastCalledWith('click', listener, true)
    expect(removeSpy).toHaveBeenCalledTimes(1)
  })
})
