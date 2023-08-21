import type { ComputableGetter, ComputableSetter, Getter, Signal } from '@/types'
import { getCurrentInstance } from 'vue'
import { isFunction } from './helpers'

export function useVModel<T>(prop: Getter<T>, event: string = 'update:modelValue'): Signal<T> {
  const vm = getCurrentInstance()

  const getter = <U>(fn: (v: T) => U) => {
    return isFunction(fn) ? fn(prop()) : prop()
  }
  const setter = (val: T | ((v: T) => T)) => {
    vm?.emit(event, isFunction(val) ? val(prop()) : val)
  }

  return [getter as ComputableGetter<T>, setter as ComputableSetter<T>]
}
