<script setup lang="ts">
import { createCollection, useDropdownAria, useFloating, useRovingFocus } from '@/composables'
import { type Placement } from '@floating-ui/vue'
import { provide } from 'vue'
import { MENU_CONTENT_CTX, useMenuCtx } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    placement?: Placement
    noAutoMinWidth?: boolean
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------

const {
  isMenuOpen: [isMenuOpen, setIsMenuOpen],
  TriggerEl: [TriggerEl],
  ContentEl: [ContentEl, setContentEl],
  TRIGGER_ID,
  CONTENT_ID,
  isSubMenu,
  orientation,
} = useMenuCtx('MenuContent')

const [getItems, useMenuCollection] = createCollection(ContentEl)

//----------------------------------------------------------------------------------------------------
// 📌
//----------------------------------------------------------------------------------------------------

useRovingFocus(ContentEl, getItems, {
  orientation,
})

useDropdownAria(TriggerEl, ContentEl, {
  ariaExpanded: isMenuOpen,
  dropdownID: CONTENT_ID,
  targetElID: TRIGGER_ID,
  role: 'menu',
  ariaActiveDescendant: () => `${CONTENT_ID}-${'TODO-not-implemented'}`,
})

const { floatingStyles } = useFloating(TriggerEl, ContentEl, isMenuOpen, {
  placement: () => (p.placement ?? isSubMenu ? 'right-start' : 'bottom-start'),
  autoMinWidth: () => !p.noAutoMinWidth,
  strategy: 'absolute',
  offset: isSubMenu ? -1 : undefined,
})

// re-provide menu context so it won't conflict with a submenu context
provide(MENU_CONTENT_CTX, {
  isMenuOpen,
  CONTENT_ID,
  useMenuCollection,
})
</script>

<template>
  <Teleport :disabled="isSubMenu" to="body">
    <Transition name="vex-t-menu">
      <div
        v-if="isMenuOpen()"
        v-bind="$attrs"
        :aria-orientation="orientation()"
        :style="floatingStyles"
        :ref="setContentEl"
        :class="['vex-menu-content', !p.noAutoMinWidth && '--auto-min-width']"
        tabindex="-1"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
