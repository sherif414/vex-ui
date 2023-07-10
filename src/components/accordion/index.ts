export { default as Accordion } from './Accordion.vue'
export { default as AccordionItem } from './AccordionItem.vue'
import type { InjectionKey, Ref } from 'vue'
import type { Getter } from '@/types'

export type ActiveIndex = number | Set<number> | undefined

export interface AccordionContext {
  activeIndex: Ref<ActiveIndex>
  isChevron: Getter<boolean>
  arrowPosition: Getter<'start' | 'end'>
  getIndex: () => number
}

export const ACCORDION_INJECTION_KEY = Symbol() as InjectionKey<AccordionContext>
