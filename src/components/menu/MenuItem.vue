<script setup lang="ts">
import { useCollection, useComputed, useID, useTemplateRef } from '@/composables'
import { onBeforeUnmount, onMounted } from 'vue'
import { useGroupContext, useMenuContentCtx, useMenuTriggerCtx } from './context'
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    disabled?: boolean
    closeOnClick?: boolean
    value: string
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------

const {
  CONTENT_ID,
  activeItemId: [, setActiveItemId],
} = useMenuContentCtx('MenuItem')

const groupCtx = useGroupContext()
const isWithinGroup = !!groupCtx

//----------------------------------------------------------------------------------------------------
// 📌 collection
//----------------------------------------------------------------------------------------------------

const [ItemEl, setItemEl] = useTemplateRef('MenuItem')
const itemData = { id: useID(), ref: ItemEl, disabled: () => p.disabled }
const { getItems } = useCollection(itemData)

//----------------------------------------------------------------------------------------------------
// 📌 selection
//----------------------------------------------------------------------------------------------------

const [selected, setSelected] = groupCtx?.selection ?? []
const itemType = groupCtx?.itemType ?? (() => 'menuitem')
const isTrigger = !!useMenuTriggerCtx()

const index = useComputed(() => getItems().indexOf(itemData))
const isSelected = selected
  ? useComputed(() => {
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
    :class="['vex-menu-item', isTrigger && '--is-trigger']"
    @focus="setActiveItemId(index)"
    @click="
      () => {
        // safari doesn't always focus when buttons are clicked so we manually focus
        ItemEl()?.focus({ preventScroll: true })
        if (setSelected && !isTrigger) {
          setSelected(p.value)
        }
      }
    "
  >
    <div class="vex-menu-item-check">
      <CheckIcon v-if="isSelected" />
    </div>

    <slot />

    <div v-if="isTrigger" class="vex-menu-item-chevron">
      <ChevronRightIcon />
    </div>
  </button>
</template>
