import { useEffect, useState } from "preact/hooks"
import { useCurrentId } from "../../hooks/currentId/useCurrentId"
import styles from "./quickstartBar.module.css"

export const QuickstartBar = () => {
  const { setCurrentId } = useCurrentId()
  const [hidden, setHidden] = useState<boolean>(true)
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.target.id === "overview") {
            setHidden(true)
          } else if (hidden) {
            setHidden(false)
          }
          return setCurrentId(entry.target.id)
        }
      }
    }
    const observerOptions: IntersectionObserverInit = {
      // Negative top margin accounts for `scroll-margin`.
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      // top | right+left | bottom
      rootMargin: `-10% 0px -90%`,
    }
    const sectionsObserver = new IntersectionObserver(observerCallback, observerOptions)
    document.querySelectorAll("article > section, #overview").forEach((h) => sectionsObserver.observe(h))
  }, [])

  return <div className={styles.bar} disabled={hidden}></div>
}
