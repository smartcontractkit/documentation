import { useEffect } from "preact/hooks"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"
import { updateTableOfContents } from "../RightSidebar/TableOfContents/tocStore"

export const ContentObserver = () => {
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

    // TODO: Set next.id to the next element id in headings to avoid stopping at other elements with ids
    // i.e. new param (end: Element), check next.id !== end.id
    const wrapElements = (start: Element, options?: { isParent?: boolean }) => {
      const wrapper = document.createElement("section")
      const elements: Element[] = []
      elements.push(start)
      let next = start.nextElementSibling
      // eslint-disable-next-line no-unmodified-loop-condition
      while (next && (!next.id || (options?.isParent && next.nodeName !== start.nodeName))) {
        elements.push(next)
        next = next.nextElementSibling
      }
      wrapper.id = start.id
      start.parentNode?.insertBefore(wrapper, start)
      elements.forEach((e) => wrapper.appendChild(e))
      return wrapper
    }
    /**
     * Looks janky, but is necessary to achieve sticky h2 headers
     * with functioning intersection observers for nested h3, h4 headers
     */
    const elements = document.querySelectorAll("article > :where(h1, h2, h3, h4)")
    elements.forEach((e) => {
      // If h2, wrap all lesser headers as children
      const wrapper = wrapElements(e, { isParent: e.nodeName === "H2" })
      sectionsObserver.observe(wrapper)
      if (e.nodeName === "H2") {
        // Create a nested wrapper for non-subheading elements
        const wrapper = wrapElements(e)
        // Extract the header from the first nested wrapper to use as sticky header
        if (wrapper.firstElementChild) {
          wrapper.parentNode?.insertBefore(wrapper.firstElementChild, wrapper)
        }
        // Observe the rest of the nested wrapper
        sectionsObserver.observe(wrapper)
      }
    })
    updateTableOfContents()
    return () => sectionsObserver.disconnect()
  }, [])
}
