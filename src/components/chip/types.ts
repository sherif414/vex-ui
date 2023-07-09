import type { Ref } from 'vue'

export interface ChipGroupContext {
  multiple?: Ref<boolean>
  groupName?: Ref<string>
  handleEmit?: (value: string) => void
  selectedChips?: Ref<SelectedChips>
}

export type SelectedChips = string | string[]
