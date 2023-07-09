import type { Ref, InjectionKey } from 'vue'

export { default as Select } from './Select.vue'
export { default as SelectItem } from './SelectItem.vue'
export { default as SelectGroup } from './SelectGroup.vue'

export const SELECT_INJECTION_KEY = Symbol() as InjectionKey<{
  select: (value: string) => void
  selectedItems: Ref<string | string[]>
}>
