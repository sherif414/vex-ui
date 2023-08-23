<script setup lang="ts">
import {
  createCollection,
  useListSelection,
  useRovingFocus,
  useSelect,
  useTemplateRef,
  useVModel,
} from '@/composables'
import { computed, provide } from 'vue'
import { LIST_CTX } from './context'
import type { Orientation } from '@/types'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the selected item/items
     */
    modelValue?: string | string[]

    /**
     * whether to allow multi-items selection
     */
    multiselect?: boolean

    /**
     * whether deselect is allowed when not using `multiselect`
     */
    deselection?: boolean

    /**
     * mainly used for keyboard navigation
     * @defaultValue 'vertical'
     */
    orientation?: Orientation

    /**
     *  allows controlling entry focus behavior, defaults to focusing the first list element in DOM order.
     * @param e focus event.
     * @param items the list items.
     * @param focusFirst focuses the first focusable element in a list (skips disabled elements).
     */
    onEntryFocus?: (
      e: FocusEvent,
      items: HTMLElement[],
      focusFirst: (items: HTMLElement[]) => void
    ) => void
  }>(),
  {
    orientation: 'vertical',
  }
)

defineEmits<{
  (e: 'update:modelValue', value: typeof p.modelValue): void
}>()

//----------------------------------------------------------------------------------------------------

const [getListEl, setListEl] = useTemplateRef('List')
const { elements } = createCollection(getListEl)

const selected = useSelect(
  useVModel(() => p.modelValue),
  {
    deselection: () => p.deselection,
    multiselect: () => p.multiselect,
  }
)

useRovingFocus(getListEl, elements, {
  orientation: () => p.orientation,
  onEntryFocus(e, focusFirst) {
    p.onEntryFocus?.(e, elements(), focusFirst)
  },
})

provide(LIST_CTX, {
  selected,
})
</script>

<template>
  <ul :ref="setListEl" tabindex="0" class="vex-list" :aria-multiselectable="p.multiselect">
    <slot />
  </ul>
</template>
