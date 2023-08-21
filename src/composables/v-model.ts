import type { ComputableGetter, ComputableSetter, Getter, Signal } from '@/types'
import { getCurrentInstance } from 'vue'
import { isFunction } from './helpers'

export function useVModel<T>(prop: Getter<T>, event: string = 'update:modelValue'): Signal<T> {
  const vm = getCurrentInstance()

  const getter = <U>(compute?: (v: T) => U) => {
    return compute ? compute(prop()) : prop()
  }
  const setter = (compute: T | ((v: T) => T)) => {
    vm?.emit(event, isFunction(compute) ? compute(prop()) : compute)
  }

  return [getter as ComputableGetter<T>, setter as ComputableSetter<T>]
}
