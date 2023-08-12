import {
  useClickOpen,
  useComputed,
  useContext,
  useDropdownAria,
  useFloating,
  useID,
  useKeyboardOpen,
  useListHighlight,
  usePointerOpen,
  useSelect,
  useSignal,
  useTemplateRef,
  useVModel,
} from '@/composables'
import { createCollection, type CollectionContext } from '@/composables/collection'
import type { TemplateRef } from '@/composables/template-ref'
import type { ComputableGetter, Fn, Setter, Signal } from '@/types'
import type { Placement } from '@floating-ui/vue'
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { useEventListener } from '@vueuse/core'
import type { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue'
import {
  Teleport,
  Transition,
  cloneVNode,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  toRef,
  watch,
} from 'vue'

const ARROW_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'] as const

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
  selected: [ComputableGetter<Selected>, Setter<Value>]
  focusParentContent: Fn
  isSubMenu: boolean
}>

export function useMenuCtx(component: string) {
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
  selected: [ComputableGetter<Selected>, Setter<Value>]
  isMenuOpen: ComputableGetter<boolean>
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

  // ensure there is no highlighted element when content closes
  watch(isMenuOpen, (val) => val || setHighlighted(-1))

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
            onFocus={function onEntryFocus() {
              focusFirst(getItems())
            }}
            onPointerenter={function highlightOwnTrigger() {
              /**
               * submenus have few unique interactions to top level menus:
               *
               * - when a user hovers a submenu, its trigger (a menuitem) should be highlighted.
               * - when highlight is on a submenu trigger and the user presses `ArrowRight` key the submenu should open.
               * - when a user presses the `ArrowLeft` key the submenu should close and focus should be restored to parent menu-content.
               */
              // TODO: implement
              // focusFirst(getItems())
            }}
            onKeydown={function onKeydown(e: KeyboardEvent) {
              const key = e.key as ArrowKeys
              if (!ARROW_KEYS.includes(key)) return

              e.preventDefault()
              e.stopPropagation()
              let items = getItems().filter((item) => !(item as HTMLButtonElement).disabled)
              const intent = getKeyIntent(key)

              if (intent === 'next') {
                const currFocusedItemIdx = items.indexOf(e.target as HTMLElement)
                items = wrapArray(items, currFocusedItemIdx + 1)
              }

              if (intent === 'prev') {
                items.reverse()
                const currFocusedItemIdx = items.indexOf(e.target as HTMLElement)
                items = wrapArray(items, currFocusedItemIdx + 1)
              }

              if (intent === 'hide') {
              }
              if (intent === 'show') {
              }

              focusFirst(items)
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
      onClick={(e) => {
        !isTrigger && setSelected(p.value)
        // safari doesn't always focus when buttons are clicked so we manually focus
        ItemEl()?.focus({ preventScroll: true })
      }}
      onPointerenter={() => ItemEl()?.focus({ preventScroll: true })}
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
  Content,
  Item,
  //
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Root,
  Trigger,
}

type ArrowKeys = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight'

function getDirectionAwareKey(key: ArrowKeys, dir?: 'ltr' | 'rtl') {
  // TODO: implement direction
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

type KeyIntent = 'next' | 'prev' | 'show' | 'hide'

function getKeyIntent(key: ArrowKeys): KeyIntent {
  switch (getDirectionAwareKey(key)) {
    case 'ArrowDown':
      return 'next'

    case 'ArrowUp':
      return 'prev'

    case 'ArrowLeft':
      return 'hide'

    case 'ArrowRight':
      return 'show'
  }
}

function focusFirst(items: HTMLElement[]) {
  for (const item of items) {
    const prevFocusedItem = document.activeElement
    if (item === prevFocusedItem) return
    item.focus()
    if (document.activeElement !== prevFocusedItem) return
  }
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}
