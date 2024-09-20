import { describe, expect, it, vi } from 'vitest'
import { useThrottleFn } from './useThrottleFn'
import { promiseTimeout } from '@/utils/shared'

describe('useThrottleFn', () => {
  it('should be defined', () => {
    expect(useThrottleFn).toBeDefined()
  })

  it('should work', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms)
    run()
    run()
    // 連續 run 兩次後，只會觸發一次（預設 trailing 是 false）
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    // 等待一個超過 ms 的時間再次執行，所以會成功觸發
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with trailing', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms, true)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should work with leading', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms, false, false)
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(2)
    await promiseTimeout(ms + 20)
    run()
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
