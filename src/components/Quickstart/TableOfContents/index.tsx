/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { currentIds } from "~/hooks/currentIds/idStore"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"

type ExtraHeaders = "SUMMARY"
const elementDepthMap: Record<ExtraHeaders, number> = {
  SUMMARY: 3,
}

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
  extraHeaders?: ExtraHeaders
}> = ({ initialHeadings, extraHeaders }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { $currentIds, setCurrentIds } = useCurrentIds()

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const query = `article :where(
      section > :where(h2, h3, h4)
      ${extraHeaders ? `, ${extraHeaders}` : ""}
      )
    `
    const elements = document.querySelectorAll(query)
    const newHeadings: MarkdownHeading[] = []

    // If there are no new headers in the DOM, return
    if (elements.length === headings.length) {
      return
    }

    elements.forEach((e) => {
      const depth = Number(e.nodeName.at(1)) || elementDepthMap[e.nodeName]
      const slug = e.id
      const text = e.textContent
      // Check for nextElementSibling, if there's no content
      // following the header, then don't add a heading
      const hasNext = e.nextElementSibling
      if (depth && slug && text && hasNext) {
        newHeadings.push({ depth, slug, text })
      }
    })
    setHeadings(newHeadings)
  }, [$shouldUpdateToc, extraHeaders])

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const intersectingElementMap: Record<string, boolean> = currentIds.get()
      for (const entry of entries) {
        const { isIntersecting, target } = entry
        intersectingElementMap[target.id] = isIntersecting
      }
      setCurrentIds(intersectingElementMap)
    }

    const elementObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-10% 0% -90%",
    })

    headings.forEach((h) => {
      const element = document.getElementById(h.slug)
      if (element) {
        elementObserver.observe(element)
      }
    })
    return () => elementObserver.disconnect()
  }, [$shouldUpdateToc, headings])

  return (
    <nav className={styles.toc}>
      <h2 className={styles.heading}>On this page</h2>
      <ul>
        {headings &&
          headings.map((h) => (
            <li key={h.slug}>
              <a
                href={`#${h.slug}`}
                className={`${styles.headerLink}${h.depth && h.depth > 2 ? ` ${styles[`depth-${h.depth}`]}` : ""}
                ${$currentIds[h.slug] ? ` ${styles.active}` : ""}`}
              >
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
    </nav>
  )
}

export default TableOfContents
