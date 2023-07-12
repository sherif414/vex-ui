<script setup lang="ts">
import { ref, computed } from 'vue'

//==================================================
// 📌 component meta
//==================================================

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the checkbox `checked` attribute
     */
    modelValue?: boolean

    /**
     * specifies the checkbox size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    class?: string
    style?: string
  }>(),
  {
    size: 'md',
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

//==================================================

const modifierClasses = computed(() => [
  'vex-checkbox',
  p.class,
  `--size-${p.size}`,
  { '--checked': p.modelValue },
])
const inputEl = ref<HTMLInputElement | null>(null)

defineExpose({
  inputEl,
})
</script>

<template>
  <div :class="modifierClasses" :style="p.style">
    <input
      v-bind="$attrs"
      ref="inputEl"
      type="checkbox"
      class="vex-checkbox-input"
      :checked="p.modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <svg
      class="vex-checkbox-svg"
      aria-hidden="true"
      viewBox="0 0 24 24"
      filter="url(#goo-light)"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="16.5 33"
        stroke-dashoffset="20.5"
        class="vex-checkbox-svg-check"
        d="M4.5 10L10.5 16L24.5 1"
      />
    </svg>
  </div>
</template>
