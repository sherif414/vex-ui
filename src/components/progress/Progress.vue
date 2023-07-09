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

<style lang="scss">
.vex-progress {
  position: relative;
  width: 100%;
  height: v-bind('`${props.height}px`');
  border-radius: var(--vex-border-radius-md);

  &-bar {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    height: 100%;
    border-radius: inherit;
  }
}

.vex-progress-primary {
  background-color: var(--vex-clr-primary-100);

  .vex-progress-bar {
    background-color: var(--vex-clr-primary-400);
  }
}
.vex-progress-success {
  background-color: var(--vex-clr-success-100);

  .vex-progress-bar {
    background-color: var(--vex-clr-success-400);
  }
}
.vex-progress-warning {
  background-color: var(--vex-clr-warning-100);

  .vex-progress-bar {
    background-color: var(--vex-clr-warning-400);
  }
}
.vex-progress-danger {
  background-color: var(--vex-clr-danger-100);

  .vex-progress-bar {
    background-color: var(--vex-clr-danger-400);
  }
}
</style>
