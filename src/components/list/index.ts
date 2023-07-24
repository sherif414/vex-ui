import type { InjectionKey, Ref } from 'vue'

export { default as List } from './List.vue'
export { default as ListItem } from './ListItem.vue'

export const LIST_CTX = Symbol() as InjectionKey<{
  setSelected: (value: string) => void
  selected: Ref<string | string[] | undefined>
}>
