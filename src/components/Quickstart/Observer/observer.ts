import { useState, useEffect } from "preact/hooks"
import { useStore } from "@nanostores/preact"
import { shouldUpdateId } from "./idStore"

export function useCurrentId() {
  const [currentId, setCurrentId] = useState("overview")
  const $shouldUpdateId = useStore(shouldUpdateId)

  useEffect(() => {
    const setCurrent: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          return setCurrentId(entry.target.id)
        }
      }
    }

    const observerOptions: IntersectionObserverInit = {
      // Negative top margin accounts for `scroll-margin`.
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      // top | right+left | bottom
      rootMargin: `-30% 0px -70%`,
    }

    // TODO: Move this out of TOC, use for Quickstart to handle sticky headers
    const sectionsObserver = new IntersectionObserver(setCurrent, observerOptions)

    // Observe all necessary sections in the main page content.
    document.querySelectorAll("article > section, #overview").forEach((h) => sectionsObserver.observe(h))

    // Stop observing when the component is unmounted.
    return () => sectionsObserver.disconnect()
  }, [$shouldUpdateId])

  return { currentId, setCurrentId }
}
