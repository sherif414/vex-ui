import type { MaybeRefOrGetter, RefOrGetter, ComputedGet } from '@/types'
import { toRef, toValue, watch } from 'vue'

interface UseDropdownOptions {
  role?: 'menu' | 'listbox'
  dropdownId?: string
  triggerId?: string
  ariaExpanded?: MaybeRefOrGetter<boolean>
  ariaActiveDescendant: ComputedGet<string>
}

/**
 * handles setting aria attributes
 */
export function useDropdownAria(
  trigger: ComputedGet<HTMLElement | null>,
  dropdown: ComputedGet<HTMLElement | null>,
  options: UseDropdownOptions
) {
  //----------------------------------------------------------------------------------------------------
  // 📌 attributes
  //----------------------------------------------------------------------------------------------------

  const { ariaActiveDescendant, dropdownId, triggerId, role } = options
  const isExpanded = toRef(options.ariaExpanded)

  watch(trigger, (el) => {
    if (!el) return
    el.setAttribute('aria-expanded', `${isExpanded.value}`)
    el.setAttribute('aria-controls', `${dropdownId}`)
    el.setAttribute('aria-haspopup', `${role}`)
    el.setAttribute('id', `${triggerId}`)
  })

  watch(dropdown, (el) => {
    if (!el) return
    el.setAttribute('aria-labelledby', `${triggerId}`)
    el.setAttribute('role', `${role}`)
    el.setAttribute('id', `${dropdownId}`)
  })

  watch(isExpanded, (expanded) => {
    trigger()?.setAttribute('aria-expanded', `${expanded}`)
  })

  watch(ariaActiveDescendant, (active) => {
    dropdown()?.setAttribute('aria-activedescendant', `${active}`)
  })
}
