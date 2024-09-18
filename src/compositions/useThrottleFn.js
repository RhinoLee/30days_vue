import { createFilterWrapper, throttleFilter } from '@/utils/filter'

export function useThrottleFn(fn, ms, trailing = false, leading = true) {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading),
    fn,
  )
}
