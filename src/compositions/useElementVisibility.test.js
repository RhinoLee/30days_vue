import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useElementVisibility } from '@/compositions/useElementVisibility'

describe('useElementVisibility', () => {
  let el

  beforeEach(() => {
    el = document.createElement('div')
  })

  it('should work when el is not an element', async () => {
    const visible = useElementVisibility(null)
    expect(visible.value).toBeFalsy()
  })

  it('should work when window is undefined', () => {
    const visible = useElementVisibility(el, { window: null })
    expect(visible.value).toBeFalsy()
  })

  it('should work when threshold is undefined', () => {
    const visible = useElementVisibility(el, { threshold: null })
    expect(visible.value).toBeFalsy()
  })

  describe('when internally using useIntersectionObserver', async () => {
    beforeAll(() => {
      vi.resetAllMocks()
      vi.mock('@/compositions/useIntersectionObserver')
    })

    const { useIntersectionObserver } = await import('@/compositions/useIntersectionObserver')

    it('should call useIntersectionObserver internally', () => {
      expect(useIntersectionObserver).toHaveBeenCalledTimes(0)
      useElementVisibility(el)
      expect(useIntersectionObserver).toHaveBeenCalledTimes(1)
    })

    it('passes the given element to useIntersectionObserver', () => {
      useElementVisibility(el)
      expect(useIntersectionObserver.mock.lastCall?.[0]).toBe(el)
    })

    it('passes a callback to useIntersectionObserver that sets visibility to false only when isIntersecting is false', () => {
      const isVisible = useElementVisibility(el)
      const callback = useIntersectionObserver.mock.lastCall?.[1]
      const callMockCallbackWithIsIntersectingValue = isIntersecting => callback?.([{ isIntersecting, time: 1 }], {})

      // It should be false initially
      expect(isVisible.value).toBe(false)

      // It should still be false if the callback doesn't get an isIntersecting = true
      callMockCallbackWithIsIntersectingValue(false)
      expect(isVisible.value).toBe(false)

      // But it should become true if the callback gets an isIntersecting = true
      callMockCallbackWithIsIntersectingValue(true)
      expect(isVisible.value).toBe(true)

      // And it should become false again if isIntersecting = false
      callMockCallbackWithIsIntersectingValue(false)
      expect(isVisible.value).toBe(false)
    })

    it('uses the latest version of isIntersecting when multiple intersection entries are given', () => {
      const isVisible = useElementVisibility(el)
      const callback = vi.mocked(useIntersectionObserver).mock.lastCall?.[1]
      const callMockCallbackWithIsIntersectingValues = (...entries) => {
        callback?.(entries, {})
      }

      // It should be false initially
      expect(isVisible.value).toBe(false)

      // It should take the latest value of isIntersecting
      callMockCallbackWithIsIntersectingValues(
        { isIntersecting: false, time: 1 },
        { isIntersecting: false, time: 2 },
        { isIntersecting: true, time: 3 },
      )
      expect(isVisible.value).toBe(true)

      // It should take the latest even when entries are out of order
      callMockCallbackWithIsIntersectingValues(
        { isIntersecting: true, time: 1 },
        { isIntersecting: false, time: 3 },
        { isIntersecting: true, time: 2 },
      )

      expect(isVisible.value).toBe(false)
    })

    it('passes the given window to useIntersectionObserver', () => {
      const mockWindow = {}

      useElementVisibility(el, { window: mockWindow })
      expect(vi.mocked(useIntersectionObserver).mock.lastCall?.[2]?.window).toBe(mockWindow)
    })

    it('uses the given scrollTarget as the root element in useIntersectionObserver', () => {
      const mockScrollTarget = document.createElement('div')

      useElementVisibility(el, { scrollTarget: mockScrollTarget })
      expect(vi.mocked(useIntersectionObserver).mock.lastCall?.[2]?.root).toBe(mockScrollTarget)
    })
  })
})
