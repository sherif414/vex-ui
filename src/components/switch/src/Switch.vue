<script setup lang="ts">
import { getRandomString } from '@/composables/helpers'
import { usePreferredReducedMotion } from '@vueuse/core'
import { animate } from 'motion'
import { computed, ref, watch } from 'vue'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    /**
     * whether the switch is on/off
     * @default false
     */
    modelValue?: boolean

    /**
     * whether the switch is disabled
     */
    disabled?: boolean

    /**
     * specifies the `name` attribute for the switch
     */
    name?: string

    /**
     * specifies the `value` attribute for the switch
     */
    value?: string

    /**
     * specifies the label text
     */
    label?: string

    /**
     * specifies the `id` attribute for the switch and the
     * `for` attribute for the internal `<label>`
     * @default auto generated random string
     */
    id?: string

    /**
     * specifies the switch size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    modelValue: false,
    id: () => `switch-${getRandomString(6)}`,
    size: 'md',
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

/**********************************
 * 📌 events
 ***********************************/

function handleChange(value: boolean) {
  emit('update:modelValue', value)
}

/**********************************
 * 📌 size
 ***********************************/

const sizeModifier = computed(() => {
  return { sm: 0.75, md: 1, lg: 1.25 }[props.size]
})

const viewBox = computed(
  () => `0 0 ${sizeModifier.value * 48} ${sizeModifier.value * 24}`
)

/************************************
 * 📌 animations
 *
 * TODO: add credit
 *************************************/

const reduceMotion = usePreferredReducedMotion()

watch(
  () => props.modelValue,
  (value) => {
    if (reduceMotion.value === 'reduce') return

    value ? animateOn() : animateOff()
  }
)

const leftDotRef = ref<HTMLElement>()
const rightDotRef = ref<HTMLElement>()

async function animateOff() {
  if (!rightDotRef.value || !leftDotRef.value) return

  animate(leftDotRef.value, { scale: [0, 1], x: ['30%', 0] }, { duration: 0.5 })
  animate(
    rightDotRef.value,
    { scale: [1, 0], x: [0, '-30%'] },
    { duration: 0.5, delay: 0.25 }
  )
}

async function animateOn() {
  if (!rightDotRef.value || !leftDotRef.value) return

  animate(rightDotRef.value, { scale: [0, 1], x: ['-30%', 0] }, { duration: 0.5 })
  animate(
    leftDotRef.value,
    { scale: [1, 0], x: [0, '30%'] },
    { duration: 0.5, delay: 0.25 }
  )
}
</script>

<template>
  <div class="vex-switch-wrapper">
    <div ref="wrapperRef" class="vex-switch">
      <!-- input -->

      <input
        :name="props.name"
        :value="props.value"
        :checked="props.modelValue"
        :disabled="props.disabled"
        :id="props.id"
        @change="handleChange(($event.target as HTMLInputElement).checked)"
        class="vex-switch-input"
        type="checkbox"
        role="switch"
      />

      <!-- svg -->

      <svg class="vex-switch-svg" :viewBox="viewBox" filter="url(#goo)">
        <circle
          ref="leftDotRef"
          class="vex-switch-dot-left"
          cx="27.5%"
          cy="50%"
          r="30%"
        />
        <circle
          ref="rightDotRef"
          class="vex-switch-dot-right"
          cx="72.5%"
          cy="50%"
          r="30%"
        />
      </svg>

      <!-- gooey effect filter -->

      <svg inert style="display: none" width="0" height="0">
        <defs>
          <filter
            id="goo"
            x="-50%"
            width="200%"
            y="-50%"
            height="200%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
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
    <label v-if="props.label || $slots.default" :for="props.id" class="vex-switch-label">
      <slot>
        {{ label }}
      </slot>
    </label>
  </div>
</template>
