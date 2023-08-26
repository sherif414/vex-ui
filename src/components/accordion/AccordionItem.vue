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

export const ACCORDION_ITEM_CTX = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  disabled: Getter<boolean>
  isExpanded: Ref<boolean>
  setExpanded: Setter<string>
}>

export function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_CTX, 'AccordionItem', component)
}
</script>

//----------------------------------------------------------------------------------------------------

<script setup lang="ts">
import { useComputed, useID, useSelectScope } from '@/composables'
import { provide, type Ref } from 'vue'
import { useAccordionCtx } from './Accordion.vue'
import { isArray } from '@/composables/helpers'

const p = withDefaults(defineProps<AccordionItemProps>(), {})

const {} = useAccordionCtx('AccordionItem')

const contentID = useID()
const triggerID = useID()

const { selected: expanded, setSelected: setExpanded } = useSelectScope()

if (p.initiallyExpanded) {
  setExpanded(triggerID)
}

const isExpanded = useComputed<boolean>(() => {
  if (p.alwaysExpanded) return true

  const v = expanded.value
  return isArray(v) ? v.includes(triggerID) : v === triggerID
})

provide(ACCORDION_ITEM_CTX, {
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
