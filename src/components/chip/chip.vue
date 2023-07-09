<script setup lang="ts">
import { computed, inject } from 'vue'
import { IconCheck } from '../icons'
import type { ChipGroupContext } from './types'
import TransitionExpand from '../accordion/TransitionExpand.vue'
import { getRandomString } from '../../composables/helpers'

/**********************************
 * 📌 component meta
 **********************************/

const props = withDefaults(
  defineProps<{
    /**
     * specifies the chip's value,
     * note that this must be ***unique*** from other sibling chips
     * @required if not specified the chip will be uncheckable
     */
    value?: string

    /**
     * whether the chip is checked/unchecked
     */
    modelValue?: boolean

    /**
     * specifies the chip name, this is similar to `<radio>` element `name` attribute.
     * note that the `name` prop from a parent `ChipGroup` component will override this prop.
     */
    name?: string
  }>(),
  {}
)

const emit = defineEmits(['update:modelValue'])
const { multiple, groupName, handleEmit, selectedChips } = inject<ChipGroupContext>(
  'vex-chip-group',
  {}
)

/**********************************
 * 📌 toggle chip on/off logic
 ***********************************/

// if there are no injected data this means the chip is not used
// within a ChipGroup component
const isWithinGroup = !!selectedChips

const isChecked = computed(() => {
  if (!isWithinGroup) return !!props.modelValue

  return Array.isArray(selectedChips.value)
    ? selectedChips.value.includes(props.value)
    : selectedChips.value === props.value
})

function handleChange(e: Event) {
  if (!props.value) return

  isWithinGroup
    ? handleEmit((e.target as HTMLInputElement).value)
    : emit('update:modelValue', (e.target as HTMLInputElement).checked)
}

/**********************************
 * 📌 input attrs
 ***********************************/

const inputID = `chip-${getRandomString(6)}`
const inputName = computed(() => groupName?.value || props.name)
const inputType = computed(() =>
  !isWithinGroup || multiple.value ? 'checkbox' : 'radio'
)

/**********************************
 * 📌 classes
 **********************************/

const classes = computed(() => [
  'vex-chip',
  {
    'vex-chip-checked': isChecked.value,
    'vex-chip-checkable': props.value,
  },
])
</script>

<template>
  <div>
    <!-- input -->
    <input
      ref="inputEl"
      class="vex-chip-input vex-sr-only"
      @change="handleChange"
      :id="inputID"
      :name="inputName"
      :type="inputType"
      :value="props.value"
      :checked="isChecked"
    />
    <label :for="inputID" :class="classes">
      <!-- check icon -->
      <TransitionExpand transition-prop="width">
        <IconCheck aria-hidden="true" class="vex-chip-check" v-show="isChecked" />
      </TransitionExpand>

      <!-- label -->
      <span class="vex-chip-label">
        <slot />
      </span>
    </label>
  </div>
</template>

<style lang="scss">
.vex-chip {
  padding: 0 var(--vex-spacing-2);
  border-radius: var(--vex-border-radius-rounded);
  height: 2rem;
  font-size: var(--vex-font-size-sm);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  transition: all 150ms ease;
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-sizing: border-box;
  border: 1px solid var(--vex-border-clr-base);
  background-color: transparent;
  color: var(--vex-text-clr-default);
  -webkit-tap-highlight-color: transparent;

  &-checked {
    background-color: var(--vex-clr-primary-200);
    color: var(--vex-clr-primary-400);
    border-color: transparent;
  }

  &-checkable {
    cursor: pointer;
  }

  &-input:focus-visible + & {
    outline-color: var(--vex-border-clr-active);
  }

  &-label {
    padding-inline: var(--vex-spacing-2);
  }
}
</style>
