<script setup lang="ts">
import { useCollection } from '@/composables'
import { useAccordionItemCtx } from './AccordionItem.vue'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'
import { useAccordionCtx } from './Accordion.vue'

const { chevronPosition } = useAccordionCtx('AccordionTrigger')
const { setExpanded, contentID, isExpanded, triggerID, disabled } =
  useAccordionItemCtx('AccordionTrigger')

const TriggerEl = ref<HTMLElement | null>(null)
useCollection({ id: triggerID, disabled, ref: TriggerEl })
</script>

<template>
  <h3 class="vex-accordion-trigger">
    <button
      ref="TriggerEl"
      tabindex="-1"
      :aria-expanded="isExpanded"
      :aria-controls="contentID"
      :disabled="disabled()"
      :id="triggerID"
      @click="setExpanded(triggerID)"
      class="vex-accordion-trigger-button"
    >
      <slot v-if="chevronPosition() === 'start'" name="chevron">
        <PlusIcon class="vex-accordion-chevron --position-start" />
      </slot>

      <slot />

      <slot v-if="chevronPosition() === 'end'" name="chevron">
        <PlusIcon class="vex-accordion-chevron --position-end" />
      </slot>
    </button>
  </h3>
</template>
