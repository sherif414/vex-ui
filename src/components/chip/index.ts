export { default as Chip } from './Chip.vue'
export { default as ChipGroup } from './ChipGroup.vue'
import './Chip.scss'
import './ChipGroup.scss'

import type { ComputableGetter } from '@/types'
import type { InjectionKey } from 'vue'

export type selected = string | string[] | undefined

export const CHIP_GROUP_CTX = Symbol() as InjectionKey<{
  multiple: ComputableGetter<boolean>
  groupName: ComputableGetter<string>
  onEmit: (value: string) => void
  selected: ComputableGetter<selected>
}>
