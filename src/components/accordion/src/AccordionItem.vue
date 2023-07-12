<script setup lang="ts">
import { inject, computed, toRef, toValue } from 'vue'
import { TransitionExpand } from '@/transitions'
import { IconArrowDown } from '@/icons'
import { getRandomString } from '@/composables/helpers'
import { ACCORDION_CONTEXT } from '.'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the content shown while the item is expanded
     */
    content?: string

    /**
     * specifies the item header text
     */
    header?: string

    /**
     * whether the item should be initially expanded
     */
    initiallyExpanded?: boolean

    /**
     * expands the item and prevents it from being collapsed
     */
    alwaysExpanded?: boolean

    /**
     * disables the item and prevents interaction with it
     */
    disabled?: boolean

    /**
     * specifies the heading `<h1>, <h2> ..etc` level
     * @default '3'
     */
    headingLevel?: '1' | '2' | '3' | '4' | '5' | '6'
  }>(),
  {
    headingLevel: '3',
  }
)

defineSlots<{
  header(props: { isExpanded: boolean }): any
  default(props: { isExpanded: boolean }): any
  iconAppend(props: { isExpanded: boolean }): any
  iconPrepend(props: { isExpanded: boolean }): any
}>()

const emit = defineEmits<{
  toggle: [expanded: boolean]
}>()

const heading = computed(() => `h${p.headingLevel}` as const)
const PANEL_ID = `accordion-item-panel-${getRandomString(6)}`
const TRIGGER_ID = `accordion-item-controls-${getRandomString(6)}`

//----------------------------------------------------------------------------------------------------
// 📌 context
//----------------------------------------------------------------------------------------------------

const ctx = inject(ACCORDION_CONTEXT, null)

if (!ctx) {
  throw new Error('[vex] <AccordionItem> is missing an <Accordion> parent component.')
}

const isChevron = toRef(ctx.isChevron)
const arrowPosition = toRef(ctx.arrowPosition)
const activeIndex = toRef(ctx.activeIndex)
const index = toValue(ctx.getIndex())

//----------------------------------------------------------------------------------------------------
// 📌 expand/collapse
//----------------------------------------------------------------------------------------------------

if (p.initiallyExpanded) {
  activeIndex.value instanceof Set
    ? activeIndex.value.add(index)
    : (activeIndex.value = index)
}

const isActive = computed<boolean>(() =>
  activeIndex.value instanceof Set
    ? activeIndex.value.has(index)
    : activeIndex.value === index
)

const isExpanded = computed<boolean>(() => p.alwaysExpanded || isActive.value)

function onToggle() {
  if (p.alwaysExpanded) return

  if (activeIndex.value instanceof Set) {
    isActive.value ? activeIndex.value.delete(index) : activeIndex.value.add(index)
  } else {
    activeIndex.value = isActive.value ? undefined : index
  }
  emit('toggle', isExpanded.value)
}

//----------------------------------------------------------------------------------------------------
// 📌 classes
//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => {
  return ['vex-accordion-item', { '--expanded': isExpanded }]
})
</script>

<template>
  <div :class="modifierClasses">
    <!-- header -->

    <Component :is="heading" class="vex-accordion-item-header">
      <button
        type="button"
        class="vex-accordion-item-header-button"
        @click="onToggle"
        :aria-expanded="isExpanded"
        :aria-disabled="p.alwaysExpanded || p.disabled"
        :disabled="p.disabled"
        :aria-controls="PANEL_ID"
        :id="TRIGGER_ID"
      >
        <slot name="iconPrepend" :isExpanded="isExpanded">
          <IconArrowDown
            v-if="isChevron && arrowPosition === 'start'"
            class="vex-accordion-item-header-chevron"
            aria-hidden="true"
          />
        </slot>
        <span class="vex-accordion-item-header-button-content">
          <slot name="header" :isExpanded="isExpanded">
            {{ p.header }}
          </slot>
        </span>
        <slot name="iconAppend" :isExpanded="isExpanded">
          <IconArrowDown
            v-if="isChevron && arrowPosition === 'end'"
            class="vex-accordion-item-header-chevron"
            aria-hidden="true"
          />
        </slot>
      </button>
    </Component>

    <!-- content -->

    <TransitionExpand>
      <div
        v-show.lazy="isExpanded"
        class="vex-accordion-item-content"
        role="region"
        :id="PANEL_ID"
        :aria-labelledby="TRIGGER_ID"
      >
        <div class="vex-accordion-item-content-wrapper">
          <slot :is-expanded="isExpanded">
            {{ p.content }}
          </slot>
        </div>
      </div>
    </TransitionExpand>
  </div>
</template>
