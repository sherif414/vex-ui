<script setup lang="ts">
import { provide } from 'vue'
import { type Selected, CHIP_GROUP_CTX } from './context'
import { useRovingFocus, createSelectScope, useTemplateRef, useVModel } from '@/composables'
import type { Orientation } from '@/types'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether to allow multiple chips to be checked at the same time
     */
    multiselect?: boolean

    /**
     * specifies the currently checked chips, this should be a string array if
     * `multiselect` prop is set to true, and a string otherwise.
     */
    modelValue?: Selected

    /**
     * whether to allow deselecting chips when `multiselect` is false
     */
    deselection?: boolean

    /**
     * mainly used for keyboard navigation
     */
    orientation?: Orientation
  }>(),
  {
    orientation: 'horizontal',
  }
)

defineEmits<{
  (event: 'update:modelValue', value?: Selected): void
}>()

defineSlots<{
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const [getGroupEl, setGroupEl] = useTemplateRef('ChipGroup')

const selected = useSelect(
  useVModel(() => p.modelValue),
  {
    deselection: () => p.deselection,
    multiselect: () => p.multiselect,
  }
)

useRovingFocus(
  getGroupEl,
  () => Array.from(getGroupEl()?.querySelectorAll<HTMLElement>('.vex-chip') ?? []),
  {
    orientation: () => p.orientation,
  }
)

provide(CHIP_GROUP_CTX, {
  selected,
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    ;(e.target as HTMLElement)?.click()
  }
}
</script>

<template>
  <div :ref="setGroupEl" @keydown="onKeydown" tabindex="0" class="vex-chip-group">
    <slot />
  </div>
</template>
