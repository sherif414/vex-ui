<script setup lang="ts">
import { useSelect, useVModel } from '@/composables'
import type { Selected } from './context'
import { provide } from 'vue'

const p = withDefaults(
  defineProps<{
    modelValue?: Selected
    deselection?: boolean
    multiselect?: boolean
  }>(),
  {}
)

const selection = useSelect(
  useVModel(() => p.modelValue),
  {
    multiselect: () => p.multiselect,
    deselection: () => p.deselection,
  }
)

provide('', {
  selection,
})
</script>

<template>
  <div></div>
</template>
