<script setup lang="ts">
import { useAccordionCtx } from './Accordion.vue'
import { useAccordionItemCtx } from './AccordionItem.vue'
import { TransitionExpand } from '@/transitions'

defineOptions({
  inheritAttrs: false,
})

const { noExpandAnimation } = useAccordionCtx('AccordionContent')
const { contentID, isExpanded, triggerID } = useAccordionItemCtx('AccordionContent')
</script>

<template>
  <TransitionExpand :disabled="noExpandAnimation()">
    <div
      v-if="isExpanded"
      v-bind="$attrs"
      :aria-labelledby="triggerID"
      :id="contentID"
      class="vex-accordion-content"
      role="region"
    >
      <div>
        <slot />
      </div>
    </div>
  </TransitionExpand>
</template>
