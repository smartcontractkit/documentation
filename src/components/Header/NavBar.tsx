import React, { useState } from "react"
import { NavBar as Nav } from "./Nav"
import { Search } from "./aiSearch/Search"
import { getNavigationProps } from "./getNavigationProps"
import { useNavBar } from "./useNavBar/useNavBar"
import styles from "./scroll.module.css"
import MegaMenu from "./Nav/ProductNavigation/Desktop/MegaMenu"

declare const Weglot: any

export const NavBar = ({ path, showSearch = true }: { path: string; showSearch?: boolean }) => {
  const navRef = React.useRef(null)
  const [showMegaMenu, setShowMegaMenu] = useState(false)

  const { setNavBarInfo } = useNavBar()

  const onHideChange = (hidden: boolean) => {
    if (navRef.current) {
      const height = (navRef.current as HTMLElement).clientHeight
      const elements = document.body.querySelectorAll("[data-sticky]")
      elements.forEach((e: HTMLElement) => {
        if (!e.classList.contains(styles.animateTop)) {
          e.classList.add(styles.animateTop)
        }
        e.style.top = `${hidden ? 0 : height}px`
      })
      setNavBarInfo({ hidden, height })
    }
  }

  React.useEffect(() => {
    if (
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("documentation-private-git-")
    ) {
      const script = document.createElement("script")
      script.src = "https://cdn.weglot.com/weglot.min.js"
      script.async = true
      script.onload = () => {
        Weglot.initialize({
          api_key: "wg_bc56a95905bfa8990f449554339e82be8",
          switchers: [
            {
              button_style: {
                full_name: false,
                with_name: true,
                is_dropdown: true,
                with_flags: false,
              },
              location: {
                target: "#weglot",
                sibling: null,
              },
            },
          ],
        })
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <span ref={navRef}>
      <Nav
        {...getNavigationProps(path)}
        path={path}
        searchTrigger={showSearch ? <Search /> : undefined}
        onHideChange={onHideChange}
        isMegamenuOpen={showMegaMenu}
        showMegaMenu={() => setShowMegaMenu(true)}
        exitMegamenu={() => setShowMegaMenu(false)}
      />
      {showMegaMenu && <MegaMenu cancel={() => setShowMegaMenu(false)} />}
    </span>
  )
}
