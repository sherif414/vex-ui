<script setup lang="ts">
import { useListNavigation, useListSelection } from '@/composables'
import { computed, provide } from 'vue'
import { LIST_CTX } from '.'

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
    multiple?: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof p.modelValue): void
}>()

//----------------------------------------------------------------------------------------------------
// 📌 items selection
//----------------------------------------------------------------------------------------------------

const selected = computed<typeof p.modelValue>({
  get: () => p.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// reset invalid modelValues
if (p.multiple && !Array.isArray(selected.value)) selected.value = []
if (!p.multiple && Array.isArray(selected.value)) selected.value = undefined

const { setSelected } = useListSelection(selected, () => p.multiple)
provide(LIST_CTX, {
  setSelected,
  selected,
})

//----------------------------------------------------------------------------------------------------
// 📌 focus & keyboard interactions
//----------------------------------------------------------------------------------------------------

const childrenSelector = '.vex-list-item:not([inert])'
const { onKeydown } = useListNavigation(childrenSelector, true)

function onFocus(e: Event) {
  // ;(e.currentTarget as HTMLElement).querySelector<HTMLElement>(childrenSelector)?.focus()
}
</script>

<template>
  <ul
    tabindex="-1"
    class="vex-list"
    @keydown="onKeydown"
    @focus="onFocus"
    :aria-multiselectable="p.multiple"
  >
    <slot />
  </ul>
</template>
