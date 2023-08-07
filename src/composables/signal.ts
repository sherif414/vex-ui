import type { Signal } from '@/types'
import { shallowRef } from 'vue'
import { isFunction } from './helpers'

export function useSignal<T>(value: T): Signal<T> {
  const r = shallowRef(value)

  return [
    function get() {
      return r.value
    },
    function set(v) {
      r.value = isFunction(v) ? v(r.value) : v
    },
  ]
}
