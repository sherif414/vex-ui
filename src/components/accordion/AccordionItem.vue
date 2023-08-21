<script setup lang="ts">
import { useID, useMemo } from '@/composables'
import { provide } from 'vue'
import { useAccordionCtx, ACCORDION_ITEM_CTX } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * expands the item and prevents it from being collapsed
     */
    alwaysExpanded: boolean
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------

const {
  expanded: [getExpanded, setExpanded],
} = useAccordionCtx('AccordionItem')

const contentID = useID()
const triggerID = useID()

const isExpanded = useMemo<boolean>(() => {
  if (p.alwaysExpanded) return true
  return getExpanded((v) => (Array.isArray(v) ? v.includes(triggerID) : v === triggerID))
})

provide(ACCORDION_ITEM_CTX, {
  contentID,
  triggerID,
  setExpanded,
  isExpanded,
})
</script>

<template>
  <div :class="['vex-accordion-item', { '--expanded': isExpanded() }]">
    <slot />
  </div>
</template>
