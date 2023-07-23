<script setup lang="ts">
import { inject } from 'vue'
import { ACCORDION_ITEM_CTX } from '.'

const ctx = inject(ACCORDION_ITEM_CTX)
if (!ctx) {
  throw new Error('[vex] <AccordionContent> is missing an <AccordionItem> parent component.')
}
const { contentID, triggerID } = ctx
</script>

<template>
  <div
    :id="contentID"
    :aria-labelledby="triggerID"
    class="vex-accordion-item-content"
    role="region"
  >
    <slot />
  </div>
</template>
