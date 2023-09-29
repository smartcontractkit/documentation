import { NavBar as Nav } from "@chainlink/components"
import { Search } from "./AlgoSearch/Search"

export const NavBar = ({ path, showSearch = true }: { path: string; showSearch?: boolean }) => {
  return <Nav app="Docs" path={path} searchTrigger={showSearch ? <Search /> : undefined} />
}
