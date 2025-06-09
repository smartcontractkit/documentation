document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".click-to-zoom").forEach((element: HTMLImageElement) => {
    element.addEventListener("click", () => {
      if (element.classList.contains("expanded")) return

      // Check if an expanded view already exists (shouldn't happen often, but safety first)
      const existingWrapper = document.getElementById("expanded-image-wrapper")
      if (existingWrapper) {
        existingWrapper.remove()
      }

      element.classList.add("expanded")
      // create wrapper for preview
      const wrapper = document.createElement("div")
      wrapper.id = "expanded-image-wrapper"

      // create image node
      const img = document.createElement("img")
      img.src = element.src
      img.alt = element.alt
      img.className = "expanded"
      img.id = "expanded-image-preview"
      wrapper.appendChild(img)

      const captionText = element.dataset.caption
      let captionElement: HTMLParagraphElement | null = null
      if (captionText) {
        captionElement = document.createElement("p")
        captionElement.className = "expanded-image-caption"
        captionElement.textContent = captionText
        wrapper.appendChild(captionElement)
      }

      // setup events to close the preview
      const closePreview = () => {
        // Remove caption first if it exists
        if (captionElement && wrapper.contains(captionElement)) {
          wrapper.removeChild(captionElement)
        }
        wrapper.remove()
        element.classList.remove("expanded")
        document.removeEventListener("keyup", handleKeyUp) // Clean up key listener
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closePreview()
        }
      }

      wrapper.onclick = closePreview
      document.addEventListener("keyup", handleKeyUp) // Add key listener

      // add the wrapper to the DOM
      document.body.appendChild(wrapper)
      wrapper.style.display = "flex"
    })
  })
})
