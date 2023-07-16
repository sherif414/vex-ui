import { watch, provide, toRef, reactive } from 'vue'
import type { InjectionKey, Ref, MaybeRefOrGetter } from 'vue'

export type SelectedItems = string | string[] | undefined

export const SELECTION_INJECTION_KEY = Symbol() as InjectionKey<{
  selectedItems: Ref<SelectedItems>
  onSelect: (itemValue: string) => void
  register: (itemValue: string) => void
  unRegister: (itemValue: string) => void
}>

export function useListSelection(selectedItems: Ref<SelectedItems>, multiple: MaybeRefOrGetter) {
  const items = reactive<Set<string>>(new Set())
  const isMultiple = toRef(multiple)

  function onSelect(value: string): void {
    if (Array.isArray(selectedItems.value)) {
      selectedItems.value = selectedItems.value.includes(value)
        ? selectedItems.value.filter((v) => v !== value)
        : [...selectedItems.value, value]
    }
    //
    else if (selectedItems.value !== value) {
      selectedItems.value = value
    }
  }

  watch(isMultiple, (val) => {
    selectedItems.value = val ? [] : undefined
  })

  provide(SELECTION_INJECTION_KEY, {
    onSelect,
    selectedItems: selectedItems,
    register: (itemValue: string) => {
      items.add(itemValue)
    },
    unRegister: (itemValue: string) => {
      items.delete(itemValue)
    },
  })

  return {
    items,
  }
}
