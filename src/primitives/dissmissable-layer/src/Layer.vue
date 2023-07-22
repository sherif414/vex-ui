<script setup lang="ts">
import { ref } from 'vue'
import { type Layer } from '.'
import { useLayer } from './dismissible-layer'

const p = withDefaults(
  defineProps<{
    inertOutside?: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  dismiss: [event: Event]
  clickOutside: [event: Event]
  escapeKeydown: [event: KeyboardEvent]
}>()

//----------------------------------------------------------------------------------------------------

const LayerEl: Layer = ref(null)
const { pointerEvents } = useLayer(LayerEl, {
  onDismiss: (e) => emit('dismiss', e),
  onEscapeKey: (e) => emit('escapeKeydown', e),
  onClickOutside: (e) => emit('clickOutside', e),
})

//----------------------------------------------------------------------------------------------------
</script>

<template>
  <div ref="LayerEl" :style="{ pointerEvents }" tabindex="-1">
    <slot />
  </div>
</template>
