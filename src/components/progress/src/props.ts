export interface ProgressProps {
  /**
   * specifies the current progress percentage.
   * @default 0
   */
  value?: number

  /**
   * specifies the time it takes - in ms - to animate the progress bar
   * from the previous value the new value.
   * @default 300
   */
  duration?: number

  /**
   * specifies the progress bar height.
   * @default 3
   */
  height?: number

  /**
   * specifies the progress bar color.
   * @default 'primary'
   */
  color?: 'primary' | 'success' | 'danger' | 'warning'

  /**
   * specifies the progress aria-valuetext attribute
   */
  ariaValuetext?: string
}
