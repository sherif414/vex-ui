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
    // single-select
    if (!Array.isArray(selectedItems.value)) {
      if (selectedItems.value === value) return
      selectedItems.value = value
    }
    // multi-select
    else {
      if (selectedItems.value.includes(value)) {
        selectedItems.value = selectedItems.value.filter((v) => v !== value)
      } else {
        selectedItems.value = [...selectedItems.value, value]
      }
    }
  }

  watch(
    isMultiple,
    (val) => {
      selectedItems.value = val ? [] : undefined
    },
    { immediate: true }
  )

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
}
