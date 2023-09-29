import React from "react"
import { NavBar as Nav } from "@chainlink/components"
import { Search } from "./AlgoSearch/Search"
import { useScrollDirection } from "@chainlink/components/src/NavBar/useScrollDirection"
import styles from "./scroll.module.css"

type ScrollDirection = "up" | "down"

export const NavBar = ({ path, showSearch = true }: { path: string; showSearch?: boolean }) => {
  const scrollDirection = useScrollDirection() as ScrollDirection
  const navRef = React.useRef(null)

  React.useEffect(() => {
    if (navRef.current) {
      const height = (navRef.current as HTMLElement).clientHeight
      const elements = document.body.querySelectorAll("[data-sticky]")
      elements.forEach((e: HTMLElement) => {
        if (!e.classList.contains(styles.animateTop)) {
          e.classList.add(styles.animateTop)
        }
        e.style.top = `${scrollDirection === "up" ? height : 0}px`
      })
    }
  }, [scrollDirection])
  return (
    <span ref={navRef}>
      <Nav app="Docs" path={path} searchTrigger={showSearch ? <Search /> : undefined} />
    </span>
  )
}
