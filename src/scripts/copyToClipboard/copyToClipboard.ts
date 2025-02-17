import ClipboardJS from "clipboard"
import button from "@chainlink/design-system/button.module.css"
import styles from "./copyToClipboard.module.css"

let clipboard: ClipboardJS

// Function to initialize ClipboardJS globally for all `.copy-iconbutton` elements
function initializeClipboard() {
  // Destroy any existing ClipboardJS instances to avoid duplicates
  if (clipboard) {
    clipboard.destroy()
  }

  // Reinitialize ClipboardJS for all `.copy-iconbutton` elements
  clipboard = new ClipboardJS(".copy-iconbutton", {
    text: function (trigger) {
      // If the button is within a code block (e.g., Accordion), find the text dynamically
      const codeWrapper = trigger.closest(`.${styles.codeWrapper}`)
      if (codeWrapper) {
        return (codeWrapper.querySelector("pre code") as HTMLElement)?.innerText || ""
      }
      // Otherwise return the text directly from the `data-clipboard-text` attribute
      return trigger.getAttribute("data-clipboard-text") || ""
    },
  })

  clipboard.on("success", function (e) {
    const oldLabel = e.trigger.innerHTML
    e.trigger.innerHTML = `<img src="/assets/icons/checkCircleIconGrey.svg" />`
    window.setTimeout(function () {
      e.trigger.innerHTML = oldLabel
    }, 2000)
    e.clearSelection()
  })
}

// Initialize clipboard when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeClipboard()

  // Function to initialize copy buttons within code blocks dynamically
  function initializeCopyButtons() {
    document.querySelectorAll("pre").forEach((codeBlock) => {
      const parentElement = codeBlock.parentNode as Element | null

      if (parentElement && parentElement.classList.contains(styles.codeWrapper)) {
        return // Skip if already initialized
      }

      const copyButtonContainer = document.createElement("div")
      copyButtonContainer.className = styles.copyCodeButtonWrapper

      const copyButton = document.createElement("button")
      copyButton.className = button.secondary
      copyButton.classList.add("copy-iconbutton")
      copyButton.type = "button"
      copyButton.innerHTML = `<img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" style="width:16px; height: 16px">`
      copyButton.ariaLabel = "copy to clipboard"
      copyButtonContainer.appendChild(copyButton)

      const container = document.createElement("div")
      container.className = styles.codeWrapper

      const currentParent = codeBlock.parentNode
      const codeBlockClone = codeBlock.cloneNode(true)
      container.appendChild(copyButtonContainer)
      container.appendChild(codeBlockClone)
      currentParent?.replaceChild(container, codeBlock)
    })

    // Reinitialize ClipboardJS after setting up new buttons
    initializeClipboard()
  }

  // Initialize copy buttons on DOM load
  initializeCopyButtons()

  // Observer to monitor dynamic changes
  const observer = new MutationObserver(initializeCopyButtons)
  observer.observe(document.body, { childList: true, subtree: true })

  // Listen for Accordion toggling to reinitialize copy buttons
  document.querySelectorAll(".accordion-toggle").forEach((accordion) => {
    accordion.addEventListener("click", () => {
      initializeCopyButtons()
    })
  })
})
