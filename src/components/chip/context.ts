import { useContext } from '@/composables'
import type { ComputableGetter, Getter, Setter, Signal } from '@/types'
import type { InjectionKey } from 'vue'

export type Selected = string | string[] | undefined

export const CHIP_GROUP_CTX = Symbol() as InjectionKey<{
  selected: [ComputableGetter<string | string[] | undefined>, Setter<string>]
}>

export function useChipGroupCtx(component: string) {
  return useContext(CHIP_GROUP_CTX, 'ChipGroup', component)
}
