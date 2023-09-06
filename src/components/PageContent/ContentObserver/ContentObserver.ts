import { useEffect } from "preact/hooks"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { currentIds } from "~/hooks/currentIds/idStore"
import { MarkdownHeading } from "astro"
import { useStickyHeader } from "~/hooks/stickyHeader/useStickyHeader"

export const ContentObserver = ({ headings }: { headings: MarkdownHeading[] }) => {
  const { setCurrentIds } = useCurrentIds()
  const { setStickyHeader } = useStickyHeader()

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      let stickyHeaderSet = false
      const ids: Record<string, boolean> = currentIds.get()
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.target.id === "overview") {
          setStickyHeader("")
        }
        ids[entry.target.id] = entry.isIntersecting
        if (
          !stickyHeaderSet &&
          entry.isIntersecting &&
          entry.target.firstElementChild?.textContent &&
          ["H1", "H2"].includes(entry.target.firstElementChild.nodeName)
        ) {
          stickyHeaderSet = true
          setStickyHeader(
            entry.target.firstElementChild.id === "overview" ? "Overview" : entry.target.firstElementChild.textContent
          )
        }
      }
      setCurrentIds(ids)
    }

    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-25% 0% -75%",
    })

    headings.forEach((h) => {
      const section = document.body.querySelector(`section#${h.slug}`)
      if (section) {
        sectionsObserver.observe(section)
      }
    })
    return () => sectionsObserver.disconnect()
  }, [headings])

  return null
}
