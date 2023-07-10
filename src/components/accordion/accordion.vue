<script setup lang="ts">
import { computed, provide, ref, toRef, watch } from 'vue'
import { useListNavigation } from '@/composables'
import { ACCORDION_INJECTION_KEY, type ActiveIndex } from '.'

//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    /**
     * specifies the accordion variant.
     * @default 'default'
     */
    variant?: 'outline' | 'ladder' | 'default' | 'light'

    /**
     * specifies the chevron arrow position.
     * @default 'end'
     */
    arrowPosition?: 'start' | 'end'

    /**
     * whether to hide the chevron arrow.
     */
    hideArrow?: boolean

    /**
     * whether to allow multiple accordion-items to be expanded at the same time
     */
    multiple?: boolean

    /**
     * whether to loop back to the other end of the list upon reaching the end,
     * only relevant when navigating with keyboard.
     */
    loop?: boolean
  }>(),
  {
    variant: 'default',
    arrowPosition: 'end',
  }
)

const CHILDREN_SELECTOR = '.vex-accordion-item-header-button:enabled'

//==================================================
// 📌 keyboard & focus management
//==================================================

const { eventListener: onKeydown } = useListNavigation(CHILDREN_SELECTOR, p.loop)

//==================================================
// 📌 context provider
//==================================================

let indexCount = 0
const activeIndex = ref<ActiveIndex>(p.multiple ? new Set() : undefined)

watch(
  () => p.multiple,
  (value) => {
    activeIndex.value = value ? new Set() : undefined
  }
)

function getIndex() {
  return ++indexCount
}

provide(ACCORDION_INJECTION_KEY, {
  activeIndex,
  getIndex,
  isChevron: () => !p.hideArrow,
  arrowPosition: () => p.arrowPosition,
})

//==================================================
// 📌 classes
//==================================================

const classes = computed(() => {
  return ['vex-accordion', `--variant-${p.variant}`]
})
</script>

<template>
  <div :class="classes" @keydown="onKeydown">
    <slot />
  </div>
</template>

<style lang="scss">
.vex-accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: var(--vex-clr-neutral-900);
  border-radius: var(--vex-border-radius-sm);
}

//------ variant default ------//

.vex-accordion.--variant-default {
  gap: var(--vex-spacing-1);

  .vex-accordion-item-header-button:enabled:hover {
    background-color: var(--vex-clr-neutral-100);
  }
  .vex-accordion-item.--expanded {
    background-color: var(--vex-clr-neutral-100);
  }
}

//------ variant ladder ------//

.vex-accordion.--variant-ladder {
  .vex-accordion-item {
    border-bottom-color: var(--vex-clr-neutral-200);

    &.--expanded {
      background-color: var(--vex-clr-neutral-100);
    }
  }

  .vex-accordion-item-header-button:enabled:hover {
    background-color: var(--vex-clr-neutral-100);
  }
}

//------ variant outline ------//

.vex-accordion.--variant-outline {
  border: 1px solid var(--vex-border-clr-base);

  .vex-accordion-item ~ .vex-accordion-item {
    border-top-color: var(--vex-border-clr-base);
  }
  .vex-accordion-item-header-button:enabled:hover {
    background-color: var(--vex-clr-neutral-100);
  }
}

//------ variant light ------//

.vex-accordion.--variant-light {
  gap: var(--vex-spacing-2);

  .vex-accordion-item {
    background-color: var(--vex-clr-neutral-50);
  }
  .vex-accordion-item.--expanded {
    background-color: white;
    border-color: var(--vex-border-clr-base);
  }
}
</style>
