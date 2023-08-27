<script lang="ts">
export interface AutocompleteProps {
  /**
   * display a smaller field
   */
  compact?: boolean

  /**
   * specifies the selected option
   */
  modelValue?: string

  /**
   * specifies the list of all the available options, this will only be used with client mode,
   * when using server mode use the `getOptions` prop instead.
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
   * used for custom search logic or server mode.
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

  /**
   * whether to allow multiselect
   */
  multiselect?: boolean
}
</script>

<script setup lang="ts">
import { Input, Loader } from '@/components'
import { nextTick, ref, watch, computed } from 'vue'
import { useEventListener, watchDebounced, controlledRef, onClickOutside } from '@vueuse/core'
import { IconChevronUpDown } from '@/icons'
import {
  useFloating,
  useVModel,
  useID,
  useRovingFocus,
  useEscapeKey,
  createSelectScope,
  createCollection,
  useClickOutside,
} from '@/composables'
import { isArray, noop } from '@/composables/helpers'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(defineProps<AutocompleteProps>(), {
  debounce: 300,
  maxDisplayedOptions: 10,
})

const emit = defineEmits<{
  'update:modelValue': [value?: string]
}>()

//----------------------------------------------------------------------------------------------------

const TriggerEl = ref<HTMLElement | null>(null)
const ContentEl = ref<HTMLElement | null>(null)
const getFormEl = () => (TriggerEl.value as HTMLInputElement)?.form

const TRIGGER_ID = useID()
const CONTENT_ID = useID()

const isContentOpen = ref(false)
const suggestions = ref<string[]>(p.options?.slice(0, p.maxDisplayedOptions) || [])

const { selected, setSelected, resetSelected } = createSelectScope(
  useVModel(() => p.modelValue),
  {
    deselection: () => true,
    multiselect: () => p.multiselect,
  }
)

const { elements: OptionsElements } = createCollection(ContentEl)

//----------------------------------------------------------------------------------------------------
// 📌 keyboard interactions & visibility
//----------------------------------------------------------------------------------------------------

useRovingFocus(ContentEl, OptionsElements, {
  orientation: () => 'vertical',
})

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    isContentOpen.value = true
    nextTick(() => ContentEl.value?.focus())
  }
}

function onContentKeydown(e: KeyboardEvent) {
  if ([' ', 'Enter'].includes(e.key)) {
    e.preventDefault()
    ;(e.target as HTMLElement).click()
  }
}

useEscapeKey((e) => {
  if (!isContentOpen.value) return

  e.preventDefault()
  isContentOpen.value = false
  TriggerEl.value?.focus()
})

onClickOutside(
  ContentEl,
  () => {
    isContentOpen.value &&= false
  },
  { ignore: [TriggerEl] }
)
//----------------------------------------------------------------------------------------------------
// 📌 filter
//----------------------------------------------------------------------------------------------------

const isLoading = ref(false)
const inputValue = controlledRef(p.modelValue)

watchDebounced(
  inputValue,
  async (query, _, onCleanup) => {
    if (!query) return

    suggestions.value = []
    isContentOpen.value = false

    if (p.getOptions) {
      isLoading.value = true

      p.getOptionsCleanup && onCleanup(p.getOptionsCleanup)
      suggestions.value = await p.getOptions(query)

      isLoading.value = false
    }

    suggestions.value = p.filter
      ? p.filter(query, p.maxDisplayedOptions)
      : filter(p.options ?? [], query, p.maxDisplayedOptions)

    isContentOpen.value ||= true
  },
  { debounce: p.debounce }
)

function filter(options: string[], query: string, limit: number): string[] {
  const result = []
  for (const option of options) {
    if (option.includes(query)) result.push(option)
    if (result.length >= limit) break
  }
  return result
}

// if focus is moved from the input make sure to set input value to the last "correct" selectable value.
// we use `.lay` to avoid triggering filter watcher
function onInputBlur() {
  if (!p.modelValue) return
  inputValue.lay(p.modelValue)
}

watch(selected, (selected) => {
  if (isArray(selected)) return
  inputValue.lay(selected)
})

//----------------------------------------------------------------------------------------------------
// 📌 form
//----------------------------------------------------------------------------------------------------

useEventListener(getFormEl, 'reset', () => resetSelected())

//----------------------------------------------------------------------------------------------------

const { floatingStyles } = useFloating(TriggerEl, ContentEl, isContentOpen, {
  placement: 'bottom-start',
  offset: 4,
  autoMinWidth: true,
})
</script>

<template>
  <Input
    v-model="inputValue"
    v-bind="$attrs"
    @blur="onInputBlur"
    @keydown="onTriggerKeydown"
    :ref="(vm )=> TriggerEl = (vm as InstanceType<typeof Input>)?.InputEl"
    :aria-expanded="isContentOpen"
    :aria-controls="CONTENT_ID"
    :id="TRIGGER_ID"
    :compact="p.compact"
    aria-haspopup="listbox"
    aria-autocomplete="list"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template #suffix>
      <IconChevronUpDown class="vex-autocomplete-chevron" />
    </template>
  </Input>

  <!-- listbox -->

  <Teleport to="body">
    <ul
      v-if="isContentOpen"
      :style="floatingStyles()"
      :aria-describedby="TRIGGER_ID"
      :id="CONTENT_ID"
      @keydown="onContentKeydown"
      ref="ContentEl"
      tabindex="-1"
      class="vex-autocomplete-content"
    >
      <div v-if="!suggestions.length" class="vex-autocomplete-placeholder">
        <Loader v-if="isLoading" />
        <span v-else>no data</span>
      </div>

      <slot :options="suggestions"> </slot>
    </ul>
  </Teleport>
</template>
