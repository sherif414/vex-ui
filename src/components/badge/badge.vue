<script setup lang="ts">
import { computed } from 'vue'

//==================================================
// 📌 component meta
//==================================================

defineOptions({
  inheritAttrs: true,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the badge displayed value text
     */
    value?: string

    /**
     * specifies the badge color
     * @default 'info'
     */
    color?: 'info' | 'warning' | 'success' | 'danger'

    /**
     * specifies the badge size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * whether to render only a small circle without a value
     */
    dot?: boolean

    /**
     * whether to hide the badge
     */
    hidden?: boolean

    /**
     * specifies the badge offset from the corner of its host element.
     * this can be any valid css length value `1px, 1rem ...etc`
     * @default '-2px'
     */
    offset?: string

    /**
     * specifies the badge placement.
     * - Note: this is not RTL | LTR friendly
     * @default 'top-right'
     */
    placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }>(),
  {
    color: 'info',
    offset: '-2px',
    placement: 'top-right',
    size: 'md',
  }
)

//==================================================
// 📌 visibility
//==================================================

const isVisible = computed(() => {
  return (p.dot || p.value) && !p.hidden
})

//==================================================
// 📌 classes & styles
//==================================================

const classes = computed(() => [
  'vex-badge',
  `--color-${p.color}`,
  `--size-${p.size}`,
  {
    '--value': !p.dot,
  },
])

const positionStyles = computed(() => {
  const [y, x] = p.placement.split('-')
  return {
    top: y === 'top' ? `calc(0% - ${p.offset})` : `calc(100% + ${p.offset})`,
    left: x === 'left' ? `calc(0% - ${p.offset})` : `calc(100% + ${p.offset})`,
  }
})
</script>

<template>
  <div style="position: relative">
    <div v-bind="$attrs" v-show="isVisible" :class="classes" :style="positionStyles">
      <span v-if="!p.dot">
        {{ p.value }}
      </span>
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
.vex-badge {
  z-index: 10;
  border-radius: var(--vex-border-radius-rounded);
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid white;
}

//------ with value ------//

.vex-badge.--value {
  // width: max-content;
  padding: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: content-box;
}

//------ size ------//

.vex-badge {
  &.--size-sm {
    min-height: 0.75rem;
    min-width: 0.75rem;
    font-size: var(--vex-font-size-xs);
  }
  &.--size-md {
    min-height: 1rem;
    min-width: 1rem;
    font-size: var(--vex-font-size-sm);
  }
  &.--size-lg {
    min-height: 1.25rem;
    min-width: 1.25rem;
    font-size: var(--vex-font-size-md);
  }
}

//------ color ------//

.vex-badge {
  &.--color-info {
    background-color: var(--vex-clr-info-400);
    color: white;
  }
  &.--color-danger {
    background-color: var(--vex-clr-danger-400);
    color: white;
  }
  &.--color-warning {
    background-color: var(--vex-clr-warning-300);
    color: black;
  }
  &.--color-success {
    background-color: var(--vex-clr-success-300);
    color: black;
  }
}
</style>
