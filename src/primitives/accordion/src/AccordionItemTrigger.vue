<script setup lang="ts">
import { inject } from 'vue'
import { ACCORDION_ITEM_CTX } from '.'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the heading level
     * @default 'h3'
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }>(),
  {
    as: 'h3',
  }
)

//----------------------------------------------------------------------------------------------------

const ctx = inject(ACCORDION_ITEM_CTX, null)
if (!ctx) {
  throw new Error('[vex] <AccordionItem> is missing an <Accordion> parent component.')
}
const { contentID, triggerID, isExpanded, isDisabled, onToggle } = ctx
</script>

<template>
  <Component :is="p.as" class="vex-accordion-item-trigger">
    <button
      type="button"
      class="vex-accordion-item-trigger-button"
      @click="onToggle"
      :aria-expanded="isExpanded"
      :aria-disabled="isDisabled"
      :disabled="isDisabled"
      :aria-controls="contentID"
      :id="triggerID"
    >
      <slot />
    </button>
  </Component>
</template>
