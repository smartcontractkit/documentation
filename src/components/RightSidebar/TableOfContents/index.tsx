/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"
import { ContentObserver } from "~/components/PageContent/ContentObserver/ContentObserver"

// TODO: Create initial state of headings(?)
// This would reduce pop-in
// Either that or use a suspense handler
const TableOfContents: FunctionalComponent = () => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { $currentIds } = useCurrentIds()
  const tableOfContents = useRef<HTMLUListElement | null>(null)
  const [headings, setHeadings] = useState<MarkdownHeading[]>()

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const elements = document.querySelectorAll("article section > :where(h1, h2, h3, h4)")
    const newHeadings: MarkdownHeading[] = []
    elements.forEach((e) => {
      // Check for nextElementSibling, if there's no content
      // following the header (i.e. empty overview)
      // don't add a heading
      if (e.textContent && e.nextElementSibling) {
        const depth = Number(e.nodeName.at(1))
        const slug = e.id
        const text = depth > 1 ? e.textContent : "Overview"
        newHeadings.push({
          depth,
          slug,
          text,
        })
      }
    })
    setHeadings(newHeadings)
  }, [$shouldUpdateToc])

  return (
    <nav className={styles.toc}>
      <ContentObserver headings={headings ?? []} />
      <p className={styles.heading}>On this page</p>
      <ul ref={tableOfContents}>
        {headings?.map((h) => (
          <li>
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
