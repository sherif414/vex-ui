<script lang="ts">
import { type InjectionKey } from 'vue'
import { useContext } from '@/composables'
import type { Getter, Setter } from '@/types'

export interface AccordionItemProps {
  /**
   * expands the item and prevents it from being collapsed
   */
  alwaysExpanded?: boolean

  /**
   * expands the item on the first render
   */
  initiallyExpanded?: boolean

  /**
   * prevents the item from being collapsed/expanded
   */
  disabled?: boolean
}

export const ACCORDION_ITEM_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  disabled: Getter<boolean>
  isExpanded: Ref<boolean>
  setExpanded: Setter<string>
}>

export function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_INJECTION_KEY, 'AccordionItem', component)
}
</script>

//----------------------------------------------------------------------------------------------------

<script setup lang="ts">
import { useID, useSelectScope } from '@/composables'
import { provide, type Ref, computed } from 'vue'
import { useAccordionCtx } from './Accordion.vue'

const p = withDefaults(defineProps<AccordionItemProps>(), {})

const {} = useAccordionCtx('AccordionItem')

const contentID = useID()
const triggerID = useID()

const { setSelected: setExpanded, isSelected } = useSelectScope(() => triggerID)

if (p.initiallyExpanded) {
  setExpanded(triggerID)
}

const isExpanded = computed<boolean>(() => p.alwaysExpanded || isSelected.value)

provide(ACCORDION_ITEM_INJECTION_KEY, {
  contentID,
  triggerID,
  setExpanded,
  isExpanded,
  disabled: () => p.disabled,
})

defineExpose({
  isExpanded,
})
</script>

<template>
  <div :class="['vex-accordion-item', { '--expanded': isExpanded }]">
    <slot :isExpanded="isExpanded" />
  </div>
</template>
