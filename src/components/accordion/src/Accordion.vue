<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useListNavigation } from '@/composables'
import { ACCORDION_CONTEXT, type ActiveIndex } from '.'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------------------------
// 📌 keyboard & focus management
//----------------------------------------------------------------------------------------------------

const { onKeydown } = useListNavigation(CHILDREN_SELECTOR, p.loop)

//----------------------------------------------------------------------------------------------------
// 📌 context provider
//----------------------------------------------------------------------------------------------------

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

provide(ACCORDION_CONTEXT, {
  activeIndex,
  getIndex,
  isChevron: () => !p.hideArrow,
  arrowPosition: () => p.arrowPosition,
})

//----------------------------------------------------------------------------------------------------
// 📌 classes
//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => {
  return ['vex-accordion', `--variant-${p.variant}`]
})
</script>

<template>
  <div :class="modifierClasses" @keydown="onKeydown">
    <slot />
  </div>
</template>
