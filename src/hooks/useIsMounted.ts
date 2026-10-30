import { useEffect, useState } from "react"

/**
 * `false` on the server and during hydration, `true` once the component is mounted in the browser.
 * Lets a hydrated island (`client:load`) render browser-only UI without a hydration mismatch.
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])
  return isMounted
}
