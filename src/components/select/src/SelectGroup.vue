<script setup lang="ts">
//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    label: string
  }>(),
  {}
)
</script>

<template>
  <div class="vex-select-group" role="group" :aria-label="p.label">
    <slot />
  </div>
</template>
