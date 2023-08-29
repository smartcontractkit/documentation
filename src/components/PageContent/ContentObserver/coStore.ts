import { atom } from "nanostores"

let updateCounter = 0

export const shouldUpdateCo = atom<number | undefined>()
export function updateContentObserver() {
  shouldUpdateCo.set(++updateCounter)
}
