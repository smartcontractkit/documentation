import React from "react"
import { GlobalHotKeys } from "react-hotkeys"
import { SearchButton } from "./SearchButton"
import { SearchModal } from "./SearchModal"

const hotKeysMap = {
  toggleModal: "command+k",
}

export const Search = () => {
  const [showModal, setShowModal] = React.useState(false)

  const hotkeyHandlers = {
    toggleModal: () => setShowModal((s) => !s),
  }

  return (
    <GlobalHotKeys keyMap={hotKeysMap} handlers={hotkeyHandlers}>
      <SearchButton onClickHandler={() => setShowModal(true)} />
      <SearchModal showModal={showModal} onClose={() => setShowModal(false)} />
    </GlobalHotKeys>
  )
}
