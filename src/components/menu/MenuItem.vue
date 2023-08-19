<script setup lang="ts">
import { useCollection, useMemo, useID, useTemplateRef } from '@/composables'
import { injectGroupContext, injectContentContext, injectTriggerContext } from './context'
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    disabled?: boolean
    closeOnClick?: boolean
    value?: string
  }>(),
  {}
)

defineSlots<{
  prefix: (props: {}) => any
  suffix: (props: {}) => any
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const {
  CONTENT_ID,
  activeItemId: [, setActiveItemIndex],
} = injectContentContext('MenuItem')

const groupCtx = injectGroupContext()

const [ItemEl, setItemEl] = useTemplateRef('MenuItem')
const itemData = { id: useID(), ref: ItemEl, disabled: () => p.disabled }
const { getItems } = useCollection(itemData)

//----------------------------------------------------------------------------------------------------
// 📌 selection
//----------------------------------------------------------------------------------------------------

const [selected, setSelected] = groupCtx?.selection ?? []
const itemType = groupCtx?.itemType ?? (() => 'menuitem')
const isTrigger = !!injectTriggerContext()

const index = useMemo(() => getItems().indexOf(itemData))
const isSelected = selected
  ? useMemo(() => {
      if (!p.value) return false
      const _selected = selected()
      return Array.isArray(_selected) ? _selected.includes(p.value) : _selected === p.value
    })
  : () => undefined
</script>

<template>
  <button
    tabindex="-1"
    :ref="setItemEl"
    :id="`${CONTENT_ID}-${index()}`"
    :disabled="p.disabled"
    :role="itemType()"
    :aria-checked="isSelected()"
    :class="['vex-menu-item', { '--checked': isSelected() }]"
    @focus="setActiveItemIndex(index())"
    @click="
      () => {
        if (setSelected && !isTrigger && p.value) {
          setSelected(p.value)
        }
      }
    "
  >
    <div class="vex-menu-item-prefix">
      <slot name="prefix">
        <CheckIcon
          v-if="isSelected() && itemType() === 'menuitemcheckbox'"
          class="vex-menu-item-prefix-check"
        />
        <svg
          v-else-if="isSelected() && itemType() === 'menuitemradio'"
          class="vex-menu-item-prefix-check"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="50%" cy="50%" r="6" />
        </svg>
      </slot>
    </div>

    <div class="vex-menu-item-content">
      <slot />
    </div>

    <div class="vex-menu-item-suffix">
      <slot name="suffix">
        <ChevronRightIcon v-if="isTrigger" class="vex-menu-item-suffix-chevron" />
      </slot>
    </div>
  </button>
</template>
