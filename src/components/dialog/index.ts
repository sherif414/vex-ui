import { reactive } from 'vue'
export { default as Dialog } from './Dialog.vue'
import './style/index.scss'

export const dialogStore = reactive({
  openDialogsCount: 0,
})
