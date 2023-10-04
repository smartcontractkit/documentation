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
          headerLogo={
            <img
              title="Chainlink Logo"
              src="https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-logo.svg"
              alt="Chainlink Logo"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                verticalAlign: "middle",
              }}
            />
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          disclaimer={
            <span>
              Subject to Chainlink's <a href="https://chain.link/search-terms">terms of use</a>.
            </span>
          }
          showSearch={showModal}
          placeholder="Search across Chainlink resources"
          assistantID="4bcde2e970f34c2fa80a7e14615e09e2"
          endpoint="wss://chainlink-assistant.nevermined.app/chat_chainlink"
          basicSearchEndpoint="https://chainlink-assistant.nevermined.app/search"
          onClose={onClose}
          apiKey=""
        />
      </div>
    </div>
  )
}
