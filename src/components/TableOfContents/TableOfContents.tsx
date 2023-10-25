/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"
import { ContentObserver } from "~/components/PageContent/ContentObserver"

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
}> = ({ initialHeadings }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { $currentIds } = useCurrentIds()

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const elements = document.querySelectorAll("article section > :where(h1, h2, h3, h4)")
    const newHeadings: MarkdownHeading[] = []

    elements.forEach((e) => {
      const depth = Number(e.nodeName.at(1))
      const slug = e.id
      const text = e.textContent
      if (text) {
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
    <nav className={styles.container}>
      <ContentObserver headings={headings} shouldUpdate={$shouldUpdateToc} />
      <ul>
        {headings.map((h) => (
          <li key={h.slug}>
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
