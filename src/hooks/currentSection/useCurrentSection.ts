import { currentElement } from "./elementStore"
import { useStore } from "@nanostores/preact"

export const useCurrentSection = () => ({
  $currentSection: useStore(currentElement),
  setCurrentSection: (section: Element) => currentElement.set(section),
})
