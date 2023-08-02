<script lang="ts" setup>
import { useFloating, useID, useDelayedOpen } from '@/composables'
import type { Placement, Strategy } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import type { ComponentPublicInstance, VNode, VNodeTypes } from 'vue'
import { cloneVNode, Comment, computed, Fragment, nextTick, ref, Text, toRef, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * The dropdown aria role.
     * @default 'menu'
     */
    role?: 'menu' | 'listbox'

    /**
     * Whether to disable visibility.
     */
    disabled?: boolean

    /**
     * Sets the min-width of the Dropdown to the width of the Trigger element.
     */
    autoMinWidth?: boolean

    /**
     * Controls the dropdown's placement direction.
     * @defaultValue 'bottom-start'
     */
    placement?: Placement

    /**
     * Controls the dropdown's display strategy.
     */
    strategy?: Strategy

    /**
     * The distance between the dropdown and the trigger.
     * @defaultValue 4
     */
    offset?: number

    /**
     * The time before the dropdown opens/closes
     * @defaultValue 150
     */

    openDelay?: number
    /**
     * The time before the dropdown opens/closes
     * @defaultValue 150
     */
    closeDelay?: number

    triggerOn?: 'hover' | 'click'
  }>(),
  {
    placement: 'bottom-start',
    autoMinWidth: true,
    offset: 4,
    role: 'menu',
    openDelay: 150,
    closeDelay: 150,
    triggerOn: 'click',
  }
)

const slots = defineSlots<{
  default?: (props: {}) => any
  trigger?: (props: {}) => VNode[]
}>()

//----------------------------------------------------------------------------------------------------

const role = toRef(() => p.role)
const DROPDOWN_ID = useID()
const TRIGGER_ID = useID()

const __isOpen = ref(false)
const isDropdownOpen = computed<boolean>({
  get: () => __isOpen.value && !p.disabled,
  set: (val) => {
    if (val !== __isOpen.value) __isOpen.value = val
  },
})

//----------------------------------------------------------------------------------------------------
// 📌 Trigger
//----------------------------------------------------------------------------------------------------

const TriggerEl = ref<HTMLElement | null>(null)
const INVALID_VNODE_TYPES: VNodeTypes[] = [Fragment, Comment, Text, 'template']

const TriggerVNode = (): VNode => {
  const vNodes = slots.trigger?.({})
  if (!vNodes || vNodes?.length !== 1 || INVALID_VNODE_TYPES.includes(vNodes[0].type)) {
    throw new Error(
      '[vex] <Dropdown> trigger slot requires exactly a single root child at all times'
    )
  }
  return cloneVNode(
    vNodes[0],
    {
      ref: (vm) => (TriggerEl.value = getElementFromRef(vm)),
      id: TRIGGER_ID,
      'aria-controls': DROPDOWN_ID,
    },
    true
  )
}

function getElementFromRef(vm: ComponentPublicInstance | Element | null): HTMLElement | null {
  if (vm == null) return null
  if (vm instanceof Element) return vm as HTMLElement
  if (vm.$el instanceof Element) return vm.$el as HTMLElement

  throw new Error(`[vex] <Dropdown> trigger slot received a non Element root child`)
}

watch([isDropdownOpen, role, TriggerEl], ([visible, role, el]) => {
  if (!el) return
  el.setAttribute('aria-haspopup', `${role}`)
  el.setAttribute('aria-expanded', `${visible}`)
})

//----------------------------------------------------------------------------------------------------
// 📌 open / close
//----------------------------------------------------------------------------------------------------

const { close: closeDropdown, open: openDropdown } = useDelayedOpen({
  open: () => (isDropdownOpen.value = true),
  close: () => (isDropdownOpen.value = false),
  defaultOpenDelay: () => p.openDelay,
  defaultCloseDelay: () => p.closeDelay,
})

const DropdownEl = ref<HTMLElement | null>(null)

useEventListener(TriggerEl, 'keydown', (e: KeyboardEvent) => {
  if (e.shiftKey || e.altKey || e.ctrlKey) return

  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp', e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    isDropdownOpen.value || openDropdown()
    nextTick(() => DropdownEl.value?.focus({ preventScroll: true }))
  }

  if (e.key === 'Escape') {
    e.preventDefault()
    isDropdownOpen.value && closeDropdown()
    nextTick(() => TriggerEl.value?.focus({ preventScroll: true }))
  }
})

if (p.triggerOn === 'hover') {
  useEventListener(TriggerEl, 'pointerenter', () => openDropdown())
  useEventListener(TriggerEl, 'pointerleave', () => closeDropdown())

  useEventListener(DropdownEl, 'pointerenter', () => openDropdown())
  useEventListener(DropdownEl, 'pointerleave', () => closeDropdown())
}

//----------------------------------------------------------------------------------------------------

const { floatingStyles } = useFloating(TriggerEl, DropdownEl, isDropdownOpen, {
  autoMinWidth: () => p.autoMinWidth,
  placement: () => p.placement,
  strategy: () => p.strategy,
})

defineExpose({
  isDropdownOpen,
  DropdownEl,
})
</script>

<template>
  <Component :is="TriggerVNode" />

  <Transition name="vex-fade">
    <Teleport to="body">
      <div
        ref="DropdownEl"
        v-bind="$attrs"
        v-show.lazy="isDropdownOpen"
        tabindex="-1"
        class="vex-dropdown"
        :id="DROPDOWN_ID"
        :aria-labelledby="TRIGGER_ID"
        :role="role"
        :style="floatingStyles"
      >
        <slot />
      </div>
    </Teleport>
  </Transition>
</template>
