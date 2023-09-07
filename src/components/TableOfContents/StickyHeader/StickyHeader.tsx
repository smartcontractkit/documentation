/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./stickyHeader.module.css"
import { useStickyHeader } from "~/hooks/stickyHeader/useStickyHeader"
import MobileToc from "../MobileToc/MobileToc"

const StickyHeader: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
}> = ({ initialHeadings }) => {
  const { $stickyHeader } = useStickyHeader()
  const [expanded, setExpanded] = useState<boolean>(false)

  // Stop scrolling on underlying body when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : ""
  }, [expanded])

  const hidden = !$stickyHeader

  return (
    <div className={styles.container} aria-hidden={hidden}>
      <div className={styles.heading}>
        <button className={`secondary${expanded ? ` active` : ""}`} onClick={() => setExpanded(!expanded)}>
          On this page
        </button>
        {/* NOTE: Defaulting to "Overview" so there's something showing while collapsing */}
        <p>{$stickyHeader || "Overview"}</p>
      </div>
      <div hidden={!expanded} className={styles.heightWrapper}>
        <MobileToc initialHeadings={initialHeadings} onNavigate={() => setExpanded(false)} />
      </div>
    </div>
  )
}

export default StickyHeader
