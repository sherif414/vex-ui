<script setup lang="ts">
import { useComputed, useTemplateRef } from '@/composables'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useGroupContext, useMenuContentCxt, useMenuTriggerCtx } from './context'
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
  useMenuCollection,
  activeItemId: [, setActiveItemId],
} = useMenuContentCxt('MenuItem')

const groupCtx = useGroupContext()
const isWithinGroup = !!groupCtx

//----------------------------------------------------------------------------------------------------
// 📌 registration
//----------------------------------------------------------------------------------------------------

const { getItems, register, unregister } = useMenuCollection()
const [ItemEl, setItemEl] = useTemplateRef('MenuItem')

onMounted(() => register(ItemEl()!))
onBeforeUnmount(() => unregister(ItemEl()!))

//----------------------------------------------------------------------------------------------------
// 📌 selection
//----------------------------------------------------------------------------------------------------

const [selected, setSelected] = groupCtx?.selectSignal ?? []
const isTrigger = !!useMenuTriggerCtx()

const index = useComputed(() => getItems().indexOf(ItemEl()!))
const isSelected = selected
  ? useComputed(() => {
      const _selected = selected()
      return Array.isArray(_selected) ? _selected.includes(p.value) : _selected === p.value
    })
  : false

//----------------------------------------------------------------------------------------------------

function onClick() {
  // safari doesn't always focus when buttons are clicked so we manually focus
  ItemEl()?.focus({ preventScroll: true })

  if (!setSelected || !isTrigger) return
  setSelected(p.value)
}
</script>

<template>
  <button
    tabindex="-1"
    :ref="setItemEl"
    :id="`${CONTENT_ID}-${index}`"
    :disabled="p.disabled"
    role="menuitem"
    :class="['vex-menu-item', isTrigger && '--is-trigger']"
    @click="onClick"
    @pointerenter="ItemEl()?.focus({ preventScroll: true })"
    @focus="setActiveItemId(index)"
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
