<script lang="ts" setup>
import { Input, Tag } from '@/components'
import { useFloating, useListNavigation, useListSelection } from '@/composables'
import { getRandomString } from '@/composables/helpers'
import { useElementSize, useEventListener } from '@vueuse/core'
import { nextTick, reactive, ref, computed, toRef, watch } from 'vue'
import { IconArrowDown } from '@/icons'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

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
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'update:modelValue', value?: typeof p.modelValue): void
}>()

//----------------------------------------------------------------------------------------------------

const CONTROLS_ID = 'select-controls-' + getRandomString(6)
const COMBOBOX_ID = 'select-' + getRandomString(6)
const CHILDREN_SELECTOR = '.vex-list-item:not([inert])'

//----------------------------------------------------------------------------------------------------
// 📌 floating
//----------------------------------------------------------------------------------------------------

const FloatingEl = ref<HTMLElement | null>(null)
const InputEl = ref<HTMLElement | null>(null)
const isFloatingElVisible = ref(false)

const _options = reactive({
  placement: 'bottom-start' as const,
  toggleAction: 'click' as const,
  autoMinWidth: true,
  offset: 4,
  hideOnClick: toRef(() => !p.multiple),
})

const { floatingStyles } = useFloating(isFloatingElVisible, InputEl, FloatingEl, _options)

//----------------------------------------------------------------------------------------------------
// 📌 focus & keyboard interactions
//----------------------------------------------------------------------------------------------------

const { onKeydown } = useListNavigation(CHILDREN_SELECTOR, true)

useEventListener(InputEl, 'keydown', (e: KeyboardEvent) => {
  if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) return
  if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return

  e.preventDefault()
  isFloatingElVisible.value = true
  nextTick(() => FloatingEl.value?.focus())
})

useEventListener(FloatingEl, 'keydown', (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return

  e.preventDefault()
  isFloatingElVisible.value = true
  InputEl.value?.focus()
})

function onFloatingElFocus() {
  const selectedEl = FloatingEl.value?.querySelector<HTMLElement>(
    '.vex-list-item.vex-selected:not([inert])'
  )
  if (selectedEl) selectedEl.focus()
  else FloatingEl.value?.querySelector<HTMLElement>(CHILDREN_SELECTOR)?.focus()
}

//----------------------------------------------------------------------------------------------------

const inputSize = useElementSize(InputEl)
const selected = computed<typeof p.modelValue>({
  get: () => p.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// reset invalid modelValues
if (p.multiple && !Array.isArray(selected.value)) selected.value = []
if (!p.multiple && Array.isArray(selected.value)) selected.value = undefined

useListSelection(selected, () => p.multiple)

const inputValue = computed<string | undefined>(() =>
  Array.isArray(selected.value) ? '' : selected.value
)

defineExpose({
  isFloatingElVisible,
  FloatingEl,
  InputEl,
})
</script>

<template>
  <Input
    :ref="(vm)=> InputEl = (vm as InstanceType<typeof Input>)?.InputEl ?? null"
    v-bind="$attrs"
    readonly
    role="combobox"
    aria-haspopup="listbox"
    autocomplete="none"
    :loading="p.loading"
    :id="COMBOBOX_ID"
    :aria-controls="CONTROLS_ID"
    :aria-expanded="isFloatingElVisible"
    :error="p.error"
    :error-message="p.errorMessage"
    :disabled="p.disabled"
    :label="p.label"
    :hint="p.hint"
    :compact="p.compact"
    :model-value="inputValue"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template #suffix>
      <IconArrowDown
        aria-hidden="true"
        class="vex-select-arrow"
        :class="{ 'vex-select-arrow-active': isFloatingElVisible }"
      />
    </template>

    <template #inputContent>
      <div
        v-if="Array.isArray(selected) && selected.length"
        class="vex-select-tag-wrapper"
        :style="{
          width: inputSize.width.value + 'px',
          height: inputSize.height.value + 'px',
          background: '',
        }"
      >
        <Tag border-radius="sm" size="md" v-show="selected.length">
          {{ selected[0] }}
        </Tag>
        <Tag border-radius="sm" size="md" v-show="selected.length > 1">
          +{{ selected.length - 1 }}
        </Tag>
      </div>
    </template>
  </Input>

  <!-- dropdown -->

  <Teleport to="body">
    <Transition name="vex-fade">
      <ul
        v-show="isFloatingElVisible"
        ref="FloatingEl"
        class="vex-list vex-dropdown"
        tabindex="-1"
        role="listbox"
        @focus="onFloatingElFocus"
        @keydown="onKeydown"
        :aria-multiselectable="p.multiple"
        :aria-labelledby="COMBOBOX_ID"
        :id="CONTROLS_ID"
        :style="floatingStyles"
      >
        <slot />
      </ul>
    </Transition>
  </Teleport>
</template>
