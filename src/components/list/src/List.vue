<script setup lang="ts">
import { LIST_INJECTION_KEY } from '.'
import { useListNavigation } from '@/composables'
import { provide, watch, toRef } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * specifies the selected item/items
     */
    modelValue?: string | string[]

    /**
     * whether to allow multi-items selection
     */
    multiple?: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
}>()

//===============================================
// 📌 items selection
//===============================================

function select(value: string): void {
  // single-select
  if (!p.multiple && !Array.isArray(p.modelValue)) {
    if (p.modelValue === value) return
    emit('update:modelValue', value)
  }

  // multi-select
  else if (p.multiple && Array.isArray(p.modelValue)) {
    p.modelValue.includes(value)
      ? emit(
          'update:modelValue',
          p.modelValue.filter((v) => v !== value)
        )
      : emit('update:modelValue', [...p.modelValue, value])
  }

  // fallback to fix multiple + non array modelValue
  else emit('update:modelValue', p.multiple ? [value] : value)
}

watch(
  () => p.multiple,
  (val) => emit('update:modelValue', val ? [] : undefined)
)

provide(LIST_INJECTION_KEY, {
  select,
  selectedItems: toRef(() => p.modelValue),
})

//===============================================
// 📌 focus management
//===============================================

const childrenSelector = '.vex-list-item:not([inert])'
const { onKeydown } = useListNavigation(childrenSelector, true)

function onFocus(e: Event) {
  // ;(e.currentTarget as HTMLElement).querySelector<HTMLElement>(childrenSelector)?.focus()
}
</script>

<template>
  <ul
    tabindex="-1"
    class="vex-list"
    @keydown="onKeydown"
    @focus="onFocus"
    :aria-multiselectable="p.multiple"
  >
    <slot />
  </ul>
</template>
