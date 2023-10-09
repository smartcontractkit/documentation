import React from "react"
import styles from "./stickyHeaderObserver.module.css"
import { useNavBar } from "../Header/useNavBar/useNavBar"
import { NavBarInfo } from "../Header/useNavBar/navBarStore"

const StickyHeaderObserver: React.FC = () => {
  const { $navBarInfo } = useNavBar()

  // Using ref to access the most up to date value in observerCallback
  const navBarRef = React.useRef<NavBarInfo>()
  navBarRef.current = $navBarInfo
  const thisRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const article = document.getElementById("article")
    const height = navBarRef.current?.height
    if (!article || !height || !thisRef.current) {
      return
    }

    // Allows us to extend the bar to the gutter padding
    const gridMain = document.getElementById("grid-main")
    if (gridMain) {
      thisRef.current.style.width = `${gridMain.clientWidth}px`
      thisRef.current.style.transform = "translateX(calc(-1 * var(--gutter)))"
    } else {
      thisRef.current.style.width = `${article.clientWidth}px`
    }

    let topShow = "0%"
    let bottomShow = "-94%"
    if (window?.innerHeight) {
      topShow = `-${height}px`
      bottomShow = `-${window.innerHeight - height - 2}px`
    }

    const rootMarginHidden = "0% 0% -100% 0%"
    const rootMarginShow = `${topShow} 0% ${bottomShow} 0%`

    const articleObserverCallback: IntersectionObserverCallback = (entries, observer) => {
      if (!thisRef.current || !navBarRef.current) {
        return
      }
      const hidden = navBarRef.current.hidden
      if ((hidden && observer.rootMargin === rootMarginHidden) || (!hidden && observer.rootMargin === rootMarginShow)) {
        const article = entries[0]
        thisRef.current.hidden = !article.isIntersecting
      }
    }

    const headerObserverCallback: IntersectionObserverCallback = (entries, observer) => {
      if (!thisRef.current || !navBarRef.current) {
        return
      }
      const hidden = navBarRef.current.hidden
      if ((hidden && observer.rootMargin === rootMarginHidden) || (!hidden && observer.rootMargin === rootMarginShow)) {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            thisRef.current.style.height = `${entry.target.clientHeight}px`
          }
        }
      }
    }

    const articleObserverShow = new IntersectionObserver(articleObserverCallback, {
      rootMargin: rootMarginShow,
    })
    const articleObserverHidden = new IntersectionObserver(articleObserverCallback, {
      rootMargin: rootMarginHidden,
    })
    articleObserverShow.observe(article)
    articleObserverHidden.observe(article)

    const headerObserverShow = new IntersectionObserver(headerObserverCallback, {
      rootMargin: rootMarginShow,
    })
    const headerObserverHidden = new IntersectionObserver(headerObserverCallback, {
      rootMargin: rootMarginHidden,
    })
    const stickyHeaders = document.body.querySelectorAll("article [data-sticky]")
    stickyHeaders.forEach((h) => {
      headerObserverShow.observe(h)
      headerObserverHidden.observe(h)
    })

    return () => {
      articleObserverShow.disconnect()
      articleObserverHidden.disconnect()
      headerObserverShow.disconnect()
      headerObserverHidden.disconnect()
    }
  }, [$navBarInfo.height])

  return <div ref={thisRef} className={styles.stickyBar} data-sticky />
}

export default StickyHeaderObserver
