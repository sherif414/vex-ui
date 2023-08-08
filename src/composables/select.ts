import type { Getter, Signal } from '@/types'
import { watch } from 'vue'

/**
 * handles selection for a list of items.
 *
 * @param selected a ref that holds the selected items.
 * @param multiSelect whether to allow multi-select.
 * @param options options object.
 */
export const useSelect = <T>(
  signal: Signal<T | T[] | undefined>,
  multiSelect: Getter<boolean>,
  DeSelectOnReSelect?: Getter<boolean>
): [Getter<T | T[] | undefined>, (v: T) => void] => {
  const [_getter, _setter] = signal

  const setter = (newVal: T) => {
    const prev = _getter()

    // multi-select
    if (Array.isArray(prev)) {
      _setter(prev.includes(newVal) ? prev.filter((v) => v !== newVal) : [...prev, newVal])
      return
    }

    // single-select
    if (prev !== newVal) {
      _setter(newVal)
      return
    }

    // deselect
    if (DeSelectOnReSelect?.()) {
      _setter(undefined)
    }
  }

  watch(multiSelect, (val) => {
    _setter(val ? [] : undefined)
  })

  return [_getter, setter]
}
