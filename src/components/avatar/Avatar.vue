<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

export type ImageLoadingStatus = 'loading' | 'loaded' | 'error' | 'idle'

//==================================================
// 📌 component meta
//==================================================

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the image src attribute
     */
    src?: string

    /**
     * specifies the avatar size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the avatar border radius
     * @default: 'rounded'
     */
    borderRadius?: 'sm' | 'md' | 'lg' | 'rounded' | 'square'

    /**
     * specifies a fallback text to show while the image is loading
     */
    fallback?: string

    /**
     * whether to display a ring around the avatar
     */
    ring?: boolean

    /**
     * specifies the ring color
     * @default 'info'
     */
    ringColor?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'white' | 'black'
    class?: string
    style?: string
  }>(),
  {
    size: 'md',
    borderRadius: 'rounded',
    ringColor: 'info',
  }
)

const slots = defineSlots<{
  default: (props: {}) => any
}>()

//==================================================
// 📌 image loading status
//==================================================

const loadStatus = ref<ImageLoadingStatus>('idle')

function onLoad(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.complete && img.naturalHeight > 0) {
    loadStatus.value = 'loaded'
  }
}

function onError() {
  loadStatus.value = 'error'
}

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

//==================================================
// 📌 classes
//==================================================

const classes = computed(() => {
  return [
    p.class,
    'vex-avatar',
    `--size-${p.size}`,
    `--radius-${p.borderRadius}`,
    loadStatus.value === 'error' ? '--ring-danger' : `--ring-${p.ringColor}`,
    {
      '--ring': p.ring,
    },
  ]
})
</script>

<template>
  <div :class="classes" :style="p.style">
    <!-- error -->

    <span v-if="loadStatus === 'error'" class="vex-avatar-error">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M5 21q-.825 0-1.413-.588T3 19v-6.6l3 3l4-4l4 4l4-4l3 3V19q0 .825-.588 1.413T19 21H5ZM5 3h14q.825 0 1.413.588T21 5v6.575l-3-3l-4 4l-4-4l-4 4l-3-3V5q0-.825.588-1.413T5 3Z"
        />
      </svg>
    </span>

    <!-- fallback -->

    <span v-else-if="loadStatus !== 'loaded'" class="vex-avatar-fallback">
      <slot>
        {{ p.fallback }}
      </slot>
    </span>

    <!-- img -->

    <img v-else v-bind="$attrs" class="vex-avatar-img" :src="p.src" />
  </div>
</template>

<style lang="scss">
.vex-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vex-clr-info-100);
  color: var(--vex-clr-info-400);
  border: 0px solid;
}

//------ fallback ------//

.vex-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--vex-clr-neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
}

//------ img ------//

.vex-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-position: center;
  object-fit: cover;
  aspect-ratio: 1/1;
}

//------ error ------//

.vex-avatar-error {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--vex-clr-danger-100);
  color: var(--vex-clr-danger-400);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 50%;
    height: 50%;
  }
}

//------ size ------//

.vex-avatar.--size-sm {
  height: 2rem;
  width: 2rem;
}
.vex-avatar.--size-md {
  height: 3rem;
  width: 3rem;
}
.vex-avatar.--size-lg {
  height: 4rem;
  width: 4rem;
}

//------ ring ------//

.vex-avatar.--ring {
  border-width: 2px;
}

.vex-avatar.--ring-black {
  border-color: black;
}
.vex-avatar.--ring-white {
  border-color: white;
}
.vex-avatar.--ring-info {
  border-color: var(--vex-clr-info-400);
}
.vex-avatar.--ring-primary {
  border-color: var(--vex-clr-primary-400);
}
.vex-avatar.--ring-danger {
  border-color: var(--vex-clr-danger-400);
}
.vex-avatar.--ring-warning {
  border-color: var(--vex-clr-warning-400);
}
.vex-avatar.--ring-success {
  border-color: var(--vex-clr-success-400);
}

//------ border radius ------//

.vex-avatar.--radius-sm {
  border-radius: var(--vex-border-radius-sm);
}
.vex-avatar.--radius-md {
  border-radius: var(--vex-border-radius-md);
}
.vex-avatar.--radius-lg {
  border-radius: var(--vex-border-radius-lg);
}
.vex-avatar.--radius-square {
  border-radius: var(--vex-border-radius-square);
}
.vex-avatar.--radius-rounded {
  border-radius: var(--vex-border-radius-rounded);
}
</style>
