/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { shouldUpdateToc } from "./tocStore.ts"
import { clsx } from "~/lib/clsx/clsx.ts"
import { useStore } from "@nanostores/preact"

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
  onUpdateActiveTitle?: (title: string) => void
}> = ({ initialHeadings, onUpdateActiveTitle }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const elements = document.querySelectorAll(
      [
        "article section > :where(h1, h2, h3, h4)",
        "article astro-anchored-accordion[data-toc-depth]",
        "article astro-anchored-accordion :where(h1, h2, h3, h4)",
      ].join(", ")
    )
    const newHeadings: MarkdownHeading[] = []

    elements.forEach((e) => {
      const el = e as HTMLElement
      const depth = Number(e.nodeName.at(1)) || Number(el.dataset?.tocDepth)
      const slug = e.id
      const text = el.dataset?.tocText || e.textContent
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
            if (onUpdateActiveTitle) {
              const tocText = (target as HTMLElement).dataset?.tocText
              if (tocText) {
                onUpdateActiveTitle(tocText)
              } else if (first?.textContent && ["H1", "H2"].includes(first.nodeName)) {
                onUpdateActiveTitle(first.id === "overview" ? "Overview" : first.textContent)
              }
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
