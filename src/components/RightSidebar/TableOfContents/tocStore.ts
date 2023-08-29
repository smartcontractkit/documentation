// store/users.ts
import { atom } from "nanostores"

let updateCounter = 0

export const shouldUpdateToc = atom<number | undefined>()
export function updateTableOfContents() {
  shouldUpdateToc.set(++updateCounter)

  // Handle anchors after TOC loads
  if (window.location.hash) {
    const id = decodeURI(window.location.hash.split("#")[1])
    const scrollTo = document.getElementById(id)
    scrollTo?.scrollIntoView()
  }
}
