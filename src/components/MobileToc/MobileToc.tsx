/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./mobileToc.module.css"
import { useCurrentIds } from "~/hooks/currentIds/useCurrentIds"
import { useStore } from "@nanostores/preact"
import { shouldUpdateToc } from "./tocStore"
import { ContentObserver } from "~/components/PageContent/ContentObserver/ContentObserver"
import { useStickyHeader } from "~/hooks/stickyHeader/useStickyHeader"

const MobileToc: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
}> = ({ initialHeadings }) => {
  const $shouldUpdateToc = useStore(shouldUpdateToc)
  const { $currentIds } = useCurrentIds()
  const { $stickyHeader } = useStickyHeader()

  const [headings, setHeadings] = useState<MarkdownHeading[]>(initialHeadings)
  const [expanded, setExpanded] = useState<boolean>(false)

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

  // Stop scrolling on underlying body when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : ""
  }, [expanded])

  const hidden = !$stickyHeader

  return (
    <>
      <ContentObserver headings={headings} />
      <nav className={styles.toc} aria-hidden={hidden}>
        <div className={styles.heading}>
          <button className={`secondary${expanded ? ` active` : ""}`} onClick={() => setExpanded(!expanded)}>
            On this page
          </button>
          {/* NOTE: Defaulting to "Overview" so there's something showing while collapsing */}
          <p className={styles.stickyHeader}>{$stickyHeader || "Overview"}</p>
        </div>
        <div hidden={!expanded} className={styles.heightWrapper}>
          {/* TODO: Move headings / ContentObserver logic / HTML to their own component, consolidate with TableOfContents */}
          <ul>
            {headings?.map((h) => (
              <li onClick={() => setExpanded(false)}>
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
        </div>
      </nav>
    </>
  )
}

export default MobileToc
