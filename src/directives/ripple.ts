import type { Directive } from 'vue'

function rippleEffect(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const ripple = document.createElement('span')
  ripple.classList.add('vex-ripple')

  const diameter = Math.max(el.clientWidth, el.clientHeight)
  const radius = diameter / 2
  ripple.style.width = `${diameter}px`
  ripple.style.height = `${diameter}px`

  const { top, left } = el.getBoundingClientRect()
  ripple.style.top = `${e.clientY - top - radius}px`
  ripple.style.left = `${e.clientX - left - radius}px`

  el.appendChild(ripple)

  setTimeout(() => {
    el?.removeChild(ripple)
  }, 1000)
}

export const vRipple: Directive<HTMLElement> = {
  mounted(el: HTMLElement) {
    el.addEventListener('mousedown', rippleEffect)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('mousedown', rippleEffect)
  },
}
