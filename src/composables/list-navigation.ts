/**
 * Handles keyboard navigation for a list of elements.
 *
 * @param  childrenSelector - css selector for the list's elements.
 * @param  loop - Whether to loop back to the other side of the list when reaching an end.
 */
export function useListNavigation(childrenSelector: string, loop: boolean = true) {
  /**
   * must be bound to a keydown event on the parent element
   * and the parent must not be focusable by `tab`.
   *
   * @param e - The keyboard event that triggered the navigation.
   */
  function onKeydown(e: KeyboardEvent) {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return

    const parent = e.currentTarget as HTMLElement
    const children = Array.from(parent.querySelectorAll<HTMLElement>(childrenSelector))
    if (!children.length) return
    e.preventDefault()

    const index = children.findIndex((child) => child === document.activeElement)

    // when focus is not on a list-item
    if (index < 0) return

    let nextChildIndex = -1

    if (e.key === 'ArrowDown') {
      nextChildIndex = children.length - 1 === index ? (loop ? 0 : index) : index + 1
    }
    //
    else if (e.key === 'ArrowUp') {
      nextChildIndex = index === 0 ? (loop ? children.length - 1 : index) : index - 1
    }
    //
    else if (e.key === 'Home') {
      nextChildIndex = 0
    }
    //
    else if (e.key === 'End') {
      nextChildIndex = children.length - 1
    }

    if (index !== nextChildIndex) {
      children[nextChildIndex].focus()
    }
  }

  return {
    onKeydown,
  }
}
