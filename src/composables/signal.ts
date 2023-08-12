import type { Signal } from '@/types'
import { shallowRef } from 'vue'
import { isFunction } from './helpers'

export function useSignal<T>(initial: T): Signal<T> {
  const r = shallowRef(initial)

  return [
    function getter<U>(fn?: (v: T) => U): T | U {
      return isFunction(fn) ? fn(r.value) : r.value
    },
    function setter(fn: ((v: T) => T) | T): void {
      r.value = isFunction(fn) ? fn(r.value) : fn
    },
  ]
}
