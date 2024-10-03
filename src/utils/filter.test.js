import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFilterWrapper, debounceFilter, throttleFilter } from '@/utils/filter'

describe('filters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should debounce', () => {
    const debouncedFilterSpy = vi.fn()
    const filter = createFilterWrapper(debounceFilter(1000), debouncedFilterSpy)

    setTimeout(filter, 200)
    vi.runAllTimers()

    setTimeout(filter, 500)
    vi.advanceTimersByTime(500)
    expect(debouncedFilterSpy).toHaveBeenCalledOnce()
  })

  it('should debounce twice', () => {
    const debouncedFilterSpy = vi.fn()
    const filter = createFilterWrapper(debounceFilter(500), debouncedFilterSpy)

    setTimeout(filter, 500)
    vi.advanceTimersByTime(500)
    setTimeout(filter, 1000)
    vi.advanceTimersByTime(2000)

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(2)
  })

  it('should resolve & reject debounced fn', async () => {
    const debouncedSum = createFilterWrapper(
      debounceFilter(500, { rejectOnCancel: true }),
      (a, b) => a + b,
    )

    const five = debouncedSum(2, 3)
    let nine
    setTimeout(() => {
      nine = debouncedSum(4, 5)
    }, 200)

    vi.runAllTimers()

    await expect(five).rejects.toBeUndefined()
    await expect(nine).resolves.toBe(9)
  })

  it('should debounce with ref', () => {
    const debouncedFilterSpy = vi.fn()
    const debounceTime = ref(0)
    const filter = createFilterWrapper(debounceFilter(debounceTime), debouncedFilterSpy)

    filter()
    debounceTime.value = 500
    filter()
    setTimeout(filter, 200)

    vi.runAllTimers()

    expect(debouncedFilterSpy).toHaveBeenCalledTimes(2)
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
