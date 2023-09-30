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

  React.useEffect(() => {
    const height = navBarInfo.current?.height
    if (!height) return
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      const scroll = navBarInfo.current?.scrollDirection
      if (
        (scroll === "up" && observer.rootMargin !== rootMarginDown) ||
        (scroll === "down" && observer.rootMargin === rootMarginDown)
      ) {
        for (const entry of entries) {
          const { isIntersecting, target } = entry
          if (isIntersecting) {
            target.classList.add(styles.background)
          } else {
            target.classList.remove(styles.background)
          }
        }
      }
    }

    // Add background to currently sticky header
    const stickyHeaders = document.body.querySelectorAll("article > section > h2")
    let topUp = "0%"
    let bottomUp = "-94%"
    if (window?.innerHeight) {
      topUp = `-${height}px`
      bottomUp = `-${window.innerHeight - height}px`
    }
    const stickyHeaderObserverUp = new IntersectionObserver(observerCallback, {
      rootMargin: `${topUp} 0% ${bottomUp} 0%`,
    })

    const stickyHeaderObserverDown = new IntersectionObserver(observerCallback, {
      rootMargin: rootMarginDown,
    })

    stickyHeaders.forEach((h) => {
      stickyHeaderObserverUp.observe(h)
      stickyHeaderObserverDown.observe(h)
    })

    return () => {
      stickyHeaderObserverUp.disconnect()
      stickyHeaderObserverDown.disconnect()
    }
  }, [$navBarInfo.height])

  return null
}

export default StickyHeaderObserver
