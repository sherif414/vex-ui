<script setup lang="ts">
import { useCollection, useComputed, useID, useTemplateRef } from '@/composables'
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
  icon: (props: {}) => any
  suffix: (props: {}) => any
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const {
  CONTENT_ID,
  activeItemId: [, setActiveItemId],
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

const index = useComputed(() => getItems().indexOf(itemData))
const isSelected = selected
  ? useComputed(() => {
      if (!p.value) return false
      const _selected = selected()
      return Array.isArray(_selected) ? _selected.includes(p.value) : _selected === p.value
    })
  : useComputed(() => undefined)
</script>

<template>
  <button
    tabindex="-1"
    :ref="setItemEl"
    :id="`${CONTENT_ID}-${index}`"
    :disabled="p.disabled"
    :role="itemType()"
    :aria-checked="isSelected"
    :class="['vex-menu-item', { '--checked': isSelected }]"
    @focus="setActiveItemId(index)"
    @click="
      () => {
        // safari doesn't always focus when buttons are clicked so we manually focus
        ItemEl()?.focus({ preventScroll: true })
        if (setSelected && !isTrigger && p.value) {
          setSelected(p.value)
        }
      }
    "
  >
    <div class="vex-menu-item-icon">
      <slot name="icon">
        <CheckIcon style="width: 12px; height: 12px" v-if="isSelected" />
      </slot>
    </div>

    <div class="vex-menu-item-content">
      <slot />
    </div>

    <div class="vex-menu-item-suffix">
      <slot name="suffix">
        <ChevronRightIcon style="width: 12px; height: 12px" v-if="isTrigger" />
      </slot>
    </div>
  </button>
</template>
