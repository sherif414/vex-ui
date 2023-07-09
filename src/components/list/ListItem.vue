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

<style lang="scss">
.vex-list-item {
  min-height: 2rem;
  min-width: max-content;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  gap: var(--vex-spacing-2);
  transition-property: color, background-color;
  transition-timing-function: var(--vex-transition-easing);
  transition-duration: 150ms;
  border-radius: var(--vex-border-radius-md);
  padding: 0;
  padding-inline: var(--vex-spacing-3);

  &:not([inert]):hover {
    background-color: var(--vex-clr-neutral-100);
  }

  &[inert] {
    color: var(--vex-clr-on-disabled);
    cursor: not-allowed;
  }

  &.vex-selected {
    // background-color: var(--vex-clr-neutral-200) !important;
    color: var(--vex-clr-primary);
  }
}
</style>
