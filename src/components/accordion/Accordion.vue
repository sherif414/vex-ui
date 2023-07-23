<script setup lang="ts">
import { computed, provide } from 'vue'
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
     * specifies the current active accordion-items.
     */
    modelValue?: ExpandedItems
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value?: ExpandedItems]
}>()

//----------------------------------------------------------------------------------------------------

const CHILDREN_SELECTOR = '.vex-accordion-item-trigger-button:enabled'
const { onKeydown } = useListNavigation(CHILDREN_SELECTOR, true)

const expandedItems = computed<ExpandedItems>({
  get: () => p.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const { onUpdateModel } = useListSelection(expandedItems, () => p.multiple, true)

provide(ACCORDION_CTX, {
  onUpdateModel,
  expandedItems,
})
</script>

<template>
  <div class="vex-accordion" @keydown="onKeydown">
    <slot />
  </div>
</template>
