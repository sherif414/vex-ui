<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { Ref, ref } from 'vue'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    accept?: string
  }>(),
  {}
)

/**********************************
 * 📌 dropzone
 ***********************************/

const files = ref<File[]>([])

const dropzoneEl = ref<HTMLElement | null>(null)
const { isOverDropZone } = useDropZone(dropzoneEl, (_files) => {
  _files.forEach((file) => {
    files.value.push(file)
  })
})

/**********************************
 * 📌 loading bars
 ***********************************/

const uploadingFiles = ref<File[]>()

function handleChange(event: Event) {
  console.log(event)
}
</script>

<template>
  <div ref="dropzoneEl" class="vex-upload-dropzone">
    <label class="vex-upload-label">
      <slot />
      {{ files.map((file) => file.type).join(', ') }}
      <input @change="handleChange" class="vex-upload-input vex-sr-only" type="file" />
    </label>
  </div>

  <!-- files loader -->

  <div class="vex-upload-loaders">
    <div v-for="file in uploadingFiles" :key="file.name">{{ file.name }}</div>
  </div>
</template>

<style lang="scss">
.vex-upload-dropzone {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border: 1px dotted var(--vex-border-clr-base);
  border-radius: var(--vex-border-radius-md);
  transition: border-color 150ms;

  &:hover {
    border-color: var(--vex-border-clr-active);
  }
}
</style>
