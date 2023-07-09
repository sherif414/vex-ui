<script setup lang="ts">
//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }>(),
  {
    orientation: 'horizontal',
  }
)
</script>

<template>
  <div
    class="vex-divider"
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="decorative ? undefined : orientation"
  />
</template>

<style lang="scss">
.vex-divider {
  display: block;
  height: 1px;
  border-width: 0;
  border: none;
  background-color: var(--vex-border-clr-base);
  box-sizing: content-box;
  margin-block: var(--vex-spacing-2);
  flex-shrink: 0;
}
</style>
