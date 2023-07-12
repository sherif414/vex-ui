<script setup lang="ts">
import { isString } from '@/composables/helpers'
import { useTimer } from '@/composables/timer'
import {
  onMounted,
  type Component,
  type FunctionalComponent,
  type VNode,
  computed,
} from 'vue'
import { IconDangerSign, IconBell, IconCheckCircle, IconWarn } from '@/icons'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const props = withDefaults(
  defineProps<{
    content: string | Component | FunctionalComponent | VNode
    duration: number
    type: 'primary' | 'info' | 'danger' | 'warning' | 'success'
  }>(),
  {
    type: 'primary',
    duration: 5000,
  }
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

//----------------------------------------------------------------------------------------------------
// 📌 timer
//----------------------------------------------------------------------------------------------------

const timer = useTimer(props.duration, () => emit('close'))
onMounted(timer.start)

//----------------------------------------------------------------------------------------------------
// 📌 icon
//----------------------------------------------------------------------------------------------------

const iconType = computed(() => {
  if (props.type === 'danger') return IconDangerSign
  if (props.type === 'warning') return IconWarn
  if (props.type === 'success') return IconCheckCircle
  if (props.type === 'info') return IconBell
  return IconBell
})
</script>

<template>
  <div
    :class="['vex-toast-item', `vex-toast-${props.type}`]"
    :style="{ color: `var(--vex-clr-${props.type}-400)` }"
    @mouseenter="timer.pause"
    @mouseleave="timer.resume"
    tabindex="0"
    role="alert"
    aria-atomic
  >
    <Component width="16" height="16" :is="iconType" />
    <span v-if="isString(props.content)">{{ props.content }}</span>
    <Component v-else :is="props.content" />
  </div>
</template>
