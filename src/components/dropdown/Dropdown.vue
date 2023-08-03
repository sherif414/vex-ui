<script lang="ts" setup>
import { useFloating, useID, useDelayedOpen, useComputed } from '@/composables'
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

    /**
     * Specifies the action that opens the dropdown.
     */
    triggerOn?: 'hover' | 'click'

    triggerEl?: HTMLElement | null
  }>(),
  {
    placement: 'bottom-start',
    autoMinWidth: true,
    offset: 4,
    role: 'menu',
    openDelay: 150,
    closeDelay: 150,
    triggerOn: 'click',
    triggerEl: null,
  }
)

const slots = defineSlots<{
  default?: (props: {}) => any
  trigger?: (props: {}) => VNode[]
}>()

//----------------------------------------------------------------------------------------------------

const DROPDOWN_ID = useID()
const TRIGGER_ID = useID()

const role = toRef(() => p.role)

const DropdownEl = ref<HTMLElement | null>(null)
const TriggerSlotEl = ref<HTMLElement | null>(null)
const TriggerEl = useComputed(() => (slots.trigger ? TriggerSlotEl.value : p.triggerEl))

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
      ref: (vm) => (TriggerSlotEl.value = getElementFromRef(vm)),
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

watch(TriggerEl, (el) => {
  if (!el) return
  el.setAttribute('aria-expanded', `${isDropdownOpen.value}`)
  el.setAttribute('aria-haspopup', `${role.value}`)
  el.setAttribute('aria-controls', `${DROPDOWN_ID}`)
  el.setAttribute('id', `${TRIGGER_ID}`)
})

watch(
  [isDropdownOpen, role],
  ([open, role]) => {
    const el = TriggerEl.value
    if (!el) return
    el.setAttribute('aria-haspopup', `${role}`)
    el.setAttribute('aria-expanded', `${open}`)
  },
  { flush: 'post' }
)

//----------------------------------------------------------------------------------------------------
// 📌 open / close
//----------------------------------------------------------------------------------------------------

const { close: closeDropdown, open: openDropdown } = useDelayedOpen({
  open: () => (isDropdownOpen.value = true),
  close: () => (isDropdownOpen.value = false),
  defaultOpenDelay: () => p.openDelay,
  defaultCloseDelay: () => p.closeDelay,
})

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
  <template v-if="slots.trigger">
    <Component :is="TriggerVNode" />
  </template>

  <Transition name="vex-fade">
    <Teleport disabled to="body">
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
