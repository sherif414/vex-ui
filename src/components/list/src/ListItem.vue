<script setup lang="ts">
import { computed, inject } from 'vue'
import { LIST_INJECTION_KEY } from '.'

//==================================================
// 📌 component meta
//==================================================

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

const ctx = inject(LIST_INJECTION_KEY)

//==================================================
// 📌 selection
//==================================================

const selected = computed(() =>
  Array.isArray(ctx.selectedItems.value)
    ? ctx.selectedItems.value.includes(p.value)
    : ctx.selectedItems.value === p.value
)

function onSelect() {
  ctx.select(p.value)
}

//==================================================
// 📌 keyboard interactions
//==================================================

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    ctx.select(p.value)
  }
}
</script>

<template>
  <li
    tabindex="0"
    @click="onSelect"
    @keydown="onKeydown"
    :inert="p.disabled"
    :aria-selected="selected"
    :class="['vex-list-item', { 'vex-selected': selected }]"
  >
    <slot />
  </li>
</template>
