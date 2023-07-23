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

    /**
     * specifies the current active accordion-items.
     */
    modelValue?: ExpandedItems
  }>(),
  {
    variant: 'default',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value?: ExpandedItems]
}>()

//----------------------------------------------------------------------------------------------------

const CHILDREN_SELECTOR = '.vex-accordion-item-trigger-button:enabled'
const { onKeydown } = useListNavigation(CHILDREN_SELECTOR, true)

const expandedItems = ref<ExpandedItems>()
const { onUpdateModel } = useListSelection(expandedItems, () => p.multiple, true)

let count = 0
provide(ACCORDION_CTX, {
  onUpdateModel,
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
