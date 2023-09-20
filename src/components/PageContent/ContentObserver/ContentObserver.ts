import { useEffect } from "preact/hooks"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { currentIds } from "~/hooks/currentIds/idStore"
import { MarkdownHeading } from "astro"
import { useStickyHeader } from "~/hooks/stickyHeader/useStickyHeader"

interface Props {
  headings: MarkdownHeading[]
  shouldUpdate: number
}

export const ContentObserver = ({ headings, shouldUpdate }: Props) => {
  const { setCurrentIds } = useCurrentIds()
  const { setStickyHeader } = useStickyHeader()

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      let stickyHeaderSet = false
      const intersectingElementMap: Record<string, boolean> = currentIds.get()
      for (const entry of entries) {
        const { isIntersecting, target } = entry
        const { id, firstElementChild } = target
        intersectingElementMap[id] = isIntersecting
        if (
          !stickyHeaderSet &&
          isIntersecting &&
          firstElementChild?.textContent &&
          ["H1", "H2"].includes(firstElementChild.nodeName)
        ) {
          stickyHeaderSet = true
          setStickyHeader(firstElementChild.id === "overview" ? "Overview" : firstElementChild.textContent)
        }
      }
      if (Object.values(currentIds.get()).every((v) => !v)) {
        setStickyHeader("")
      }
      setCurrentIds(intersectingElementMap)
    }

    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-15% 0% -85%",
    })

    headings.forEach((h) => {
      const section = document.getElementById(h.slug)
      if (section) {
        sectionsObserver.observe(section)
      }
    })
    return () => sectionsObserver.disconnect()
  }, [headings, shouldUpdate])

  return null
}
