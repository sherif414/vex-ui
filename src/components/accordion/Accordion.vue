<script setup lang="ts">
import {
  useTemplateRef,
  createCollection,
  useRovingFocus,
  useSelect,
  useSignal,
} from '@/composables'
import type { Orientation } from '@/types'
import { provide } from 'vue'
import { ACCORDION_CTX, type ExpandedItems } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether to allow multiple accordion-items to be expanded at the same time
     */
    multiple: boolean
    /**
     * specifies the accordion variant.
     * @defaultValue 'default'
     */
    variant: 'outline' | 'ladder' | 'default' | 'light'
    /**
     * sets the accordion orientation, mainly used for keyboard navigation.
     * @defaultValue 'vertical'
     */
    orientation: Orientation
  }>(),
  {
    variant: 'default',
    orientation: 'vertical',
  }
)

//----------------------------------------------------------------------------------------------------

const [getAccordionEl, setAccordionEl] = useTemplateRef('Accordion')
const { elements } = createCollection(getAccordionEl)

useRovingFocus(getAccordionEl, elements, {
  orientation: () => p.orientation,
})

const expanded = useSelect(useSignal<ExpandedItems>(undefined), {
  multiselect: () => p.multiple,
  deselection: () => true,
})

provide(ACCORDION_CTX, {
  expanded,
  orientation: () => p.orientation,
})
</script>

<template>
  <div :ref="setAccordionEl" :class="['vex-accordion', `--variant-${p.variant}`]">
    <slot />
  </div>
</template>
