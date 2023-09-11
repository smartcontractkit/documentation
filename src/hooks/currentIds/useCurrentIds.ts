import { currentIds } from "./idStore"
import { useStore } from "@nanostores/preact"

export const useCurrentIds = () => ({
  $currentIds: useStore(currentIds),
  setCurrentIds: (ids: Record<string, boolean>) => currentIds.set(ids),
})
