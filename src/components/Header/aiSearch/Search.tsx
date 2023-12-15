import React from "react"
import { GlobalHotKeys } from "react-hotkeys"
import { SearchButton } from "./SearchButton"
import { SearchModal } from "./SearchModal"

const hotKeysMap = {
  cmdK: "command+k",
  ctrlK: "ctrl+k",
}

export const Search = ({ variant = "default" }: { variant?: "default" | "bottomBar" }) => {
  const [showModal, setShowModal] = React.useState(false)

  const hotkeyHandlers = {
    cmdK: () => setShowModal((s) => !s),
    ctrlK: () => setShowModal((s) => !s),
  }

  return (
    <GlobalHotKeys keyMap={hotKeysMap} handlers={hotkeyHandlers}>
      <SearchButton variant={variant} onClickHandler={() => setShowModal(true)} />
      <SearchModal showModal={showModal} onClose={() => setShowModal(false)} />
    </GlobalHotKeys>
  )
}
