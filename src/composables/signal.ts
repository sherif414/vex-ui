import type { Signal } from '@/types'
import { shallowRef } from 'vue'
import { isFunction } from './helpers'

export function useSignal<T>(initial: T): Signal<T> {
  const r = shallowRef(initial)

  // make sure to use named function so they show up in devtools
  return [
    function getter(fn) {
      return isFunction(fn) ? fn(r.value) : r.value
    },
    function setter(fn) {
      r.value = isFunction(fn) ? fn(r.value) : fn
    },
  ]
}
