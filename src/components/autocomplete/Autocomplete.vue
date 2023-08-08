<script setup lang="ts">
import { Input, Dropdown, Loader, Floating } from '@/components'
import { computed, nextTick, ref, watch } from 'vue'
import { useEventListener, watchDebounced } from '@vueuse/core'
import { IconChevronUpDown } from '@/icons'
import {
  useComputed,
  useFloating,
  useID,
  useListNavigation,
  useListSelection,
  useRef,
} from '@/composables'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------
const p = withDefaults(
  defineProps<{
    /**
     * display a smaller field
     */
    compact?: boolean

    /**
     * specifies the selected option
     */
    modelValue?: string

    /**
     * specifies the list of all the available options, this will only be used with offline mode,
     * when using online mode use the `getOptions` prop instead.
     */
    options?: string[]

    /**
     * whether the field is disabled
     */
    disabled?: boolean

    /**
     * specifies a custom filtering function.
     *
     * @param query the search query.
     * @param max maximum displayed options count.
     */
    filter?: (query: string, max: number) => string[]

    /**
     * used for custom search logic or online mode.
     */
    getOptions?: (query: string) => Promise<string[]>

    /**
     * use this prop to cleanup pending async work.
     * - if specified, the function will be called before
     * every call to `getOptions` except the first.
     */
    getOptionsCleanup?: () => void

    /**
     * maximum number of options to display.
     * @default 10
     */
    maxDisplayedOptions?: number

    /**
     * the search debounce time in milliseconds.
     * @default 300
     */
    debounce?: number
  }>(),
  {
    debounce: 300,
    maxDisplayedOptions: 10,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value?: string]
}>()

//----------------------------------------------------------------------------------------------------

const TriggerEl = ref<HTMLInputElement | null>(null)
const ListboxEl = ref<HTMLElement | null>(null)
const ListboxItemsElements = ref<HTMLElement[]>([])
const FormEl = computed(() => TriggerEl.value?.form)

const TRIGGER_ID = useID()
const LISTBOX_ID = useID()

const isListboxVisible = ref(false)
const suggestions = ref<string[]>(p.options?.slice(0, p.maxDisplayedOptions) || [])

//----------------------------------------------------------------------------------------------------
// 📌 selection
//----------------------------------------------------------------------------------------------------

const selected = useComputed({
  get: () => p.modelValue,
  set: (val) => {
    if (val !== p.modelValue) {
      emit('update:modelValue', val)
    }
  },
})

//----------------------------------------------------------------------------------------------------
// 📌 keyboard interactions
//----------------------------------------------------------------------------------------------------

useEventListener(TriggerEl, 'keydown', (e: KeyboardEvent) => {
  if (!isListboxVisible.value) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      isListboxVisible.value = true
    }
    return
  }

  if (e.key === 'ArrowDown') {
    setHighlighted(highlighted.value + 1)
    //
  } else if (e.key === 'ArrowUp') {
    setHighlighted(highlighted.value - 1)
    //
  } else if (e.key === 'End') {
    setHighlighted(Infinity)
    //
  } else if (e.key === 'Home') {
    setHighlighted(0)
    //
  } else if (e.key === 'Enter') {
    ListboxItemsElements.value?.[highlighted.value]?.click()
    isListboxVisible.value = false
    //
  } else if (e.key === 'Escape') {
    isListboxVisible.value = false
    e.stopPropagation()
    //
  } else return

  e.preventDefault()
})

//----------------------------------------------------------------------------------------------------
// 📌 highlighting
//----------------------------------------------------------------------------------------------------

const highlighted = ref(-1)

function setHighlighted(index: number): void {
  const itemsLength = ListboxItemsElements.value.length
  if (!itemsLength) return

  if (index >= itemsLength) {
    highlighted.value = 0
    //
  } else if (index < 0) {
    highlighted.value = itemsLength - 1
    //
  } else highlighted.value = index
}

