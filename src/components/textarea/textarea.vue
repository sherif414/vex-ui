<script setup lang="ts">
import { getRandomString } from '@/composables/helpers'
import { computed } from 'vue'

/**********************************
 * 📌 component meta
 ***********************************/

const p = withDefaults(
  defineProps<{
    /**
     * specifies the label text
     */
    label?: string

    /**
     * specifies the textarea's value
     */
    modelValue?: string

    /**
     * specifies `v-model` modifiers
     */
    modelModifiers?: { lazy?: boolean }

    /**
     * whether the textarea is disabled
     */
    disabled?: boolean

    /**
     * whether the textarea is readonly
     */
    readonly?: boolean

    /**
     * whether the textarea's value is invalid
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
     * the class attribute for the textarea's root element
     */
    class?: string

    /**
     * specifies the textarea's `resize` attribute
     */
    resize?: boolean

    /**
     * specifies the `id` attribute for the textarea and the
     * `for` attribute for the internal `<label>`
     * @default auto generated random string
     */
    id?: string
  }>(),
  {
    id: () => `textarea-${getRandomString(6)}`,
  }
)

/**********************************
 * 📌 attributes
 ***********************************/

const eventType = computed(() => (p.modelModifiers?.lazy ? 'change' : 'input'))
</script>

<template>
  <div :class="['vex-textarea-wrapper', p.class]">
    <label class="vex-textarea-label" :for="p.id">{{ p.label }}</label>

    <textarea
      :class="['vex-textarea', p.error && 'vex-textarea-error']"
      :value="p.modelValue"
      :disabled="p.disabled"
      :id="p.id"
      :readonly="p.readonly"
      @[eventType]="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      v-bind="$attrs"
    ></textarea>

    <small v-if="p.error || p.hint" class="vex-textarea-hint">
      {{ p.error ? p.errorMessage || p.hint : p.hint }}
    </small>
  </div>
</template>

<style lang="scss">
.vex-textarea {
  padding: var(--vex-spacing-2) var(--vex-spacing-4);
  border: none;
  outline: 1px solid var(--vex-border-clr-base);
  border-radius: var(--vex-border-radius-md);
  height: 8rem;
  width: 100%;
  transition-property: color, background, outline-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: var(--vex-transition-easing);
  resize: none;

  &:disabled {
    cursor: not-allowed !important;
    background-color: var(--vex-clr-disabled);
    color: var(--vex-clr-on-disabled);
    outline-color: transparent;
  }

  &-error {
    outline-color: var(--vex-clr-danger-400) !important;
  }

  &-error ~ &-hint {
    color: var(--vex-clr-danger-400);
  }

  &:focus {
    outline-color: var(--vex-border-clr-active);
    outline-width: 2px;
  }

  &-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--vex-spacing-2);
  }

  &-label {
    font-size: var(--vex-font-size-sm);
  }

  &-hint {
    color: var(--vex-on-surface-muted);
    font-size: var(--vex-font-size-xs);
    padding-inline-start: var(--vex-spacing-2);
  }
}
</style>
