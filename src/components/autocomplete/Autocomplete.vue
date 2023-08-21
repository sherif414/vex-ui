<script setup lang="ts">
import { Input, Loader } from '@/components'
import { computed, nextTick, ref, watch } from 'vue'
import { useEventListener, watchDebounced } from '@vueuse/core'
import { IconChevronUpDown } from '@/icons'
import {
  useMemo,
  useFloating,
  useVModel,
  useID,
  useRovingFocus,
  useSelect,
  useRef,
  useTemplateRef,
  useSignal,
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

const [getTriggerEl, setTriggerEl] = useTemplateRef('Autocomplete')
const [getContentEl, setContentEl] = useTemplateRef('Autocomplete')
const getFormEl = () => (getTriggerEl() as HTMLInputElement)?.form

const ContentItemsEl = ref<(HTMLElement | null)[]>([])
const getContentItemsEl = useMemo(() => ContentItemsEl.value.filter(Boolean) as HTMLElement[])

const TRIGGER_ID = useID()
const CONTENT_ID = useID()

const [isContentOpen, setIsContentOpen] = useSignal(false)
const suggestions = ref<string[]>(p.options?.slice(0, p.maxDisplayedOptions) || [])

const [getSelected, setSelected] = useVModel(() => p.modelValue)

//----------------------------------------------------------------------------------------------------
// 📌 keyboard interactions
//----------------------------------------------------------------------------------------------------

useRovingFocus(getContentEl, getContentItemsEl, {
  orientation: () => 'vertical',
})

useEventListener(getTriggerEl, 'keydown', function onKeydown(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    e.preventDefault()
    setIsContentOpen(true)
    nextTick(() => getContentItemsEl()[0].focus())
  }
})

useEventListener(getContentEl, 'keydown', function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    setIsContentOpen(false)
    getTriggerEl()?.focus()
    return
  }

  if ([' ', 'Enter'].includes(e.key)) {
    e.preventDefault()
    ;(e.target as HTMLElement).click()
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 filter
//----------------------------------------------------------------------------------------------------

const [isLoading, setIsLoading] = useSignal(false)
const inputValue = useRef(p.modelValue)

watchDebounced(
  inputValue,
  async (query, _, onCleanup) => {
    if (!query) return

    suggestions.value = []
    setIsContentOpen(true)

    if (p.getOptions) {
      setIsLoading(true)

      p.getOptionsCleanup && onCleanup(p.getOptionsCleanup)
      suggestions.value = await p.getOptions(query)

      setIsLoading(false)
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

watch(getSelected, () => {
  inputValue.lay(getSelected())
})

//----------------------------------------------------------------------------------------------------
// 📌 form
//----------------------------------------------------------------------------------------------------

useEventListener(getFormEl, 'reset', () => setSelected(undefined))

//----------------------------------------------------------------------------------------------------

const { floatingStyles } = useFloating(getTriggerEl, getContentEl, isContentOpen, {
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
    :ref="setTriggerEl"
    :aria-expanded="isContentOpen()"
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
      <IconChevronUpDown class="vex-autocomplete-arrow" />
    </template>
  </Input>

  <!-- listbox -->

  <Teleport to="body">
    <ul
      v-if="isContentOpen()"
      :style="floatingStyles()"
      :aria-describedby="TRIGGER_ID"
      :id="CONTENT_ID"
      :ref="setContentEl"
      tabindex="-1"
      class="vex-autocomplete-content"
    >
      <div v-if="!suggestions.length" class="vex-autocomplete-placeholder">
        <Loader v-if="isLoading()" />
        <span v-else>no data</span>
      </div>

      <template v-else>
        <li
          v-for="(item, idx) in suggestions"
          :key="item"
          :id="`${CONTENT_ID}-${idx}`"
          :class="['vex-autocomplete-content-item', { '--selected': getSelected() === item }]"
          @click="setSelected(item)"
          ref="ContentItemsEl"
          tabindex="-1"
        >
          <slot :item="item">
            {{ item }}
          </slot>
        </li>
      </template>
    </ul>
  </Teleport>
</template>
