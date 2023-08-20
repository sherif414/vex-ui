import type { Getter, ComputableGetter, Signal, Setter } from '@/types'
import { watch } from 'vue'

interface UseSelectOptions {
  multiselect?: Getter<boolean>
  deselection?: Getter<boolean>
}

export type Selected<T> = T | T[] | undefined

/**
 * handles multi and single select for a list of items.
 */
export function useSelect<T>(
  signal: Signal<Selected<T>>,
  options: UseSelectOptions = {}
): [ComputableGetter<Selected<T>>, Setter<T>] {
  const [_getter, _setter] = signal
  const { multiselect = () => false, deselection = () => false } = options

  const setter: Setter<T> = (value) => {
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
    if (deselection()) {
      _setter(undefined)
    }
  }

  // validate the initial value and correct it if needed
  if (multiselect()) {
    !Array.isArray(_getter()) && _setter([])
  } else {
    Array.isArray(_getter()) && _setter(undefined)
  }

  watch(multiselect, (multi) => {
    _setter(multi ? [] : undefined)
  })

  return [_getter, setter]
}
