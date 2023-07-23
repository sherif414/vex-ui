<script setup lang="ts">
import { inject, computed, toRef } from 'vue'
import { useID } from '@/composables'
import { ACCORDION_CTX } from '.'
import { TransitionExpand } from '@/transitions'
import { IconArrowDown } from '@/icons'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * expands the item and prevents it from being collapsed
     */
    alwaysExpanded?: boolean

    /**
     * prevents the item from being collapsed/expanded
     */
    disabled?: boolean

    /**
     * specifies the heading level
     * @default 'h3'
     */
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

    /**
     * specifies the accordion header text
     */
    header?: string
  }>(),
  {
    headingLevel: 'h3',
  }
)

defineSlots<{
  default?: (props: {}) => any
  header?: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 inject
//----------------------------------------------------------------------------------------------------

const ctx = inject(ACCORDION_CTX, null)

if (!ctx) {
  throw new Error('[vex] <AccordionItem> is missing an <Accordion> parent component.')
}

const { onUpdateModel, expandedItems, getIndex } = ctx

//----------------------------------------------------------------------------------------------------
// 📌 provide
//----------------------------------------------------------------------------------------------------

const index = getIndex()

const isExpanded = computed<boolean>(() => {
  if (p.alwaysExpanded) return true
  return Array.isArray(expandedItems.value)
    ? expandedItems.value.includes(index)
    : expandedItems.value === index
})

const contentID = useID()
const triggerID = useID()
const isDisabled = toRef(() => p.disabled)

const modifierClasses = computed(() => {
  return ['vex-accordion-item', { '--expanded': isExpanded.value }]
})
</script>

<template>
  <div :class="modifierClasses">
    <Component :is="p.headingLevel" class="vex-accordion-item-trigger">
      <button
        type="button"
        class="vex-accordion-item-trigger-button"
        @click="onUpdateModel(index)"
        :aria-expanded="isExpanded"
        :aria-disabled="isDisabled"
        :disabled="isDisabled"
        :aria-controls="contentID"
        :id="triggerID"
      >
        <slot name="header">
          {{ p.header }}
        </slot>
        <IconArrowDown width="16" height="16" class="vex-accordion-item-trigger-button-chevron" />
      </button>
    </Component>

    <TransitionExpand>
      <div
        :id="contentID"
        :aria-labelledby="triggerID"
        class="vex-accordion-item-content"
        role="region"
        v-if="isExpanded"
      >
        <div>
          <slot />
        </div>
      </div>
    </TransitionExpand>
  </div>
</template>
