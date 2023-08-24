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
      rootMargin: "-25% 0% -75%",
    })

    const wrapElement = (element: HTMLElement) => {
      const wrapper = document.createElement("section")
      const elements: Element[] = []
      elements.push(element)
      let next = element.nextElementSibling
      while (next && !next.id) {
        elements.push(next)
        next = next.nextElementSibling
      }
      wrapper.id = element.id
      element.parentNode?.insertBefore(wrapper, element)
      elements.forEach((e) => wrapper.appendChild(e))
      return wrapper
    }

    const setupHeading = (id: string) => {
      const e = document.getElementById(id)
      if (e) {
        const wrapper = wrapElement(e)
        sectionsObserver.observe(wrapper)
      }
    }

    setupHeading("overview") // Set up for heading id created in PageContent
    headings.forEach((h) => setupHeading(h.slug))
  }, [])

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
