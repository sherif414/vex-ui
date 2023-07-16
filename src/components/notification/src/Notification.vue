<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useEventListener, useMouseInElement } from '@vueuse/core'
import { IconDangerSign, IconBell, IconXMark, IconCheckCircle, IconWarn } from '@/icons'
import { useTimer } from '@/composables/timer'
import { Progress } from '@/components/progress'
import { animate } from 'motion'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'danger' | 'warning' | 'primary'
    title?: string
    body?: string
    duration?: number
    persist?: boolean
    showProgress?: boolean
  }>(),
  {
    type: 'primary',
    duration: 10000,
    showProgress: true,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

//----------------------------------------------------------------------------------------------------
// 📌 timer
//----------------------------------------------------------------------------------------------------

const rootEl = ref<HTMLElement | null>(null)
const progressEl = ref<InstanceType<typeof Progress> | null>(null)
const progressValue = ref(0)
// we add 300ms to compensate for the lost time during enter transition
const _duration = props.duration + 300
const timer = !props.persist ? useTimer(_duration, onClose) : undefined

// TODO: this is too expensive for its usage
// find a better solution
const { isOutside: isMouseOutside } = useMouseInElement(rootEl)

if (timer) {
  onMounted(() => {
    timer.start()
    progressValue.value = 100
  })
}

function onClose() {
  timer?.stop()
  emit('close')
}

function onMouseLeave() {
  if (document.activeElement !== rootEl.value) {
    resumeTimer()
  }
}

function onBlur() {
  if (isMouseOutside.value) {
    resumeTimer()
  }
}

function pauseTimer() {
  timer?.pause()
  progressEl.value?.pause()
}

function resumeTimer() {
  timer?.resume()
  progressEl.value?.resume()
}

//----------------------------------------------------------------------------------------------------
// 📌 swipe gesture
//
// TODO: extract into composable
// TODO: does this work on pc touch screens?
//----------------------------------------------------------------------------------------------------

let initialX = 0
let prevX = 0
let lastFrame: number | null = null
useEventListener(rootEl, 'touchstart', (e: TouchEvent) => {
  initialX = e.touches[0].clientX
})

useEventListener(rootEl, 'touchmove', (e: TouchEvent) => {
  // ignore multi fingers touches
  if (e.touches.length !== 1) return
  e.preventDefault()
  e.stopPropagation()

  // Ignore left swipes beyond the initial position
  // reset prevX to prevent jumps
  if (e.touches[0].clientX < initialX) {
    prevX = initialX
    return
  }

  // debounced drag animation
  if (!lastFrame) {
    lastFrame = requestAnimationFrame(() => {
      if (!rootEl.value) return

      lastFrame = null
      prevX = e.touches[0].clientX
      const delta = Math.abs(prevX - initialX)
      rootEl.value.style.transform = `translateX(${delta}px)`
    })
  }
})

useEventListener(rootEl, 'touchend', (e: TouchEvent) => {
  // Ignore left swipes
  if (prevX < initialX) return

  // if the swipe distance is greater than 33% of el width, close
  // else reset the element's transform to 0
  const delta = Math.abs(prevX - initialX)
  if (delta > Math.floor(rootEl.value!.offsetWidth / 3)) {
    onClose()
    return
  }

  requestAnimationFrame(() => {
    animate(rootEl.value!, { x: [delta, 0] }, { duration: 0.15, easing: 'ease-out' })
  })
})

//----------------------------------------------------------------------------------------------------
// 📌 icon
//----------------------------------------------------------------------------------------------------

const icon = computed(() => {
  if (props.type === 'danger') return IconDangerSign
  if (props.type === 'warning') return IconWarn
  if (props.type === 'success') return IconCheckCircle
  return IconBell
})
</script>

<template>
  <div
    ref="rootEl"
    tabindex="0"
    role="status"
    aria-atomic
    @keydown.esc="onClose"
    @mouseenter="pauseTimer"
    @mouseleave="onMouseLeave"
    @focus="pauseTimer"
    @blur="onBlur"
    :class="[
      $slots.default
        ? 'vex-notification-item-custom'
        : `vex-notification-item vex-notification-item-${props.type}`,
    ]"
  >
    <slot>
      <!-- icon -->

      <div class="vex-notification-item-icon">
        <slot name="icon">
          <Component :is="icon" width="20" height="20" />
        </slot>
      </div>

      <!-- content -->

      <div class="vex-notification-item-content">
        <slot name="title">
          <span class="vex-notification-item-title">
            {{ props.title }}
          </span>
        </slot>

        <slot name="body">
          <p class="vex-notification-item-body">
            {{ props.body }}
          </p>
        </slot>
      </div>
    </slot>

    <!-- close button -->

    <button type="button" aria-label="close" class="vex-notification-item-close" @click="onClose">
      <IconXMark />
    </button>

    <!-- progress bar -->

    <div v-if="!props.persist && showProgress" class="vex-notification-progress">
      <Progress
        ref="progressEl"
        :color="props.type"
        :duration="_duration"
        :value="progressValue"
        inert
      />
    </div>
  </div>
</template>
