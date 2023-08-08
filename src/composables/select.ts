import type { Get, ComputedGet, Signal } from '@/types'
import { watch } from 'vue'

interface UseSelectOptions {
  multiSelect?: Get<boolean>
  deSelectOnReSelect?: Get<boolean>
}

/**
 * handles multi and single select for a list of items.
 */
export const useSelect = <T>(
  signal: Signal<T | T[] | undefined>,
  options: UseSelectOptions = {}
): [ComputedGet<T | T[] | undefined>, (value: T) => void] => {
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
    if (options.deSelectOnReSelect?.()) {
      _setter(undefined)
    }
  }

  if (options.multiSelect) {
    watch(options.multiSelect, (val) => {
      _setter(val ? [] : undefined)
    })
  }

  return [_getter, setter]
}
