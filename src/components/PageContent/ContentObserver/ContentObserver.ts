import { useEffect } from "preact/hooks"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"
import { MarkdownHeading } from "astro"

export const ContentObserver = ({ headings }: { headings: MarkdownHeading[] }) => {
  const { setCurrentId } = useCurrentId()

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.reverse() // Get child entries before parent entries, allows nested headers to work properly
      for (const entry of entries) {
        if (entry.isIntersecting) {
          return setCurrentId(entry.target.id)
        }
      }
    }
    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-25% 0% -75%",
    })

    const sections: (Element | null)[] = []
    headings.forEach((h) => {
      sections.push(document.body.querySelector(`section#${h.slug}`))
      if (h.depth < 3) {
        sections.push(document.body.querySelector(`section#${h.slug} > section#${h.slug}`))
      }
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
