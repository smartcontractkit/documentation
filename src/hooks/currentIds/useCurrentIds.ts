import { useStore } from "@nanostores/preact"
import { currentIds } from "./idStore"

export const useCurrentIds = () => ({
  $currentIds: useStore(currentIds),
  setCurrentIds: (ids: Record<string, boolean>) => currentIds.set(ids),
})
