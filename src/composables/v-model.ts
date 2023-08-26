import type { Getter } from '@/types'
import { getCurrentInstance, computed } from 'vue'

export function useVModel<T>(prop: Getter<T>, eventName: string = 'update:modelValue') {
  const vm = getCurrentInstance()
  const emit = vm?.emit || (vm as any)?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy)

  return computed({
    get: prop,
    set: (newValue) => emit(eventName, newValue),
  })
}
