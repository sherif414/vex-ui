<script setup lang="ts">
import { dialogStore } from '@/components/dialog'
import { useFocusTrap } from '@/composables'
import { ref, onUnmounted, readonly, computed } from 'vue'
import { IconXMark } from '@/icons'
import { timeline } from 'motion'
import { useEventListener } from '@vueuse/core'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * whether to blur the background overlay
     */
    blurOverlay?: boolean

    /**
     * whether the dialog is open
     */
    open?: boolean
  }>(),
  {}
)

defineSlots<{
  default: (props: {}) => any
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

//----------------------------------------------------------------------------------------------------
// 📌 visibility
//----------------------------------------------------------------------------------------------------

const dialogEl = ref<HTMLDialogElement | null>(null)

useEventListener(dialogEl, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && p.open) {
    emit('update:open', false)
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 hide body-scrollbar
//----------------------------------------------------------------------------------------------------

function hideBodyScrollbar(): void {
  dialogStore.openDialogsCount++
  if (dialogStore.openDialogsCount === 1) {
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.marginRight = `${scrollBarWidth}px`
    document.body.style.overflow = 'hidden'
  }
}

function showBodyScrollbar(): void {
  dialogStore.openDialogsCount--
  if (dialogStore.openDialogsCount === 0) {
    document.body.style.marginRight = ''
    document.body.style.overflow = ''
  }
}

onUnmounted(showBodyScrollbar)

//----------------------------------------------------------------------------------------------------
// 📌 focus
//----------------------------------------------------------------------------------------------------

const trap = useFocusTrap(dialogEl, null, {
  escapeDeactivates: false,
})

//----------------------------------------------------------------------------------------------------
// 📌 animation
//----------------------------------------------------------------------------------------------------

const overlayEl = ref<HTMLElement | null>(null)

async function onEnter(_: Element, done: () => void) {
  await timeline([
    [overlayEl.value!, { opacity: [0, 1] }, { duration: 0.3 }],
    [dialogEl.value!, { scale: [0.95, 1] }, { duration: 0.3, at: 0 }],
  ]).finished

  done()
  trap.activate()
}

async function onLeave(_: Element, done: () => void) {
  await timeline([
    [overlayEl.value!, { opacity: [1, 0] }, { duration: 0.3 }],
    [dialogEl.value!, { scale: [1, 0.95] }, { duration: 0.3, at: 0 }],
  ]).finished

  done()
  trap.deactivate()
}

//----------------------------------------------------------------------------------------------------

const modifierClasses = computed(() => [
  'vex-dialog',
  {
    '--blur': p.blurOverlay,
  },
])

defineExpose({
  dialogEl,
})
</script>

<template>
  <Teleport to="body">
    <Transition
      @before-enter="hideBodyScrollbar"
      @before-leave="showBodyScrollbar"
      @enter="onEnter"
      @leave="onLeave"
      :css="false"
      name="vex-t-dialog"
    >
      <div v-show="p.open" ref="overlayEl" class="vex-overlay">
        <div
          tabindex="-1"
          ref="dialogEl"
          v-bind="$attrs"
          :class="modifierClasses"
          role="dialog"
          aria-modal="true"
        >
          <slot />
          <button aria-label="close" class="vex-dialog-close" @click="emit('update:open', false)">
            <IconXMark aria-hidden="true" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
