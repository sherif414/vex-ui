import { reactive } from 'vue'
export { default as Dialog } from './Dialog.vue'

export const dialogStore = reactive({
  openDialogsCount: 0,
})
