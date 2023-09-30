import React from "react"
import styles from "./stickyHeaderObserver.module.css"
import { useNavBar } from "../Header/useNavBar/useNavBar"
import { NavBarInfo } from "../Header/useNavBar/navBarStore"

const rootMarginDown = "0% 0% -100% 0%"

const StickyHeaderObserver: React.FC = () => {
  const { $navBarInfo } = useNavBar()

  // Using ref to access the most up to date value in observerCallback
  const navBarInfo = React.useRef<NavBarInfo>()
  navBarInfo.current = $navBarInfo

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const article = document.getElementById("article")
    const height = navBarInfo.current?.height
    if (!article || !height || !ref.current) {
      return
    }

    // Allows us to extend the bar to the gutter padding
    const gridMain = document.getElementById("grid-main")
    if (gridMain) {
      ref.current.style.width = `${gridMain.clientWidth}px`
      ref.current.style.transform = "translateX(calc(-1 * var(--gutter)))"
    } else {
      ref.current.style.width = `${article.clientWidth}px`
    }

    const articleObserverCallback: IntersectionObserverCallback = (entries, observer) => {
      if (!ref.current) return
      const scroll = navBarInfo.current?.scrollDirection
      if (
        (scroll === "up" && observer.rootMargin !== rootMarginDown) ||
        (scroll === "down" && observer.rootMargin === rootMarginDown)
      ) {
        const article = entries[0]
        ref.current.hidden = !article.isIntersecting
      }
    }

    const headerObserverCallback: IntersectionObserverCallback = (entries, observer) => {
      if (!ref.current) return
      const scroll = navBarInfo.current?.scrollDirection
      if (
        (scroll === "up" && observer.rootMargin !== rootMarginDown) ||
        (scroll === "down" && observer.rootMargin === rootMarginDown)
      ) {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ref.current.style.height = `${entry.target.clientHeight}px`
          }
        }
      }
    }

    let topUp = "0%"
    let bottomUp = "-94%"
    if (window?.innerHeight) {
      topUp = `-${height}px`
      bottomUp = `-${window.innerHeight - height - 2}px`
    }

    const articleObserverUp = new IntersectionObserver(articleObserverCallback, {
      rootMargin: `${topUp} 0% ${bottomUp} 0%`,
    })
    const articleObserverDown = new IntersectionObserver(articleObserverCallback, {
      rootMargin: rootMarginDown,
    })
    articleObserverUp.observe(article)
    articleObserverDown.observe(article)

    const headerObserverUp = new IntersectionObserver(headerObserverCallback, {
      rootMargin: `${topUp} 0% ${bottomUp} 0%`,
    })
    const headerObserverDown = new IntersectionObserver(headerObserverCallback, {
      rootMargin: rootMarginDown,
    })
    const stickyHeaders = document.body.querySelectorAll("article [data-sticky]")
    stickyHeaders.forEach((h) => {
      headerObserverUp.observe(h)
      headerObserverDown.observe(h)
    })

    return () => {
      articleObserverUp.disconnect()
      articleObserverDown.disconnect()
      headerObserverUp.disconnect()
      headerObserverDown.disconnect()
    }
  }, [$navBarInfo.height])

  React.useEffect(() => {
    const { height, scrollDirection } = $navBarInfo
    if (!height || !ref.current) {
      return
    }
    ref.current.style.top = `${scrollDirection === "up" ? height : 0}px`
  }, [$navBarInfo.scrollDirection, $navBarInfo.height])

  return <div ref={ref} className={styles.stickyBar} />
}

export default StickyHeaderObserver
