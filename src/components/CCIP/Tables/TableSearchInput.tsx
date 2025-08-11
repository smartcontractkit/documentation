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
    <div className="tableSearchInput" onClick={() => setIsExpanded(true)} ref={searchRef}>
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
      ) : (
        <button
          type="button"
          aria-label="Open search"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onClick={() => setIsExpanded(true)}
        />
      )}
    </div>
  )
}

export default TableSearchInput
