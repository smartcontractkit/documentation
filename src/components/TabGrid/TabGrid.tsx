import styles from "./TabGrid.module.css"
import { GridItem } from "./GridCard.tsx"
import { ItemGrid } from "./ItemGrid.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger, Typography } from "@chainlink/blocks"

export interface Tab {
  name: string
  links: GridItem[]
}

interface TabGridProps {
  tabs: Tab[]
  header: string
  columns?: 1 | 2 | 3 | 4
}

export const TabGrid = ({ tabs, header, columns = 3 }: TabGridProps) => {
  return (
    <Tabs defaultValue={tabs[0].name}>
      <header className={styles.gridHeader}>
        <Typography variant="h2">{header}</Typography>
        <TabsList className={styles.tabsList}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name} className={styles.tabsTrigger}>
              <h3 className={styles.tabTitle}>{tab.name}</h3>
            </TabsTrigger>
          ))}
        </TabsList>
      </header>

      {tabs.map((tab) => (
        <TabsContent key={tab.name} value={tab.name}>
          <div className={styles.gridContent}>
            <ItemGrid links={tab.links} columns={columns} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
