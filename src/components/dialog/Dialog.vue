<script setup lang="ts">
import { dialogStore } from '@/components/dialog'
import { ref, onMounted, onUnmounted, watch, readonly } from 'vue'

//==================================================
// 📌 component meta
//==================================================

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    blurOverlay?: boolean
  }>(),
  {}
)

defineSlots<{
  trigger: (slotProps: { isOpen: boolean; show: () => void }) => any
  default: (slotProps: { isOpen: boolean; close: (returnValue?: string) => void }) => any
}>()

//==================================================
// 📌 visibility
//==================================================

const dialogEl = ref<HTMLDialogElement | null>(null)
const isDialogOpen = ref(false)

function show() {
  dialogEl.value?.showModal()
}
function close(returnValue?: string) {
  dialogEl.value?.close(returnValue)
}

onMounted(() => {
  const observer = new MutationObserver((mutations) => {
    isDialogOpen.value = (mutations[0].target as HTMLDialogElement).open
  })

  observer.observe(dialogEl.value, { attributeFilter: ['open'] })

  onUnmounted(() => {
    observer.disconnect()
  })
})

//==================================================
// 📌 hide body-scrollbar
//==================================================

function hideBodyScrollbar() {
  if (dialogStore.openDialogsCount === 1) {
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.width = `calc(100% - ${scrollBarWidth}px)`
    document.body.style.overflow = 'hidden'
  }
}

function showBodyScrollbar() {
  if (dialogStore.openDialogsCount === 0) {
    document.body.style.width = null
    document.body.style.overflow = null
  }
}

watch(
  isDialogOpen,
  (_isDialogOpen) => {
    if (!_isDialogOpen) dialogStore.openDialogsCount--
    else {
      dialogStore.openDialogsCount++
      hideBodyScrollbar()
    }
  },
  { flush: 'pre' }
)
onUnmounted(showBodyScrollbar)

//==================================================
// 📌 focus management
//==================================================

function onAfterEnter() {
  /**
   * by default browsers will focus the first form control or button inside
   * the dialog, but this will make screen readers skip important context like
   * title and description so we bring focus back to the dialog element
   * to make sure screen readers read it top to down
   */
  dialogEl.value.focus()
}

//==================================================

defineExpose({
  show,
  close,
  dialogEl,
  isOpen: readonly(isDialogOpen),
})
</script>

<template>
  <slot name="trigger" :show="show" :is-open="isDialogOpen" />
  <Transition
    @after-leave="showBodyScrollbar"
    @after-enter="onAfterEnter"
    name="vex-t-dialog"
  >
    <dialog
      ref="dialogEl"
      v-show="isDialogOpen"
      v-bind="$attrs"
      :class="['vex-dialog', { 'vex-dialog-blur': p.blurOverlay }]"
      role="dialog"
      aria-modal="true"
    >
      <slot :close="close" :is-open="isDialogOpen" />
    </dialog>
  </Transition>
</template>

<style lang="scss">
.vex-dialog {
  all: unset;
  position: fixed;
  z-index: 9999;
  inset: 0;
  margin: auto;
  padding: var(--vex-spacing-4);
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);
  width: fit-content;
  height: fit-content;
  overflow: auto;
  background-color: white;
  border: none;
  border-radius: var(--vex-border-radius-sm);

  &-blur {
    &::backdrop {
      backdrop-filter: blur(2px);
    }
  }
}

.vex-t-dialog {
  &-enter-active,
  &-leave-active {
    transition: opacity 150ms;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
