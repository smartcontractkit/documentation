import { useState } from "react"
import "./TableSearchInput.css"

function TableSearchInput() {
  const [search, setSearch] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="tableSearchInput" onClick={() => setIsExpanded(true)}>
      <img src="/assets/icons/search.svg" alt="" />
      {isExpanded ? <input type="search" placeholder="Lane / Network / Token" /> : null}
    </div>
  )
}

export default TableSearchInput
