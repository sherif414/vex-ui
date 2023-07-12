<script setup lang="ts">
import { computed, inject, toRef } from 'vue'
import { IconCheck } from '@/icons'
import { CHIP_GROUP_INJECTION_KEY } from '..'
import { TransitionExpand } from '@/transitions'
import { getRandomString } from '@/composables/helpers'

//==================================================
// 📌 component meta
//==================================================

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the chip's value,
     * note that this must be ***unique*** from other sibling chips
     * @required when used within `ChipGroup`
     */
    value?: string

    /**
     * whether the chip is checked/unchecked
     */
    modelValue?: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const slots = defineSlots<{
  default: (props: {}) => any
}>()

//==================================================
// 📌 context injector
//==================================================

const ctx = inject(CHIP_GROUP_INJECTION_KEY, null)
const isWithinGroup = !!ctx

if (isWithinGroup && !p.value) {
  throw new Error('[vex] <Chip> has a parent <ChipGroup> but does not have a value prop')
}

const isMultiple = toRef(ctx?.multiple)
const groupName = toRef(ctx?.groupName)
const selected = toRef(ctx?.selected)

//==================================================
// 📌 v-model
//==================================================

const isChecked = computed<boolean>(() => {
  if (!isWithinGroup) return !!p.modelValue

  return Array.isArray(selected.value)
    ? selected.value.includes(p.value!)
    : selected.value === p.value
})

function onChange(e: Event): void {
  if (!p.value) return

  isWithinGroup
    ? ctx?.onEmit((e.target as HTMLInputElement).value)
    : emit('update:modelValue', (e.target as HTMLInputElement).checked)
}

//==================================================
// 📌 attrs
//==================================================

const INPUT_ID = `chip-${getRandomString(6)}`
const inputType = computed<'checkbox' | 'radio'>(() =>
  !isWithinGroup || isMultiple.value ? 'checkbox' : 'radio'
)

const rootClasses = computed(() => [
  'vex-chip',
  {
    '--checked': isChecked.value,
    '--checkable': !!p.value,
  },
])
</script>

<template>
  <!-- input -->
  <input
    class="vex-sr-only"
    @change="onChange"
    :id="INPUT_ID"
    :name="groupName"
    :type="inputType"
    :value="p.value"
    :checked="isChecked"
  />

  <label :for="INPUT_ID" :class="rootClasses" v-bind="$attrs">
    <!-- check icon -->

    <TransitionExpand transition-prop="width">
      <IconCheck aria-hidden="true" class="vex-chip-icon" v-show="isChecked" />
    </TransitionExpand>

    <!-- label -->

    <span class="vex-chip-content">
      <slot />
    </span>
  </label>
</template>
