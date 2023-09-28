/** @jsxImportSource preact */
import { AlgoveraSearch } from "@algoveraai/search"
// import { GlobalHotKeys } from "react-hotkeys"
// import { getIconUrl } from "../../utils"
import styles from "./search.module.css"
import { SearchButton } from "./SearchButton"
import { useEffect, useState } from "preact/hooks"

// const hotKeysMap = {
//   toggleModal: "command+k",
// }

export const Search = () => {
  const [showModal, setShowModal] = useState(false)

  // const hotkeyHandlers = {
  //   toggleModal: () => setShowModal((s) => !s),
  // }

  // Prohibit scrolling on body when modal is visible
  useEffect(() => {
    if (showModal) {
      document.body.classList.add(styles.hideOverflow)
    } else {
      document.body.classList.remove(styles.hideOverflow)
    }
  }, [showModal])

  return (
    // <GlobalHotKeys keyMap={hotKeysMap} handlers={hotkeyHandlers}>
    <>
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
            // headerLogo={
            //   <img
            //     alt="Chainlink logo"
            //     title="Chainlink logo"
            //     src={getIconUrl("logo-chainlink")}
            //     style={{
            //       display: "inline-block",
            //       maxWidth: "100%",
            //       verticalAlign: "middle",
            //     }}
            //   />
            // }
            showSearch={showModal}
            placeholder="Search Chainlink & Resources"
            apiKey="e32fe1586cebb937a9287bf5561edfb62907f6074fc43b9201a305b20e881a5d"
            assistantID="4bcde2e970f34c2fa80a7e14615e09e2"
            endpoint="wss://streamingprod.algoverai.link/chat_chainlink"
            basicSearchEndpoint="https://api.algovera.ai/chainlink/search"
          />
        </div>
      </div>
    </>
    // </GlobalHotKeys>
  )
}
