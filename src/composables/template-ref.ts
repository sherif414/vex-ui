import type { ComponentPublicInstance } from 'vue'
import { useSignal } from '.'
import { getElementFromRef } from './helpers'

/**
 * normalizes getting and setting template refs for components and elements.
 *
 * @param component its used to log errors to the console
 */
export function useTemplateRef(component: string) {
  const [templateRef, setTemplateRef] = useSignal<HTMLElement | null>(null)

  const setter = (vm: HTMLElement | ComponentPublicInstance | null) =>
    setTemplateRef(getElementFromRef(vm, component))

  return [templateRef, setter] as const
}
