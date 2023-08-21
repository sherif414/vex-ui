import { useContext } from '@/composables'
import type { ComputableGetter, Getter, Orientation, Setter } from '@/types'
import type { InjectionKey } from 'vue'

export type ExpandedItems = string | string[] | undefined

export const ACCORDION_CTX = Symbol() as InjectionKey<{
  expanded: [ComputableGetter<ExpandedItems>, Setter<string>]
  orientation: Getter<Orientation>
}>

export function useAccordionCtx(component: string) {
  return useContext(ACCORDION_CTX, 'Accordion', component)
}

export const ACCORDION_ITEM_CTX = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  isExpanded: Getter<boolean>
  setExpanded: Setter<string>
}>

export function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_CTX, 'AccordionItem', component)
}
