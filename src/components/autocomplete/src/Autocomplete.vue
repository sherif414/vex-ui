<script setup lang="ts">
import { Input, Dropdown, Loader } from '@/components'
import type { Option } from '@/components/dropdown/types'
import { computed, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { IconArrowDown } from '@/icons'
import { getRandomString } from '@/composables/helpers'
import type { Placement } from '@floating-ui/vue'

//===============================================
// 📌 component meta
//===============================================

const p = withDefaults(
  defineProps<{
    /**
     * specifies label text
     */
    label?: string

    /**
     * specifies the selected option
     */
    modelValue?: Option

    /**
     * specifies the list of all the available options, this will only be used with offline mode,
     * when using online mode use the `getOptions` prop instead.
     */
    options?: Option[]

    /**
     * TODO: not implemented
     */
    // multiple?: boolean

    /**
     * whether the field is disabled
     */
    disabled?: boolean

    /**
     * whether the field is readonly
     */
    readonly?: boolean

    /**
     * whether there is an error
     */
    error?: boolean

    /**
     * specifies the error message text
     */
    errorMessage?: string

    /**
     * specifies tex hint text
     */
    hint?: string

    /**
     * specifies the field size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the field's `id` and the inner `<label>` element's `for` attribute
     * @default auto generated random string
     */
    id?: string

    /**
     * used for custom search logic or online mode.
     */
    getOptions?: (query: string) => Promise<Option[]>

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
    maxOptions?: number

    /**
     * the search debounce time in milliseconds.
     * @default 300
     */
    debounce?: number

    /**
     * the direction the dropdown is placed relative to its input.
     * @default 'bottom-start'
     */
    placement?: Placement
  }>(),
  {
    size: 'md',
    debounce: 300,
    maxOptions: 10,
    id: () => `autocomplete-${getRandomString(6)}`,
    placement: 'bottom-start',
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', value?: Option | Option[])
  (event: 'search', query: string)
}>()

//===============================================
// 📌 search
//===============================================

const isLoading = ref(false)
const inputValue = ref(p.modelValue?.label)
const suggestions = ref<Option[]>(p.options?.slice(0, p.maxOptions) || [])
let shouldSearch = true

watchDebounced(
  inputValue,
  async (query, _, onCleanup) => {
    if (!shouldSearch) {
      shouldSearch = true
      return
    }
    // TODO: maybe we can do some sort of reset when query is ''
    if (!query) return

    suggestions.value = []
    emit('search', query)
    dropdownInstance.value.isDropdownVisible ||= true

    if (p.getOptions) {
      isLoading.value ||= true

      if (p.getOptionsCleanup) onCleanup(p.getOptionsCleanup)
      suggestions.value = await p.getOptions(query)

      isLoading.value = false
    }

    suggestions.value = search(query, p.maxOptions)
  },
  { debounce: p.debounce }
)

function search(query: string, limit: number): Option[] {
  return p.options.filter((op) => op.label.includes(query)).slice(0, limit)
}

//===============================================
// 📌 validation
//===============================================

function handleBlur() {
  if (!p.modelValue) return
  shouldSearch = false
  inputValue.value = p.modelValue.label
}

//===============================================
// 📌 misc
//===============================================

const dropdownInstance = ref<InstanceType<typeof Dropdown> | null>(null)
const isSuggestionsEmpty = computed<boolean>(() => !suggestions.value.length)

function handleEmit(option: Option | Option[]) {
  emit('update:modelValue', option)
}

watch(
  () => p.modelValue,
  (val) => {
    shouldSearch = false
    inputValue.value = val.label
  }
)
</script>

<template>
  <Input
    ref="inputInstance"
    v-model="inputValue"
    v-bind="$attrs"
    @blur="handleBlur"
    :size="p.size"
    :disabled="p.disabled"
    :readonly="p.readonly"
    :error="p.error"
    :error-message="p.errorMessage"
    :hint="p.hint"
    :label="p.label"
    :id="p.id"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>

    <template #suffix>
      <IconArrowDown
        :class="[
          'vex-autocomplete-arrow',
          { 'vex-autocomplete-arrow-active': dropdownInstance?.isDropdownVisible },
        ]"
      />
    </template>

    <template #dropdown>
      <Dropdown
        ref="dropdownInstance"
        trigger="click"
        @update:model-value="handleEmit"
        :disabled="p.disabled || p.readonly"
        :model-value="p.modelValue"
        :options="suggestions"
        :placement="p.placement"
      >
        <!-- TODO: maybe we can delegate this to dropdown component -->
        <div v-if="isSuggestionsEmpty" class="vex-autocomplete-placeholder">
          <!-- TODO: better visuals -->
          <Loader v-if="isLoading" />
          <span v-else>no data</span>
        </div>
      </Dropdown>
    </template>
  </Input>
</template>
