import { RefObject, useEffect } from "react"

export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handleOnClickOutside: (event: MouseEvent | TouchEvent) => void,
  options?: { enabled?: boolean }
) => {
  useEffect(() => {
    if (options?.enabled === false) return

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handleOnClickOutside(event)
    }
    document.addEventListener("mousedown", listener, { passive: true })
    document.addEventListener("touchstart", listener, { passive: true })
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handleOnClickOutside, options?.enabled])
}
