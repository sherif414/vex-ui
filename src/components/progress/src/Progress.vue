<script setup lang="ts">
import { animate, type AnimationControls } from 'motion'
import { onMounted, ref, watch } from 'vue'
import type { ProgressProps } from './props'

//==================================================
// 📌 component meta
//==================================================

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  height: 3,
  duration: 300,
  color: 'primary',
})

const emit = defineEmits<{
  (event: 'finished'): void
}>()

//==================================================
// 📌 animation
//
// TODO: add reduced motion
//==================================================

const progressEl = ref<HTMLElement | null>(null)
let animationControls: AnimationControls | null = null

onMounted(() => {
  watch(
    () => props.value,
    (v, _, onCleanup) => {
      if (!progressEl.value) return
      onCleanup(() => animationControls?.stop())

      animationControls = animate(
        progressEl.value,
        { width: [null, `${Math.min(v, 100)}%`] },
        { duration: props.duration / 1000, easing: 'linear' }
      )

      animationControls.finished.then(() => {
        if (v === 100) {
          emit('finished')
        }
      })
    },
    { immediate: true }
  )
})

defineExpose({
  resume: () => animationControls?.play(),
  pause: () => animationControls?.pause(),
  finish: () => animationControls?.finish(),
  stop: () => animationControls?.stop(),
})
</script>

<template>
  <div
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="props.value"
    :aria-valuetext="props.ariaValuetext"
    :class="['vex-progress', `vex-progress-${props.color}`]"
  >
    <div ref="progressEl" class="vex-progress-bar"></div>
  </div>
</template>
