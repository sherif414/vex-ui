<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import type { AccordionInjectedState } from './types'
import TransitionExpand from './TransitionExpand.vue'
import { IconArrowDown } from '../icons'
import { getRandomString } from '@/composables/helpers'

/**********************************
 * 📌 component meta
 ***********************************/

//TODO: does this custom tag `@required` cause problems?
const props = withDefaults(
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
     * @default false
     */
    initiallyExpanded?: boolean

    /**
     * expands the item and prevents it from being collapsed
     * @default false
     */
    alwaysExpanded?: boolean

    /**
     * disables the item and prevents interaction with it
     * @default false
     */
    disabled?: boolean

    /**
     * specifies the heading `<h1>, <h2> ..etc` level
     * @required
     */
    headingLevel: '1' | '2' | '3' | '4' | '5' | '6'
  }>(),
  {
    initiallyExpanded: false,
    disabled: false,
    alwaysExpanded: false,
  }
)

const emit = defineEmits(['toggle'])

/**********************************
 * 📌 attrs
 ***********************************/

const heading = computed(() => `h${props.headingLevel}` as const)
const panelID = `accordion-item-panel-${getRandomString(6)}`
const buttonID = `accordion-item-controls-${getRandomString(6)}`

/**********************************
 * 📌 expand/collapse logic
 ***********************************/

const { activeIndex, arrow, arrowPosition, getIndex } = inject(
  'vex-accordion-injected-state'
) as AccordionInjectedState

const index = getIndex()

if (props.initiallyExpanded) {
  activeIndex.value instanceof Set
    ? activeIndex.value.add(index)
    : (activeIndex.value = index)
}

/** whether this accordion item index is active */
const isActive = computed<boolean>(() => {
  if (activeIndex.value instanceof Set) {
    return activeIndex.value.has(index)
  }

  return activeIndex.value === index
})

const isExpanded = computed<boolean>(() => props.alwaysExpanded || isActive.value)

function handleClick() {
  if (props.alwaysExpanded) return

  emit('toggle')

  if (activeIndex.value instanceof Set) {
    isActive.value ? activeIndex.value.delete(index) : activeIndex.value.add(index)
    return
  }

  activeIndex.value = isActive.value ? undefined : index
}
</script>

<template>
  <div :class="['vex-accordion-item', { 'vex-accordion-item-open': isExpanded }]">
    <!-- header -->

    <Component class="vex-accordion-item-header" :is="heading">
      <button
        type="button"
        class="vex-accordion-item-button"
        @click="handleClick"
        :aria-expanded="isExpanded"
        :aria-disabled="props.alwaysExpanded || props.disabled"
        :disabled="props.disabled"
        :aria-controls="panelID"
        :id="buttonID"
      >
        <slot name="iconPrepend" :isExpanded="isExpanded">
          <IconArrowDown
            v-if="arrowPosition === 'start' && arrow"
            class="vex-accordion-item-icon"
          />
        </slot>
        <span>
          <slot name="header" :isExpanded="isExpanded">
            {{ props.header }}
          </slot>
        </span>
        <slot name="iconAppend" :isExpanded="isExpanded">
          <IconArrowDown
            v-if="arrowPosition === 'end' && arrow"
            class="vex-accordion-item-icon"
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
        :id="panelID"
        :aria-labelledby="buttonID"
      >
        <div>
          <slot>
            {{ props.content }}
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

  &-header {
    all: unset;
    margin: 0;
    font-weight: normal;
    font-size: inherit;
  }

  &-content {
    will-change: height;

    & > div {
      padding: var(--vex-spacing-1) var(--vex-spacing-4) var(--vex-spacing-3)
        var(--vex-spacing-4);
    }
  }

  &-button {
    all: unset;
    color: inherit;
    font-family: inherit;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: var(--vex-spacing-4);
    width: 100%;
    padding: var(--vex-spacing-3) var(--vex-spacing-4);
    outline: 1px solid transparent;
    border-style: none;
    cursor: pointer;
    background-color: transparent;
    box-sizing: border-box;
    text-align: start;

    > span {
      flex-grow: 1;
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--vex-clr-on-disabled);
    }

    &:focus-visible {
      outline-color: var(--vex-clr-primary-400);
    }
  }

  &-icon {
    transition-property: transform;
    transition-timing-function: var(--vex-transition-easing);
    transition-duration: 300ms;
    width: 16px;
    height: 16px;
    flex-shrink: 0;

    .vex-accordion-item-open & {
      transform: rotate(180deg);
    }
  }
}
</style>
