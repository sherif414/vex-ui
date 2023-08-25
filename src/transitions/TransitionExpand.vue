<script lang="ts" setup>
import { animate } from 'motion'
import { Transition } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    duration?: number
    transitionProp?: 'width' | 'height'
    disabled?: boolean
  }>(),
  {
    duration: 300,
    transitionProp: 'height',
  }
)

//----------------------------------------------------------------------------------------------------

let expandedSize = '0'
const dynamicSize = p.transitionProp
const staticSize = p.transitionProp === 'height' ? 'width' : 'height'

async function onEnter(el: HTMLElement, done: () => void) {
  el.style.transitionDuration = '0s'
  el.style.animationName = 'none'
  el.style[staticSize] = getComputedStyle(el)[staticSize]
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style[dynamicSize] = 'auto'

  expandedSize = el.getBoundingClientRect()[dynamicSize] + 'px'

  el.style.transitionDuration = ''
  el.style.animationName = ''
  el.style[staticSize] = ''
  el.style.position = ''
  el.style.visibility = ''
  el.style.overflow = 'hidden'

  await animate(
    el,
    { [dynamicSize]: [0, expandedSize], opacity: [0, 1] },
    { duration: p.duration / 1000 }
  ).finished
  done()
}

function onAfterEnter(el: HTMLElement) {
  el.style.overflow = ''
  el.style[dynamicSize] = 'auto'
}

async function onLeave(el: HTMLElement, done: () => void) {
  expandedSize = el.getBoundingClientRect()[dynamicSize] + 'px'
  el.style.overflow = 'hidden'

  await animate(
    el,
    { [dynamicSize]: [expandedSize, 0], opacity: [1, 0] },
    { duration: p.duration / 1000 }
  ).finished
  done()
}

function onAfterLeave(el: HTMLElement) {
  el.style.overflow = ''
  el.style[dynamicSize] = 'auto'
}
</script>

<template>
  <slot v-if="disabled" />

  <Transition
    v-else
    :css="false"
    @enter="(el, done) => onEnter(el as HTMLElement, done)"
    @leave="(el, done) => onLeave(el as HTMLElement, done)"
    @after-enter="(el) => onAfterEnter(el as HTMLElement)"
    @after-leave="(el) => onAfterLeave(el as HTMLElement)"
  >
    <slot></slot>
  </Transition>
</template>
