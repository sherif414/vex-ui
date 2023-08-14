<script setup lang="ts">
import { usePointerOpen, useKeyboardOpen, useClickOpen } from '@/composables'
import { watch, provide, cloneVNode, type VNode, useAttrs, h } from 'vue'
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

useKeyboardOpen(TriggerEl, ContentEl, setIsMenuOpen, { isMainTrigger: !isSubMenu, orientation })
useClickOpen(TriggerEl, ContentEl, [isMenuOpen, setIsMenuOpen])

provide(MENU_TRIGGER_CTX, {
  isTrigger: true,
})

const Trigger = () => h(slots.default!({})[0])
</script>

<template>
  <Trigger :ref="setTriggerEl" v-if="isSubMenu || p.asChild" :class="{ '--open': isMenuOpen() }" />
  <button v-else v-bind="attrs" :ref="setTriggerEl">
    <slot />
  </button>
</template>
