/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedChainType } from "~/stores/chainType.js"
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
  const activeChainType = useStore(selectedChainType)

  const activeTab = tabs.find((tab) => tab.name.toLowerCase() === activeChainType.toLowerCase())

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
