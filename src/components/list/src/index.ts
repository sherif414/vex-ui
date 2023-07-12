import type { InjectionKey, Ref } from 'vue'

export { default as List } from './List.vue'
export { default as ListItem } from './ListItem.vue'

export const LIST_INJECTION_KEY = Symbol() as InjectionKey<{
  select: (value: string) => void
  selectedItems: Ref<string | string[]>
}>
