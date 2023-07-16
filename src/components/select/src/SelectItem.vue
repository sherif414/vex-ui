<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { SELECTION_INJECTION_KEY } from '@/composables'
import { IconCheckCircle, IconCheck } from '@/icons'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether the item is disabled.
     */
    disabled?: boolean

    /**
     * specifies the item's value,
     * the value needs to be unique from
     * other sibling items.
     */
    value: string
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------

const context = inject(SELECTION_INJECTION_KEY, null)

if (!context) {
  throw new Error(`[vex] <SelectItem> is missing a <Select> parent component.`)
}
context.register(p.value)
onBeforeUnmount(() => context.unRegister(p.value))

//----------------------------------------------------------------------------------------------------

const isSelected = computed<boolean>(() =>
  Array.isArray(context.selectedItems.value)
    ? context.selectedItems.value.includes(p.value)
    : context.selectedItems.value === p.value
)

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    context?.onSelect(p.value)
  }
}

const modifierClasses = computed(() => ['vex-select-item', { '--selected': isSelected.value }])
</script>

<template>
  <div
    tabindex="-1"
    role="option"
    @click="context?.onSelect(p.value)"
    @keydown="onKeydown"
    :inert="p.disabled"
    :aria-selected="isSelected"
    :class="modifierClasses"
  >
    <slot />
    <!-- <IconCheckCircle v-show.lazy="isSelected" /> -->
    <IconCheck v-show.lazy="isSelected" />
  </div>
</template>
