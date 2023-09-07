/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"
import { ContentObserver } from "~/components/PageContent/ContentObserver/ContentObserver"

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
  onNavigate?: () => void
}> = ({ initialHeadings, onNavigate }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { $currentIds } = useCurrentIds()

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const elements = document.querySelectorAll("article section > :where(h1, h2, h3, h4)")
    const newHeadings: MarkdownHeading[] = []
    // If there are no new headers in the DOM, return
    if (elements.length === headings.length) {
      return
    }
    elements.forEach((e) => {
      // Check for nextElementSibling, if there's no content
      // following the header (i.e. empty overview)
      // don't add a heading
      if (e.textContent && e.nextElementSibling) {
        newHeadings.push({
          depth: Number(e.nodeName.at(1)),
          slug: e.id,
          text: e.textContent,
        })
      }
    })
    setHeadings(newHeadings)
  }, [$shouldUpdateToc])

  return (
    <nav className={styles.container}>
      <ContentObserver headings={headings} shouldUpdate={$shouldUpdateToc} />
      <ul>
        {headings.map((h) => (
          <li onClick={onNavigate}>
            <a
              href={`#${h.slug}`}
              className={`${styles.headerLink}${h.depth && h.depth > 2 ? ` ${styles[`depth-${h.depth}`]}` : ""}
              ${$currentIds[h.slug] ? ` ${styles.active}` : ""}`}
            >
              {h.depth > 1 ? h.text : "Overview"}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