watch(highlighted, (highlighted) => {
  if (highlighted < 0) return
  ListboxItemsElements.value[highlighted]?.scrollIntoView({ block: 'center' })
  TriggerEl.value?.setAttribute('aria-activedescendant', `${LISTBOX_ID}-${highlighted}`)
})

watch(isListboxVisible, (visible) => {
  if (visible) return
  highlighted.value = -1
  TriggerEl.value?.removeAttribute('aria-activedescendant')
})

watch(suggestions, (suggestions) => {
  if (!suggestions.length) return
  highlighted.value = -1
  TriggerEl.value?.removeAttribute('aria-activedescendant')
  ListboxEl.value?.scrollTo({ top: 4 })
})

//----------------------------------------------------------------------------------------------------
// 📌 filter
//----------------------------------------------------------------------------------------------------

const isLoading = ref(false)
const inputValue = useRef(p.modelValue)

watchDebounced(
  inputValue,
  async (query, _, onCleanup) => {
    if (!query) return

    suggestions.value = []
    isListboxVisible.value = true

    if (p.getOptions) {
      isLoading.value = true

      p.getOptionsCleanup && onCleanup(p.getOptionsCleanup)
      suggestions.value = await p.getOptions(query)

      isLoading.value = false
    }

    suggestions.value = p.filter
      ? p.filter(query, p.maxDisplayedOptions)
      : filter(query, p.maxDisplayedOptions)
  },
  { debounce: p.debounce }
)

function filter(query: string, limit: number): string[] {
  return p.options?.filter((op) => op.includes(query)).slice(0, limit) ?? []
}

// reset to the last selected value if the user
// moved focus from the input while typing
function onInputBlur() {
  if (!p.modelValue) return
  inputValue.lay(p.modelValue)
}

watch(selected, (selected) => {
  inputValue.lay(selected)
})

//----------------------------------------------------------------------------------------------------
// 📌 form
//----------------------------------------------------------------------------------------------------

watch(FormEl, (form, _, onCleanup) => {
  if (!form) return

  const reset = () => emit('update:modelValue', undefined)
  form.addEventListener('reset', reset)
  onCleanup(() => form?.removeEventListener('reset', reset))
})

//----------------------------------------------------------------------------------------------------

const { floatingStyles: listboxStyles } = useFloating(TriggerEl, ListboxEl, isListboxVisible, {
  placement: 'bottom-start',
  toggleAction: 'click',
  offset: 4,
  autoMinWidth: true,
  hideOnClick: true,
})
</script>

<template>
  <Input
    v-model="inputValue"
    v-bind="$attrs"
    @blur="onInputBlur"
    :ref="(vm)=> TriggerEl = (vm as InstanceType<typeof Input>)?.InputEl ?? null"
    :aria-expanded="isListboxVisible"
    :aria-controls="LISTBOX_ID"
    :id="TRIGGER_ID"
    :compact="p.compact"
    aria-haspopup="listbox"
    aria-autocomplete="list"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template #suffix>
      <IconChevronUpDown class="vex-autocomplete-arrow" />
    </template>
  </Input>

  <!-- listbox -->

  <Teleport to="body">
    <ul
      v-if="isListboxVisible"
      :style="listboxStyles"
      :aria-describedby="TRIGGER_ID"
      :id="LISTBOX_ID"
      ref="ListboxEl"
      tabindex="-1"
      class="vex-autocomplete-listbox"
    >
      <div v-if="!suggestions.length" class="vex-autocomplete-placeholder">
        <Loader v-if="isLoading" />
        <span v-else>no data</span>
      </div>

      <template v-else>
        <li
          v-for="(item, idx) in suggestions"
          :key="item"
          :id="`${LISTBOX_ID}-${idx}`"
          :data-highlighted="highlighted === idx"
          :data-selected="selected === item"
          @click="selected = item"
          ref="ListboxItemsElements"
          class="vex-autocomplete-listbox-item"
        >
          <slot :item="item">
            {{ item }}
          </slot>
        </li>
      </template>
    </ul>
  </Teleport>
</template>
