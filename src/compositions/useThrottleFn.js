import { createFilterWrapper, throttleFilter } from '@/utils/filter'

export function useThrottleFn(fn, ms, trailing = false, leading = true, rejectOnCancel = false) {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading, rejectOnCancel),
    fn,
  )
}
