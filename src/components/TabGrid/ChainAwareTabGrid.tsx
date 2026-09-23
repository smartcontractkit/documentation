/** @jsxImportSource react */
import { useEffect, useState } from "react"
import { useStore } from "@nanostores/react"
import { selectedChainType } from "~/stores/chainType.js"
import { DEFAULT_CHAIN_TYPE } from "~/config/chainTypes.js"
import styles from "./TabGrid.module.css"
import { GridItem } from "./GridCard.tsx"
import { ItemGrid } from "./ItemGrid.tsx"
import { Typography } from "@chainlink/blocks"

export interface Tab {
  name: string
  links: GridItem[]
}

interface ChainAwareTabGridProps {
  tabs: Tab[]
  header: string
  columns?: 1 | 2 | 3 | 4
}

export const ChainAwareTabGrid = ({ tabs, header, columns = 3 }: ChainAwareTabGridProps) => {
  // The server always renders with DEFAULT_CHAIN_TYPE (no access to localStorage). Reading
  // the already-corrected client store on the very first render mismatches that server HTML
  // whenever the resolved tab has a different card count than the default tab, which React
  // can't patch during hydration and gives up on, leaving the stale server markup on screen.
  // Gating on `mounted` keeps the first (hydration) render identical to the server, then swaps
  // in the real chain-specific tab via a plain post-mount effect, which is a normal re-render.
  const [mounted, setMounted] = useState(false)
  const activeChainType = useStore(selectedChainType)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedChainType = mounted ? activeChainType : DEFAULT_CHAIN_TYPE
  const activeTab = tabs.find((tab) => tab.name.toLowerCase() === resolvedChainType.toLowerCase())

  const displayTab = activeTab || tabs[0]

  if (!displayTab) {
    return null
  }

  return (
    <div className={styles.tabGridWrapper}>
      <header className={styles.gridHeader}>
        <Typography
          variant="h2"
          style={{
            fontSize: "32px",
          }}
        >
          {header}
        </Typography>
      </header>

      <div className={styles.gridContent}>
        <ItemGrid links={displayTab.links} columns={columns} />
      </div>
    </div>
  )
}
