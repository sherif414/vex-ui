<script setup lang="ts">
import { inject, computed, provide } from 'vue'
import { getRandomString } from '@/composables/helpers'
import { ACCORDION_CTX, ACCORDION_ITEM_CTX } from '.'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * expands the item and prevents it from being collapsed
     */
    alwaysExpanded?: boolean

    /**
     * prevents the item from being collapsed/expanded
     */
    disabled?: boolean

    /**
     * the value is used to determine which item is expanded
     */
    value: string
  }>(),
  {}
)

defineSlots<{
  default(props: { isExpanded: boolean }): any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 inject
//----------------------------------------------------------------------------------------------------

const ctx = inject(ACCORDION_CTX, null)

if (!ctx) {
  throw new Error('[vex] <AccordionItem> is missing an <Accordion> parent component.')
}

const { onUpdateModel, expandedItems } = ctx

//----------------------------------------------------------------------------------------------------
// 📌 provide
//----------------------------------------------------------------------------------------------------

const isExpanded = computed<boolean>(() => {
  if (p.alwaysExpanded) return true
  return Array.isArray(expandedItems.value)
    ? expandedItems.value.includes(p.value)
    : expandedItems.value === p.value
})

const contentID = `accordion-item-content-${getRandomString(6)}`
const triggerID = `accordion-item-controls-${getRandomString(6)}`
const isDisabled = computed(() => p.disabled || p.alwaysExpanded)

provide(ACCORDION_ITEM_CTX, {
  contentID,
  triggerID,
  isExpanded,
  isDisabled,
  onToggle: () => onUpdateModel(p.value),
})

const modifierClasses = computed(() => {
  return ['vex-accordion-item', { '--expanded': isExpanded.value }]
})
</script>

<template>
  <div :class="modifierClasses">
    <slot :isExpanded="isExpanded" />
  </div>
</template>
