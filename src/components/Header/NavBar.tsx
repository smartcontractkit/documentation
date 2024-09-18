import React, { useState } from "react"
import { NavBar as Nav } from "./Nav"
import { Search } from "./aiSearch/Search"
import { getNavigationProps } from "./getNavigationProps"
import { useNavBar } from "./useNavBar/useNavBar"
import styles from "./scroll.module.css"

export const NavBar = ({ path, showSearch = true }: { path: string; showSearch?: boolean }) => {
  const navRef = React.useRef(null)

  const { setNavBarInfo } = useNavBar()

  const onHideChange = (hidden: boolean) => {
    if (navRef.current) {
      const innerDocNavHeight = 56
      const height = (navRef.current as HTMLElement).clientHeight + innerDocNavHeight
      const elements = document.body.querySelectorAll("[data-sticky]")
      elements.forEach((e: HTMLElement) => {
        if (!e.classList.contains(styles.animateTop)) {
          e.classList.add(styles.animateTop)
        }
        e.style.top = `${hidden ? innerDocNavHeight : height}px`
      })
      setNavBarInfo({ hidden, height })
    }
  }

  return (
    <span ref={navRef}>
      <Nav
        {...getNavigationProps()}
        path={path}
        searchTrigger={showSearch ? <Search /> : undefined}
        onHideChange={onHideChange}
      />
    </span>
  )
}
