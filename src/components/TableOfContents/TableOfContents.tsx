/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { shouldUpdateToc } from "./tocStore"
import { clsx } from "~/lib"
import { useStore } from "@nanostores/preact"

type HeaderWrapperClass = "header-wrapper-3"
const wrapperDepthMap: Record<HeaderWrapperClass, number> = {
  "header-wrapper-3": 3,
}

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
  onUpdateActiveTitle?: (title: string) => void
}> = ({ initialHeadings, onUpdateActiveTitle }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const query = `article :where(
      section > :where(h1, h2, h3, h4),
       .${Object.keys(wrapperDepthMap).join(", .")}
    )`
    const elements = document.querySelectorAll(query)
    const newHeadings: MarkdownHeading[] = []

    elements.forEach((e) => {
      const depth = Number(e.nodeName.at(1)) || wrapperDepthMap[e.className.split(" ")[0]]
      const slug = e.id
      const text = e.getAttribute("title") || e.textContent
      if (depth && slug && text) {
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
      setActiveIds((activeIds) => {
        const newIds = new Set(activeIds)
        for (const entry of entries) {
          const { isIntersecting, target } = entry
          const { id, firstElementChild: first } = target
          if (isIntersecting) {
            newIds.add(id)
            if (onUpdateActiveTitle && first?.textContent && ["H1", "H2"].includes(first.nodeName)) {
              onUpdateActiveTitle(first.id === "overview" ? "Overview" : first.textContent)
            }
          } else {
            newIds.delete(id)
          }
        }
        if (onUpdateActiveTitle && newIds.size === 0) {
          onUpdateActiveTitle("")
        }
        return newIds
      })
    }

    const sectionsObserver = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0% -80%",
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
            activeIds.has(h.slug) && styles.active
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
