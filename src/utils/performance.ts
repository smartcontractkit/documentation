type AnyFunction = (...args: unknown[]) => unknown

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeoutId: NodeJS.Timeout | undefined

  return function debounced(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    const later = () => {
      timeoutId = undefined
      return func.apply(this, args)
    }

    clearTimeout(timeoutId)
    timeoutId = setTimeout(later, wait)
    return undefined
  }
}
