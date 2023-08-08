import type { Getter, ComputedGet, Signal, Setter } from '@/types'
import { watch } from 'vue'

interface UseSelectOptions {
  multiselect?: Getter<boolean>
  deselection?: Getter<boolean>
}

/**
 * handles multi and single select for a list of items.
 */
export const useSelect = <T>(
  signal: Signal<T | T[] | undefined>,
  options: UseSelectOptions = {}
): [ComputedGet<T | T[] | undefined>, Setter<T>] => {
  const [_getter, _setter] = signal

  const setter = (value: T) => {
    const prev = _getter()

    // multi-select
    if (Array.isArray(prev)) {
      _setter(prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value])
      return
    }

    // single-select
    if (prev !== value) {
      _setter(value)
      return
    }

    // deselect
    if (options.deselection?.()) {
      _setter(undefined)
    }
  }

  if (options.multiselect) {
    watch(options.multiselect, (val) => {
      _setter(val ? [] : undefined)
    })
  }

  return [_getter, setter]
}
