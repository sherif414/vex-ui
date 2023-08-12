<script setup lang="ts">
import { usePointerOpen, useKeyboardOpen, useClickOpen } from '@/composables'
import { watch, provide, cloneVNode, type VNode, useAttrs } from 'vue'
import { MENU_TRIGGER_CTX, useMenuCtx } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = defineProps<{
  asChild?: boolean
}>()

const slots = defineSlots<{
  default: (props: {}) => VNode[]
}>()

const attrs = useAttrs()

//----------------------------------------------------------------------------------------------------

const {
  TriggerEl: [TriggerEl, setTriggerEl],
  isMenuOpen: [isMenuOpen, setIsMenuOpen],
  ContentEl: [ContentEl],
  orientation,
  isSubMenu,
} = useMenuCtx('MenuTrigger')

isSubMenu && usePointerOpen(TriggerEl, ContentEl, setIsMenuOpen)
useKeyboardOpen(TriggerEl, ContentEl, setIsMenuOpen, { isMainTrigger: !isSubMenu, orientation })
useClickOpen(TriggerEl, ContentEl, [isMenuOpen, setIsMenuOpen])

provide(MENU_TRIGGER_CTX, {
  isTrigger: true,
})

const Trigger = () => cloneVNode(slots.default!({})[0], { ref: setTriggerEl }, true)
</script>

<template>
  <Trigger v-if="isSubMenu || p.asChild" :class="{ '--menu-open': isMenuOpen() }" />
  <button v-else v-bind="attrs" :ref="setTriggerEl">
    <slot />
  </button>
</template>
