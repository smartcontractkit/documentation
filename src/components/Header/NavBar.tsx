import React from "react"
import { NavBar as Nav } from "@chainlink/components"
import { Search } from "./AlgoSearch/Search"
import { useScrollDirection } from "@chainlink/components/src/NavBar/useScrollDirection"
import { useNavBar } from "./useNavBar/useNavBar"
import { ScrollDirection } from "./useNavBar/navBarStore"

export const NavBar = ({ path, showSearch = true }: { path: string; showSearch?: boolean }) => {
  const scrollDirection = useScrollDirection() as ScrollDirection
  const navRef = React.useRef(null)

  const { setNavBarInfo, $navBarInfo } = useNavBar()

  React.useEffect(() => {
    if (navRef.current) {
      const height = (navRef.current as HTMLElement).clientHeight
      setNavBarInfo({ scrollDirection, height })
    }
  }, [scrollDirection])
  return (
    <span ref={navRef}>
      <Nav app="Docs" path={path} searchTrigger={showSearch ? <Search /> : undefined} />
    </span>
  )
}
