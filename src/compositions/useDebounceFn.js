import { createFilterWrapper, debounceFilter } from '@/utils/filter'

export function useDebounceFn(fn, ms = 200, options = {}) {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn,
  )
}
