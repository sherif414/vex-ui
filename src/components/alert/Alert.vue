<script setup lang="ts">
import { getRandomString } from '@/composables/helpers'
import { Button } from '@/components'
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
    header?: string

    /**
     * specifies the alert variant
     */
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'plain'

    /**
     * whether to show the close button
     */
    dismissible?: boolean
  }>(),
  {
    variant: 'info',
  }
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const slots = defineSlots<{
  default?: (props: {}) => any
  header?: (props: {}) => any
  icon?: (props: {}) => any
}>()

const HEADER_ID = `alert-header-${getRandomString(6)}`
const CONTENT_ID = `alert-content-${getRandomString(6)}`

//==================================================
// 📌 icon
//==================================================

const IconComponent = computed(() => {
  return {
    danger: IconDangerSign,
    success: IconCheckCircle,
    info: IconBell,
    plain: IconBell,
    warning: IconWarn,
  }[p.variant]
})

//==================================================
// 📌 classes
//==================================================

const classes = computed(() => ['vex-alert', `--variant-${p.variant}`])
</script>

<template>
  <div
    role="alert"
    :class="classes"
    :aria-labelledby="HEADER_ID"
    :aria-describedby="CONTENT_ID"
  >
    <!-- icon -->

    <span class="vex-alert-icon">
      <slot name="icon">
        <Component :is="IconComponent" width="20" height="20" />
      </slot>
    </span>

    <!-- header -->

    <div v-if="p.header || slots.header" :id="HEADER_ID" class="vex-alert-header">
      <slot name="header">
        {{ p.header }}
      </slot>
    </div>

    <!-- content -->

    <div :id="CONTENT_ID" class="vex-alert-content">
      <slot />
    </div>

    <!-- close button -->

    <button
      v-if="p.dismissible"
      type="button"
      class="vex-alert-close"
      aria-label="close"
      @click="emit('close')"
    >
      <IconXMark width="16" height="16" />
    </button>
  </div>
</template>

<style lang="scss">
.vex-alert {
  display: grid;
  position: relative;
  grid-template-areas:
    'icon header'
    'icon content';
  align-items: flex-start;
  gap: var(--vex-spacing-2);
  padding: var(--vex-spacing-4);
  border-radius: var(--vex-border-radius-sm);
  border-inline-start: 3px solid currentColor;
}

//------ icon ------//

.vex-alert-icon {
  grid-area: icon;
}

//------ header ------//

.vex-alert-header {
  grid-area: header;
  font-weight: 500;
  font-size: var(--vex-font-size-md);
}

//------ content ------//

.vex-alert-content {
  grid-area: content;
  font-size: var(--vex-font-size-sm);
  margin: 0;
  padding: 0;
}

//------ close button ------//

.vex-alert-close {
  all: unset;
  cursor: pointer;
  position: absolute;
  inset-block-start: var(--vex-spacing-2);
  inset-inline-end: var(--vex-spacing-2);
}

//------ variants ------//

.vex-alert.--variant-danger {
  background-color: var(--vex-clr-danger-100);
  color: var(--vex-clr-danger-500);
}

.vex-alert.--variant-warning {
  background-color: var(--vex-clr-warning-100);
  color: var(--vex-clr-warning-500);
}

.vex-alert.--variant-success {
  background-color: var(--vex-clr-success-100);
  color: var(--vex-clr-success-500);
}

.vex-alert.--variant-info {
  background-color: var(--vex-clr-info-100);
  color: var(--vex-clr-info-500);
}

.vex-alert.--variant-plain {
  background-color: var(--vex-clr-plain-100);
  color: var(--vex-clr-plain-500);
}
</style>
