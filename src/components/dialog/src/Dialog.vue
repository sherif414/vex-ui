<script setup lang="ts">
import { dialogStore } from '@/components/dialog'
import { useFocusTrap } from '@/composables'
import { ref, onMounted, onUnmounted, watch, readonly } from 'vue'

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
  }>(),
  {}
)

defineSlots<{
  trigger: (slotProps: { isOpen: boolean; show: () => void }) => any
  default: (slotProps: { isOpen: boolean; close: (returnValue?: string) => void }) => any
}>()

//----------------------------------------------------------------------------------------------------
// 📌 visibility
//----------------------------------------------------------------------------------------------------

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

  observer.observe(dialogEl.value!, { attributeFilter: ['open'] })

  onUnmounted(() => {
    observer.disconnect()
  })
})

//----------------------------------------------------------------------------------------------------
// 📌 hide body-scrollbar
//----------------------------------------------------------------------------------------------------

function hideBodyScrollbar() {
  if (dialogStore.openDialogsCount === 1) {
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.width = `calc(100% - ${scrollBarWidth}px)`
    document.body.style.overflow = 'hidden'
  }
}

function showBodyScrollbar() {
  if (dialogStore.openDialogsCount === 0) {
    document.body.style.width = ''
    document.body.style.overflow = ''
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

//----------------------------------------------------------------------------------------------------
// 📌 focus trap
//----------------------------------------------------------------------------------------------------

function onAfterEnter() {
  trap.activate()
}

function onAfterLeave() {
  showBodyScrollbar()
  trap.deactivate()
}

const trap = useFocusTrap(dialogEl)

//----------------------------------------------------------------------------------------------------

defineExpose({
  show,
  close,
  dialogEl,
  isOpen: readonly(isDialogOpen),
})
</script>

<template>
  <slot name="trigger" :show="show" :is-open="isDialogOpen" />
  <Transition @after-leave="onAfterLeave" @after-enter="onAfterEnter" name="vex-t-dialog">
    <dialog
      ref="dialogEl"
      v-show="isDialogOpen"
      v-bind="$attrs"
      :class="['vex-dialog', { 'vex-dialog-blur': p.blurOverlay }]"
      role="dialog"
      aria-modal="true"
      @keydown.esc.exact="close()"
    >
      <slot :close="close" :is-open="isDialogOpen" />
    </dialog>
  </Transition>
</template>
