<script lang="ts">
import type { Getter, Orientation } from '@/types'

export interface AccordionProps {
  /**
   * whether to allow multiple accordion-items to be expanded at the same time
   */
  multiple?: boolean

  /**
   * specifies the accordion variant.
   * @defaultValue 'default'
   */
  variant?: 'outline' | 'ladder' | 'default' | 'light'

  /**
   * whether to show expand animation
   */
  noExpandAnimation?: boolean

  /**
   * specifies the accordion chevron position
   */
  chevronPosition?: 'start' | 'end'
}

export interface AccordionContext {
  noExpandAnimation: Getter<boolean>
  chevronPosition: Getter<'start' | 'end'>
}

export const ACCORDION_CTX = Symbol() as InjectionKey<AccordionContext>
export const useAccordionCtx = (component: string) => {
  return useContext(ACCORDION_CTX, 'Accordion', component)
}
</script>

<script setup lang="ts">
import { createSelectScope, useContext } from '@/composables'
import { provide, type InjectionKey, ref } from 'vue'

const p = withDefaults(defineProps<AccordionProps>(), {
  variant: 'default',
  chevronPosition: 'end',
})

//----------------------------------------------------------------------------------------------------

const AccordionEl = ref<HTMLElement | null>(null)

createSelectScope(ref(p.multiple ? [] : undefined), {
  multiselect: () => p.multiple,
  deselection: () => true,
})

provide(ACCORDION_CTX, {
  noExpandAnimation: () => p.noExpandAnimation,
  chevronPosition: () => p.chevronPosition,
})
</script>

<template>
  <div ref="AccordionEl" :class="['vex-accordion', `--variant-${p.variant}`]">
    <slot />
  </div>
</template>
