/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./tableOfContents.module.css"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore.ts"
import { clsx } from "~/lib/clsx/clsx.ts"

type HeaderWrapperClass = "header-wrapper-2" | "header-wrapper-3" | "header-wrapper-4"
const wrapperDepthMap: Record<HeaderWrapperClass, number> = {
  "header-wrapper-2": 2,
  "header-wrapper-3": 3,
  "header-wrapper-4": 4,
}

const TableOfContents: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
}> = ({ initialHeadings }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Only get top-level headers, don't get nested component headers
    const query = `article :where(
      section > :where(h2, h3, h4),
       .${Object.keys(wrapperDepthMap).join(", .")}
    )`
    const elements = document.querySelectorAll(query)
    const newHeadings: MarkdownHeading[] = []

    elements.forEach((e) => {
      const depth = Number(e.nodeName.at(1)) || wrapperDepthMap[e.className.split(" ")[0]]
      const slug = e.id
      const text = e.getAttribute("title") || e.textContent
      if (depth && slug && text) {
        newHeadings.push({ depth, slug, text })
      }
    })
    setHeadings(newHeadings)
  }, [$shouldUpdateToc])

  useEffect(() => {
    // Scroll-based approach: find the last heading that has scrolled past the threshold
    const threshold = window.innerHeight * 0.2

    const handleScroll = () => {
      let activeSlug: string | null = null

      for (const h of headings) {
        const element = document.getElementById(h.slug)
        if (element) {
          const top = element.getBoundingClientRect().top
          if (top <= threshold) {
            activeSlug = h.slug
          }
        }
      }

      setActiveIds(activeSlug ? new Set([activeSlug]) : new Set())
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  return (
    <nav className={styles.toc} data-sticky>
      <h2 className={styles.heading}>On this page</h2>
      <ul>
        {headings &&
          headings.map((h) => {
            const className = clsx(
              styles.headerLink,
              h.depth > 2 && styles[`depth-${h.depth}`],
              activeIds.has(h.slug) && styles.active
            )
            return (
              <li key={h.slug}>
                <a href={`#${h.slug}`} className={className}>
                  {h.text}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 12.25H7"
                      stroke="#0847F7"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5 8.25L16.25 12L12.5 15.75"
                      stroke="#0847F7"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              </li>
            )
          })}
      </ul>
    </nav>
  )
}

export default TableOfContents
