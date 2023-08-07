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
} from '@/composables'
import type { TemplateRef } from '@/composables/template-ref'
import type { Getter, Setter, Signal } from '@/types'
import type { Placement } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import type { InjectionKey } from 'vue'
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

//----------------------------------------------------------------------------------------------------
// 📌 Menu
//----------------------------------------------------------------------------------------------------

const MENU_CTX = Symbol() as InjectionKey<{
  highlighted: Signal<number>
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

interface MenuProps {}
const Menu = defineComponent<MenuProps>(
  (p, { slots }) => {
    const TRIGGER_ID = useID()
    const CONTENT_ID = useID()
    const [TriggerEl, setTriggerEl] = useTemplateRef('MenuTrigger')
    const [ContentEl, setContentEl] = useTemplateRef('MenuContent')
    const [isMenuOpen, setIsMenuOpen] = useSignal(false)
    const [highlighted, setHighlighted] = useSignal(-1)

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
  },
  {
    props: [],
    name: 'Menu',
    inheritAttrs: false,
  }
)

//----------------------------------------------------------------------------------------------------
// 📌 Menu Trigger
//----------------------------------------------------------------------------------------------------

interface MenuTriggerProps extends Record<string, any> {
  asChild?: boolean
}

const MenuTrigger = defineComponent<MenuTriggerProps>(
  (p, { slots, attrs }) => {
    const {
      TriggerEl: [TriggerEl, setTriggerEl],
      isMenuOpen: [isMenuOpen, setIsMenuOpen],
      ContentEl: [ContentEl],
      isSubMenu,
    } = useMenuCtx('MenuTrigger')

    isSubMenu
      ? useHoverOpen(TriggerEl, ContentEl, setIsMenuOpen)
      : useKeydownOpen(TriggerEl, ContentEl, setIsMenuOpen)

    if (!isSubMenu) {
      // restore focus to trigger when menu closes
      watch(isMenuOpen, (isOpen) => !isOpen && TriggerEl()?.focus({ preventScroll: true }))
    }

    useClickOpen(TriggerEl, ContentEl, [isMenuOpen, setIsMenuOpen])

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
  },
  {
    name: 'MenuTrigger',
    props: { asChild: Boolean, triggerOn: String } as any,
    inheritAttrs: false,
  }
)

//----------------------------------------------------------------------------------------------------
// 📌 Menu Content
//----------------------------------------------------------------------------------------------------

const MENU_CONTENT_CTX = Symbol() as InjectionKey<{
  highlighted: Signal<number>
  items: Set<HTMLElement>
  isMenuOpen: Getter<boolean>
  CONTENT_ID: string
}>

const useMenuContentCxt = (component: string) =>
  useContext(MENU_CONTENT_CTX, 'MenuContent', component)

interface MenuContentProps {
  placement?: Placement
}

const MenuContent = defineComponent<MenuContentProps>(
  (p, { slots, attrs }) => {
    const {
      isMenuOpen: [isMenuOpen, setIsMenuOpen],
      highlighted: [highlighted, setHighlighted],
      TriggerEl: [TriggerEl],
      ContentEl: [ContentEl, setContentEl],
      CONTENT_ID,
      items,
      focusParentContent,
      highlightOwnTrigger,
      isSubMenu,
    } = useMenuCtx('MenuContent')

    useListHighlight(ContentEl, [highlighted, setHighlighted], items)

    //----------------------------------------------------------------------------------------------------

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

    //----------------------------------------------------------------------------------------------------

    const { floatingStyles } = useFloating(TriggerEl, ContentEl, isMenuOpen, {
      placement: () => (p.placement ?? isSubMenu ? 'right-start' : 'bottom-start'),
      autoMinWidth: true,
      strategy: 'absolute',
      offset: isSubMenu ? -1 : undefined,
    })

    //----------------------------------------------------------------------------------------------------

    watch(isMenuOpen, (val) => val || setHighlighted(-1))

    // re-provide context so it won't conflict with a submenu context
    provide(MENU_CONTENT_CTX, {
      highlighted: [highlighted, setHighlighted],
      isMenuOpen,
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
              class="vex-menu"
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
  },
  {
    props: { placement: String } as any,
    inheritAttrs: false,
    name: 'MenuContent',
  }
)

//----------------------------------------------------------------------------------------------------
// 📌 Menu Item
//----------------------------------------------------------------------------------------------------

interface MenuItemProps {
  disabled?: boolean
  closeOnClick?: boolean
}

const MenuItem = defineComponent<MenuItemProps>(
  (p, { slots, attrs }) => {
    const {
      highlighted: [_, setHighlighted],
      items,
      CONTENT_ID,
    } = useMenuContentCxt('MenuItem')

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

    return () => (
      <button
        {...attrs}
        tabindex="-1"
        ref={setItemEl}
        id={`${CONTENT_ID}-${index.value}`}
        disabled={p.disabled}
        role="menuitem"
        class="vex-menu-item"
        onPointerenter={() => setHighlighted(index.value)}
        onPointerleave={() => setHighlighted(-1)}
      >
        {slots.default?.()}
      </button>
    )
  },
  {
    props: { disabled: Boolean, closeOnClick: Boolean },
    name: 'MenuItem',
    inheritAttrs: false,
  }
)

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
