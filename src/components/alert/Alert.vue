<script setup lang="ts">
import { getRandomString } from '@/composables/helpers'
import {
  IconDangerSign,
  IconWarn,
  IconCheckCircle,
  IconBell,
  IconXMark,
} from '@/components/icons'
import { computed } from 'vue'

//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    /**
     * specifies the alert title text
     */
    title?: string

    /**
     * specifies the alert color
     */
    color?: 'success' | 'warning' | 'danger' | 'info' | 'primary'

    /**
     * whether to show the close button
     */
    closable?: boolean
  }>(),
  {
    color: 'info',
  }
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

//==================================================
// 📌 attributes
//==================================================

const titleId = `alert-title-${getRandomString(6)}`
const bodyId = `alert-body-${getRandomString(6)}`

//==================================================
// 📌 icon
//==================================================

const icon = computed(() => {
  return {
    danger: IconDangerSign,
    success: IconCheckCircle,
    info: IconBell,
    primary: IconBell,
    warning: IconWarn,
  }[p.color]
})

//==================================================
// 📌 classes
//==================================================

const colorClass = computed(() => `vex-alert-${p.color}`)
</script>

<template>
  <div
    role="alert"
    :class="['vex-alert', colorClass]"
    :aria-labelledby="titleId"
    :aria-describedby="bodyId"
  >
    <span class="vex-alert-icon">
      <Component width="20" height="20" :is="icon" />
    </span>

    <div class="vex-alert-wrapper">
      <span v-if="p.title" :id="titleId" class="vex-alert-title">{{ p.title }}</span>

      <p :id="bodyId" class="vex-alert-body">
        <slot />
      </p>
    </div>

    <span
      v-if="p.closable"
      role="button"
      aria-label="close alert"
      tabindex="0"
      class="vex-alert-close-button"
      @click="emit('close')"
    >
      <IconXMark width="18" height="18" />
    </span>
  </div>
</template>

<style lang="scss">
.vex-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--vex-spacing-3);
  padding: var(--vex-spacing-4);
  border-radius: var(--vex-border-radius-sm);
  border-inline-start: 3px solid currentColor;

  &-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--vex-spacing-2);
  }

  &-title {
    font-weight: 500;
    font-size: var(--vex-font-size-md);
  }

  &-body {
    font-size: var(--vex-font-size-sm);
    margin: 0;
    padding: 0;
  }

  &-close-button {
    cursor: pointer;
  }
}

// variants

.vex-alert-danger {
  // TODO: danger-100 is too opaque
  background-color: var(--vex-clr-danger-200);
  color: var(--vex-clr-danger-500);
}
.vex-alert-warning {
  background-color: var(--vex-clr-warning-100);
  color: var(--vex-clr-warning-500);
}
.vex-alert-success {
  background-color: var(--vex-clr-success-100);
  color: var(--vex-clr-success-500);
}
.vex-alert-info {
  background-color: var(--vex-clr-info-100);
  color: var(--vex-clr-info-500);
}

//TODO: is primary color needed?
.vex-alert-primary {
  background-color: var(--vex-clr-primary-200);
  color: var(--vex-clr-primary-500);
}
</style>
