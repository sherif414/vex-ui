<script setup lang="ts">
import { isUsingKeyboard, useLayer } from '@/composables'
import { provide, type VNode, useAttrs, h, nextTick } from 'vue'
import { MENU_TRIGGER_CTX, useMenuCtx } from './context'
import { useEventListener } from '@vueuse/core'
import { useKeydownIntent } from '@/composables/keydown'

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

const isMainTrigger = !isSubMenu

//----------------------------------------------------------------------------------------------------
// 📌 visibility
//----------------------------------------------------------------------------------------------------

useKeydownIntent(
  TriggerEl,
  (e, intent) => {
    if (isMainTrigger && (intent === 'next' || intent === 'prev')) {
      e.preventDefault()
      e.stopPropagation()
      setIsMenuOpen(true)
      nextTick(() => ContentEl()?.focus())
      return
    }

    if (intent === 'show') {
      e.preventDefault()
      e.stopPropagation()
      setIsMenuOpen(true)
      nextTick(() => ContentEl()?.focus())
      return
    }
  },
  { orientation }
)

useKeydownIntent(ContentEl, (e, intent) => {
  if (intent === 'hide') {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(false)
    TriggerEl()?.focus()
  }
})

// firefox bug
useEventListener(TriggerEl, 'keyup', (e: KeyboardEvent) => {
  if (e.key === ' ') e.preventDefault()
})

useEventListener(TriggerEl, 'click', (e) => {
  setIsMenuOpen((v) => !v)
  if (!isMenuOpen()) return
  e.preventDefault()
  nextTick(() => ContentEl()?.focus())
})

//----------------------------------------------------------------------------------------------------

provide(MENU_TRIGGER_CTX, {
  isTrigger: true,
})

const Trigger = () => h(slots.default!({})[0])
</script>

<template>
  <Trigger
    v-if="!isMainTrigger || p.asChild"
    :ref="setTriggerEl"
    :class="{ '--open': isMenuOpen() }"
  />
  <button v-else v-bind="attrs" :ref="setTriggerEl" :class="{ '--open': isMenuOpen() }">
    <slot />
  </button>
</template>
