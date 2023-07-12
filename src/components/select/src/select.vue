<script lang="ts" setup>
import { Floating, Input, Tag } from '@/components'
import { useListNavigation, useListSelection } from '@/composables'
import { getRandomString } from '@/composables/helpers'
import { useElementSize, useEventListener } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { IconArrowDown } from '@/icons'

//==================================================
// 📌 component meta
//==================================================

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the select label text
     */
    label?: string

    /**
     * specifies the currently selected option/options
     */
    modelValue?: string | string[]

    /**
     * whether the select is disabled
     */
    disabled?: boolean

    /**
     * whether the select is loading
     */
    loading?: boolean

    /**
     * whether the select is readonly
     */
    readonly?: boolean

    /**
     * whether the selected option is invalid
     */
    error?: boolean

    /**
     * specifies the error message text
     */
    errorMessage?: string

    /**
     * specifies the hint text
     */
    hint?: string

    /**
     * shows a smaller input
     */
    compact?: boolean

    /**
     * whether multiple options can be selected at a time
     */
    multiple?: boolean

    /**
     * all the select items
     */
    items: { label: string; value: string }[]
  }>(),
  {}
)
const emit = defineEmits<{
  (e: 'update:modelValue', value?: string | string[]): void
}>()

const CONTROLS_ID = 'select-controls-' + getRandomString(6)
const COMBOBOX_ID = 'select-' + getRandomString(6)
const CHILDREN_SELECTOR = '.vex-list-item:not([inert])'

//==================================================
// 📌 selection
//==================================================

const { selectedLabels } = useListSelection(p, emit)

//==================================================
// 📌 floating listbox
//==================================================

const isFloatingVisible = ref(false)
const floatingEl = ref<HTMLElement | null>(null)

function updateVisibility(val: boolean) {
  isFloatingVisible.value = val
}

function onFloatingElClick() {
  if (!p.multiple) {
    nextTick(() => (isFloatingVisible.value = false))
  }
}

//==================================================
// 📌 input element
//==================================================

const inputEl = ref<HTMLElement | null>(null)
const inputSize = useElementSize(inputEl)

watch(isFloatingVisible, (val) => {
  if (inputEl.value) inputEl.value.ariaExpanded = `${val}`
})

//==================================================
// 📌 focus management
//==================================================

const { eventListener: onKeydown } = useListNavigation(CHILDREN_SELECTOR, true)

useEventListener(inputEl, 'keydown', (e: KeyboardEvent) => {
  if (e.shiftKey || e.ctrlKey || e.metaKey) return

  if (e.altKey && e.key === 'ArrowDown') {
    isFloatingVisible.value = true
    return
  }

  if (e.altKey && e.key === 'ArrowUp') {
    isFloatingVisible.value = false
    return
  }

  if (!e.altKey && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
    e.preventDefault()
    updateVisibility(true)
    nextTick(() => floatingEl.value?.focus())
    return
  }
})

useEventListener(floatingEl, 'keydown', (e: KeyboardEvent) => {
  if (e.shiftKey || e.ctrlKey || e.metaKey) return

  if (e.altKey && e.key === 'ArrowUp') {
    inputEl.value?.focus()
    return
  }

  if (!e.altKey && e.key === 'Escape') {
    e.preventDefault()
    updateVisibility(false)
    inputEl.value?.focus()
  }
})

function onFloatingElFocus() {
  const selectedEl = floatingEl.value?.querySelector<HTMLElement>(
    '.vex-list-item.vex-selected:not([inert])'
  )
  if (selectedEl) selectedEl.focus()
  else floatingEl.value?.querySelector<HTMLElement>(CHILDREN_SELECTOR)?.focus()
}
</script>

<template>
  <Input
    :ref="(vm)=> inputEl = (vm as InstanceType<typeof Input>)?.inputEl ?? null"
    v-bind="$attrs"
    type="button"
    role="combobox"
    aria-haspopup="listbox"
    autocomplete="none"
    :loading="p.loading"
    :id="COMBOBOX_ID"
    :aria-controls="CONTROLS_ID"
    :aria-expanded="isFloatingVisible"
    :error="p.error"
    :error-message="p.errorMessage"
    :disabled="p.disabled"
    :label="p.label"
    :hint="p.hint"
    :compact="p.compact"
    :model-value="!Array.isArray(selectedLabels) ? selectedLabels : ''"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template #suffix>
      <IconArrowDown
        aria-hidden="true"
        class="vex-select-arrow"
        :class="{ 'vex-select-arrow-active': isFloatingVisible }"
      />
    </template>

    <template #inputContent>
      <div
        v-if="Array.isArray(selectedLabels)"
        :style="{
          width: inputSize.width.value + 'px',
          height: inputSize.height.value + 'px',
        }"
        class="vex-select-tag-wrapper"
      >
        <Tag border-radius="sm" size="sm" v-show="selectedLabels.length">{{
          selectedLabels[0]
        }}</Tag>
        <Tag border-radius="sm" size="sm" v-show="selectedLabels.length > 1"
          >+{{ selectedLabels.length - 1 }}</Tag
        >
      </div>
    </template>

    <!-- dropdown -->

    <template #dropdown>
      <!-- TODO: aria-labelledby is illegal here? -->
      <Floating
        tag="ul"
        tabindex="-1"
        class="vex-list vex-dropdown"
        role="listbox"
        transition="vex-fade"
        :ref="(vm )=> floatingEl = (vm as InstanceType<typeof Floating>)?.floatingEl ?? null"
        @click="onFloatingElClick"
        @update:visible="updateVisibility"
        @focus="onFloatingElFocus"
        @keydown="onKeydown"
        :aria-multiselectable="p.multiple"
        :visible="!p.disabled ? isFloatingVisible : false"
        :reference="inputEl || null"
        :offset="4"
        :aria-labelledby="COMBOBOX_ID"
        :id="CONTROLS_ID"
      >
        <slot />
      </Floating>
    </template>
  </Input>
</template>
