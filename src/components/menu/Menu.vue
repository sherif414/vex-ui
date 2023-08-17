<script setup lang="ts">
import { useControllableState, useID, useTemplateRef } from '@/composables'
import { inject, provide, shallowReactive, toRef } from 'vue'
import { MENU_CTX } from './context'
import type { Getter } from '@/types'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal'
    open?: boolean
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

const [isMenuOpen, setIsMenuOpen] = useControllableState({
  prop: () => p.open,
  defaultValue: !!p.open,
  name: 'open',
})

//----------------------------------------------------------------------------------------------------

const ctx = inject(MENU_CTX, null)
const isSubMenu = !!ctx
isSubMenu && ctx.submenus.push(ContentEl)

provide(MENU_CTX, {
  isMenuOpen: [isMenuOpen, setIsMenuOpen],
  TriggerEl: [TriggerEl, setTriggerEl],
  ContentEl: [ContentEl, setContentEl],
  TRIGGER_ID,
  CONTENT_ID,
  isSubMenu,
  orientation: () => p.orientation,
  submenus: [],

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
