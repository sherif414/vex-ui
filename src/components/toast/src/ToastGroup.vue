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
