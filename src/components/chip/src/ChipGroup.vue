<script setup lang="ts">
import { provide, watch } from 'vue'
import { type selected, CHIP_GROUP_INJECTION_KEY } from '..'
import { getRandomString } from '@/composables/helpers'

//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    /**
     * whether to allow multiple chips to be checked at the same time
     * @defaultValue false
     */
    multiple?: boolean

    /**
     * specifies the `name` attr for descendent `Chip` components
     * @defaultValue auto generated random string
     */
    name?: string

    /**
     * specifies the currently checked chips, this should be a string array if
     * `multiple` prop is set to true, and a string otherwise.
     */
    modelValue?: selected
  }>(),
  {
    multiple: false,
    name: () => `chip-group-${getRandomString(6)}`,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value?: selected): void
}>()

const slots = defineSlots<{
  default: (props: {}) => any
}>()

//==================================================
// 📌 context provider
//==================================================

provide(CHIP_GROUP_INJECTION_KEY, {
  groupName: () => p.name,
  multiple: () => p.multiple,
  onEmit,
  selected: () => p.modelValue,
})

function onEmit(value: string) {
  if (!p.modelValue) {
    emit('update:modelValue', p.multiple ? [value] : value)
    return
  }

  if (!Array.isArray(p.modelValue)) {
    emit('update:modelValue', value)
    return
  }

  p.modelValue.includes(value)
    ? emit(
        'update:modelValue',
        p.modelValue.filter((v) => v !== value)
      )
    : emit('update:modelValue', [...p.modelValue, value])
}

watch(
  () => p.multiple,
  (val) => {
    emit('update:modelValue', val ? [] : undefined)
  }
)
</script>

<template>
  <div class="vex-chip-group">
    <slot></slot>
  </div>
</template>
