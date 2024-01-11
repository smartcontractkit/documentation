import { SearchButton } from "./SearchButton"
import { SearchModal } from "./SearchModal"

export const Search = ({ variant = "default" }: { variant?: "default" | "bottomBar" }) => {
  return (
    <>
      <SearchButton variant={variant} />
      <SearchModal />
    </>
  )
}
