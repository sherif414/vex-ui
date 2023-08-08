import type { Getter, Setter, Signal } from '@/types'
import { getCurrentInstance } from 'vue'
import { isFunction } from './helpers'

export function useVModel<T>(prop: Getter<T>, event: string = 'update:modelValue'): Signal<T> {
  const vm = getCurrentInstance()

  return [
    prop,
    (val: T | ((v: T) => T)) => {
      vm?.emit(event, isFunction(val) ? val(prop()) : val)
    },
  ]
}
