<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import { useAttrs, computed, ref } from 'vue'
import { getRandomString } from '@/composables/helpers'
import { IconDangerSign } from '@/icons'
import { Tooltip, Loader } from '@/components'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the label text
     */
    label?: string

    /**
     * specifies the input value
     */
    modelValue?: string | number

    /**
     * specifies the input type attribute
     * @default 'text'
     */
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'time' | 'url' | 'button'

    /**
     * specifies v-model modifiers
     */
    modelModifiers?: { lazy?: boolean }

    /**
     * whether the input is disabled
     */
    disabled?: boolean

    /**
     * whether the input is loading
     */
    loading?: boolean

    /**
     * whether the input is readonly
     */
    readonly?: boolean

    /**
     * whether the input value is invalid
     */
    error?: boolean

    /**
     * specifies the error text
     */
    errorMessage?: string

    /**
     * specifies the hint text
     */
    hint?: string

    /**
     * the class attribute for the root element
     */
    class?: string

    /**
     * the class attribute for the internal input
     */
    inputClass?: string

    /**
     * the class attribute for the input wrapper element
     */
    inputWrapperClass?: string

    /**
     * shows a smaller input
     */
    compact?: boolean

    /**
     * specifies the input `id` and `<label>` element `for` attribute
     * @default auto generated random string
     */
    id?: string
  }>(),
  {
    type: 'text',
  }
)

const emit = defineEmits<{
  (event: 'click'): void
  (event: 'update:modelValue', value?: string): void
}>()

const slots = defineSlots<{
  icon(props: {}): any
  suffix(props: {}): any
  dropdown(props: {}): any
  inputContent(props: {}): any
}>()

const { class: _, ...fallThroughAttrs } = useAttrs()

//----------------------------------------------------------------------------------------------------
// 📌 input attributes
//----------------------------------------------------------------------------------------------------

// custom v-model.lazy implementation
const updateModel = computed(() => (p.modelModifiers?.lazy ? 'change' : 'input'))
const INPUT_ID = `vex-input-${getRandomString(6)}`

const InputEl = ref<HTMLInputElement | null>(null)
const InputWrapperEl = ref<HTMLDivElement | null>(null)

const { focused: isFocused } = useFocus(InputEl)

//----------------------------------------------------------------------------------------------------

const hasSuffix = computed<boolean>(() => !!slots.suffix || p.error)
const hasIcon = computed<boolean>(() => !!slots.icon)

const modifierClasses = computed(() => [
  'vex-textfield',
  p.class,
  {
    '--error': p.error,
    '--focus': isFocused.value,
    '--compact': p.compact,
  },
])

defineExpose({
  InputEl,
  InputWrapperEl,
})
</script>

<template>
  <div class="vex-textfield-container">
    <!-- label -->

    <label :for="p.id || INPUT_ID" v-if="p.label" class="vex-label">
      {{ p.label }}
    </label>

    <!-- input wrapper -->

    <div ref="InputWrapperEl" @click="emit('click')" :class="modifierClasses">
      <div v-if="hasIcon" aria-hidden="true" class="vex-textfield-icon">
        <slot name="icon" />
      </div>

      <div v-if="hasSuffix" aria-hidden="true" class="vex-textfield-suffix">
        <Loader v-if="p.loading" />
        <Tooltip v-else-if="p.error" color="danger" :content="p.errorMessage">
          <IconDangerSign
            width="18"
            height="18"
            style="color: var(--vex-clr-danger-400); pointer-events: auto"
          />
        </Tooltip>
        <slot v-else name="suffix" />
      </div>

      <input
        ref="InputEl"
        v-bind="fallThroughAttrs"
        class="vex-textfield-input"
        :id="p.id || INPUT_ID"
        :type="p.type"
        :disabled="p.disabled"
        :readonly="p.readonly"
        :value="p.modelValue"
        @[updateModel]="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <slot name="inputContent" />
    </div>

    <!-- dropdown -->

    <slot name="dropdown" />

    <!-- hint -->

    <small v-if="p.hint" class="vex-textfield-hint">
      {{ p.hint }}
    </small>
  </div>
</template>
