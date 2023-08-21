<script setup lang="ts">
import { useTemplateRef, useCollection } from '@/composables'
import { useAccordionItemCtx } from './context'
import { PlusIcon } from '@heroicons/vue/20/solid'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * prevents the item from being collapsed/expanded
     */
    disabled: boolean
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------

const { setExpanded, contentID, isExpanded, triggerID } = useAccordionItemCtx('AccordionTrigger')

const [getTriggerEl, setTriggerEl] = useTemplateRef('AccordionItem')
useCollection({ id: triggerID, disabled: () => p.disabled, ref: getTriggerEl })
</script>

<template>
  <h3 class="vex-accordion-trigger">
    <button
      :ref="setTriggerEl"
      :aria-expanded="isExpanded()"
      :aria-controls="contentID"
      :disabled="p.disabled"
      :id="triggerID"
      @click="setExpanded(triggerID)"
      class="vex-accordion-trigger-button"
    >
      <slot />
      <PlusIcon class="vex-accordion-trigger-button-chevron" />
    </button>
  </h3>
</template>
