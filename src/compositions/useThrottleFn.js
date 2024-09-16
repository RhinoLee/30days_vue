import { throttleFilter } from '@/utils/filter'

export function useThrottleFn(fn, ms) {
  return throttleFilter(fn, ms)
}
