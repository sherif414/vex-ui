<script setup lang="ts">
import { useCollection } from '@/composables'
import { useAccordionItemCtx } from './AccordionItem.vue'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

const { setExpanded, contentID, isExpanded, triggerID, disabled } =
  useAccordionItemCtx('AccordionTrigger')

const TriggerEl = ref<HTMLElement | null>(null)
useCollection({ id: triggerID, disabled, ref: TriggerEl })
</script>

<template>
  <h3 class="vex-accordion-trigger">
    <button
      ref="TriggerEl"
      :aria-expanded="isExpanded"
      :aria-controls="contentID"
      :disabled="disabled()"
      :id="triggerID"
      @click="setExpanded(triggerID)"
      class="vex-accordion-trigger-button"
    >
      <slot />
      <PlusIcon class="vex-accordion-trigger-button-chevron" />
    </button>
  </h3>
</template>
