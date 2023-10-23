/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { shouldUpdateToc } from "./tocStore"
import { clsx } from "~/lib"
import { useStore } from "@nanostores/preact"
import { useStickyHeader } from "~/hooks/stickyHeader/useStickyHeader"

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
  updateSticky?: boolean
}> = ({ initialHeadings, updateSticky }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { setStickyHeader } = useStickyHeader()

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)
  const [currentIds, setCurrentIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const elements = document.querySelectorAll("article section > :where(h1, h2, h3, h4)")
    const newHeadings: MarkdownHeading[] = []

    // If there are no new headers in the DOM, return
    if (elements.length === headings.length) {
      return
    }

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

    const observerCallbackSticky: IntersectionObserverCallback = (entries) => {
      setCurrentIds((currentIds) => {
        let stickyHeaderSet = false
        const newIds: Record<string, boolean> = { ...currentIds }
        for (const entry of entries) {
          const { isIntersecting, target } = entry
          const { id, firstElementChild: first } = target
          newIds[id] = isIntersecting
          if (!stickyHeaderSet && isIntersecting && first?.textContent && ["H1", "H2"].includes(first.nodeName)) {
            stickyHeaderSet = true
            setStickyHeader(first.id === "overview" ? "Overview" : first.textContent)
          }
        }
        if (Object.values(newIds).every((v) => !v)) {
          setStickyHeader("")
        }
        return newIds
      })
    }

    const sectionsObserver = new IntersectionObserver(updateSticky ? observerCallbackSticky : observerCallback, {
      rootMargin: "-15% 0% -85%",
    })

    headings.forEach((h) => {
      const section = document.getElementById(h.slug)
      if (section) {
        sectionsObserver.observe(section)
      }
    })
    return () => sectionsObserver.disconnect()
  }, [headings])

  return (
    <nav className={styles.container}>
      <ul>
        {headings.map((h) => {
          const className = clsx(
            styles.headerLink,
            h.depth > 2 && styles[`depth-${h.depth}`],
            currentIds[h.slug] && styles.active
          )
          return (
            <li key={h.slug}>
              <a href={`#${h.slug}`} className={className}>
                {h.depth > 1 ? h.text : "Overview"}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TableOfContents
