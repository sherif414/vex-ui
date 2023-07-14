<script lang="ts" setup>
import { getRandomString } from '@/composables/helpers'
import { useFloating, type UseFloatingOptions } from '@/composables'
import type { Placement } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, reactive, shallowReactive, type VNode, type VNodeTypes } from 'vue'
import { Comment, Fragment, Text, cloneVNode, nextTick, ref, watchEffect } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<
    {
      /**
       * floatingEl aria role.
       */
      role?: 'menu' | 'listbox'

      /**
       * whether to disable visibility
       */
      disabled?: boolean
    } & Pick<
      UseFloatingOptions,
      'placement' | 'hideOnClick' | 'autoMinWidth' | 'toggleAction' | 'offset'
    >
  >(),
  {
    toggleAction: 'click',
    placement: 'bottom-start',
    hideOnClick: true,
    autoMinWidth: true,
    offset: 4,
    role: 'menu',
  }
)

const slots = defineSlots<{
  default?: (props: {}) => any
  trigger?: (props: {}) => VNode[]
}>()

//----------------------------------------------------------------------------------------------------

const DROPDOWN_ROLE = p.role
const DROPDOWN_ID = 'vex-dropdown-' + getRandomString(6)
const TRIGGER_ID = 'vex-trigger-' + getRandomString(6)

const _isOpen = ref(false)
const isFloatingElVisible = computed<boolean>({
  get: () => _isOpen.value && !p.disabled,
  set: (val) => (_isOpen.value = val),
})

//----------------------------------------------------------------------------------------------------
// 📌 Trigger
//----------------------------------------------------------------------------------------------------

const TriggerEl = ref<HTMLElement | null>(null)
const INVALID_VNODE_TYPES: VNodeTypes[] = [Fragment, Comment, Text, 'template']

function TriggerVNode(): VNode {
  const vNodes = slots.trigger?.({}).filter((node) => !INVALID_VNODE_TYPES.includes(node.type))
  if (!vNodes || vNodes.length !== 1) {
    throw new Error(
      '[vex] <Dropdown> trigger slot requires exactly a single root child at all times'
    )
  }
  return cloneVNode(
    vNodes[0],
    {
      ref: TriggerEl,
      id: TRIGGER_ID,
      'aria-controls': DROPDOWN_ID,
      'aria-haspopup': DROPDOWN_ROLE,
      'aria-expanded': `${isFloatingElVisible.value}`,
    },
    true
  )
}

//----------------------------------------------------------------------------------------------------
// 📌 focus management
//----------------------------------------------------------------------------------------------------

const FloatingEl = ref<HTMLElement | null>(null)

useEventListener(TriggerEl, 'keydown', (e: KeyboardEvent) => {
  if (e.shiftKey || e.altKey || e.ctrlKey) return

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    isFloatingElVisible.value = true
    focusFirstChild()
  }

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    isFloatingElVisible.value = true
    focusFirstChild()
  }
})

function focusFirstChild(): void {
  nextTick(() => (FloatingEl.value as HTMLElement)?.focus())
}

//----------------------------------------------------------------------------------------------------

const { floatingStyles } = useFloating(isFloatingElVisible, TriggerEl, FloatingEl, p)

defineExpose({
  isDropdownVisible: isFloatingElVisible,
  FloatingEl: FloatingEl,
})
</script>

<template>
  <Component :is="TriggerVNode" />

  <div
    ref="FloatingEl"
    v-bind="$attrs"
    v-show.lazy="isFloatingElVisible"
    tabindex="-1"
    class="vex-dropdown"
    :id="DROPDOWN_ID"
    :aria-labelledby="TRIGGER_ID"
    :role="p.role"
    :style="floatingStyles"
  >
    <slot />
  </div>
</template>
