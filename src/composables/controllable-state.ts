import type { Getter, Signal } from '@/types'
import { useSignal } from './signal'
import { useVModel } from './v-model'
import { getCurrentInstance } from 'vue'
import { getKebabCase } from './helpers'

type UseControllableStateParams<T> = {
  prop: Getter<T>
  defaultValue: T
  name?: string
}

export function useControllableState<T>({
  prop,
  defaultValue,
  name = 'modelValue',
}: UseControllableStateParams<T>): Signal<T> {
  const vm = getCurrentInstance()
  const kebabName = getKebabCase(name)
  const isControlled =
    (vm?.vnode.props?.hasOwnProperty(name) || vm?.vnode.props?.hasOwnProperty(kebabName)) &&
    (vm.vnode.props?.hasOwnProperty(`onUpdate:${name}`) ||
      vm.vnode.props?.hasOwnProperty(`onUpdate:${kebabName}`))

  if (isControlled) {
    return useVModel(prop, `update:${name}`)
  }

  return useSignal(defaultValue)
}
