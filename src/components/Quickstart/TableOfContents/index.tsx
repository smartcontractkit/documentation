/** @jsxImportSource preact */
import { useStore } from "@nanostores/preact"
import type { FunctionalComponent, RefObject } from "preact"
import { useState, useEffect, useRef } from "preact/hooks"
import { shouldUpdateToc } from "./tocStore"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"

const TableOfContents: FunctionalComponent<{
  headings: MarkdownHeading[]
  contentId: string
}> = ({ headings, contentId }) => {
  const tableOfContents = useRef<HTMLUListElement>()
  const [currentID, setCurrentID] = useState("overview")
  const $shouldUpdateToc = useStore(shouldUpdateToc)

  useEffect(() => {
    if (!tableOfContents.current) return

    const setCurrent: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          return setCurrentID(entry.target.id)
        }
      }
    }

    const observerOptions: IntersectionObserverInit = {
      // Negative top margin accounts for `scroll-margin`.
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      // top | right+left | bottom
      rootMargin: `0px 0px -90%`,
    }

    const headingsObserver = new IntersectionObserver(setCurrent, observerOptions)

    // Observe all necessary headings in the main page content.
    document.querySelectorAll(`#${contentId} :is(#overview, h2)`).forEach((h) => headingsObserver.observe(h))

    // Stop observing when the component is unmounted.
    return () => headingsObserver.disconnect()
  }, [tableOfContents.current, $shouldUpdateToc])

  return (
    <>
      <h2 className="heading" style={{ padding: 0 }}>
        On this page
      </h2>
      <ul ref={tableOfContents as RefObject<HTMLUListElement>} style={{ marginTop: "var(--space-4x)" }}>
        {headings
          .filter(({ depth }) => depth === 2)
          .map((h) => (
            <li className={`${styles.headerLink}${currentID === h.slug ? ` ${styles.active}` : ""}`}>
              <a href={`#${h.slug}`}>
                {h.text}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 12.25H7"
                    stroke="#375BD2"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.5 8.25L16.25 12L12.5 15.75"
                    stroke="#375BD2"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
      </ul>
    </>
  )
}

export default TableOfContents
