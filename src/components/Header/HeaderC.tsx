import { NavBar } from "@chainlink/components"
import { Search as AlgoSearch } from "../AlgoSearch/Search"

export const Header = () => {
  return <NavBar app="Docs" path={"/ccip"} searchTrigger={<AlgoSearch />} />
}
