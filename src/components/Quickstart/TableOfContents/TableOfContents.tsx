/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"
import { clsx } from "~/lib"

type HeaderWrapperClass = "header-wrapper-2" | "header-wrapper-3"
const wrapperDepthMap: Record<HeaderWrapperClass, number> = {
  "header-wrapper-2": 2,
  "header-wrapper-3": 3,
}

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
}> = ({ initialHeadings }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)
  const [currentIds, setCurrentIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const query = `article :where(
      section > :where(h2, h3, h4),
       .${Object.keys(wrapperDepthMap).join(", .")}
    )`
    const elements = document.querySelectorAll(query)
    const newHeadings: MarkdownHeading[] = []

    // If there are no new headers in the DOM, return
    if (elements.length === headings.length) {
      return
    }

    elements.forEach((e) => {
      const depth = Number(e.nodeName.at(1)) || wrapperDepthMap[e.className.split(" ")[0]]
      const slug = e.id
      const text = e.getAttribute("title") || e.textContent
      if (depth && slug && text) {
        newHeadings.push({ depth, slug, text })
      }
    })
    setHeadings(newHeadings)
  }, [$shouldUpdateToc])

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      setCurrentIds((currentIds) => {
        const newIds: Record<string, boolean> = { ...currentIds }
        for (const entry of entries) {
          const { isIntersecting, target } = entry
          const { id } = target
          newIds[id] = isIntersecting
        }
        return newIds
      })
    }

    const elementObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-15% 0% -85%",
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
    <nav className={styles.toc} data-sticky>
      <h2 className={styles.heading}>On this page</h2>
      <ul>
        {headings &&
          headings.map((h) => {
            const className = clsx(
              styles.headerLink,
              h.depth > 2 && styles[`depth-${h.depth}`],
              currentIds[h.slug] && styles.active
            )
            return (
              <li key={h.slug}>
                <a href={`#${h.slug}`} className={className}>
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
            )
          })}
      </ul>
    </nav>
  )
}

export default TableOfContents
