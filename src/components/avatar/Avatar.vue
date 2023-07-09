<script setup lang="ts">
import { computed, ref, watch } from 'vue'

//==================================================
// 📌 component meta
//==================================================

const props = withDefaults(
  defineProps<{
    /**
     * specifies the image src attribute
     */
    src: string

    /**
     * specifies the image srcset attribute
     */
    srcset?: string

    /**
     * specifies the image sizes attribute
     */
    sizes?: string

    /**
     * specifies an alternative text via the image alt attribute
     */
    alt?: string

    /**
     * specifies the avatar size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the image loading strategy
     * @default 'eager'
     */
    loading?: 'eager' | 'lazy'

    /**
     * specifies the avatar border radius
     * @default: 'rounded'
     */
    borderRadius?: 'sm' | 'md' | 'lg' | 'rounded' | 'square'

    /**
     * specifies a placeholder text that is shown while the image is loading
     */
    placeholder?: string

    /**
     * whether to display a ring around the avatar
     */
    ring?: boolean

    /**
     * specifies the ring color
     */
    ringColor?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'white' | 'black'
  }>(),
  {
    size: 'md',
    borderRadius: 'rounded',
    loading: 'eager',
    ringColor: 'info',
  }
)

//==================================================
// 📌 image loading & error status
//==================================================

const hasLoaded = ref(false)
function handleLoad(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.complete && img.naturalHeight > 0) hasLoaded.value = true
}

const hasError = ref(false)
function handleError() {
  hasError.value = true
}

watch([() => props.src, () => props.srcset], () => {
  hasError.value = false
  hasLoaded.value = false
})

//==================================================
// 📌 ring
//==================================================

const borderColor = computed(() => {
  if (hasError.value) {
    return 'var(--vex-clr-danger-300)'
  }
  if (['white', 'black'].includes(props.ringColor)) {
    return props.ringColor
  }
  return `var(--vex-clr-${props.ringColor}-300)`
})
</script>

<template>
  <span
    :style="{
      borderRadius: `var(--vex-border-radius-${props.borderRadius})`,
      borderColor,
    }"
    :class="[
      'vex-avatar',
      `vex-avatar-size-${props.size}`,
      props.ring && 'vex-avatar-with-ring',
    ]"
  >
    <template v-if="!$slots.default">
      <!-- error -->
      <span v-if="hasError" class="vex-avatar-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 21q-.825 0-1.413-.588T3 19v-6.6l3 3l4-4l4 4l4-4l3 3V19q0 .825-.588 1.413T19 21H5ZM5 3h14q.825 0 1.413.588T21 5v6.575l-3-3l-4 4l-4-4l-4 4l-3-3V5q0-.825.588-1.413T5 3Z"
          />
        </svg>
      </span>

      <!-- placeholder -->
      <!-- TODO: does this show properly? -->
      <span v-else-if="!hasLoaded">
        <slot name="placeholder">
          {{ props.placeholder }}
        </slot>
      </span>
    </template>

    <!-- avatar -->
    <slot>
      <img
        v-show="hasLoaded && !hasError"
        role="img"
        @error="handleError"
        @load="handleLoad"
        :loading="props.loading"
        :src="props.src"
        :srcset="props.srcset"
        :sizes="props.sizes"
        :alt="props.alt"
      />
    </slot>
  </span>
</template>

<style lang="scss">
.vex-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  background-color: var(--vex-clr-info-100);
  color: var(--vex-clr-info-400);
  border: 0px solid;

  &-with-ring {
    border-width: 2px;
  }

  & > img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-position: center;
    object-fit: cover;
  }

  &-size-sm {
    height: 2rem;
    width: 2rem;
  }
  &-size-md {
    height: 3rem;
    width: 3rem;
  }
  &-size-lg {
    height: 4rem;
    width: 4rem;
  }
}

.vex-avatar-error {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--vex-clr-danger-200);
  color: var(--vex-clr-danger-400);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
