import { useStore } from "@nanostores/preact"
import { stickyHeader } from "./stickyHeaderStore"

export const useStickyHeader = () => ({
  $stickyHeader: useStore(stickyHeader),
  setStickyHeader: (header: string) => stickyHeader.set(header),
})
