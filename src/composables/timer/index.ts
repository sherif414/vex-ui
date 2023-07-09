import { onUnmounted, readonly, ref } from 'vue'
import type { Timer } from './types'

/**
 * Custom hook to create a timer with the given duration and callback.
 * @function
 * @param duration - The duration of the timer in milliseconds.
 * @param cb - The callback function to be executed when the timer ends.
 * @returns An object containing the timer control methods.
 */
export function useTimer(duration: number, cb: () => void): Timer {
  let startTime = 0
  let remainingTime = duration
  let timeoutId: ReturnType<typeof setTimeout>

  const isRunning = ref(false)

  function start() {
    isRunning.value = true
    startTime = Date.now()

    timeoutId = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)
  }

  function stop() {
    isRunning.value = false
    remainingTime = 0
    clearTimeout(timeoutId)
  }

  function pause() {
    if (remainingTime === 0 || !isRunning.value) return

    isRunning.value = false
    clearTimeout(timeoutId)
    remainingTime -= Date.now() - startTime
  }

  function resume() {
    if (remainingTime === 0 || isRunning.value) return
    start()
  }

  onUnmounted(stop)

  return {
    start,
    stop,
    pause,
    resume,
    isRunning: readonly(isRunning),
  }
}
