import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFilterWrapper, throttleFilter } from '@/utils/filter'

describe('filters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should throttle', () => {
    const throttledFilterSpy = vi.fn()
    const filter = createFilterWrapper(throttleFilter(1000), throttledFilterSpy)
    setTimeout(filter, 500) // 會觸發
    setTimeout(filter, 500)
    setTimeout(filter, 500)
    setTimeout(filter, 500) // 會觸發（trailing）

    vi.runAllTimers()

    expect(throttledFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should throttle evenly', () => {
    const debouncedFilterSpy = vi.fn()

    const filter = createFilterWrapper(throttleFilter(1000), debouncedFilterSpy)

    setTimeout(() => filter(1), 500)
    setTimeout(() => filter(2), 1000)
    setTimeout(() => filter(3), 2000)

    vi.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(3)
    expect(debouncedFilterSpy).toHaveBeenCalledWith(1)
    expect(debouncedFilterSpy).toHaveBeenCalledWith(2)
    expect(debouncedFilterSpy).toHaveBeenCalledWith(3)
  })
})
