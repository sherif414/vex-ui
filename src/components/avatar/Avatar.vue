<script setup lang="ts">
import { useSignal } from '@/composables'
import { onMounted, ref, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

type LoadStatus = 'loading' | 'error' | 'idle' | 'loaded'

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    src?: string
    class?: any
    style?: any
    size?: 'sm' | 'md' | 'lg'
    radius?: 'sm' | 'md' | 'lg' | 'full' | 'none'
    ring?: boolean
    ringColor?: 'primary' | 'accent' | 'danger' | 'warning' | 'success' | 'black' | 'white'
  }>(),
  {
    size: 'md',
    radius: 'full',
    ringColor: 'accent',
  }
)

defineSlots<{
  default: (props: { loadStatus: () => LoadStatus }) => any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 image loading status
//----------------------------------------------------------------------------------------------------

const [getLoadStatus, setLoadStatus] = useSignal<LoadStatus>('idle')

onMounted(() => {
  watch(
    () => p.src,
    () => {
      if (!p.src) {
        setLoadStatus('error')
        return
      }
      setLoadStatus('loading')
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
    setLoadStatus('loaded')
  }
}

function onError() {
  setLoadStatus('error')
}
</script>

<template>
  <div
    :class="[
      p.class,
      'vex-avatar',
      `--size-${p.size}`,
      ` --rounded-${p.radius}`,
      p.ring && `--ring-${p.ringColor}`,
    ]"
    :style="p.style"
  >
    <slot v-if="getLoadStatus() !== 'loaded'" :load-status="getLoadStatus" />

    <img class="vex-avatar-img" v-else v-bind="$attrs" :src="p.src" />
  </div>
</template>
