<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * specifies the loader color,
     * `current` is the css `currentColor` value
     * @default 'current'
     */
    color?: 'primary' | 'currentColor' | 'success' | 'warning' | 'error'

    /**
     * specifies the loader size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the loader aria-label
     * @default 'loading'
     */
    ariaLabel?: string
  }>(),
  {
    color: 'currentColor',
    size: 'sm',
    ariaLabel: 'Loading',
  }
)
</script>

<template>
  <span
    role="status"
    :aria-label="ariaLabel"
    class="vex-loader"
    :class="[`vex-loader-size-${size}`, `vex-loader-clr-${color}`]"
  />
</template>

<style lang="scss">
.vex-loader {
  position: relative;
  display: grid;
  place-items: center;

  &::after,
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    border-color: transparent;
    border-top-color: currentColor;
    border-style: solid;
    border-radius: 100%;
    border-width: 2px;
    animation-name: vex-spin;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  &::after {
    animation-timing-function: ease;
  }

  &::before {
    animation-timing-function: linear;
    border-style: dashed;
    opacity: 50%;
  }
}

.vex-loader-size {
  &-sm {
    height: 1rem;
    width: 1rem;
  }
  &-md {
    height: 2rem;
    width: 2rem;
  }
  &-lg {
    height: 3rem;
    width: 3rem;
  }
}

.vex-loader-clr {
  &-primary {
    color: var(--vex-clr-primary);
  }
  &-success {
    color: var(--vex-clr-success);
  }
  &-warning {
    color: var(--vex-clr-warning);
  }
  &-danger {
    color: var(--vex-clr-danger);
  }
}

@keyframes vex-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
