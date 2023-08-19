import { useContext } from '@/composables'
import type { TemplateRef } from '@/composables/template-ref'
import type { Signal, ComputableGetter, Setter, Fn, Getter } from '@/types'
import { inject, type InjectionKey } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 menu context
//----------------------------------------------------------------------------------------------------

export type Value = string
export type Selected = Value | Value[] | undefined

export type MenuContext = {
  isMenuOpen: Signal<boolean>
  TriggerEl: TemplateRef
  ContentEl: TemplateRef
  TRIGGER_ID: string
  CONTENT_ID: string
  orientation: Getter<'vertical' | 'horizontal'>
  focusParentContent: Fn
  isSubMenu: boolean
  submenus: MenuContext[]
}

export const MENU_CTX = Symbol() as InjectionKey<MenuContext>

export function injectMenuContext(component: string) {
  return useContext(MENU_CTX, 'Menu', component)
}

//----------------------------------------------------------------------------------------------------
// 📌 content context
//----------------------------------------------------------------------------------------------------

export const MENU_CONTENT_CTX = Symbol() as InjectionKey<{
  CONTENT_ID: string
  activeItemId: Signal<number>
}>

export function injectContentContext(component: string) {
  return useContext(MENU_CONTENT_CTX, 'MenuContent', component)
}

//----------------------------------------------------------------------------------------------------
// 📌 trigger context
//----------------------------------------------------------------------------------------------------

export const MENU_TRIGGER_CTX = Symbol() as InjectionKey<{
  isTrigger: boolean
}>

export function injectTriggerContext() {
  return inject(MENU_TRIGGER_CTX, null)
}

//----------------------------------------------------------------------------------------------------
// 📌 group context
//----------------------------------------------------------------------------------------------------

export const MENU_GROUP = Symbol() as InjectionKey<{
  selection: [ComputableGetter<Selected>, Setter<Value>]
  itemType: Getter<'menuitemcheckbox' | 'menuitemradio'>
}>

export function injectGroupContext() {
  return inject(MENU_GROUP, null)
}
