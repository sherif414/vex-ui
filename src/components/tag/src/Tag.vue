<script setup lang="ts">
/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    /**
     * specifies the tag color
     * @default 'primary'
     */
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'info'

    /**
     * specifies the tag size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the tag border-radius
     * @default 'rounded'
     */
    borderRadius?: 'sm' | 'md' | 'lg' | 'rounded' | 'square'

    /**
     * whether to show a prepended dot
     */
    withDot?: boolean
  }>(),
  {
    color: 'primary',
    size: 'md',
    borderRadius: 'rounded',
  }
)
</script>

<template>
  <span
    :style="{
      backgroundColor: `var(--vex-clr-${props.color}-100)`,
      color: `var(--vex-clr-${props.color}-500)`,
      borderRadius: `var(--vex-border-radius-${props.borderRadius})`,
    }"
    :class="['vex-tag', `vex-tag-size-${props.size}`]"
  >
    <span v-if="props.withDot" class="vex-tag-dot" />
    <slot />
  </span>
</template>
