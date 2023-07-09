<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import { useAttrs, computed, ref } from 'vue'
import { getRandomString } from '@/composables/helpers'
import { IconDangerSign } from '@/components/icons'
import { Tooltip } from '@/components/tooltip'
import { Loader } from '@/components/loader'

//==================================================
// 📌 component meta
//==================================================

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

//==================================================
// 📌 input attributes
//==================================================

// custom v-model.lazy implementation
const updateModel = computed(() => (p.modelModifiers?.lazy ? 'change' : 'input'))
const inputId = `${p.label}-${getRandomString(6)}`

const inputEl = ref<HTMLInputElement>()
const inputWrapperEl = ref<HTMLDivElement>()

const { focused: isFocused } = useFocus(inputEl)

//==================================================
// 📌 icons
//==================================================

const showSuffix = computed<boolean>(() => !!slots.suffix || p.error)
const showIcon = computed<boolean>(() => !!slots.icon)

defineExpose({
  inputEl,
  inputWrapperEl,
})
</script>

<template>
  <div
    :class="[
      'vex-input-container',
      p.class,
      {
        'vex-input-container-error': p.error,
        'vex-input-container-focus': isFocused,
        'vex-input-compact': p.compact,
      },
    ]"
  >
    <!-- label -->

    <label :for="p.id || inputId" v-if="p.label" class="vex-input-label">
      {{ p.label }}
    </label>

    <!-- input wrapper -->

    <div
      ref="inputWrapperEl"
      @click="emit('click')"
      :class="[p.inputWrapperClass, 'vex-input-wrapper']"
    >
      <!-- icon -->

      <div v-if="showIcon" aria-hidden="true" class="vex-input-icon">
        <slot name="icon" />
      </div>

      <!-- suffix -->

      <div v-if="showSuffix" aria-hidden="true" class="vex-input-suffix">
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

      <!-- input -->

      <input
        ref="inputEl"
        v-bind="fallThroughAttrs"
        :class="['vex-input', p.inputClass]"
        :id="p.id || inputId"
        :type="p.type"
        :disabled="p.disabled"
        :readonly="p.readonly"
        :value="p.modelValue"
        @[updateModel]="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />

      <slot name="inputContent" />
    </div>

    <!-- dropdown -->

    <slot name="dropdown" />

    <!-- hint -->

    <small v-if="p.hint" class="vex-input-hint">
      {{ p.hint }}
    </small>
  </div>
</template>

<style lang="scss">
// outer container
.vex-input-container {
  display: flex;
  flex-direction: column;
  gap: var(--vex-spacing-1);
  // width: 100%;

  &-focus {
    .vex-input-suffix,
    .vex-input-icon {
      color: var(--vex-clr-primary-400);
    }
  }
}

.vex-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.vex-input-label {
  font-size: var(--vex-font-size-sm);
}

// icons

.vex-input-suffix,
.vex-input-icon {
  aspect-ratio: 1/1;
  height: 100%;
  gap: var(--vex-spacing-2);
  position: absolute;
  inset-block-start: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: var(--vex-font-size-xs);
  color: var(--vex-text-clr-muted);
}

.vex-input-icon {
  inset-inline-start: 0;
}
.vex-input-suffix {
  inset-inline-end: 0;
}

// error

.vex-input-container-error {
  .vex-input-wrapper {
    color: var(--vex-clr-danger-400);
  }
  .vex-input {
    outline-color: var(--vex-clr-danger-400) !important;
  }
}

// hint

.vex-input-hint {
  font-size: var(--vex-font-size-xs);
  color: var(--vex-on-surface-muted);
  padding-inline-start: var(--vex-spacing-2);
}

// input

.vex-input {
  all: unset;
  width: 100%;
  min-width: 0;
  border-style: none;
  height: 100%;
  outline: 1px solid var(--vex-border-clr-base);
  border-radius: var(--vex-border-radius-sm);
  transition-property: color, background-color, border-color, outline-color;
  transition-timing-function: var(--vex-transition-easing);
  transition-duration: 150ms;
  padding-inline: var(--vex-spacing-4);
  background-color: white;
  display: block;

  &[type='button'] {
    text-align: start;
  }

  &:disabled {
    background-color: var(--vex-clr-disabled);
    color: var(--vex-clr-on-disabled);
    outline-color: transparent !important;
    cursor: not-allowed !important;
  }

  &:focus {
    outline-color: var(--vex-border-clr-active);
    outline-width: 2px;
  }
}

// size

.vex-input-compact {
  .vex-input-wrapper {
    height: 2rem;
    font-size: var(--vex-font-size-xs);
  }

  .vex-input-icon ~ .vex-input {
    padding-inline-start: var(--vex-spacing-6);
  }

  .vex-input-suffix ~ .vex-input {
    padding-inline-end: var(--vex-spacing-6);
  }
}

.vex-input-wrapper {
  height: 2.75rem;
  font-size: var(--vex-font-size-sm);
}

.vex-input-icon ~ .vex-input {
  padding-inline-start: 2.75rem;
}

.vex-input-suffix ~ .vex-input {
  padding-inline-end: 2.75rem;
}
</style>
