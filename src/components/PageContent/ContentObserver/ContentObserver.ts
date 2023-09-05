import { useEffect } from "preact/hooks"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { currentIds } from "~/hooks/currentIds/idStore"
import { MarkdownHeading } from "astro"

export const ContentObserver = ({ headings }: { headings: MarkdownHeading[] }) => {
  const { setCurrentIds } = useCurrentIds()

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const ids: Record<string, boolean> = currentIds.get()
      for (const entry of entries) {
        ids[entry.target.id] = entry.isIntersecting
      }
      setCurrentIds(ids)
    }
    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0% -80%",
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
