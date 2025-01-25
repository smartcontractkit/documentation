import { useRef, useState } from "react"
import "./TableSearchInput.css"
import { useClickOutside } from "~/hooks/useClickOutside"

interface TableSearchInputProps {
  search: string
  setSearch: (search: string) => void
}

function TableSearchInput({ search, setSearch }: TableSearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useClickOutside(searchRef, () => {
    if (!search) {
      setIsExpanded(false)
    }
  })

  return (
    <div className="tableSearchInput" onClick={() => setIsExpanded(true)} ref={searchRef}>
      <img src="/assets/icons/search.svg" alt="" />
      {isExpanded ? (
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      ) : null}
    </div>
  )
}

export default TableSearchInput
