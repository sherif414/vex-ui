<script setup lang="ts">
import { computed } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//
// TODO: FunctionalComponent candidate
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the loader color,
     * @default 'currentColor'
     */
    color?: 'primary' | 'currentColor' | 'success' | 'warning' | 'error'

    /**
     * specifies the loader size
     * @default 'sm'
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

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => ['vex-loader', `--size-${p.size}`, `--color-${p.color}`])
</script>

<template>
  <div role="status" :aria-label="ariaLabel" :class="modifierClasses" />
</template>
