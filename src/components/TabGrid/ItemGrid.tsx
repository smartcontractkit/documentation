import { GridCard, GridItem } from "./GridCard.tsx"
import styles from "./TabGrid.module.css"

interface ItemGridProps {
  links: GridItem[]
  columns?: 1 | 2 | 3 | 4
}

export const ItemGrid = ({ links, columns = 3 }: ItemGridProps) => {
  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} data-columns={columns}>
      {links.map((link, index) => (
        <GridCard key={`${link.title}-${index}`} {...link} />
      ))}
    </div>
  )
}
