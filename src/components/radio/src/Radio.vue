<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { timeline } from 'motion'
import { getRandomString } from '@/composables/helpers'
import { usePreferredReducedMotion } from '@vueuse/core'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    /**
     * specifies the current active radio value.
     */
    modelValue?: string

    /**
     * specifies the radio value attribute.
     */
    value?: string

    /**
     * specifies the radio name attribute.
     */
    name?: string

    /**
     * whether the radio is disabled.
     */
    disabled?: boolean

    /**
     * specifies the radio label text.
     */
    label?: string

    /**
     * specifies the radio `id` attribute and the `<label>` element `for` attribute.
     * @default auto generated random string
     */
    id?: string
  }>(),
  {
    id: () => `radio-${getRandomString(6)}`,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

/**********************************
 * 📌 events
 ***********************************/

function handelChange(value: string) {
  emit('update:modelValue', value)
}

/**********************************
 * 📌 animations
 *
 * TODO: add credit
 **********************************/

const reduceMotion = usePreferredReducedMotion()
const isChecked = computed(() => props.modelValue === props.value)

watch(isChecked, (value) => {
  if (reduceMotion.value === 'reduce') return
  if (value) animateChecked()
})

const radioEl = ref<HTMLInputElement>()
const topEl = ref<HTMLElement>()
const dotEl = ref<HTMLElement>()
const dropEl = ref<HTMLElement>()

async function animateChecked() {
  await timeline([
    [
      radioEl.value,
      {
        boxShadow: [
          'inset 0 0 0 3px var(--vex-clr-neutral-200)',
          'inset 0 0 0 12px var(--vex-clr-primary-400)',
        ],
      },
      { duration: 0.3 },
    ],

    'after shadow',
    // top circle animation
    [topEl.value, { y: [0, 6], scaleX: [1, 1.75], scaleY: [1.25, 1] }, { duration: 0.2 }],
    [topEl.value, { y: [6, 0], scaleX: [1.75, 1], scaleY: [1, 1.25] }, { duration: 0.6 }],

    // dot animation
    [dotEl.value, { y: [-17, 2, 0] }, { duration: 0.6, at: 'after shadow' }],

    // drop animation
    [dropEl.value, { y: [-14, 0] }, { duration: 0.6, at: '-0.4' }],
  ]).finished

  // we need to manually remove inline styles added by motion
  ;[radioEl.value, topEl.value, dotEl.value, dropEl.value].forEach((el) => {
    el.removeAttribute('style')
  })
}
</script>

<template>
  <div class="vex-radio-wrapper">
    <div class="vex-radio">
      <!-- radio input -->

      <input
        ref="radioEl"
        :name="props.name"
        :disabled="props.disabled"
        :value="props.value"
        :checked="isChecked"
        :id="props.id"
        @change="handelChange(($event.target as HTMLInputElement).value)"
        type="radio"
        class="vex-radio-input"
      />

      <!-- svg -->

      <svg class="vex-radio-svg" viewBox="0 0 24 24" filter="url(#goo-light)">
        <circle class="vex-radio-svg-top" ref="topEl" cx="12" cy="-12" r="8" />
        <circle class="vex-radio-svg-dot" ref="dotEl" cx="12" cy="12" r="5" />
        <circle class="vex-radio-svg-drop" ref="dropEl" cx="12" cy="12" r="2" />
      </svg>

      <!-- gooey effect filter -->

      <svg style="display: none" width="0" height="0">
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
    </div>

    <!-- label -->

    <label v-if="props.label || $slots.default" :for="props.id" class="vex-radio-label">
      <slot>
        {{ label }}
      </slot>
    </label>
  </div>
</template>
