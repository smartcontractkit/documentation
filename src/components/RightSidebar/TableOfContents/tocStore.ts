// store/users.ts
import { atom } from "nanostores"

export const shouldUpdateToc = atom<string | undefined>()
export function updateTableOfContents() {
  shouldUpdateToc.set(new Date().toUTCString())

  // Handle anchors after TOC loads
  if (window.location.hash) {
    const id = decodeURI(window.location.hash.split("#")[1])
    const scrollTo = document.getElementById(id)
    scrollTo?.scrollIntoView()
  }
}
