<script setup lang="ts">
import { ref } from 'vue'
import Toast from './Toast.vue'
import type { ToastItem } from '.'

//==================================================
// 📌 add/remove toasts
//==================================================

const items = ref<ToastItem[]>([])

function addToast(item: ToastItem) {
  items.value.unshift(item)
}

function removeToast(item: ToastItem) {
  const _idx = items.value.findIndex((_item) => _item === item)
  items.value.splice(_idx, 1)
}

defineExpose({
  add: addToast,
  remove: removeToast,
})
</script>

<template>
  <TransitionGroup
    id="vex-toast-overlay"
    tag="div"
    name="vex-fade"
    moveClass="vex-toast-move-class"
    aria-label="toast"
    role="region"
    aria-live="assertive"
    class="vex-toast-group"
  >
    <Toast
      v-for="item in items"
      :key="item.key"
      :content="item.content"
      :duration="item.duration"
      :type="item.type"
      @close="removeToast(item)"
    ></Toast>
  </TransitionGroup>
</template>

<style lang="scss">
.vex-toast-group {
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  padding: var(--vex-spacing-4);
  margin: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--vex-spacing-4);
}

.vex-toast-move-class {
  transition: transform 300ms ease-out;
}
</style>
