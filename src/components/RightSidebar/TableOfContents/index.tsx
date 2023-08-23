/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useRef } from "preact/hooks"
import { useCurrentId } from "../../../hooks/currentId/useCurrentId"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"

const TableOfContents: FunctionalComponent<{
  headings: MarkdownHeading[]
}> = ({ headings }) => {
  const { $currentId, setCurrentId } = useCurrentId()
  const tableOfContents = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          return setCurrentId(entry.target.id)
        }
      }
    }
    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-5% 0px -90%",
    })
    const subSectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-10% 0px -80%",
    })
    const overview = document.getElementById("overview")
    if (overview) {
      sectionsObserver.observe(overview)
    }
    headings.forEach((h) => {
      const e = document.getElementById(h.slug)
      if (!e) return
      if (h.depth === 2) {
        sectionsObserver.observe(e)
      } else if (h.depth === 3) {
        subSectionsObserver.observe(e)
      }
    })
  }, [])

  return (
    <nav className={styles.toc}>
      <h2 className="heading" style={{ padding: 0 }}>
        On this page
      </h2>
      <ul ref={tableOfContents} style={{ marginTop: "var(--space-4x)" }}>
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
