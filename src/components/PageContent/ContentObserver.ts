import { useEffect } from "preact/hooks"
import { MarkdownHeading } from "astro"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"

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

    // TODO: Set next.id to the next element id in headings to avoid stopping at other elements with ids
    // i.e. new param (end: Element), check next.id !== end.id
    const wrapElements = (start: Element, options?: { wrapperElement?: "div" | "section"; isParent?: boolean }) => {
      const wrapper = document.createElement(options?.wrapperElement ?? "section")
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
    headings.forEach((h) => {
      const e = document.getElementById(h.slug)
      if (e) {
        // If h2, wrap all lesser headers as children
        const wrapper = wrapElements(e, { isParent: h.depth === 2 })
        sectionsObserver.observe(wrapper)
        if (h.depth === 2) {
          // Select nested h2 element in parent section (created previously)
          const e = document.querySelector(`h2#${h.slug}`)
          if (e) {
            // Create a nested wrapper for non-subheading elements
            const wrapper = wrapElements(e, { wrapperElement: "div" })
            // Extract the header from the first nested wrapper to use as sticky header
            if (wrapper.firstElementChild) {
              wrapper.parentNode?.insertBefore(wrapper.firstElementChild, wrapper)
            }
            // Observe the rest of the nested wrapper
            sectionsObserver.observe(wrapper)
          }
        }
      }
    })

    return () => sectionsObserver.disconnect()
  }, [])
}
