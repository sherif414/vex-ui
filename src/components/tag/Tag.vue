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

<style lang="scss">
.vex-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vex-spacing-2);
  padding: 0 var(--vex-spacing-2);
  box-sizing: border-box;
  width: max-content;
  white-space: nowrap;

  &-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background-color: currentColor;
  }
}

.vex-tag-size-sm {
  height: 1rem;
  font-size: var(--vex-font-size-xs);
}
.vex-tag-size-md {
  height: 1.5rem;
  font-size: var(--vex-font-size-sm);
}
.vex-tag-size-lg {
  height: 1.75rem;
  font-size: var(--vex-font-size-md);
}
</style>
