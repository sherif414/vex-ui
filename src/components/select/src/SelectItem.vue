<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onUnmounted } from 'vue'
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

const listContext = inject(SELECTION_INJECTION_KEY, null)

if (!listContext) {
  throw new Error(`[vex] <SelectItem> is missing a <Select> parent component.`)
}
listContext.register(p.value)
onUnmounted(() => listContext.unRegister(p.value))

//----------------------------------------------------------------------------------------------------
// 📌 selection
//----------------------------------------------------------------------------------------------------

const isSelected = computed<boolean>(() =>
  Array.isArray(listContext.selectedItems.value)
    ? listContext.selectedItems.value.includes(p.value)
    : listContext.selectedItems.value === p.value
)

function select() {
  listContext?.onSelect(p.value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    select()
  }
}
</script>

<template>
  <div
    tabindex="-1"
    role="option"
    @click="select"
    @keydown="onKeydown"
    :inert="p.disabled"
    :aria-selected="isSelected"
    :class="['vex-list-item', { 'vex-selected': isSelected }]"
  >
    <slot />
    <!-- <IconCheckCircle v-show.lazy="isSelected" /> -->
    <IconCheck v-show.lazy="isSelected" />
  </div>
</template>
