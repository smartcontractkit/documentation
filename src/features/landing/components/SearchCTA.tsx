import React, { useState, useCallback } from "react"
import "./Search.css"

import { SearchModal } from "~/components/Header/Search/SearchModal"

export function SearchCTA() {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return (
    <>
      <button type="button" onClick={onOpen} className="search-cta-input">
        <img src="/assets/search.svg" />

        <span style={{ fontSize: "1rem" }}>Search Chainlink Documentation...</span>
      </button>

      <SearchModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
