/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useRef } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useCurrentId } from "~/hooks/currentId/useCurrentId"

const TableOfContents: FunctionalComponent<{
  headings: MarkdownHeading[]
}> = ({ headings }) => {
  const { $currentId } = useCurrentId()
  const tableOfContents = useRef<HTMLUListElement | null>(null)

  return (
    <nav className={styles.toc}>
      <h2 className={styles.heading}>On this page</h2>
      <ul ref={tableOfContents}>
        {headings
          .filter(({ depth }) => depth > 1)
          .map((h) => (
            <li
              className={`${styles.headerLink}${h.depth > 2 ? ` ${styles[`depth-${h.depth}`]}` : ""}
              ${$currentId === h.slug ? ` ${styles.active}` : ""}`}
            >
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
    </nav>
  )
}

export default TableOfContents
