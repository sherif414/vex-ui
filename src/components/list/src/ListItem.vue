<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { SELECTION_INJECTION_KEY } from '@/composables'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether the item is disabled
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

defineSlots<{
  default: (props: { isSelected: boolean }) => any
}>()

//----------------------------------------------------------------------------------------------------

const context = inject(SELECTION_INJECTION_KEY, null)

if (!context) {
  throw new Error(`[vex] <ListItem> is missing a <List> parent component.`)
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
  if (e.key === ' ' || e.key === 'Enter') return
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return

  e.preventDefault()
  context?.onSelect(p.value)
}

const modifierClasses = computed(() => ['vex-list-item', { '--selected': isSelected.value }])
</script>

<template>
  <li
    tabindex="0"
    @click="context?.onSelect(p.value)"
    @keydown="onKeydown"
    :inert="p.disabled"
    :aria-selected="isSelected"
    :class="modifierClasses"
  >
    <slot :isSelected="isSelected" />
  </li>
</template>
