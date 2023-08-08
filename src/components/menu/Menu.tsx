import {
  useClickOutside,
  useComputed,
  useContext,
  useDelayedOpen,
  useDropdownAria,
  useFloating,
  useID,
  useSignal,
  useTemplateRef,
  useVModel,
} from '@/composables'
import type { TemplateRef } from '@/composables/template-ref'
import type { Getter, Setter, Signal } from '@/types'
import type { Placement } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import type { ExtractPropTypes, InjectionKey, PropType, SetupContext, Prop } from 'vue'
import {
  Teleport,
  Transition,
  cloneVNode,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  watch,
} from 'vue'
import { ChevronRightIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { useSelect } from '@/composables/select'

//----------------------------------------------------------------------------------------------------
// 📌 Menu
//----------------------------------------------------------------------------------------------------

type Value = string
type Selected = Value | Value[] | undefined

const MENU_CTX = Symbol() as InjectionKey<{
  highlighted: Signal<number>
  selected: [Getter<Selected>, (v: Value) => void]
  TriggerEl: TemplateRef
  ContentEl: TemplateRef
  isMenuOpen: Signal<boolean>
  items: Set<HTMLElement>
  CONTENT_ID: string
  focusParentContent: () => void
  highlightOwnTrigger: () => void
  isSubMenu: boolean
}>
const useMenuCtx = (component: string) => useContext(MENU_CTX, 'Menu', component)

const MenuProps = {
  modelValue: [String, Array] as PropType<Selected>,
  multiple: Boolean,
  deselectOnReselect: Boolean,
}
type MenuProps = ExtractPropTypes<typeof MenuProps>
type MenuEmits = ['update:modelValue']

//----------------------------------------------------------------------------------------------------

const MenuImpl = (p: MenuProps, { slots, emit }: SetupContext<MenuEmits>) => {
  const TRIGGER_ID = useID()
  const CONTENT_ID = useID()

  const [TriggerEl, setTriggerEl] = useTemplateRef('MenuTrigger')
  const [ContentEl, setContentEl] = useTemplateRef('MenuContent')

  const [isMenuOpen, setIsMenuOpen] = useSignal(false)
  const [highlighted, setHighlighted] = useSignal(-1)

  const [selected, setSelected] = useSelect(
    useVModel(() => p.modelValue),
    {
      multiSelect: () => p.multiple,
      deSelectOnReSelect: () => p.deselectOnReselect,
    }
  )

  const items = shallowReactive(new Set<HTMLElement>())

  useDropdownAria(TriggerEl, ContentEl, {
    ariaExpanded: isMenuOpen,
    dropdownId: CONTENT_ID,
    triggerId: TRIGGER_ID,
    role: 'menu',
    ariaActiveDescendant: () => `${CONTENT_ID}-${highlighted()}`,
  })

  const ctx = inject(MENU_CTX, null)
  const isSubMenu = !!ctx

  provide(MENU_CTX, {
    highlighted: [highlighted, setHighlighted],
    selected: [selected, setSelected],
    isMenuOpen: [isMenuOpen, setIsMenuOpen],
    TriggerEl: [TriggerEl, setTriggerEl],
    ContentEl: [ContentEl, setContentEl],
    items,
    CONTENT_ID,
    focusParentContent: () => ctx?.ContentEl[0]()?.focus(),
    highlightOwnTrigger: () => ctx?.highlighted[1]([...ctx.items].indexOf(TriggerEl()!)),
    isSubMenu,
  })

  return () => slots.default?.()
}

const Menu = defineComponent({
  setup: MenuImpl,
  props: MenuProps,
  emits: ['update:modelValue'],
  name: 'Menu',
  inheritAttrs: false,
})
export type Menu = InstanceType<typeof Menu>

//----------------------------------------------------------------------------------------------------
// 📌 Menu Trigger
//----------------------------------------------------------------------------------------------------

const MENU_TRIGGER_CTX = Symbol() as InjectionKey<{
  isTrigger: boolean
}>

function useMenuTriggerCtx() {
  return inject(MENU_TRIGGER_CTX, null)
}

const MenuTriggerProps = {
  asChild: Boolean,
}
type MenuTriggerProps = ExtractPropTypes<typeof MenuTriggerProps>

//----------------------------------------------------------------------------------------------------

const MenuTriggerImpl = (p: MenuTriggerProps, { slots, attrs }: SetupContext) => {
  const {
    TriggerEl: [TriggerEl, setTriggerEl],
    isMenuOpen: [isMenuOpen, setIsMenuOpen],
    ContentEl: [ContentEl],
    isSubMenu,
  } = useMenuCtx('MenuTrigger')

  /*
   for now: 
   top level menus does not support hover open.
   submenus does not support ArrowKey open. 
  */
  isSubMenu
    ? useHoverOpen(TriggerEl, ContentEl, setIsMenuOpen)
    : useKeydownOpen(TriggerEl, ContentEl, setIsMenuOpen)

  if (!isSubMenu) {
    // restore focus to trigger when menu closes
    watch(isMenuOpen, (isOpen) => !isOpen && TriggerEl()?.focus({ preventScroll: true }))
  }

  useClickOpen(TriggerEl, ContentEl, [isMenuOpen, setIsMenuOpen])

  provide(MENU_TRIGGER_CTX, {
    isTrigger: true,
  })

  return () =>
    isSubMenu || p.asChild ? (
      cloneVNode(
        slots.default!()[0],
        {
          ref: setTriggerEl,
        },
        true
      )
    ) : (
      <button {...attrs} ref={setTriggerEl}>
        {slots.default?.()}
      </button>
    )
}

const MenuTrigger = defineComponent({
  setup: MenuTriggerImpl,
  props: MenuTriggerProps,
  name: 'MenuTrigger',
  inheritAttrs: false,
})
export type MenuTrigger = InstanceType<typeof MenuTrigger>

//----------------------------------------------------------------------------------------------------
// 📌 Menu Content
//----------------------------------------------------------------------------------------------------

const MENU_CONTENT_CTX = Symbol() as InjectionKey<{
  highlighted: Signal<number>
  selected: [Getter<Selected>, (v: Value) => void]
  items: Set<HTMLElement>
  isMenuOpen: Getter<boolean>
  CONTENT_ID: string
}>

function useMenuContentCxt(component: string) {
  return useContext(MENU_CONTENT_CTX, 'MenuContent', component)
}

const MenuContentProps = {
  placement: String as PropType<Placement>,
  noAutoMinWidth: Boolean,
}
type MenuContentProps = ExtractPropTypes<typeof MenuContentProps>

//----------------------------------------------------------------------------------------------------

const MenuContentImpl = (p: MenuContentProps, { slots, attrs }: SetupContext) => {
  const {
    isMenuOpen: [isMenuOpen, setIsMenuOpen],
    highlighted: [highlighted, setHighlighted],
    selected,
    TriggerEl: [TriggerEl],
    ContentEl: [ContentEl, setContentEl],
    CONTENT_ID,
    items,
    focusParentContent,
    highlightOwnTrigger,
    isSubMenu,
  } = useMenuCtx('MenuContent')

  useListHighlight(ContentEl, [highlighted, setHighlighted], items)

  /**
   * submenus have few unique interactions to top level menus:
   *
   * - when a user hovers a submenu, its trigger (a menuitem) should be highlighted.
   * - when highlight is on a submenu trigger and the user presses `ArrowRight` key the submenu should open.
   * - when a user presses the `ArrowLeft` key the submenu should close and focus should be restored to parent menu-content.
   */
  if (isSubMenu) {
    useEventListener(ContentEl, 'pointerenter', highlightOwnTrigger)
  }
  useEventListener(ContentEl, 'keydown', (e: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    e.stopPropagation()

    switch (e.key) {
      case 'ArrowRight':
        const item = [...items][highlighted()]
        item?.click()
        break

      case 'ArrowLeft':
        if (!isSubMenu) return
        setIsMenuOpen(false)
        focusParentContent()
        break
    }
  })

  const { floatingStyles } = useFloating(TriggerEl, ContentEl, isMenuOpen, {
    placement: () => (p.placement ?? isSubMenu ? 'right-start' : 'bottom-start'),
    autoMinWidth: () => !p.noAutoMinWidth,
    strategy: 'absolute',
    offset: isSubMenu ? -1 : undefined,
  })

  watch(isMenuOpen, (val) => val || setHighlighted(-1))

  // re-provide context so it won't conflict with a submenu context
  provide(MENU_CONTENT_CTX, {
    highlighted: [highlighted, setHighlighted],
    isMenuOpen,
    selected,
    items,
    CONTENT_ID,
  })

  return () => (
    <Teleport disabled={isSubMenu} to="body">
      <Transition name="vex-t-menu">
        {isMenuOpen() && (
          <div
            tabindex="-1"
            {...attrs}
            style={floatingStyles.value}
            ref={setContentEl}
            class={['vex-menu-content', !p.noAutoMinWidth && '--auto-min-width']}
            onFocus={() => {
              /**
               * a menu/submenu content will gain focus from two interactions:
               * - when it opens, in this case we want to default to highlighting the first non-disabled item.
               * - when a submenu-content is closed focus is restored to the parent menu/submenu content,
               *  in this case we want to preserve the highlight of the closing submenu trigger,
               *  we can achieve that by checking if there is an already highlighted item which means we are in case 2
               *  because highlighted is always set to -1 when its menu content closes.
               */

              highlighted() < 0 && setHighlighted(0)
            }}
          >
            {slots.default?.()}
          </div>
        )}
      </Transition>
    </Teleport>
  )
}

const MenuContent = defineComponent({
  setup: MenuContentImpl,
  props: MenuContentProps,
  inheritAttrs: false,
  name: 'MenuContent',
})
export type MenuContent = InstanceType<typeof MenuContent>

//----------------------------------------------------------------------------------------------------
// 📌 Menu Item
//----------------------------------------------------------------------------------------------------

const MenuItemProps = {
  disabled: Boolean,
  closeOnClick: Boolean,
  value: { type: String as PropType<Value>, required: true } as const,
}
type MenuItemProps = ExtractPropTypes<typeof MenuItemProps>

//----------------------------------------------------------------------------------------------------

const MenuItemImpl = (p: MenuItemProps, { slots, attrs }: SetupContext) => {
  const {
    highlighted: [_, setHighlighted],
    selected: [selected, setSelected],
    items,
    CONTENT_ID,
  } = useMenuContentCxt('MenuItem')
  const isTrigger = !!useMenuTriggerCtx()
  const [getItemEl, setItemEl] = useTemplateRef('MenuItem')

  onMounted(() => {
    watch(
      () => p.disabled,
      (disabled) => {
        disabled ? items.delete(getItemEl()!) : items.add(getItemEl()!)
      },
      { immediate: true }
    )
  })
  onBeforeUnmount(() => items.delete(getItemEl()!))

  const index = useComputed(() => [...items].indexOf(getItemEl()!))
  const isSelected = useComputed(() => {
    const _selected = selected()
    return Array.isArray(_selected) ? _selected.includes(p.value) : _selected === p.value
  })

  return () => (
    <button
      {...attrs}
      tabindex="-1"
      ref={setItemEl}
      id={`${CONTENT_ID}-${index.value}`}
      disabled={p.disabled}
      role="menuitem"
      class={['vex-menu-item', isTrigger && '--is-trigger']}
      onClick={() => !isTrigger && setSelected(p.value)}
      onPointerenter={() => setHighlighted(index.value)}
      onPointerleave={() => setHighlighted(-1)}
    >
      <div class="vex-menu-item-check">{isSelected.value && <CheckIcon />}</div>
      {slots.default?.()}
      {isTrigger && (
        <div class="vex-menu-item-chevron">
          <ChevronRightIcon />
        </div>
      )}
    </button>
  )
}

const MenuItem = defineComponent({
  setup: MenuItemImpl,
  props: MenuItemProps,
  name: 'MenuItem',
  inheritAttrs: false,
})
export type MenuItem = InstanceType<typeof MenuItem>

//----------------------------------------------------------------------------------------------------
// 📌 Utils
//----------------------------------------------------------------------------------------------------

function useListHighlight(
  list: Getter<HTMLElement | null>,
  highlight: Signal<number>,
  items: Set<HTMLElement>
): void {
  const [highlighted, setHighlighted] = highlight

  watch(
    highlighted,
    (newHighlighted, oldHighlighted) => {
      const _items = [...items]
      _items[oldHighlighted]?.classList.remove('--highlighted')
      _items[newHighlighted]?.classList.add('--highlighted')
    },
    { flush: 'sync' }
  )

  useEventListener(list, 'keydown', (e: KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return

    const last = items.size - 1
    e.preventDefault()
    e.stopPropagation()

    switch (e.key) {
      case 'ArrowDown':
        setHighlighted((v) => (v >= last ? 0 : v + 1))
        break
      case 'ArrowUp':
        setHighlighted((v) => (v <= 0 ? last : v - 1))
        break
      case 'Home':
        setHighlighted(0)
        break
      case 'End':
        setHighlighted(last)
        break
    }
  })
}

function useClickOpen(
  reference: Getter<HTMLElement | null>,
  floating: Getter<HTMLElement | null>,
  open: Signal<boolean>
) {
  const [isOpen, setIsOpen] = open

  useEventListener(reference, 'click', () => {
    setIsOpen((v) => !v)
    if (!isOpen()) return
    setTimeout(() => floating()?.focus())
  })

  useClickOutside(floating, () => setIsOpen(false), { ignore: [reference] })
}

function useKeydownOpen(
  reference: Getter<HTMLElement | null>,
  floating: Getter<HTMLElement | null>,
  setIsOpen: Setter<boolean>
) {
  useEventListener(reference, 'keydown', (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault()
      setIsOpen(true)
      setTimeout(() => floating()?.focus())
    }
  })

  useEventListener(floating, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  })

  // firefox bug
  useEventListener(reference, 'keyup', (e: KeyboardEvent) => {
    if (e.key === ' ') e.preventDefault()
  })
}

function useHoverOpen(
  reference: Getter<HTMLElement | null>,
  floating: Getter<HTMLElement | null>,
  setIsMenuOpen: Setter<boolean>
) {
  const { close, open } = useDelayedOpen({
    open: () => setIsMenuOpen(true),
    close: () => setIsMenuOpen(false),
    defaultOpenDelay: () => 100,
    defaultCloseDelay: () => 100,
  })

  useEventListener(reference, 'pointerenter', () => open())
  useEventListener(reference, 'pointerleave', () => close())
  useEventListener(floating, 'pointerenter', () => open())
  useEventListener(floating, 'pointerleave', () => close())
}

const Root = Menu
const Trigger = MenuTrigger
const Content = MenuContent
const Item = MenuItem

export {
  Root,
  Trigger,
  Content,
  Item,
  //
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
}
