import type { Getter } from '@/types'
import { getCurrentInstance } from 'vue'
import { useComputed } from './computed'

export function useVModel<T>(prop: Getter<T>, eventName: string = 'update:modelValue') {
  const vm = getCurrentInstance()
  const emit = vm?.emit || (vm as any)?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy)

  return useComputed({
    get: prop,
    set: (newValue) => emit(eventName, newValue),
  })
}
