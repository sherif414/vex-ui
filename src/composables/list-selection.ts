import type { RefOrGetter } from '@/types'
import { watch, reactive } from 'vue'
import type { Ref } from 'vue'

export type SelectedItems = string | string[] | undefined

export function useListSelection(
  selectedItems: Ref<SelectedItems>,
  multiple: RefOrGetter<boolean>,
  DeSelectOnReSelect?: boolean
) {
  const items = reactive<Set<string>>(new Set())

  function setSelected(value: string): void {
    if (Array.isArray(selectedItems.value)) {
      selectedItems.value = selectedItems.value.includes(value)
        ? selectedItems.value.filter((v) => v !== value)
        : [...selectedItems.value, value]
    }
    //
    else if (selectedItems.value !== value) {
      selectedItems.value = value
    }
    //
    else if (DeSelectOnReSelect) {
      selectedItems.value = undefined
    }
  }

  watch(multiple, (val) => {
    selectedItems.value = val ? [] : undefined
  })

  return {
    items,
    setSelected,
    selected: selectedItems,
  }
}
