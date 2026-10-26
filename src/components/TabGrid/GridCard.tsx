import { Typography } from "@chainlink/blocks"
import styles from "./GridCard.module.css"

export interface GridItem {
  title: string
  description: string
  link: string
  badge?: string
  personas?: string[]
}
export const GridCard = ({ title, description, link, badge, personas }: GridItem) => {
  const getPersonaClass = (persona: string) => {
    const p = persona.toLowerCase()

    if (p === "application developers") return styles.personaAppDevs
    if (p === "asset issuers") return styles.personaAssetIssuers
    if (p === "advanced") return styles.personaAdvanced

    return ""
  }

  return (
    <a href={link} className={styles.card}>
      <div>
        <p className={styles.cardTitle}>{title}</p>

        <Typography variant="body-s" style={{ lineHeight: "24px" }}>
          {description}
        </Typography>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerBadges}>
          {badge && <span className={styles.badge}>{badge}</span>}

          {personas?.slice(0, 2).map((persona) => (
            <span key={persona} className={`${styles.personaPill} ${getPersonaClass(persona)}`}>
              {persona}
            </span>
          ))}
        </div>

        <img src="/assets/icons/upper-right-arrow.svg" alt="" aria-hidden="true" />
      </div>
    </a>
  )
}
