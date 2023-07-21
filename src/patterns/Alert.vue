<script setup lang="ts">
import { IconDangerSign, IconWarn, IconCheckCircle, IconBell } from '@/icons'

//----------------------------------------------------------------------------------------------------

/***
 * variants:  'primary' | 'accent' | 'danger' | 'success' | 'warning'
 */

//----------------------------------------------------------------------------------------------------

const HEADER_ID = 'vex:0'
const DESCRIPTION_ID = 'vex:1'

const Icon = {
  primary: IconBell,
  accent: IconBell,
  danger: IconDangerSign,
  success: IconCheckCircle,
  warning: IconWarn,
}['primary']
</script>

<template>
  <div
    class="vex-alert --variant-primary"
    :aria-labelledby="HEADER_ID"
    :aria-describedby="DESCRIPTION_ID"
  >
    <!-- icon -->

    <div class="vex-alert-icon">
      <Component :is="Icon" width="20" height="20" />
    </div>

    <!-- header -->

    <div :id="HEADER_ID" class="vex-alert-header">Alert header</div>

    <!-- description -->

    <div :id="DESCRIPTION_ID" class="vex-alert-description">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dolorum ut sunt,
      nesciunt aut fugiat quibusdam iure dolores asperiores labore voluptatibus consectetur quisquam
      voluptatum expedita, eum odio repellendus sequi atque.
    </div>
  </div>
</template>

<style lang="scss">
.vex-alert {
  display: grid;
  position: relative;
  grid-template-areas:
    'icon header'
    'icon description';
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

//------ description ------//

.vex-alert-description {
  grid-area: description;
  font-size: var(--vex-font-size-sm);
}

//------ variants ------//

.vex-alert.--variant-danger {
  background-color: var(--vex-c-danger-100);
  color: var(--vex-c-danger-800);
}

.vex-alert.--variant-warning {
  background-color: var(--vex-c-warning-100);
  color: var(--vex-c-warning-800);
}

.vex-alert.--variant-success {
  background-color: var(--vex-c-success-100);
  color: var(--vex-c-success-800);
}

.vex-alert.--variant-accent {
  background-color: var(--vex-c-accent-100);
  color: var(--vex-c-accent-800);
}

.vex-alert.--variant-primary {
  background-color: var(--vex-c-primary-100);
  color: var(--vex-c-primary-500);
}
</style>
