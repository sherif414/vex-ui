<script setup lang="ts">
import { provide, toRef, watch } from 'vue'
import type { ChipGroupContext, SelectedChips } from './types'
import { getRandomString } from '@/composables/helpers'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    /**
     * whether to allow multiple chips to be checked at the same time
     * @default false
     */
    multiple?: boolean

    /**
     * specifies the `name` prop for descendent `Chip` components
     * @default auto generated random string
     */
    name?: string

    /**
     * specifies the currently checked chips, this should be a string array if
     * `multiple` prop is set to true, and a string otherwise.
     */
    modelValue?: SelectedChips
  }>(),
  {
    multiple: false,
    name: () => `chip-group-${getRandomString(6)}`,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value?: SelectedChips): void
}>()

/**********************************
 * 📌 provide context to children
 ***********************************/

const multiple = toRef(props, 'multiple')

watch(multiple, (val) => {
  emit('update:modelValue', val ? [] : undefined)
})

provide<ChipGroupContext>('vex-chip-group', {
  groupName: toRef(props, 'name'),
  multiple,
  handleEmit,
  selectedChips: toRef(props, 'modelValue', multiple.value ? [] : undefined),
})

function handleEmit(value: string) {
  if (!multiple.value) {
    emit('update:modelValue', value)
    return
  }

  props.modelValue?.includes(value)
    ? emit(
        'update:modelValue',
        props.modelValue.filter((v) => v !== value)
      )
    : emit('update:modelValue', [...props.modelValue, value])
}
</script>

<template>
  <div class="vex-chip-group">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.vex-chip-group {
  display: flex;
  flex-wrap: wrap;
  padding: var(--vex-spacing-1);
  gap: var(--vex-spacing-2);
}
</style>
