import React from "react"
import styles from "./searchModal.module.css"

export const SearchModal = () => {
  const scriptContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://widget.kapa.ai/kapa-widget.bundle.js"
    script.async = true

    script.setAttribute("data-button-bg-color", "rgba(55, 91, 210, 0.2)")
    script.setAttribute("data-button-hide", "true")
    script.setAttribute("data-button-text-color", "rgba(55, 91, 210)")
    script.setAttribute("data-button-text-shadow", "0")
    script.setAttribute("data-font-family", "Circular,Tahoma,sans-serif")
    script.setAttribute("data-kapa-branding-hide", "true")
    script.setAttribute("data-modal-ask-ai-input-placeholder", "Search across Chainlink resources")
    // script.setAttribute("data-modal-disclaimer", "Subject to Chainlink's [terms of use](https://chain.link/search-terms).");
    script.setAttribute(
      "data-modal-footer",
      "Subject to Chainlink's [terms of use](https://chain.link/search-terms). Protected by reCAPTCHA."
    )
    script.setAttribute("data-modal-header-bg-color", "rgb(255, 255, 255)")
    script.setAttribute("data-modal-header-border-bottom", "2px solid rgba(55, 91, 210, 0.2)")
    script.setAttribute("data-modal-header-logo-hide-on-mobile", "true")
    script.setAttribute("data-modal-image-height", "auto")
    script.setAttribute("data-modal-image-width", "auto")
    script.setAttribute("data-modal-open-by-default", "false")
    script.setAttribute("data-modal-override-open-class", "search-widget-trigger")
    script.setAttribute("data-modal-search-input-placeholder", "Search across Chainlink resources")
    script.setAttribute("data-modal-title-color", "#375bd2")
    script.setAttribute("data-modal-title-font-weight", "500")
    script.setAttribute("data-modal-title", " ")
    script.setAttribute("data-modal-x-offset", "0rem")
    script.setAttribute("data-project-color", "#375bd2")
    script.setAttribute(
      "data-project-logo",
      "https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-logo.svg"
    )
    script.setAttribute("data-project-name", "Chainlink")
    script.setAttribute(
      "data-search-include-source-names",
      '["Documentation", "Developer Blogs", "GitHub Issues", "GitHub Pull Requests (Open)", "StackOverflow"]'
    )
    script.setAttribute("data-search-input-show-icon", "false")
    script.setAttribute("data-search-mode-default", "true")
    script.setAttribute("data-search-mode-enabled", "true")
    script.setAttribute("data-modal-open-on-command-k", "true")
    script.setAttribute("data-search-result-badge-bg-color", "#DFE7FB")
    script.setAttribute("data-search-result-badge-text-color", "#1A2B6B")
    script.setAttribute("data-search-result-hover-bg-color", "#F6F7FD")
    script.setAttribute("data-search-result-secondary-text-color", "#1A2B6B")
    script.setAttribute("data-switch-bg-color", "#fcfcfd")
    script.setAttribute("data-switch-border-radius", "2rem")
    script.setAttribute("data-switch-border", "1px solid #ecedef")
    script.setAttribute("data-switch-color", "#375bd2")
    script.setAttribute("data-switch-label-font-padding-x", "1.5rem")
    script.setAttribute("data-switch-label-font-padding-y", "0.5rem")
    script.setAttribute("data-switch-label-font-size", "12px")
    script.setAttribute("data-switch-label-font-weight", "600")
    script.setAttribute("data-switch-show-icons", "true")
    script.setAttribute("data-website-id", "f272f2db-b88b-4c32-bdca-aa7227414035")

    scriptContainerRef.current !== null && scriptContainerRef.current.appendChild(script)

    return () => {
      if (scriptContainerRef.current) {
        scriptContainerRef.current.removeChild(script)
      }
    }
  }, [])

  return <div ref={scriptContainerRef} className={styles.searchWrapper} />

}
