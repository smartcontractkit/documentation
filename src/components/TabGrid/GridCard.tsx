import { Typography } from "@chainlink/blocks"
import styles from "./GridCard.module.css"

export interface GridItem {
  title: string
  description: string
  link: string
  badge?: string
}

export const GridCard = ({ title, description, link, badge }: GridItem) => {
  return (
    <a href={link} className={styles.card}>
      <div>
        <p className={styles.cardTitle}>{title}</p>
        <Typography variant="body-s" style={{ lineHeight: "24px" }}>
          {description}
        </Typography>
      </div>

      <div className={styles.cardFooter}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <img src="/assets/icons/upper-right-arrow.svg" alt="arrow" />
      </div>
    </a>
  )
}
