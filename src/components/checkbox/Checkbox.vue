<script setup lang="ts">
import { getRandomString } from '@/composables/helpers'
import { animate, timeline } from 'motion'
import { watch, ref, computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    /**
     * specifies the checkbox label text,
     * note that if this is undefined the internal `<label>`
     * element will not be rendered
     */
    label?: string

    /**
     * specifies the checkbox `checked` attribute
     */
    modelValue?: boolean

    /**
     * specifies the checkbox `value` attribute
     */
    value?: string

    /**
     * specifies the checkbox `disabled` attribute
     */
    disabled?: boolean

    /**
     * specifies the checkbox `id` attribute and its `<label>` element `for` attribute,
     * @default auto generated random string
     */
    id?: string

    /**
     * specifies the checkbox size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    id: () => `checkbox-${getRandomString(6)}`,
    size: 'md',
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

//==================================================
// 📌 animation
//
// TODO: add credit
//==================================================

const isMotionReduced = usePreferredReducedMotion()

watch(
  () => p.modelValue,
  (value) => {
    if (isMotionReduced.value !== 'reduce') {
      value ? animateCheck() : animateUnCheck()
    }
  }
)

const inputEl = ref<HTMLInputElement>()
const checkEl = ref<HTMLElement>()
const dotEl = ref<HTMLElement>()

async function animateCheck() {
  if (!inputEl.value || !dotEl.value || !checkEl.value) return

  await timeline([
    [
      inputEl.value,
      {
        boxShadow: [
          'inset 0 0 0 2px var(--vex-border-clr-base)',
          'inset 0 0 0 16px var(--vex-clr-primary-400)',
        ],
      },
      { duration: 0.2 },
    ],
    [
      checkEl.value,
      {
        strokeDashoffset: ['20.5px', '48px', '46.5px'],
        strokeDasharray: ['16.5px 33px', '14px 33px', '16.5px 33px'],
      },
      { duration: 1, at: 0 },
    ],
    [dotEl.value, { x: [14, 0], y: [-14, 0] }, { duration: 0.4, at: '-0.75' }],
  ]).finished

  // we need to manually remove styles added by motion
  ;[inputEl.value, dotEl.value, checkEl.value].forEach((el) => {
    el.removeAttribute('style')
  })
}

async function animateUnCheck() {
  if (!inputEl.value) return

  await animate(
    inputEl.value,
    {
      boxShadow: [
        'inset 0 0 0 16px var(--vex-clr-primary-400)',
        'inset 0 0 0 2px var(--vex-border-clr-base)',
      ],
    },
    { duration: 0.3 }
  ).finished

  // we need to manually remove styles added by motion
  inputEl.value.removeAttribute('style')
}

//===============================================

const sizeMultiplier = computed(() => {
  return {
    sm: 1.25,
    md: 1.5,
    lg: 1.75,
  }[p.size]
})

defineExpose({
  inputRef: inputEl,
})
</script>

<template>
  <div :style="{ '--vex-size-multiplier': sizeMultiplier }" class="vex-checkbox-wrapper">
    <span class="vex-checkbox">
      <input
        ref="inputEl"
        type="checkbox"
        class="vex-checkbox-input"
        :disabled="p.disabled"
        :aria-disabled="p.disabled"
        :value="p.value"
        :checked="p.modelValue"
        :aria-checked="p.modelValue"
        :id="p.id"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <!-- The SVG element for the checkmark and dot -->
      <svg
        class="vex-checkbox-svg"
        aria-hidden="true"
        :width="sizeMultiplier * 16"
        :height="sizeMultiplier * 16"
        viewBox="0 0 24 24"
        filter="url(#goo-light)"
      >
        <!-- The path for the checkmark -->
        <path
          stroke-linecap="round"
          stroke-dasharray="16.5 33"
          stroke-dashoffset="20.5"
          stroke-linejoin="round"
          ref="checkEl"
          class="vex-checkbox-svg-check"
          d="M4.5 10L10.5 16L24.5 1"
        />
        <!-- The circle for the dot -->
        <circle
          ref="dotEl"
          class="vex-checkbox-svg-dot"
          cx="10.5"
          cy="15.5"
          :r="p.size === 'lg' ? 1.25 : 1.5"
        />
      </svg>
      <!-- gooey filter -->
      <svg inert style="display: none" width="0" height="0">
        <defs>
          <filter
            id="goo-light"
            x="-50%"
            width="200%"
            y="-50%"
            height="200%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.25" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="cm"
            />
          </filter>
        </defs>
      </svg>
    </span>
    <!-- label -->
    <label v-if="p.label || $slots.default" :for="p.id" class="vex-checkbox-label">
      <slot>
        {{ label }}
      </slot>
    </label>
  </div>
</template>

<style lang="scss">
.vex-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--vex-spacing-2);
}

.vex-checkbox {
  position: relative;
  border-radius: var(--vex-border-radius-md);
  width: calc(1rem * var(--vex-size-multiplier));
  height: calc(1rem * var(--vex-size-multiplier));

  &-label {
    font-size: var(--vex-font-size-sm);
  }

  &-input {
    display: block;
    margin: 0;
    padding: 0;
    width: calc(1rem * var(--vex-size-multiplier));
    height: calc(1rem * var(--vex-size-multiplier));
    cursor: pointer;
    appearance: none;
    border-radius: inherit;
    border: none;
    outline: none;
    box-shadow: inset 0px 0px 0px 2px var(--vex-border-clr-base);

    &:disabled {
      cursor: not-allowed;
      background-color: var(--vex-clr-disabled);
    }

    &:checked {
      box-shadow: inset 0px 0px 0px 16px var(--vex-clr-primary-400);

      & + .vex-checkbox-svg .vex-checkbox-svg-check {
        stroke-dashoffset: 46.5px;
      }
    }

    &:checked:disabled {
      box-shadow: inset 0px 0px 0px 16px var(--vex-clr-disabled) !important;
    }

    &:focus-visible {
      outline: 2px solid var(--vex-clr-primary-400);
    }
  }
}

.vex-checkbox-svg {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  fill: white;

  &-check {
    transform-origin: 10.5px 16px;
    fill: none;
    stroke-width: 2px;
    stroke: white;
  }

  &-dot {
    transform-origin: 10.5px 15.5px;
    transform: translate(14px, -14px) scale(1);
  }
}
</style>
