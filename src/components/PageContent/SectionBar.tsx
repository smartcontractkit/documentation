import { useEffect, useState } from "preact/hooks"
import { useCurrentSection } from "~/hooks/currentSection/useCurrentSection"
import { MarkdownHeading } from "astro"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"
import styles from "./sectionBar.module.css"

// NOTE: Currently not using this visually, just need the logic
export const SectionBar = ({ headings }: { headings: MarkdownHeading[] }) => {
  // TODO: Figure out if we still want to use currentSection
  // const [hidden, setHidden] = useState<boolean>(true)
  // const { $currentSection, setCurrentSection } = useCurrentSection()
  const { setCurrentId } = useCurrentId()

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.reverse() // Get child entries before parent entries, allows nested headers to work properly
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // NOTE: Commented out until we figure out how / if this can be used
          // const child = entry.target.firstElementChild
          // if (child && ["H2"].includes(child.nodeName)) {
          //   setHidden(false)
          //   setCurrentSection(entry.target.firstElementChild)
          // } else if (child && ["H1"].includes(child.nodeName)) {
          //   setHidden(true)
          // }
          return setCurrentId(entry.target.id)
        }
      }
    }
    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-25% 0% -75%",
    })

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
  }, [])

  // return (
  //   <h2 className={styles.bar} disabled={hidden}>
  //     {$currentSection.textContent}
  //   </h2>
  // )
}
