import type { Ref } from 'vue'
/**
 * Timer interface that provides methods to control a timer.
 * @interface
 */
export interface Timer {
  /**
   * Start the timer.
   */
  start: () => void

  /**
   * Stop the timer and clear it.
   */
  stop: () => void

  /**
   * Pause the timer and update the remaining time.
   */
  pause: () => void

  /**
   * Resume the timer if there is remaining time.
   */
  resume: () => void

  /**
   * Whether the timer is currently running.
   *
   * @readonly
   */
  readonly isRunning: Readonly<Ref<boolean>>
}
