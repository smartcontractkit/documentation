/** @jsxImportSource react */
import React from "react"
import { GlobalHotKeys } from "react-hotkeys"
import { AlgoveraSearch } from "@algoveraai/search"
import styles from "./search.module.css"
import { SearchButton } from "./SearchButton"
const hotKeysMap = {
  toggleModal: "command+k",
}

export const Search = () => {
  const [showModal, setShowModal] = React.useState(false)

  const hotkeyHandlers = {
    toggleModal: () => setShowModal((s) => !s),
  }

  // Prohibit scrolling on body when modal is visible
  // useEffect(() => {
  //   if (showModal) {
  //     document.body.classList.add(styles.hideOverflow)
  //   } else {
  //     document.body.classList.remove(styles.hideOverflow)
  //   }
  // }, [showModal])

  return (
    <GlobalHotKeys keyMap={hotKeysMap} handlers={hotkeyHandlers}>
      <SearchButton onClickHandler={() => setShowModal(true)} />
      <div
        style={{ display: showModal ? "flex" : "none" }}
        className={styles.modal}
        onClick={() => setShowModal(false)}
      >
        <div
          className={styles.searchWrapper}
          onClick={(e) => e.stopPropagation()} // Stops us from hiding modal when clicks are to AlgoveraSearch
        >
          <AlgoveraSearch
            assistantID="4bcde2e970f34c2fa80a7e14615e09e2"
            endpoint="wss://chainlink-assistant.nevermined.app/chat_chainlink"
            basicSearchEndpoint="https://chainlink-assistant.nevermined.app/search"
            headerLogo={<img src="https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-logo.svg"alt="Chainlink Logo" />}
            disclaimer={<span>Subject to Chainlink's <a href="https://chain.link/search-terms">terms of use</a>.</span>}
            placeholder="Search across Chainlink resources"
          />
        </div>
      </div>
    </GlobalHotKeys>
  )
}
