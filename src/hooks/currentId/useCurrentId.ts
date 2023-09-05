import { currentId } from "./idStore"
import { useStore } from "@nanostores/preact"

export const useCurrentId = () => ({
  $currentId: useStore(currentId),
  setCurrentId: (id: string) => currentId.set(id),
})
