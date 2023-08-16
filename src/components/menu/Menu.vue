<script setup lang="ts">
import { useID, useSignal, useTemplateRef } from '@/composables'
import { inject, provide, toRef } from 'vue'
import { MENU_CTX, type Selected } from './context'
import type { Getter } from '@/types'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    orientation: 'vertical',
  }
)

defineSlots<{
  default: (props: { open: boolean }) => any
}>()

//----------------------------------------------------------------------------------------------------

const TRIGGER_ID = useID()
const CONTENT_ID = useID()

const [TriggerEl, setTriggerEl] = useTemplateRef('MenuTrigger')
const [ContentEl, setContentEl] = useTemplateRef('MenuContent')

const [isMenuOpen, setIsMenuOpen] = useSignal(false)

//----------------------------------------------------------------------------------------------------

const ctx = inject(MENU_CTX, null)
const isSubMenu = !!ctx

provide(MENU_CTX, {
  isMenuOpen: [isMenuOpen, setIsMenuOpen],
  TriggerEl: [TriggerEl, setTriggerEl],
  ContentEl: [ContentEl, setContentEl],
  TRIGGER_ID,
  CONTENT_ID,
  isSubMenu,
  orientation: () => p.orientation,

  focusParentContent() {
    const el = ctx?.ContentEl[0]()
    el?.focus()
  },
})

const open = toRef(isMenuOpen as Getter<boolean>)

defineExpose({
  open,
})
</script>

<template>
  <slot :open="open" />
</template>
