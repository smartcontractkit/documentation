import { forEachChild } from "typescript"

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".click-to-zoom-wrapper").forEach((element: HTMLPictureElement) => {
    element.addEventListener("click", () => {
      if (element.classList.contains("expanded")) return

      element.classList.add("expanded")
      // create wrapper for preview
      const wrapper = document.createElement("div")
      wrapper.id = "expanded-image-wrapper"

      // create picture node
      const picture = document.createElement("picture")
      picture.className = "expanded"

      Array.from(element.getElementsByTagName("source")).forEach((source: HTMLSourceElement) => {
        const zoomedSource = document.createElement("source")
        zoomedSource.type = source.type
        zoomedSource.srcset = source.srcset
        picture.appendChild(zoomedSource)
      })

      const img = document.createElement("img")
      img.src = element.getElementsByTagName("img")[0].src
      img.id = "expanded-image-preview"
      picture.appendChild(img)

      wrapper.appendChild(picture)

      // setup events to close the preview
      wrapper.onclick = () => {
        wrapper.remove()
        element.classList.remove("expanded")
      }
      document.onkeyup = (e) => {
        if (e.key === "Escape") {
          wrapper.remove()
          element.classList.remove("expanded")
        }
      }

      // add the wrapper to the DOM
      element.insertAdjacentElement("afterend", wrapper)
    })
  })
})
