import { NavBar as Nav } from "@chainlink/components"
import { Search } from "./AlgoSearch/Search"

export const NavBar = ({ path }: { path: string }) => {
  return <Nav app="Docs" path={path} searchTrigger={<Search />} />
}
