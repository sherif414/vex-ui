import { default as Accordion } from './Accordion.vue'
import { default as AccordionItem } from './AccordionItem.vue'
import './Accordion.scss'
export { Accordion, AccordionItem }

import type { InjectionKey, Ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 context
//----------------------------------------------------------------------------------------------------

export type ExpandedItems = string | string[] | undefined

export interface AccordionContext {
  onUpdateModel: (val: string) => void
  expandedItems: Ref<ExpandedItems>
  getIndex: () => string
}

export const ACCORDION_CTX = Symbol() as InjectionKey<AccordionContext>
