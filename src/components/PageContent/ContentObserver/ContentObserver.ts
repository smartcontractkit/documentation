import { useEffect } from "preact/hooks"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"
import { updateTableOfContents } from "../../RightSidebar/TableOfContents/tocStore"
import { useStore } from "@nanostores/preact"
import { shouldUpdateCo } from "./coStore"

export const ContentObserver = () => {
  const { setCurrentId } = useCurrentId()
  const $shouldUpdateCo = useStore(shouldUpdateCo)

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
    const sections = document.body.querySelectorAll("article > section, section > section")
    sections.forEach((section) => {
      if (section.id) {
        sectionsObserver.observe(section)
      }
    })
    updateTableOfContents()
    return () => sectionsObserver.disconnect()
  }, [$shouldUpdateCo])
}
