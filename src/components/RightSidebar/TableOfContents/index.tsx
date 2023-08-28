/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"

const TableOfContents: FunctionalComponent = () => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { $currentId } = useCurrentId()
  const tableOfContents = useRef<HTMLUListElement | null>(null)
  const [headings, setHeadings] = useState<MarkdownHeading[]>()

  useEffect(() => {
    const elements = document.querySelectorAll("article :where(h1, h2, h3, h4)")
    const newHeadings: MarkdownHeading[] = []
    elements.forEach((e) => {
      if (e.textContent) {
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
    <nav className={styles.toc}>
      <h2 className={styles.heading}>On this page</h2>
      <ul ref={tableOfContents}>
        {headings?.map((h) => (
          <li>
            <a
              href={`#${h.slug}`}
              className={`${styles.headerLink}${h.depth && h.depth > 2 ? ` ${styles[`depth-${h.depth}`]}` : ""}
              ${$currentId === h.slug ? ` ${styles.active}` : ""}`}
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
