<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    src?: string
    class?: any
    style?: any
  }>(),
  {}
)

defineSlots<{
  default: (props: { loadStatus: 'loading' | 'error' | 'idle' }) => any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 image loading status
//----------------------------------------------------------------------------------------------------

const loadStatus = ref<'loading' | 'loaded' | 'error' | 'idle'>('idle')

onMounted(() => {
  watch(
    () => p.src,
    () => {
      if (!p.src) {
        loadStatus.value = 'error'
        return
      }
      loadStatus.value = 'loading'
      const img = new Image()
      img.onload = onLoad
      img.onerror = onError
      img.src = p.src
    },
    { immediate: true }
  )
})

function onLoad(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.complete && img.naturalHeight > 0) {
    loadStatus.value = 'loaded'
  }
}

function onError() {
  loadStatus.value = 'error'
}
</script>

<template>
  <div :class="p.class" :style="p.style">
    <slot v-if="loadStatus !== 'loaded'" :load-status="loadStatus" />

    <img v-else v-bind="$attrs" :src="p.src" />
  </div>
</template>
