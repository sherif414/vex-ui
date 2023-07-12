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
