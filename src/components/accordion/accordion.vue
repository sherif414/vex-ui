<script setup lang="ts">
import { provide, ref, toRef, watch } from 'vue'
import type { ActiveIndex, AccordionInjectedState } from './types'
import { useListNavigation } from '@/composables'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    /**
     * specifies the accordion variant, which changes how the accordion looks
     * @default 'default'
     */
    variant?: 'outline' | 'ladder' | 'default' | 'filled'

    /**
     * specifies the chevron arrow position
     * @default 'end'
     */
    arrowPosition?: 'start' | 'end'

    /**
     * whether to show or hide the chevron arrow
     * @default true
     */
    arrow?: boolean

    /**
     * whether to allow multiple active accordion-items at the same time or not
     * @default false
     */
    multiple?: boolean

    /**
     * whether to loop back to the other end of the list upon reaching the end,
     * only relevant when navigating with keyboard
     * @default true
     */
    loop?: boolean
  }>(),
  {
    variant: 'default',
    loop: true,
    arrowPosition: 'end',
    arrow: true,
    multiple: false,
  }
)

/**********************************
 * 📌 keyboard navigation
 ***********************************/

const { eventListener } = useListNavigation(
  '.vex-accordion-item-button:enabled',
  props.loop
)

/**********************************
 * 📌 provide context to children
 ***********************************/

let indexCount = 0
const activeIndex = ref<ActiveIndex>(props.multiple ? new Set() : undefined)

watch(
  () => props.multiple,
  (value) => {
    activeIndex.value = value ? new Set() : undefined
  }
)

function getIndex() {
  return ++indexCount
}

provide<AccordionInjectedState>('vex-accordion-injected-state', {
  activeIndex,
  getIndex,
  arrow: toRef(props, 'arrow'),
  arrowPosition: toRef(props, 'arrowPosition'),
})
</script>

<template>
  <div
    :class="['vex-accordion', `vex-accordion-variant-${props.variant}`]"
    @keydown="eventListener"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.vex-accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: var(--vex-font-size-sm);
  color: var(--vex-clr-neutral-900);

  &-variant-default {
    gap: var(--vex-spacing-1);
    .vex-accordion-item-button:enabled:hover {
      background-color: var(--vex-clr-neutral-100);
    }
    .vex-accordion-item-open {
      background-color: var(--vex-clr-neutral-100) !important;
    }
  }

  &-variant-ladder {
    .vex-accordion-item {
      border-bottom-color: var(--vex-clr-neutral-200);

      &-open {
        background-color: var(--vex-clr-neutral-100) !important;
      }

      &-button:enabled:hover {
        background-color: var(--vex-clr-neutral-100);
      }
    }
  }

  &-variant-outline {
    border-radius: 8px;
    border: 1px solid var(--vex-clr-neutral-200);

    .vex-accordion-item ~ .vex-accordion-item {
      border-top-color: var(--vex-clr-neutral-200);
    }
    .vex-accordion-item-button:enabled:hover {
      background-color: var(--vex-clr-neutral-100);
    }
    .vex-accordion-item-open {
      background-color: var(--vex-clr-neutral-100);
    }
  }

  &-variant-filled {
    gap: var(--vex-spacing-2);
    .vex-accordion-item {
      background-color: var(--vex-clr-neutral-50);
      border-radius: var(--vex-border-radius-md);
    }
    .vex-accordion-item-open {
      background-color: white !important;
      border-color: rgba(209, 213, 219);
    }
  }
}
</style>
