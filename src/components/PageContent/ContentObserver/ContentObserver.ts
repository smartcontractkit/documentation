import { useEffect } from "preact/hooks"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { currentIds } from "~/hooks/currentIds/idStore"
import { MarkdownHeading } from "astro"

export const ContentObserver = ({ headings }: { headings: MarkdownHeading[] }) => {
  const { setCurrentIds } = useCurrentIds()

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const ids: Record<string, boolean> = currentIds.get()
      // entries.reverse() // Get child entries before parent entries, allows nested headers to work properly
      for (const entry of entries) {
        ids[entry.target.id] = entry.isIntersecting
      }
      setCurrentIds(ids)
    }
    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-25% 0% -75%",
    })

    const sections: (Element | null)[] = []
    headings.forEach((h) => {
      sections.push(document.body.querySelector(`section#${h.slug}`))
      // if (h.depth < 3) {
      //   sections.push(document.body.querySelector(`section#${h.slug} > section#${h.slug}`))
      // }
    })
    sections.forEach((section) => {
      if (section) {
        sectionsObserver.observe(section)
      }
    })
    return () => sectionsObserver.disconnect()
  }, [headings])

  return null
}
