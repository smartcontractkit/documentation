import ClipboardJS from "clipboard"
import button from "@chainlink/design-system/button.module.css"
import styles from "./copyToClipboard.module.css"

const clipboard = new ClipboardJS(".copy-iconbutton")

clipboard.on("success", function (e) {
  const oldLabel = e.trigger.innerHTML
  e.trigger.innerHTML = `<img src="/assets/icons/checkCircleIconGrey.svg" />`
  window.setTimeout(function () {
    e.trigger.innerHTML = oldLabel
  }, 2000)
  e.clearSelection()
})

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre").forEach((codeBlock) => {
    codeBlock.classList.add(styles.copyCodeButtonPlaceholderHidden)

    const copyButtonContainer = document.createElement("div")
    copyButtonContainer.className = styles.copyCodeButtonWrapper

    const copyButton = document.createElement("button")
    copyButton.className = button.secondary
    copyButton.classList.add(...["copy-iconbutton"])
    copyButton.type = "button"
    const s = (codeBlock as HTMLElement).innerText
    copyButton.setAttribute("data-clipboard-text", s)
    copyButton.innerHTML = `<img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" style="width:16px; height: 16px">`
    copyButton.ariaLabel = "copy to clipoard"
    copyButtonContainer.appendChild(copyButton)

    const container = document.createElement("div")
    container.className = styles.codeWrapper

    const currentParent = codeBlock.parentNode
    const codeBlockClone = codeBlock.cloneNode(true)
    container.appendChild(copyButtonContainer)
    container.appendChild(codeBlockClone)
    currentParent?.replaceChild(container, codeBlock)
  })
})
