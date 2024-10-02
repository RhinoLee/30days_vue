import { createFilterWrapper, debounceFilter } from '@/utils/filter'

export function useDebounceFn(fn, ms, options) {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn,
  )
}
