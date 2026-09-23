import styles from "./styles.module.css"
import type { ChangelogItem } from "~/components/ChangelogSnippet/types.ts"
import { DesktopFilters } from "./DesktopFilters.tsx"
import { MobileFilters } from "./MobileFilters.tsx"
import { useState } from "react"
import { clsx } from "~/lib/clsx/clsx.ts"

export interface ChangelogFiltersProps {
  products: string[]
  networks: string[]
  types: string[]
  items: ChangelogItem[]
}

export const ChangelogFilters = ({ products, networks, types, items }: ChangelogFiltersProps) => {
  const [searchExpanded, setSearchExpanded] = useState(false)

  return (
    <div className={clsx(styles.wrapper, searchExpanded && styles.searchExpanded)}>
      <div className={styles.desktopFilters}>
        <DesktopFilters products={products} networks={networks} types={types} items={items} />
      </div>
      <div className={styles.mobileFilters}>
        <MobileFilters
          products={products}
          networks={networks}
          types={types}
          items={items}
          searchExpanded={searchExpanded}
          onSearchExpandedChange={setSearchExpanded}
        />
      </div>
    </div>
  )
}
