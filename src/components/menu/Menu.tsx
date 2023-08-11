import {
  useKeyboardOpen,
  usePointerOpen,
  useClickOpen,
  useComputed,
  useContext,
  useDropdownAria,
  useFloating,
  useID,
  useSignal,
  useTemplateRef,
  useVModel,
  useSelect,
  useListHighlight,
} from '@/composables'
import type { TemplateRef } from '@/composables/template-ref'
import type { ComputedGet, ComputedSet, Fn, Setter, Signal } from '@/types'
import type { Placement } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import type {
  ExtractPropTypes,
  InjectionKey,
  PropType,
  SetupContext,
  Prop,
  Ref,
  IntrinsicElementAttributes,
} from 'vue'
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
  toRef,
  watch,
} from 'vue'
import { ChevronRightIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { createCollection, type CollectionContext } from '@/composables/collection'

//----------------------------------------------------------------------------------------------------
// 📌 Menu
//----------------------------------------------------------------------------------------------------

type Value = string
type Selected = Value | Value[] | undefined

const MENU_CTX = Symbol() as InjectionKey<{
  highlighted: Signal<number>
  isMenuOpen: Signal<boolean>
  TriggerEl: TemplateRef
  ContentEl: TemplateRef
  TRIGGER_ID: string
  CONTENT_ID: string
  selected: [ComputedGet<Selected>, Setter<Value>]
  focusParentContent: Fn
  isSubMenu: boolean
}>

function useMenuCtx(component: string) {
  return useContext(MENU_CTX, 'Menu', component)
}

const MenuProps = {
  modelValue: [String, Array] as PropType<Selected>,
  multiselect: Boolean,
  deselection: Boolean,
}
type MenuProps = ExtractPropTypes<typeof MenuProps>
type MenuEmits = ['update:modelValue']

//----------------------------------------------------------------------------------------------------

const MenuImpl = (p: MenuProps, { slots, expose }: SetupContext<MenuEmits>) => {
  const TRIGGER_ID = useID()
  const CONTENT_ID = useID()

  const [TriggerEl, setTriggerEl] = useTemplateRef('MenuTrigger')
  const [ContentEl, setContentEl] = useTemplateRef('MenuContent')

  const [isMenuOpen, setIsMenuOpen] = useSignal(false)
  const [highlighted, setHighlighted] = useSignal(-1)

  const [selected, setSelected] = useSelect(
    useVModel(() => p.modelValue),
    {
      multiselect: () => p.multiselect,
      deselection: () => p.deselection,
    }
  )

  const ctx = inject(MENU_CTX, null)
  const isSubMenu = !!ctx

  provide(MENU_CTX, {
    highlighted: [highlighted, setHighlighted],
    selected: [selected, setSelected],
    isMenuOpen: [isMenuOpen, setIsMenuOpen],
    TriggerEl: [TriggerEl, setTriggerEl],
    ContentEl: [ContentEl, setContentEl],
    TRIGGER_ID,
    CONTENT_ID,
    isSubMenu,

    focusParentContent() {
      const el = ctx?.ContentEl[0]()
      el?.focus()
    },
  })

  expose({
    open: toRef(isMenuOpen),
    selected: toRef(() => p.modelValue),
    multiselect: toRef(() => p.multiselect),
    deselection: toRef(() => p.deselection),
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

const MenuTriggerProps = { asChild: Boolean }
type MenuTriggerProps = ExtractPropTypes<typeof MenuTriggerProps>

//----------------------------------------------------------------------------------------------------

const MenuTriggerImpl = (p: MenuTriggerProps, { slots, attrs }: SetupContext) => {
  const {
    TriggerEl: [TriggerEl, setTriggerEl],
    isMenuOpen: [isMenuOpen, setIsMenuOpen],
    ContentEl: [ContentEl],
    isSubMenu,
  } = useMenuCtx('MenuTrigger')

  isSubMenu
    ? usePointerOpen(TriggerEl, ContentEl, setIsMenuOpen)
    : useKeyboardOpen(TriggerEl, ContentEl, setIsMenuOpen)

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
  selected: [ComputedGet<Selected>, Setter<Value>]
  isMenuOpen: ComputedGet<boolean>
  CONTENT_ID: string
  useMenuCollection: () => CollectionContext
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
    TRIGGER_ID,
    CONTENT_ID,

    focusParentContent,
    isSubMenu,
  } = useMenuCtx('MenuContent')

  const [getItems, useMenuCollection] = createCollection(ContentEl)
  useListHighlight(ContentEl, [highlighted, setHighlighted], getItems)

  /**
   * submenus have few unique interactions to top level menus:
   *
   * - when a user hovers a submenu, its trigger (a menuitem) should be highlighted.
   * - when highlight is on a submenu trigger and the user presses `ArrowRight` key the submenu should open.
   * - when a user presses the `ArrowLeft` key the submenu should close and focus should be restored to parent menu-content.
   */
  if (isSubMenu) {
    useEventListener(ContentEl, 'pointerenter', function highlightOwnTrigger() {
      // TODO: implement
      throw 'not implemented'
    })
  }
  useEventListener(ContentEl, 'keydown', function onKeydown(e: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    e.stopPropagation()

    switch (e.key) {
      case 'ArrowRight':
        const item = getItems()[highlighted()]
        item?.click()
        break

      case 'ArrowLeft':
        if (!isSubMenu) return
        setIsMenuOpen(false)
        focusParentContent()
        break
    }
  })

  useDropdownAria(TriggerEl, ContentEl, {
    ariaExpanded: isMenuOpen,
    dropdownID: CONTENT_ID,
    targetElID: TRIGGER_ID,
    role: 'menu',
    ariaActiveDescendant: () => `${CONTENT_ID}-${highlighted()}`,
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
    CONTENT_ID,
    useMenuCollection,
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
            onFocus={function onFocus() {
              /**
               * a menu/submenu content may gain focus from two interactions:
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
    CONTENT_ID,
    useMenuCollection,
  } = useMenuContentCxt('MenuItem')

  const { getItems, register, unregister } = useMenuCollection()
  const isTrigger = !!useMenuTriggerCtx()
  const [ItemEl, setItemEl] = useTemplateRef('MenuItem')

  onMounted(() => p.disabled || register(ItemEl()!))
  onBeforeUnmount(() => unregister(ItemEl()!))

  watch(
    () => p.disabled,
    (disabled) => {
      disabled ? unregister(ItemEl()!) : register(ItemEl()!)
    }
  )

  const index = useComputed(() => getItems().indexOf(ItemEl()!))
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
// 📌 exports
//----------------------------------------------------------------------------------------------------

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
