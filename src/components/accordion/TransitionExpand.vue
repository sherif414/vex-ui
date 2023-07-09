<script lang="ts" setup>
import { Transition } from 'vue'

const props = withDefaults(
  defineProps<{
    duration?: string
    transitionProp?: 'width' | 'height'
  }>(),
  {
    duration: '200ms',
    transitionProp: 'height',
  }
)

const onEnter = (element: HTMLElement) => {
  const inlineSize = props.transitionProp === 'height' ? 'width' : 'height'
  const blockSize = props.transitionProp

  element.style[inlineSize] = getComputedStyle(element)[inlineSize]
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style[blockSize] = 'auto'

  const _blockSize = getComputedStyle(element)[blockSize]
  element.style[inlineSize] = ''
  element.style.position = ''
  element.style.visibility = ''
  element.style[blockSize] = '0px'
  // Force repaint to make sure the
  // animation is triggered correctly.
  getComputedStyle(element)[blockSize]
  // Trigger the animation.
  // We use `requestAnimationFrame` because we need
  // to make sure the browser has finished
  // painting after setting the `height`
  // to `0` in the line above.
  requestAnimationFrame(() => {
    element.style[blockSize] = _blockSize
  })
}

const onAfterEnter = (element: HTMLElement) => {
  const blockSize = props.transitionProp

  element.style[blockSize] = 'auto'
}

const onLeave = (element: HTMLElement) => {
  const blockSize = props.transitionProp

  const _blockSize = getComputedStyle(element)[blockSize]
  element.style[blockSize] = _blockSize
  // Force repaint to make sure the
  // animation is triggered correctly.
  getComputedStyle(element)[blockSize]
  requestAnimationFrame(() => {
    element.style[blockSize] = '0px'
  })
}
</script>

<template>
  <Transition name="vex-expand" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
    <slot></slot>
  </Transition>
</template>

<style>
.vex-expand-enter-active,
.vex-expand-leave-active {
  overflow: hidden;
  transition: all v-bind(duration) linear !important;
}

.vex-expand-enter-from,
.vex-expand-leave-to {
  opacity: 0;
}
</style>
