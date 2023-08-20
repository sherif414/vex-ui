<script setup lang="ts">
import { IconDangerSign, IconWarn, IconCheckCircle, IconBell, IconXMark } from '@/icons'
import { useID } from '@/composables'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the alert title text
     */
    header?: string

    /**
     * specifies the alert variant
     */
    variant?: 'success' | 'warning' | 'danger' | 'accent' | 'primary'

    /**
     * whether to show the close button
     */
    dismissible?: boolean
  }>(),
  {
    variant: 'primary',
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

//----------------------------------------------------------------------------------------------------

const HEADER_ID = useID()
const CONTENT_ID = useID()

const icons = {
  danger: IconDangerSign,
  success: IconCheckCircle,
  accent: IconBell,
  primary: IconBell,
  warning: IconWarn,
}
</script>

<template>
  <div
    role="alert"
    :class="['vex-alert', `--variant-${p.variant}`]"
    :aria-labelledby="HEADER_ID"
    :aria-describedby="CONTENT_ID"
  >
    <!-- icon -->

    <span class="vex-alert-icon">
      <slot name="icon">
        <Component :is="icons[p.variant]" width="20" height="20" />
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
      <IconXMark aria-hidden="true" width="14" height="14" />
    </button>
  </div>
</template>
