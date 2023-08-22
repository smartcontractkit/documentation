// store/users.ts
// TODO: Do we need stores?
import { atom } from "nanostores"

export const shouldUpdateId = atom<string | undefined>()
export function updateId() {
  shouldUpdateId.set(new Date().toUTCString())
  if (window.location.hash) {
    const id = decodeURI(window.location.hash.split("#")[1])
    const scrollTo = document.getElementById(id)
    scrollTo?.scrollIntoView()
  }
}
