export { default as Chip } from './Chip.vue'
export { default as ChipGroup } from './ChipGroup.vue'
import './Chip.scss'
import './ChipGroup.scss'

import type { Getter } from '@/types'
import type { InjectionKey } from 'vue'

export type selected = string | string[] | undefined

export const CHIP_GROUP_CTX = Symbol() as InjectionKey<{
  multiple: Getter<boolean>
  groupName: Getter<string>
  onEmit: (value: string) => void
  selected: Getter<selected>
}>
