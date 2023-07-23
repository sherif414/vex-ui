import { default as Accordion } from './Accordion.vue'
import { default as AccordionItem } from './AccordionItem.vue'
import { default as AccordionItemContent } from './AccordionItemContent.vue'
import { default as AccordionItemTrigger } from './AccordionItemTrigger.vue'
export { Accordion, AccordionItem, AccordionItemContent, AccordionItemTrigger }

import type { InjectionKey, Ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 context
//----------------------------------------------------------------------------------------------------

export type ExpandedItems = string | string[] | undefined

export interface AccordionContext {
  onUpdateModel: (val: string) => void
  expandedItems: Ref<ExpandedItems>
}

export interface AccordionItemContext {
  isExpanded: Ref<boolean>
  isDisabled: Ref<boolean>
  contentID: string
  triggerID: string
  onToggle: () => void
}

export const ACCORDION_CTX = Symbol() as InjectionKey<AccordionContext>
export const ACCORDION_ITEM_CTX = Symbol() as InjectionKey<AccordionItemContext>
