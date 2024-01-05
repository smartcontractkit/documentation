import React from "react"
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
        onClick={(e) => e.stopPropagation()} // Stops us from closing modal when clicks are to search module
      >
        <script
          data-button-bg-color="rgba(55, 91, 210, 0.2)"
          data-button-hide="true"
          data-button-text-color="rgba(55, 91, 210)"
          data-button-text-shadow="0"
          data-font-family="Circular,Tahoma,sans-serif"
          data-kapa-branding-hide="true"
          data-modal-ask-ai-input-placeholder="Search across Chainlink resources"
          // data-modal-disclaimer="Subject to Chainlink's [terms of use](https://chain.link/search-terms)."
          data-modal-footer="Subject to Chainlink's [terms of use](https://chain.link/search-terms). &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Protected by reCAPTCHA."
          data-modal-header-bg-color="rgb(255, 255, 255)"
          data-modal-header-border-bottom="2px solid rgba(55, 91, 210, 0.2)"
          data-modal-header-logo-hide-on-mobile="true"
          data-modal-image-height="auto"
          data-modal-image-width="auto"
          data-modal-open-by-default="false"
          data-modal-override-open-class="searchModal"
          data-modal-search-input-placeholder="Search across Chainlink resources"
          data-modal-title-color="#375bd2"
          data-modal-title-font-weight="500"
          data-modal-title=" "
          data-modal-x-offset="0rem"
          data-project-color="#375bd2"
          data-project-logo="https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-logo.svg"
          data-project-name="Chainlink"
          data-search-include-source-names='["Documentation", "Developer Blogs", "GitHub Issues", "GitHub Pull Requests (Open)", "StackOverflow"]'
          data-search-input-show-icon="false"
          data-search-mode-default="true"
          data-search-mode-enabled="true"
          data-search-result-badge-bg-color="#DFE7FB"
          data-search-result-badge-text-color="#1A2B6B"
          data-search-result-hover-bg-color="#F6F7FD"
          data-search-result-secondary-text-color="#1A2B6B"
          data-switch-bg-color="#fcfcfd"
          data-switch-border-radius="2rem"
          data-switch-border="1px solid #ecedef"
          data-switch-color="#375bd2"
          data-switch-label-font-padding-x="1.5rem"
          data-switch-label-font-padding-y="0.5rem"
          data-switch-label-font-size="12px"
          data-switch-label-font-weight="600"
          data-switch-show-icons="true"
          data-website-id="f272f2db-b88b-4c32-bdca-aa7227414035"
          src="https://widget.kapa.ai/kapa-widget.bundle.js"
        ></script>
      </div>
    </div>
  )
}
