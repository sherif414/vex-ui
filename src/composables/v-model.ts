import type { Getter } from '@/types'
import { getCurrentInstance, computed } from 'vue'

interface UseVModelOptions<T> {
  setter?: (newValue: T) => T
  eventName?: string
}

export function useVModel<T>(getter: Getter<T>, options: UseVModelOptions<T> = {}) {
  const { eventName = 'update:modelValue', setter } = options
  const vm = getCurrentInstance()
  const emit = vm?.emit || (vm as any)?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy)

  return computed({
    get: getter,
    set: (newValue) => emit(eventName, setter ? setter(newValue) : newValue),
  })
}
