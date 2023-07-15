<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { animate } from 'motion'
import { computed, ref, watch } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * whether the switch is on
     */
    modelValue?: boolean

    /**
     * whether the switch is disabled
     */
    disabled?: boolean

    /**
     * renders a small switch
     */
    compact?: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

//----------------------------------------------------------------------------------------------------
// 📌 animations
//----------------------------------------------------------------------------------------------------

const reduceMotion = usePreferredReducedMotion()

watch(
  () => p.modelValue,
  (value) => {
    if (reduceMotion.value === 'reduce') return
    value ? animateOn() : animateOff()
  }
)

const LeftCircleEl = ref<HTMLElement>()
const RightCircleEl = ref<HTMLElement>()

async function animateOff() {
  if (!RightCircleEl.value || !LeftCircleEl.value) return

  animate(LeftCircleEl.value, { scale: [0, 1], x: ['30%', 0] }, { duration: 0.5 })
  animate(RightCircleEl.value, { scale: [1, 0], x: [0, '-30%'] }, { duration: 0.5, delay: 0.25 })
}

async function animateOn() {
  if (!RightCircleEl.value || !LeftCircleEl.value) return

  animate(RightCircleEl.value, { scale: [0, 1], x: ['-30%', 0] }, { duration: 0.5 })
  animate(LeftCircleEl.value, { scale: [1, 0], x: [0, '30%'] }, { duration: 0.5, delay: 0.25 })
}

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => [
  'vex-switch',
  {
    '--compact': p.compact,
  },
])
</script>

<template>
  <div :class="modifierClasses">
    <!-- input -->

    <input
      v-bind="$attrs"
      :checked="p.modelValue"
      :disabled="p.disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="vex-switch-input"
      type="checkbox"
      role="switch"
    />

    <!-- svg -->

    <svg class="vex-switch-svg" viewBox="0 0 48 24" filter="url(#goo)">
      <circle ref="LeftCircleEl" class="vex-switch-svg-leftcircle" cx="27.5%" cy="50%" r="30%" />
      <circle ref="RightCircleEl" class="vex-switch-svg-rightcircle" cx="72.5%" cy="50%" r="30%" />
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
</template>
