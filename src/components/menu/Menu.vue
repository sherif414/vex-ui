<script setup lang="ts">
import { useID, useSelect, useSignal, useTemplateRef, useVModel } from '@/composables'
import { inject, provide, toRef } from 'vue'
import { MENU_CTX, type Selected } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    modelValue?: Selected
    deselection?: boolean
    multiselect?: boolean
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    orientation: 'vertical',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value?: Selected]
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

defineExpose({
  open: toRef(isMenuOpen),
  selected: toRef(() => p.modelValue),
  multiselect: toRef(() => p.multiselect),
  deselection: toRef(() => p.deselection),
})
</script>

<template>
  <slot />
</template>
