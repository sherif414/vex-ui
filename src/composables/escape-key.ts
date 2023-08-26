import { onScopeDispose } from 'vue'
import { remove } from './helpers'

type Handler = (e: KeyboardEvent) => void

const handlers: Handler[] = []
let isActive = false

export function useEscapeKey(handler: Handler) {
  if (!isActive) {
    document.addEventListener('keydown', onEscape)
    isActive = true
  }

  handlers.push(handler)

  const cleanup = () => remove(handlers, handler)
  onScopeDispose(cleanup)

  return cleanup
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    handlers.forEach((fn) => fn(e))
  }
}
