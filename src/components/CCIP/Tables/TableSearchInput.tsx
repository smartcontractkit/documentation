import { useRef, useState } from "react"
import "./TableSearchInput.css"
import { useClickOutside } from "~/hooks/useClickOutside.tsx"

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
    <div
      className="tableSearchInput"
      onClick={() => !isExpanded && setIsExpanded(true)}
      ref={searchRef}
      role={!isExpanded ? "button" : undefined}
      aria-label={!isExpanded ? "Open search" : undefined}
      tabIndex={!isExpanded ? 0 : -1}
      onKeyDown={
        !isExpanded
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setIsExpanded(true)
              }
            }
          : undefined
      }
    >
      <img src="/assets/icons/search.svg" alt="Search icon" />
      {isExpanded ? (
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          aria-label="Search table"
        />
      ) : null}
    </div>
  )
}

export default TableSearchInput
