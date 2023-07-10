<script setup lang="ts">
import { inject, computed, toRef, toValue } from 'vue'
import TransitionExpand from './TransitionExpand.vue'
import { IconArrowDown } from '../icons'
import { getRandomString } from '@/composables/helpers'
import { ACCORDION_INJECTION_KEY } from '.'

//==================================================
// 📌 component meta
//==================================================

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

const slots = defineSlots<{
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

//==================================================
// 📌 context
//==================================================

const ctx = inject(ACCORDION_INJECTION_KEY, null)

if (!ctx) {
  throw new Error('[vex] <AccordionItem> is missing an <Accordion> parent component.')
}

const hideArrow = toRef(ctx.arrow)
const arrowPosition = toRef(ctx.arrowPosition)
const activeIndex = toRef(ctx.activeIndex)
const index = toValue(ctx.getIndex())

//==================================================
// 📌 expand/collapse
//==================================================

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
</script>

<template>
  <div :class="['vex-accordion-item', { '--open': isExpanded }]">
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
            v-if="arrowPosition === 'start' && !hideArrow"
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
            v-if="arrowPosition === 'end' && !hideArrow"
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

<style lang="scss">
.vex-accordion-item {
  transition-property: color, background-color, border-color, outline-color;
  transition-timing-function: var(--vex-transition-easing);
  transition-duration: 150ms;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: var(--vex-border-radius-sm);
  gap: 0;
}

//------ header ------//

.vex-accordion-item-header {
  font-weight: inherit;
  font-family: inherit;
  font-size: var(--vex-font-size-sm);
  border-radius: var(--vex-border-radius-sm);
  margin: 0;

  &-button {
    display: flex;
    align-items: center;
    gap: var(--vex-spacing-4);
    width: 100%;
    padding: var(--vex-spacing-3) var(--vex-spacing-4);
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    appearance: none;
    border-radius: inherit;
    border: none;
    cursor: pointer;
    background-color: transparent;
    text-align: start;

    &:disabled {
      cursor: not-allowed;
      color: var(--vex-clr-on-disabled);
    }

    &:focus-visible {
      outline: 1px solid var(--vex-clr-primary-400);
    }

    &-content {
      flex-grow: 1;
    }
  }

  &-chevron {
    transition: transform 300ms var(--vex-transition-easing);
    width: 16px;
    height: 16px;
    flex-shrink: 0;

    .vex-accordion-item.--open & {
      transform: rotate(180deg);
    }
  }
}

//------ content ------//

.vex-accordion-item-content {
  will-change: height;
  font-size: var(--vex-font-size-sm);

  &-wrapper {
    padding: var(--vex-spacing-1) var(--vex-spacing-4) var(--vex-spacing-3)
      var(--vex-spacing-4);
  }
}
</style>
