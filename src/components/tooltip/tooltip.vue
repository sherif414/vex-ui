<script setup lang="ts">
import type { Placement } from '@floating-ui/vue'
import { computed, ref } from 'vue'
import { Floating } from '../floating'

//==================================================
// 📌 component meta
//==================================================

const props = withDefaults(
  defineProps<{
    /**
     * specifies the tooltip's background color
     */
    color?: 'danger' | 'warning' | 'success' | 'info' | 'black' | 'white'

    /**
     * specifies the tooltip's content text
     */
    content?: string

    /**
     * specifies the tooltip placement relative to its reference element
     * @default 'top'
     */
    placement?: Placement

    /**
     * specifies the space between the tooltip and its reference element
     * @default 8
     */
    offset?: number

    /**
     * specifies the tooltip width, this can be any valid css width value
     * @default 'auto'
     */
    width?: string

    /**
     * specifies the tooltip max-width, this can be any valid css max-width value
     * @default 'auto'
     */
    maxWidth?: string

    /**
     * with to show the arrow
     * @default true
     */
    arrow?: boolean

    /**
     * specifies the reference element, the tooltip will be positioned relative to this element
     * @default it defaults to element.firstElementChild
     */
    referenceEl?: HTMLElement
  }>(),
  {
    placement: 'top',
    offset: 8,
    width: 'auto',
    maxWidth: 'auto',
    arrow: true,
    color: 'black',
  }
)

const rootEl = ref<HTMLDivElement | null>(null)
const triggerEl = computed(() => (rootEl.value?.firstElementChild as HTMLElement) || null)
const isFloatingElVisible = ref(false)

//==================================================
// 📌 background color
//==================================================

const backgroundColor = computed(() => {
  return ['black', 'white'].includes(props.color)
    ? props.color
    : `var(--vex-clr-${props.color}-400)`
})
</script>

<template>
  <div v-if="$slots.default" class="vex-tooltip-reference" ref="rootEl">
    <slot />
  </div>
  <Floating
    transition="vex-fade"
    trigger="hover"
    :reference="props.referenceEl ?? triggerEl"
    :hover-el="props.referenceEl ?? rootEl"
    :placement="props.placement"
    :offset="8"
    :auto-width="false"
    :arrow="props.arrow"
    :style="{
      width,
      maxWidth,
      backgroundColor,
    }"
    v-model:visible="isFloatingElVisible"
    class="vex-tooltip"
  >
    <slot name="content">
      {{ props.content }}
    </slot>
  </Floating>
</template>

<style lang="scss">
.vex-tooltip {
  padding: var(--vex-spacing-1) var(--vex-spacing-2);
  font-size: var(--vex-font-size-sm);
  color: white;
  white-space: nowrap;
  width: max-content;
  border-radius: var(--vex-border-radius-sm);

  .vex-floating-arrow {
    width: 8px;
    height: 8px;
    background: inherit;
    transform: rotate(45deg);
  }
}

.vex-tooltip-reference {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
