import React from "react"
import { AlgoveraSearch } from "@algoveraai/search"
import styles from "./searchModal.module.css"

export const SearchModal = ({ showModal, onClose }: { showModal: boolean; onClose?: () => void }) => {
  // Prohibit scrolling on body when modal is visible
  React.useEffect(() => {
    if (showModal) {
      document.body.classList.add(styles.hideOverflow)
    } else {
      document.body.classList.remove(styles.hideOverflow)
    }
  }, [showModal])

  return (
    <div
      style={{ display: showModal ? "flex" : "none" }}
      className={styles.modal}
      onClick={() => {
        if (onClose) {
          onClose()
        }
      }}
    >
      <div
        className={styles.searchWrapper}
        onClick={(e) => e.stopPropagation()} // Stops us from closing modal when clicks are to AlgoveraSearch
      >
        <AlgoveraSearch
          apiKey="e32fe1586cebb937a9287bf5561edfb62907f6074fc43b9201a305b20e881a5d"
          headerLogo={
            <img
              alt="Chainlink logo"
              title="Chainlink logo"
              src="/chainlink-docs.svg"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                verticalAlign: "middle",
              }}
            />
          }
          showSearch={showModal}
          placeholder="Search Chainlink & Resources"
          assistantID="4bcde2e970f34c2fa80a7e14615e09e2"
          endpoint="wss://streamingprod.algoverai.link/chat_chainlink"
          basicSearchEndpoint="https://api.algovera.ai/chainlink/search"
        />
      </div>
    </div>
  )
}
