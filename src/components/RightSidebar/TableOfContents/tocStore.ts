import { atom } from "nanostores"

let updateCounter = 0

export const shouldUpdateToc = atom<number | undefined>()
export const updateTableOfContents = () => shouldUpdateToc.set(++updateCounter)
