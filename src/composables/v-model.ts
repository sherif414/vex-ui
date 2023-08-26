import type { Getter } from '@/types'
import { getCurrentInstance } from 'vue'
import { useComputed } from './computed'

export function useVModel<T>(prop: Getter<T>, eventName: string = 'update:modelValue') {
  const vm = getCurrentInstance()

  return useComputed({
    get: prop,
    set: (newValue) => vm?.emit(eventName, newValue),
  })
}
