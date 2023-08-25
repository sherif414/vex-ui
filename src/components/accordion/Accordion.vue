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
   * specifies the accordion orientation.
   * @defaultValue 'vertical'
   */
  orientation?: Orientation
}

export interface AccordionContext {
  orientation: Getter<Orientation>
}

export const ACCORDION_CTX = Symbol() as InjectionKey<AccordionContext>
export const useAccordionCtx = (component: string) => {
  return useContext(ACCORDION_CTX, 'Accordion', component)
}
</script>

<script setup lang="ts">
import { createCollection, useRovingFocus, createSelectScope, useContext } from '@/composables'
import { provide, type InjectionKey, ref } from 'vue'

const p = withDefaults(defineProps<AccordionProps>(), {
  variant: 'default',
  orientation: 'vertical',
})

//----------------------------------------------------------------------------------------------------

const AccordionEl = ref<HTMLElement | null>(null)
const { elements } = createCollection(AccordionEl)

useRovingFocus(AccordionEl, elements, {
  orientation: () => p.orientation,
})

createSelectScope(ref(p.multiple ? [] : undefined), {
  multiselect: () => p.multiple,
  deselection: () => true,
})

provide(ACCORDION_CTX, {
  orientation: () => p.orientation,
})
</script>

<template>
  <div ref="AccordionEl" :class="['vex-accordion', `--variant-${p.variant}`]">
    <slot />
  </div>
</template>
