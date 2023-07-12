export { default as Chip } from './Chip.vue'
export { default as ChipGroup } from './ChipGroup.vue'

import type { Getter } from '@/types'
import type { InjectionKey } from 'vue'

export type selected = string | string[] | undefined

export interface ChipGroupContext {
  multiple: Getter<boolean>
  groupName: Getter<string>
  onEmit: (value: string) => void
  selected: Getter<selected>
}

export const CHIP_GROUP_INJECTION_KEY = Symbol() as InjectionKey<ChipGroupContext>
