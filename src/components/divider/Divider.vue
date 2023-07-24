<script setup lang="ts">
import { computed } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }>(),
  {
    orientation: 'horizontal',
  }
)

const modifierClasses = computed(() => [
  'vex-divider',
  {
    '--vertical': p.orientation === 'vertical',
  },
])
</script>

<template>
  <div
    :class="modifierClasses"
    :role="p.decorative ? 'none' : 'separator'"
    :aria-orientation="p.decorative ? undefined : p.orientation"
  >
    <span class="vex-divider-content">
      <slot />
    </span>
  </div>
</template>
