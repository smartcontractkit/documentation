/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact"
import { useRef, useState } from "preact/hooks"
import { MarkdownHeading } from "astro"
import styles from "./stickyHeader.module.css"
import TableOfContents from "~/components/TableOfContents/TableOfContents"
import { clsx } from "~/lib"

const StickyHeader: FunctionalComponent<{
  initialHeadings: MarkdownHeading[]
}> = ({ initialHeadings }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [activeTitle, setActiveTitle] = useState<string>("")
  const expandButtonRef = useRef(null)
  const hidden = !activeTitle

  const buttonClassName = clsx("secondary", expanded && styles.active)

  return (
    <div
      className={styles.container}
      aria-hidden={hidden}
      style={
        expanded && !hidden
          ? undefined
          : {
              height: "fit-content",
            }
      }
      onClickCapture={(e) => setExpanded(e.target === expandButtonRef.current ? !expanded : false)}
    >
      <div hidden={!expanded || hidden} className={styles.tocWrapper}>
        <TableOfContents initialHeadings={initialHeadings} onUpdateActiveTitle={(title) => setActiveTitle(title)} />
      </div>
      <div className={styles.heading}>
        <button ref={expandButtonRef} className={buttonClassName}>
          On this page
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path d="M8.70711 12.9498C8.31658 13.3403 7.68342 13.3403 7.29289 12.9498C6.90237 12.5592 6.90237 11.9261 7.29289 11.5355L11.5355 7.2929C11.9261 6.90238 12.5592 6.90238 12.9497 7.2929C13.3403 7.68342 13.3403 8.31659 12.9497 8.70711L8.70711 12.9498Z" />
            <path d="M12.9497 8.70711C12.5592 9.09764 11.9261 9.09764 11.5355 8.70711L7.29289 4.46447C6.90237 4.07395 6.90237 3.44078 7.29289 3.05026C7.68342 2.65974 8.31658 2.65974 8.70711 3.05026L12.9497 7.2929C13.3403 7.68342 13.3403 8.31659 12.9497 8.70711Z" />
          </svg>
        </button>
        <p>{activeTitle}</p>
      </div>
    </div>
  )
}

export default StickyHeader
