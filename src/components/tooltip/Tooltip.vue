<script setup lang="ts">
import { useFloating, type UseFloatingOptions } from '@/composables'
import { getRandomString } from '@/composables/helpers'
import { cloneVNode, computed, Fragment, ref, type VNode, type VNodeTypes } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 Component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<
    {
      /**
       * specifies the tooltip's background color
       */
      color?: 'danger' | 'warning' | 'success' | 'primary' | 'accent' | 'neutral'

      /**
       * specifies the tooltip's variant
       * @default 'filled'
       */
      variant?: 'filled' | 'light'

      /**
       * whether to hide the arrow
       */
      hideArrow?: boolean
    } & Pick<
      UseFloatingOptions,
      'hideOnClick' | 'offset' | 'placement' | 'arrowPadding' | 'toggleAction'
    >
  >(),
  {
    placement: 'top',
    offset: 8,
    color: 'neutral',
    toggleAction: 'hover',
    variant: 'filled',
  }
)

const slots = defineSlots<{
  default?: (props: {}) => any
  trigger?: (props: {}) => VNode[]
}>()

//----------------------------------------------------------------------------------------------------

const TOOLTIP_ID = `tooltip-${getRandomString(6)}`
const TooltipEl = ref<HTMLElement | null>(null)
const TriggerEl = ref<HTMLElement | null>(null)
const ArrowEl = ref<HTMLElement | null>(null)

//----------------------------------------------------------------------------------------------------
// 📌 Trigger
//----------------------------------------------------------------------------------------------------

const INVALID_VNODE_TYPES: VNodeTypes[] = [Fragment, Comment, Text, 'template']

function TriggerVNode(): VNode {
  const vNodes = slots.trigger?.({})
  if (!vNodes || vNodes?.length !== 1 || INVALID_VNODE_TYPES.includes(vNodes[0].type)) {
    throw new Error(
      '[vex] <Tooltip> trigger slot requires exactly a single root child at all times'
    )
  }
  return cloneVNode(
    vNodes[0],
    {
      ref: TriggerEl,
      'aria-describedby': TOOLTIP_ID,
    },
    true
  )
}

//----------------------------------------------------------------------------------------------------
// 📌 Floating
//----------------------------------------------------------------------------------------------------

const isFloatingElVisible = ref(false)

const { floatingStyles, arrowStyles } = useFloating(
  isFloatingElVisible,
  TriggerEl,
  TooltipEl,
  p,
  p.hideArrow ? null : ArrowEl
)

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => ['vex-tooltip', `--c-${p.color}`, `--variant-${p.variant}`])
</script>

<template>
  <Component :is="TriggerVNode" />

  <Teleport to="body">
    <Transition name="vex-fade">
      <div
        v-show="isFloatingElVisible"
        v-bind="$attrs"
        :style="floatingStyles"
        :class="modifierClasses"
        ref="TooltipEl"
      >
        <div class="vex-tooltip-content">
          <slot />
        </div>
        <div :style="arrowStyles" ref="ArrowEl" class="vex-tooltip-arrow" />
      </div>
    </Transition>
  </Teleport>
</template>
