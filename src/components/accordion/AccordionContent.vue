<script setup lang="ts">
import { useAccordionItemCtx } from './context'
import { TransitionExpand } from '@/transitions'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(defineProps<{}>(), {})

//----------------------------------------------------------------------------------------------------

const { contentID, isExpanded, triggerID } = useAccordionItemCtx('AccordionContent')
</script>

<template>
  <TransitionExpand>
    <div
      v-if="isExpanded()"
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
