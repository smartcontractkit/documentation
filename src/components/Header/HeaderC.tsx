/** @jsxImportSource react */
import { NavBar } from "@chainlink/components"
import React from "react"
import { Search as AlgoSearch } from "../AlgoSearch/Search"

export const Header = () => {
  return <NavBar app="Docs" path={"/ccip"} searchTrigger={<AlgoSearch />} />
}
