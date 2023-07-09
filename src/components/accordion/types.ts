import type { Ref } from 'vue'

export type ActiveIndex = number | Set<number> | undefined

export interface AccordionInjectedState {
  activeIndex: Ref<ActiveIndex>
  arrow: Ref<boolean>
  getIndex: () => number
  arrowPosition: Ref<'start' | 'end'>
}
