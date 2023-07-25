<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useListNavigation, useListSelection } from '@/composables'
import { ACCORDION_CTX, type ExpandedItems } from '.'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether to allow multiple accordion-items to be expanded at the same time
     */
    multiple?: boolean

    /**
     * specifies the accordion variant, which changes how the accordion looks
     * @default 'default'
     */
    variant?: 'outline' | 'ladder' | 'default' | 'light'
  }>(),
  {
    variant: 'default',
  }
)

//----------------------------------------------------------------------------------------------------

const CHILDREN_SELECTOR = '.vex-accordion-item-trigger-button:enabled'
const { onKeydown } = useListNavigation(CHILDREN_SELECTOR, true)

const expandedItems = ref<ExpandedItems>()
const { setSelected: setExpanded } = useListSelection(expandedItems, () => p.multiple, {
  DeSelectOnReSelect: true,
})

let count = 0
provide(ACCORDION_CTX, {
  setExpanded: setExpanded,
  expandedItems,
  getIndex: () => `item:${count++}`,
})

const modifierClasses = computed(() => ['vex-accordion', `--variant-${p.variant}`])
</script>

<template>
  <div :class="modifierClasses" @keydown="onKeydown">
    <slot />
  </div>
</template>
