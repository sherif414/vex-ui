<script setup lang="ts">
import { provide, type VNode, h, nextTick } from 'vue'
import { MENU_TRIGGER_CTX, injectMenuContext } from './context'
import { useEventListener } from '@vueuse/core'
import { useKeydownIntent } from '@/composables/keydown'
import { useClickOutside, useComputed, useHoverOpen } from '@/composables'

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

//----------------------------------------------------------------------------------------------------

const {
  TriggerEl: [TriggerEl, setTriggerEl],
  isMenuOpen: [isMenuOpen, setIsMenuOpen],
  ContentEl: [ContentEl],
  orientation,
  isSubMenu,
  submenus,
} = injectMenuContext('MenuTrigger')

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

useEventListener(ContentEl, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(false)
    TriggerEl()?.focus()
  }
})

useClickOutside(
  ContentEl,
  () => {
    setIsMenuOpen(false)
  },
  { ignore: useComputed(() => [TriggerEl, ...submenus.map((v) => v.ContentEl[0])]) }
)

// firefox bug
useEventListener(TriggerEl, 'keyup', (e: KeyboardEvent) => {
  if (e.key === ' ') e.preventDefault()
})

if (isMainTrigger) {
  useEventListener(TriggerEl, 'click', (e) => {
    setIsMenuOpen((v) => !v)
    if (!isMenuOpen()) return
    e.preventDefault()
    nextTick(() => ContentEl()?.focus())
  })
} else {
  useHoverOpen(TriggerEl, ContentEl, setIsMenuOpen)
}

//----------------------------------------------------------------------------------------------------

provide(MENU_TRIGGER_CTX, {
  isTrigger: true,
})

const Trigger = () => h(slots.default!({})[0])
</script>

<template>
  <Component
    :is="!isMainTrigger || p.asChild ? Trigger : 'button'"
    :ref="setTriggerEl"
    :class="['--is-trigger', { '--open': isMenuOpen() }]"
  >
    <slot />
  </Component>
</template>
