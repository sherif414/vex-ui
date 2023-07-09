<script setup lang="ts">
import { computed } from 'vue'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
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
    dotOnly?: boolean

    /**
     * whether to show/hide the badge
     */
    hidden?: boolean

    /**
     * specifies the badge offset from the corner of its host element.
     * this can be any valid css length value `1px, 1rem, 1em ...etc`
     * @default '-2px'
     */
    offset?: string

    /**
     * specifies the badge placement.
     * @default 'top-right'
     */
    placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

    /**
     * whether to show the default white border around the badge
     */
    borderless?: boolean
  }>(),
  {
    color: 'info',
    offset: '-2px',
    placement: 'top-right',
    size: 'md',
  }
)

/**********************************
 * 📌 badge visibility
 ***********************************/

const isVisible = computed(() => {
  return (props.dotOnly || props.value) && !props.hidden
})

/**********************************
 * 📌 classes & styles
 ***********************************/

const classes = computed(() => [
  'vex-badge',
  `vex-badge-${props.color}`,
  `vex-badge-size-${props.size}`,
  { 'vex-badge-border': !props.borderless, 'vex-badge-with-value': !props.dotOnly },
])

const styles = computed(() => {
  const [y, x] = props.placement.split('-')

  return {
    top: y === 'top' ? `calc(0% - ${props.offset})` : `calc(100% + ${props.offset})`,
    left: x === 'left' ? `calc(0% - ${props.offset})` : `calc(100% + ${props.offset})`,
  }
})
</script>

<template>
  <div class="vex-badge-wrapper">
    <div v-show="isVisible" :style="styles" :class="classes">
      <span v-if="!props.dotOnly">
        {{ props.value }}
      </span>
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
.vex-badge-wrapper {
  position: relative;
  width: max-content;
  display: inline-block;
}

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

  &-border {
    border: 2px solid white;
  }

  &-with-value {
    // width: max-content;
    padding: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: content-box;
  }
}

// size

.vex-badge-size-sm {
  min-height: 0.75rem;
  min-width: 0.75rem;
  font-size: var(--vex-font-size-xs);
}
.vex-badge-size-md {
  min-height: 1rem;
  min-width: 1rem;
  font-size: var(--vex-font-size-sm);
}
.vex-badge-size-lg {
  min-height: 1.25rem;
  min-width: 1.25rem;
  font-size: var(--vex-font-size-md);
}

// color

.vex-badge-info {
  background-color: var(--vex-clr-info-400);
  color: var(--vex-clr-neutral-100);
}
.vex-badge-danger {
  background-color: var(--vex-clr-danger-400);
  color: var(--vex-clr-neutral-100);
}
.vex-badge-warning {
  background-color: var(--vex-clr-warning-300);
  color: var(--vex-clr-neutral-900);
}
.vex-badge-success {
  background-color: var(--vex-clr-success-500);
  color: var(--vex-clr-neutral-100);
}
</style>
