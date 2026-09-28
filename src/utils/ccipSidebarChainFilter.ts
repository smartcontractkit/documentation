import type { ChainType } from "~/config/types.js"

/**
 * Single source of truth for CCIP sidebar chain-family visibility.
 *
 * Mirrors the desktop sidebar rule (LeftSidebar / RecursiveSidebar `shouldShowSidebarItem`): a node
 * is visible when it has no chainTypes (universal / legacy content) or when its chainTypes include
 * the active chain family. Kept as a pure function so the mobile picker and the desktop sidebar
 * filter identically and can never drift.
 */
export function isChainVisible(chainTypes: ChainType[] | undefined, currentChain: string | undefined): boolean {
  if (!currentChain) return true
  if (!chainTypes || chainTypes.length === 0) return true
  return chainTypes.includes(currentChain as ChainType)
}
