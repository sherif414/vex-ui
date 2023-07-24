<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { LIST_CTX } from '.'

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

const ctx = inject(LIST_CTX, null)

if (!ctx) {
  throw new Error(`[vex] <ListItem> is missing a <List> parent component.`)
}
const { setSelected, selected } = ctx

//----------------------------------------------------------------------------------------------------

const isSelected = computed<boolean>(() =>
  Array.isArray(selected.value) ? selected.value.includes(p.value) : selected.value === p.value
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') return
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return

  e.preventDefault()
  setSelected(p.value)
}

const modifierClasses = computed(() => ['vex-list-item', { '--selected': isSelected.value }])
</script>

<template>
  <li
    tabindex="0"
    @click="setSelected(p.value)"
    @keydown="onKeydown"
    :inert="p.disabled"
    :aria-selected="isSelected"
    :class="modifierClasses"
  >
    <slot :isSelected="isSelected" />
  </li>
</template>
